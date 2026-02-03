import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

/**
 * POST /api/promises
 * Create a new promise
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { specification, pricing } = body;
    
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
    const verifyResult = await convexClient.action(api.botIdentity.actions.verifyApiKey, {
      plainApiKey: apiKey,
    });
    const providerId = verifyResult.botId;
    if (!providerId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Create promise
    const result = await convexClient.mutation(api.promiseMarket.mutations.createPromise, {
      providerId: providerId as any,
      specification,
      pricing,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create promise" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      promiseId: result.promiseId,
    }, { status: 201 });
  } catch (error) {
    console.error("Create promise error:", error);
    const message = error instanceof Error ? error.message : "Failed to create promise";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
