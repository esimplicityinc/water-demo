import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Escrow } from "../../src/domain/escrow";

/**
 * Create a new escrow when a promise is accepted
 * Called by the promise acceptance flow
 */
export const createEscrow = mutation({
  args: {
    promiseId: v.id("promises"),
    consumerId: v.id("bots"),
    providerId: v.id("bots"),
    amount: v.number(),
    currency: v.string(),
    stakeLockAmount: v.number(),
    stakeLockId: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    escrowId: v.optional(v.id("escrows")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // Check consumer has sufficient balance
      const consumerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.consumerId))
        .unique();

      if (!consumerWallet) {
        return { success: false, error: "Consumer wallet not found" };
      }

      const consumerAvailable = consumerWallet.balance - consumerWallet.lockedBalance;
      if (consumerAvailable < args.amount) {
        return { success: false, error: "Insufficient wallet balance" };
      }

      // Check provider has sufficient available stake
      const providerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.providerId))
        .unique();

      if (!providerWallet) {
        return { success: false, error: "Provider wallet not found" };
      }

      const providerAvailable = providerWallet.balance - providerWallet.lockedBalance;
      if (providerAvailable < args.stakeLockAmount) {
        return { success: false, error: "Insufficient provider stake" };
      }

      // Lock consumer's funds
      await ctx.db.patch(consumerWallet._id, {
        lockedBalance: consumerWallet.lockedBalance + args.amount,
      });

      // Lock provider's stake
      await ctx.db.patch(providerWallet._id, {
        lockedBalance: providerWallet.lockedBalance + args.stakeLockAmount,
      });

      // Create domain escrow aggregate
      const escrow = Escrow.create(
        args.promiseId,
        args.consumerId,
        args.providerId,
        args.amount,
        args.currency,
        args.stakeLockAmount,
        args.stakeLockId
      );

      // Persist to Convex
      const escrowId = await ctx.db.insert("escrows", {
        promiseId: args.promiseId,
        consumerId: args.consumerId,
        providerId: args.providerId,
        state: escrow.state.value,
        lockedAmount: escrow.lockedFunds.amount,
        lockedCurrency: escrow.lockedFunds.currency,
        stakeLockAmount: escrow.stakeLock.amount,
        stakeLockId: escrow.stakeLock.stakeLockId ?? undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Store domain events
      for (const event of escrow.domainEvents) {
        await ctx.db.insert("events", {
          eventType: event.eventType,
          aggregateType: "Escrow",
          aggregateId: escrowId,
          version: 1,
          data: event.toJSON(),
          occurredAt: Date.now(),
        });
      }

      return {
        success: true,
        escrowId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Start escrow execution
 * Only the provider can call this
 */
export const startExecution = mutation({
  args: {
    escrowId: v.id("escrows"),
    providerId: v.id("bots"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // Fetch escrow from DB
      const escrowDoc = await ctx.db.get(args.escrowId);
      if (!escrowDoc) {
        return { success: false, error: "Escrow not found" };
      }

      // Verify caller is the provider
      if (escrowDoc.providerId !== args.providerId) {
        return { success: false, error: "Only the provider can start execution" };
      }

      // Reconstruct domain aggregate
      const escrow = Escrow.fromPersistence({
        id: args.escrowId,
        promiseId: escrowDoc.promiseId,
        consumerId: escrowDoc.consumerId,
        providerId: escrowDoc.providerId,
        state: escrowDoc.state,
        lockedAmount: escrowDoc.lockedAmount,
        lockedCurrency: escrowDoc.lockedCurrency,
        stakeLockAmount: escrowDoc.stakeLockAmount,
        stakeLockId: escrowDoc.stakeLockId ?? null,
        createdAt: new Date(escrowDoc.createdAt),
        updatedAt: new Date(escrowDoc.updatedAt),
        completedAt: escrowDoc.completedAt ? new Date(escrowDoc.completedAt) : null,
        closedAt: escrowDoc.closedAt ? new Date(escrowDoc.closedAt) : null,
      });

      // Start execution
      escrow.startExecution(args.providerId);

      console.log('[startExecution] State after startExecution:', escrow.state.value);

      // Update DB
      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value,
        updatedAt: Date.now(),
      });

      console.log('[startExecution] Database patched with state:', escrow.state.value);

      // Store events
      for (const event of escrow.domainEvents) {
        await ctx.db.insert("events", {
          eventType: event.eventType,
          aggregateType: "Escrow",
          aggregateId: args.escrowId,
          version: 1,
          data: event.toJSON(),
          occurredAt: Date.now(),
        });
      }

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
 * Complete execution with proof
 * Only the provider can call this
 */
export const completeExecution = mutation({
  args: {
    escrowId: v.id("escrows"),
    providerId: v.id("bots"),
    executionProof: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const escrowDoc = await ctx.db.get(args.escrowId);
      if (!escrowDoc) {
        return { success: false, error: "Escrow not found" };
      }

      if (escrowDoc.providerId !== args.providerId) {
        return { success: false, error: "Only the provider can complete execution" };
      }

      const escrow = Escrow.fromPersistence({
        id: args.escrowId,
        promiseId: escrowDoc.promiseId,
        consumerId: escrowDoc.consumerId,
        providerId: escrowDoc.providerId,
        state: escrowDoc.state,
        lockedAmount: escrowDoc.lockedAmount,
        lockedCurrency: escrowDoc.lockedCurrency,
        stakeLockAmount: escrowDoc.stakeLockAmount,
        stakeLockId: escrowDoc.stakeLockId ?? null,
        createdAt: new Date(escrowDoc.createdAt),
        updatedAt: new Date(escrowDoc.updatedAt),
        completedAt: escrowDoc.completedAt ? new Date(escrowDoc.completedAt) : null,
        closedAt: escrowDoc.closedAt ? new Date(escrowDoc.closedAt) : null,
      });

      escrow.completeExecution(args.providerId, args.executionProof);

      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value,
        executionProof: args.executionProof,
        completedAt: Date.now(),
        updatedAt: Date.now(),
      });

      for (const event of escrow.domainEvents) {
        await ctx.db.insert("events", {
          eventType: event.eventType,
          aggregateType: "Escrow",
          aggregateId: args.escrowId,
          version: 1,
          data: event.toJSON(),
          occurredAt: Date.now(),
        });
      }

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
 * Release escrow to provider
 * Called by the settlement/oracle system after verification
 */
export const releaseEscrow = mutation({
  args: {
    escrowId: v.id("escrows"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const escrowDoc = await ctx.db.get(args.escrowId);
      if (!escrowDoc) {
        return { success: false, error: "Escrow not found" };
      }

      const escrow = Escrow.fromPersistence({
        id: args.escrowId,
        promiseId: escrowDoc.promiseId,
        consumerId: escrowDoc.consumerId,
        providerId: escrowDoc.providerId,
        state: escrowDoc.state,
        lockedAmount: escrowDoc.lockedAmount,
        lockedCurrency: escrowDoc.lockedCurrency,
        stakeLockAmount: escrowDoc.stakeLockAmount,
        stakeLockId: escrowDoc.stakeLockId ?? null,
        createdAt: new Date(escrowDoc.createdAt),
        updatedAt: new Date(escrowDoc.updatedAt),
        completedAt: escrowDoc.completedAt ? new Date(escrowDoc.completedAt) : null,
        closedAt: escrowDoc.closedAt ? new Date(escrowDoc.closedAt) : null,
      });

      escrow.release();

      // Update escrow state to RELEASING
      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value, // Will be RELEASING
        updatedAt: Date.now(),
      });

      // Unlock consumer's funds and transfer to provider
      const consumerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", escrowDoc.consumerId))
        .unique();

      if (consumerWallet) {
        // Unlock and deduct consumer's funds
        await ctx.db.patch(consumerWallet._id, {
          lockedBalance: Math.max(0, consumerWallet.lockedBalance - escrow.lockedFunds.amount),
          balance: Math.max(0, consumerWallet.balance - escrow.lockedFunds.amount),
        });
      }

      // Release provider's stake and transfer funds
      const providerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", escrowDoc.providerId))
        .unique();

      if (providerWallet) {
        // Unlock stake and transfer funds
        await ctx.db.patch(providerWallet._id, {
          lockedBalance: Math.max(0, providerWallet.lockedBalance - escrow.stakeLock.amount),
          balance: providerWallet.balance + escrow.lockedFunds.amount,
        });
      }

      // Close the escrow
      escrow.close();
      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value, // Will be CLOSED
        closedAt: Date.now(),
        updatedAt: Date.now(),
      });

      for (const event of escrow.domainEvents) {
        await ctx.db.insert("events", {
          eventType: event.eventType,
          aggregateType: "Escrow",
          aggregateId: args.escrowId,
          version: 1,
          data: event.toJSON(),
          occurredAt: Date.now(),
        });
      }

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
 * Return escrow to consumer
 * Called when execution fails or dispute resolves against provider
 */
export const returnEscrow = mutation({
  args: {
    escrowId: v.id("escrows"),
    reason: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const escrowDoc = await ctx.db.get(args.escrowId);
      if (!escrowDoc) {
        return { success: false, error: "Escrow not found" };
      }

      const escrow = Escrow.fromPersistence({
        id: args.escrowId,
        promiseId: escrowDoc.promiseId,
        consumerId: escrowDoc.consumerId,
        providerId: escrowDoc.providerId,
        state: escrowDoc.state,
        lockedAmount: escrowDoc.lockedAmount,
        lockedCurrency: escrowDoc.lockedCurrency,
        stakeLockAmount: escrowDoc.stakeLockAmount,
        stakeLockId: escrowDoc.stakeLockId ?? null,
        createdAt: new Date(escrowDoc.createdAt),
        updatedAt: new Date(escrowDoc.updatedAt),
        completedAt: escrowDoc.completedAt ? new Date(escrowDoc.completedAt) : null,
        closedAt: escrowDoc.closedAt ? new Date(escrowDoc.closedAt) : null,
      });

      escrow.returnToConsumer(args.reason);

      // Update escrow state to RETURNING
      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value, // Will be RETURNING
        failureReason: args.reason,
        updatedAt: Date.now(),
      });

      // Unlock and return funds to consumer's wallet
      const consumerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", escrowDoc.consumerId))
        .unique();

      if (consumerWallet) {
        // Unlock consumer's funds (no deduction, just unlock)
        await ctx.db.patch(consumerWallet._id, {
          lockedBalance: Math.max(0, consumerWallet.lockedBalance - escrow.lockedFunds.amount),
        });
      }

      // Slash provider's stake (deduct from locked balance and total balance)
      const providerWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", escrowDoc.providerId))
        .unique();

      if (providerWallet) {
        await ctx.db.patch(providerWallet._id, {
          lockedBalance: Math.max(0, providerWallet.lockedBalance - escrow.stakeLock.amount),
          balance: Math.max(0, providerWallet.balance - escrow.stakeLock.amount),
        });
      }

      // Close the escrow
      escrow.close();
      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value, // Will be CLOSED
        closedAt: Date.now(),
        updatedAt: Date.now(),
      });

      for (const event of escrow.domainEvents) {
        await ctx.db.insert("events", {
          eventType: event.eventType,
          aggregateType: "Escrow",
          aggregateId: args.escrowId,
          version: 1,
          data: event.toJSON(),
          occurredAt: Date.now(),
        });
      }

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
 * Raise a dispute on an escrow
 * Only the consumer can call this
 */
export const raiseDispute = mutation({
  args: {
    escrowId: v.id("escrows"),
    consumerId: v.id("bots"),
    reason: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const escrowDoc = await ctx.db.get(args.escrowId);
      if (!escrowDoc) {
        return { success: false, error: "Escrow not found" };
      }

      if (escrowDoc.consumerId !== args.consumerId) {
        return { success: false, error: "Only the consumer can raise a dispute" };
      }

      const escrow = Escrow.fromPersistence({
        id: args.escrowId,
        promiseId: escrowDoc.promiseId,
        consumerId: escrowDoc.consumerId,
        providerId: escrowDoc.providerId,
        state: escrowDoc.state,
        lockedAmount: escrowDoc.lockedAmount,
        lockedCurrency: escrowDoc.lockedCurrency,
        stakeLockAmount: escrowDoc.stakeLockAmount,
        stakeLockId: escrowDoc.stakeLockId ?? null,
        createdAt: new Date(escrowDoc.createdAt),
        updatedAt: new Date(escrowDoc.updatedAt),
        completedAt: escrowDoc.completedAt ? new Date(escrowDoc.completedAt) : null,
        closedAt: escrowDoc.closedAt ? new Date(escrowDoc.closedAt) : null,
      });

      escrow.raiseDispute(args.consumerId, args.reason);

      await ctx.db.patch(args.escrowId, {
        state: escrow.state.value,
        disputeReason: args.reason,
        updatedAt: Date.now(),
      });

      for (const event of escrow.domainEvents) {
        await ctx.db.insert("events", {
          eventType: event.eventType,
          aggregateType: "Escrow",
          aggregateId: args.escrowId,
          version: 1,
          data: event.toJSON(),
          occurredAt: Date.now(),
        });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
