---
id: ROAD-016
title: Commitment Search
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

# ROAD-016: Commitment Search

## Description
Allow buyers to accept a listed commitment, triggering holdback creation and commitment state transition from Listed to Accepted. This is the core marketplace transaction that creates a binding agreement between provider and buyer.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Accept commitment mutation endpoint
- [ ] Validate buyer has sufficient funds
- [ ] Create holdback with locked funds
- [ ] Transition commitment state: Listed → Accepted
- [ ] Update order book (remove from available listings)
- [ ] Generate acceptance transaction record
- [ ] Trigger holdback creation workflow
- [ ] Acceptance UI flow with terms confirmation
- [ ] Confirmation dialog with commitment details
- [ ] Success alert with next steps
- [ ] Failure handling (insufficient funds, expired listing)
- [ ] Atomic operation (rollback on failure)

## Dependencies
- Commitment Listing (ROAD-013) - requires listed commitments
- Holdback System (ROAD-009) - requires holdback infrastructure
- Token Operations (ROAD-008) - requires account validation

## Related
- [Commitment Aggregate](../src/commitment/domain/aggregates/)
- [Holdback Aggregate](../src/holdback/domain/aggregates/)
