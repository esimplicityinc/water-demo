---
id: ROAD-015
title: Promise Discovery
status: proposed
created: "2026-01-31"
phase: 3
priority: High
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-015
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

# ROAD-015: Promise Discovery

## Description
Browse, filter, and search available promises in the marketplace. Enable buyers to discover AI compute services based on model type, pricing, provider reputation, and other criteria.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Browse promises listing
- [ ] Filter by model type/variant
- [ ] Filter by price range
- [ ] Filter by provider reputation tier
- [ ] Search by keywords (provider name, model description)
- [ ] Sort options (price, reputation, recency)
- [ ] Pagination for large result sets
- [ ] Responsive grid layout
- [ ] Quick view promise details
- [ ] Navigate to full promise detail page

## Dependencies
- Promise Creation (ROAD-012) - requires promises to exist
- Order Book (ROAD-014) - requires listing infrastructure

## Related
- [Promise Market Domain Documentation](./docs/ddd/)
- [Promise Aggregate](../src/promise/domain/aggregates/)
