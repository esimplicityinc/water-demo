---
id: ROAD-002
title: Database Schema
status: complete
created: "2026-01-31"
started: "2026-01-31"
completed: "2026-01-31"
phase: 0
priority: High
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    compliance_check:
      - adr: "ADR-001"
        compliant: true
        notes: "Documentation structure aligned with architecture"
      - adr: "ADR-004"
        compliant: true
        notes: "DDD patterns documented"
      - adr: "ADR-005"
        compliant: true
        notes: "Hexagonal architecture reference documented"
  bdd:
    id: BDD-002
    status: approved
    file: "bdd/features/ui/documentation-validation.feature"
    approved_by:
      - customer: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - customer: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
    test_results:
      total: 12
      passed: 12
      failed: 0
  nfrs:
    applicable:
      - NFR-A11Y-001
      - NFR-DOC-001
    status: pass
    results:
      NFR-A11Y-001:
        status: pass
        validated_by: "@a11y-customer"
      NFR-DOC-001:
        status: pass
        validated_by: "@doc-customer"
blocks: []
depends_on:
  - ROAD-001
blocked_by: []
plans:
  - "2026-01-31-ddd-documentation-plan.md"
related_changes:
  - "CHANGE-003"
  - "CHANGE-004"
---

# ROAD-002: Database Schema

## Overview

Create comprehensive Domain-Driven Design documentation for the AquaTrack platform.

## Goal

Establish clear domain boundaries, ubiquitous language, and architectural patterns.

## Description

Document the entire domain model including bounded contexts, aggregates, entities, value objects, and domain events to ensure consistent implementation across the codebase.

## Acceptance Criteria

- [x] Domain overview completed
- [x] Bounded contexts defined
- [x] Ubiquitous language glossary created
- [x] Aggregates and entities documented
- [x] Value objects catalogued
- [x] Domain events catalog created
- [x] Use cases documented
- [x] Context map generated
- [x] Architecture decisions (24 ADRs) documented
- [x] Docusaurus documentation site configured

## Technical Details

### Documentation Structure
```
docs/
├── ddd/
│   ├── 01-overview.md
│   ├── 02-bounded-contexts.md
│   ├── 03-ubiquitous-language.md
│   ├── 04-aggregates.md
│   ├── 05-value-objects.md
│   ├── 06-domain-events.md
│   └── 07-use-cases.md
├── adrs/
│   └── adr-XXX.md (24 total)
└── README.md
```

### Bounded Contexts
1. **Customer Identity** - Customer enrollment, customer portal authentication, profiles
2. **Token Management** - Accounts, transactions, holdback
3. **Commitment Market** - Commitment creation, listing, trading
4. **Billing** - Verification, disputes, payouts
5. **Account standing** - Scoring, leaderboards, badges

### Key Aggregates
- `CustomerAccount` - Customer identity and customer portal authentication
- `Account` - Token balances and transactions
- `Commitment` - Trading commitments
- `Holdback` - Secure transaction handling
- `Account standing` - Customer performance tracking

## Implementation Notes

All documentation follows DDD principles:
- Clear language boundaries between contexts
- Consistent terminology (ubiquitous language)
- Event-driven architecture patterns
- Hexagonal architecture structure

## Related Documentation

- [Domain Overview](./../ddd/01-overview.md)
- [Bounded Contexts](./../ddd/02-bounded-contexts.md)
- [Ubiquitous Language](./../ddd/03-ubiquitous-language.md)
- [ADR Directory](./../adrs/)

## Verification

Documentation site accessible at:
```bash
just docs
```

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @ddd-aligner | Domain Model | 2026-01-31T09:00:00Z |
| @arch-inspector | Architecture | 2026-01-31T09:30:00Z |
| @doc-customer | Documentation | 2026-01-31T10:00:00Z |
| @dev-customer | Implementation | 2026-01-31T10:30:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
