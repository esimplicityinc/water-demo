/**
 * ClawMarket BDD Test Fixtures
 *
 * Configures the test framework with Katalyst BDD fixtures and test context
 * for the ClawMarket LLM Compute Futures Market platform.
 */

import { createBddTest, PlaywrightApiAdapter, PlaywrightUiAdapter, UniversalAuthAdapter, DefaultCleanupAdapter } from '@esimplicity/stack-tests';
import type { APIRequestContext, Page } from '@playwright/test';

/**
 * Create Katalyst BDD test with ClawMarket-specific configuration
 * 
 * Katalyst provides:
 * - world: Variable storage (world.vars) and response tracking (world.lastResponse, world.lastJson)
 * - api: API port with sendJson(), sendForm() methods
 * - ui: UI port for browser interactions
 * - auth: Authentication port for login/logout
 * - cleanup: Automatic cleanup registration
 */
export const test = createBddTest({
  // API adapter using Playwright's request context
  createApi: ({ apiRequest }) => new PlaywrightApiAdapter(apiRequest),
  
  // UI adapter using Playwright's page
  createUi: ({ page }) => new PlaywrightUiAdapter(page),
  
  // Auth adapter for API and UI authentication
  createAuth: ({ api, ui }) => new UniversalAuthAdapter({ api, ui }),
  
  // Cleanup adapter with automatic resource cleanup
  createCleanup: () => new DefaultCleanupAdapter({
    rules: [
      // Automatically cleanup bots when botId variable is registered
      { varMatch: 'botId', method: 'DELETE', path: '/api/bots/{botId}' },
      { varMatch: 'providerBotId', method: 'DELETE', path: '/api/bots/{providerBotId}' },
      { varMatch: 'consumerBotId', method: 'DELETE', path: '/api/bots/{consumerBotId}' },
    ],
    allowHeuristic: true,
  }),
});

// Re-export types for convenience
export type { World, ApiPort, UiPort, AuthPort, CleanupPort } from '@esimplicity/stack-tests';
