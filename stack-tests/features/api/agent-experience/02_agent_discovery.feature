@api @agent-experience @ROAD-039 @CAP-006 @US-006
Feature: Agent Directory & Discovery
  As an AI agent
  I want to discover other agents
  So that I can find collaboration partners

  Background:
    Given the Agent Experience context is initialized
    And multiple agents are registered with varying profiles:
      | name          | description                        | tier     | isActive | reputation |
      | alpha-bot     | High-performance compute agent     | expert   | true     | 95         |
      | beta-helper   | General purpose assistant          | beginner | true     | 45         |
      | gamma-search  | Search and retrieval specialist    | expert   | true     | 88         |
      | delta-learner | Learning and adaptation agent      | beginner | false    | 30         |
      | epsilon-core  | Core infrastructure agent          | expert   | true     | 92         |

  @smoke @browse @directory
  Scenario: Browse agent directory
    When I GET "/api/agents"
    Then the response status should be 200
    And the response should contain a list of agents
    And each agent should have public fields:
      | field       |
      | name        |
      | description |
      | reputation  |
      | tier        |
      | isActive    |
      | createdAt   |
      | stats       |
    And the response should not contain private fields:
      | field      |
      | apiKeyHash |
      | email      |
      | walletId   |
      | internalId |

  @search @directory @validation
  Scenario Outline: Search agents by name
    When I GET "/api/agents?search=<searchQuery>"
    Then the response status should be 200
    And the response should contain agents matching "<expectedMatch>"
    And the response should not contain agents not matching "<expectedMatch>"

    Examples:
      | searchQuery | expectedMatch |
      | alpha       | alpha-bot     |
      | BETA        | beta-helper   |
      | GaMmA       | gamma-search  |
      | helper      | beta-helper   |
      | specialist  | gamma-search  |
      | nonexistent | (none)        |

  @filter @directory @reputation
  Scenario Outline: Filter agents by reputation tier
    When I GET "/api/agents?tier=<tier>"
    Then the response status should be 200
    And the response should contain only agents with tier "<tier>"
    And the response should contain "<expectedCount>" agents

    Examples:
      | tier     | expectedCount |
      | expert   | 3             |
      | beginner | 2             |

  @profile @details @directory
  Scenario: View agent profile details
    Given an agent exists with name "alpha-bot"
    When I GET "/api/agents/alpha-bot/profile"
    Then the response status should be 200
    And the response should contain the agent profile:
      | field       | value                          |
      | name        | alpha-bot                      |
      | description | High-performance compute agent |
      | tier        | expert                         |
      | isActive    | true                           |
      | reputation  | 95                             |
    And the response should contain "createdAt"
    And the response should contain "stats"
    And the response should not contain:
      | field      |
      | apiKeyHash |
      | email      |
      | walletId   |
      | internalId |

  @profile @details @error @validation
  Scenario: View profile for non-existent agent
    When I GET "/api/agents/nonexistent-agent/profile"
    Then the response status should be 404
    And the response should contain "Agent not found"

  @browse @pagination @directory
  Scenario: Browse agent directory with pagination
    When I GET "/api/agents?limit=2&offset=0"
    Then the response status should be 200
    And the response should contain "2" agents
    And the response should contain pagination metadata:
      | field  |
      | total  |
      | limit  |
      | offset |
    When I GET "/api/agents?limit=2&offset=2"
    Then the response status should be 200
    And the response should contain "2" different agents

  @filter @combined @directory
  Scenario: Combined search and filter
    When I GET "/api/agents?search=bot&tier=expert&status=active"
    Then the response status should be 200
    And the response should contain only agents with:
      | condition                    |
      | name contains "bot"          |
      | tier equals "expert"         |
      | isActive equals true         |
