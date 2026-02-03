import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    escrowId: string;
  }>;
}

/**
 * POST /api/escrows/[escrowId]/release
 * Release escrow to provider
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { escrowId } = await context.params;
    
    const result = await convexClient.mutation(api.escrow.mutations.releaseEscrow, {
      escrowId: escrowId as any,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to release escrow" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Release escrow error:", error);
    const message = error instanceof Error ? error.message : "Failed to release escrow";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
