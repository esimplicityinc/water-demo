import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get events by aggregate
 */
export const getEventsByAggregate = query({
  args: {
    aggregateType: v.string(),
    aggregateId: v.string(),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_aggregate", (q) =>
        q.eq("aggregateType", args.aggregateType).eq("aggregateId", args.aggregateId)
      )
      .collect();
    return events;
  },
});

/**
 * Get events by type
 */
export const getEventsByType = query({
  args: {
    eventType: v.string(),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_type", (q) => q.eq("eventType", args.eventType))
      .collect();
    return events;
  },
});

/**
 * Get events by aggregate and type
 */
export const getEventsByAggregateAndType = query({
  args: {
    aggregateId: v.string(),
    eventType: v.string(),
  },
  returns: v.object({
    events: v.array(v.any()),
  }),
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_aggregate", (q) =>
        q.eq("aggregateType", "Escrow").eq("aggregateId", args.aggregateId)
      )
      .filter((q) => q.eq(q.field("eventType"), args.eventType))
      .collect();
    return { events };
  },
});
