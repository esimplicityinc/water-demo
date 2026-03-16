---
title: Read Skill Documentation
persona: PER-002
status: planned
capabilities:
  - CAP-005
use_cases:
  - UC-020
roadmap:
  - ROAD-038
---

# US-005: Read Skill Documentation

## Story

**As an** AI agent  
**I want** to read the platform's skill documentation  
**So that** I can understand how to interact with PrimaDemo's API without human intervention

## Acceptance Criteria

- [ ] Agent can fetch skill.md from public endpoint
- [ ] Skill documentation includes API base URL
- [ ] Skill documentation lists all available endpoints
- [ ] Skill documentation explains authentication requirements
- [ ] Skill documentation provides code examples
- [ ] Skill documentation includes version information
- [ ] Agent can check for skill updates via skill.json
- [ ] Documentation is machine-readable (structured format)

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-005: Agent Skill Documentation | Provide machine-readable API docs | 🎯 Planned |

### Maps to Use Cases
- **UC-020: Discover Platform Capabilities** - Primary use case
  - Fetch skill documentation
  - Parse API specifications
  - Cache for future reference

### Implemented By Roadmap
- **ROAD-038: Agent Skill Documentation System** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/agent-experience/01_skill_documentation.feature`

```gherkin
@US-005 @CAP-005 @ROAD-038
Feature: Read Skill Documentation
  As an AI agent
  I want to read skill documentation
  So that I can understand the PrimaDemo API

  Background:
    Given the Agent Experience context is initialized

  Scenario: Fetch skill documentation
    Given an AI agent wants to use PrimaDemo
    When the agent fetches "https://primademo.com/api/skill.md"
    Then the response should contain:
      | Field       | Value              |
      | name        | primademo         |
      | version     | semantic version   |
      | base_url    | API base URL       |
    And the documentation should list all available endpoints
    And the documentation should explain authentication
    And the documentation should provide code examples

  Scenario: Check for skill updates
    Given an agent has cached skill version "1.0.0"
    When the agent fetches "https://primademo.com/api/skill.json"
    And the version field is "1.1.0"
    Then the agent should detect an update is available
    And the agent should re-fetch the full skill.md

  Scenario: Parse endpoint documentation
    Given an agent has fetched skill.md
    When the agent parses the endpoint section
    Then the agent should find endpoint definitions with:
      | Field        | Description              |
      | method       | HTTP method              |
      | path         | Endpoint path            |
      | description  | What it does             |
      | auth         | Authentication required? |
      | params       | Request parameters       |
      | response     | Response format          |
```

## Technical Notes

### Skill.md Endpoint
```http
GET /api/skill.md
Content-Type: text/markdown

Response: Markdown document with structured API documentation
```

### Skill.json Endpoint
```http
GET /api/skill.json
Content-Type: application/json

Response:
{
  "name": "primademo",
  "version": "1.0.0",
  "description": "Promise marketplace for AI compute services",
  "homepage": "https://primademo.com",
  "skill_url": "https://primademo.com/api/skill.md",
  "heartbeat_url": "https://primademo.com/api/heartbeat.md",
  "api_base": "https://primademo.com/api/v1"
}
```

### Agent Integration Pattern
```typescript
// Agent fetches and caches skill documentation
async function initializePrimaDemo() {
  const skillInfo = await fetch('https://primademo.com/api/skill.json').then(r => r.json());
  
  // Check if update needed
  if (skillInfo.version !== cachedVersion) {
    const skillDoc = await fetch(skillInfo.skill_url).then(r => r.text());
    cacheSkillDocumentation(skillDoc);
  }
  
  return skillInfo;
}
```

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-005

# Validate skill.md format
just validate-skill

# Check skill endpoint
just test-skill-endpoint
```

## Related Documentation

- [CAP-005: Agent Skill Documentation](../capabilities/CAP-005-agent-skill-documentation)
- [ROAD-038: Agent Skill Documentation System](../roads/ROAD-038)
- [UC-020: Discover Platform Capabilities](../ddd/07-use-cases#uc-020-discover-platform-capabilities)

---

**ID**: US-005 | **Persona**: PER-002 | **Status**: Planned 🎯
