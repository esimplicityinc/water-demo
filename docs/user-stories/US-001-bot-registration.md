---
title: Register New Bot
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

# US-001: Register New Bot

## Story

**As a** bot developer  
**I want** to register my bot with the platform  
**So that** I can participate in the promise marketplace and offer or consume compute services

## Acceptance Criteria

- [x] Developer can submit registration with display name
- [x] System validates display name uniqueness
- [x] System generates unique BotId
- [x] System generates API key for authentication
- [x] System creates BotAccount aggregate
- [x] System creates Wallet with zero balance
- [x] System emits BotRegistered domain event
- [x] System creates audit log entry (CAP-002)
- [x] API key is returned securely to developer
- [x] UI shows success screen with API key

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-001: Authentication | Generate and return API key | ✅ Available |
| CAP-002: Audit Logging | Log registration event | ✅ Available |

### Maps to Use Cases
- **UC-001: Register New Bot** - Primary use case
  - Creates BotAccount
  - Generates API key
  - Creates Wallet
  - Emits BotRegistered event

### Implemented By Roadmap
- **ROAD-004: Bot Registration** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/bot-identity/01_bot_registration.feature`

```gherkin
@US-001 @CAP-001 @CAP-002 @ROAD-004
Feature: Bot Registration
  As a bot developer
  I want to register my bot
  So that I can participate in the marketplace

  Background:
    Given the Bot Identity context is initialized

  Scenario: Successfully register a new bot
    Given a developer with a valid wallet
    When they submit Bot Registration with name "TradingBot"
    Then a new Bot should be created
    And the Bot should have a unique BotId
    And the Bot status should be "PENDING_VERIFICATION"
    And an API key should be generated (CAP-001)
    And a BotRegistered Domain Event should be published
    And an audit log entry should be created (CAP-002)

  Scenario: Enforce unique bot names
    Given a Bot named "AlphaBot" is already registered
    When a developer attempts to register with name "AlphaBot"
    Then the registration should fail
    And the error should reference business rule "BOT-001"
    And no new Bot should be created
    And no audit log entry should be created
```

## UI Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Start      │────▶│   Form       │────▶│  Success     │
│ Registration │     │  (Name)      │     │  + API Key   │
└──────────────┘     └──────────────┘     └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   Error      │
                       │ (Duplicate)  │
                       └──────────────┘
```

## Technical Notes

### API Endpoint
```http
POST /api/bots/register
Content-Type: application/json

{
  "displayName": "MyBot",
  "email": "optional@example.com"
}
```

### Response
```json
{
  "botId": "bot_abc123",
  "displayName": "MyBot",
  "apiKey": "pd_...",
  "createdAt": "2026-01-31T10:00:00Z",
  "status": "PENDING_VERIFICATION"
}
```

### Security Considerations
- API key shown only once on registration
- Key stored as SHA-256 hash in database
- Developer must save key securely

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-001

# Run all registration tests
just bdd-roadmap ROAD-004

# Verify capability coverage
just bdd-tag @CAP-001
just bdd-tag @CAP-002
```

## Related Documentation

- [UC-001: Register New Bot](../ddd/07-use-cases#uc-001-register-new-bot)
- [CAP-001: Authentication](../capabilities/CAP-001-authentication)
- [CAP-002: Audit Logging](../capabilities/CAP-002-audit-logging)
- [ROAD-004: Bot Registration](../roads/ROAD-004)

---

**ID**: US-001 | **Actor**: Developer | **Status**: Implemented ✅
