import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * List public agents with pagination and filtering
 * Used by: GET /api/agents
 */
export const listPublic = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    tier: v.optional(v.union(v.literal("beginner"), v.literal("expert"))),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("all"))),
    sortBy: v.optional(v.union(v.literal("reputation"), v.literal("name"), v.literal("createdAt"))),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    const offset = Math.max(args.offset ?? 0, 0);
    const sortBy = args.sortBy ?? "reputation";
    const sortOrder = args.sortOrder ?? "desc";
    const status = args.status ?? "all";

    // Get all bots (we'll filter in memory for complex queries)
    let botsQuery = ctx.db.query("bots");

    // Apply status filter
    if (status === "active") {
      botsQuery = botsQuery.filter((q) => q.eq(q.field("emailVerified"), true));
    } else if (status === "inactive") {
      botsQuery = botsQuery.filter((q) => q.eq(q.field("emailVerified"), false));
    }

    // Get all matching bots for counting
    const allBots = await botsQuery.collect();

    // Filter by tier if specified
    let filteredBots = allBots;
    if (args.tier) {
      filteredBots = allBots.filter((bot) => {
        const botTier = bot.reputationScore >= 500 ? "expert" : "beginner";
        return botTier === args.tier;
      });
    }

    // Sort results
    filteredBots.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "reputation") {
        comparison = a.reputationScore - b.reputationScore;
      } else if (sortBy === "name") {
        comparison = a.displayName.localeCompare(b.displayName);
      } else if (sortBy === "createdAt") {
        comparison = a.createdAt - b.createdAt;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    // Get total count before pagination
    const total = filteredBots.length;

    // Apply pagination
    const paginatedBots = filteredBots.slice(offset, offset + limit);

    // Get promise stats for each bot
    const botsWithStats = await Promise.all(
      paginatedBots.map(async (bot) => {
        const promises = await ctx.db
          .query("promises")
          .withIndex("by_provider", (q) => q.eq("providerBotId", bot._id))
          .collect();

        const listed = promises.length;
        const completed = promises.filter(
          (p) => p.state === "completed" || p.state === "settled"
        ).length;
        const successRate = listed > 0 ? completed / listed : 0;

        // Calculate total earnings from settled promises
        const totalEarnings = promises
          .filter((p) => p.state === "settled" && p.consumerBotId)
          .reduce((sum, p) => sum + p.pricingTerms.price, 0);

        // Remove sensitive fields
        const { apiKeyHash, email, ...publicData } = bot;

        return {
          ...publicData,
          name: bot.displayName,
          description: `Bot with reputation ${bot.reputationScore}`,
          reputation: bot.reputationScore,
          tier: bot.reputationScore >= 500 ? "expert" : "beginner",
          isActive: bot.emailVerified,
          isVerified: bot.verificationStatus === "verified",
          stats: {
            promisesListed: listed,
            promisesCompleted: completed,
            successRate: Math.round(successRate * 100) / 100,
            totalEarnings,
          },
        };
      })
    );

    return {
      bots: botsWithStats,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  },
});

/**
 * Search public agents by name or description
 * Used by: GET /api/agents?search={query}
 */
export const searchPublic = query({
  args: {
    search: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    tier: v.optional(v.union(v.literal("beginner"), v.literal("expert"))),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.search.toLowerCase().trim();
    const limit = Math.min(args.limit ?? 20, 100);
    const offset = Math.max(args.offset ?? 0, 0);

    if (!searchQuery) {
      return { bots: [], total: 0, limit, offset, hasMore: false };
    }

    // Get all bots and filter by search
    const allBots = await ctx.db.query("bots").collect();

    let filteredBots = allBots.filter((bot) => {
      const nameMatch = bot.displayName.toLowerCase().includes(searchQuery);
      const descriptionMatch = bot.email?.toLowerCase().includes(searchQuery) ?? false;
      return nameMatch || descriptionMatch;
    });

    // Apply tier filter if specified
    if (args.tier) {
      filteredBots = filteredBots.filter((bot) => {
        const botTier = bot.reputationScore >= 500 ? "expert" : "beginner";
        return botTier === args.tier;
      });
    }

    // Sort by reputation (highest first)
    filteredBots.sort((a, b) => b.reputationScore - a.reputationScore);

    const total = filteredBots.length;
    const paginatedBots = filteredBots.slice(offset, offset + limit);

    // Get stats for each bot
    const botsWithStats = await Promise.all(
      paginatedBots.map(async (bot) => {
        const promises = await ctx.db
          .query("promises")
          .withIndex("by_provider", (q) => q.eq("providerBotId", bot._id))
          .collect();

        const listed = promises.length;
        const completed = promises.filter(
          (p) => p.state === "completed" || p.state === "settled"
        ).length;
        const successRate = listed > 0 ? completed / listed : 0;
        const totalEarnings = promises
          .filter((p) => p.state === "settled" && p.consumerBotId)
          .reduce((sum, p) => sum + p.pricingTerms.price, 0);

        const { apiKeyHash, email, ...publicData } = bot;

        return {
          ...publicData,
          name: bot.displayName,
          description: `Bot with reputation ${bot.reputationScore}`,
          reputation: bot.reputationScore,
          tier: bot.reputationScore >= 500 ? "expert" : "beginner",
          isActive: bot.emailVerified,
          isVerified: bot.verificationStatus === "verified",
          stats: {
            promisesListed: listed,
            promisesCompleted: completed,
            successRate: Math.round(successRate * 100) / 100,
            totalEarnings,
          },
        };
      })
    );

    return {
      bots: botsWithStats,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  },
});

/**
 * Get public profile for a specific agent by name
 * Used by: GET /api/agents/{name}/profile
 */
export const getPublicProfileByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db
      .query("bots")
      .filter((q) => q.eq(q.field("displayName"), args.name))
      .first();

    if (!bot) {
      return null;
    }

    // Get promise stats
    const promises = await ctx.db
      .query("promises")
      .withIndex("by_provider", (q) => q.eq("providerBotId", bot._id))
      .collect();

    const listed = promises.length;
    const completed = promises.filter(
      (p) => p.state === "completed" || p.state === "settled"
    ).length;
    const successRate = listed > 0 ? completed / listed : 0;
    const totalEarnings = promises
      .filter((p) => p.state === "settled" && p.consumerBotId)
      .reduce((sum, p) => sum + p.pricingTerms.price, 0);

    // Remove sensitive fields
    const { apiKeyHash, email, ...publicData } = bot;

    return {
      ...publicData,
      name: bot.displayName,
      description: `Bot with reputation ${bot.reputationScore}`,
      reputation: bot.reputationScore,
      tier: bot.reputationScore >= 500 ? "expert" : "beginner",
      isActive: bot.emailVerified,
      isVerified: bot.verificationStatus === "verified",
      createdAt: bot.createdAt,
      stats: {
        promisesListed: listed,
        promisesCompleted: completed,
        successRate: Math.round(successRate * 100) / 100,
        totalEarnings,
      },
    };
  },
});
