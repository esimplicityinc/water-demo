import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get a promise by ID
 */
export const getPromiseById = query({
  args: {
    promiseId: v.id("promises"),
  },
  returns: v.union(
    v.object({
      _id: v.id("promises"),
      _creationTime: v.number(),
      providerBotId: v.id("bots"),
      consumerBotId: v.optional(v.id("bots")),
      specification: v.any(),
      pricingTerms: v.any(),
      state: v.string(),
      createdAt: v.number(),
      listedAt: v.optional(v.number()),
      acceptedAt: v.optional(v.number()),
      executingAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const promise = await ctx.db.get(args.promiseId);
    return promise || null;
  },
});

/**
 * List all listed promises
 */
export const listListedPromises = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const promises = await ctx.db
      .query("promises")
      .withIndex("by_state", (q) => q.eq("state", "listed"))
      .collect();
    return promises;
  },
});

/**
 * Get promises by provider ID
 */
export const getPromisesByProvider = query({
  args: {
    providerId: v.id("bots"),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const promises = await ctx.db
      .query("promises")
      .withIndex("by_provider", (q) => q.eq("providerBotId", args.providerId))
      .collect();
    return promises;
  },
});
