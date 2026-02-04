---
id: ADR-007
title: Hybrid Settlement Architecture
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-007: Hybrid Transfer Architecture

## Status

**Accepted**

## Context

Water transfers need to handle both fast, frequent small movements and slower, larger bulk transfers. A single transfer model cannot optimally serve both use cases.

## Decision

Use **Hybrid Transfer** model:
- Fast transfers for small volumes (immediate)
- Batch transfers for large volumes (periodic)
- Threshold-based transfer routing
- Configurable per-supplier transfer preferences

## Consequences

**Positive:**
- Optimizes for both speed and cost
- Reduces transaction costs for small transfers
- Maintains integrity for large transfers
- Flexible configuration per use case

**Negative:**
- Two code paths to maintain
- More complex transfer logic
- Reconciliation needed between models

## Governance

All changes MUST:
- Support both transfer models
- Implement proper threshold logic
- Track transfer method in audit trail
- Allow supplier configuration of preferences

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Transfer logic, proper threshold handling
