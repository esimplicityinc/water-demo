---
id: CAP-003
title: Usage Alerts
category: Communication
tag: "@CAP-003"
status: planned
---

# CAP-003: Usage Alerts

Cross-cutting capability for pushing live updates to connected clients.

## Overview

Usage alerts enable customers and users to receive immediate updates about events they're interested in, without polling. Uses WebSocket subscriptions via Convex.

## Scope

### Covers
- WebSocket connection management
- Event subscription filtering
- Push delivery to connected clients
- Subscription lifecycle management

### Does Not Cover
- Email alerts (separate system)
- SMS/push alerts (mobile app)

## Technical Implementation

### Architecture
```
┌─────────────┐     WebSocket      ┌──────────────┐
│   Client    │◄──────────────────►│   Convex     │
│  (Browser)  │    Subscription    │   Server     │
└─────────────┘                    └──────┬───────┘
                                          │
                                          │ Pub/Sub
                                          ▼
                                    ┌──────────────┐
                                    │   Event      │
                                    │   Stream     │
                                    └──────────────┘
```

### Subscription Types
```typescript
interface Alertsubscription {
  customerid: string;
  eventTypes: (
    | 'COMMITMENT_MATCHED'
    | 'HOLDBACK_UPDATED'
    | 'BILLING_COMPLETED'
    | 'ACCOUNT STANDING_CHANGED'
    | 'DISPUTE_STATUS'
  )[];
  filters?: {
    commitmentId?: string;
    context?: string;
  };
}
```

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-PERF-001 | Latency < 100ms | WebSocket direct |
| NFR-REL-001 | 99.9% delivery | Retry logic |
| NFR-SCA-001 | 10k concurrent | Horizontal scaling |

## BDD Test Coverage

Tag all real-time tests with `@CAP-003`:

```gherkin
@CAP-003 @ROAD-023
Feature: Usage alerts

  Scenario: Customer receives alert on commitment match
    Given a customer "Provider" has a listed commitment
    And a customer "Consumer" creates matching demand
    When the system matches the commitment
    Then "Provider" should receive a real-time alert
    And the alert should contain:
      | Field       | Value              |
      | type        | COMMITMENT_MATCHED    |
      | commitmentId   | {commitmentId}        |
      | consumerId  | {consumerCustomerid}    |

  Scenario: Holdback status updates pushed to parties
    Given an active holdback exists
    When the holdback transitions to EXECUTING state
    Then customerh parties should receive alerts
    And the alert should include the new state
```

## User Stories Dependent on This Capability

- US-005: Commitment Matching - Alerts when matches occur
- US-008: Billing Tracking - Live billing updates
- US-009: Dispute Alerts - Real-time dispute alerts

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-023 | WebSocket infrastructure | 🎯 Planned |
| ROAD-021 | Dashboard real-time updates | 🎯 Planned |
| ROAD-014 | Order book live updates | 🎯 Planned |

## Bounded Context Coverage

- 🎯 Commitment Market - Match alerts
- 🎯 Billing - Billing updates
- 🎯 Token Management - Transaction confirmations

## Dependencies

- Depends on: CAP-001 (customer portal authentication) - secure connections
- Required by: None (leaf capability)

## Verification

```bash
# Test usage alerts
just bdd-tag @CAP-003

# Start WebSocket test client
just test-websocket
```

---

**Tag**: `@CAP-003` | **Category**: Communication | **Status**: Planned
