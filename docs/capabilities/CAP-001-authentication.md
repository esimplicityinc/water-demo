---
id: CAP-001
title: Authentication
category: Security
tag: "@CAP-001"
status: stable
---

# CAP-001: Authentication

Cross-cutting capability for verifying bot identity across all system operations.

## Overview

Authentication ensures that every API request is made by a legitimate, registered bot. This capability spans all bounded contexts.

## Scope

### Covers
- API key generation and validation
- Request authentication middleware
- Token refresh mechanisms
- Session management

### Does Not Cover
- Bot registration (UC-001) - that's a user story
- Authorization (permission checks) - separate concern

## Technical Implementation

### Components
```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Layer                      │
├─────────────────────────────────────────────────────────────┤
│  API Key Generation     │   Convex: generateApiKey()        │
│  Key Validation         │   Convex: getBotByApiKey()        │
│  Request Middleware     │   Convex: withAuth()              │
│  Rate Limit Check       │   CAP-004 integration             │
└─────────────────────────────────────────────────────────────┘
```

### API Key Format
- SHA-256 hash
- Prefix: `claw_`
- Length: 64 characters
- Example: `claw_a1b2c3d4e5f6...`

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-SEC-001 | Keys must be cryptographically secure | SHA-256, random entropy |
| NFR-SEC-002 | Failed auth attempts must be rate-limited | CAP-004 integration |
| NFR-PERF-001 | Auth check < 10ms | Query optimization |

## BDD Test Coverage

Tag all authentication-related tests with `@CAP-001`:

```gherkin
@CAP-001 @ROAD-005
Feature: Bot Authentication

  Scenario: Valid API key authenticates bot
    Given a registered bot "TestBot" with API key
    When the bot makes an authenticated request
    Then the request should succeed
    And the bot identity should be verified

  Scenario: Invalid API key rejected
    Given an invalid API key "invalid_key_123"
    When a request is made with this key
    Then the response should be 401 Unauthorized
    And an audit log should be created
```

## User Stories Dependent on This Capability

- [US-001: Bot Registration](../user-stories/US-001-bot-registration) - Depends on key generation
- [US-003: Promise Creation](../user-stories/US-003-promise-creation) - Requires auth to create
- [US-004: Promise Acceptance](../user-stories/US-004-promise-acceptance) - Requires auth to accept
- All other user stories requiring authenticated access

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-005 | Bot Authentication implementation | ✅ Complete |
| ROAD-028 | Security hardening enhancements | 🎯 Planned |

## Bounded Context Coverage

- ✅ Bot Identity - Primary context
- ✅ Promise Market - All operations require auth
- ✅ Token Management - Wallet operations require auth
- ✅ Settlement - Dispute actions require auth

## Dependencies

- Depends on: None (foundational)
- Required by: CAP-002 (Audit Logging), CAP-004 (Rate Limiting)

## Verification

```bash
# Test authentication capability
just bdd-tag @CAP-001

# Run security tests
just bdd-tag @security
```

---

**Tag**: `@CAP-001` | **Category**: Security | **Status**: Stable
