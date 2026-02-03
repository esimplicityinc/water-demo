---
id: ADR-007
title: Hybrid Settlement Architecture
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-007: Hybrid Settlement Architecture

## Status

**Accepted**

## Context

Settlement needs to handle both fast, frequent small trades and slower, larger settlements. A single settlement model cannot optimally serve both use cases.

## Decision

Use **Hybrid Settlement** model:
- Fast settlements for small amounts (immediate)
- Batch settlements for large amounts (periodic)
- Threshold-based settlement routing
- Configurable per-bot settlement preferences

## Consequences

**Positive:**
- Optimizes for both speed and cost
- Reduces gas fees for small trades
- Maintains security for large settlements
- Flexible configuration per use case

**Negative:**
- Two code paths to maintain
- More complex settlement logic
- Reconciliation needed between models

## Governance

All changes MUST:
- Support both settlement models
- Implement proper threshold logic
- Track settlement method in audit trail
- Allow bot configuration of preferences

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Settlement logic, proper threshold handling
