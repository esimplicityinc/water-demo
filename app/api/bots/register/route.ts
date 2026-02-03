import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

/**
 * POST /api/bots/register
 * Register a new bot and return botId + apiKey
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { displayName } = body;

    if (!displayName) {
      return NextResponse.json(
        { error: "displayName is required" },
        { status: 400 }
      );
    }

    // Register the bot using ConvexHttpClient
    const result = await convexClient.mutation(api.botIdentity.mutations.registerBot, {
      displayName,
    });

    return NextResponse.json({
      botId: result.botId,
      apiKey: result.apiKey,
      displayName: result.displayName,
    }, { status: 201 });
  } catch (error) {
    console.error("Bot registration error:", error);
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
