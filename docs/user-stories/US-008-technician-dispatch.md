---
title: Technician Dispatch
persona: PER-001
status: planned
capabilities:
  - CAP-007
use_cases:
  - UC-023
roadmap:
  - ROAD-042
---

# US-008: Technician Dispatch

## Story

**As a** field operations manager  
**I want** to dispatch and track technicians to service requests  
**So that** I can optimize routes, track response times, and ensure quality service

## Acceptance Criteria

- [ ] Manager can view all open service requests on map
- [ ] Manager can assign requests to available technicians
- [ ] Manager can see technician location in real-time
- [ ] Manager can optimize route for multiple assignments
- [ ] System tracks technician arrival and completion time
- [ ] Manager receives notification when technician arrives
- [ ] Manager can reassign if technician becomes unavailable
- [ ] Technician receives updated assignment in mobile app
- [ ] System logs all dispatch events

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-007: Service Request Management | Dispatch system | 🎯 Planned |

### Maps to Use Cases
- **UC-023: Manage Service Dispatch** - Primary use case
  - Review requests
  - Assign technicians
  - Track completion

### Implemented By Roadmap
- **ROAD-042: Service Request Management** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/water-service/04_technician_dispatch.feature`

```gherkin
@US-008 @CAP-007 @ROAD-042
Feature: Technician Dispatch
  As a field operations manager
  I want to dispatch technicians
  So that service requests are addressed quickly

  Background:
    Given the Water Service context is initialized
    And multiple open service requests exist
    And technicians are available with location tracking

  Scenario: Assign technician to service request
    Given manager views pending requests map
    When the manager assigns request "TKT-2026-001234" to "Mike Tech"
    Then a dispatch should be created
    And dispatch status should be "ASSIGNED"
    And "Mike Tech" should receive notification in mobile app
    And dispatch should include:
      | Field | Value |
      | ticket_id | TKT-2026-001234 |
      | technician | Mike Tech |
      | customer_address | From service request |
      | estimated_arrival | Based on route |
    And system should log dispatch event

  Scenario: Track technician arrival and completion
    Given "Mike Tech" has been assigned to request "TKT-2026-001234"
    When "Mike Tech" taps "Arrived" in mobile app
    Then dispatch status should update to "IN_PROGRESS"
    And manager should receive notification
    And customer should be notified of arrival
    
    When "Mike Tech" completes the work and taps "Complete"
    Then dispatch status should be "COMPLETED"
    And service request status should be "CLOSED"
    And customer should receive follow-up survey
    And manager should see completion in dashboard

  Scenario: Optimize route for multiple assignments
    Given manager has 5 open requests
    When manager clicks "Optimize Route"
    Then system should suggest efficient order
    And should minimize travel distance between stops
    And should account for estimated service time
```

## Technical Notes

### Assign Technician Endpoint
```http
POST /api/service-requests/{ticketId}/assign
Authorization: Bearer {api_key}
Content-Type: application/json

Request:
{
  "technicianId": "tech_001",
  "priority": "high"
}

Response:
{
  "dispatchId": "disp_001",
  "ticketId": "TKT-2026-001234",
  "technicianId": "tech_001",
  "status": "ASSIGNED",
  "estimatedArrival": "2026-01-31T14:30:00Z",
  "assignedAt": "2026-01-31T14:00:00Z"
}
```

### Update Dispatch Status Endpoint
```http
POST /api/dispatches/{dispatchId}/status
Authorization: Bearer {api_key}

Request:
{
  "status": "IN_PROGRESS",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "timestamp": "2026-01-31T14:25:00Z"
}
```

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-008

# Test technician tracking
just test-technician-tracking

# Test route optimization
just test-route-optimization
```

## Related Documentation

- [CAP-007: Service Request Management](../capabilities/CAP-007-service-request-management)
- [ROAD-042: Service Request Management](../roads/ROAD-042)
- [UC-023: Manage Service Dispatch](../ddd/07-use-cases#uc-023-manage-service-dispatch)

---

**ID**: US-008 | **Actor**: Operations Manager | **Status**: Planned 🎯
