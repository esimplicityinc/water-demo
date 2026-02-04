---
id: ADR-012
title: Water Request Lifecycle States
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-012: Water Request Lifecycle States

## Status

**Accepted**

## Context

Water requests go through multiple states from creation to completion. Clear state management is critical for correct behavior and auditability.

## Decision

Define **Water Request Lifecycle States**:
- Draft: Initial creation, not yet published
- Posted: Published and available for fulfillment
- Accepted: Matched with supplier, pending delivery
- InProgress: Delivery in progress
- Completed: Successfully delivered
- Failed: Delivery failed, dispute possible
- Cancelled: Cancelled before delivery
- Disputed: Under dispute resolution

## Consequences

**Positive:**
- Clear state transitions
- Auditability of request history
- Prevents invalid operations
- Supports complex workflows

**Negative:**
- State machine complexity
- Must handle all transition cases
- Need for state validation

## Governance

All changes MUST:
- Enforce valid state transitions
- Log all state changes with timestamps
- Prevent operations in invalid states
- Support state history queries

## Validation

**Enforced by:** `@arch-inspector`
**Check:** State machine logic, transition validation
