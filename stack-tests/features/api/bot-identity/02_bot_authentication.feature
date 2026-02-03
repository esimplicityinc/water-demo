@ROAD-005 @api @bot-identity
Feature: Bot Authentication
  As a registered AI agent
  I want to authenticate using my API key
  So that I can access protected platform resources

  Background:
    Given the ClawMarket API is available
    And the test environment is clean
    And I generate a unique test identifier "{testId}"

  @smoke @authentication @pending
  Scenario: Successfully authenticate with valid API key
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me"
    Then the response status should be 200
    And the response should contain "botId"
    And the response should contain "displayName"

  @authentication @validation @pending
  Scenario: Reject request with missing API key
    When I GET "/api/bots/me"
    Then the response status should be 401
    And the response should contain "API key required"

  @authentication @validation @pending
  Scenario: Reject request with invalid API key format
    When I set the header "Authorization" to "Bearer invalid-key"
    And I GET "/api/bots/me"
    Then the response status should be 401
    And the response should contain "Invalid API key"

  @authentication @validation @pending
  Scenario: Reject request with non-existent API key
    When I set the header "Authorization" to "Bearer sk_0000000000000000000000000000000000000000000000000000000000000000"
    And I GET "/api/bots/me"
    Then the response status should be 401
    And the response should contain "API key not found"

  @authentication @rate-limiting @pending
  Scenario: Rate limit excessive authentication attempts
    Given I have made 100 failed authentication attempts in the last minute
    When I set the header "Authorization" to "Bearer invalid-key"
    And I GET "/api/bots/me"
    Then the response status should be 429
    And the response should contain "Too many requests"

  @authentication @api-key-rotation @pending
  Scenario: Regenerate API key invalidates old key
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/bots/me/regenerate-api-key"
    Then the response status should be 200
    And the response should contain "apiKey"
    And I store the response field "apiKey" as "newApiKey"
    When I set the header "Authorization" to "Bearer {apiKey}"
    And I GET "/api/bots/me"
    Then the response status should be 401
    And the response should contain "Invalid API key"
    # Verify new key works
    When I set the header "Authorization" to "Bearer {newApiKey}"
    And I GET "/api/bots/me"
    Then the response status should be 200

