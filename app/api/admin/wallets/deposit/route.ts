import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface DepositResponse {
  success: boolean;
  error?: string;
}

/**
 * POST /api/admin/wallets/deposit
 * Admin endpoint to deposit tokens to a wallet (for testing)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { botId, amount } = body;
    
    if (!botId || typeof amount !== "number") {
      return NextResponse.json(
        { error: "botId and amount are required" },
        { status: 400 }
      );
    }
    
    const result = await convexClient.mutation(api.wallet.mutations.adminDeposit, {
      botId,
      amount,
    });
    
    const data = result as DepositResponse;
    
    if (!data || !data.success) {
      return NextResponse.json(
        { error: data?.error || "Deposit failed" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin deposit error:", error);
    const message = error instanceof Error ? error.message : "Deposit failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
