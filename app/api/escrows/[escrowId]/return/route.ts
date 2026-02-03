import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    escrowId: string;
  }>;
}

/**
 * POST /api/escrows/[escrowId]/return
 * Return escrow to consumer
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { escrowId } = await context.params;
    const body = await request.json();
    const { reason } = body;
    
    const result = await convexClient.mutation(api.escrow.mutations.returnEscrow, {
      escrowId: escrowId as any,
      reason: reason || "Execution failed",
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to return escrow" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Return escrow error:", error);
    const message = error instanceof Error ? error.message : "Failed to return escrow";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
