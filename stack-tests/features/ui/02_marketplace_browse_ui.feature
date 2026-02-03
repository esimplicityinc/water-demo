@ROAD-015 @ROAD-021 @ui @promise-market
Feature: Marketplace Browse UI
  As a consumer bot operator
  I want to browse available promises in the marketplace
  So that I can find suitable LLM compute offers

  Background:
    Given the ClawMarket API is available
    And a fresh test bot is registered via API with name "ui-test-{testId}"
    And the test bot is logged in via UI


  @smoke @marketplace @pending
  Scenario: View available promises in marketplace
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are promises listed in the marketplace
    When I GET "/api/marketplace/promises"
    Then the response status should be 200
    And the response should contain fields:
      | field    | value    |
      | promises | {array}  |
    And the response field "promises" should not be empty

  @marketplace @filtering @pending
  Scenario: Filter promises by model
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are promises listed in the marketplace
    When I GET "/api/marketplace/promises?model=gpt-4"
    Then the response status should be 200
    And the response field "promises" should only contain items with "modelName" equal to "gpt-4"

  @marketplace @filtering @pending
  Scenario: Filter promises by price range
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are promises listed in the marketplace
    When I GET "/api/marketplace/promises?minPrice=100&maxPrice=500"
    Then the response status should be 200
    And the response field "promises" should only contain items with price between 100 and 500

  @marketplace @sorting @pending
  Scenario: Sort promises by price
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are promises listed in the marketplace
    When I GET "/api/marketplace/promises?sortBy=price&order=asc"
    Then the response status should be 200
    And the response field "promises" should be sorted by "price" ascending
    When I GET "/api/marketplace/promises?sortBy=price&order=desc"
    Then the response status should be 200
    And the response field "promises" should be sorted by "price" descending

  @marketplace @sorting @pending
  Scenario: Sort promises by provider reputation
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are promises listed in the marketplace
    When I GET "/api/marketplace/promises?sortBy=reputation&order=desc"
    Then the response status should be 200
    And the response field "promises" should be sorted by "providerReputation" descending

  @marketplace @search @pending
  Scenario: Search promises by keyword
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are promises listed in the marketplace
    When I GET "/api/marketplace/promises?search=gpt-4"
    Then the response status should be 200
    And the response should contain "promises"

  @marketplace @detail @pending
  Scenario: View promise details
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there is a listed promise
    And I store "{promiseId}" as "targetPromiseId"
    When I GET "/api/marketplace/promises/{targetPromiseId}"
    Then the response status should be 200
    And the response should contain fields:
      | field            | value             |
      | promiseId        | {targetPromiseId} |
      | modelName        | {string}          |
      | tokenCount       | {number}          |
      | price            | {number}          |
      | providerRating   | {score}           |
      | providerProfile  | {object}          |
      | responseSLA      | {number}          |

  @marketplace @pagination @pending
  Scenario: Navigate through paginated results
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    And there are 50 promises in the marketplace
    When I GET "/api/marketplace/promises?page=1&pageSize=10"
    Then the response status should be 200
    And the response should contain fields:
      | field         | value   |
      | promises      | {array} |
      | totalCount    | 50      |
      | currentPage   | 1       |
      | totalPages    | 5       |
      | pageSize      | 10      |
    When I GET "/api/marketplace/promises?page=2&pageSize=10"
    Then the response status should be 200
    And the response field "currentPage" should equal 2

  @marketplace @empty @pending
  Scenario: Display empty state when no promises available
    Given a registered bot exists with API key
    And I set the header "Authorization" to "Bearer {apiKey}"
    When I GET "/api/marketplace/promises"
    Then the response status should be 200
    And the response should contain fields:
      | field      | value |
      | promises   | []    |
      | totalCount | 0     |
