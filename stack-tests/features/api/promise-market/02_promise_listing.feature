@ROAD-013 @api @promise-market
Feature: Promise Listing
  As a provider bot
  I want to list my promises on the marketplace
  So that consumers can discover and purchase them

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "provider-{testId}"
    And the test bot has a clean wallet with 10000 tokens
    And any previous test promises are cleaned up

  @pending @smoke @listing
  Scenario: List a draft promise on the marketplace
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
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    And the response field "state" should equal "listed"
    And the response should contain "listedAt"

  @pending @listing @validation
  Scenario: Cannot list already listed promise
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
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 400
    And the response field "error" should contain "already listed"

  @pending @listing @validation
  Scenario: Cannot list promise without sufficient available balance for stake
    When I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 5000,
          "stakeAmount": 5000
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 400
    And the response field "error" should contain "Insufficient balance"

  @pending @listing @order-book
  Scenario: Listed promise appears in order book
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
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I GET "/api/order-book/supply"
    Then the response status should be 200
    And the response should contain "{createdPromiseId}"

  @pending @listing @cancel
  Scenario: Cancel a listed promise
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
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/cancel"
    Then the response status should be 200
    And the response field "state" should equal "cancelled"

  @pending @listing @cancel @validation
  Scenario: Cannot cancel promise that has been accepted
    Given a fresh consumer bot is registered with name "consumer-{testId}"
    And the consumer bot has a clean wallet with 10000 tokens
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
    And I store the response field "promiseId" as "createdPromiseId"
    And I store the response field "providerBotId" as "providerBotId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/cancel"
    Then the response status should be 400
    And the response field "error" should contain "accepted"

  @pending @listing @immutability
  Scenario: Cannot modify promise specification after listing
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
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I PUT "/api/promises/{createdPromiseId}" with body:
      """
      {
        "specification": {
          "tokenCount": 2000
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Cannot modify promise after listing"

