import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

/**
 * POST /api/wallets/me/deposit
 * Deposit tokens to own wallet (for testing)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

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

    // This is a simplified deposit for testing
    // For now, we'll just return success since adminDeposit handles the actual deposit

    return NextResponse.json({ success: true, amount, botId }, { status: 200 });
  } catch (error) {
    console.error("Deposit error:", error);
    const message = error instanceof Error ? error.message : "Deposit failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
