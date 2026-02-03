import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    escrowId: string;
  }>;
}

/**
 * GET /api/escrows/[escrowId]
 * Get escrow by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { escrowId } = await context.params;
    
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
    const result = await convexClient.action(api.botIdentity.actions.verifyApiKey, {
      plainApiKey: apiKey,
    });
    const botId = result.botId;
    if (!botId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }
    
    // Get escrow
    const escrow = await convexClient.query(api.escrow.queries.getEscrow, {
      escrowId: escrowId as any,
    });
    
    if (!escrow) {
      return NextResponse.json(
        { error: "Escrow not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      escrowId: escrow._id,
      promiseId: escrow.promiseId,
      consumerId: escrow.consumerId,
      providerId: escrow.providerId,
      state: escrow.state,
      lockedAmount: escrow.lockedAmount,
      lockedCurrency: escrow.lockedCurrency,
      stakeLockAmount: escrow.stakeLockAmount,
      executionProof: escrow.executionProof,
      failureReason: escrow.failureReason,
      disputeReason: escrow.disputeReason,
      createdAt: escrow.createdAt,
      updatedAt: escrow.updatedAt,
      completedAt: escrow.completedAt,
      closedAt: escrow.closedAt,
    }, { status: 200 });
  } catch (error) {
    console.error("Get escrow error:", error);
    const message = error instanceof Error ? error.message : "Failed to get escrow";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
