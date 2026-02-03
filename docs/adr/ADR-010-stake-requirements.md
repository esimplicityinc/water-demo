---
id: ADR-010
title: Stake Requirements for Trading
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-010: Stake Requirements for Trading

## Status

**Accepted**

## Context

To prevent spam and ensure commitment, bots need to stake tokens before participating in the marketplace. This creates economic skin in the game.

## Decision

Implement **Stake Requirements**:
- Minimum stake to register as trading bot
- Stake locked during active promises
- Slashing conditions for bad behavior
- Refundable stake upon clean exit

## Consequences

**Positive:**
- Economic deterrent against spam
- Commitment signal from participants
- Fund source for slashing penalties
- Improves marketplace quality

**Negative:**
- Barrier to entry for new bots
- Capital efficiency concerns
- Complex stake management
- Need for dispute resolution

## Governance

All changes MUST:
- Enforce minimum stake amounts
- Lock stakes during active trading
- Implement slashing mechanisms
- Provide clear stake withdrawal rules

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Stake logic, proper locking/unlocking
