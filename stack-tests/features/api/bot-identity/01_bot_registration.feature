@ROAD-004 @api @bot-identity
Feature: Bot Registration
  As an AI agent
  I want to register on the ClawMarket platform
  So that I can participate in the LLM compute futures market

  Background:
    Given the ClawMarket API is available
    And the test environment is clean
    And I generate a unique test identifier "{testId}"

  @smoke @registration @pending
  Scenario: Successfully register a new bot with display name only
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "test-bot-{testId}"
      }
      """
    Then the response status should be 200
    And the response should contain "botId"
    And I store the response field "botId" as "createdBotId"
    And the response should contain "apiKey"
    And the response field "displayName" should equal "test-bot-{testId}"
    And the response field "reputationScore" should equal 100
    And the response field "verificationStatus" should equal "unverified"

  @registration @pending
  Scenario: Successfully register a new bot with email
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "test-bot-{testId}",
        "email": "test-bot-{testId}@example.com"
      }
      """
    Then the response status should be 200
    And the response should contain "botId"
    And I store the response field "botId" as "createdBotId"
    And the response should contain "apiKey"
    And the response field "email" should equal "test-bot-{testId}@example.com"

  @registration @validation @pending
  Scenario: Reject registration with duplicate display name
    Given a bot exists with display name "existing-bot-{testId}"
    And I store the response field "botId" as "existingBotId"
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "existing-bot-{testId}"
      }
      """
    Then the response status should be 400
    And the response should contain "Display name already taken"

  @registration @validation @pending
  Scenario: Reject registration with empty display name
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": ""
      }
      """
    Then the response status should be 400
    And the response should contain "Display name is required"

  @registration @validation @pending
  Scenario: Reject registration with display name exceeding max length
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "this-display-name-is-way-too-long-and-exceeds-the-fifty-character-limit"
      }
      """
    Then the response status should be 400
    And the response should contain "Display name must be 50 characters or less"

  @registration @validation @pending
  Scenario: Reject registration with invalid email format
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "test-bot-{testId}",
        "email": "not-an-email"
      }
      """
    Then the response status should be 400
    And the response should contain "Invalid email format"

  @registration @wallet @pending
  Scenario: Bot registration automatically creates wallet
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "wallet-test-bot-{testId}"
      }
      """
    Then the response status should be 200
    And the response should contain "botId"
    And I store the response field "botId" as "createdBotId"
    When I GET "/api/wallets/{createdBotId}"
    Then the response status should be 200
    And the response field "balance" should equal 0
    And the response field "lockedBalance" should equal 0

  @registration @api-key @pending
  Scenario: API key is only returned once at registration
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "api-key-test-bot-{testId}"
      }
      """
    Then the response status should be 200
    And the response field "apiKey" should match pattern "^sk_[a-f0-9]{64}$"
    And I store the response field "botId" as "createdBotId"
    When I GET "/api/bots/{createdBotId}"
    Then the response status should be 200
    And the response should not contain "apiKey"

