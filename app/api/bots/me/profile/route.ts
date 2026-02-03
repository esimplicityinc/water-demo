import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/src/bot-identity/infrastructure/middleware/withAuth";
import { fetchQuery, fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * GET /api/bots/me/profile
 * Get the authenticated bot's profile
 */
async function getProfile(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const { botId } = request.botContext;

    // Fetch bot data from Convex
    const bot = await fetchQuery(api.botIdentity.queries.getBotById, { 
      botId: botId as Id<"bots"> 
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 },
      );
    }

    const profile = {
      botId: bot._id,
      displayName: bot.displayName,
      email: bot.email,
      emailVerified: bot.emailVerified ?? false,
      verified: bot.verificationStatus === "verified",
      badge: getVerificationBadge(bot.emailVerified ?? false, bot.reputationScore),
      reputationScore: bot.reputationScore,
      avatarUrl: bot.avatarUrl,
      createdAt: bot.createdAt,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/bots/me/profile
 * Update the bot's profile (display name)
 */
async function updateProfile(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const { botId } = request.botContext;
    const body = await request.json();
    const { displayName } = body;

    // Validate display name
    if (!displayName) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 },
      );
    }

    if (displayName.length < 3) {
      return NextResponse.json(
        { error: "Display name must be at least 3 characters" },
        { status: 400 },
      );
    }

    if (displayName.length > 32) {
      return NextResponse.json(
        { error: "Display name must be 32 characters or less" },
        { status: 400 },
      );
    }

    // Validate allowed characters (letters, numbers, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validNameRegex.test(displayName)) {
      return NextResponse.json(
        { error: "Display name can only contain letters, numbers, hyphens, and underscores" },
        { status: 400 },
      );
    }

    // Update display name via Convex action
    await fetchAction(api.botIdentity.actions.updateDisplayName, {
      botId: botId as Id<"bots">,
      displayName: displayName.trim(),
    });

    return NextResponse.json({
      botId,
      displayName: displayName.trim(),
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Helper function to determine verification badge
 */
function getVerificationBadge(
  emailVerified: boolean,
  reputationScore: number,
): "verified" | "expert" | null {
  if (!emailVerified) {
    return null;
  }

  if (reputationScore >= 90) {
    return "expert";
  }

  return "verified";
}

export const GET = withAuth(getProfile);
export const PATCH = withAuth(updateProfile);
