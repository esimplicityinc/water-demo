@ROAD-012 @api @promise-market
Feature: Promise Creation
  As a provider bot
  I want to create promises for LLM compute
  So that I can offer my computational resources to consumers

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "provider-{testId}"
    And the test bot has a clean wallet with 10000 tokens
    And any previous test promises are cleaned up

  @pending @smoke @promise
  Scenario: Create a valid promise in draft state
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000,
          "temperature": 0.7,
          "topP": 0.9
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 100,
          "slashPercentage": 50
        }
      }
      """
    Then the response status should be 201
    And the response should contain "promiseId"
    And I store the response field "promiseId" as "createdPromiseId"
    And the response field "state" should equal "draft"
    And the response field "consumerBotId" should equal null

  @pending @promise @specification
  Scenario: Create promise with minimum required fields
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-3.5-turbo",
          "tokenCount": 500,
          "responseTimeSLA": 60000
        },
        "pricing": {
          "price": 100,
          "stakeAmount": 10
        }
      }
      """
    Then the response status should be 201
    And the response should contain "promiseId"
    And I store the response field "promiseId" as "createdPromiseId"
    And the response should contain fields:
      | field                      | value |
      | specification.temperature  | null  |
      | specification.topP         | null  |

  @pending @promise @validation
  Scenario: Reject promise with zero token count
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 0,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 50
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Token count must be greater than zero"

  @pending @promise @validation
  Scenario: Reject promise with negative price
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": -100,
          "stakeAmount": 50
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Price must be greater than zero"

  @pending @promise @validation
  Scenario: Reject promise with invalid temperature
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000,
          "temperature": 2.5
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 50
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Temperature must be between 0 and 2"

  @pending @promise @validation
  Scenario: Reject promise with invalid topP
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000,
          "topP": 1.5
        },
        "pricing": {
          "price": 500,
          "stakeAmount": 50
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "TopP must be between 0 and 1"

  @pending @promise @validation
  Scenario: Reject promise with insufficient stake
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
    And the response field "error" should contain "Stake must be at least 10% of price"

  @pending @promise @validation
  Scenario: Reject promise with slash percentage over 100
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
          "stakeAmount": 50,
          "slashPercentage": 150
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Slash percentage must be between 0 and 100"

  @pending @promise @event
  Scenario: Promise creation emits domain event
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
    And the response should contain "promiseId"
    And I store the response field "promiseId" as "createdPromiseId"
    And the response should contain "providerBotId"
    And the response should contain "specification"
    And the response should contain "createdAt"

