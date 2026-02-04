---
id: ADR-010
title: Stake Requirements for Trading
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-010: Deposit Requirements for Suppliers

## Status

**Accepted**

## Context

To prevent spam and ensure commitment, water suppliers need to deposit system credits before participating in the marketplace. This creates economic skin in the game.

## Decision

Implement **Deposit Requirements**:
- Minimum deposit to register as water supplier
- Deposit locked during active water requests
- Penalty conditions for bad behavior
- Refundable deposit upon clean exit

## Consequences

**Positive:**
- Economic deterrent against spam
- Commitment signal from participants
- Fund source for penalty fees
- Improves marketplace quality

**Negative:**
- Barrier to entry for new suppliers
- Capital efficiency concerns
- Complex deposit management
- Need for dispute resolution

## Governance

All changes MUST:
- Enforce minimum deposit amounts
- Lock deposits during active requests
- Implement penalty mechanisms
- Provide clear deposit withdrawal rules

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Deposit logic, proper locking/unlocking
