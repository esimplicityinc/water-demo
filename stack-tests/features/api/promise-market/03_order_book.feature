@ROAD-014 @ROAD-015 @api @promise-market
Feature: Order Book
  As a marketplace participant
  I want to browse and search the order book
  So that I can find suitable promises or requests

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "provider-{testId}"
    And the test bot has a clean wallet with 10000 tokens
    And any previous test promises are cleaned up

  @pending @smoke @order-book
  Scenario: Query supply side of order book
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
    And the response should contain "promiseId"
    And the response should contain "specification"
    And the response should contain "pricing"
    And the response should contain "providerBotId"

  @pending @order-book @filtering
  Scenario: Filter supply by model name
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
    When I GET "/api/order-book/supply?modelName=gpt-4"
    Then the response status should be 200

  @pending @order-book @filtering
  Scenario: Filter supply by price range
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
    When I GET "/api/order-book/supply?minPrice=100&maxPrice=500"
    Then the response status should be 200

  @pending @order-book @filtering
  Scenario: Filter supply by minimum token count
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
    When I GET "/api/order-book/supply?minTokenCount=1000"
    Then the response status should be 200

  @pending @order-book @filtering
  Scenario: Filter supply by provider reputation
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
    When I GET "/api/order-book/supply?minProviderReputation=0"
    Then the response status should be 200

  @pending @order-book @sorting
  Scenario: Sort supply by price ascending
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
    When I GET "/api/order-book/supply?sortBy=price&order=asc"
    Then the response status should be 200

  @pending @order-book @sorting
  Scenario: Sort supply by reputation descending
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
    When I GET "/api/order-book/supply?sortBy=providerReputation&order=desc"
    Then the response status should be 200

  @pending @order-book @demand
  Scenario: Create a demand request in order book
    When I POST "/api/order-book/demand" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "maxPrice": 500
      }
      """
    Then the response status should be 201
    And the response should contain "requestId"
    And I store the response field "requestId" as "createdRequestId"

  @pending @order-book @demand
  Scenario: Query demand side of order book
    When I POST "/api/order-book/demand" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "maxPrice": 500
      }
      """
    Then the response status should be 201
    And I store the response field "requestId" as "createdRequestId"
    When I GET "/api/order-book/demand"
    Then the response status should be 200
    And the response should contain "requestId"
    And the response should contain "specification"
    And the response should contain "maxPrice"
    And the response should contain "consumerBotId"

  @pending @order-book @matching
  Scenario: Automatic matching of supply and demand
    Given a fresh consumer bot is registered with name "consumer-{testId}"
    And the consumer bot has a clean wallet with 10000 tokens
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/order-book/demand" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "maxPrice": 500
      }
      """
    Then the response status should be 201
    And I store the response field "requestId" as "createdRequestId"
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises" with body:
      """
      {
        "specification": {
          "modelName": "gpt-4",
          "tokenCount": 1000,
          "responseTimeSLA": 30000
        },
        "pricing": {
          "price": 400,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200

  @pending @order-book @pagination
  Scenario: Paginate order book results
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
    When I GET "/api/order-book/supply?page=1&limit=10"
    Then the response status should be 200
    And the response should contain fields:
      | field       | value |
      | page        | 1     |
      | limit       | 10    |

