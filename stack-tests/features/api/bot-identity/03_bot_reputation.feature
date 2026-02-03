@ROAD-007 @api @bot-identity
Feature: Bot Reputation System
  As a platform participant
  I want bot reputation to be tracked and updated
  So that I can trust bots based on their performance history

  Background:
    Given the ClawMarket API is available
    And the test environment is clean
    And I generate a unique test identifier "{testId}"

  @reputation @query @pending
  Scenario: Query bot reputation score
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/{createdBotId}/reputation"
    Then the response status should be 200
    And the response should contain "score"
    And the response should contain "tier"
    And the response should contain "history"

  @reputation @tiers @pending
  Scenario: Reputation tier is beginner for low scores
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response field "score" should equal 50
    And the response field "tier" should equal "beginner"

  @reputation @tiers @pending
  Scenario: Reputation tier is intermediate for medium scores
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response field "score" should equal 100
    And the response field "tier" should equal "intermediate"

  @reputation @tiers @pending
  Scenario: Reputation tier is advanced for higher scores
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response field "score" should equal 500
    And the response field "tier" should equal "advanced"

  @reputation @tiers @pending
  Scenario: Reputation tier is expert for high scores
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response field "score" should equal 800
    And the response field "tier" should equal "expert"

  @reputation @adjustment @pending
  Scenario: Reputation increases after successful promise fulfillment
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # TODO: Set initial reputation score via test fixture
    # Simulate promise fulfillment on time
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for reputation"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    # Complete the promise on time
    When I POST "/api/promises/{testPromiseId}/complete" with body:
      """
      {
        "status": "fulfilled_on_time"
      }
      """
    Then the response status should be 200
    # Check reputation increased
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response should contain fields:
      | field  | value                     |
      | score  | {score}                   |
      | reason | promise_fulfilled_on_time |

  @reputation @adjustment @pending
  Scenario: Reputation increases slightly after late fulfillment
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for late reputation"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    # Complete the promise late
    When I POST "/api/promises/{testPromiseId}/complete" with body:
      """
      {
        "status": "fulfilled_late"
      }
      """
    Then the response status should be 200
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response should contain fields:
      | field  | value                  |
      | score  | {score}                |
      | reason | promise_fulfilled_late |

  @reputation @adjustment @pending
  Scenario: Reputation decreases after promise failure
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for failure"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    # Fail the promise
    When I POST "/api/promises/{testPromiseId}/complete" with body:
      """
      {
        "status": "failed"
      }
      """
    Then the response status should be 200
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response should contain fields:
      | field  | value          |
      | score  | {score}        |
      | reason | promise_failed |

  @reputation @adjustment @pending
  Scenario: Reputation decreases significantly after losing dispute
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for dispute"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    # Raise and lose a dispute
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{testPromiseId}",
        "reason": "service_not_delivered"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "testDisputeId"
    # Resolve dispute against the bot
    When I POST "/api/disputes/{testDisputeId}/resolve" with body:
      """
      {
        "outcome": "lost"
      }
      """
    Then the response status should be 200
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response should contain fields:
      | field  | value         |
      | score  | {score}       |
      | reason | dispute_lost  |

  @reputation @adjustment @pending
  Scenario: Reputation increases after winning dispute
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for winning dispute"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    # Raise a dispute
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{testPromiseId}",
        "reason": "service_not_delivered"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "testDisputeId"
    # Resolve dispute in favor of the bot
    When I POST "/api/disputes/{testDisputeId}/resolve" with body:
      """
      {
        "outcome": "won"
      }
      """
    Then the response status should be 200
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response should contain fields:
      | field  | value        |
      | score  | {score}      |
      | reason | dispute_won  |

  @reputation @bounds @pending
  Scenario: Reputation cannot exceed maximum of 1000
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # TODO: Set initial reputation score to 995 via test fixture
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for max reputation"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    When I POST "/api/promises/{testPromiseId}/complete" with body:
      """
      {
        "status": "fulfilled_on_time"
      }
      """
    Then the response status should be 200
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response field "score" should equal 1000

  @reputation @bounds @pending
  Scenario: Reputation cannot go below minimum of 0
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # TODO: Set initial reputation score to 15 via test fixture
    When I POST "/api/promises" with body:
      """
      {
        "type": "compute",
        "description": "Test promise for min reputation"
      }
      """
    Then the response status should be 201
    And I store the response field "promiseId" as "testPromiseId"
    When I POST "/api/promises/{testPromiseId}/complete" with body:
      """
      {
        "status": "failed"
      }
      """
    Then the response status should be 200
    When I GET "/api/bots/me/reputation"
    Then the response status should be 200
    And the response field "score" should equal 0

  @reputation @leaderboard @pending
  Scenario: Query top bots by reputation
    Given the ClawMarket API is available
    And multiple bots exist with varying reputation scores
    When I GET "/api/bots/leaderboard?limit=10"
    Then the response status should be 200
    And the response should contain "bots"
    # Verify response contains array of bots
    And the response should contain fields:
      | field | value  |
      | bots  | {bots} |

