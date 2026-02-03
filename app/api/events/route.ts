import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convexServer";

export const dynamic = 'force-dynamic';

/**
 * GET /api/events
 * Query events by aggregateId and/or type
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const aggregateId = searchParams.get("aggregateId");
    const type = searchParams.get("type");
    
    if (aggregateId && type) {
      // Get events by aggregate and type
      const result = await convexClient.query(api.events.queries.getEventsByAggregateAndType, {
        aggregateId,
        eventType: type,
      });
      return NextResponse.json(result, { status: 200 });
    }
    
    if (aggregateId) {
      // Get events by aggregate
      const events = await convexClient.query(api.events.queries.getEventsByAggregate, {
        aggregateType: "Escrow",
        aggregateId,
      });
      return NextResponse.json({ events }, { status: 200 });
    }
    
    if (type) {
      // Get events by type
      const events = await convexClient.query(api.events.queries.getEventsByType, {
        eventType: type,
      });
      return NextResponse.json({ events }, { status: 200 });
    }
    
    return NextResponse.json(
      { error: "aggregateId or type parameter required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get events error:", error);
    const message = error instanceof Error ? error.message : "Failed to get events";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
