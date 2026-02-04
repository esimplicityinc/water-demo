---
id: ADR-011
title: Order Book Style Market
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-011: Request Matching Market

## Status

**Accepted**

## Context

The water marketplace needs efficient matching for water requests. Different market mechanisms (auction, AMM, request board) have different trade-offs.

## Decision

Use **Request Matching Market**:
- Typed requests with volume constraints
- FIFO matching for fairness
- Price range negotiation for discovery
- Partial fulfillment support

## Consequences

**Positive:**
- Transparent price discovery
- Fair matching (first come, first served)
- Efficient for water delivery requests
- Familiar to traditional water trading

**Negative:**
- Requires active supplier participation
- Can have low liquidity initially
- Complexity of request matching
- Latency sensitive

## Governance

All changes MUST:
- Maintain request board integrity
- Enforce FIFO matching rules
- Support partial fulfillments correctly
- Provide real-time request updates

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Request board logic, matching algorithm
