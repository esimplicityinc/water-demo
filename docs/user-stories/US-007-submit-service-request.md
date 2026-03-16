---
title: Submit Service Request
persona: PER-002
status: planned
capabilities:
  - CAP-007
  - CAP-006
  - CAP-001
use_cases:
  - UC-022
roadmap:
  - ROAD-042
---

# US-007: Submit Service Request

## Story

**As a** residential customer  
**I want** to submit a service request to the water utility  
**So that** I can report issues, request meter checks, or schedule maintenance

## Acceptance Criteria

- [ ] Customer can submit service request from mobile app
- [ ] Request includes issue type (leak, meter problem, low pressure, etc.)
- [ ] Request includes optional photo/description (100-1000 chars)
- [ ] Request is assigned unique ticket number
- [ ] System estimates response time based on issue severity
- [ ] Customer receives confirmation and tracking information
- [ ] Cannot submit duplicate requests within 1 hour
- [ ] System categorizes issue for proper routing
- [ ] Notifications sent to customer when status changes

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-007: Service Request Management | Ticket system | 🎯 Planned |
| CAP-006: Service Area Directory | Find service area | 🎯 Planned |
| CAP-001: Authentication | Secure API access | ✅ Available |
| CAP-003: Notifications | Status updates | 🎯 Planned |

### Maps to Use Cases
- **UC-022: Submit Service Request** - Primary use case
  - Create service ticket
  - Categorize issue
  - Route to technician

### Implemented By Roadmap
- **ROAD-042: Service Request Management** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/water-service/03_submit_service_request.feature`

```gherkin
@US-007 @CAP-007 @CAP-006 @CAP-001 @ROAD-042
Feature: Submit Service Request
  As a residential customer
  I want to submit a service request
  So that I can get help with water issues

  Background:
    Given the Water Service context is initialized
    And customer "John Smith" is authenticated
    And customer's account is in good standing

  Scenario: Submit water leak service request successfully
    Given "John Smith" wants to report a water leak
    When "John Smith" submits a service request with:
      """
      Issue Type: Suspected Leak
      Location: Under the sink in kitchen
      Description: I hear running water even after closing all fixtures
      Severity: High
      """
    Then the request should be created with unique ticket number
    And the ticket status should be "OPEN"
    And the system should estimate response within "4 hours" for high severity
    And "John Smith" should receive confirmation with:
      | Field | Value |
      | ticket_id | Unique identifier |
      | status | OPEN |
      | estimated_response | 4 hours |
    And system should categorize for routing

  Scenario: Cannot submit duplicate requests
    Given "John Smith" submitted a leak request 30 minutes ago
    When "John Smith" attempts to submit another leak request
    Then the request should fail with error "Similar request already open"
    And the error should provide the existing ticket number
    And no duplicate request should be created

  Scenario: Validate request details
    When "John Smith" submits request with message "Hi"
    Then the request should fail with error "Description too short (minimum 10 characters)"
    
    When "John Smith" submits request with message [1001 characters]
    Then the request should fail with error "Description too long (maximum 1000 characters)"
```

## Technical Notes

### Submit Service Request Endpoint
```http
POST /api/service-requests
Authorization: Bearer {api_key}
Content-Type: application/json

Request:
{
  "issueType": "suspected_leak",
  "location": "Kitchen sink",
  "description": "Running water sound with valves closed",
  "severity": "high",
  "attachmentUrl": "optional_image_url"
}

Response (Success 201):
{
  "ticketId": "TKT-2026-001234",
  "status": "OPEN",
  "issueType": "suspected_leak",
  "severity": "high",
  "estimatedResponse": "2026-01-31T14:00:00Z",
  "createdAt": "2026-01-31T10:00:00Z",
  "trackingUrl": "https://aquatrack.com/tickets/TKT-2026-001234"
}
```

### Severity to Response Time Mapping
- **Critical** (No water): 1 hour
- **High** (Leak/Safety): 4 hours
- **Medium** (Meter issue): 24 hours
- **Low** (General inquiry): 48 hours

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-007

# Test request validation
just test-request-validation

# Test issue categorization
just test-issue-categorization
```

## Related Documentation

- [CAP-007: Service Request Management](../capabilities/CAP-007-service-request-management)
- [ROAD-042: Service Request Management](../roads/ROAD-042)
- [UC-022: Submit Service Request](../ddd/07-use-cases#uc-022-submit-service-request)

---

**ID**: US-007 | **Actor**: Customer | **Status**: Planned 🎯
