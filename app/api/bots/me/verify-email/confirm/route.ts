import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/src/bot-identity/infrastructure/middleware/withAuth";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * POST /api/bots/me/verify-email/confirm
 * Confirm email verification with token
 */
async function confirmVerification(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const { botId } = request.botContext;
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Call the Convex action to verify email
    const result = await fetchAction(api.botIdentity.actions.verifyEmail, {
      botId: botId as Id<"bots">,
      token,
    });

    return NextResponse.json({
      message: "Email verified successfully",
      botId,
      success: result.success,
    });
  } catch (error) {
    console.error("Error confirming email verification:", error);

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

export const POST = withAuth(confirmVerification);
