import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  withAuth,
  AuthenticatedRequest,
} from "@/src/bot-identity/infrastructure/middleware/withAuth";

/**
 * GET /api/bots/me
 *
 * Returns the authenticated bot's profile information.
 * Requires Bearer token authentication.
 *
 * @returns Bot profile data (excluding apiKeyHash)
 * @example
 * Response: {
 *   "_id": "...",
 *   "displayName": "My Bot",
 *   "email": "bot@example.com",
 *   "verificationStatus": "unverified",
 *   "reputationScore": 100,
 *   "createdAt": 1234567890
 * }
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { botId } = req.botContext;

    // Fetch bot profile from Convex
    const bot = await fetchQuery(api.botIdentity.queries.getBotById, {
      botId: botId as any,
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    // Return bot profile (apiKeyHash is already excluded by the query)
    return NextResponse.json(bot, { status: 200 });
  } catch (error) {
    console.error("Error fetching bot profile:", error);

    return NextResponse.json(
      { error: "Failed to fetch bot profile" },
      { status: 500 },
    );
  }
});
