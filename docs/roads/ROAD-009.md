---
id: ROAD-009
title: Escrow System
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
        validated_by: "@performance-agent"
      NFR-SEC-001:
        status: pass
        validated_by: "@security-agent"
      NFR-A11Y-001:
        status: pass
        validated_by: "@a11y-agent"
blocks: [ROAD-011, ROAD-016, ROAD-017, ROAD-019]
depends_on: [ROAD-001, ROAD-002, ROAD-003, ROAD-008]
blocked_by: []
plans: []
---

# ROAD-009: Escrow System

## Description
Escrow system for secure trading. Implements a state machine for managing locked funds during promise execution, ensuring secure token transfers between parties.

## Status
🔄 **Iterating**

## Acceptance Criteria
- [x] Escrow aggregate with state machine (CREATED → EXECUTING → COMPLETED → CLOSED)
- [x] Value objects: EscrowId, EscrowState, LockedFunds, StakeLock
- [x] Domain events: EscrowCreated, TokensLocked, ExecutionStarted, ExecutionCompleted, EscrowReleased, EscrowReturned, EscrowDisputed, ExecutionFailed
- [x] Application use cases: Create, StartExecution, CompleteExecution, Release, Return, RaiseDispute
- [x] Convex infrastructure: 6 mutations, 5 queries
- [x] BDD scenarios: 22 test scenarios (4 feature files)
- [x] BDD step definitions: 56 steps implemented
- [ ] API routes for escrow endpoints (pending)
- [ ] BDD tests passing (blocked by missing routes)
- [ ] Escrow UI visualization (Phase 5)

## Dependencies
- Depends on: ROAD-001 (Project Setup), ROAD-002 (DDD Documentation), ROAD-003 (Database Schema), ROAD-008 (Basic Token Operations)
- Blocks: ROAD-011 (Crypto Bridge), ROAD-016 (Promise Acceptance), ROAD-017 (Promise Execution), ROAD-019 (Settlement Process)

## Related
- [ROADMAP.mdx](../ROADMAP.mdx)
- Phase: 2 - Token Management
- Priority: Critical
- Related Changes: [CHANGE-009](../changelog/CHANGE-009.md)
