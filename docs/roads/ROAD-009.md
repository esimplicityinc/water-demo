---
id: ROAD-009
title: Commitment Management
status: nfr_validating
created: "2026-01-31"
phase: 2
priority: Critical
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T10:00:00Z"
  bdd:
    id: BDD-009
    status: approved
  nfrs:
    applicable: [NFR-PERF-001, NFR-SEC-001, NFR-A11Y-001]
    status: validating
    results:
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-customer"
      NFR-SEC-001:
        status: pass
        validated_by: "@security-customer"
      NFR-A11Y-001:
        status: pass
        validated_by: "@a11y-customer"
blocks: [ROAD-011, ROAD-016, ROAD-017, ROAD-019]
depends_on: [ROAD-001, ROAD-002, ROAD-003, ROAD-008]
blocked_by: []
plans: []
---

# ROAD-009: Commitment Management

## Description
Holdback system for secure trading. Implements a state machine for managing locked funds during commitment execution, ensuring secure token transfers between parties.

## Status
🔄 **Iterating**

## Acceptance Criteria
- [x] Holdback aggregate with state machine (CREATED → EXECUTING → COMPLETED → CLOSED)
- [x] Value objects: HoldbackId, HoldbackState, LockedFunds, StakeLock
- [x] Domain events: HoldbackCreated, TokensLocked, ExecutionStarted, ExecutionCompleted, HoldbackReleased, HoldbackReturned, HoldbackDisputed, ExecutionFailed
- [x] Application use cases: Create, StartExecution, CompleteExecution, Release, Return, RaiseDispute
- [x] Convex infrastructure: 6 mutations, 5 queries
- [x] BDD scenarios: 22 test scenarios (4 feature files)
- [x] BDD step definitions: 56 steps implemented
- [ ] API routes for holdback endpoints (pending)
- [ ] BDD tests passing (blocked by missing routes)
- [ ] Holdback UI visualization (Phase 5)

## Dependencies
- Depends on: ROAD-001 (Project Setup), ROAD-002 (DDD Documentation), ROAD-003 (Database Schema), ROAD-008 (Basic Token Operations)
- Blocks: ROAD-011 (Crypto Bridge), ROAD-016 (Commitment Acceptance), ROAD-017 (Commitment Execution), ROAD-019 (Billing Process)

## Related
- [ROADMAP.mdx](../ROADMAP.mdx)
- Phase: 2 - Token Management
- Priority: Critical
- Related Changes: [CHANGE-009](../changelog/CHANGE-009.md)
