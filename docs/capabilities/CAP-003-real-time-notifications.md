---
id: CAP-003
title: Real-time Notifications
category: Communication
tag: "@CAP-003"
status: planned
---

# CAP-003: Real-time Notifications

Cross-cutting capability for pushing live updates to connected clients.

## Overview

Real-time notifications enable bots and users to receive immediate updates about events they're interested in, without polling. Uses WebSocket subscriptions via Convex.

## Scope

### Covers
- WebSocket connection management
- Event subscription filtering
- Push delivery to connected clients
- Subscription lifecycle management

### Does Not Cover
- Email notifications (separate system)
- SMS/push notifications (mobile app)

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
interface NotificationSubscription {
  botId: string;
  eventTypes: (
    | 'PROMISE_MATCHED'
    | 'ESCROW_UPDATED'
    | 'SETTLEMENT_COMPLETED'
    | 'REPUTATION_CHANGED'
    | 'DISPUTE_STATUS'
  )[];
  filters?: {
    promiseId?: string;
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
Feature: Real-time Notifications

  Scenario: Bot receives notification on promise match
    Given a bot "Provider" has a listed promise
    And a bot "Consumer" creates matching demand
    When the system matches the promise
    Then "Provider" should receive a real-time notification
    And the notification should contain:
      | Field       | Value              |
      | type        | PROMISE_MATCHED    |
      | promiseId   | {promiseId}        |
      | consumerId  | {consumerBotId}    |

  Scenario: Escrow status updates pushed to parties
    Given an active escrow exists
    When the escrow transitions to EXECUTING state
    Then both parties should receive notifications
    And the notification should include the new state
```

## User Stories Dependent on This Capability

- US-005: Promise Matching - Notifications when matches occur
- US-008: Settlement Tracking - Live settlement updates
- US-009: Dispute Alerts - Real-time dispute notifications

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-023 | WebSocket infrastructure | 🎯 Planned |
| ROAD-021 | Dashboard real-time updates | 🎯 Planned |
| ROAD-014 | Order book live updates | 🎯 Planned |

## Bounded Context Coverage

- 🎯 Promise Market - Match notifications
- 🎯 Settlement - Settlement updates
- 🎯 Token Management - Transaction confirmations

## Dependencies

- Depends on: CAP-001 (Authentication) - secure connections
- Required by: None (leaf capability)

## Verification

```bash
# Test real-time notifications
just bdd-tag @CAP-003

# Start WebSocket test client
just test-websocket
```

---

**Tag**: `@CAP-003` | **Category**: Communication | **Status**: Planned
