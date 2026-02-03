import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * Get escrow by ID
 */
export const getEscrow = query({
  args: {
    escrowId: v.id("escrows"),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("escrows"),
      _creationTime: v.number(),
      promiseId: v.id("promises"),
      consumerId: v.id("bots"),
      providerId: v.id("bots"),
      state: v.union(
        v.literal("CREATED"),
        v.literal("EXECUTING"),
        v.literal("COMPLETED"),
        v.literal("FAILED"),
        v.literal("DISPUTED"),
        v.literal("RELEASING"),
        v.literal("RETURNING"),
        v.literal("CLOSED")
      ),
      lockedAmount: v.number(),
      lockedCurrency: v.string(),
      stakeLockAmount: v.number(),
      stakeLockId: v.optional(v.string()),
      executionProof: v.optional(v.string()),
      failureReason: v.optional(v.string()),
      disputeReason: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      completedAt: v.optional(v.number()),
      closedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.escrowId);
  },
});

/**
 * Get escrow by promise ID
 */
export const getEscrowByPromise = query({
  args: {
    promiseId: v.id("promises"),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("escrows"),
      _creationTime: v.number(),
      promiseId: v.id("promises"),
      consumerId: v.id("bots"),
      providerId: v.id("bots"),
      state: v.union(
        v.literal("CREATED"),
        v.literal("EXECUTING"),
        v.literal("COMPLETED"),
        v.literal("FAILED"),
        v.literal("DISPUTED"),
        v.literal("RELEASING"),
        v.literal("RETURNING"),
        v.literal("CLOSED")
      ),
      lockedAmount: v.number(),
      lockedCurrency: v.string(),
      stakeLockAmount: v.number(),
      stakeLockId: v.optional(v.string()),
      executionProof: v.optional(v.string()),
      failureReason: v.optional(v.string()),
      disputeReason: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      completedAt: v.optional(v.number()),
      closedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("escrows")
      .withIndex("by_promise", (q) => q.eq("promiseId", args.promiseId))
      .unique();
  },
});

/**
 * List escrows by consumer bot
 */
export const getEscrowsByConsumer = query({
  args: {
    consumerId: v.id("bots"),
    state: v.optional(v.union(
      v.literal("CREATED"),
      v.literal("EXECUTING"),
      v.literal("COMPLETED"),
      v.literal("FAILED"),
      v.literal("DISPUTED"),
      v.literal("RELEASING"),
      v.literal("RETURNING"),
      v.literal("CLOSED")
    )),
  },
  returns: v.array(
    v.object({
      _id: v.id("escrows"),
      _creationTime: v.number(),
      promiseId: v.id("promises"),
      consumerId: v.id("bots"),
      providerId: v.id("bots"),
      state: v.union(
        v.literal("CREATED"),
        v.literal("EXECUTING"),
        v.literal("COMPLETED"),
        v.literal("FAILED"),
        v.literal("DISPUTED"),
        v.literal("RELEASING"),
        v.literal("RETURNING"),
        v.literal("CLOSED")
      ),
      lockedAmount: v.number(),
      lockedCurrency: v.string(),
      stakeLockAmount: v.number(),
      stakeLockId: v.optional(v.string()),
      executionProof: v.optional(v.string()),
      failureReason: v.optional(v.string()),
      disputeReason: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      completedAt: v.optional(v.number()),
      closedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("escrows")
      .withIndex("by_consumer", (q) => q.eq("consumerId", args.consumerId));

    if (args.state) {
      query = query.filter((q) => q.eq(q.field("state"), args.state));
    }

    return await query.collect();
  },
});

/**
 * List escrows by provider bot
 */
export const getEscrowsByProvider = query({
  args: {
    providerId: v.id("bots"),
    state: v.optional(v.union(
      v.literal("CREATED"),
      v.literal("EXECUTING"),
      v.literal("COMPLETED"),
      v.literal("FAILED"),
      v.literal("DISPUTED"),
      v.literal("RELEASING"),
      v.literal("RETURNING"),
      v.literal("CLOSED")
    )),
  },
  returns: v.array(
    v.object({
      _id: v.id("escrows"),
      _creationTime: v.number(),
      promiseId: v.id("promises"),
      consumerId: v.id("bots"),
      providerId: v.id("bots"),
      state: v.union(
        v.literal("CREATED"),
        v.literal("EXECUTING"),
        v.literal("COMPLETED"),
        v.literal("FAILED"),
        v.literal("DISPUTED"),
        v.literal("RELEASING"),
        v.literal("RETURNING"),
        v.literal("CLOSED")
      ),
      lockedAmount: v.number(),
      lockedCurrency: v.string(),
      stakeLockAmount: v.number(),
      stakeLockId: v.optional(v.string()),
      executionProof: v.optional(v.string()),
      failureReason: v.optional(v.string()),
      disputeReason: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      completedAt: v.optional(v.number()),
      closedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("escrows")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId));

    if (args.state) {
      query = query.filter((q) => q.eq(q.field("state"), args.state));
    }

    return await query.collect();
  },
});

/**
 * List all escrows filtered by state
 */
export const getEscrowsByState = query({
  args: {
    state: v.union(
      v.literal("CREATED"),
      v.literal("EXECUTING"),
      v.literal("COMPLETED"),
      v.literal("FAILED"),
      v.literal("DISPUTED"),
      v.literal("RELEASING"),
      v.literal("RETURNING"),
      v.literal("CLOSED")
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("escrows"),
      _creationTime: v.number(),
      promiseId: v.id("promises"),
      consumerId: v.id("bots"),
      providerId: v.id("bots"),
      state: v.union(
        v.literal("CREATED"),
        v.literal("EXECUTING"),
        v.literal("COMPLETED"),
        v.literal("FAILED"),
        v.literal("DISPUTED"),
        v.literal("RELEASING"),
        v.literal("RETURNING"),
        v.literal("CLOSED")
      ),
      lockedAmount: v.number(),
      lockedCurrency: v.string(),
      stakeLockAmount: v.number(),
      stakeLockId: v.optional(v.string()),
      executionProof: v.optional(v.string()),
      failureReason: v.optional(v.string()),
      disputeReason: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      completedAt: v.optional(v.number()),
      closedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("escrows")
      .withIndex("by_state", (q) => q.eq("state", args.state))
      .collect();
  },
});
