---
id: ADR-012
title: Promise Lifecycle States
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-012: Promise Lifecycle States

## Status

**Accepted**

## Context

Compute promises go through multiple states from creation to completion. Clear state management is critical for correct behavior and auditability.

## Decision

Define **Promise Lifecycle States**:
- Draft: Initial creation, not yet published
- Listed: Published and available for acceptance
- Accepted: Matched with consumer, pending execution
- Executing: Work in progress
- Completed: Successfully finished
- Failed: Execution failed, dispute possible
- Cancelled: Cancelled before execution
- Disputed: Under dispute resolution

## Consequences

**Positive:**
- Clear state transitions
- Auditability of promise history
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
