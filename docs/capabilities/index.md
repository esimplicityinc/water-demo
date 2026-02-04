---
sidebar_position: 1
title: System Capabilities Overview
---

# System Capabilities

Capabilities are **cross-cutting system abilities** that span multiple bounded contexts and use cases. They represent the infrastructure and platform services that enable user stories to function.

## What is a Capability?

A capability is a **system-level function** that:
- Spans multiple bounded contexts
- Supports multiple user stories
- Has defined NFR requirements
- Can be tested independently via BDD tags

```mermaid
graph TB
    subgraph "Capabilities"
        C1[CAP-001: customer portal authentication]
        C2[CAP-002: Usage logging]
        C3[CAP-003: Usage alerts]
        C4[CAP-004: Anomaly detection]
    end
    
    subgraph "Bounded Contexts"
        BC1[Customer Identity]
        BC2[Commitment Market]
        BC3[Token Management]
        BC4[Billing]
    end
    
    C1 --> BC1
    C1 --> BC2
    C1 --> BC3
    C1 --> BC4
    
    C2 --> BC1
    C2 --> BC2
    C2 --> BC3
    C2 --> BC4
    
    C3 --> BC2
    C3 --> BC4
    
    C4 --> BC1
    C4 --> BC2
```

## Capability Matrix

| Capability | ID | Description | NFR Requirements | BDD Tag |
|------------|----|-------------|------------------|---------|
| **customer portal authentication** | CAP-001 | Verify customer identity via Access tokens | NFR-SEC-001, NFR-SEC-002 | `@CAP-001` |
| **Usage logging** | CAP-002 | Record all state-changing operations | NFR-SEC-003, NFR-PERF-002 | `@CAP-002` |
| **Usage alerts** | CAP-003 | Push updates to connected clients | NFR-PERF-001, NFR-REL-001 | `@CAP-003` |
| **Anomaly detection** | CAP-004 | Prevent abuse and ensure fairness | NFR-PERF-003, NFR-SEC-004 | `@CAP-004` |
| **Holdback Management** | CAP-005 | Lock and release funds atomically | NFR-SEC-005, NFR-REL-002 | `@CAP-005` |
| **Account standing assessment** | CAP-006 | Compute standing scores | NFR-PERF-002 | `@CAP-006` |
| **Oracle Verification** | CAP-007 | Validate execution proofs | NFR-SEC-006, NFR-REL-003 | `@CAP-007` |

## Capability Dependencies

Capabilities can depend on other capabilities:

```mermaid
graph TD
    CAP001[CAP-001: customer portal authentication] --> CAP002[CAP-002: Usage logging]
    CAP001 --> CAP004[CAP-004: Anomaly detection]
    CAP003[CAP-003: Usage alerts] --> CAP001
    CAP005[CAP-005: Holdback Management] --> CAP002
    CAP006[CAP-006: Account standing assessment] --> CAP002
    CAP007[CAP-007: Oracle Verification] --> CAP002
    CAP007 --> CAP003
```

## Capability to Roadmap Mapping

Roadmap items can implement:

1. **New capabilities** - Add infrastructure (e.g., "Implement CAP-003 Usage alerts")
2. **Capability enhancements** - Extend existing capability to new contexts
3. **NFR violations** - Fix capability performance/security issues

| Roadmap Item | Type | Capabilities Affected |
|--------------|------|----------------------|
| ROAD-005 | Enhancement | CAP-001 |
| ROAD-007 | Enhancement | CAP-006 |
| ROAD-009 | New | CAP-005 |
| ROAD-018 | New | CAP-007 |

## Capability Testing

All capabilities have BDD tests tagged with `@CAP-XXX`:

```bash
# Test a specific capability
just bdd-tag @CAP-001

# Test all customer portal authentication scenarios
just bdd-tag @CAP-001

# Test usage logging across all features
just bdd-tag @CAP-002
```

## Capability Catalog

### Security Capabilities
- [CAP-001: customer portal authentication](./CAP-001-customer portal authentication) - Access token verification
- [CAP-004: Anomaly detection](./CAP-004-anomaly-detecting) - Abuse prevention

### Observability Capabilities  
- [CAP-002: Usage logging](./CAP-002-audit-logging) - Operation logging

### Communication Capabilities
- [CAP-003: Usage alerts](./CAP-003-real-time-alerts) - Live updates

### Business Capabilities
- [CAP-005: Holdback Management](./CAP-005-holdback-management) - Fund management
- [CAP-006: Account standing assessment](./CAP-006-account standing-calculation) - Scoring system
- [CAP-007: Oracle Verification](./CAP-007-oracle-verification) - Proof validation

---

**Related**: [User Stories](../user-stories/index) • [BDD Capability Tags](../mapping/capability-bdd-tags) • [DDD Use Cases](../ddd/07-use-cases)
