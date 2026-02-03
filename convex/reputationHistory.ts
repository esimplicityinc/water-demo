import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get reputation history by bot ID
 */
export const getByBotId = query({
  args: { botId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reputationHistory")
      .withIndex("by_botId", (q) => q.eq("botId", args.botId))
      .unique();
  },
});

/**
 * Save or update reputation history for a bot
 */
export const save = mutation({
  args: {
    botId: v.string(),
    records: v.array(v.object({
      promiseId: v.string(),
      outcome: v.union(
        v.literal('fulfilled'),
        v.literal('failed'),
        v.literal('disputed_won'),
        v.literal('disputed_lost'),
        v.literal('fulfilled_late')
      ),
      executionTime: v.number(),
      reputationDelta: v.number(),
      reason: v.string(),
      recordedAt: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reputationHistory")
      .withIndex("by_botId", (q) => q.eq("botId", args.botId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        records: args.records,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("reputationHistory", {
        botId: args.botId,
        records: args.records,
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Add a performance record to a bot's reputation history
 * Keeps only the last 100 records
 */
export const addRecord = mutation({
  args: {
    botId: v.string(),
    record: v.object({
      promiseId: v.string(),
      outcome: v.union(
        v.literal('fulfilled'),
        v.literal('failed'),
        v.literal('disputed_won'),
        v.literal('disputed_lost'),
        v.literal('fulfilled_late')
      ),
      executionTime: v.number(),
      reputationDelta: v.number(),
      reason: v.string(),
      recordedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reputationHistory")
      .withIndex("by_botId", (q) => q.eq("botId", args.botId))
      .unique();

    if (existing) {
      const records = [...existing.records, args.record];
      // Keep only last 100
      if (records.length > 100) {
        records.shift();
      }
      
      await ctx.db.patch(existing._id, {
        records,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("reputationHistory", {
        botId: args.botId,
        records: [args.record],
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Get top bots by reputation score
 */
export const getTopBots = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    // Get all bots with their accounts
    const botAccounts = await ctx.db.query("bots").collect();
    
    // Sort by reputation score descending
    const sorted = botAccounts
      .sort((a, b) => b.reputationScore - a.reputationScore)
      .slice(0, args.limit);

    return sorted.map(bot => ({
      botId: bot._id,
      reputationScore: bot.reputationScore,
      displayName: bot.displayName,
    }));
  },
});
