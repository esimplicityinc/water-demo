---
id: ADR-014
title: Real-Time Order Book Updates
status: accepted
category: performance
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-014: Real-Time Order Book Updates

## Status

**Accepted**

## Context

The order book must reflect market state changes in real-time. Users need immediate visibility into:
- New orders being placed
- Orders being filled or cancelled
- Price movements
- Depth changes

Polling is inefficient and creates latency.

## Decision

Use **Convex Live Queries** for real-time order book updates:
- Subscriptions to order book state
- Automatic push updates on changes
- Optimistic UI updates
- Connection resilience with reconnection logic
- Throttled updates for high-frequency changes

Implementation:
- Server: Convex queries with proper indexing
- Client: `useQuery` with live query subscriptions
- Updates batched within 100ms windows

## Consequences

**Positive:**
- Sub-second latency for updates
- Reduced server load vs polling
- Better user experience
- Automatic synchronization

**Negative:**
- WebSocket connection overhead
- Complexity in handling reconnections
- Need for client-side state merging
- Potential for update flooding

## Governance

All changes MUST:
- Use Convex live queries for real-time data
- Implement proper indexing for query performance
- Handle reconnection gracefully
- Batch rapid updates client-side
- Document query performance characteristics

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Query patterns, subscription handling, performance metrics
