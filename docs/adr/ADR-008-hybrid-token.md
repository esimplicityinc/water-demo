---
id: ADR-008
title: Hybrid Token Model
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-008: Hybrid Token Model

## Status

**Accepted**

## Context

The platform needs tokens for both platform operations (utility) and value representation (settlements). Using one token type for both creates confusion.

## Decision

Use **Hybrid Token Model**:
- Platform tokens for internal operations and fees
- Settlement tokens for value transfer and trading
- Clear separation of concerns
- Conversion mechanisms between types

## Consequences

**Positive:**
- Clear separation of utility vs value
- Different inflation/Deflation policies possible
- Regulatory clarity (utility vs security)
- Flexible tokenomics per type

**Negative:**
- Two token systems to manage
- Conversion complexity
- User education needed
- Potential for confusion

## Governance

All changes MUST:
- Maintain clear separation of token types
- Document use cases for each token
- Implement secure conversion mechanisms
- Track token flows separately

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Token usage patterns, proper separation
