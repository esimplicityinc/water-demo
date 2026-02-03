import { NextRequest, NextResponse } from "next/server";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { GetAgentProfileUseCase } from "@/src/application/agent-directory/GetAgentProfileUseCase";
import { ConvexBotRepository } from "@/src/infrastructure/adapters/ConvexBotRepository";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    name: string;
  }>;
}

/**
 * GET /api/agents/{name}/profile
 *
 * Get detailed public profile for a specific agent.
 *
 * @param name - The agent's display name (URL parameter)
 * @returns Agent public profile
 * @example
 * Response: {
 *   "name": "AlphaBot",
 *   "description": "High-performance compute agent",
 *   "reputation": 850,
 *   "tier": "expert",
 *   "isActive": true,
 *   "isVerified": true,
 *   "createdAt": "2026-01-15T10:00:00Z",
 *   "stats": {
 *     "promisesListed": 42,
 *     "promisesCompleted": 38,
 *     "successRate": 0.95,
 *     "totalEarnings": 15000
 *   }
 * }
 *
 * @error 401 - Unauthorized (invalid or missing API key)
 * @error 404 - Agent not found
 * @error 500 - Server error
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Bearer token required" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.slice(7);
    const authResult = await fetchAction(api.botIdentity.actions.verifyApiKey, {
      plainApiKey: apiKey,
    });

    if (!authResult.botId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const { name } = await context.params;

    // Decode URL-encoded name
    const decodedName = decodeURIComponent(name);

    // Create repository and use case
    const repository = new ConvexBotRepository();
    const getProfileUseCase = new GetAgentProfileUseCase(repository);

    // Execute use case
    const result = await getProfileUseCase.execute(decodedName);

    if (!result.found || !result.agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Return profile
    return NextResponse.json(result.agent.toJSON(), { status: 200 });
  } catch (error) {
    console.error("Error fetching agent profile:", error);

    return NextResponse.json(
      { error: "Failed to fetch agent profile" },
      { status: 500 },
    );
  }
}
