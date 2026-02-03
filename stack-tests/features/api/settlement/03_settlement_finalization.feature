@ROAD-019 @api @settlement
Feature: Settlement Finalization
  As the platform
  I want to finalize settlements
  So that tokens are distributed correctly and reputations are updated

  @settlement @smoke @pending
  Scenario: Finalize settlement after successful verification
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-300" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success",
        "disputeRaised": false
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field            | value               |
      | status           | finalized           |
      | escrowReleased   | true                |
      | event            | SettlementFinalized |

  @settlement @success @pending
  Scenario: Calculate platform fee on successful settlement
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-301" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success",
        "escrowAmount": 1000,
        "platformFeePercent": 2.5
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field             | value |
      | providerAmount    | 975   |
      | platformFee       | 25    |
      | totalEscrow       | 1000  |

  @settlement @late-fulfillment @pending
  Scenario: Reduced reputation gain for late fulfillment
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-302" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success",
        "completedWithinSLA": false,
        "completedWithin2xSLA": true
      }
      """
    Then the response status should be 200
    And the response field "reputationChange" should equal 5

  @settlement @failure @pending
  Scenario: Finalize settlement after promise failure
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-303" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "failed",
        "executionFailed": true
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field             | value               |
      | status            | finalized           |
      | escrowReturned    | true                |
      | stakeSlashed      | true                |
      | reputationChange  | {negativeValue}     |
      | events            | {eventsArray}       |

  @settlement @failure @slash @pending
  Scenario: Calculate slash amount based on penalty clause
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-304" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "failed",
        "stakeAmount": 500,
        "slashPercentage": 50
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field            | value |
      | slashedAmount    | 250   |
      | returnedStake    | 250   |
      | totalStake       | 500   |

  @settlement @dispute @pending
  Scenario: Finalize settlement after dispute resolution - consumer wins
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-305" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "disputeResolution": "consumer_wins",
        "escrowAmount": 1000,
        "stakeAmount": 500
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field              | value         |
      | status             | finalized     |
      | escrowRecipient    | consumer      |
      | stakeSlashed       | true          |
      | slashCompensation  | true          |

  @settlement @dispute @pending
  Scenario: Finalize settlement after dispute resolution - provider wins
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-306" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "disputeResolution": "provider_wins",
        "escrowAmount": 1000,
        "stakeAmount": 500
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field             | value               |
      | status            | finalized           |
      | escrowRecipient   | provider            |
      | stakeReturned     | true                |
      | reputationChange  | 15                  |

  @settlement @dispute @partial @pending
  Scenario: Finalize partial settlement after dispute
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-307" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "disputeResolution": "partial",
        "escrowAmount": 1000,
        "providerPercentage": 60,
        "consumerPercentage": 40
      }
      """
    Then the response status should be 200
    And the response should contain fields:
      | field              | value               |
      | status             | finalized           |
      | providerAmount     | 600                 |
      | consumerAmount     | 400                 |
      | stakePartialSlash  | true                |

  @settlement @query @pending
  Scenario: Query settlement case details
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-308" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success"
      }
      """
    Then the response status should be 200
    And I store the response field "settlementId" as "settlementId"
    When I GET "/api/settlements/{promiseId}"
    Then the response status should be 200
    And the response should contain fields:
      | field              | value               |
      | promiseId          | {promiseId}         |
      | status             | {status}            |
      | verificationResult | {verification}      |
      | outcome            | {outcome}           |
      | initiatedAt        | {timestamp}         |

  @settlement @query @pending
  Scenario: Query settlement outcome details
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-309" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success",
        "escrowAmount": 1000
      }
      """
    Then the response status should be 200
    When I GET "/api/settlements/{promiseId}/outcome"
    Then the response status should be 200
    And the response should contain fields:
      | field               | value                  |
      | escrowDistribution  | {distribution}         |
      | stakeDistribution   | {stakeDist}            |
      | reputationChanges   | {reputation}           |
      | platformFee         | {fee}                  |
      | settledAt           | {timestamp}            |

  @settlement @invariant @pending
  Scenario: Total distributed equals original escrow
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-310" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success",
        "escrowAmount": 1000
      }
      """
    Then the response status should be 200
    And the response field "totalDistributed" should equal 1000
    And the response field "tokenConservation" should equal true

  @settlement @event @pending
  Scenario: Settlement events include proper correlation
    Given the ClawMarket API is available
    Given an authenticated bot exists
    And I store "test-promise-311" as "promiseId"
    When I POST "/api/settlements" with body:
      """
      {
        "promiseId": "{promiseId}",
        "verificationStatus": "success",
        "includeEventChain": true
      }
      """
    Then the response status should be 200
    And the response should contain "eventChain"
    And the response should contain "correlationId"
    And the response field "events" should contain "SettlementFinalized"
