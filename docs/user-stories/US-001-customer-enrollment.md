---
title: Enroll New Customer
persona: PER-001
status: implemented
capabilities:
  - CAP-001
  - CAP-002
use_cases:
  - UC-001
roadmap:
  - ROAD-004
---

# US-001: Enroll New Customer

## Story

**As a** utility administrator  
**I want** to enroll a new residential or commercial customer on the AquaTrack platform  
**So that** they can monitor their water consumption and manage their account

## Acceptance Criteria

- [x] Administrator can submit enrollment with customer name and address
- [x] System validates customer information completeness
- [x] System generates unique CustomerId
- [x] System generates API key for mobile app or smart meter
- [x] System creates CustomerAccount aggregate
- [x] System creates Account with zero consumption baseline
- [x] System emits CustomerEnrolled domain event
- [x] System creates audit log entry (CAP-002)
- [x] API key is returned securely to customer or device
- [x] UI shows success screen with account details

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-001: Authentication | Generate and return API key | ✅ Available |
| CAP-002: Audit Logging | Log enrollment event | ✅ Available |

### Maps to Use Cases
- **UC-001: Enroll New Customer** - Primary use case
  - Creates CustomerAccount
  - Generates API key
  - Creates Account with baseline
  - Emits CustomerEnrolled event

### Implemented By Roadmap
- **ROAD-004: Customer Enrollment** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/customer-identity/01_customer_enrollment.feature`

```gherkin
@US-001 @CAP-001 @CAP-002 @ROAD-004
Feature: Customer Enrollment
  As a utility administrator
  I want to enroll a new customer
  So that they can start monitoring their water usage

  Background:
    Given the Customer Identity context is initialized

  Scenario: Successfully enroll a new customer
    Given an administrator with valid credentials
    When they submit Customer Enrollment with:
      | Field | Value |
      | name | John Smith |
      | address | 123 Water Lane, City |
      | meter_type | smart_meter |
    Then a new Customer should be created
    And the Customer should have a unique CustomerId
    And the Customer status should be "ACTIVE"
    And an API key should be generated (CAP-001)
    And a CustomerEnrolled Domain Event should be published
    And an audit log entry should be created (CAP-002)

  Scenario: Enforce unique account per address/meter
    Given a Customer with meter "MET-001" is already enrolled
    When an administrator attempts to enroll same meter again
    Then the enrollment should fail
    And the error should reference business rule "CUSTOMER-001"
    And no new Customer should be created
    And no audit log entry should be created
```

## UI Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Start      │────▶│   Form       │────▶│  Success     │
│ Enrollment   │     │  (Details)   │     │  + API Key   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Error      │
                     │  (Duplicate) │
                     └──────────────┘
```

## Technical Notes

### API Endpoint
```http
POST /api/customers/enroll
Content-Type: application/json

{
  "name": "John Smith",
  "address": "123 Water Lane, City",
  "meterType": "smart_meter",
  "email": "john@example.com"
}
```

### Response
```json
{
  "customerId": "cust_abc123",
  "name": "John Smith",
  "address": "123 Water Lane, City",
  "apiKey": "aq_...",
  "enrolledAt": "2026-01-31T10:00:00Z",
  "status": "ACTIVE"
}
```

### Security Considerations
- API key shown only once on enrollment
- Key stored as SHA-256 hash in database
- Customer must save key securely
- Multi-factor authentication for administrators

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-001

# Run all enrollment tests
just bdd-roadmap ROAD-004

# Verify capability coverage
just bdd-tag @CAP-001
just bdd-tag @CAP-002
```

## Related Documentation

- [UC-001: Enroll New Customer](../ddd/07-use-cases#uc-001-enroll-new-customer)
- [CAP-001: Authentication](../capabilities/CAP-001-authentication)
- [CAP-002: Audit Logging](../capabilities/CAP-002-audit-logging)
- [ROAD-004: Customer Enrollment](../roads/ROAD-004)

---

**ID**: US-001 | **Actor**: Administrator | **Status**: Implemented ✅
