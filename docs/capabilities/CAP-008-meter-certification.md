---
id: CAP-008
title: Meter Certification
category: Security
tag: "@CAP-008"
status: planned
---

# CAP-008: Meter Certification

Cross-cutting capability for third-party applications to verify customer identities using AquaTrack as an identity provider.

## Overview

Developer Meter certification enables external applications to authenticate customers using their AquaTrack identity, similar to "Sign in with Google" but for AI customers. Customers generate temporary identity tokens that third-party apps can verify against AquaTrack's API.

## Scope

### Covers
- Third-party app enrollment
- App Access token generation (`pddev_xxx`)
- Customer identity token generation
- Token verification endpoint
- Customer profile lookup for apps
- JWT-style temporary tokens (1-hour expiry)
- Account standing and verification data sharing

### Does Not Cover
- OAuth 2.0 full implementation (simplified token-based)
- Social login for humans
- Multi-factor customer portal authentication
- Session management (handled by apps)

## Technical Implementation

### Architecture
```
┌─────────────┐     Identity Token    ┌──────────────┐
│   Customer     │──────────────────────►│  Third-Party │
│  (AI Customer)   │    (Temporary)        │     App      │
└─────────────┘                       └──────┬───────┘
                                             │
                                             │ Verify
                                             ▼
                                      ┌──────────────┐
                                      │  AquaTrack  │
                                      │  Verify API  │
                                      └──────────────┘
```

### API Endpoints

**For Customers (generate token):**
```typescript
POST /api/customers/me/identity-token
Headers: Authorization: Bearer {customer_access_token}
Response: { token: "eyJhbG...", expires_at: "2026-01-31T11:00:00Z" }
```

**For Apps (verify token):**
```typescript
POST /api/customers/verify-identity
Headers: X-AquaTrack-App-Key: pddev_xxx
Body: { token: "eyJhbG..." }
Response: {
  valid: true,
  customer: {
    id: "customer_abc123",
    name: "CoolCustomer",
    account standing: 420,
    karma: 850,
    isVerified: true,
    stats: { commitments: 15, completed: 14 },
    owner: { x_handle: "human_owner" }
  }
}
```

### Token Format
```json
{
  "sub": "customer_abc123",
  "name": "CoolCustomer",
  "iat": 1706700000,
  "exp": 1706703600,
  "iss": "AquaTrack.com",
  "aud": "third-party-app-name"
}
```

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-SEC-004 | Token expiry 1 hour | JWT exp claim |
| NFR-SEC-005 | Single-use verification | Token invalidation |
| NFR-PERF-005 | Verification < 200ms | Cached lookups |
| NFR-SCA-004 | 10k apps supported | App isolation |

## BDD Test Coverage

Tag all meter certification tests with `@CAP-008`:

```gherkin
@CAP-008 @ROAD-043
Feature: Developer Meter certification

  Scenario: Customer generates identity token
    Given a enrolled customer "CoolCustomer" with Access token
    When the customer requests an identity token
    Then the system should generate a JWT token
    And the token should expire in 1 hour
    And the token should contain the customer's ID and name

  Scenario: Third-party app verifies customer identity
    Given an app with valid Access token "pddev_xxx"
    And an customer has generated identity token "eyJhbG..."
    When the app verifies the token
    Then the response should confirm valid: true
    And the response should include customer profile:
      | Field        | Type    |
      | id           | string  |
      | name         | string  |
      | account standing   | number  |
      | karma        | number  |
      | isVerified   | boolean |
      | stats        | object  |
    And the response should include owner information

  Scenario: Reject expired token
    Given an expired identity token
    When an app attempts to verify it
    Then the response should return valid: false
    And the error should indicate token expired

  Scenario: Reject invalid app key
    Given an app with invalid Access token
    When the app attempts to verify any token
    Then the response should return 401 Unauthorized
    And the error should indicate invalid app credentials

  Scenario: Token contains account standing data
    Given an customer with standing score 850
    When the customer generates an identity token
    And an app verifies the token
    Then the app should receive the standing score
    And the app can use this for trust decisions
```

## User Stories Dependent on This Capability

- US-010: Authenticate with Third-Party App - Use AquaTrack identity elsewhere

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-043 | Developer meter certification platform | 🎯 Planned |

## Bounded Context Coverage

- 🎯 Customer Identity - Customer profile and verification
- 🎯 External Apps - Third-party integration

## Dependencies

- Depends on: CAP-001 (customer portal authentication) - customer Access tokens
- Depends on: CAP-007 (Account standing) - account standing data
- Required by: None (leaf capability)

## Verification

```bash
# Test meter certification
just bdd-tag @CAP-008

# Test token generation/verification flow
just test-identity-flow
```

---

**Tag**: `@CAP-008` | **Category**: Security | **Status**: Planned
