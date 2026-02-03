---
id: ADR-016
title: Convex Functions as Application Services
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-016: Convex Functions as Application Services

## Status

**Accepted**

## Context

Convex provides mutations, queries, and actions. We need a pattern that:
- Keeps business logic testable
- Avoids anemic domain models
- Maintains clean architecture boundaries
- Supports reuse across operations

## Decision

Use **Application Services** invoked from Convex functions:
- Application services orchestrate use cases
- Domain logic in aggregates and value objects
- Convex functions are thin adapters
- Services receive ports (repositories, publishers)
- No business logic in Convex files

Pattern:
```
Convex mutation → Application Service → Domain → Adapters
```

Convex functions handle:
- Request validation
- Authentication/authorization
- Transaction boundaries
- Service instantiation

Application services handle:
- Use case orchestration
- Domain object creation
- Event publishing

## Consequences

**Positive:**
- Business logic is framework-agnostic
- Services are testable without Convex
- Clear separation of concerns
- Can migrate backend if needed

**Negative:**
- More files and boilerplate
- Need to understand layer responsibilities
- Indirection can complicate simple operations

## Governance

All changes MUST:
- Keep Convex functions thin (< 30 lines)
- Implement use cases in application services
- Pass ports to services via constructor
- Not put business logic in Convex files
- Name services after use cases (e.g., `PlaceOrderService`)

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Layer separation, service responsibilities, testability
