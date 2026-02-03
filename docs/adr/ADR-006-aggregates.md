---
id: ADR-006
title: Aggregates as Consistency Boundaries
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-006: Aggregates as Consistency Boundaries

## Status

**Accepted**

## Context

In a distributed system, strong consistency across multiple entities is expensive and creates bottlenecks. We need clear boundaries for transactional consistency.

## Decision

Use **Aggregates** as consistency boundaries:
- One aggregate = one transactional boundary
- Aggregate root controls all access to child entities
- Reference other aggregates by ID only
- Eventually consistent across aggregates

## Consequences

**Positive:**
- Clear consistency boundaries
- Better performance (smaller transactions)
- Easier to reason about concurrency
- Natural sharding boundaries

**Negative:**
- Cannot transactionally update multiple aggregates
- May need saga pattern for complex operations
- More complex than simple CRUD

## Governance

All changes MUST:
- Design aggregates before entities
- Only reference other aggregates by ID
- Keep aggregates small (1-3 entities ideally)
- Use domain events to coordinate across aggregates

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Aggregate design, proper entity relationships
