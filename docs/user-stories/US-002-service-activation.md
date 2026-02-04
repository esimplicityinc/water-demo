---
id: US-002
title: Activate Water Service
persona: PER-002
status: planned
capabilities:
  - CAP-001
  - CAP-002
  - CAP-005
use_cases:
  - UC-010
roadmap:
  - ROAD-012
---

# US-002: Activate Water Service

## Story

**As a** treatment operator  
**I want** to activate water service for a new customer location  
**So that** the customer can begin receiving treated water and using smart meters

## Acceptance Criteria

- [ ] Operator can submit service activation request
- [ ] System validates location has water infrastructure access (CAP-005)
- [ ] System validates customer account is in good standing
- [ ] System generates unique ServiceId
- [ ] System creates WaterService aggregate in PENDING state
- [ ] System schedules meter installation date
- [ ] System emits ServiceActivated domain event
- [ ] System creates audit log entry (CAP-002)
- [ ] Service is associated with customer account
- [ ] Technician is automatically dispatched for installation

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-001: Authentication | Verify operator identity | ✅ Available |
| CAP-002: Audit Logging | Log activation event | ✅ Available |
| CAP-005: Infrastructure Validation | Check water availability | ✅ Available |

### Maps to Use Cases
- **UC-010: Activate Water Service** - Primary use case
  - Validates service area availability (CAP-005)
  - Creates WaterService aggregate
  - Emits ServiceActivated event

### Implemented By Roadmap
- **ROAD-012: Service Activation** - Planned implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/water-service/01_service_activation.feature`

```gherkin
@US-002 @CAP-001 @CAP-002 @CAP-005 @ROAD-012
Feature: Service Activation
  As a treatment operator
  I want to activate water service
  So that customers can receive treated water

  Background:
    Given an enrolled customer "John Smith"
    And "John Smith" is authenticated (CAP-001)
    And the service area is initialized

  Scenario: Successfully activate service
    Given "John Smith" wants to activate service
    When the operator creates a Service Activation with:
      | Field | Value |
      | service_address | 123 Water Lane |
      | service_type | residential |
      | meter_type | smart_meter |
    Then the Service should be created
    And the Service state should be "PENDING"
    And the infrastructure should be validated (CAP-005)
    And a ServiceActivated Domain Event should be published
    And an audit log entry should be created (CAP-002)
    And a technician should be dispatched

  Scenario: Reject activation in service-restricted area
    Given "John Smith" lives in area with no water availability
    When the operator attempts to activate service
    Then the activation should fail with error "Service not available in this area"
    And the error should reference business rule "SERVICE-002"
    And no Service should be created
    And no audit log entry should be created

  Scenario: Reject activation for delinquent account
    Given "John Smith" has unpaid bills over 60 days
    When the operator attempts to activate service
    Then the activation should fail with error "Account delinquent"
    And the error should reference business rule "SERVICE-001"
```

## UI Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Operator   │────▶│   Specify    │────▶│   Validate   │
│   Dashboard  │     │   Location   │     │   Area       │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                     ┌──────────────┐             │
                     │   Success    │◀────────────┘
                     │  (Dispatch   │
                     │   Technician)│
                     └──────────────┘
```

## Technical Notes

### API Endpoint
```http
POST /api/services/activate
Authorization: Bearer {apiKey}
Content-Type: application/json

{
  "specification": {
    "serviceAddress": "123 Water Lane",
    "serviceType": "residential",
    "meterType": "smart_meter",
    "installationDate": "2026-02-15"
  }
}
```

### Business Rules
- **SERVICE-001**: Account must be in good standing
- **SERVICE-002**: Location must have water infrastructure
- **SERVICE-003**: Meter type must be supported
- **SERVICE-004**: Installation date must be within 14 days

## Verification

```bash
# Run BDD tests for this story (once implemented)
just bdd-tag @US-002

# Run service activation tests
just bdd-roadmap ROAD-012

# Verify capability coverage
just bdd-tag @CAP-005
```

## Related Documentation

- [UC-010: Activate Water Service](../ddd/07-use-cases#uc-010-activate-water-service)
- [CAP-001: Authentication](../capabilities/CAP-001-authentication)
- [CAP-002: Audit Logging](../capabilities/CAP-002-audit-logging)
- [CAP-005: Infrastructure Validation](../capabilities/CAP-005-infrastructure-validation)
- [ROAD-012: Service Activation](../roads/ROAD-012)

---

**ID**: US-002 | **Actor**: Treatment Operator | **Status**: Planned 🎯
