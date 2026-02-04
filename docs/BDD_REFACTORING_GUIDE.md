# BDD Test Refactoring Guide for AI Agents

## Overview

This document provides context for AI agents working on BDD test refactoring in the PrimaDemo project.

## Current State

- **19 feature files** with 162 scenarios
- **117 "missing" steps** (actually just non-universal patterns)
- **Universal steps already exist** in `stack-tests/features/steps/primademo-steps.ts`

## The Problem

Feature files were written with **custom domain-specific steps** instead of **universal HTTP steps** that already exist. Examples:

❌ **Before (Non-Universal)**:
```gherkin
When the bot sends a GET request to "/api/bots/me/profile"
Then the response should contain:
  | field        | value              |
  | displayName  | "TestBot"          |
```

✅ **After (Universal)**:
```gherkin
When I GET "/api/bots/me/profile"
Then the response should contain fields:
  | field       | value         |
  | displayName | TestBot       |
```

## Universal Step Patterns

### HTTP Request Steps

```gherkin
When I GET "{path}"
When I POST "{path}"
When I POST "{path}" with body:
When I PUT "{path}"
When I PUT "{path}" with body:
When I PATCH "{path}"
When I PATCH "{path}" with body:
When I DELETE "{path}"
```

### Header Steps

```gherkin
When I set the header "{name}" to "{value}"
```

### Assertion Steps

```gherkin
Then the response status should be {int}
Then the response should contain "{field}"
Then the response should not contain "{field}"
Then the response should contain fields:
Then the response field "{field}" should equal "{value}"
Then the response field "{field}" should equal {int}
Then the response field "{field}" should contain "{substring}"
Then the response field "{field}" should match pattern "{pattern}"
```

### Context/Storage Steps

```gherkin
Given I store "{value}" as "{key}"
When I store "{value}" as "{key}"
When I store the response field "{field}" as "{key}"
```

### Setup Steps (Bot Identity)

```gherkin
Given the PrimaDemo API is available
Given an authenticated bot exists
Given a registered bot exists with API key
Given a bot with a valid API key
Given a bot exists with display name "{name}"
Given another bot exists with botId "{alias}"
Given an authenticated provider bot exists
Given an authenticated consumer bot exists
```

## Refactoring Rules

### 1. Self-Contained Scenarios
Each scenario must set up its own data and not depend on previous scenarios:

```gherkin
@pending
Scenario: Bot updates display name successfully
  Given an authenticated bot exists  # Sets up bot + auth
  When I PATCH "/api/bots/me/profile" with body:
    """
    {
      "displayName": "NewBotName"
    }
    """
  Then the response status should be 200
```

### 2. Idempotent Tests
Tests should be able to run multiple times without side effects:
- Use unique display names: `test-bot-${Date.now()}`
- Don't assume data exists from previous runs
- Clean up not needed (test data is isolated)

### 3. Template Variables
Use `{variableName}` syntax for dynamic values:
- `{botId}` - Will be replaced from context
- `{apiKey}` - Will be replaced from context
- `{displayName}` - Will be replaced from context

### 4. JSON Body Format
Use triple-quoted JSON for request bodies:

```gherkin
When I POST "/api/bots/register" with body:
  """
  {
    "displayName": "TestBot",
    "email": "test@example.com"
  }
  """
```

### 5. Table-Based Assertions
For checking multiple fields, use the table format:

```gherkin
Then the response should contain fields:
  | field         | value         |
  | botId         | {botId}       |
  | displayName   | TestBot       |
  | emailVerified | false         |
```

Dynamic values (like `{botId}`, `{timestamp}`, `{score}`) only check existence, not exact value.

### 6. Roadmap Tagging
Every scenario must have:
- `@ROAD-XXX` - The roadmap item
- `@api` or `@ui` or `@hybrid` - Test layer
- `@pending` - Until tests actually pass
- Optional: `@smoke`, `@validation`, `@security`

Example:
```gherkin
@ROAD-006 @api @bot-identity @view-profile @pending
Scenario: Bot views its own profile
```

## Step Mapping Reference

### Old → New Patterns

| Old Pattern | Universal Step |
|-------------|----------------|
| `When the bot sends a GET request to "..."` | `When I GET "..."` |
| `When the bot sends a POST request to "..."` | `When I POST "..."` |
| `When the bot sends a PATCH request to "..." with:` | `When I PATCH "..." with body:` |
| `Then the response should contain:` (table) | `Then the response should contain fields:` |
| `Then the error message should contain "..."` | `Then the response field "error" should contain "..."` |
| `Given a registered bot with valid API key` | `Given an authenticated bot exists` |
| `Given another bot exists with id "..."` | `Given a registered bot exists with API key` + `I store the response field "botId" as "otherBotId"` |

## File Locations

- **Feature files**: `stack-tests/features/api/bot-identity/*.feature`
- **Step definitions**: `stack-tests/features/steps/primademo-steps.ts`
- **Universal steps**: Already implemented in `primademo-steps.ts`

## Process

1. Read the feature file
2. Identify non-universal steps
3. Rewrite using universal patterns
4. Add proper roadmap tags
5. Add `@pending` tag
6. Test with `npx bddgen` to verify no missing steps
7. Remove `@pending` only when tests actually pass

## Example: Complete Refactoring

### Before:
```gherkin
Feature: Bot Profile Management
  
  Background:
    Given a registered bot with valid API key
    And the bot has the following profile:
      | field       | value     |
      | displayName | "TestBot" |

  Scenario: Bot views its own profile
    When the bot sends a GET request to "/api/bots/me/profile"
    Then the response status should be 200
    And the response should contain:
      | field       | value     |
      | displayName | "TestBot" |
```

### After:
```gherkin
@ROAD-006 @api @bot-identity
Feature: Bot Profile Management

  @view-profile @pending
  Scenario: Bot views its own profile
    Given an authenticated bot exists
    When I GET "/api/bots/me/profile"
    Then the response status should be 200
    And the response should contain fields:
      | field       | value         |
      | displayName | {displayName} |
```

## Critical Principles

1. **Use Universal Steps**: Always prefer `I GET`, `I POST`, etc.
2. **Self-Contained**: Each scenario sets up its own data
3. **Tagged Properly**: Every scenario has `@ROAD-XXX` and `@pending`
4. **JSON Bodies**: Use triple quotes for JSON
5. **No Backgrounds**: Avoid Background sections, use Given steps per scenario
6. **Template Variables**: Use `{variableName}` for dynamic data

## Verification

After refactoring, run:
```bash
cd stack-tests
npx bddgen
```

If you see "Missing step definitions", either:
1. You're still using non-universal patterns (fix the feature file)
2. You need to add a new universal step (add to primademo-steps.ts)

## Questions?

Refer to already refactored files as examples:
- `stack-tests/features/api/bot-identity/04_bot_profile.feature`
