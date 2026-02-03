import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    escrowId: string;
  }>;
}

/**
 * POST /api/escrows/[escrowId]/dispute
 * Raise a dispute on an escrow (consumer only)
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { escrowId } = await context.params;
    const body = await request.json();
    const { reason } = body;
    
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
    const consumerId = verifyResult.botId;
    if (!consumerId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Raise dispute
    const result = await convexClient.mutation(api.escrow.mutations.raiseDispute, {
      escrowId: escrowId as any,
      consumerId: consumerId as any,
      reason: reason || "Dispute raised",
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to raise dispute" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Raise dispute error:", error);
    const message = error instanceof Error ? error.message : "Failed to raise dispute";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
