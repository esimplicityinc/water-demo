---
id: CAP-002
title: Usage Logging
category: Observability
tag: "@CAP-002"
status: stable
---

# CAP-002: Usage Logging

Cross-cutting capability for recording all state-changing operations across the system.

## Overview

Usage logging provides an immutable record of significant events for compliance, debugging, and security analysis. Every mutation operation is logged with actor, timestamp, and data changes.

## Scope

### Covers
- State-changing mutations
- customer portal authentication events
- Holdback operations
- Account standing changes
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
  actorType: 'customer' | 'system' | 'admin';
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
- Aquatrackry: Convex `auditLogs` table
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
Feature: Usage logging

  Scenario: Customer enrollment creates audit entry
    Given a developer enrolls a new customer "AuditCustomer"
    When the enrollment completes successfully
    Then an usage log entry should be created
    And the entry should contain:
      | Field        | Value          |
      | action       | CUSTOMER_ENROLLED |
      | actorType    | customer            |
      | resourceType | CustomerAccount     |

  Scenario: Commitment acceptance is logged
    Given a commitment exists in Listed state
    When a customer accepts the commitment
    Then an usage log should record:
      | action           | COMMITMENT_ACCEPTED    |
      | actorId          | {consumerCustomerid}     |
      | resourceType     | Commitment             |
      | holdbackCreated    | true                |
```

## User Stories Dependent on This Capability

All user stories create usage logs:
- US-001: Customer Enrollment
- US-002: Commitment Creation
- US-003: Commitment Acceptance
- US-006: Dispute Resolution
- etc.

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-005 | Usage logging for auth events | ✅ Complete |
| ROAD-009 | Holdback operation logging | ✅ Complete |
| ROAD-020 | Usage log viewer UI | 🎯 Planned |

## Bounded Context Coverage

- ✅ Customer Identity - Enrollment, auth events
- ✅ Commitment Market - Commitment lifecycle events
- ✅ Token Management - Account operations
- ✅ Billing - Dispute and billing events

## Dependencies

- Depends on: CAP-001 (customer portal authentication) - need actor identity
- Required by: CAP-005 (Holdback), CAP-006 (Account standing), CAP-007 (Oracle)

## Verification

```bash
# Test usage logging
just bdd-tag @CAP-002

# View recent usage logs (admin only)
GET /api/admin/audit-logs?limit=100
```

---

**Tag**: `@CAP-002` | **Category**: Observability | **Status**: Stable
