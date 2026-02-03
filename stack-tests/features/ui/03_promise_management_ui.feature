@ROAD-012 @ROAD-013 @ui @promise-market
Feature: Promise Management UI
  As a provider bot operator
  I want to create and manage my promises through the UI
  So that I can offer my LLM compute capacity to the market

  Background:
    Given the ClawMarket API is available
    And a fresh test bot is registered via API with name "ui-test-{testId}"
    And the test bot is logged in via UI
    And I track all created promises for cleanup


  @smoke @promise-creation @pending
  Scenario: Create a new promise through the wizard
    Given an authenticated provider bot exists
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "gpt-4",
        "tokenCount": 1000,
        "responseSLA": 30000,
        "temperature": 0.7,
        "price": 500,
        "stakeAmount": 100,
        "slashPercentage": 50
      }
      """
    Then the response status should be 201
    And the response should contain fields:
      | field         | value  |
      | promiseId     | {uuid} |
      | status        | draft  |
      | modelName     | gpt-4  |
    And I store the response field "promiseId" as "createdPromiseId"

  @promise-creation @validation @pending
  Scenario: Display validation errors in creation wizard
    Given an authenticated provider bot exists
    When I POST "/api/promises" with body:
      """
      {
        "modelName": "",
        "tokenCount": 0,
        "responseSLA": 0,
        "price": 0,
        "stakeAmount": 5
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Model name is required"
    And the response field "errors" should contain "Must be greater than 0"

  @promise-listing @pending
  Scenario: List a draft promise
    Given an authenticated provider bot exists
    And I have a promise in draft state
    And I store "{promiseId}" as "draftPromiseId"
    When I POST "/api/promises/{draftPromiseId}/list" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response field "status" should equal "listed"
    And the response field "listedAt" should not be null
    When I GET "/api/wallets/me"
    Then the response field "lockedBalance" should be greater than 0

  @promise-management @pending
  Scenario: View my promises by status
    Given an authenticated provider bot exists
    And I have promises in various states
    When I GET "/api/promises/my?status=draft"
    Then the response status should be 200
    And all items in "promises" should have "status" equal to "draft"
    When I GET "/api/promises/my?status=listed"
    Then the response status should be 200
    And all items in "promises" should have "status" equal to "listed"
    When I GET "/api/promises/my?status=active"
    Then the response status should be 200
    And all items in "promises" should have "status" equal to "active"
    When I GET "/api/promises/my?status=completed"
    Then the response status should be 200
    And all items in "promises" should have "status" equal to "completed"
    When I GET "/api/promises/my?status=failed"
    Then the response status should be 200
    And all items in "promises" should have "status" equal to "failed"

  @promise-cancellation @pending
  Scenario: Cancel a listed promise
    Given an authenticated provider bot exists
    And I have a listed promise with no acceptances
    And I store "{promiseId}" as "listedPromiseId"
    When I POST "/api/promises/{listedPromiseId}/cancel" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response field "status" should equal "cancelled"
    When I GET "/api/wallets/me"
    Then the response field "lockedBalance" should equal 0

  @promise-execution @pending
  Scenario: View execution progress
    Given an authenticated provider bot exists
    And a consumer has accepted my promise
    And I store "{promiseId}" as "activePromiseId"
    When I GET "/api/promises/{activePromiseId}"
    Then the response status should be 200
    And the response should contain fields:
      | field            | value       |
      | status           | executing   |
      | progress         | {object}    |
      | timeRemaining    | {number}    |
      | consumerInput    | {string}    |
      | slaDeadline      | {timestamp} |

  @promise-completion @pending
  Scenario: Submit execution completion
    Given an authenticated provider bot exists
    And I am executing a promise
    And I store "{promiseId}" as "executingPromiseId"
    When I POST "/api/promises/{executingPromiseId}/complete" with body:
      """
      {
        "executionProof": "base64-encoded-proof-data",
        "outputHash": "sha256:output-hash",
        "outputData": "Completed LLM response data"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "pending_verification"
    And the response field "completedAt" should not be null
