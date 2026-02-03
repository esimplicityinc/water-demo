---
id: ADR-005
title: Event-Driven Communication
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-005: Event-Driven Communication

## Status

**Accepted**

## Context

Bounded contexts need to communicate without creating tight coupling. Direct API calls between contexts create dependencies that make independent evolution difficult.

## Decision

Use **Domain Events** for inter-context communication:
- Events represent business facts (past tense)
- Asynchronous delivery via event bus
- Event consumers are independent of producers
- Event sourcing for audit trail

## Consequences

**Positive:**
- Loose coupling between contexts
- Better scalability (async processing)
- Audit trail of all state changes
- Temporal decoupling

**Negative:**
- Eventual consistency
- Complexity of event handling
- Need for idempotent consumers
- Debugging distributed flows is harder

## Governance

All changes MUST:
- Use domain events for cross-context communication
- Make events immutable and timestamped
- Handle events idempotently
- Include correlation IDs for tracing

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Event patterns, proper event naming (past tense)
