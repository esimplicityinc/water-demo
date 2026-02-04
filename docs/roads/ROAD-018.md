---
id: ROAD-018
title: Proof Verification
status: proposed
created: "2026-01-31"
phase: 3
priority: Critical
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-018
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

# ROAD-018: Proof Verification

## Description
Automated verification system that validates execution proofs submitted by providers. The oracle checks timestamps, cryptographic hashes, API logs, and other evidence to confirm commitment fulfillment before billing.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Execution proof validation logic
- [ ] Timestamp verification (execution within commitmentd window)
- [ ] Hash verification (result integrity)
- [ ] API log validation (external AI service calls)
- [ ] Automated verification workflow
- [ ] Verification result: Verified/Rejected/Needs Review
- [ ] Verification usage trail
- [ ] Oracle domain service implementation
- [ ] Integration with execution submission
- [ ] Verification timeout handling
- [ ] Edge case handling (partial completion, degraded service)
- [ ] Dispute escalation on verification failure

## Dependencies
- Commitment Execution (ROAD-017) - requires execution proofs
- Billing Process (ROAD-019) - triggers billing on verification

## Related
- [Oracle Domain Service](../src/billing/domain/services/)
- [Verification Domain Events](../src/billing/domain/events/)
- [Commitment Market ADRs](../docs/decisions/)
