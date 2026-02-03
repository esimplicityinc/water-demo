@api @token-management @ROAD-011 @crypto-bridge
Feature: Crypto Bridge Operations
  As a bot on ClawMarket
  I want to bridge tokens between ClawMarket and external blockchains
  So that I can use my tokens in external DeFi ecosystems

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "bridge-test-{testId}"
    And I store the response field "botId" as "bridgeBotId"
    And I store the response field "apiKey" as "bridgeApiKey"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "bridgeInitialBalance"
    And the bridge test environment is isolated
    And any previous bridge transactions are cancelled

  @smoke @bridge @pending
  Scenario: Initiate token bridge to external chain
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    When I POST "/api/bridge/outgoing" with body:
      """
      {
        "targetChain": "ethereum",
        "targetAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb{testId}",
        "amount": 1000,
        "token": "CLAW"
      }
      """
    Then the response status should be 201
    And the response should contain fields:
      | field           | value         |
      | bridgeTxId      | {bridgeTxId}  |
      | status          | pending       |
      | targetChain     | ethereum      |
      | amount          | 1000          |
    And I store the response field "bridgeTxId" as "outgoingTxId1"
    And I store the bridge transaction reference for cleanup

  @bridge @validation @pending
  Scenario: Reject bridge with invalid target address
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    When I POST "/api/bridge/outgoing" with body:
      """
      {
        "targetChain": "ethereum",
        "targetAddress": "invalid-address",
        "amount": 1000,
        "token": "CLAW"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "invalid address"

  @bridge @validation @pending
  Scenario: Reject bridge exceeding available balance
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    When I POST "/api/bridge/outgoing" with body:
      """
      {
        "targetChain": "ethereum",
        "targetAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb{testId}",
        "amount": 50000,
        "token": "CLAW"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "insufficient balance"

  @bridge @query @pending
  Scenario: Query bridge transaction status
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    And a bridge transaction exists with ID "bridge-tx-{testId}"
    And I store the bridge transaction ID as "queryBridgeTxId"
    When I GET "/api/bridge/transactions/{queryBridgeTxId}"
    Then the response status should be 200
    And the response should contain fields:
      | field           | value         |
      | bridgeTxId      | {queryBridgeTxId} |
      | status          | {status}      |
      | targetChain     | ethereum      |

  @bridge @incoming @pending
  Scenario: Process incoming bridge from external chain
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    When I POST "/api/bridge/incoming" with body:
      """
      {
        "sourceChain": "ethereum",
        "sourceTxHash": "0xabc123def456{testId}",
        "sourceAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb{testId}",
        "amount": 500,
        "token": "CLAW"
      }
      """
    Then the response status should be 201
    And the response should contain fields:
      | field           | value         |
      | bridgeTxId      | {bridgeTxId}  |
      | status          | processing    |
      | sourceChain     | ethereum      |
    And I store the response field "bridgeTxId" as "incomingTxId1"
    And I store the bridge transaction reference for cleanup

  @bridge @cancel @pending
  Scenario: Cancel pending bridge transaction
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    And a pending bridge transaction exists with ID "bridge-cancel-{testId}"
    And I store the bridge transaction ID as "cancelBridgeTxId"
    When I POST "/api/bridge/transactions/{cancelBridgeTxId}/cancel" with body:
      """
      {
        "reason": "User requested cancellation"
      }
      """
    Then the response status should be 200
    And the response field "status" should equal "cancelled"

  @bridge @fees @pending
  Scenario: Calculate bridge fees
    Given I set the header "Authorization" to "Bearer {bridgeApiKey}"
    When I GET "/api/bridge/fees?targetChain=ethereum&amount=1000"
    Then the response status should be 200
    And the response should contain fields:
      | field           | value         |
      | baseFee         | {amount}      |
      | networkFee      | {amount}      |
      | totalFee        | {amount}      |
      | targetChain     | ethereum      |

