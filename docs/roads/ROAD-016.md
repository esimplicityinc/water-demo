---
id: ROAD-016
title: Promise Acceptance
status: proposed
created: "2026-01-31"
phase: 3
priority: Critical
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-016
    status: draft
  nfrs:
    applicable:
      - NFR-PERF-001
      - NFR-SEC-001
      - NFR-A11Y-001
    status: pending
blocks: []
depends_on: []
blocked_by: []
plans: []
---

# ROAD-016: Promise Acceptance

## Description
Allow buyers to accept a listed promise, triggering escrow creation and promise state transition from Listed to Accepted. This is the core marketplace transaction that creates a binding agreement between provider and buyer.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Accept promise mutation endpoint
- [ ] Validate buyer has sufficient funds
- [ ] Create escrow with locked funds
- [ ] Transition promise state: Listed → Accepted
- [ ] Update order book (remove from available listings)
- [ ] Generate acceptance transaction record
- [ ] Trigger escrow creation workflow
- [ ] Acceptance UI flow with terms confirmation
- [ ] Confirmation dialog with promise details
- [ ] Success notification with next steps
- [ ] Failure handling (insufficient funds, expired listing)
- [ ] Atomic operation (rollback on failure)

## Dependencies
- Promise Listing (ROAD-013) - requires listed promises
- Escrow System (ROAD-009) - requires escrow infrastructure
- Token Operations (ROAD-008) - requires wallet validation

## Related
- [Promise Aggregate](../src/promise/domain/aggregates/)
- [Escrow Aggregate](../src/escrow/domain/aggregates/)
