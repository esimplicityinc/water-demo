---
id: CAP-004
title: Anomaly Detection
category: Security
tag: "@CAP-004"
status: stable
---

# CAP-004: Anomaly Detection

Cross-cutting capability for preventing abuse and ensuring fair resource usage.

## Overview

Anomaly detection protects the system from abuse, ensures fair access for all customers, and maintains system stability under load.

## Scope

### Covers
- Per-customer anomaly detection
- Per-IP anomaly detection (for auth)
- Different limits per endpoint type
- Burst allowance with smoothing

### Does Not Cover
- Global system load balancing
- DDoS protection (CloudFlare layer)

## Technical Implementation

### Rate Limit Tiers

| Endpoint Type | Limit | Window | Burst |
|---------------|-------|--------|-------|
| customer portal authentication | 100 | 15 min | 10 |
| API (general) | 1000 | 1 min | 50 |
| Commitment Creation | 100 | 1 min | 10 |
| Order Book Queries | 500 | 1 min | 100 |
| WebSocket | 1000 | 1 min | Unlimited |

### Implementation
```typescript
// Sliding window counter
interface RateLimitEntry {
  key: string;        // customerid or IP
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
| NFR-FAIR-001 | Fair resource sharing | Per-customer isolation |

## BDD Test Coverage

Tag all rate limit tests with `@CAP-004`:

```gherkin
@CAP-004 @ROAD-005
Feature: Anomaly detection

  Scenario: Customer exceeds API rate limit
    Given customer "Spammer" has made 1000 API requests in 1 minute
    When "Spammer" makes another request
    Then the response should be 429 Too Many Requests
    And the response should include Retry-After header
    And an usage log should record the violation

  Scenario: IP-based auth anomaly detection
    Given an IP address has failed customer portal authentication 100 times
    When another auth attempt is made from that IP
    Then the request should be rejected immediately
    And CAP-002 should log the security event
```

## User Stories Dependent on This Capability

All user stories that make API calls depend on anomaly detection:
- US-001 through US-020 - All operations

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-005 | Auth anomaly detection | ✅ Complete |
| ROAD-028 | Global anomaly detection | 🎯 Planned |

## Bounded Context Coverage

- ✅ All contexts - Applied at API gateway layer

## Dependencies

- Depends on: CAP-001 (customer portal authentication) - identify who to limit
- Required by: None (enforcement layer)

## Verification

```bash
# Test anomaly detection
just bdd-tag @CAP-004

# Load test anomaly thresholds
just load-test --endpoint /api/commitments --requests 2000
```

---

**Tag**: `@CAP-004` | **Category**: Security | **Status**: Stable
