import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Admin: Deposit tokens to a wallet
 */
export const adminDeposit = mutation({
  args: {
    botId: v.id("bots"),
    amount: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // Find wallet
      let wallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.botId))
        .unique();

      if (!wallet) {
        // Create wallet if doesn't exist
        await ctx.db.insert("wallets", {
          botId: args.botId,
          balance: args.amount,
          lockedBalance: 0,
          createdAt: Date.now(),
        });
      } else {
        // Update existing wallet
        await ctx.db.patch(wallet._id, {
          balance: wallet.balance + args.amount,
        });
      }

      // Record transaction
      await ctx.db.insert("transactions", {
        type: "deposit",
        amount: args.amount,
        toWalletId: wallet?._id,
        metadata: { reason: "admin deposit" },
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

/**
 * Transfer tokens between wallets
 */
export const transfer = mutation({
  args: {
    fromBotId: v.id("bots"),
    toBotId: v.id("bots"),
    amount: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const fromWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.fromBotId))
        .unique();

      const toWallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.toBotId))
        .unique();

      if (!fromWallet) {
        return { success: false, error: "Source wallet not found" };
      }

      if (!toWallet) {
        return { success: false, error: "Destination wallet not found" };
      }

      if (fromWallet.balance < args.amount) {
        return { success: false, error: "Insufficient balance" };
      }

      // Deduct from source
      await ctx.db.patch(fromWallet._id, {
        balance: fromWallet.balance - args.amount,
      });

      // Add to destination
      await ctx.db.patch(toWallet._id, {
        balance: toWallet.balance + args.amount,
      });

      // Record transactions
      await ctx.db.insert("transactions", {
        type: "transfer_out",
        amount: args.amount,
        fromWalletId: fromWallet._id,
        toWalletId: toWallet._id,
        timestamp: Date.now(),
      });

      await ctx.db.insert("transactions", {
        type: "transfer_in",
        amount: args.amount,
        fromWalletId: fromWallet._id,
        toWalletId: toWallet._id,
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

/**
 * Lock balance in wallet (for escrow/stake)
 */
export const lockBalance = mutation({
  args: {
    botId: v.id("bots"),
    amount: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const wallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.botId))
        .unique();

      if (!wallet) {
        return { success: false, error: "Wallet not found" };
      }

      const availableBalance = wallet.balance - wallet.lockedBalance;
      if (availableBalance < args.amount) {
        return { success: false, error: "Insufficient available balance" };
      }

      await ctx.db.patch(wallet._id, {
        lockedBalance: wallet.lockedBalance + args.amount,
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
 * Unlock balance in wallet (release escrow/stake)
 */
export const unlockBalance = mutation({
  args: {
    botId: v.id("bots"),
    amount: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const wallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.botId))
        .unique();

      if (!wallet) {
        return { success: false, error: "Wallet not found" };
      }

      if (wallet.lockedBalance < args.amount) {
        return { success: false, error: "Insufficient locked balance" };
      }

      await ctx.db.patch(wallet._id, {
        lockedBalance: wallet.lockedBalance - args.amount,
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
 * Withdraw tokens from wallet
 */
export const withdraw = mutation({
  args: {
    botId: v.id("bots"),
    amount: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const wallet = await ctx.db
        .query("wallets")
        .withIndex("by_bot", (q) => q.eq("botId", args.botId))
        .unique();

      if (!wallet) {
        return { success: false, error: "Wallet not found" };
      }

      const availableBalance = wallet.balance - wallet.lockedBalance;
      if (availableBalance < args.amount) {
        return { success: false, error: "Insufficient balance" };
      }

      await ctx.db.patch(wallet._id, {
        balance: wallet.balance - args.amount,
      });

      // Record transaction
      await ctx.db.insert("transactions", {
        type: "withdraw",
        amount: args.amount,
        fromWalletId: wallet._id,
        metadata: { reason: "user withdrawal" },
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
