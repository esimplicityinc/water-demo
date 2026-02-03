---
id: NFR-PERF-001
title: API Response Time
category: performance
priority: must
status: active
created: 2026-01-31
---

# NFR-PERF-001: API Response Time

## Requirement

API endpoints must respond within specified time limits under normal load conditions.

## Specifications

### P95 Response Times

| Endpoint Type | Target | Maximum |
|--------------|--------|---------|
| Read Operations | < 100ms | 200ms |
| Write Operations | < 200ms | 500ms |
| Complex Queries | < 500ms | 1000ms |
| Batch Operations | < 1000ms | 2000ms |

### P99 Response Times

All P99 response times must be within 2x of the P95 targets.

## Measurement

- **Tool**: Playwright BDD tests with timing assertions
- **Frequency**: Every CI/CD run
- **Environment**: Production-like staging

## Validation Criteria

```gherkin
Feature: API Performance
  
  Scenario: Read operations meet performance targets
    When I make 100 concurrent GET requests to "/api/bots"
    Then 95% of responses should complete within 100ms
    And 99% of responses should complete within 200ms
    
  Scenario: Write operations meet performance targets
    When I make 50 concurrent POST requests to "/api/bots"
    Then 95% of responses should complete within 200ms
    And 99% of responses should complete within 500ms
```

## Exceptions

None. This is a must-have requirement.

## Related

- [NFR-PERF-002](./nfr-perf-002-page-load.md) - Page Load Time
- [ADR-023](../adr/adr-023-performance.md) - Performance Best Practices
