@ROAD-018 @api @settlement
Feature: Execution Verification
  As the platform oracle
  I want to verify promise execution proofs
  So that settlements are based on accurate fulfillment data

  @verification @smoke @pending
  Scenario: Verify successful execution proof
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-123" as "promiseId"
    When I POST "/api/verification" with body:
      """
      {
        "promiseId": "{promiseId}",
        "apiCallLogs": "valid API call with 200 status",
        "inputHash": "sha256:abc123",
        "outputHash": "sha256:def456",
        "latencyMs": 5000,
        "providerAttestation": "valid signature"
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field   | value      |
      | status  | verified   |
      | success | true       |
    And the response field "event" should equal "VerificationSucceeded"

  @verification @timestamp @pending
  Scenario: Verify timestamp is within SLA
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-124" as "promiseId"
    When I POST "/api/verification/timestamp-check" with body:
      """
      {
        "promiseId": "{promiseId}",
        "responseTimeSLA": 30000,
        "executionTimeMs": 25000
      }
      """
    Then the response status should be 200
    And the response field "passed" should equal true

  @verification @timestamp @failure @pending
  Scenario: Fail verification when SLA exceeded
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-125" as "promiseId"
    When I POST "/api/verification/timestamp-check" with body:
      """
      {
        "promiseId": "{promiseId}",
        "responseTimeSLA": 30000,
        "executionTimeMs": 35000
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "SLA exceeded"
    And the response field "event" should equal "VerificationFailed"

  @verification @hash @pending
  Scenario: Verify input hash matches consumer submission
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-126" as "promiseId"
    When I POST "/api/verification/hash-check" with body:
      """
      {
        "promiseId": "{promiseId}",
        "consumerInputHash": "sha256:abc123",
        "proofInputHash": "sha256:abc123"
      }
      """
    Then the response status should be 200
    And the response field "passed" should equal true

  @verification @hash @failure @pending
  Scenario: Fail verification when input hash mismatch
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-127" as "promiseId"
    When I POST "/api/verification/hash-check" with body:
      """
      {
        "promiseId": "{promiseId}",
        "consumerInputHash": "sha256:abc123",
        "proofInputHash": "sha256:xyz789"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Input hash mismatch"

  @verification @api-log @pending
  Scenario: Verify API call logs are valid
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-128" as "promiseId"
    When I POST "/api/verification/api-logs" with body:
      """
      {
        "promiseId": "{promiseId}",
        "logs": [
          {
            "endpoint": "https://api.openai.com/v1/chat/completions",
            "status": 200,
            "responseTimeMs": 5000
          }
        ]
      }
      """
    Then the response status should be 200
    And the response field "passed" should equal true

  @verification @api-log @failure @pending
  Scenario: Fail verification with error status in API logs
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-129" as "promiseId"
    When I POST "/api/verification/api-logs" with body:
      """
      {
        "promiseId": "{promiseId}",
        "logs": [
          {
            "endpoint": "https://api.openai.com/v1/chat/completions",
            "status": 500,
            "responseTimeMs": 1000
          }
        ]
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "API call failed"

  @verification @attestation @pending
  Scenario: Verify provider attestation signature
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-130" as "promiseId"
    When I POST "/api/verification/attestation" with body:
      """
      {
        "promiseId": "{promiseId}",
        "signature": "valid-signature",
        "proofData": "execution-proof-hash"
      }
      """
    Then the response status should be 200
    And the response field "passed" should equal true

  @verification @query @pending
  Scenario: Query verification status
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-131" as "promiseId"
    When I GET "/api/settlements/{promiseId}/verification"
    Then the response status should be 200
    And the response should contain fields:
      | field  | value         |
      | status | {status}      |
      | checks | {checksArray} |

  @verification @retry @pending
  Scenario: Automatic retry on transient verification failure
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-132" as "promiseId"
    When I POST "/api/verification" with body:
      """
      {
        "promiseId": "{promiseId}",
        "simulateTransientFailure": true
      }
      """
    Then the response status should be 200
    And the response should contain "retryCount"
    And the response field "maxRetries" should equal 3
