---
id: ROAD-015
title: Service Discovery
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

# ROAD-015: Service Discovery

## Description
Browse, filter, and search available commitments in the marketplace. Enable buyers to discover AI compute services based on model type, pricing, provider account standing, and other criteria.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Browse commitments listing
- [ ] Filter by model type/variant
- [ ] Filter by price range
- [ ] Filter by provider account standing tier
- [ ] Search by keywords (provider name, model description)
- [ ] Sort options (price, account standing, recency)
- [ ] Pagination for large result sets
- [ ] Responsive grid layout
- [ ] Quick view commitment details
- [ ] Navigate to full commitment detail page

## Dependencies
- Commitment Creation (ROAD-012) - requires commitments to exist
- Order Book (ROAD-014) - requires listing infrastructure

## Related
- [Commitment Market Domain Documentation](./docs/ddd/)
- [Commitment Aggregate](../src/commitment/domain/aggregates/)
