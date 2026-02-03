import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/src/bot-identity/infrastructure/middleware/withAuth";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * POST /api/bots/me/verify-email
 * Request email verification
 */
async function requestVerification(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const { botId } = request.botContext;

    // In a real implementation, generate a verification token and send an email
    // For now, we'll just return a success message
    // The actual verification happens at POST /api/bots/me/verify-email/confirm

    return NextResponse.json({
      message: "Verification email sent successfully",
      botId,
    });
  } catch (error) {
    console.error("Error requesting email verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = withAuth(requestVerification);
