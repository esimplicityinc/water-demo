---
id: CAP-001
title: Customer Portal Authentication
category: Security
tag: "@CAP-001"
status: stable
---

# CAP-001: Customer Portal Authentication

Cross-cutting capability for verifying customer identity across all system operations.

## Overview

customer portal authentication ensures that every API request is made by a legitimate, enrolled customer. This capability spans all bounded contexts.

## Scope

### Covers
- Access token generation and validation
- Request customer portal authentication middleware
- Token refresh mechanisms
- Session management

### Does Not Cover
- Customer enrollment (UC-001) - that's a user story
- Authorization (permission checks) - separate concern

## Technical Implementation

### Components
```
┌─────────────────────────────────────────────────────────────┐
│                    customer portal authentication Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Access token Generation     │   Convex: generateApiKey()        │
│  Key Validation         │   Convex: getCustomerByApiKey()        │
│  Request Middleware     │   Convex: withAuth()              │
│  Rate Limit Check       │   CAP-004 integration             │
└─────────────────────────────────────────────────────────────┘
```

### Access token Format
- SHA-256 hash
- Prefix: `pd_`
- Length: 64 characters
- Example: `pd_a1b2c3d4e5f6...`

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-SEC-001 | Keys must be cryptographically secure | SHA-256, random entropy |
| NFR-SEC-002 | Failed auth attempts must be anomaly-flagged | CAP-004 integration |
| NFR-PERF-001 | Auth check < 10ms | Query optimization |

## BDD Test Coverage

Tag all customer portal authentication-related tests with `@CAP-001`:

```gherkin
@CAP-001 @ROAD-005
Feature: customer portal authentication

  Scenario: Valid Access token authenticates customer
    Given a enrolled customer "TestCustomer" with Access token
    When the customer makes an authenticated request
    Then the request should succeed
    And the customer identity should be verified

  Scenario: Invalid Access token rejected
    Given an invalid Access token "invalid_key_123"
    When a request is made with this key
    Then the response should be 401 Unauthorized
    And an usage log should be created
```

## User Stories Dependent on This Capability

- [US-001: Customer Enrollment](../user-stories/US-001-customer-enrollment) - Depends on key generation
- [US-003: Commitment Creation](../user-stories/US-003-commitment-creation) - Requires auth to create
- [US-004: Commitment Acceptance](../user-stories/US-004-commitment-acceptance) - Requires auth to accept
- All other user stories requiring authenticated access

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-005 | customer portal authentication implementation | ✅ Complete |
| ROAD-028 | Security hardening enhancements | 🎯 Planned |

## Bounded Context Coverage

- ✅ Customer Identity - Aquatrackry context
- ✅ Commitment Market - All operations require auth
- ✅ Token Management - Account operations require auth
- ✅ Billing - Dispute actions require auth

## Dependencies

- Depends on: None (foundational)
- Required by: CAP-002 (Usage logging), CAP-004 (Anomaly detection)

## Verification

```bash
# Test customer portal authentication capability
just bdd-tag @CAP-001

# Run security tests
just bdd-tag @security
```

---

**Tag**: `@CAP-001` | **Category**: Security | **Status**: Stable
