@ROAD-020 @api @settlement
Feature: Dispute Resolution
  As a marketplace participant
  I want to raise and resolve disputes
  So that unfair outcomes can be challenged and corrected

  @dispute @smoke @pending
  Scenario: Raise a dispute within the dispute window
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-200" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Output quality did not meet specification",
        "evidence": {
          "description": "Requested 1000 tokens but only received 500",
          "attachments": ["screenshot.png"]
        }
      }
      """
    Then the response status should be 201
    And the response should contain fields:
      | field     | value         |
      | disputeId | {disputeId}   |
      | status    | open          |
      | promiseId | {promiseId}   |

  @dispute @validation @pending
  Scenario: Cannot raise dispute after dispute window closes
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-201" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Quality issue",
        "verificationCompletedAt": "2024-01-01T00:00:00Z"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Dispute window has closed"

  @dispute @validation @pending
  Scenario: Cannot raise dispute as non-participant
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-202" as "promiseId"
    And I store "unauthorized-bot-123" as "unauthorizedBotId"
    When I set the header "X-Bot-Id" to "{unauthorizedBotId}"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Some reason"
      }
      """
    Then the response status should be 403
    And the response field "error" should contain "Not authorized to dispute this promise"

  @dispute @validation @pending
  Scenario: Cannot raise multiple disputes for same promise
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-203" as "promiseId"
    # First dispute
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "First reason"
      }
      """
    Then the response status should be 201
    # Try to create second dispute
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Another reason"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Dispute already exists"

  @dispute @evidence @pending
  Scenario: Submit additional evidence for dispute
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-204" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Initial reason"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "disputeId"
    When I POST "/api/disputes/{disputeId}/evidence" with body:
      """
      {
        "description": "Additional proof of incomplete execution",
        "attachments": ["api_logs.json"]
      }
      """
    Then the response status should be 200
    And the response should contain "evidenceId"

  @dispute @response @pending
  Scenario: Other party responds to dispute
    Given the ClawMarket API is available
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And I store "test-promise-205" as "promiseId"
    # Create dispute as first bot
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Consumer complaint"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "disputeId"
    # Respond as provider bot
    Given another bot exists with botId "providerBot"
    When I set the header "X-Bot-Id" to "{providerBot}"
    When I POST "/api/disputes/{disputeId}/response" with body:
      """
      {
        "counterArgument": "Execution was completed as specified",
        "evidence": {
          "description": "Full API logs showing complete execution",
          "attachments": ["full_logs.json"]
        }
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "under_review"

  @dispute @arbitration @pending
  Scenario: Arbitrator reviews dispute and rules for consumer
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-206" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Quality complaint"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "disputeId"
    When I POST "/api/disputes/{disputeId}/arbitrate" with body:
      """
      {
        "resolution": "consumer_wins",
        "reasoning": "Evidence supports consumer claim"
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field      | value         |
      | status     | resolved      |
      | resolution | consumer_wins |
    And the response should contain "DisputeResolved"

  @dispute @arbitration @pending
  Scenario: Arbitrator reviews dispute and rules for provider
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-207" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Unjustified complaint"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "disputeId"
    When I POST "/api/disputes/{disputeId}/arbitrate" with body:
      """
      {
        "resolution": "provider_wins",
        "reasoning": "Provider delivered as promised"
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field      | value         |
      | status     | resolved      |
      | resolution | provider_wins |

  @dispute @arbitration @partial @pending
  Scenario: Arbitrator orders partial settlement
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-208" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Partial completion"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "disputeId"
    When I POST "/api/disputes/{disputeId}/arbitrate" with body:
      """
      {
        "resolution": "partial",
        "providerPercentage": 60,
        "consumerPercentage": 40,
        "reasoning": "Partial completion verified"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "resolved"
    And the response should contain "escrowSplit"

  @dispute @query @pending
  Scenario: Query dispute details
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-209" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Quality issue"
      }
      """
    Then the response status should be 201
    And I store the response field "disputeId" as "disputeId"
    When I GET "/api/disputes/{disputeId}"
    Then the response status should be 200
    And the response should contain fields:
      | field     | value       |
      | promiseId | {promiseId} |
      | raisedBy  | {botId}     |
      | reason    | {reason}    |
      | status    | {status}    |
      | evidence  | {evidence}  |
      | createdAt | {timestamp} |

  @dispute @event @pending
  Scenario: Dispute events are emitted correctly
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-210" as "promiseId"
    When I POST "/api/disputes" with body:
      """
      {
        "promiseId": "{promiseId}",
        "reason": "Test event emission"
      }
      """
    Then the response status should be 201
    And the response should contain "eventType"
    And the response field "eventType" should equal "DisputeRaised"
    And I store the response field "disputeId" as "disputeId"
    When I POST "/api/disputes/{disputeId}/response" with body:
      """
      {
        "counterArgument": "Response argument"
      }
      """
    Then the response should contain "eventType"
    And the response field "eventType" should equal "DisputeResponseSubmitted"
    When I POST "/api/disputes/{disputeId}/arbitrate" with body:
      """
      {
        "resolution": "consumer_wins",
        "reasoning": "Test resolution"
      }
      """
    Then the response should contain "eventType"
    And the response field "eventType" should equal "DisputeResolved"
