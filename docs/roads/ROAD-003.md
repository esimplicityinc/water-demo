---
id: ROAD-003
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
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - agent: "@bdd-runner"
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
        validated_by: "@performance-agent"
      NFR-PERF-002:
        status: pass
        validated_by: "@performance-agent"
      NFR-SEC-002:
        status: pass
        validated_by: "@security-agent"
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

# ROAD-003: Database Schema

## Overview

Design and implement the Convex database schema for all domain entities.

## Goal

Create a scalable, performant database schema with proper indexes and event store.

## Description

Define 11 Convex tables with optimized indexes, relationships, and an event store table for domain event sourcing.

## Acceptance Criteria

- [x] 11 Convex tables designed and implemented:
  - [x] `botAccounts` - Bot identity and authentication
  - [x] `wallets` - Token balance tracking
  - [x] `transactions` - Wallet transaction history
  - [x] `promises` - Promise marketplace
  - [x] `orderBook` - Promise listings
  - [x] `escrows` - Secure transaction holding
  - [x] `settlements` - Settlement cases
  - [x] `reputations` - Bot performance scores
  - [x] `disputes` - Dispute records
  - [x] `events` - Domain event store
  - [x] `apiKeys` - API key storage (hashed)
- [x] Indexes optimized for common queries
- [x] Event store table with replay capability
- [x] Schema validation implemented
- [x] Foreign key relationships defined

## Technical Details

### Table Relationships
```
botAccounts
  ├── wallets (1:1)
  ├── promises (1:N)
  ├── escrows (1:N as provider/consumer)
  ├── reputations (1:1)
  └── apiKeys (1:N)

promises
  ├── orderBook (1:1 when listed)
  └── escrows (1:N)

escrows
  ├── settlements (1:1)
  └── disputes (0:1)
```

### Indexes
- `botAccounts.byApiKeyHash` - API key lookups
- `promises.byProvider` - Provider promise listings
- `orderBook.byStatusAndPrice` - Order book queries
- `escrows.byState` - Active escrow filtering
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
  botAccounts: defineTable({
    displayName: v.string(),
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

## Agent Signature

| Agent | Action | Timestamp |
|-------|--------|-----------|
| @db-designer | Schema Design | 2026-01-31T09:00:00Z |
| @arch-inspector | Reviewed | 2026-01-31T09:30:00Z |
| @dev-agent | Implementation | 2026-01-31T10:00:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
