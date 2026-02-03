import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Register a new bot account
 *
 * Creates:
 * - Bot account with API key
 * - Wallet with zero balance
 * - BotRegistered domain event
 *
 * Returns the bot ID and API key (plaintext - only time it's returned!)
 */
export const registerBot = mutation({
  args: {
    displayName: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate display name
    if (!args.displayName || args.displayName.trim().length === 0) {
      throw new Error("Display name is required");
    }

    if (args.displayName.length > 50) {
      throw new Error("Display name must be 50 characters or less");
    }

    // Validate email if provided
    if (args.email && !isValidEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    // Check if display name is already taken
    const existing = await ctx.db
      .query("bots")
      .filter((q) => q.eq(q.field("displayName"), args.displayName.trim()))
      .first();

    if (existing) {
      throw new Error("Display name is already taken");
    }

    // Generate API key
    const apiKey = await generateApiKey();
    const apiKeyHash = await hashApiKey(apiKey);

    // Create bot account
    const botId = await ctx.db.insert("bots", {
      email: args.email,
      displayName: args.displayName.trim(),
      apiKeyHash,
      verificationStatus: "unverified",
      emailVerified: false,
      reputationScore: 100, // Default starting reputation
      stakeLock: {
        lockedAmount: 0,
        activePromises: [],
      },
      createdAt: Date.now(),
    });

    // Create wallet for the bot
    await ctx.db.insert("wallets", {
      botId,
      balance: 0,
      lockedBalance: 0,
      createdAt: Date.now(),
    });

    // Publish BotRegistered domain event
    await ctx.db.insert("events", {
      eventType: "BotRegistered",
      aggregateType: "BotAccount",
      aggregateId: botId,
      version: 1,
      data: {
        botId,
        displayName: args.displayName.trim(),
        email: args.email,
        reputationScore: 100,
      },
      occurredAt: Date.now(),
    });

    // Return bot ID and API key (only time the plaintext key is returned!)
    return {
      botId,
      apiKey,
      displayName: args.displayName.trim(),
      reputationScore: 100,
    };
  },
});

// ============================================================================
// Utility Functions
// ============================================================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a secure API key
 * Format: sk_<64 hex characters>
 */
async function generateApiKey(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const hex = Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sk_${hex}`;
}

/**
 * Record an authentication attempt
 *
 * Tracks successful and failed auth attempts for security monitoring
 * and rate limiting purposes. API key is hashed before storage.
 *
 * @param apiKey - The API key used in the attempt
 * @param success - Whether the authentication was successful
 * @param ip - Optional IP address of the requester
 */
export const recordAuthAttempt = mutation({
  args: {
    apiKey: v.string(),
    success: v.boolean(),
    ip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Hash the API key for storage (security - never store plaintext)
    const apiKeyHash = await hashApiKey(args.apiKey);

    // Store the auth attempt
    await ctx.db.insert("authAttempts", {
      apiKeyHash,
      ip: args.ip,
      success: args.success,
      attemptedAt: Date.now(),
    });

    return { recorded: true };
  },
});

/**
 * Regenerate API key for a bot
 *
 * Generates a new API key, invalidates the old one, and publishes
 * an ApiKeyRegenerated domain event.
 *
 * @param botId - The ID of the bot requesting a new key
 * @returns The new API key (plaintext - only time it's shown!)
 */
export const regenerateApiKey = mutation({
  args: {
    botId: v.id("bots"),
  },
  handler: async (ctx, args) => {
    // Verify bot exists
    const bot = await ctx.db.get(args.botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    // Generate new API key
    const newApiKey = await generateApiKey();
    const newApiKeyHash = await hashApiKey(newApiKey);

    // Update bot record with new hash
    await ctx.db.patch(args.botId, {
      apiKeyHash: newApiKeyHash,
    });

    // Publish ApiKeyRegenerated domain event
    await ctx.db.insert("events", {
      eventType: "ApiKeyRegenerated",
      aggregateType: "BotAccount",
      aggregateId: args.botId,
      version: 1,
      data: {
        botId: args.botId,
        displayName: bot.displayName,
      },
      occurredAt: Date.now(),
    });

    // Return the new plaintext API key (only time it's shown!)
    return {
      botId: args.botId,
      apiKey: newApiKey,
      displayName: bot.displayName,
    };
  },
});

/**
 * Update bot display name
 *
 * @param botId - The ID of the bot to update
 * @param displayName - The new display name
 */
export const updateBotDisplayName = mutation({
  args: {
    botId: v.id("bots"),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    await ctx.db.patch(args.botId, {
      displayName: args.displayName,
    });

    return { success: true };
  },
});

/**
 * Update bot email verified status
 *
 * @param botId - The ID of the bot
 * @param emailVerified - Whether the email is verified
 * @param verificationStatus - The verification status
 */
export const updateBotEmailVerified = mutation({
  args: {
    botId: v.id("bots"),
    emailVerified: v.boolean(),
    verificationStatus: v.union(v.literal("unverified"), v.literal("verified")),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    await ctx.db.patch(args.botId, {
      emailVerified: args.emailVerified,
      verificationStatus: args.verificationStatus,
    });

    return { success: true };
  },
});

/**
 * Update bot avatar
 *
 * @param botId - The ID of the bot
 * @param avatarUrl - The URL of the avatar (null to remove)
 */
export const updateBotAvatar = mutation({
  args: {
    botId: v.id("bots"),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    if (args.avatarUrl === undefined) {
      // Remove avatar
      await ctx.db.patch(args.botId, {
        avatarUrl: undefined,
      });
    } else {
      await ctx.db.patch(args.botId, {
        avatarUrl: args.avatarUrl,
      });
    }

    return { success: true };
  },
});

/**
 * Publish a domain event
 *
 * @param eventType - The type of event
 * @param aggregateType - The aggregate type
 * @param aggregateId - The aggregate ID
 * @param data - The event data
 */
export const publishEvent = mutation({
  args: {
    eventType: v.string(),
    aggregateType: v.string(),
    aggregateId: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", {
      eventType: args.eventType,
      aggregateType: args.aggregateType,
      aggregateId: args.aggregateId,
      version: 1,
      data: args.data,
      occurredAt: Date.now(),
    });

    return { success: true };
  },
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Hash an API key using SHA-256
 */
async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
