@ROAD-009 @api @token-management
Feature: Escrow System
  As a marketplace participant
  I want tokens to be held in escrow during promise execution
  So that both parties are protected during the transaction

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "escrow-sys-provider-{testId}"
    And I store the response field "botId" as "providerBotId"
    And I store the response field "apiKey" as "providerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "providerInitialBalance"
    And any previous test stakes are released
    And any previous test escrows are closed
    And a fresh test bot is registered with unique name "escrow-sys-consumer-{testId}"
    And I store the response field "botId" as "consumerBotId"
    And I store the response field "apiKey" as "consumerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "consumerInitialBalance"

  @smoke @escrow @pending
  Scenario: Create escrow when promise is accepted
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Provider creates a promise
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId1"
    # Consumer bot accepts the promise
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId1}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId1"
    # Verify escrow was created
    When I GET "/api/escrows/{promiseId1}"
    Then the response status should be 200
    And the response should contain fields:
      | field    | value      |
      | status   | active     |
      | amount   | 500        |
      | promiseId| {promiseId1}|

  @escrow @release @pending
  Scenario: Release escrow to provider on successful completion
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId2"
    # Consumer accepts
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId2}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId2"
    # Complete the promise
    When I POST "/api/promises/{promiseId2}/complete" with body:
      """
      {}
      """
    Then the response status should be 200
    # Verify escrow released
    When I GET "/api/escrows/{promiseId2}"
    Then the response status should be 200
    And the response field "status" should equal "released"

  @escrow @return @pending
  Scenario: Return escrow to consumer on promise failure
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId3"
    # Consumer accepts
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId3}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId3"
    # Fail the promise
    When I POST "/api/promises/{promiseId3}/fail" with body:
      """
      {
        "reason": "Provider did not deliver"
      }
      """
    Then the response status should be 200
    # Verify escrow returned
    When I GET "/api/escrows/{promiseId3}"
    Then the response status should be 200
    And the response field "status" should equal "returned"

  @escrow @dispute @pending
  Scenario: Freeze escrow when dispute is raised
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId4"
    # Consumer accepts
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId4}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId4"
    # Complete the promise
    When I POST "/api/promises/{promiseId4}/complete" with body:
      """
      {}
      """
    Then the response status should be 200
    # Consumer raises dispute
    When I POST "/api/escrows/{promiseId4}/dispute" with body:
      """
      {
        "reason": "Quality did not match specification"
      }
      """
    Then the response status should be 200
    # Verify escrow is disputed
    When I GET "/api/escrows/{promiseId4}"
    Then the response status should be 200
    And the response field "status" should equal "disputed"

  @escrow @dispute-resolution @pending
  Scenario: Distribute escrow based on dispute resolution
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId5"
    # Consumer accepts
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId5}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId5"
    # Complete and dispute
    When I POST "/api/promises/{promiseId5}/complete" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/escrows/{promiseId5}/dispute" with body:
      """
      {
        "reason": "Quality did not match"
      }
      """
    Then the response status should be 200
    # Resolve dispute in favor of consumer
    When I POST "/api/escrows/{promiseId5}/resolve" with body:
      """
      {
        "resolution": "consumer_favored",
        "reason": "Provider failed to meet requirements"
      }
      """
    Then the response status should be 200
    # Verify escrow returned
    When I GET "/api/escrows/{promiseId5}"
    Then the response status should be 200
    And the response field "status" should equal "returned"

  @escrow @partial-settlement @pending
  Scenario: Partial escrow distribution in dispute
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId6"
    # Consumer accepts
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId6}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId6"
    # Complete and dispute
    When I POST "/api/promises/{promiseId6}/complete" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/escrows/{promiseId6}/dispute" with body:
      """
      {
        "reason": "Partial quality match"
      }
      """
    Then the response status should be 200
    # Resolve with partial settlement (60% provider)
    When I POST "/api/escrows/{promiseId6}/resolve" with body:
      """
      {
        "resolution": "partial",
        "providerPercentage": 60,
        "reason": "Partial quality match"
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field                | value  |
      | status               | released|
      | providerAmount       | 300    |
      | consumerAmount       | 200    |

  @escrow @query @pending
  Scenario: Query escrow status for a promise
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId7"
    # Consumer accepts
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId7}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId7"
    # Query escrow
    When I GET "/api/escrows/{promiseId7}"
    Then the response status should be 200
    And the response should contain fields:
      | field             | value      |
      | status            | active     |
      | amount            | 500        |
      | consumerWalletId  | {walletId} |
      | providerWalletId  | {walletId} |
      | createdAt         | {timestamp}|

  @escrow @invariant @pending
  Scenario: Escrow amount is immutable after creation
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    # Setup: Create promise with escrow
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId8"
    # Consumer accepts to create escrow
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId8}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And I store the response field "escrowId" as "escrowId8"
    # Attempt to modify escrow
    When I PATCH "/api/escrows/{promiseId8}" with body:
      """
      {
        "amount": 1000
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "cannot be modified"

