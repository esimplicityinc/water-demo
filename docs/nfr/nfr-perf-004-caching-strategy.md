---
id: NFR-PERF-004
title: Caching Strategy
category: performance
priority: must
status: active
created: 2026-01-31
---

# NFR-PERF-004: Caching Strategy

## Requirement

The system must implement a multi-layer caching strategy to optimize performance, reduce database load, and improve response times.

## Rationale

Effective caching is essential for:
- Reducing database query load and associated costs
- Improving response times for frequently accessed data
- Handling read-heavy workloads common in marketplace browsing
- Maintaining performance during traffic spikes
- Reducing latency for global users via CDN distribution
- Enabling offline capabilities for certain features

In the LLM Compute Futures Marketplace, caching market data, bot profiles, and order book snapshots significantly improves user experience while reducing infrastructure costs.

## Specifications

### Cache Hit Rate Targets

| Cache Layer | Target Hit Rate | Minimum Acceptable |
|-------------|----------------|-------------------|
| Browser Cache | N/A (client-side) | Proper headers set |
| CDN Cache | 85% | 70% |
| Application Cache (Redis) | 80% | 65% |
| Database Query Cache | 60% | 50% |
| Overall Effective Hit Rate | > 80% | 70% |

### Cache Invalidation Targets

| Data Type | Invalidation Time | Strategy |
|-----------|------------------|----------|
| Static Assets | < 1 second | Versioned URLs + CDN purge |
| Market Data | < 5 seconds | Time-based TTL + pub/sub |
| User Sessions | < 1 second | Immediate invalidation |
| Bot Profiles | < 10 seconds | Write-through + event-driven |
| Order Book | Real-time | WebSocket updates + short TTL |
| API Responses | < 1 second | Cache-Control headers |

### Coverage Areas

- **Redis Caching**: Application-level caching for database queries and computed data
- **CDN Caching**: Edge caching for static assets and API responses
- **Browser Caching**: Client-side caching with proper Cache-Control headers
- **Query Result Caching**: Convex query result caching where applicable
- **In-Memory Caching**: Application instance caching for hot data

### Cache TTL Strategy

| Data Category | TTL | Invalidation Trigger |
|--------------|-----|---------------------|
| Static Assets | 1 year | Content hash change |
| Market Prices | 5 seconds | Price update event |
| Bot Listings | 1 minute | Listing update |
| User Profiles | 5 minutes | Profile change |
| Order History | 10 minutes | New order placed |
| System Config | 1 hour | Config update |

## Measurement

- **Tool**: Redis INFO stats + CDN analytics + custom cache metrics
- **Frequency**: Real-time monitoring with hourly reporting
- **Environment**: Production
- **Metrics Tracked**:
  - Cache hit rate by layer
  - Cache miss rate
  - Invalidation latency
  - Cache size and memory usage
  - Stale data incidents

## Validation Criteria

```gherkin
Feature: Caching Strategy Performance

  Scenario: Cache hit rate meets target
    Given the system has been running under normal load for 1 hour
    When I analyze cache statistics across all layers
    Then the overall cache hit rate should be >= 80%
    And the CDN cache hit rate should be >= 85%
    And the Redis cache hit rate should be >= 80%

  Scenario: Cache invalidation occurs within target time
    Given a cached bot profile exists
    When the bot profile is updated
    Then the cache should be invalidated within 10 seconds
    And subsequent requests should receive the updated data
    And no stale data should be served after invalidation

  Scenario: Static assets are properly cached
    When a user requests static assets (JS, CSS, images)
    Then the response should include proper Cache-Control headers
    And repeat requests should return 304 Not Modified
    And assets should be served from CDN edge locations

  Scenario: Market data cache provides real-time consistency
    Given market price data is cached with 5-second TTL
    When market prices update
    Then the cache should reflect new prices within 5 seconds
    And WebSocket subscribers should receive immediate updates
    And cached API responses should not exceed 5-second staleness

  Scenario: Cache prevents database overload
    Given a popular bot profile is accessed 1000 times
    When all requests occur within a 1-minute window
    Then the database should receive <= 5 queries for that profile
    And 995+ requests should be served from cache
    And response times should remain under 50ms
```

## Acceptance Criteria

1. **Hit Rate**: Overall cache hit rate > 80%, CDN > 85%, Redis > 80%
2. **Invalidation Speed**: Cache invalidation completes within specified time limits (1-10 seconds depending on data type)
3. **No Stale Data**: Zero incidents of serving stale data beyond TTL
4. **Database Load Reduction**: Cache reduces database queries by at least 70% for cached data patterns
5. **Response Time Improvement**: Cached responses are 10x faster than uncached (e.g., 20ms vs 200ms)
6. **CDN Distribution**: Static assets served from edge locations within 100ms globally
7. **Cache Warming**: Critical data is pre-loaded into cache on deployment

## Related ADRs

- [ADR-023](../adr/adr-023-performance.md) - Performance Best Practices
- [ADR-029](../adr/adr-029-redis-caching.md) - Redis Caching Strategy
- [ADR-030](../adr/adr-030-cdn-configuration.md) - CDN Configuration
- [ADR-031](../adr/adr-031-cache-invalidation.md) - Cache Invalidation Patterns

## Verification Approach

1. **Metrics Dashboard**: Real-time cache hit rate monitoring
2. **Load Testing**: Verify cache behavior under high load
3. **Invalidation Testing**: Automated tests for cache invalidation paths
4. **Stale Data Detection**: Monitoring for data freshness violations
5. **Cost Analysis**: Monthly review of cache effectiveness vs. infrastructure costs

## Exceptions

- Real-time trading data may bypass caching for consistency
- User-specific sensitive data is never cached in shared caches
- Cache may be bypassed during debugging or data recovery operations

## Related

- [NFR-PERF-001](./nfr-perf-001-api-response-time.md) - API Response Time
- [NFR-PERF-002](./nfr-perf-002-database-query-performance.md) - Database Query Performance
- [NFR-PERF-003](./nfr-perf-003-concurrent-user-load.md) - Concurrent User Load
- [NFR-PERF-005](./nfr-perf-005-asset-optimization.md) - Asset Optimization
