---
id: ROAD-012
title: Promise Creation
status: proposed
created: "2026-01-31"
phase: 3
priority: Critical
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-012
    status: draft
  nfrs:
    applicable: [NFR-PERF-001, NFR-SEC-001, NFR-A11Y-001]
    status: pending
blocks: [ROAD-013, ROAD-016]
depends_on: [ROAD-001, ROAD-002, ROAD-003, ROAD-004, ROAD-008]
blocked_by: []
plans: []
---

# ROAD-012: Promise Creation

## Description
Core marketplace for promise trading. Enables providers to create AI compute service promises with validated specifications and pricing terms.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Promise aggregate implementation
- [ ] Promise specification validation
- [ ] Pricing terms validation
- [ ] Create promise mutation
- [ ] Promise creation UI form

## Dependencies
- Depends on: ROAD-001 (Project Setup), ROAD-002 (DDD Documentation), ROAD-003 (Database Schema), ROAD-004 (Bot Registration), ROAD-008 (Basic Token Operations)
- Blocks: ROAD-013 (Promise Listing), ROAD-016 (Promise Acceptance)

## Related
- [ROADMAP.mdx](../ROADMAP.mdx)
- Phase: 3 - Promise Market
- Priority: Critical
- Related to: [ROAD-037](../roads/ROAD-037.md) (Agent Task Bounty Marketplace)
