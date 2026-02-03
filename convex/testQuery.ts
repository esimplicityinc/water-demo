import { query } from "./_generated/server";
import { v } from "convex/values";

export const testGetEscrow = query({
  args: { escrowId: v.id("escrows") },
  handler: async (ctx, args) => {
    const escrow = await ctx.db.get(args.escrowId);
    console.log('[TEST QUERY] Escrow state:', escrow?.state);
    return escrow;
  },
});
