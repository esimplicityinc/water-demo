@ROAD-027 @hybrid @e2e @pending
Feature: Complete End-to-End Flows
  As a marketplace participant
  I want comprehensive end-to-end workflows to function correctly
  So that I can confidently use all marketplace features

  Background:
    Given the ClawMarket API and UI are available
    And a fresh provider bot is registered via API with name "e2e-provider-{testId}"
    And a fresh consumer bot is registered via API with name "e2e-consumer-{testId}"
    And both bots have clean wallets with 10000 tokens
    And the provider bot is logged in via UI
    And any previous E2E test data is cleaned up
    And I generate a unique test identifier "{testId}"
    And I track all created resources for cleanup:
      | resourceType | identifierPattern    |
      | promise      | e2e-promise-{testId} |
      | escrow       | e2e-escrow-{testId}  |
      | dispute      | e2e-dispute-{testId} |
      | bot          | e2e-bot-{testId}     |


  @e2e @registration-flow @onboarding @pending
  Scenario: Complete bot registration to first promise flow
    # Use pre-created provider bot from Background
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "{providerBotId}" as "newBotId"
    And I store "{providerApiKey}" as "newBotApiKey"
    And I navigate to "/onboarding"
    Then I should see "Welcome e2e-provider-{testId}"

    # Complete profile setup via API using pre-created bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {newBotApiKey}"
    When I POST "/api/bots/me/profile" with body:
      """
      {
        "description": "High-performance LLM compute provider",
        "supportedModels": ["gpt-4", "claude-3"],
        "maxConcurrentPromises": 5
      }
      """
    Then the response status should be 200

    # Wallet already funded in Background with 10000 tokens
    When I GET "/api/wallets/me"
    Then the response status should be 200
    And the response field "balance" should equal 10000

    # Create first promise via API
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
    And I store the response field "promiseId" as "firstPromiseId"

    # List promise via UI
    Given I navigate to "/promises/{firstPromiseId}"
    When I click the "List on Marketplace" button
    Then I should see "Promise listed successfully"

    # Verify via API
    When I GET "/api/promises/{firstPromiseId}"
    Then the response field "status" should equal "listed"
    And the response field "providerId" should equal "{newBotId}"

    # Verify dashboard shows promise via UI
    Given I navigate to "/dashboard"
    Then I should see "e2e-provider-{testId}"
    And I should see "gpt-4"
    And I should see "1000 tokens"

  @e2e @promise-lifecycle @execution @pending
  Scenario: Promise creation to acceptance to execution flow
    # Provider creates promise via API using pre-created bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "providerDisplayName"
    And I store "{providerApiKey}" as "providerApiKey"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "claude-3-opus",
        "tokenCount": 2000,
        "responseTimeSLA": 45000,
        "price": 800,
        "stakeAmount": 150
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "executionPromiseId"

    # Provider lists promise via API
    When I POST "/api/promises/{executionPromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # Consumer browses marketplace via UI
    Given I navigate to "/marketplace"
    Then I should see "claude-3-opus"
    And I should see "2000 tokens"
    And I should see "800 tokens"

    # Consumer accepts via API using pre-created bot
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "e2e-consumer-{testId}" as "consumerDisplayName"
    And I store "{consumerApiKey}" as "consumerApiKey"
    When I POST "/api/promises/{executionPromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response field "escrowAmount" should equal 800
    And the response field "status" should equal "accepted"

    # Consumer submits input via API
    When I POST "/api/promises/{executionPromiseId}/input" with body:
      """
      {
        "prompt": "Write a comprehensive analysis of machine learning trends",
        "inputHash": "sha256:ml-analysis-input",
        "maxTokens": 2000
      }
      """
    Then the response status should be 200

    # Provider starts execution via UI
    Given I navigate to "/promises/{executionPromiseId}"
    And I set the header "Authorization" to "Bearer {providerApiKey}"
    When I click the "Start Execution" button
    Then I should see "Execution started"

    # Verify status via API
    When I GET "/api/promises/{executionPromiseId}"
    Then the response field "status" should equal "executing"
    And the response field "startedAt" should not be null

    # Provider completes via API
    When I POST "/api/promises/{executionPromiseId}/complete" with body:
      """
      {
        "executionProof": "valid-execution-proof-claude-3",
        "outputHash": "sha256:ml-analysis-output",
        "actualTokens": 1950,
        "executionTime": 32000
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "pending_verification"

    # Verification process via API
    When I POST "/api/verification/process" with body:
      """
      {
        "promiseId": "{executionPromiseId}"
      }
      """
    Then the response status should be 200
    And the response field "verificationStatus" should equal "succeeded"
    And the response field "qualityScore" should be greater than 0.8

    # Settlement via API
    When I POST "/api/settlement/finalize" with body:
      """
      {
        "promiseId": "{executionPromiseId}"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "completed"

    # Verify final state via UI
    Given I navigate to "/promises/{executionPromiseId}"
    Then I should see "Completed"
    And I should see "Quality Score"

  @e2e @dispute-resolution @arbitration @pending
  Scenario: Dispute filing to resolution flow
    # Setup: Use pre-created bots
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "{providerApiKey}" as "disputeProviderKey"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1500,
        "price": 600,
        "stakeAmount": 120
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "disputedPromiseId"
    When I POST "/api/promises/{disputedPromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "{consumerApiKey}" as "disputeConsumerKey"
    When I POST "/api/promises/{disputedPromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Provider completes with questionable output
    Given I set the header "Authorization" to "Bearer {disputeProviderKey}"
    When I POST "/api/promises/{disputedPromiseId}/input" with body:
      """
      {
        "prompt": "Generate detailed technical documentation"
      }
      """
    Then the response status should be 200
    When I POST "/api/promises/{disputedPromiseId}/complete" with body:
      """
      {
        "executionProof": "minimal-proof-data",
        "outputHash": "sha256:minimal-output"
      }
      """
    Then the response status should be 200

    # Verification passes but consumer is dissatisfied
    When I POST "/api/verification/process" with body:
      """
      {
        "promiseId": "{disputedPromiseId}"
      }
      """
    Then the response status should be 200

    # Consumer files dispute via UI
    Given I navigate to "/promises/{disputedPromiseId}"
    And I set the header "Authorization" to "Bearer {disputeConsumerKey}"
    When I click the "File Dispute" button
    And I fill in "disputeReason" with "Output quality is insufficient and incomplete"
    And I fill in "evidence" with "Documentation is only 200 tokens instead of promised 1500"
    And I click the "Submit Dispute" button
    Then I should see "Dispute filed successfully"

    # Verify dispute created via API
    When I GET "/api/disputes?promiseId={disputedPromiseId}"
    Then the response status should be 200
    And I store the response field "disputes[0].disputeId" as "createdDisputeId"
    And the response field "disputes[0].status" should equal "open"

    # Provider responds via API
    Given I set the header "Authorization" to "Bearer {disputeProviderKey}"
    When I POST "/api/disputes/{createdDisputeId}/respond" with body:
      """
      {
        "response": "Output meets minimum requirements",
        "evidence": "All requested sections were included"
      }
      """
    Then the response status should be 200

    # Arbitrator reviews via UI
    Given I navigate to "/arbitration/{createdDisputeId}"
    When I click the "Review Evidence" button
    Then I should see "Consumer complaint: insufficient tokens"
    And I should see "Provider response: meets requirements"

    # Arbitrator rules in favor of consumer via API
    When I POST "/api/arbitration/{createdDisputeId}/rule" with body:
      """
      {
        "winner": "consumer",
        "reason": "Output significantly underdelivered on token count promise",
        "refundAmount": 600,
        "penaltyAmount": 120
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "resolved"
    And the response field "winner" should equal "consumer"

    # Verify settlement via API
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I set the header "Authorization" to "Bearer {disputeConsumerKey}"
    When I GET "/api/wallets/me"
    Then the response field "balance" should reflect refund of 600 tokens

    # Verify provider penalty via API
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {disputeProviderKey}"
    When I GET "/api/bots/me/profile"
    Then the response field "reputationScore" should be less than 100
    And the response field "disputesLost" should equal 1

  @e2e @concurrent @performance @pending
  Scenario: Multiple concurrent promises flow
    # Provider creates multiple promises via API using pre-created bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "providerName"
    And I store "{providerApiKey}" as "concurrentProviderKey"

    # Create promise 1
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
    And I store the response field "promiseId" as "concurrentPromise1"

    # Create promise 2
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "claude-3",
        "tokenCount": 2000,
        "price": 800,
        "stakeAmount": 150
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "concurrentPromise2"

    # Create promise 3
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-3.5",
        "tokenCount": 500,
        "price": 200,
        "stakeAmount": 50
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "concurrentPromise3"

    # List all promises via API
    When I POST "/api/promises/{concurrentPromise1}/list" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{concurrentPromise2}/list" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{concurrentPromise3}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # Multiple consumers accept different promises via API
    # Note: Using consumer bot from Background for first promise
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "{consumerApiKey}" as "consumer1Key"
    When I POST "/api/promises/{concurrentPromise1}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Create temporary additional consumer bots for concurrent testing
    Given a temporary consumer bot is created with name "e2e-consumer-2-{testId}"
    And I store "{tempApiKey}" as "consumer2Key"
    When I POST "/api/promises/{concurrentPromise2}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    Given a temporary consumer bot is created with name "e2e-consumer-3-{testId}"
    And I store "{tempApiKey}" as "consumer3Key"
    When I POST "/api/promises/{concurrentPromise3}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Provider executes all promises concurrently via API
    Given I set the header "Authorization" to "Bearer {concurrentProviderKey}"

    # Execute promise 1
    When I POST "/api/promises/{concurrentPromise1}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{concurrentPromise1}/complete" with body:
      """
      {
        "executionProof": "proof-1",
        "outputHash": "sha256:output1"
      }
      """
    Then the response status should be 200

    # Execute promise 2
    When I POST "/api/promises/{concurrentPromise2}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{concurrentPromise2}/complete" with body:
      """
      {
        "executionProof": "proof-2",
        "outputHash": "sha256:output2"
      }
      """
    Then the response status should be 200

    # Execute promise 3
    When I POST "/api/promises/{concurrentPromise3}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{concurrentPromise3}/complete" with body:
      """
      {
        "executionProof": "proof-3",
        "outputHash": "sha256:output3"
      }
      """
    Then the response status should be 200

    # Verify all promises completed via UI
    Given I navigate to "/dashboard"
    Then I should see "3 Active Promises"
    And I should see "gpt-4"
    And I should see "claude-3"
    And I should see "gpt-3.5"

    # Verify all settlements via API
    When I POST "/api/settlement/batch-finalize" with body:
      """
      {
        "promiseIds": ["{concurrentPromise1}", "{concurrentPromise2}", "{concurrentPromise3}"]
      }
      """
    Then the response status should be 200
    And the response field "completedCount" should equal 3

    # Verify provider earnings via API
    When I GET "/api/wallets/me"
    Then the response field "totalEarnings" should equal 1500

    # Cleanup temporary consumer bots
    Given I delete temporary consumer bot "e2e-consumer-2-{testId}"
    And I delete temporary consumer bot "e2e-consumer-3-{testId}"

  @e2e @failure-retry @resilience @pending
  Scenario: Failed promise and retry flow
    # Provider creates promise via API using pre-created bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "providerName"
    And I store "{providerApiKey}" as "retryProviderKey"
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
    And I store the response field "promiseId" as "retryPromiseId"
    When I POST "/api/promises/{retryPromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # Consumer accepts via API using pre-created bot
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "{consumerApiKey}" as "retryConsumerKey"
    When I POST "/api/promises/{retryPromiseId}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Provider starts but fails to complete (simulated timeout) via API
    Given I set the header "Authorization" to "Bearer {retryProviderKey}"
    When I POST "/api/promises/{retryPromiseId}/start" with body:
      """
      {}
      """
    Then the response status should be 200

    # Simulate SLA breach via API
    When I POST "/api/admin/simulate-sla-expiry" with body:
      """
      {
        "promiseId": "{retryPromiseId}",
        "reason": "timeout"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "failed"
    And the response field "failureReason" should equal "sla_breach"

    # Verify failure state via UI
    Given I navigate to "/promises/{retryPromiseId}"
    Then I should see "Failed"
    And I should see "SLA Breach"

    # Consumer receives refund via API
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I set the header "Authorization" to "Bearer {retryConsumerKey}"
    When I GET "/api/wallets/me"
    Then the response field "balance" should reflect refund of 500 tokens

    # Provider loses stake via API
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {retryProviderKey}"
    When I GET "/api/wallets/me"
    Then the response field "stakeBalance" should reflect penalty of 100 tokens

    # Provider creates replacement promise via API
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "responseTimeSLA": 60000,
        "price": 500,
        "stakeAmount": 100,
        "isRetry": true,
        "originalPromiseId": "{retryPromiseId}"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "retryPromiseId2"

    # Consumer accepts retry via UI using pre-created bot
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I navigate to "/marketplace"
    And I set the header "Authorization" to "Bearer {retryConsumerKey}"
    When I click on promise with model "gpt-4" and price "500"
    And I click the "Accept Promise" button
    Then I should see "Promise accepted"

    # Provider successfully completes retry via API
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {retryProviderKey}"
    When I POST "/api/promises/{retryPromiseId2}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{retryPromiseId2}/complete" with body:
      """
      {
        "executionProof": "retry-success-proof",
        "outputHash": "sha256:retry-output"
      }
      """
    Then the response status should be 200

    # Verify retry success via API
    Given I use the provider bot "e2e-provider-{testId}"
    When I POST "/api/verification/process" with body:
      """
      {
        "promiseId": "{retryPromiseId2}"
      }
      """
    Then the response status should be 200
    And the response field "verificationStatus" should equal "succeeded"

    # Verify reputation recovery via API
    When I GET "/api/bots/me/profile"
    Then the response field "retrySuccessRate" should be greater than 0.5

  @e2e @settlement @reputation @pending
  Scenario: Settlement and reputation update flow
    # Setup: Use pre-created provider bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "providerName"
    And I store "{providerBotId}" as "reputationBotId"
    And I store "{providerApiKey}" as "reputationProviderKey"

    # Record initial reputation via API
    When I GET "/api/bots/me/profile"
    Then I store the response field "reputationScore" as "initialReputation"
    And I store the response field "completedPromises" as "initialCompleted"

    # Create and complete promise 1 successfully via API
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
    And I store the response field "promiseId" as "repPromise1"
    When I POST "/api/promises/{repPromise1}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    Given I use the consumer bot "e2e-consumer-{testId}"
    When I POST "/api/promises/{repPromise1}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{repPromise1}/input" with body:
      """
      {
        "prompt": "Task 1"
      }
      """
    Then the response status should be 200

    Given I set the header "Authorization" to "Bearer {reputationProviderKey}"
    When I POST "/api/promises/{repPromise1}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{repPromise1}/complete" with body:
      """
      {
        "executionProof": "excellent-proof-1",
        "outputHash": "sha256:excellent-1",
        "qualityMetrics": {
          "accuracy": 0.95,
          "completeness": 0.98,
          "speed": 0.90
        }
      }
      """
    Then the response status should be 200

    # Create and complete promise 2 successfully via API
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "claude-3",
        "tokenCount": 1500,
        "price": 700,
        "stakeAmount": 140
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "repPromise2"
    When I POST "/api/promises/{repPromise2}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    Given a temporary consumer bot is created with name "e2e-rep-consumer-{testId}"
    When I POST "/api/promises/{repPromise2}/accept" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{repPromise2}/input" with body:
      """
      {
        "prompt": "Task 2"
      }
      """
    Then the response status should be 200

    Given I set the header "Authorization" to "Bearer {reputationProviderKey}"
    When I POST "/api/promises/{repPromise2}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{repPromise2}/complete" with body:
      """
      {
        "executionProof": "excellent-proof-2",
        "outputHash": "sha256:excellent-2",
        "qualityMetrics": {
          "accuracy": 0.96,
          "completeness": 0.97,
          "speed": 0.92
        }
      }
      """
    Then the response status should be 200

    # Process verifications via API
    When I POST "/api/verification/batch-process" with body:
      """
      {
        "promiseIds": ["{repPromise1}", "{repPromise2}"]
      }
      """
    Then the response status should be 200
    And the response field "verifiedCount" should equal 2

    # Finalize settlements via API
    When I POST "/api/settlement/batch-finalize" with body:
      """
      {
        "promiseIds": ["{repPromise1}", "{repPromise2}"]
      }
      """
    Then the response status should be 200
    And the response field "settledCount" should equal 2

    # Verify reputation increase via API
    When I GET "/api/bots/me/profile"
    Then the response field "reputationScore" should be greater than "{initialReputation}"
    And the response field "completedPromises" should equal 2
    And the response field "averageQualityScore" should be greater than 0.9

    # Verify earnings via API
    When I GET "/api/wallets/me"
    Then the response field "totalEarnings" should equal 1200
    And the response field "availableBalance" should equal 1200

    # Verify reputation on leaderboard via UI
    Given I navigate to "/leaderboard"
    Then I should see "e2e-provider-{testId}"
    And I should see reputation score greater than "{initialReputation}"

    # Cleanup temporary consumer
    Given I delete temporary consumer bot "e2e-rep-consumer-{testId}"

    # Verify detailed reputation metrics via API
    When I GET "/api/bots/{reputationBotId}/reputation"
    Then the response status should be 200
    And the response field "overallScore" should be greater than 100
    And the response field "reliabilityScore" should be greater than 0.9
    And the response field "qualityScore" should be greater than 0.9
    And the response field "responseTimeScore" should be greater than 0.8

  @e2e @cross-bot @interaction @pending
  Scenario: Cross-bot interaction flows
    # Setup: Use pre-created bots and create temporary additional bots
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "alphaName"
    And I store "{providerBotId}" as "alphaId"
    And I store "{providerApiKey}" as "alphaKey"

    Given a temporary provider bot is created with name "e2e-beta-provider-{testId}"
    And I store "e2e-beta-provider-{testId}" as "betaName"
    And I store "{tempBotId}" as "betaId"
    And I store "{tempApiKey}" as "betaKey"

    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "e2e-consumer-{testId}" as "consumerXName"
    And I store "{consumerApiKey}" as "consumerXKey"

    Given a temporary consumer bot is created with name "e2e-consumer-y-{testId}"
    And I store "e2e-consumer-y-{testId}" as "consumerYName"
    And I store "{tempApiKey}" as "consumerYKey"

    # ProviderAlpha creates gpt-4 promise via API
    Given I set the header "Authorization" to "Bearer {alphaKey}"
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
    And I store the response field "promiseId" as "alphaPromise"
    When I POST "/api/promises/{alphaPromise}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # ProviderBeta creates claude-3 promise via API
    Given I set the header "Authorization" to "Bearer {betaKey}"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "claude-3",
        "tokenCount": 1500,
        "price": 700,
        "stakeAmount": 140
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "betaPromise"
    When I POST "/api/promises/{betaPromise}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # ConsumerX browses and accepts ProviderAlpha's promise via UI
    Given I navigate to "/marketplace"
    And I set the header "Authorization" to "Bearer {consumerXKey}"
    When I filter by model "gpt-4"
    Then I should see "ProviderAlpha"
    When I click on promise from "ProviderAlpha"
    And I click the "Accept Promise" button
    Then I should see "Promise accepted successfully"

    # ConsumerY accepts ProviderBeta's promise via API
    Given I set the header "Authorization" to "Bearer {consumerYKey}"
    When I POST "/api/promises/{betaPromise}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Cross-execution: ProviderAlpha completes their promise via API
    Given I set the header "Authorization" to "Bearer {alphaKey}"
    When I POST "/api/promises/{alphaPromise}/input" with body:
      """
      {
        "prompt": "Cross-bot test task 1"
      }
      """
    Then the response status should be 200
    When I POST "/api/promises/{alphaPromise}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{alphaPromise}/complete" with body:
      """
      {
        "executionProof": "alpha-proof",
        "outputHash": "sha256:alpha-output"
      }
      """
    Then the response status should be 200

    # ProviderBeta completes their promise via API
    Given I set the header "Authorization" to "Bearer {betaKey}"
    When I POST "/api/promises/{betaPromise}/input" with body:
      """
      {
        "prompt": "Cross-bot test task 2"
      }
      """
    Then the response status should be 200
    When I POST "/api/promises/{betaPromise}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{betaPromise}/complete" with body:
      """
      {
        "executionProof": "beta-proof",
        "outputHash": "sha256:beta-output"
      }
      """
    Then the response status should be 200

    # Verify cross-bot interactions via API
    When I GET "/api/promises/{alphaPromise}"
    Then the response field "providerId" should equal "{alphaId}"
    And the response field "consumerId" should not be null

    When I GET "/api/promises/{betaPromise}"
    Then the response field "providerId" should equal "{betaId}"
    And the response field "consumerId" should not be null

    # Verify both consumers see their promises via UI
    Given I navigate to "/dashboard"
    And I set the header "Authorization" to "Bearer {consumerXKey}"
    Then I should see "ProviderAlpha"
    And I should see "gpt-4"

    Given I navigate to "/dashboard"
    And I set the header "Authorization" to "Bearer {consumerYKey}"
    Then I should see "ProviderBeta"
    And I should see "claude-3"

    # Process both verifications via API
    When I POST "/api/verification/batch-process" with body:
      """
      {
        "promiseIds": ["{alphaPromise}", "{betaPromise}"]
      }
      """
    Then the response status should be 200

    # Finalize settlements via API
    When I POST "/api/settlement/batch-finalize" with body:
      """
      {
        "promiseIds": ["{alphaPromise}", "{betaPromise}"]
      }
      """
    Then the response status should be 200

    # Verify both providers received payments via API
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {alphaKey}"
    When I GET "/api/wallets/me"
    Then the response field "totalEarnings" should equal 500

    Given I use the temporary provider bot "e2e-beta-provider-{testId}"
    And I set the header "Authorization" to "Bearer {betaKey}"
    When I GET "/api/wallets/me"
    Then the response field "totalEarnings" should equal 700

    # Verify reputation updates for both providers via API
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {alphaKey}"
    When I GET "/api/bots/me/profile"
    Then the response field "completedPromises" should equal 1
    And the response field "reputationScore" should be greater than 100

    Given I use the temporary provider bot "e2e-beta-provider-{testId}"
    And I set the header "Authorization" to "Bearer {betaKey}"
    When I GET "/api/bots/me/profile"
    Then the response field "completedPromises" should equal 1
    And the response field "reputationScore" should be greater than 100

    # Verify marketplace activity feed via UI
    Given I navigate to "/marketplace/activity"
    Then I should see "e2e-provider-{testId}"
    Then I should see "e2e-beta-provider-{testId}"
    Then I should see "2 promises completed"

    # Cleanup temporary bots
    Given I delete temporary provider bot "e2e-beta-provider-{testId}"
    And I delete temporary consumer bot "e2e-consumer-y-{testId}"

  @e2e @marketplace-discovery @search @pending
  Scenario: Marketplace discovery and filtering flow
    # Setup: Use pre-created provider bot
    Given I use the provider bot "e2e-provider-{testId}"
    And I store "e2e-provider-{testId}" as "fastProviderName"
    And I store "{providerApiKey}" as "fastProviderKey"

    # Create promises with different characteristics via API
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "responseTimeSLA": 15000,
        "price": 800,
        "stakeAmount": 100
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "fastGpt4Promise"
    When I POST "/api/promises/{fastGpt4Promise}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    Given a temporary provider bot is created with name "e2e-cheap-provider-{testId}"
    And I store "e2e-cheap-provider-{testId}" as "cheapProviderName"
    And I store "{tempApiKey}" as "cheapProviderKey"
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-3.5",
        "tokenCount": 2000,
        "responseTimeSLA": 60000,
        "price": 200,
        "stakeAmount": 50
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "cheapGpt35Promise"
    When I POST "/api/promises/{cheapGpt35Promise}/list" with body:
      """
      {}
      """
    Then the response status should be 200

    # Consumer browses marketplace via UI
    Given I navigate to "/marketplace"
    Then I should see "gpt-4"
    And I should see "gpt-3.5"
    And I should see "800 tokens"
    And I should see "200 tokens"

    # Filter by model via UI
    When I select "gpt-4" from the "modelFilter" dropdown
    Then I should see "e2e-provider-{testId}"
    And I should not see "e2e-cheap-provider-{testId}"

    # Clear filter and filter by price via UI
    When I click the "Clear Filters" button
    And I fill in "maxPrice" with "500"
    And I click the "Apply Filters" button
    Then I should see "e2e-cheap-provider-{testId}"
    And I should not see "e2e-provider-{testId}"

    # Filter by response time via API
    Given I use the consumer bot "e2e-consumer-{testId}"
    And I store "{consumerApiKey}" as "discoveryConsumerKey"
    When I GET "/api/marketplace/promises?maxResponseTime=20000"
    Then the response status should be 200
    And the response should contain "{fastGpt4Promise}"
    And the response should not contain "{cheapGpt35Promise}"

    # Sort by price via API
    When I GET "/api/marketplace/promises?sortBy=price&sortOrder=asc"
    Then the response status should be 200
    And the first item "price" should equal 200

    # Sort by reputation via API
    When I GET "/api/marketplace/promises?sortBy=reputation&sortOrder=desc"
    Then the response status should be 200

    # Consumer views provider profile via UI
    Given I navigate to "/marketplace"
    When I click on "e2e-provider-{testId}" profile link
    Then I should see "e2e-provider-{testId}"
    And I should see "Response Time: 15s"
    And I should see "gpt-4"

    # Consumer accepts filtered promise via API
    Given I set the header "Authorization" to "Bearer {discoveryConsumerKey}"
    When I POST "/api/promises/{fastGpt4Promise}/accept" with body:
      """
      {}
      """
    Then the response status should be 200

    # Verify promise no longer appears in marketplace via UI
    Given I navigate to "/marketplace"
    When I select "gpt-4" from the "modelFilter" dropdown
    Then I should not see "e2e-provider-{testId}"
    And I should see "No promises available"

    # Complete the promise via API
    Given I use the provider bot "e2e-provider-{testId}"
    And I set the header "Authorization" to "Bearer {fastProviderKey}"
    When I POST "/api/promises/{fastGpt4Promise}/input" with body:
      """
      {
        "prompt": "Discovery test task"
      }
      """
    Then the response status should be 200
    When I POST "/api/promises/{fastGpt4Promise}/start" with body:
      """
      {}
      """
    Then the response status should be 200
    When I POST "/api/promises/{fastGpt4Promise}/complete" with body:
      """
      {
        "executionProof": "discovery-proof",
        "outputHash": "sha256:discovery-output"
      }
      """
    Then the response status should be 200

    # Verify completion via UI
    Given I navigate to "/dashboard"
    Then I should see "Completed"
    And I should see "e2e-provider-{testId}"

    # Cleanup temporary provider
    Given I delete temporary provider bot "e2e-cheap-provider-{testId}"
