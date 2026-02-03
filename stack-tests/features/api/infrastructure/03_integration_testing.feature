@ROAD-026 @api @testing @integration @pending
Feature: Integration Testing - Cross-Component Interactions
  As a ClawMarket developer
  I want comprehensive integration tests between system layers
  So that I can ensure components interact correctly and data flows properly across the system

  Background:
    Given the integration test environment is initialized
    And the test database is clean and seeded with baseline data
    And all external service mocks are configured
    And the event bus is connected and ready

  # ============================================
  # API to Database Integration
  # ============================================

  @integration @api @database @critical
  Scenario: API request successfully persists data to database
    Given the API server is running
    And the database connection pool is active
    When a POST request is sent to "/api/v1/compute-orders" with valid order data
    Then the response status should be 201 Created
    And the response should contain the created order ID
    And the order should be persisted in the "compute_orders" table
    And the order status should be "pending" in the database
    And the created_at timestamp should be within 5 seconds of current time

  @integration @api @database @read
  Scenario: API retrieves data correctly from database
    Given a compute order exists in the database with ID "order-123"
    And the order has status "active" and price "100.00"
    When a GET request is sent to "/api/v1/compute-orders/order-123"
    Then the response status should be 200 OK
    And the response body should contain the order details
    And the "status" field should equal "active"
    And the "price" field should equal "100.00"
    And the data should match the database record exactly

  @integration @api @database @update
  Scenario: API update propagates changes to database
    Given a compute order exists with status "pending"
    When a PATCH request is sent to update the order status to "confirmed"
    Then the response status should be 200 OK
    And the database record should reflect the status change
    And the "updated_at" timestamp should be updated
    And the order history table should contain the status change event

  @integration @api @database @delete
  Scenario: API deletion removes data from database with soft delete
    Given a compute order exists with ID "order-to-delete"
    When a DELETE request is sent to "/api/v1/compute-orders/order-to-delete"
    Then the response status should be 204 No Content
    And the order should be marked as deleted in the database
    And the "deleted_at" timestamp should be set
    And the order should not appear in standard GET queries
    But the order should still exist in the database for audit purposes

  # ============================================
  # Service Layer Integration
  # ============================================

  @integration @service @business-logic @critical
  Scenario: Service layer coordinates multiple domain operations
    Given a valid compute order request
    And the user has sufficient token balance
    And the LLM provider has available capacity
    When the order service processes the request
    Then the order should be created in pending state
    And the token balance should be reserved
    And the capacity should be allocated
    And an order creation event should be published
    And all operations should complete within 3 seconds

  @integration @service @transaction @consistency
  Scenario: Service layer maintains data consistency across operations
    Given a compute order with multiple associated tasks
    When the service updates the order and all related tasks atomically
    Then all database updates should succeed or all should fail
    And partial updates should not leave data in inconsistent state
    And the transaction rollback should work correctly on failure
    And the final state should satisfy all business invariants

  @integration @service @validation @cross-layer
  Scenario: Validation errors propagate from domain to API layer
    Given an invalid compute order request with negative price
    When the request passes through the API and service layers
    Then the domain validation should reject the request
    And the validation error should propagate to the API layer
    And the response should contain specific error messages
    And the HTTP status should be 400 Bad Request
    And no data should be persisted to the database

  # ============================================
  # External API Integrations
  # ============================================

  @integration @external-api @llm-provider @critical
  Scenario: External LLM provider API integration
    Given the LLM provider API is accessible
    And valid API credentials are configured
    When a compute request is sent to the external provider
    Then the external API should respond within timeout threshold
    And the response should be parsed correctly
    And the compute result should be stored in our database
    And the external request ID should be linked to our order

  @integration @external-api @payment-gateway
  Scenario: Payment gateway integration for token purchases
    Given a user initiates a token purchase
    And the payment gateway is available
    When the payment request is sent to the external gateway
    Then the gateway should process the payment
    And the webhook callback should be received
    And the token balance should be updated upon confirmation
    And the transaction record should link to the external payment ID

  @integration @external-api @error-handling
  Scenario: External API failure handling and fallback
    Given the external LLM provider API is unavailable
    When a compute request is initiated
    Then the system should detect the API failure
    And the request should be queued for retry
    And an alert should be sent to the monitoring system
    And the user should receive a graceful error message
    And the order status should be set to "provider_unavailable"

  # ============================================
  # Event Publishing and Subscribing
  # ============================================

  @integration @events @pub-sub @async
  Scenario: Events published by one service consumed by another
    Given the event bus is operational
    And a subscriber is registered for "OrderCreated" events
    When an order is created through the API
    Then the "OrderCreated" event should be published
    And the subscriber should receive the event within 2 seconds
    And the event payload should contain complete order details
    And the subscriber should process the event successfully

  @integration @events @eventual-consistency
  Scenario: Event-driven updates maintain eventual consistency
    Given an order status update event is published
    When multiple subscribers process the event concurrently
    Then all subscribers should eventually process the event
    And the analytics database should reflect the update
    And the search index should be updated
    And the notification service should send alerts
    And all systems should reach consistent state within 5 seconds

  # ============================================
  # Transaction Consistency
  # ============================================

  @integration @transaction @acid @critical
  Scenario: Multi-table transaction maintains ACID properties
    Given a compute order creation involves 3 related tables
    When the transaction is executed
    Then all inserts should succeed together
    But if an error occurs, all inserts should fail together
    And concurrent transactions should not interfere
    And committed data should survive system restart

  @integration @transaction @distributed
  Scenario: Distributed transaction across services
    Given an order spans the order service and billing service
    When a distributed transaction is initiated
    Then both services should participate in the transaction
    And the two-phase commit should coordinate the transaction
    And partial failures should trigger rollback in both services
    And the Saga pattern should handle long-running transactions

  # ============================================
  # Error Propagation Across Layers
  # ============================================

  @integration @error-handling @propagation
  Scenario: Database errors propagate correctly to API responses
    Given the database connection is unstable
    When an API request triggers a database query
    And the database throws a connection error
    Then the error should be caught by the repository layer
    And the service layer should handle the error gracefully
    And the API should return a 503 Service Unavailable status
    And the error should be logged with full stack trace
    And the response should not expose internal error details

  @integration @error-handling @circuit-breaker
  Scenario: Circuit breaker pattern prevents cascade failures
    Given an external service is experiencing high failure rates
    When multiple requests are sent to the failing service
    Then the circuit breaker should open after threshold failures
    And subsequent requests should fail fast without calling the service
    And the circuit breaker should enter half-open state after timeout
    And successful test requests should close the circuit

  # ============================================
  # Data Flow Validation
  # ============================================

  @integration @data-flow @end-to-end
  Scenario: Complete data flow from API to external provider and back
    Given a new compute order is submitted via API
    When the order flows through all system layers
    Then the order should be validated at API layer
    And transformed at service layer
    And persisted at database layer
    And submitted to external LLM provider
    And the result should flow back through all layers
    And the final response should contain the compute result
    And the database should reflect the complete order lifecycle

  @integration @data-flow @transformation
  Scenario: Data transformations between layers
    Given API receives data in JSON format
    When data flows through domain models and database
    Then API DTOs should map to domain objects correctly
    And domain objects should map to database entities correctly
    And data types should be preserved through transformations
    And null handling should be consistent across layers
    And date/time formats should be standardized

  # ============================================
  # Integration Test Environment Setup
  # ============================================

  @integration @environment @setup
  Scenario: Integration test environment initializes correctly
    When the integration test suite starts
    Then the test database should be created
    And the database schema should match production
    And test data fixtures should be loaded
    And external service mocks should be started
    And the message queue should be cleared
    And all health checks should pass
    And the environment should be ready within 30 seconds

  @integration @environment @teardown
  Scenario: Integration test environment cleanup
    Given integration tests have completed
    When the test environment is torn down
    Then all test data should be removed
    And database connections should be closed
    And external service mocks should be stopped
    And temporary files should be deleted
    And the environment should be restored to clean state

  @integration @environment @isolation
  Scenario: Test isolation prevents cross-test contamination
    Given Test A creates data in the database
    When Test B runs after Test A
    Then Test B should not see Test A's data
    And Test B should start with clean database state
    And parallel tests should not interfere with each other
    And each test should have isolated transaction scope
