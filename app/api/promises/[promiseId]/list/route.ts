import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    promiseId: string;
  }>;
}

/**
 * POST /api/promises/[promiseId]/list
 * List a promise on the marketplace
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { promiseId } = await context.params;
    
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Bearer token required" },
        { status: 401 }
      );
    }
    
    const apiKey = authHeader.slice(7);
    
    // Verify API key
    const verifyResult = await convexClient.action(api.botIdentity.actions.verifyApiKey, {
      plainApiKey: apiKey,
    });
    const botId = verifyResult.botId;
    if (!botId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // List the promise
    const result = await convexClient.mutation(api.promiseMarket.mutations.listPromise, {
      promiseId: promiseId as any,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to list promise" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("List promise error:", error);
    const message = error instanceof Error ? error.message : "Failed to list promise";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
