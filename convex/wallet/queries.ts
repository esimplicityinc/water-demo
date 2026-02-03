import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get wallet by bot ID
 */
export const getWalletByBotId = query({
  args: {
    botId: v.id("bots"),
  },
  returns: v.union(
    v.object({
      _id: v.id("wallets"),
      _creationTime: v.number(),
      botId: v.id("bots"),
      balance: v.number(),
      lockedBalance: v.number(),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_bot", (q) => q.eq("botId", args.botId))
      .unique();
    return wallet || null;
  },
});

/**
 * Get wallet by ID
 */
export const getWalletById = query({
  args: {
    walletId: v.id("wallets"),
  },
  returns: v.union(
    v.object({
      _id: v.id("wallets"),
      _creationTime: v.number(),
      botId: v.id("bots"),
      balance: v.number(),
      lockedBalance: v.number(),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const wallet = await ctx.db.get(args.walletId);
    return wallet || null;
  },
});
