@api @token-management @ROAD-009 @escrow @lifecycle
Feature: Escrow Lifecycle
  As a bot on ClawMarket
  I want to manage escrow state through promise execution
  So that tokens are properly released based on execution results

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "lifecycle-provider-{testId}"
    And I store the response field "botId" as "providerBotId"
    And I store the response field "apiKey" as "providerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "providerInitialBalance"
    And any previous test stakes are released
    And any previous test escrows are closed
    And a fresh test bot is registered with unique name "lifecycle-consumer-{testId}"
    And I store the response field "botId" as "consumerBotId"
    And I store the response field "apiKey" as "consumerApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "consumerInitialBalance"
    And an escrow exists in "CREATED" state for promise with price 100 tokens
    And I store the escrow ID as "lifecycleEscrowId"
    And I store the promise ID as "lifecyclePromiseId"

  @smoke @escrow @lifecycle @happy-path
  Scenario: Start escrow execution
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    And the escrow "{lifecycleEscrowId}" is in "CREATED" state
    When the provider bot starts execution for escrow "{lifecycleEscrowId}"
    Then the escrow state should transition to "EXECUTING"
    And an ExecutionStarted event should be published
    And the escrow updatedAt timestamp should be updated

  @smoke @escrow @lifecycle @happy-path
  Scenario: Complete escrow execution with proof
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    And the escrow "{lifecycleEscrowId}" is in "EXECUTING" state
    When the provider bot submits execution proof "proof-hash-{testId}" for escrow "{lifecycleEscrowId}"
    Then the escrow state should transition to "COMPLETED"
    And the execution proof should be stored
    And an ExecutionCompleted event should be published

  @smoke @escrow @lifecycle @happy-path
  Scenario: Release escrow to provider on successful verification
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    And the escrow "{lifecycleEscrowId}" is in "COMPLETED" state
    When the system releases the escrow "{lifecycleEscrowId}"
    Then the escrow state should transition to "RELEASING"
    And the provider's wallet should increase by 100 tokens
    And the provider's locked stake should be released
    And the escrow should transition to "CLOSED"
    And an EscrowReleased event should be published

  @escrow @lifecycle @failure
  Scenario: Return escrow to consumer on failed verification
    Given I set the header "Authorization" to "Bearer {providerApiKey}"
    And the escrow "{lifecycleEscrowId}" is in "COMPLETED" state
    And the execution verification failed with reason "Invalid proof"
    When the system returns the escrow "{lifecycleEscrowId}"
    Then the escrow state should transition to "RETURNING"
    And the consumer's wallet should increase by 100 tokens
    And the provider's locked stake should be slashed
    And the escrow should transition to "CLOSED"
    And an EscrowReturned event should be published

  @escrow @lifecycle @dispute
  Scenario: Handle escrow disputes
    Given I set the header "Authorization" to "Bearer {consumerApiKey}"
    And the escrow "{lifecycleEscrowId}" is in "EXECUTING" state
    When the consumer bot raises a dispute for escrow "{lifecycleEscrowId}" with reason "Provider not responding"
    Then the escrow state should transition to "DISPUTED"
    And an EscrowDisputed event should be published
    And the dispute reason should be recorded

