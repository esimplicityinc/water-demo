import { NextRequest, NextResponse } from "next/server";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * Bot context attached to authenticated requests
 */
export interface BotContext {
  /** Unique identifier for the bot */
  botId: string;
}

/**
 * In-memory rate limiting store
 * Tracks failed attempts per IP address
 * Note: In production, use Redis or similar distributed cache
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX_ATTEMPTS = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if the request is rate limited
 * @param identifier - IP address or other identifier
 * @returns true if rate limited
 */
function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    return false;
  }

  // Reset if window has passed
  if (now > entry.resetAt) {
    rateLimitStore.delete(identifier);
    return false;
  }

  return entry.count >= RATE_LIMIT_MAX_ATTEMPTS;
}

/**
 * Increment failed attempt counter
 * @param identifier - IP address or other identifier
 */
function incrementRateLimit(identifier: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Create new entry or reset expired one
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
  } else {
    entry.count++;
  }
}

/**
 * Clear rate limit entry (called on successful auth)
 * @param identifier - IP address or other identifier
 */
function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Extract Bearer token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The token or null if invalid format
 */
function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  const token = parts[1];
  if (!token || token.length === 0) {
    return null;
  }

  // Validate token format (should start with sk_)
  if (!token.startsWith("sk_")) {
    return null;
  }

  return token;
}

/**
 * Get client identifier for rate limiting
 * Uses X-Forwarded-For header or falls back to IP
 * @param request - NextRequest
 * @returns Identifier string
 */
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip ?? "unknown";
}

/**
 * Verify API key by calling Convex action
 * @param token - The API key token
 * @returns BotContext if valid, null if invalid
 */
async function verifyApiKey(token: string): Promise<BotContext | null> {
  try {
    const result = await fetchAction(api.botIdentity.actions.verifyApiKey, {
      plainApiKey: token,
    });

    if (!result.botId) {
      return null;
    }

    return {
      botId: result.botId,
    };
  } catch (error) {
    console.error("Error verifying API key:", error);
    return null;
  }
}

/**
 * Extended NextRequest with bot context
 */
export interface AuthenticatedRequest extends NextRequest {
  botContext: BotContext;
}

/**
 * Type guard to check if request is authenticated
 */
export function isAuthenticatedRequest(
  request: NextRequest,
): request is AuthenticatedRequest {
  return "botContext" in request;
}

/**
 * Higher-order function that wraps API route handlers with authentication
 *
 * @example
 * ```typescript
 * // app/api/bot/send/route.ts
 * import { withAuth } from "@/src/bot-identity/infrastructure/middleware/withAuth";
 *
 * export const POST = withAuth(async (req) => {
 *   // req.botContext is available here
 *   const { botId } = req.botContext;
 *   // ... handle request
 * });
 * ```
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse> | NextResponse,
): (req: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    const clientId = getClientIdentifier(request);

    // Check rate limiting first
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
          },
        },
      );
    }

    // Extract Bearer token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      incrementRateLimit(clientId);
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    // Verify the API key with Convex
    const botContext = await verifyApiKey(token);

    if (!botContext) {
      incrementRateLimit(clientId);
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Clear rate limit on successful auth
    clearRateLimit(clientId);

    // Attach bot context to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.botContext = botContext;

    // Call the handler
    return handler(authenticatedRequest);
  };
}

/**
 * Middleware function for Next.js middleware.ts
 * Can be used in app/middleware.ts for route-level protection
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { authMiddleware } from "@/src/bot-identity/infrastructure/middleware/withAuth";
 *
 * export default authMiddleware;
 * ```
 */
export async function authMiddleware(
  request: NextRequest,
): Promise<NextResponse> {
  // Only apply to API routes that require auth
  // Skip auth for public routes
  const publicPaths = ["/api/health", "/api/public"];
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Only apply to bot API routes
  if (!request.nextUrl.pathname.startsWith("/api/bot/")) {
    return NextResponse.next();
  }

  const clientId = getClientIdentifier(request);

  // Check rate limiting
  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
        },
      },
    );
  }

  // Extract Bearer token
  const authHeader = request.headers.get("authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    incrementRateLimit(clientId);
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  // Verify the API key
  const botContext = await verifyApiKey(token);

  if (!botContext) {
    incrementRateLimit(clientId);
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  // Clear rate limit on success
  clearRateLimit(clientId);

  // Add bot context to headers for downstream handlers
  const response = NextResponse.next();
  response.headers.set("x-bot-id", botContext.botId);

  return response;
}

export default withAuth;
