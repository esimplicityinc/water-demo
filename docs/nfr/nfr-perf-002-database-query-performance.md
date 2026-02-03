---
id: NFR-PERF-002
title: Database Query Performance
category: performance
priority: must
status: active
created: 2026-01-31
---

# NFR-PERF-002: Database Query Performance

## Requirement

Database queries must execute within specified time limits to ensure responsive user experiences and efficient resource utilization.

## Rationale

Database query performance directly impacts:
- User experience and perceived system responsiveness
- Scalability under concurrent load
- Resource efficiency and cost optimization
- Ability to handle complex data relationships in the LLM Compute Futures Marketplace

Slow queries can cascade into system-wide performance degradation, affecting bot trading, order matching, and real-time market data updates.

## Specifications

### Query Response Time Targets

| Percentile | Target Response Time | Maximum Response Time |
|------------|---------------------|----------------------|
| P95 | < 50ms | 100ms |
| P99 | < 100ms | 200ms |

### Query Categories

**Simple Queries** (single table, indexed lookup):
- P95: < 20ms
- P99: < 50ms

**Complex Queries** (joins, aggregations, pagination):
- P95: < 100ms
- P99: < 200ms

**Batch Operations** (bulk inserts/updates):
- P95: < 500ms
- P99: < 1000ms

### Coverage Areas

- **Convex Queries**: All Convex database queries must meet performance targets
- **Indexing Strategy**: Proper indexes must exist for all query patterns
- **Pagination**: Large result sets must use cursor-based pagination
- **Query Optimization**: N+1 queries must be eliminated

## Measurement

- **Tool**: Convex dashboard query performance metrics + custom instrumentation
- **Frequency**: Continuous monitoring with hourly aggregation
- **Environment**: Production and staging
- **Metrics Tracked**:
  - Query execution time
  - Query frequency
  - Slow query log (queries > 100ms)
  - Index utilization rates

## Validation Criteria

```gherkin
Feature: Database Query Performance

  Scenario: Simple indexed queries meet performance targets
    When I execute 1000 simple lookup queries on indexed fields
    Then 95% of queries should complete within 20ms
    And 99% of queries should complete within 50ms
    And no queries should exceed 100ms

  Scenario: Complex queries with joins meet performance targets
    When I execute 500 complex queries involving multiple table joins
    Then 95% of queries should complete within 100ms
    And 99% of queries should complete within 200ms
    And no queries should exceed 500ms

  Scenario: Paginated queries maintain performance
    When I request paginated results with cursor-based pagination
    Then each page should load within 50ms
    And navigating through 10 pages should complete within 500ms total

  Scenario: No N+1 query patterns exist
    When I fetch a list of 100 bots with their associated orders
    Then the total number of database queries should be <= 3
    And the response time should be under 100ms
```

## Acceptance Criteria

1. **Performance Targets Met**: 95% of all database queries complete in < 50ms, 99% in < 100ms
2. **Indexing Coverage**: 100% of query patterns have appropriate indexes
3. **Slow Query Elimination**: Zero queries consistently exceed 200ms
4. **Pagination Implementation**: All list endpoints use cursor-based pagination for datasets > 100 items
5. **N+1 Prevention**: No N+1 query patterns detected in production workloads

## Related ADRs

- [ADR-023](../adr/adr-023-performance.md) - Performance Best Practices
- [ADR-024](../adr/adr-024-database-indexing.md) - Database Indexing Strategy
- [ADR-025](../adr/adr-025-convex-optimization.md) - Convex Query Optimization

## Verification Approach

1. **Automated Testing**: Load tests with 1000+ concurrent queries
2. **Monitoring**: Real-time query performance dashboards
3. **Alerting**: PagerDuty alerts for P95 > 100ms sustained for 5 minutes
4. **Review**: Monthly query performance review with optimization recommendations
5. **Profiling**: Quarterly database query profiling and index optimization

## Exceptions

None. This is a must-have requirement for all database operations.

## Related

- [NFR-PERF-001](./nfr-perf-001-api-response-time.md) - API Response Time
- [NFR-PERF-003](./nfr-perf-003-concurrent-user-load.md) - Concurrent User Load
- [NFR-PERF-004](./nfr-perf-004-caching-strategy.md) - Caching Strategy
