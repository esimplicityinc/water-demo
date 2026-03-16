---
title: Customer Communication
persona: PER-002
status: planned
capabilities:
  - CAP-007
  - CAP-003
use_cases:
  - UC-024
roadmap:
  - ROAD-042
---

# US-009: Customer Communication

## Story

**As a** treatment operator  
**I want** to communicate directly with customers about service requests and maintenance  
**So that** I can provide updates, schedule appointments, and handle special requests

## Acceptance Criteria

- [ ] Operator can send messages to customer service tickets
- [ ] Customer receives notifications for all messages
- [ ] Operator can schedule appointments via messaging
- [ ] Messages include estimated technician arrival times
- [ ] Operator can send photo attachments (leak evidence, repairs)
- [ ] Operator can mark messages as resolved
- [ ] System tracks all communication for audit trail
- [ ] Messages are stored with customer account
- [ ] Operator can view conversation history

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-007: Service Request Management | Message system | 🎯 Planned |
| CAP-003: Real-time Notifications | Message notifications | 🎯 Planned |

### Maps to Use Cases
- **UC-024: Communicate with Customer** - Primary use case
  - Send messages
  - Schedule appointments
  - Update status

### Implemented By Roadmap
- **ROAD-042: Service Request Management** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/water-service/05_customer_communication.feature`

```gherkin
@US-009 @CAP-007 @CAP-003 @ROAD-042
Feature: Customer Communication
  As a treatment operator
  I want to communicate with customers
  So that I can coordinate service delivery

  Background:
    Given the Water Service context is initialized
    And an open service request "TKT-2026-001234" exists
    And customer "John Smith" is enrolled

  Scenario: Send message to customer
    Given operator "Mike" is assigned to service request
    When operator sends message:
      """
      Hi John! I'll be arriving at your address around 2:00 PM today. 
      Please ensure someone is home to let me in.
      """
    Then the message should be stored in request thread
    And "John Smith" should receive notification (CAP-003)
    And message should have timestamp and sender info
    And message should be included in audit trail

  Scenario: Schedule appointment via messaging
    Given operator wants to confirm appointment time
    When operator sends message with appointment details
    Then the message should propose appointment time
    And "John Smith" should receive appointment notification
    And system should track proposed and confirmed times
    And system should send calendar invite to customer

  Scenario: List customer communications
    Given "John Smith" has 3 open service requests
    When "John Smith" views service requests
    Then all 3 requests should be displayed
    And each should show:
      | Field | Description |
      | ticket_id | Request identifier |
      | status | Current status |
      | last_message | Most recent communication |
      | unread_count | New messages |
      | updatedAt | Last activity time |

  Scenario: Escalate to supervisor
    Given operator has unresolved issue
    When operator sends message flagged needsSupervisor=true
    Then "John Smith" should see supervisor flag
    And supervisor should be notified
    And operator should not close request alone
```

## Technical Notes

### Send Message Endpoint
```http
POST /api/service-requests/{ticketId}/messages
Authorization: Bearer {api_key}
Content-Type: application/json

Request:
{
  "message": "Hi John! I'll arrive at 2:00 PM",
  "attachments": ["photo_url"],
  "needsSupervisor": false
}

Response:
{
  "messageId": "msg_001",
  "status": "sent",
  "timestamp": "2026-01-31T14:00:00Z",
  "from": "Mike Tech"
}
```

### View Conversation Endpoint
```http
GET /api/service-requests/{ticketId}/messages
Authorization: Bearer {api_key}

Response:
{
  "ticketId": "TKT-2026-001234",
  "messages": [
    {
      "id": "msg_001",
      "from": "John Smith",
      "content": "Water leak under kitchen sink",
      "timestamp": "2026-01-31T10:00:00Z",
      "read": true
    },
    {
      "id": "msg_002",
      "from": "Mike Tech",
      "content": "I'll arrive at 2:00 PM",
      "timestamp": "2026-01-31T14:00:00Z",
      "read": false
    }
  ]
}
```

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-009

# Test message flow
just test-message-flow

# Test notification delivery
just test-notification-delivery
```

## Related Documentation

- [CAP-007: Service Request Management](../capabilities/CAP-007-service-request-management)
- [CAP-003: Real-time Notifications](../capabilities/CAP-003-real-time-notifications)
- [ROAD-042: Service Request Management](../roads/ROAD-042)
- [UC-024: Communicate with Customer](../ddd/07-use-cases#uc-024-communicate-with-customer)

---

**ID**: US-009 | **Actor**: Treatment Operator | **Status**: Planned 🎯
