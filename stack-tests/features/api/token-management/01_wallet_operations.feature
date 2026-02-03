@ROAD-008 @api @token-management
Feature: Wallet Operations
  As a registered bot
  I want to manage my token wallet
  So that I can participate in the marketplace

  Background:
    Given the ClawMarket API is available
    And I generate a unique test identifier "{testId}"
    And a fresh test bot is registered with unique name "wallet-test-{testId}"
    And the test bot has a clean wallet with 10000 tokens
    And I record the initial wallet balance as "initialBalance"
    And any previous test stakes are released
    And any previous test escrows are closed

  @smoke @wallet @pending
  Scenario: Query wallet balance
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    When I GET "/api/wallets/me"
    Then the response status should be 200
    And the response should contain fields:
      | field            | value              |
      | botId            | {botId}            |
      | balance          | {balance}          |
      | lockedBalance    | {lockedBalance}    |
      | availableBalance | {availableBalance} |

  @wallet @deposit @pending
  Scenario: Deposit tokens into wallet
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    When I POST "/api/wallets/me/deposit" with body:
      """
      {
        "amount": 1000
      }
      """
    Then the response status should be 200
    And the response field "balance" should equal 11000
    And the response field "availableBalance" should equal 11000
    And I store the transaction ID as "depositTxId1"

  @wallet @deposit @validation @pending
  Scenario: Reject deposit with negative amount
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    When I POST "/api/wallets/me/deposit" with body:
      """
      {
        "amount": -100
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "positive"

  @wallet @deposit @validation @pending
  Scenario: Reject deposit with zero amount
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    When I POST "/api/wallets/me/deposit" with body:
      """
      {
        "amount": 0
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "greater than zero"

  @wallet @withdraw @pending
  Scenario: Withdraw tokens from wallet
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Then withdraw
    When I POST "/api/wallets/me/withdraw" with body:
      """
      {
        "amount": 500
      }
      """
    Then the response status should be 200
    And the response field "balance" should equal 9500
    And I store the transaction ID as "withdrawTxId1"

  @wallet @withdraw @validation @pending
  Scenario: Reject withdrawal exceeding available balance
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Attempt to withdraw too much
    When I POST "/api/wallets/me/withdraw" with body:
      """
      {
        "amount": 15000
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Insufficient"

  @wallet @transfer @pending
  Scenario: Transfer tokens to another bot
    Given I store the response field "botId" as "senderBotId"
    And I store the response field "apiKey" as "senderApiKey"
    # Create recipient bot
    Given a fresh test bot is registered with unique name "wallet-recipient-{testId}"
    And I store the response field "botId" as "recipientBotId"
    And I store the response field "apiKey" as "recipientApiKey"
    # Switch back to sender and transfer
    When I set the header "Authorization" to "Bearer {senderApiKey}"
    When I POST "/api/wallets/me/transfer" with body:
      """
      {
        "recipientBotId": "{recipientBotId}",
        "amount": 250
      }
      """
    Then the response status should be 200
    And the response field "balance" should equal 9750
    And I store the transaction ID as "transferTxId1"

  @wallet @transfer @validation @pending
  Scenario: Reject transfer to non-existent bot
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Attempt transfer to non-existent bot
    When I POST "/api/wallets/me/transfer" with body:
      """
      {
        "recipientBotId": "non-existent-bot-id-12345-{testId}",
        "amount": 100
      }
      """
    Then the response status should be 404
    And the response field "error" should contain "not found"

  @wallet @transfer @validation @pending
  Scenario: Reject transfer to self
    Given I store the response field "botId" as "myBotId"
    And I store the response field "apiKey" as "testApiKey"
    # Attempt transfer to self
    When I POST "/api/wallets/me/transfer" with body:
      """
      {
        "recipientBotId": "{myBotId}",
        "amount": 100
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "self"

  @wallet @history @pending
  Scenario: Query transaction history
    Given I store the response field "botId" as "testBotId"
    And I store the response field "apiKey" as "testApiKey"
    # First deposit tokens to create a transaction
    When I POST "/api/wallets/me/deposit" with body:
      """
      {
        "amount": 500
      }
      """
    Then the response status should be 200
    And I store the transaction ID as "historyTxId1"
    # Query transaction history
    When I GET "/api/wallets/me/transactions?limit=10"
    Then the response status should be 200
    And the response should contain fields:
      | field        | value       |
      | transactions | {array}     |
      | total        | {total}     |

