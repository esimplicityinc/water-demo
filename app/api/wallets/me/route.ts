import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface BotResponse {
  _id: string;
  displayName: string;
  email?: string;
  verificationStatus: string;
  reputationScore: number;
  createdAt: number;
}

/**
 * GET /api/wallets/me
 * Get current bot's wallet
 */
export async function GET(request: NextRequest) {
  try {
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

    // Get bot details
    const bot = await convexClient.query(api.botIdentity.queries.getBotById, {
      botId: botId as any,
    }) as BotResponse | null;

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
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
    
    return NextResponse.json({
      walletId: wallet._id,
      botId: wallet.botId,
      balance: wallet.balance,
      lockedBalance: wallet.lockedBalance,
      availableBalance: wallet.balance - wallet.lockedBalance,
      createdAt: wallet.createdAt,
    }, { status: 200 });
  } catch (error) {
    console.error("Get wallet error:", error);
    const message = error instanceof Error ? error.message : "Failed to get wallet";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
