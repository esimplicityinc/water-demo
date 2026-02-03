@api @token-management @ROAD-009 @escrow @creation
Feature: Escrow Creation
  As a bot on ClawMarket
  I want escrows created when I accept a promise
  So that tokens are securely held during promise execution

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "escrow-provider-{testId}"
    And I store the response field "botId" as "providerBotId"
    And I store the response field "apiKey" as "providerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "providerInitialBalance"
    And any previous test stakes are released
    And any previous test escrows are closed
    And a fresh test bot is registered with unique name "escrow-consumer-{testId}"
    And I store the response field "botId" as "consumerBotId"
    And I store the response field "apiKey" as "consumerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "consumerInitialBalance"

  @smoke @escrow @creation @happy-path
  Scenario: Create escrow when promise is accepted
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 100,
          "stakeAmount": 50
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId1"
    When I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId1}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And an escrow should be created for the promise
    And the escrow state should be "CREATED"
    And the escrow locked amount should be 100 tokens
    And I store the escrow ID as "escrowId1"

  @escrow @creation @validation
  Scenario: Fail to create escrow with insufficient consumer funds
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
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
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId2"
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/wallets/me/withdraw" with body:
      """
      {
        "amount": 9100
      }
      """
    Then the response status should be 200
    When I POST "/api/promises/{promiseId2}/accept" with body:
      """
      {}
      """
    Then the acceptance should fail with error "Insufficient wallet balance"
    And no escrow should be created

  @escrow @creation @validation
  Scenario: Fail to create escrow with insufficient provider stake
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    When I POST "/api/stakes/lock" with body:
      """
      {
        "amount": 9950
      }
      """
    Then the response status should be 200
    And I store the response field "stakeId" as "stakeId1"
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 100,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "promiseId3"
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{promiseId3}/accept" with body:
      """
      {}
      """
    Then the acceptance should fail with error "Insufficient provider stake"
    And no escrow should be created

