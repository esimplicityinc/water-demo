---
title: Create Promise
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

# US-002: Create Promise

## Story

**As a** provider bot  
**I want** to create a promise offering my compute capacity  
**So that** consumer bots can discover and purchase my services

## Acceptance Criteria

- [ ] Provider can submit promise specification
- [ ] System validates provider has sufficient stake (CAP-005)
- [ ] System validates specification completeness
- [ ] System generates unique PromiseId
- [ ] System creates Promise aggregate in DRAFT state
- [ ] System emits PromiseCreated domain event
- [ ] System creates audit log entry (CAP-002)
- [ ] Promise is associated with provider's bot account

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-001: Authentication | Verify provider identity | ✅ Available |
| CAP-002: Audit Logging | Log promise creation | ✅ Available |
| CAP-005: Escrow Management | Validate stake availability | ✅ Available |

### Maps to Use Cases
- **UC-010: Create Promise** - Primary use case
  - Validates stake requirement (≥10% of price)
  - Creates Promise aggregate
  - Emits PromiseCreated event

### Implemented By Roadmap
- **ROAD-012: Promise Creation** - Planned implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/promise-market/01_promise_creation.feature`

```gherkin
@US-002 @CAP-001 @CAP-002 @CAP-005 @ROAD-012
Feature: Promise Creation
  As a provider bot
  I want to create a promise
  So that consumers can purchase my compute capacity

  Background:
    Given a registered provider bot "SellerBot"
    And "SellerBot" is authenticated (CAP-001)
    And "SellerBot" has 1000 CLAW tokens available

  Scenario: Successfully create a promise with sufficient stake
    Given "SellerBot" has available compute capacity
    When "SellerBot" creates a Promise with:
      | Field            | Value         |
      | compute_capacity | 100 units     |
      | duration_hours   | 24            |
      | price_per_unit   | 0.5 CLAW      |
      | stake_amount     | 50 CLAW       |
    Then the Promise should be created
    And the Promise state should be "DRAFT"
    And the stake requirement should be validated (CAP-005)
    And a PromiseCreated Domain Event should be published
    And an audit log entry should be created (CAP-002)

  Scenario: Reject promise with insufficient stake
    Given "SellerBot" has only 10 CLAW tokens available
    When "SellerBot" attempts to create a Promise requiring 100 CLAW stake
    Then the creation should fail with error "Insufficient stake"
    And the error should reference business rule "PROMISE-002"
    And no Promise should be created
    And no audit log entry should be created

  Scenario: Reject promise with invalid specification
    When "SellerBot" creates a Promise with:
      | Field            | Value     |
      | compute_capacity | 0 units   |
    Then the creation should fail with error "Capacity must be positive"
    And the error should reference business rule "PROMISE-001"
```

## UI Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Provider   │────▶│   Specify    │────▶│   Review     │
│   Dashboard  │     │   Capacity   │     │   & Submit   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                    ┌──────────────┐             │
                    │   Success    │◀────────────┘
                    │  (Promise    │
                    │   Draft)     │
                    └──────────────┘
```

## Technical Notes

### API Endpoint
```http
POST /api/promises
Authorization: Bearer {apiKey}
Content-Type: application/json

{
  "specification": {
    "model": "llama-3-70b",
    "computeCapacity": "100",
    "durationHours": 24,
    "pricePerUnit": "0.5",
    "stakeAmount": "50"
  }
}
```

### Business Rules
- **PROMISE-001**: Compute capacity must be positive
- **PROMISE-002**: Stake must be ≥ 10% of total price
- **PROMISE-003**: Duration must be between 1 and 168 hours

## Verification

```bash
# Run BDD tests for this story (once implemented)
just bdd-tag @US-002

# Run promise creation tests
just bdd-roadmap ROAD-012

# Verify capability coverage
just bdd-tag @CAP-005
```

## Related Documentation

- [UC-010: Create Promise](../ddd/07-use-cases#uc-010-create-promise)
- [CAP-001: Authentication](../capabilities/CAP-001-authentication)
- [CAP-002: Audit Logging](../capabilities/CAP-002-audit-logging)
- [CAP-005: Escrow Management](../capabilities/CAP-005-escrow-management)
- [ROAD-012: Promise Creation](../roads/ROAD-012)

---

**ID**: US-002 | **Actor**: Provider | **Status**: Planned 🎯
