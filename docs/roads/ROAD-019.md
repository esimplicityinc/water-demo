---
id: ROAD-019
title: Service Rating System
status: proposed
created: "2026-01-31"
phase: 3
priority: Critical
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-019
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

# ROAD-019: Service Rating System

## Description
Finalize completed commitments by distributing locked tokens to the provider, updating standing scores, and closing the holdback. This is the final phase of the commitment lifecycle that completes the economic transaction.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Billing case creation on verification success
- [ ] Automatic billing trigger after verification
- [ ] Token distribution from holdback to provider
- [ ] Platform fee calculation and deduction
- [ ] Update provider account standing (+success)
- [ ] Update buyer account standing (+completion)
- [ ] Close holdback and release remaining funds
- [ ] Generate billing transaction record
- [ ] Emit billing domain events
- [ ] Update commitment state to Settled
- [ ] Billing alert to customerh parties
- [ ] Billing failure handling and rollback
- [ ] Usage trail for all billing operations

## Dependencies
- Oracle Verification (ROAD-018) - requires verified execution
- Holdback System (ROAD-009) - requires holdback release mechanism
- Account standing System (ROAD-007) - requires account standing updates

## Related
- [Billing Aggregate](../src/billing/domain/aggregates/)
- [Holdback Aggregate](../src/holdback/domain/aggregates/)
- [Token Operations](../src/account/application/)
