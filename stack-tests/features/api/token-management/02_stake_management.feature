@ROAD-010 @api @token-management
Feature: Stake Management
  As a provider bot
  I want to lock tokens as stake
  So that I can back my promises with collateral

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "stake-test-{testId}"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "initialBalance"
    And any previous test stakes are released
    And any previous test escrows are closed

  @smoke @stake @pending
  Scenario: Lock tokens as stake
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Lock tokens as stake
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 1000
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field        | value  |
      | lockedAmount | 1000   |
      | botId        | {botId}|
    And I store the response field "stakeId" as "stakeId1"
    # Verify wallet reflects locked balance
    When I GET "/api/wallets/me"
    Then the response field "lockedBalance" should equal 1000
    And the response field "availableBalance" should equal 9000

  @stake @validation @pending
  Scenario: Reject stake exceeding available balance
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Lock some tokens first
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 9500
      }
      """
    Then the response status should be 200
    And I store the response field "stakeId" as "stakeId2"
    # Attempt to lock more than available
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 1000
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Insufficient"

  @stake @release @pending
  Scenario: Release stake after promise completion
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Setup: lock tokens
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 1000
      }
      """
    Then the response status should be 200
    And I store the response field "stakeId" as "stakeId3"
    # Release the stake
    When I POST "/api/stakes/{stakeId3}/release" with body:
      """
      {}
      """
    Then the response status should be 200
    # Verify wallet reflects released balance
    When I GET "/api/wallets/me"
    Then the response field "lockedBalance" should equal 0
    And the response field "availableBalance" should equal 10000

  @stake @slash @pending
  Scenario: Slash stake after promise failure
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Setup: lock tokens
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 1000
      }
      """
    Then the response status should be 200
    And I store the response field "stakeId" as "stakeId4"
    # Slash the stake
    When I POST "/api/stakes/{stakeId4}/slash" with body:
      """
      {
        "reason": "Promise failed"
      }
      """
    Then the response status should be 200
    # Verify wallet reflects slashed balance
    When I GET "/api/wallets/me"
    Then the response field "lockedBalance" should equal 0
    And the response field "balance" should equal 9000

  @stake @minimum @pending
  Scenario: Stake must meet minimum requirement for promise
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Create a promise with insufficient stake
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 1000,
          "stakeAmount": 50
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "stake"

  @stake @query @pending
  Scenario: Query current stake lock status
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Setup: lock tokens
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 500
      }
      """
    Then the response status should be 200
    And I store the response field "stakeId" as "stakeId5"
    # Query stake status
    When I GET "/api/stakes/me"
    Then the response status should be 200
    And the response should contain fields:
      | field            | value       |
      | totalLockedAmount| {amount}    |
      | activeStakes     | {array}     |
      | botId            | {botId}     |

