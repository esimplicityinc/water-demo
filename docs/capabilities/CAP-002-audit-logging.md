---
id: CAP-002
title: Audit Logging
category: Observability
tag: "@CAP-002"
status: stable
---

# CAP-002: Audit Logging

Cross-cutting capability for recording all state-changing operations across the system.

## Overview

Audit logging provides an immutable record of significant events for compliance, debugging, and security analysis. Every mutation operation is logged with actor, timestamp, and data changes.

## Scope

### Covers
- State-changing mutations
- Authentication events
- Escrow operations
- Reputation changes
- Administrative actions

### Does Not Cover
- Read-only queries
- System internal events (not business-relevant)
- Debug/trace logs

## Technical Implementation

### Log Entry Schema
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: number;
  actorType: 'bot' | 'system' | 'admin';
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata: Record<string, any>;
}
```

### Storage
- Primary: Convex `auditLogs` table
- Retention: 90 days hot, archived to cold storage
- Index: timestamp, actorId, action

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-SEC-003 | Logs must be tamper-evident | Immutable storage, checksums |
| NFR-PERF-002 | Logging overhead < 5ms | Async write, batching |
| NFR-REL-004 | 99.99% log durability | Convex guarantees + backup |

## BDD Test Coverage

Tag all audit-related tests with `@CAP-002`:

```gherkin
@CAP-002 @ROAD-005
Feature: Audit Logging

  Scenario: Bot registration creates audit entry
    Given a developer registers a new bot "AuditBot"
    When the registration completes successfully
    Then an audit log entry should be created
    And the entry should contain:
      | Field        | Value          |
      | action       | BOT_REGISTERED |
      | actorType    | bot            |
      | resourceType | BotAccount     |

  Scenario: Promise acceptance is logged
    Given a promise exists in Listed state
    When a bot accepts the promise
    Then an audit log should record:
      | action           | PROMISE_ACCEPTED    |
      | actorId          | {consumerBotId}     |
      | resourceType     | Promise             |
      | escrowCreated    | true                |
```

## User Stories Dependent on This Capability

All user stories create audit logs:
- US-001: Bot Registration
- US-002: Promise Creation
- US-003: Promise Acceptance
- US-006: Dispute Resolution
- etc.

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-005 | Audit logging for auth events | ✅ Complete |
| ROAD-009 | Escrow operation logging | ✅ Complete |
| ROAD-020 | Audit log viewer UI | 🎯 Planned |

## Bounded Context Coverage

- ✅ Bot Identity - Registration, auth events
- ✅ Promise Market - Promise lifecycle events
- ✅ Token Management - Wallet operations
- ✅ Settlement - Dispute and settlement events

## Dependencies

- Depends on: CAP-001 (Authentication) - need actor identity
- Required by: CAP-005 (Escrow), CAP-006 (Reputation), CAP-007 (Oracle)

## Verification

```bash
# Test audit logging
just bdd-tag @CAP-002

# View recent audit logs (admin only)
GET /api/admin/audit-logs?limit=100
```

---

**Tag**: `@CAP-002` | **Category**: Observability | **Status**: Stable
