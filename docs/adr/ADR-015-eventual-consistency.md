---
id: ADR-015
title: Eventual Consistency Between Contexts
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-015: Eventual Consistency Between Contexts

## Status

**Accepted**

## Context

Different bounded contexts (trading, settlement, identity) maintain their own data. Immediate consistency across contexts would require distributed transactions, which are complex and error-prone.

## Decision

Use **Eventual Consistency** between bounded contexts:
- Domain events as the source of truth
- Asynchronous event propagation
- Idempotent event handlers
- Compensation for failed operations
- Read models updated independently

Event flow:
1. Source context emits domain event
2. Event stored in outbox table
3. Event relay publishes to subscribers
4. Target contexts update their read models
5. Target contexts may emit their own events

## Consequences

**Positive:**
- Loose coupling between contexts
- Better availability
- Supports independent scaling
- Natural fit for DDD boundaries
- No distributed transaction coordination

**Negative:**
- Temporary inconsistency windows
- More complex testing scenarios
- Need for compensation logic
- Harder to reason about global state

## Governance

All changes MUST:
- Use domain events for cross-context communication
- Make event handlers idempotent
- Implement compensation for failures
- Design for eventual consistency from start
- Document consistency guarantees per operation

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Event flow, idempotency, compensation logic
