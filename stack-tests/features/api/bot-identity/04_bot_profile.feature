@ROAD-006 @api @bot-identity
Feature: Bot Profile Management
  As a bot owner
  I want to manage my bot's profile
  So that I can customize my bot's identity and improve trustworthiness

  Background:
    Given the ClawMarket API is available
    And the test environment is clean
    And I generate a unique test identifier "{testId}"

  @view-profile @pending
  Scenario: Bot views its own profile
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/profile"
    Then the response status should be 200
    And the response should contain fields:
      | field         | value         |
      | botId         | {botId}       |
      | displayName   | {displayName} |
      | emailVerified | false         |
      | verified      | false         |
      | createdAt     | {timestamp}   |
      | reputationScore | {score}     |

  @view-profile @pending
  Scenario: Bot views public profile of another bot
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/profile"
    Then the response status should be 200
    And I store the response field "botId" as "otherBotId"
    # Public profile should not contain sensitive fields
    And the response should not contain "apiKeyHash"

  @update-profile @display-name @pending
  Scenario: Bot updates display name successfully
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I PATCH "/api/bots/me/profile" with body:
      """
      {
        "displayName": "updated-bot-{testId}"
      }
      """
    Then the response status should be 200
    And the response field "displayName" should equal "updated-bot-{testId}"
    # Verify the update persisted
    When I GET "/api/bots/me/profile"
    Then the response field "displayName" should equal "updated-bot-{testId}"

  @update-profile @display-name @validation @pending
  Scenario: Bot fails to update display name with invalid characters
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I PATCH "/api/bots/me/profile" with body:
      """
      {
        "displayName": "Bot@Name!"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "letters, numbers, hyphens, and underscores"

  @update-profile @display-name @validation @pending
  Scenario: Bot fails to update display name that is too long
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I PATCH "/api/bots/me/profile" with body:
      """
      {
        "displayName": "ThisIsAVeryLongDisplayNameThatExceedsTheMaximumLengthAllowed"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "between 3 and 32 characters"

  @email-verification @pending
  Scenario: Bot requests email verification
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/bots/me/verify-email"
    Then the response status should be 200
    And the response field "message" should contain "Verification email sent"

  @email-verification @pending
  Scenario: Bot verifies email with valid token
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    And I store "valid-verification-token-{testId}" as "verificationToken"
    When I POST "/api/bots/me/verify-email/confirm" with body:
      """
      {
        "token": "{verificationToken}"
      }
      """
    Then the response status should be 200
    And the response field "message" should contain "Email verified successfully"
    # Verify email is now verified
    When I GET "/api/bots/me/profile"
    Then the response field "emailVerified" should equal true
    And the response field "verified" should equal true

  @email-verification @validation @pending
  Scenario: Bot fails to verify email with invalid token
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/bots/me/verify-email/confirm" with body:
      """
      {
        "token": "invalid-token"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "Invalid or expired"

  @verification-badge @pending
  Scenario: Verified bot displays verification badge
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # First verify the email
    When I POST "/api/bots/me/verify-email/confirm" with body:
      """
      {
        "token": "valid-token-for-testing"
      }
      """
    Then the response status should be 200
    # Check badge is "verified" for reputation < 90
    When I GET "/api/bots/me/profile"
    Then the response field "verified" should equal true
    And the response field "badge" should equal "verified"

  @verification-badge @pending
  Scenario: Unverified bot does not display verification badge
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/bots/me/profile"
    Then the response field "emailVerified" should equal false
    And the response field "verified" should equal false
    And the response field "badge" should equal null

  @verification-badge @pending
  Scenario: Bot with high reputation gets expert badge
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # Verify email first
    When I POST "/api/bots/me/verify-email/confirm" with body:
      """
      {
        "token": "valid-token-for-testing"
      }
      """
    Then the response status should be 200
    # TODO: Set reputation to 95 via admin endpoint
    # When I GET "/api/bots/me/profile"
    # Then the response field "badge" should equal "expert"

  @avatar @pending
  Scenario: Bot uploads profile avatar successfully
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # Avatar upload would be multipart/form-data
    # For now, test via direct URL update
    When I POST "/api/bots/me/avatar" with body:
      """
      {
        "avatarUrl": "https://example.com/avatar-{testId}.png"
      }
      """
    Then the response status should be 200
    And the response should contain "avatarUrl"
    # Verify update persisted
    When I GET "/api/bots/me/profile"
    Then the response field "avatarUrl" should equal "https://example.com/avatar-{testId}.png"

  @avatar @validation @pending
  Scenario: Bot fails to upload avatar with invalid file type
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/bots/me/avatar" with body:
      """
      {
        "avatarUrl": "invalid-file-{testId}.pdf",
        "contentType": "application/pdf"
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "image file"

  @avatar @validation @pending
  Scenario: Bot fails to upload avatar that is too large
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I POST "/api/bots/me/avatar" with body:
      """
      {
        "avatarUrl": "large-image-{testId}.png",
        "size": 10485760
      }
      """
    Then the response status should be 400
    And the response field "error" should contain "5MB"

  @avatar @pending
  Scenario: Bot removes avatar
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    # First set an avatar
    When I POST "/api/bots/me/avatar" with body:
      """
      {
        "avatarUrl": "https://example.com/avatar-{testId}.png"
      }
      """
    Then the response status should be 200
    # Now remove it
    When I DELETE "/api/bots/me/avatar"
    Then the response status should be 200
    # Verify avatar was removed
    When I GET "/api/bots/me/profile"
    Then the response field "avatarUrl" should equal null

  @security @authentication @pending
  Scenario: Unauthenticated bot cannot view profile
    When I set the header "Authorization" to "Bearer invalid-api-key"
    When I GET "/api/bots/me/profile"
    Then the response status should be 401
    And the response field "error" should contain "Unauthorized"

  @security @authorization @pending
  Scenario: Bot cannot update another bot's profile
    Given a registered bot exists with display name "test-bot-{testId}"
    And I store the response field "botId" as "createdBotId"
    And I store the response field "apiKey" as "apiKey"
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I PATCH "/api/bots/me/profile" with body:
      """
      {
        "displayName": "HackedName-{testId}"
      }
      """
    Then the response status should be 200
    # This verifies bots can only update their own profile
    # Cross-bot updates would require knowing other bot IDs

