---
sidebar_position: 5
title: Capability Tags for BDD
---

# BDD Capability Tags

BDD scenarios are tagged with capability identifiers to show which system capabilities they test. This creates traceability between capabilities and their test coverage.

## Tag Format

Capability tags follow the pattern: `@CAP-XXX`

```gherkin
@CAP-001 @CAP-002 @ROAD-005
Feature: Bot Registration
  # Tests authentication (CAP-001) and audit logging (CAP-002)
```

## Tag Hierarchy

```mermaid
graph TD
    A[BDD Scenario] --> B[@CAP-XXX - Capability]
    A --> C[@ROAD-XXX - Roadmap Item]
    A --> D[@US-XXX - User Story]
    A --> E[@UC-XXX - Use Case]
    A --> F[Functional Tags]
    
    F --> G[@api - API test]
    F --> H[@ui - UI test]
    F --> I[@smoke - Smoke test]
    F --> J[@security - Security test]
```

## Capability Tags Reference

| Tag | Capability | Description | Example Scenarios |
|-----|------------|-------------|-------------------|
| `@CAP-001` | Authentication | API key validation | All protected endpoints |
| `@CAP-002` | Audit Logging | Operation logging | All state changes |
| `@CAP-003` | Real-time Notifications | WebSocket delivery | Promise matches, updates |
| `@CAP-004` | Rate Limiting | Request throttling | Auth, API limits |
| `@CAP-005` | Escrow Management | Fund locking/releasing | Promise acceptance, settlement |
| `@CAP-006` | Reputation Calculation | Score computation | Promise completion, disputes |
| `@CAP-007` | Oracle Verification | Proof validation | Settlement verification |

## Tagging Rules

### 1. Always Tag Capabilities
Every scenario that tests a capability MUST include the capability tag:

```gherkin
# ✅ Good - tags the authentication capability
@CAP-001
Scenario: Valid API key grants access
  Given a bot with valid API key
  When they make an authenticated request
  Then access should be granted

# ❌ Bad - no capability tag
Scenario: Valid API key grants access
  Given a bot with valid API key
  When they make an authenticated request
  Then access should be granted
```

### 2. Multiple Capabilities
If a scenario tests multiple capabilities, tag all of them:

```gherkin
# ✅ Good - tests auth AND audit logging
@CAP-001 @CAP-002
Scenario: Failed auth creates audit log
  Given an invalid API key
  When a request is made
  Then access should be denied
  And an audit log entry should be created
```

### 3. Tag at Feature Level
If ALL scenarios in a feature test a capability, tag the feature:

```gherkin
@CAP-001
Feature: Bot Authentication
  # All scenarios test authentication
  
  Scenario: Valid API key
    ...
    
  Scenario: Invalid API key
    ...
    
  Scenario: Expired API key
    ...
```

### 4. Combine with Other Tags
Capability tags work alongside roadmap, user story, and functional tags:

```gherkin
@CAP-001 @CAP-002 @ROAD-005 @US-001 @api @security
Feature: Bot Registration
  # Tests capabilities for roadmap item ROAD-005
  # Implements user story US-001
  # API-level security test
```

## Running Tests by Capability

### Test Single Capability
```bash
# Run all authentication tests
just bdd-tag @CAP-001

# Run all audit logging tests
just bdd-tag @CAP-002
```

### Test Multiple Capabilities
```bash
# Run tests for capabilities 1 AND 2
just bdd-tag "@CAP-001 and @CAP-002"

# Run tests for capabilities 1 OR 2
just bdd-tag "@CAP-001 or @CAP-002"
```

### Test Capability Coverage
```bash
# Check which scenarios test CAP-001
just bdd-list --tag @CAP-001

# Generate capability coverage report
just bdd-report --by-capability
```

## Capability Coverage Matrix

| Feature | CAP-001 | CAP-002 | CAP-003 | CAP-005 |
|---------|---------|---------|---------|---------|
| Bot Registration | ✅ | ✅ | | |
| Bot Authentication | ✅ | ✅ | | |
| Promise Creation | ✅ | ✅ | | ✅ |
| Promise Acceptance | ✅ | ✅ | ✅ | ✅ |
| Promise Execution | ✅ | ✅ | ✅ | |
| Settlement | ✅ | ✅ | ✅ | ✅ |
| Dispute Resolution | ✅ | ✅ | | ✅ |

## Scenario Examples by Capability

### CAP-001: Authentication

```gherkin
@CAP-001
Scenario Outline: API key validation
  Given an API key "<api_key>"
  When a request is made with this key
  Then the response should be <status>

  Examples:
    | api_key           | status |
    | valid_key_123     | 200    |
    | invalid_key       | 401    |
    | expired_key       | 401    |
    |                   | 401    |
```

### CAP-002: Audit Logging

```gherkin
@CAP-002
Scenario: State change creates audit entry
  Given a bot performs a state-changing action
  When the action completes
  Then an audit log entry should exist
  And the entry should contain:
    | Field      | Value         |
    | actorId    | {botId}       |
    | action     | {actionName}  |
    | timestamp  | {timestamp}   |
```

### CAP-003: Real-time Notifications

```gherkin
@CAP-003
Scenario: Promise match triggers notification
  Given a bot is subscribed to notifications
  When their promise is matched
  Then they should receive a real-time notification
  And the notification should arrive within 100ms
```

### CAP-005: Escrow Management

```gherkin
@CAP-005
Scenario: Escrow locks funds atomically
  Given a consumer with 100 CLAW tokens
  When they accept a promise costing 50 CLAW
  Then an escrow should be created
  And exactly 50 CLAW should be locked
  And the consumer balance should be 50 CLAW
```

## Verification

Check that all scenarios have appropriate capability tags:

```bash
# Find untagged scenarios
just bdd-validate --check-capability-tags

# Report coverage gaps
just bdd-report --uncovered-capabilities
```

## Best Practices

1. **Tag at scenario level** - Be specific about what each scenario tests
2. **Use feature tags sparingly** - Only when ALL scenarios test the capability
3. **Don't over-tag** - If a scenario only incidentally uses a capability, don't tag it
4. **Keep tags current** - Update tags when capabilities change
5. **Document in capabilities** - Each capability file lists which BDD scenarios cover it

---

**Related**: [Capabilities](../capabilities/index) • [User Stories](../user-stories/index) • [Gherkin Syntax](./gherkin-syntax)
