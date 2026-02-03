---
id: NFR-SEC-002
title: API Key Rotation
category: security
priority: must
status: active
created: 2026-01-31
---

# NFR-SEC-002: API Key Rotation

## Requirement

All API keys must be rotated on a mandatory 90-day cycle with automated rotation capabilities to ensure continuous security and minimize exposure from compromised credentials.

## Specifications

### Mandatory Rotation Schedule

- API keys must be rotated every 90 days from creation or last rotation
- System must send automated notifications 14 days, 7 days, and 1 day before expiration
- Keys that exceed 90 days must be automatically revoked
- Grace period of 24 hours provided after expiration for emergency rotation

### Automated Rotation Capability

- API consumers can trigger automated rotation via API or dashboard
- New key generation must complete within 5 seconds
- Old key remains valid for 24 hours after rotation (overlap period)
- Both old and new keys are logged in rotation audit trail
- Rotation events trigger immediate cache invalidation

### Key Lifecycle Management

- Maximum of 2 active keys per bot account at any time
- Historical keys retained in encrypted storage for 1 year
- Keys must be cryptographically generated with 256-bit entropy
- Rotation history must be queryable via API for compliance reporting

### Emergency Rotation

- Manual rotation available 24/7 via dashboard and API
- Emergency rotation immediately invalidates old key
- Emergency rotation events trigger high-priority security alerts
- Post-rotation security scan required within 1 hour

## Security Headers

All key rotation API responses must include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Cache-Control: no-store, no-cache, must-revalidate
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Validation Criteria

```gherkin
Feature: API Key Rotation
  
  Scenario: Key rotation within 90-day window
    Given an API key created 80 days ago
    When the system checks key expiration status
    Then the key should be marked as "active"
    And a warning notification should be sent
    
  Scenario: Automatic key expiration after 90 days
    Given an API key created 91 days ago
    When the system checks key expiration status
    Then the key should be automatically revoked
    And the key owner should be notified
    
  Scenario: Successful automated key rotation
    Given a valid API key
    When I trigger automated rotation via API
    Then a new key should be generated within 5 seconds
    And the old key should remain valid for 24 hours
    And both keys should be logged in rotation history
    
  Scenario: Emergency key rotation
    Given a compromised API key
    When I trigger emergency rotation
    Then the old key should be immediately invalidated
    And a new key should be generated
    And a security alert should be triggered
```

## Compliance

- OWASP API Security Top 10 - API2:2019 Broken Authentication
- SOC 2 Type II - CC6.1 Logical access security
- NIST SP 800-57 Key Management Guidelines

## Related

- [ADR-009](../adr/adr-009-api-key-authentication.md) - API Key Authentication
- [NFR-SEC-001](./nfr-sec-001-authentication.md) - Authentication Requirements
- [CAP-004](../capabilities/CAP-004-rate-limiting.md) - Rate Limiting
