import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get bot by ID
 */
export const getBotById = query({
  args: { botId: v.id("bots") },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.botId);
    if (!bot) {
      return null;
    }

    // Never return the API key hash
    const { apiKeyHash, ...botData } = bot;
    return botData;
  },
});

/**
 * Get bot by API key hash
 */
export const getBotByApiKey = query({
  args: { apiKeyHash: v.string() },
  handler: async (ctx, args) => {
    const bot = await ctx.db
      .query("bots")
      .withIndex("by_apiKeyHash", (q) => q.eq("apiKeyHash", args.apiKeyHash))
      .first();

    if (!bot) {
      return null;
    }

    // Never return the API key hash
    const { apiKeyHash, ...botData } = bot;
    return botData;
  },
});

/**
 * Get bot by display name
 */
export const getBotByDisplayName = query({
  args: { displayName: v.string() },
  handler: async (ctx, args) => {
    const bot = await ctx.db
      .query("bots")
      .filter((q) => q.eq(q.field("displayName"), args.displayName))
      .first();

    if (!bot) {
      return null;
    }

    // Never return the API key hash
    const { apiKeyHash, ...botData } = bot;
    return botData;
  },
});

/**
 * Check if display name is available
 */
export const isDisplayNameAvailable = query({
  args: { displayName: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bots")
      .filter((q) => q.eq(q.field("displayName"), args.displayName))
      .first();

    return !existing;
  },
});

/**
 * Get top bots by reputation
 */
export const getTopBots = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const bots = await ctx.db
      .query("bots")
      .withIndex("by_reputation")
      .order("desc")
      .take(limit);

    // Never return API key hashes
    return bots.map(({ apiKeyHash, ...bot }) => bot);
  },
});

/**
 * Get bot's wallet
 */
export const getBotWallet = query({
  args: { botId: v.id("bots") },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_bot", (q) => q.eq("botId", args.botId))
      .first();

    return wallet;
  },
});
