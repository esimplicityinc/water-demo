import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    escrowId: string;
  }>;
}

/**
 * POST /api/escrows/[escrowId]/complete
 * Complete escrow execution with proof (provider only)
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { escrowId } = await context.params;
    const body = await request.json();
    const { proof } = body;
    
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
    const providerId = verifyResult.botId;
    if (!providerId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Complete execution
    const result = await convexClient.mutation(api.escrow.mutations.completeExecution, {
      escrowId: escrowId as any,
      providerId: providerId as any,
      executionProof: proof || "proof-default",
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to complete execution" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Complete execution error:", error);
    const message = error instanceof Error ? error.message : "Failed to complete execution";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
