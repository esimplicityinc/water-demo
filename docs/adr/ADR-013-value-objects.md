---
id: ADR-013
title: Value Objects for Domain Primitives
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-013: Value Objects for Domain Primitives

## Status

**Accepted**

## Context

Domain primitives (TokenAmount, Percentage, Duration, etc.) are used throughout the system. Without proper encapsulation, primitive obsession leads to:
- Scattered validation logic
- Inconsistent units and formats
- Runtime errors from invalid values
- Difficult to reason about code

## Decision

Use **Value Objects** for all domain primitives:
- Immutable by design
- Self-validating at construction
- Support operations (add, compare, etc.)
- Replaceable but never mutated
- Equal by value, not identity

Examples:
- `TokenAmount`: Validates non-negative, handles decimals
- `Percentage`: Validates 0-100 range
- `Duration`: Validates positive time spans
- `WalletAddress`: Validates format and checksum

## Consequences

**Positive:**
- Validation in one place
- Type safety for domain concepts
- Self-documenting code
- Cannot represent invalid states

**Negative:**
- More boilerplate for simple types
- Serialization/deserialization overhead
- Need to handle equality correctly

## Governance

All changes MUST:
- Use value objects for domain primitives
- Make value objects immutable
- Implement validation in constructor
- Support deep equality comparison
- Place in `src/shared/domain/value-objects/`

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Value object usage, immutability, validation logic
