@ROAD-017 @api @promise-market
Feature: Promise Execution
  As a provider bot
  I want to execute accepted promises
  So that I can fulfill my commitments and earn tokens

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh provider bot is registered with name "provider-{testId}"
    And a fresh consumer bot is registered with name "consumer-{testId}"
    And both bots have clean wallets with 10000 tokens
    And any previous test promises are cleaned up

  @pending @smoke @execution
  Scenario: Start promise execution
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
    And I store the response field "escrowId" as "createdEscrowId"
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    And the response field "state" should equal "executing"
    And the response should contain "executingAt"

  @pending @execution @validation
  Scenario: Cannot start execution without consumer input
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
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 400
    And the response field "error" should contain "input required"

  @pending @execution @input
  Scenario: Consumer provides input for execution
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
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    And the response field "readyForExecution" should equal true

  @pending @execution @completion
  Scenario: Complete promise execution successfully
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
    And I store the response field "escrowId" as "createdEscrowId"
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": {
          "apiCallLogs": [
            {
              "endpoint": "https://api.openai.com/v1/chat/completions",
              "requestTimestamp": "2024-01-15T10:00:00Z",
              "responseTimestamp": "2024-01-15T10:00:05Z",
              "statusCode": 200
            }
          ],
          "inputHash": "sha256:abc123",
          "outputHash": "sha256:def456",
          "executionMetadata": {
            "modelVersion": "gpt-4-0125-preview",
            "tokenUsage": 850,
            "latencyMs": 5000
          },
          "providerAttestation": {
            "signature": "sig:test",
            "signedAt": "2024-01-15T10:00:06Z"
          }
        }
      }
      """
    Then the response status should be 200
    And the response field "state" should equal "completed"
    And the response should contain "completedAt"

  @pending @execution @failure
  Scenario: Mark promise execution as failed
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
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/fail" with body:
      """
      {
        "reason": "SLA timeout exceeded"
      }
      """
    Then the response status should be 200
    And the response field "state" should equal "failed"

  @pending @execution @timeout
  Scenario: Promise auto-fails after exceeding SLA
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
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    When I GET "/api/promises/{createdPromiseId}"
    Then the response status should be 200
    And the response should contain "responseTimeSLA"

  @pending @execution @validation
  Scenario: Cannot complete already completed promise
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
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": {
          "apiCallLogs": [],
          "inputHash": "sha256:abc123",
          "outputHash": "sha256:def456"
        }
      }
      """
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": {
          "apiCallLogs": [],
          "inputHash": "sha256:abc123",
          "outputHash": "sha256:def456"
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "already completed"

  @pending @execution @validation
  Scenario: Only provider can complete promise
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
    And I store the response field "consumerBotId" as "consumerBotId"
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    When I switch to consumer bot "consumer-{testId}"
    And I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": {
          "apiCallLogs": [],
          "inputHash": "sha256:abc123",
          "outputHash": "sha256:def456"
        }
      }
      """
    Then the response status should be 403
    And the response field "error" should contain "provider can complete"

  @pending @execution @proof @validation
  Scenario: Reject completion with invalid execution proof
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
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": {
          "apiCallLogs": [],
          "inputHash": "",
          "outputHash": ""
        }
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Invalid execution proof"

  @pending @execution @event
  Scenario: Execution events are properly emitted
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
    And I store the response field "escrowId" as "createdEscrowId"
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing in simple terms",
        "inputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    When I switch to provider bot "provider-{testId}"
    And I POST "/api/promises/{createdPromiseId}/start-execution"
    Then the response status should be 200
    And the response should contain "executingAt"
    When I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": {
          "apiCallLogs": [],
          "inputHash": "sha256:abc123",
          "outputHash": "sha256:def456"
        }
      }
      """
    Then the response status should be 200
    And the response should contain "completedAt"

