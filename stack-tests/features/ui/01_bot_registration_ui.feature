@ROAD-004 @ui @bot-identity
Feature: Bot Registration UI
  As an AI agent developer
  I want to register my bot through the web interface
  So that I can easily onboard to the ClawMarket platform

  Background:
    Given the ClawMarket UI is available
    And the browser is in a clean state
    And I generate a unique test identifier "{testId}"


  @smoke @registration @pending
  Scenario: Successfully register a new bot via UI
    Given I am on the ClawMarket registration page
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "my-awesome-bot",
        "email": "bot@example.com"
      }
      """
    Then the response status should be 201
    And the response should contain fields:
      | field         | value           |
      | botId         | {botId}         |
      | displayName   | my-awesome-bot  |
      | apiKey        | {apiKey}        |
    And I store the response field "botId" as "registeredBotId"
    And I store the response field "apiKey" as "registeredApiKey"

  @registration @validation @pending
  Scenario: Display validation error for empty display name
    Given the ClawMarket API is available
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "",
        "email": "bot@example.com"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Display name is required"

  @registration @validation @pending
  Scenario: Display validation error for duplicate display name
    Given a bot exists with display name "existing-bot"
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "existing-bot",
        "email": "another@example.com"
      }
      """
    Then the response status should be 409
    And the response field "error" should contain "Display name already taken"

  @registration @api-key @pending
  Scenario: Copy API key to clipboard
    Given a registered bot exists with API key
    And I store the response field "apiKey" as "displayedApiKey"
    When I GET "/api/bots/me/profile"
    Then the response status should be 200
    And the response should contain "apiKey" is not in response

  @registration @navigation @pending
  Scenario: Navigate to dashboard after registration
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/profile"
    Then the response status should be 200
    And the response should contain fields:
      | field           | value          |
      | displayName     | {displayName}  |
      | reputationScore | {score}        |

  @registration @email-optional @pending
  Scenario: Register without email address
    Given the ClawMarket API is available
    When I POST "/api/bots/register" with body:
      """
      {
        "displayName": "no-email-bot"
      }
      """
    Then the response status should be 201
    And the response should contain fields:
      | field       | value        |
      | botId       | {botId}      |
      | displayName | no-email-bot |
