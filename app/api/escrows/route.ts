import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

/**
 * GET /api/escrows
 * List escrows with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const consumerId = searchParams.get("consumerId");
    const providerId = searchParams.get("providerId");
    const state = searchParams.get("state");
    
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
    
    let escrows = [];
    
    if (consumerId) {
      escrows = await convexClient.query(api.escrow.queries.getEscrowsByConsumer, {
        consumerId: consumerId as any,
        state: state ? (state as any) : undefined,
      });
    } else if (providerId) {
      escrows = await convexClient.query(api.escrow.queries.getEscrowsByProvider, {
        providerId: providerId as any,
        state: state ? (state as any) : undefined,
      });
    } else if (state) {
      escrows = await convexClient.query(api.escrow.queries.getEscrowsByState, {
        state: state as any,
      });
    } else {
      return NextResponse.json(
        { error: "consumerId, providerId, or state parameter required" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ escrows }, { status: 200 });
  } catch (error) {
    console.error("List escrows error:", error);
    const message = error instanceof Error ? error.message : "Failed to list escrows";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
