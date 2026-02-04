---
id: ROAD-003
title: Authentication Infrastructure
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
      - adr: "ADR-003"
        compliant: true
        notes: "Convex schema properly designed"
      - adr: "ADR-006"
        compliant: true
        notes: "Event sourcing pattern implemented"
      - adr: "ADR-007"
        compliant: true
        notes: "Indexing strategy optimized"
  bdd:
    id: BDD-003
    status: approved
    file: "bdd/features/api/database-schema.feature"
    approved_by:
      - customer: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - customer: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
    test_results:
      total: 8
      passed: 8
      failed: 0
  nfrs:
    applicable:
      - NFR-PERF-001
      - NFR-PERF-002
      - NFR-SEC-002
    status: pass
    results:
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-customer"
      NFR-PERF-002:
        status: pass
        validated_by: "@performance-customer"
      NFR-SEC-002:
        status: pass
        validated_by: "@security-customer"
blocks: []
depends_on:
  - ROAD-001
  - ROAD-002
blocked_by: []
plans:
  - "2026-01-31-database-schema-plan.md"
related_changes:
  - "CHANGE-005"
  - "CHANGE-006"
---

# ROAD-003: Authentication Infrastructure

## Overview

Design and implement the Convex database schema for all domain entities.

## Goal

Create a scalable, performant database schema with proper indexes and event store.

## Description

Define 11 Convex tables with optimized indexes, relationships, and an event store table for domain event sourcing.

## Acceptance Criteria

- [x] 11 Convex tables designed and implemented:
  - [x] `customeraccounts` - Customer identity and customer portal authentication
  - [x] `accounts` - Token balance tracking
  - [x] `transactions` - Account transaction history
  - [x] `commitments` - Commitment marketplace
  - [x] `orderBook` - Commitment listings
  - [x] `holdbacks` - Secure transaction holding
  - [x] `billings` - Billing cases
  - [x] `account standings` - Customer performance scores
  - [x] `disputes` - Dispute records
  - [x] `events` - Domain event store
  - [x] `apiKeys` - Access token storage (hashed)
- [x] Indexes optimized for common queries
- [x] Event store table with replay capability
- [x] Schema validation implemented
- [x] Foreign key relationships defined

## Technical Details

### Table Relationships
```
customeraccounts
  ├── accounts (1:1)
  ├── commitments (1:N)
  ├── holdbacks (1:N as provider/consumer)
  ├── account standings (1:1)
  └── apiKeys (1:N)

commitments
  ├── orderBook (1:1 when listed)
  └── holdbacks (1:N)

holdbacks
  ├── billings (1:1)
  └── disputes (0:1)
```

### Indexes
- `customeraccounts.byApiKeyHash` - Access token lookups
- `commitments.byProvider` - Provider commitment listings
- `orderBook.byStatusAndPrice` - Order book queries
- `holdbacks.byState` - Active holdback filtering
- `events.byAggregate` - Event replay by aggregate

### Event Store
- Event sourcing pattern
- Immutable event log
- Aggregate replay capability
- Schema versioning support

## Implementation Notes

Schema uses Convex's type-safe validators:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customeraccounts: defineTable({
    customername: v.string(),
    apiKeyHash: v.string(),
    createdAt: v.number(),
  }).index("byApiKeyHash", ["apiKeyHash"]),
  // ... more tables
});
```

## Related Documentation

- [Convex Schema](./../convex/schema.ts)
- [Database Design ADR](./../adrs/adr-003-convex-selection.md)
- [Event Sourcing ADR](./../adrs/adr-006-event-sourcing.md)

## Verification

Schema deployed with:
```bash
just convex-deploy
```

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @db-designer | Schema Design | 2026-01-31T09:00:00Z |
| @arch-inspector | Reviewed | 2026-01-31T09:30:00Z |
| @dev-customer | Implementation | 2026-01-31T10:00:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
