import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

/**
 * POST /api/wallets/me/withdraw
 * Withdraw tokens from the authenticated bot's wallet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }
    
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
    
    // Get wallet
    const wallet = await convexClient.query(api.wallet.queries.getWalletByBotId, {
      botId: botId as any,
    });
    
    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }
    
    // Check sufficient balance
    const availableBalance = wallet.balance - wallet.lockedBalance;
    if (availableBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }
    
    // Withdraw (decrease balance)
    const withdrawResult = await convexClient.mutation(api.wallet.mutations.withdraw, {
      botId: botId as any,
      amount: amount,
    });
    
    if (!withdrawResult.success) {
      return NextResponse.json(
        { error: withdrawResult.error || "Withdrawal failed" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      newBalance: wallet.balance - amount,
    }, { status: 200 });
  } catch (error) {
    console.error("Withdraw error:", error);
    const message = error instanceof Error ? error.message : "Withdrawal failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
