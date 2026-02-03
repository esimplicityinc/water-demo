import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

/**
 * Verify an API key and return the associated bot ID
 *
 * This action performs constant-time comparison by always hashing the input
 * and querying the database, regardless of whether a match is found.
 *
 * @param plainApiKey - The plaintext API key to verify
 * @returns The bot ID if found, null otherwise
 */
export const verifyApiKey = action({
  args: {
    plainApiKey: v.string(),
  },
  handler: async (ctx, args): Promise<{ botId: string | null }> => {
    // Hash the provided API key using SHA-256 (same algorithm as registration)
    const apiKeyHash = await hashApiKey(args.plainApiKey);

    // Query for bot by hash using the existing query
    const bot = await ctx.runQuery(api.botIdentity.queries.getBotByApiKey, {
      apiKeyHash,
    });

    // Return botId if found, null if not
    // Note: getBotByApiKey returns the bot document with _id field
    return { botId: bot?._id ?? null };
  },
});

/**
 * Update bot display name
 *
 * Updates the bot's display name and publishes a DisplayNameUpdated domain event.
 *
 * @param botId - The ID of the bot to update
 * @param displayName - The new display name
 * @returns Success status
 */
export const updateDisplayName = action({
  args: {
    botId: v.id("bots"),
    displayName: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // Get the current bot data
    const bot = await ctx.runQuery(api.botIdentity.queries.getBotById, {
      botId: args.botId,
    });

    if (!bot) {
      throw new Error("Bot not found");
    }

    // Validate display name
    if (!args.displayName || args.displayName.trim().length === 0) {
      throw new Error("Display name is required");
    }

    if (args.displayName.length < 3) {
      throw new Error("Display name must be at least 3 characters");
    }

    if (args.displayName.length > 32) {
      throw new Error("Display name must be 32 characters or less");
    }

    // Validate allowed characters (letters, numbers, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validNameRegex.test(args.displayName)) {
      throw new Error("Display name can only contain letters, numbers, hyphens, and underscores");
    }

    const trimmedName = args.displayName.trim();
    const oldDisplayName = bot.displayName;

    // Update the bot using a mutation
    await ctx.runMutation(api.botIdentity.mutations.updateBotDisplayName, {
      botId: args.botId,
      displayName: trimmedName,
    });

    // Publish DisplayNameUpdated domain event
    await ctx.runMutation(api.botIdentity.mutations.publishEvent, {
      eventType: "DisplayNameUpdated",
      aggregateType: "BotAccount",
      aggregateId: args.botId,
      data: {
        botId: args.botId,
        oldDisplayName,
        newDisplayName: trimmedName,
        updatedAt: Date.now(),
      },
    });

    return { success: true };
  },
});

/**
 * Verify bot email
 *
 * Marks the bot's email as verified and publishes an EmailVerified domain event.
 *
 * @param botId - The ID of the bot
 * @param token - The verification token
 * @returns Success status
 */
export const verifyEmail = action({
  args: {
    botId: v.id("bots"),
    token: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // In a real implementation, validate the token against stored tokens
    // For now, we'll accept any non-empty token as valid
    if (!args.token || args.token.length < 10) {
      throw new Error("Invalid or expired verification token");
    }

    const bot = await ctx.runQuery(api.botIdentity.queries.getBotById, {
      botId: args.botId,
    });

    if (!bot) {
      throw new Error("Bot not found");
    }

    if (!bot.email) {
      throw new Error("Bot has no email address");
    }

    if (bot.emailVerified) {
      throw new Error("Email is already verified");
    }

    // Update bot using mutation
    await ctx.runMutation(api.botIdentity.mutations.updateBotEmailVerified, {
      botId: args.botId,
      emailVerified: true,
      verificationStatus: "verified",
    });

    // Publish EmailVerified domain event
    await ctx.runMutation(api.botIdentity.mutations.publishEvent, {
      eventType: "EmailVerified",
      aggregateType: "BotAccount",
      aggregateId: args.botId,
      data: {
        botId: args.botId,
        email: bot.email,
        verifiedAt: Date.now(),
      },
    });

    return { success: true };
  },
});

/**
 * Update bot avatar
 *
 * Updates the bot's avatar URL and publishes an AvatarUpdated domain event.
 *
 * @param botId - The ID of the bot
 * @param avatarUrl - The URL of the new avatar
 * @returns Success status
 */
export const updateAvatar = action({
  args: {
    botId: v.id("bots"),
    avatarUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const bot = await ctx.runQuery(api.botIdentity.queries.getBotById, {
      botId: args.botId,
    });

    if (!bot) {
      throw new Error("Bot not found");
    }

    // Update bot using mutation
    await ctx.runMutation(api.botIdentity.mutations.updateBotAvatar, {
      botId: args.botId,
      avatarUrl: args.avatarUrl,
    });

    // Publish AvatarUpdated domain event
    await ctx.runMutation(api.botIdentity.mutations.publishEvent, {
      eventType: "AvatarUpdated",
      aggregateType: "BotAccount",
      aggregateId: args.botId,
      data: {
        botId: args.botId,
        avatarUrl: args.avatarUrl,
        updatedAt: Date.now(),
      },
    });

    return { success: true };
  },
});

/**
 * Remove bot avatar
 *
 * Removes the bot's avatar and publishes an AvatarRemoved domain event.
 *
 * @param botId - The ID of the bot
 * @returns Success status
 */
export const removeAvatar = action({
  args: {
    botId: v.id("bots"),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const bot = await ctx.runQuery(api.botIdentity.queries.getBotById, {
      botId: args.botId,
    });

    if (!bot) {
      throw new Error("Bot not found");
    }

    // Update bot using mutation
    await ctx.runMutation(api.botIdentity.mutations.updateBotAvatar, {
      botId: args.botId,
    });

    // Publish AvatarRemoved domain event
    await ctx.runMutation(api.botIdentity.mutations.publishEvent, {
      eventType: "AvatarRemoved",
      aggregateType: "BotAccount",
      aggregateId: args.botId,
      data: {
        botId: args.botId,
        removedAt: Date.now(),
      },
    });

    return { success: true };
  },
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Hash an API key using SHA-256
 *
 * Uses the same algorithm as the registration process in mutations.ts
 * to ensure consistent hashing across the application.
 */
async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
