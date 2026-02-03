@ROAD-027 @hybrid @e2e
Feature: End-to-End Promise Flow
  As a marketplace participant
  I want the complete promise lifecycle to work correctly
  So that I can confidently trade LLM compute futures

  Background:
    Given the ClawMarket API and UI are available
    And a fresh provider bot is registered via API with name "e2e-provider-{testId}"
    And a fresh consumer bot is registered via API with name "e2e-consumer-{testId}"
    And both bots have clean wallets with 10000 tokens
    And the provider bot is logged in via UI
    And any previous E2E test data is cleaned up
    And I generate a unique test identifier "{testId}"
    And I track all created resources for cleanup:
      | resourceType | identifierPattern   |
      | promise      | e2e-promise-{testId} |
      | escrow       | e2e-escrow-{testId}  |
      | dispute      | e2e-dispute-{testId} |


  @smoke @e2e @pending
  Scenario: Complete successful promise lifecycle
    # Provider creates and lists promise via API using pre-created bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "providerDisplayName"
    And I set the header "Authorization" to "Bearer {providerApiKey}"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "responseTimeSLA": 30000,
        "price": 500,
        "stakeAmount": 100
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "createdPromiseId"
    When I POST "/api/promises/{createdPromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response field "status" should equal "listed"

    # Consumer browses and accepts via API using pre-created bot
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "e2e-consumer-{testId}" as "consumerDisplayName"
    And I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I GET "/api/marketplace/promises"
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response field "escrowAmount" should equal 500

    # Consumer submits input via API
    When I POST "/api/promises/{createdPromiseId}/input" with body:
      """
      {
        "prompt": "Explain quantum computing",
        "inputHash": "sha256:consumer123"
      }
      """
    Then the response status should be 200

    # Provider executes and completes via API
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    When I POST "/api/promises/{createdPromiseId}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{createdPromiseId}/complete" with body:
      """
      {
        "executionProof": "valid-proof-data",
        "outputHash": "sha256:output123"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "pending_verification"

    # Verification and settlement
    When I POST "/api/verification/process" with body:
      """
      {
        "promiseId": "{createdPromiseId}"
      }
      """
    Then the response status should be 200
    And the response field "verificationStatus" should equal "succeeded"

    # Check final state via API
    When I GET "/api/promises/{createdPromiseId}"
    Then the response status should be 200
    And the response field "status" should equal "completed"
    When I GET "/api/wallets/me"
    Then the response field "balance" should reflect completed promise with 487 tokens added
    When I GET "/api/bots/me/profile"
    Then the response field "reputationScore" should be greater than 100

  @e2e @failure-flow @pending
  Scenario: Promise failure and settlement
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "{providerBotId}" as "alphaProviderId"
    And I store "{providerApiKey}" as "alphaProviderApiKey"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "responseTimeSLA": 30000,
        "price": 500,
        "stakeAmount": 100
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "failurePromiseId"
    When I POST "/api/promises/{failurePromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    Given I use the consumer bot "e2e-consumer-{testId}"
    And I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I POST "/api/promises/{failurePromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Provider starts but fails to complete within SLA
    Given I set the header "Authorization" to "Bearer {alphaProviderApiKey}"
    When I POST "/api/promises/{failurePromiseId}/start" with body:
      """
      {}
      """
    Then the response status should be 200

    # Simulate SLA expiry
    When I POST "/api/admin/simulate-sla-expiry" with body:
      """
      {
        "promiseId": "{failurePromiseId}"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "failed"

    # Settlement and verification
    When I POST "/api/settlement/finalize" with body:
      """
      {
        "promiseId": "{failurePromiseId}"
      }
      """
    Then the response status should be 200
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I set the header "Authorization" to "Bearer {consumerApiKey}"
    When I GET "/api/wallets/me"
    Then the response field "balance" should reflect escrow refund of 500 tokens
    Given I use the provider bot "e2e-provider-{testId}"
    When I GET "/api/bots/{alphaProviderId}/profile"
    Then the response field "reputationScore" should be less than 100

  @e2e @dispute-flow @pending
  Scenario: Disputed promise with arbitration
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "{providerApiKey}" as "disputeProviderApiKey"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "price": 500,
        "stakeAmount": 100
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "disputePromiseId"
    When I POST "/api/promises/{disputePromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    Given I use the consumer bot "e2e-consumer-{testId}"
    And I set the header "Authorization" to "Bearer {consumerApiKey}"
    And I store "{consumerApiKey}" as "disputeConsumerApiKey"
    When I POST "/api/promises/{disputePromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Provider completes
    Given I set the header "Authorization" to "Bearer {disputeProviderApiKey}"
    When I POST "/api/promises/{disputePromiseId}/complete" with body:
      """
      {
        "executionProof": "proof-data",
        "outputHash": "sha256:output456"
      }
      """
    Then the response status should be 200

    # Verification succeeds
    When I POST "/api/verification/process" with body:
      """
      {
        "promiseId": "{disputePromiseId}"
      }
      """
    Then the response status should be 200

    # Consumer raises dispute
    Given I set the header "Authorization" to "Bearer {disputeConsumerApiKey}"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{disputePromiseId}",
        "reason": "Output quality did not match specification",
        "evidence": "Token count was only 500 instead of 1000"
      }
      """
    Then the response status should be 201
    And the response field "disputeStatus" should equal "open"

    # Provider responds
    Given I set the header "Authorization" to "Bearer {disputeProviderApiKey}"
    When I POST "/api/disputes/{disputeId}/respond" with body:
      """
      {
        "counterArgument": "Full 1000 tokens were provided",
        "evidence": "Complete API logs showing all tokens"
      }
      """
    Then the response status should be 200

    # Arbitrator rules
    When I POST "/api/arbitration/rule" with body:
      """
      {
        "disputeId": "{disputeId}",
        "winner": "provider",
        "resolution": "Provider delivered as specified"
      }
      """
    Then the response status should be 200
    And the response field "resolution" should equal "provider_wins"

    # Verify final state
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {disputeProviderApiKey}"
    When I GET "/api/wallets/me"
    Then the response field "balance" should reflect payment received
    When I GET "/api/bots/me/profile"
    Then the response field "reputationScore" should be greater than 100

  @e2e @matching @pending
  Scenario: Automatic order book matching
    # Consumer creates demand request using pre-created bot
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "{consumerApiKey}" as "demandConsumerApiKey"
    When I POST "/api/demand-requests" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "maxPrice": 600
      }
      """
    Then the response status should be 201
    And I store the response field "demandRequestId" as "createdDemandId"

    # Provider lists matching supply using pre-created bot
    Given I use the provider bot "e2e-provider-{testId}"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "price": 500,
        "stakeAmount": 100
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "matchingPromiseId"
    When I POST "/api/promises/{matchingPromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # System detects match
    When I GET "/api/matching/status?demandId={createdDemandId}"
    Then the response status should be 200
    And the response field "matchFound" should equal true
    And the response field "matchedPromiseId" should equal "{matchingPromiseId}"

    # Consumer is notified and accepts
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I set the header "Authorization" to "Bearer {demandConsumerApiKey}"
    When I GET "/api/notifications"
    Then the response should contain a match notification for "{matchingPromiseId}"
    When I POST "/api/promises/{matchingPromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response field "status" should equal "accepted"
