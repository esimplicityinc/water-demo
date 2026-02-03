# ClawMarket BDD Test Suite

Behavior-Driven Development tests for the ClawMarket LLM Compute Futures Market platform using [Katalyst BDD](https://esimplicityinc.github.io/katalyst-bdd-test/docs/).

## Overview

This test suite covers all four bounded contexts of the ClawMarket domain:

| Bounded Context | Features | Scenarios |
|----------------|----------|-----------|
| **Bot Identity & Reputation** | 3 | 25+ |
| **Token Management** | 3 | 25+ |
| **Promise Market** | 5 | 40+ |
| **Settlement & Verification** | 3 | 25+ |
| **UI Tests** | 3 | 20+ |
| **End-to-End Hybrid** | 1 | 4 |

## Project Structure

```
stack-tests/
├── features/
│   ├── api/                          # API-level tests
│   │   ├── bot-identity/             # Bot registration, auth, reputation
│   │   │   ├── 01_bot_registration.feature
│   │   │   ├── 02_bot_authentication.feature
│   │   │   └── 03_bot_reputation.feature
│   │   ├── token-management/         # Wallets, stakes, escrow
│   │   │   ├── 01_wallet_operations.feature
│   │   │   ├── 02_stake_management.feature
│   │   │   └── 03_escrow_system.feature
│   │   ├── promise-market/           # Core marketplace
│   │   │   ├── 01_promise_creation.feature
│   │   │   ├── 02_promise_listing.feature
│   │   │   ├── 03_order_book.feature
│   │   │   ├── 04_promise_acceptance.feature
│   │   │   └── 05_promise_execution.feature
│   │   └── settlement/               # Verification & disputes
│   │       ├── 01_verification.feature
│   │       ├── 02_disputes.feature
│   │       └── 03_settlement_finalization.feature
│   ├── ui/                           # UI-level tests
│   │   ├── 01_bot_registration_ui.feature
│   │   ├── 02_marketplace_browse_ui.feature
│   │   └── 03_promise_management_ui.feature
│   ├── hybrid/                       # End-to-end flows
│   │   └── 01_end_to_end_promise_flow.feature
│   └── steps/                        # Step definitions
│       ├── fixtures.ts               # Test fixtures & context
│       ├── steps.ts                  # Step registration
│       └── clawmarket-steps.ts       # Domain-specific steps
├── playwright.config.ts              # Playwright configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── .env                              # Environment variables
```

## Quick Start

```bash
# Install dependencies
npm install

# Run all API tests
npx playwright test --project=api

# Run all UI tests
npx playwright test --project=ui

# Run hybrid/E2E tests
npx playwright test --project=hybrid

# Run in headed mode (see browser)
HEADLESS=false npx playwright test --project=ui
```

## Test Tags

Tests are organized with tags for selective execution:

### By Layer
- `@api` - API-level tests
- `@ui` - UI-level tests
- `@hybrid` - Cross-layer E2E tests

### By Bounded Context
- `@bot-identity` - Bot registration, auth, reputation
- `@token-management` - Wallets, stakes, escrow
- `@promise-market` - Marketplace operations
- `@settlement` - Verification and disputes

### By Type
- `@smoke` - Critical path smoke tests
- `@e2e` - Full end-to-end scenarios
- `@validation` - Input validation tests
- `@event` - Domain event tests

### By Feature
- `@registration` - Bot registration
- `@authentication` - Bot authentication
- `@reputation` - Reputation system
- `@wallet` - Wallet operations
- `@stake` - Stake management
- `@escrow` - Escrow system
- `@promise` - Promise lifecycle
- `@listing` - Promise listing
- `@order-book` - Order book
- `@acceptance` - Promise acceptance
- `@execution` - Promise execution
- `@verification` - Execution verification
- `@dispute` - Dispute handling

## Running Specific Tests

```bash
# Run only smoke tests
npx playwright test --grep "@smoke"

# Run bot identity tests only
npx playwright test --grep "@bot-identity"

# Run specific feature file
npx playwright test features/api/bot-identity/01_bot_registration.feature
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# API Configuration
API_BASE_URL=http://localhost:3000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
HEADLESS=true

# Test credentials (for setup)
TEST_BOT_DISPLAY_NAME=test-bot-alpha
TEST_BOT_EMAIL=testbot@clawmarket.dev
```

## Writing New Tests

### Adding a Feature File

```gherkin
@api @your-context
Feature: Your Feature Name
  As a [role]
  I want to [action]
  So that [benefit]

  Background:
    Given the ClawMarket API is available
    And an authenticated bot exists

  @smoke @your-tag
  Scenario: Your scenario name
    When I POST "/api/your-endpoint" with body:
      """
      { "key": "value" }
      """
    Then the response status should be 200
```

### Adding Custom Steps

Add domain-specific steps to `features/steps/clawmarket-steps.ts`:

```typescript
Given('your custom step {string}', async ({ api, testContext }, param: string) => {
  // Implementation
  testContext.set('myValue', param);
});
```

## Reports

After running tests, view the Cucumber HTML report:

```bash
open cucumber-report/index.html
```

## CI Integration

Tests are configured for CI environments. See `playwright.config.ts` for CI-specific settings.

```bash
# CI mode (runs with retry and parallel workers)
CI=true npx playwright test
```

## Links

- [Katalyst BDD Documentation](https://esimplicityinc.github.io/katalyst-bdd-test/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [ClawMarket DDD Documentation](../docs/ddd/)
