---
id: ADR-011
title: Order Book Style Market
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-011: Order Book Style Market

## Status

**Accepted**

## Context

The marketplace needs efficient price discovery and matching for compute promises. Different market mechanisms (auction, AMM, order book) have different trade-offs.

## Decision

Use **Order Book Style Market**:
- Limit orders for price control
- FIFO matching for fairness
- Bid/ask spread for price discovery
- Partial fill support

## Consequences

**Positive:**
- Transparent price discovery
- Fair matching (first come, first served)
- Efficient for standardized promises
- Familiar to traditional traders

**Negative:**
- Requires active market making
- Can have low liquidity initially
- Complexity of order book management
- Latency sensitive

## Governance

All changes MUST:
- Maintain order book integrity
- Enforce FIFO matching rules
- Support partial fills correctly
- Provide real-time order book updates

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Order book logic, matching algorithm
