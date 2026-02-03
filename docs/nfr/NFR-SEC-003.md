---
id: NFR-SEC-003
title: Rate Limiting
category: security
priority: must
status: active
created: 2026-01-31
---

# NFR-SEC-003: Rate Limiting

## Requirement

The system must enforce strict rate limits to prevent DDoS attacks, API abuse, and ensure fair resource allocation across all consumers.

## Specifications

### Authenticated Request Limits

- 100 requests per minute per API key
- Burst allowance: 10 requests in 1 second
- Rate limit headers included in all responses:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: <remaining>
  X-RateLimit-Reset: <unix-timestamp>
  ```
- Rate limits reset on a rolling 60-second window

### Unauthenticated Request Limits

- 20 requests per minute per IP address
- Burst allowance: 5 requests in 1 second
- Stricter limits apply to suspicious IP patterns
- IP-based limits are shared across all endpoints

### Rate Limit Response

When limits are exceeded:
- HTTP 429 Too Many Requests status code
- Response body: `{"error": "Rate limit exceeded", "retry_after": <seconds>}`
- Retry-After header with seconds until reset
- Request logged for security analysis

### DDoS Protection

- Automatic IP blocking after 1000 requests in 1 hour
- Progressive delays: 1s, 5s, 15s for repeated violations
- CAPTCHA challenge after 3 consecutive rate limit violations
- Integration with Cloudflare for edge-level protection

### Abuse Prevention

- Anomaly detection for unusual traffic patterns
- Automatic flagging of keys with >10x normal usage
- Temporary suspension for suspected abuse (manual review required)
- Geographic blocking for high-risk regions (configurable)

## Security Headers

All rate-limited responses must include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Retry-After: <seconds>
Cache-Control: no-store
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Validation Criteria

```gherkin
Feature: Rate Limiting
  
  Scenario: Authenticated requests within limit
    Given a valid API key
    When I send 100 requests within 60 seconds
    Then all requests should receive 200 OK responses
    And rate limit headers should show remaining requests
    
  Scenario: Authenticated requests exceed limit
    Given a valid API key
    When I send 101 requests within 60 seconds
    Then the 101st request should receive 429 status
    And the response should include Retry-After header
    And the error message should indicate rate limit exceeded
    
  Scenario: Unauthenticated requests within limit
    Given an unauthenticated client with IP 192.168.1.1
    When I send 20 requests within 60 seconds
    Then all requests should receive appropriate responses
    
  Scenario: Unauthenticated requests exceed limit
    Given an unauthenticated client with IP 192.168.1.1
    When I send 21 requests within 60 seconds
    Then the 21st request should receive 429 status
    And subsequent requests from the same IP should be blocked
    
  Scenario: Rate limit reset after window
    Given an API key that has exceeded its rate limit
    When I wait 60 seconds
    And I send a new request
    Then the request should be accepted
    And X-RateLimit-Remaining should reset to 100
```

## Compliance

- OWASP API Security Top 10 - API4:2019 Lack of Resources & Rate Limiting
- SOC 2 Type II - CC7.2 System monitoring
- ISO 27001 - A.12.4 Logging and monitoring

## Related

- [ADR-009](../adr/adr-009-api-key-authentication.md) - API Key Authentication
- [CAP-004](../capabilities/CAP-004-rate-limiting.md) - Rate Limiting
- [NFR-SEC-001](./nfr-sec-001-authentication.md) - Authentication Requirements
