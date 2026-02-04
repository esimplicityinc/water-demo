---
id: ADR-008
title: Hybrid Token Model
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-008: Hybrid Resource Model

## Status

**Accepted**

## Context

The water management platform needs resources for both system operations (utility) and water quantity representation (transactions). Using one resource type for both creates confusion.

## Decision

Use **Hybrid Resource Model**:
- System credits for internal operations and platform fees
- Water units for water volume tracking and transfers
- Clear separation of concerns
- Conversion mechanisms between types (credits-to-water-units)

## Consequences

**Positive:**
- Clear separation of system operations vs water tracking
- Different pricing policies possible per resource type
- Regulatory clarity (operations vs resource management)
- Flexible resource economics per type

**Negative:**
- Two resource systems to manage
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
