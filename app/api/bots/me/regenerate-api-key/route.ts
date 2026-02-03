import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  withAuth,
  AuthenticatedRequest,
} from "@/src/bot-identity/infrastructure/middleware/withAuth";

/**
 * POST /api/bots/me/regenerate-api-key
 *
 * Regenerates the API key for the authenticated bot.
 * The old API key will be invalidated immediately.
 * Requires Bearer token authentication.
 *
 * @returns New API key and bot ID
 * @example
 * Response: {
 *   "apiKey": "sk_...",
 *   "botId": "..."
 * }
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { botId } = req.botContext;

    // Regenerate API key via Convex mutation
    const result = await fetchMutation(
      api.botIdentity.mutations.regenerateApiKey,
      {
        botId: botId as any,
      },
    );

    // Return the new API key and bot ID
    return NextResponse.json(
      {
        apiKey: result.apiKey,
        botId: result.botId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error regenerating API key:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === "Bot not found") {
        return NextResponse.json({ error: "Bot not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Failed to regenerate API key" },
      { status: 500 },
    );
  }
});
