@ROAD-016 @api @promise-market
Feature: Promise Acceptance
  As a consumer bot
  I want to accept listed promises
  So that I can receive LLM compute services

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh provider bot is registered with name "provider-{testId}"
    And a fresh consumer bot is registered with name "consumer-{testId}"
    And both bots have clean wallets with 10000 tokens
    And any previous test promises are cleaned up

  @pending @smoke @acceptance
  Scenario: Successfully accept a listed promise
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
    And the response field "state" should equal "accepted"
    And the response should contain "acceptedAt"

  @pending @acceptance @validation
  Scenario: Cannot accept own promise
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
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 400
    And the response field "error" should contain "Cannot accept your own promise"

  @pending @acceptance @validation
  Scenario: Cannot accept already accepted promise
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
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 200
    Given a fresh second consumer bot is registered with name "consumer2-{testId}"
    And the second consumer bot has a clean wallet with 10000 tokens
    When I switch to second consumer bot "consumer2-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 400
    And the response field "error" should contain "already been accepted"

  @pending @acceptance @validation
  Scenario: Cannot accept with insufficient balance
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
          "price": 50000,
          "stakeAmount": 10000
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 400
    And the response field "error" should contain "Insufficient balance"

  @pending @acceptance @validation
  Scenario: Cannot accept cancelled promise
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
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 404
    And the response field "error" should contain "not found"

  @pending @acceptance @escrow
  Scenario: Escrow is created upon acceptance
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
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 200
    And the response should contain "escrowId"
    And I store the response field "escrowId" as "createdEscrowId"

  @pending @acceptance @order-book
  Scenario: Accepted promise is removed from order book
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
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 200
    When I GET "/api/order-book/supply"
    Then the response status should be 200
    And the response should not contain "{createdPromiseId}"

  @pending @acceptance @event
  Scenario: Accepting promise emits domain events
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
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 200
    And the response should contain "acceptedAt"
    And the response should contain "escrowId"

  @pending @acceptance @state-transition
  Scenario: Verify state transition history
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
          "price": 500,
          "stakeAmount": 100
        }
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I GET "/api/promises/{createdPromiseId}"
    Then the response status should be 200
    And the response field "state" should equal "draft"
    When I POST "/api/promises/{createdPromiseId}/list"
    Then the response status should be 200
    When I GET "/api/promises/{createdPromiseId}"
    Then the response status should be 200
    And the response field "state" should equal "listed"
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/accept"
    Then the response status should be 200
    When I GET "/api/promises/{createdPromiseId}"
    Then the response status should be 200
    And the response field "state" should equal "accepted"

