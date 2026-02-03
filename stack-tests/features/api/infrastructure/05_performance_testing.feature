@ROAD-029 @api @performance @load @pending
Feature: Performance Optimization and Load Testing
  As a system operator
  I want to ensure the ClawMarket platform meets performance requirements
  So that users experience fast, responsive interactions even under heavy load

  Background:
    Given the performance test environment is initialized
    And the system is warmed up with baseline requests

  # ============================================================================
  # API Response Time Benchmarks
  # ============================================================================
  @smoke @response-time
  Scenario: API endpoints respond within acceptable time thresholds
    Given I am authenticated as an admin via API
    When I measure response time for GET "/api/v1/health"
    Then the response status should be 200
    And the response time should be less than 100 milliseconds

    When I measure response time for GET "/api/v1/markets"
    Then the response status should be 200
    And the response time should be less than 200 milliseconds

    When I measure response time for GET "/api/v1/promises"
    Then the response status should be 200
    And the response time should be less than 200 milliseconds

  @critical @response-time
  Scenario: Critical trading endpoints meet strict latency requirements
    Given I am authenticated as a user via API
    And a test promise exists in the system
    When I measure response time for POST "/api/v1/orders" with JSON body:
      """
      {
        "promiseId": "{testPromiseId}",
        "side": "buy",
        "amount": 1.0,
        "price": 100.00
      }
      """
    Then the response status should be 201
    And the response time should be less than 150 milliseconds

    When I measure response time for GET "/api/v1/orders"
    Then the response status should be 200
    And the response time should be less than 200 milliseconds

  # ============================================================================
  # Concurrent User Load Testing
  # ============================================================================
  @load @concurrent @stress
  Scenario: System handles 100 concurrent users accessing market data
    Given I am authenticated as an admin via API
    When 100 concurrent users send GET requests to "/api/v1/markets" for 60 seconds
    Then the average response time should be less than 300 milliseconds
    And the 95th percentile response time should be less than 500 milliseconds
    And the error rate should be less than 0.1%
    And all responses should have status 200

  @load @concurrent @stress
  Scenario: System handles 100 concurrent users viewing promise listings
    Given I am authenticated as an admin via API
    And 50 test promises exist in the system
    When 100 concurrent users send GET requests to "/api/v1/promises" for 60 seconds
    Then the average response time should be less than 400 milliseconds
    And the 99th percentile response time should be less than 800 milliseconds
    And the throughput should be at least 500 requests per second
    And no requests should timeout

  @load @concurrent @stress
  Scenario: System maintains stability under sustained load of 200 concurrent users
    Given I am authenticated as an admin via API
    When 200 concurrent users perform mixed operations for 5 minutes:
      | Operation | Weight | Endpoint              |
      | GET       | 60%    | /api/v1/markets       |
      | GET       | 30%    | /api/v1/promises      |
      | GET       | 10%    | /api/v1/orderbook     |
    Then the system should maintain response times under 500 milliseconds
    And memory usage should remain stable without growth exceeding 10%
    And CPU utilization should stay below 80%
    And no connection errors should occur

  # ============================================================================
  # Database Query Performance
  # ============================================================================
  @database @query-performance
  Scenario: Database queries execute within optimal time limits
    Given I am authenticated as an admin via API
    And the database contains 10000 promise records
    When I measure query execution time for promise listing with filters
    Then the database query time should be less than 50 milliseconds

    When I query promises with pagination (page 1, limit 100)
    Then the response status should be 200
    And the database query time should be less than 30 milliseconds
    And the total result count should be returned within 100 milliseconds

  @database @query-performance @index
  Scenario: Indexed queries perform significantly faster than non-indexed
    Given I am authenticated as an admin via API
    And the database contains 50000 order records
    When I search orders by indexed field "status"
    Then the query execution time should be less than 20 milliseconds

    When I search orders by non-indexed field with optimization
    Then the query execution time should be less than 100 milliseconds
    And the query plan should indicate index usage

  # ============================================================================
  # Promise Listing Load Time
  # ============================================================================
  @promise-listing @load-time
  Scenario: Promise listing page loads within acceptable time
    Given I am authenticated as a user via API
    And 100 active promises exist in the system
    When I GET "/api/v1/promises" with parameters:
      | Parameter | Value    |
      | status    | active   |
      | limit     | 50       |
      | sort      | created  |
    Then the response status should be 200
    And the response time should be less than 250 milliseconds
    And the response should contain 50 promises
    And all promise data should be fully populated

  @promise-listing @load-time @pagination
  Scenario: Paginated promise listing maintains performance across pages
    Given I am authenticated as a user via API
    And 500 promises exist across multiple pages
    When I request pages 1 through 10 sequentially
    Then each page should load in less than 200 milliseconds
    And the total time for all pages should be less than 2 seconds
    And pagination metadata should be consistent

  # ============================================================================
  # Order Book Update Latency
  # ============================================================================
  @orderbook @latency @real-time
  Scenario: Order book updates propagate with minimal latency
    Given I am authenticated as a user via API
    And an active promise with order book exists
    When I place a new order via POST "/api/v1/orders"
    Then the order book should update within 100 milliseconds

    When I cancel the order via DELETE "/api/v1/orders/{orderId}"
    Then the order book should reflect the cancellation within 100 milliseconds
    And WebSocket subscribers should receive update within 50 milliseconds

  @orderbook @latency @concurrent
  Scenario: Order book handles concurrent updates without latency degradation
    Given I am authenticated as an admin via API
    And 10 active promises with order books exist
    When 50 concurrent orders are placed across all promises
    Then each order book update should complete within 200 milliseconds
    And no order updates should be lost or delayed beyond 500 milliseconds
    And the final order book state should be consistent

  # ============================================================================
  # Memory Usage Under Load
  # ============================================================================
  @memory @load @monitoring
  Scenario: Memory usage remains stable under increasing load
    Given I am authenticated as an admin via API
    And the baseline memory usage is recorded
    When the system handles 50 concurrent users for 2 minutes
    Then memory usage should not exceed baseline by more than 15%

    When the load increases to 100 concurrent users for 2 minutes
    Then memory usage should not exceed baseline by more than 25%
    And no memory leaks should be detected
    And garbage collection should occur without impacting response times

  @memory @load @stress
  Scenario: System recovers memory after load subsides
    Given I am authenticated as an admin via API
    When the system processes 1000 requests with large payloads
    Then memory usage may temporarily increase

    When the system returns to idle state for 30 seconds
    Then memory usage should return to within 10% of baseline
    And no residual objects from processed requests should remain

  # ============================================================================
  # Caching Effectiveness
  # ============================================================================
  @cache @performance @optimization
  Scenario: Cached responses significantly improve performance
    Given I am authenticated as a user via API
    When I GET "/api/v1/markets" for the first time
    Then the response time should be less than 200 milliseconds
    And the response should include cache miss header

    When I GET "/api/v1/markets" again within cache TTL
    Then the response time should be less than 50 milliseconds
    And the response should include cache hit header
    And the response content should match the first request

  @cache @performance @invalidation
  Scenario: Cache invalidation maintains data consistency
    Given I am authenticated as an admin via API
    And market data is cached
    When I update market data via PATCH "/api/v1/markets/{marketId}"
    Then the cache should be invalidated within 100 milliseconds

    When I GET "/api/v1/markets" immediately after update
    Then the response should include fresh data
    And the response time may exceed cache hit threshold
    And subsequent requests should be served from cache

  @cache @performance @ttl
  Scenario: Cache TTL expires correctly and refreshes data
    Given I am authenticated as a user via API
    And cached data exists with 60 second TTL
    When I wait for the TTL to expire
    And I GET "/api/v1/promises"
    Then the response should be fetched from origin
    And the response time should be less than 300 milliseconds
    And the cache should be repopulated with fresh data

  # ============================================================================
  # Static Asset Loading Times
  # ============================================================================
  @static-assets @performance @cdn
  Scenario: Static assets load efficiently with proper caching
    Given the application is deployed
    When I request static assets:
      | Asset Type | Path              | Max Time |
      | JavaScript | /static/app.js    | 100ms    |
      | CSS        | /static/styles.css| 50ms     |
      | Images     | /static/logo.png  | 100ms    |
      | Fonts      | /static/fonts/    | 100ms    |
    Then each asset should load within its specified maximum time
    And assets should include proper cache headers
    And compressed assets should be served when supported

  @static-assets @performance @bundle
  Scenario: JavaScript bundles are optimized for fast loading
    Given the application is deployed
    When I analyze the main JavaScript bundle
    Then the total bundle size should be less than 500KB (gzipped)
    And code splitting should create chunks under 100KB each
    And critical CSS should be inlined
    And lazy-loaded modules should not block initial render

  # ============================================================================
  # WebSocket Message Throughput
  # ============================================================================
  @websocket @throughput @real-time
  Scenario: WebSocket handles high message throughput
    Given I am authenticated as a user via API
    And a WebSocket connection is established to "/ws/market-data"
    When the server broadcasts 1000 price updates per second
    Then all clients should receive messages within 50 milliseconds
    And message latency should remain under 100 milliseconds at 95th percentile
    And no messages should be dropped

  @websocket @throughput @concurrent
  Scenario: WebSocket maintains performance with 500 concurrent connections
    Given 500 WebSocket clients are connected to "/ws/orderbook"
    When order book updates are broadcast to all clients
    Then each client should receive updates within 100 milliseconds
    And server CPU usage should remain below 70%
    And memory usage per connection should be under 1MB
    And connection stability should be 99.9%

  @websocket @throughput @reconnection
  Scenario: WebSocket connections recover quickly after disruption
    Given 100 WebSocket clients are connected
    When network disruption occurs for 5 seconds
    Then clients should detect disconnection within 5 seconds
    And reconnection attempts should begin automatically
    And successful reconnection should occur within 10 seconds
    And missed messages should be replayed or client should receive snapshot

  # ============================================================================
  # Stress Testing Scenarios
  # ============================================================================
  @stress @spike @recovery
  Scenario: System recovers from traffic spike
    Given I am authenticated as an admin via API
    And the system is operating at normal load with 50 concurrent users
    When traffic suddenly spikes to 500 concurrent users for 30 seconds
    Then the system should handle the spike without crashing
    And response times may degrade but should not exceed 2 seconds
    And error rate should remain below 5%

    When traffic returns to normal levels
    Then response times should recover to under 300 milliseconds within 60 seconds
    And all queued requests should be processed
    And system resources should return to normal levels

  @stress @endurance @stability
  Scenario: System maintains performance during extended operation
    Given I am authenticated as an admin via API
    When the system operates under 75% maximum load for 4 hours
    Then average response time should remain under 400 milliseconds
    And memory usage should not grow continuously
    And no resource exhaustion should occur
    And database connection pool should remain stable
    And log files should not grow excessively

  @stress @degradation @graceful
  Scenario: System degrades gracefully under extreme load
    Given I am authenticated as an admin via API
    When load exceeds system capacity with 1000+ concurrent users
    Then the system should return 503 status for excess requests
    And critical endpoints should be prioritized
    And non-critical features may be disabled
    And error messages should be informative
    And the system should not crash or become unresponsive

  # ============================================================================
  # Performance Regression Testing
  # ============================================================================
  @regression @benchmark @comparison
  Scenario: Performance metrics meet or exceed baseline benchmarks
    Given I am authenticated as an admin via API
    And baseline performance metrics are loaded from previous release
    When current performance tests are executed
    Then all response time metrics should be within 10% of baseline
    And throughput metrics should meet or exceed baseline
    And error rates should not exceed baseline
    And any performance degradation should be flagged for review
