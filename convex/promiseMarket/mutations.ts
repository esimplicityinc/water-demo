import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Create a new promise
 */
export const createPromise = mutation({
  args: {
    providerId: v.id("bots"),
    specification: v.object({
      modelName: v.string(),
      tokenCount: v.number(),
      responseTimeSLA: v.number(),
    }),
    pricing: v.object({
      price: v.number(),
      stakeAmount: v.number(),
    }),
  },
  returns: v.object({
    success: v.boolean(),
    promiseId: v.optional(v.id("promises")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const promiseId = await ctx.db.insert("promises", {
        providerBotId: args.providerId,
        specification: args.specification,
        pricingTerms: {
          price: args.pricing.price,
          paymentSchedule: "upfront",
          penaltyClause: {
            stakeAmount: args.pricing.stakeAmount,
            slashPercentage: 100,
          },
        },
        state: "draft",
        createdAt: Date.now(),
      });

      return { success: true, promiseId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * List a promise on the marketplace
 */
export const listPromise = mutation({
  args: {
    promiseId: v.id("promises"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const promise = await ctx.db.get(args.promiseId);
      if (!promise) {
        return { success: false, error: "Promise not found" };
      }

      if (promise.state !== "draft") {
        return { success: false, error: "Promise must be in draft state" };
      }

      await ctx.db.patch(args.promiseId, {
        state: "listed",
        listedAt: Date.now(),
      });

      // Add to order book
      await ctx.db.insert("orderBook", {
        type: "supply",
        promiseId: args.promiseId,
        botId: promise.providerBotId,
        specification: promise.specification,
        price: promise.pricingTerms.price,
        listedAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Accept a promise
 */
export const acceptPromise = mutation({
  args: {
    promiseId: v.id("promises"),
    consumerId: v.id("bots"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const promise = await ctx.db.get(args.promiseId);
      if (!promise) {
        return { success: false, error: "Promise not found" };
      }

      if (promise.state !== "listed") {
        return { success: false, error: "Promise is not available" };
      }

      // Get consumer wallet
      const consumerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.consumerId))
        .unique();

      if (!consumerWallet || consumerWallet.balance < promise.pricingTerms.price) {
        return { success: false, error: "Insufficient balance" };
      }

      // Lock consumer funds
      await ctx.db.patch(consumerWallet._id, {
        balance: consumerWallet.balance - promise.pricingTerms.price,
        lockedBalance: consumerWallet.lockedBalance + promise.pricingTerms.price,
      });

      // Update promise
      await ctx.db.patch(args.promiseId, {
        state: "accepted",
        consumerBotId: args.consumerId,
        acceptedAt: Date.now(),
      });

      // Record transaction
      await ctx.db.insert("transactions", {
        type: "transfer_out",
        amount: promise.pricingTerms.price,
        fromWalletId: consumerWallet._id,
        metadata: { promiseId: args.promiseId, reason: "escrow" },
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
