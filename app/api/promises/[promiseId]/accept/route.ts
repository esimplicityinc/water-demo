import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    promiseId: string;
  }>;
}

/**
 * POST /api/promises/[promiseId]/accept
 * Accept a promise and create an escrow
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { promiseId } = await context.params;
    
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
    const consumerId = result.botId;
    if (!consumerId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }
    
    // Get promise details from promise market
    const promise = await convexClient.query(api.promiseMarket.queries.getPromiseById, {
      promiseId: promiseId as any,
    });
    
    if (!promise) {
      return NextResponse.json(
        { error: "Promise not found" },
        { status: 404 }
      );
    }
    
    // Check consumer has sufficient available balance
    const consumerWallet = await convexClient.query(api.wallet.queries.getWalletByBotId, {
      botId: consumerId as any,
    });

    if (!consumerWallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    const consumerAvailable = consumerWallet.balance - consumerWallet.lockedBalance;
    if (consumerAvailable < promise.pricingTerms.price) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
        { status: 400 }
      );
    }

    // Check provider has sufficient available stake
    const providerWallet = await convexClient.query(api.wallet.queries.getWalletByBotId, {
      botId: promise.providerBotId as any,
    });

    if (!providerWallet) {
      return NextResponse.json(
        { error: "Provider wallet not found" },
        { status: 404 }
      );
    }

    const providerAvailable = providerWallet.balance - providerWallet.lockedBalance;
    if (providerAvailable < promise.pricingTerms.penaltyClause.stakeAmount) {
      return NextResponse.json(
        { error: "Insufficient provider stake" },
        { status: 400 }
      );
    }

    // Accept the promise
    const acceptResult = await convexClient.mutation(api.promiseMarket.mutations.acceptPromise, {
      promiseId: promiseId as any,
      consumerId: consumerId as any,
    });
    
    if (!acceptResult.success) {
      return NextResponse.json(
        { error: acceptResult.error || "Failed to accept promise" },
        { status: 400 }
      );
    }
    
    // Create escrow
    const escrowResult = await convexClient.mutation(api.escrow.mutations.createEscrow, {
      promiseId: promiseId as any,
      consumerId: consumerId as any,
      providerId: promise.providerBotId,
      amount: promise.pricingTerms.price,
      currency: "CLAW",
      stakeLockAmount: promise.pricingTerms.penaltyClause.stakeAmount,
    });
    
    if (!escrowResult.success) {
      return NextResponse.json(
        { error: escrowResult.error || "Failed to create escrow" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      promiseId,
      escrowId: escrowResult.escrowId,
    }, { status: 200 });
  } catch (error) {
    console.error("Promise acceptance error:", error);
    const message = error instanceof Error ? error.message : "Acceptance failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
