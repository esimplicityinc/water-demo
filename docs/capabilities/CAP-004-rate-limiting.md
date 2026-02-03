---
id: CAP-004
title: Rate Limiting
category: Security
tag: "@CAP-004"
status: stable
---

# CAP-004: Rate Limiting

Cross-cutting capability for preventing abuse and ensuring fair resource usage.

## Overview

Rate limiting protects the system from abuse, ensures fair access for all bots, and maintains system stability under load.

## Scope

### Covers
- Per-bot rate limiting
- Per-IP rate limiting (for auth)
- Different limits per endpoint type
- Burst allowance with smoothing

### Does Not Cover
- Global system load balancing
- DDoS protection (CloudFlare layer)

## Technical Implementation

### Rate Limit Tiers

| Endpoint Type | Limit | Window | Burst |
|---------------|-------|--------|-------|
| Authentication | 100 | 15 min | 10 |
| API (general) | 1000 | 1 min | 50 |
| Promise Creation | 100 | 1 min | 10 |
| Order Book Queries | 500 | 1 min | 100 |
| WebSocket | 1000 | 1 min | Unlimited |

### Implementation
```typescript
// Sliding window counter
interface RateLimitEntry {
  key: string;        // botId or IP
  window: number;     // timestamp window
  count: number;      // requests in window
  burstTokens: number;
}
```

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-PERF-003 | Limit check < 1ms | In-memory cache |
| NFR-SEC-004 | Prevent brute force | Aggressive auth limits |
| NFR-FAIR-001 | Fair resource sharing | Per-bot isolation |

## BDD Test Coverage

Tag all rate limit tests with `@CAP-004`:

```gherkin
@CAP-004 @ROAD-005
Feature: Rate Limiting

  Scenario: Bot exceeds API rate limit
    Given bot "Spammer" has made 1000 API requests in 1 minute
    When "Spammer" makes another request
    Then the response should be 429 Too Many Requests
    And the response should include Retry-After header
    And an audit log should record the violation

  Scenario: IP-based auth rate limiting
    Given an IP address has failed authentication 100 times
    When another auth attempt is made from that IP
    Then the request should be rejected immediately
    And CAP-002 should log the security event
```

## User Stories Dependent on This Capability

All user stories that make API calls depend on rate limiting:
- US-001 through US-020 - All operations

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-005 | Auth rate limiting | ✅ Complete |
| ROAD-028 | Global rate limiting | 🎯 Planned |

## Bounded Context Coverage

- ✅ All contexts - Applied at API gateway layer

## Dependencies

- Depends on: CAP-001 (Authentication) - identify who to limit
- Required by: None (enforcement layer)

## Verification

```bash
# Test rate limiting
just bdd-tag @CAP-004

# Load test rate limits
just load-test --endpoint /api/promises --requests 2000
```

---

**Tag**: `@CAP-004` | **Category**: Security | **Status**: Stable
