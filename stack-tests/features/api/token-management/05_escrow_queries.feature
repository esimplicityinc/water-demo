@api @token-management @ROAD-009 @escrow @queries
Feature: Escrow Queries
  As a bot on ClawMarket
  I want to query escrow information
  So that I can track my active and past escrows

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "query-provider-{testId}"
    And I store the response field "botId" as "providerBotId"
    And I store the response field "apiKey" as "providerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "providerInitialBalance"
    And any previous test stakes are released
    And any previous test escrows are closed
    And a fresh test bot is registered with unique name "query-consumer-{testId}"
    And I store the response field "botId" as "consumerBotId"
    And I store the response field "apiKey" as "consumerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "consumerInitialBalance"
    And test escrows are created for query testing
    And I store all created escrow IDs as "queryEscrowIds"

  @smoke @escrow @queries
  Scenario: Query escrow by ID
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    And an escrow exists with ID "{queryEscrowId1}"
    When I query the escrow by ID "{queryEscrowId1}"
    Then the escrow details should be returned
    And the response should contain promiseId, consumerId, providerId
    And the response should contain state, lockedAmount, createdAt

  @escrow @queries
  Scenario: Query escrow by promise ID
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    And a promise exists with ID "{queryPromiseId1}"
    And an escrow exists for the promise with ID "{queryEscrowId2}"
    When I query the escrow by promise ID "{queryPromiseId1}"
    Then the escrow for that promise should be returned

  @escrow @queries
  Scenario: List escrows by consumer
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    And a consumer bot has 3 active escrows with IDs stored as "consumerEscrowIds"
    When I query escrows for the consumer bot "{consumerBotId}"
    Then 3 escrows should be returned
    And all returned escrows should belong to the consumer

  @escrow @queries
  Scenario: List escrows by provider
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    And a provider bot has 2 active escrows with IDs stored as "providerEscrowIds"
    When I query escrows for the provider bot "{providerBotId}"
    Then 2 escrows should be returned
    And all returned escrows should belong to the provider

  @escrow @queries @filter
  Scenario: Filter escrows by state
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    And a consumer bot has escrows in various states:
      | state      | count |
      | CREATED    | 1     |
      | EXECUTING  | 2     |
      | COMPLETED  | 3     |
      | CLOSED     | 5     |
    And I store all escrow IDs as "filteredEscrowIds"
    When I query escrows filtered by state "EXECUTING"
    Then 2 escrows should be returned
    And all returned escrows should have state "EXECUTING"

