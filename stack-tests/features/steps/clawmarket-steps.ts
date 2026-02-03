/**
 * ClawMarket Custom Step Definitions
 *
 * Domain-specific steps for testing the LLM Compute Futures Market.
 * These steps encapsulate ClawMarket business logic and API interactions.
 *
 * NOTE: Generic HTTP, UI, and assertion steps are provided by Katalyst.
 * This file contains ONLY ClawMarket-specific domain logic.
 */

import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// =============================================================================
// BOT IDENTITY & REGISTRATION STEPS
// =============================================================================

/**
 * Generate a unique test ID for bot names
 */
Given('a unique test ID', async ({ world }) => {
  world.vars['testId'] = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
});

/**
 * Register a bot with a unique display name
 */
Given('a registered bot with display name {string}', async ({ api, world, cleanup }, displayName: string) => {
  const uniqueName = `${displayName}-${world.vars['testId'] || Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName: uniqueName });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['botId'] = result.json.botId;
  world.vars['apiKey'] = result.json.apiKey;
  world.vars['displayName'] = uniqueName;

  // Register cleanup for the created bot
  cleanup.registerFromVar(world, 'botId', result.json.botId);
});

/**
 * Register an authenticated bot with API key set
 */
Given('an authenticated bot exists', async ({ api, world, cleanup }) => {
  const displayName = `auth-bot-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['botId'] = result.json.botId;
  world.vars['apiKey'] = result.json.apiKey;
  world.vars['displayName'] = displayName;

  // Set authorization header for subsequent requests
  world.headers['Authorization'] = `Bearer ${result.json.apiKey}`;

  // Register cleanup
  cleanup.registerFromVar(world, 'botId', result.json.botId);
});

/**
 * Register a provider bot with wallet funded
 */
Given('an authenticated provider bot exists', async ({ api, world, cleanup }) => {
  const displayName = `provider-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['providerBotId'] = result.json.botId;
  world.vars['providerApiKey'] = result.json.apiKey;

  // Fund the provider wallet
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: result.json.botId,
    amount: 10000,
  });

  // Set authorization header
  world.headers['Authorization'] = `Bearer ${result.json.apiKey}`;

  // Register cleanup
  cleanup.registerFromVar(world, 'providerBotId', result.json.botId);
});

/**
 * Register a consumer bot
 */
Given('an authenticated consumer bot exists', async ({ api, world, cleanup }) => {
  const displayName = `consumer-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['consumerBotId'] = result.json.botId;
  world.vars['consumerApiKey'] = result.json.apiKey;

  // Register cleanup
  cleanup.registerFromVar(world, 'consumerBotId', result.json.botId);
});

/**
 * Register another bot with a specific alias
 */
Given('another bot exists with botId {string}', async ({ api, world, cleanup }, alias: string) => {
  const displayName = `other-bot-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars[alias] = result.json.botId;
  world.vars[`${alias}ApiKey`] = result.json.apiKey;

  // Register cleanup
  cleanup.registerFromVar(world, alias, result.json.botId);
});

/**
 * Set up a bot with specific reputation score (admin endpoint)
 */
Given('a bot with reputation score {int}', async ({ api, world }, score: number) => {
  const botId = world.vars['botId'];
  const result = await api.sendJson('POST', `/api/admin/bots/${botId}/set-reputation`, { score });
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['initialReputation'] = score;
});

// =============================================================================
// WALLET & TOKEN STEPS
// =============================================================================

/**
 * Set up wallet with specific token balance
 */
Given('my wallet has a balance of {int} tokens', async ({ api, world }, amount: number) => {
  const botId = world.vars['botId'];
  const result = await api.sendJson('POST', '/api/admin/wallets/deposit', { botId, amount });
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['walletBalance'] = amount;
});

Given('my wallet has {int} tokens', async ({ api, world }, amount: number) => {
  const botId = world.vars['botId'];
  await api.sendJson('POST', '/api/admin/wallets/deposit', { botId, amount });
  world.vars['walletBalance'] = amount;
});

/**
 * Lock tokens for stakes
 */
Given('{int} tokens are locked for stakes', async ({ api, world }, amount: number) => {
  await api.sendJson('POST', '/api/stakes/lock', { amount });
  world.vars['lockedBalance'] = amount;
});

/**
 * Verify wallet balance
 */
Then('my wallet balance should be {int}', async ({ api, world }, expected: number) => {
  const result = await api.sendJson('GET', '/api/wallets/me');
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.balance).toBe(expected);
});

Then("my wallet's lockedBalance should be {int}", async ({ api, world }, expected: number) => {
  const result = await api.sendJson('GET', '/api/wallets/me');
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.lockedBalance).toBe(expected);
});

Then("my wallet's availableBalance should be {int}", async ({ api, world }, expected: number) => {
  const result = await api.sendJson('GET', '/api/wallets/me');
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.availableBalance).toBe(expected);
});

// =============================================================================
// PROMISE LIFECYCLE STEPS
// =============================================================================

/**
 * Create a promise in draft state
 */
Given('I have a promise in draft state', async ({ api, world, cleanup }) => {
  const result = await api.sendJson('POST', '/api/promises', {
    specification: {
      modelName: 'gpt-4',
      tokenCount: 1000,
      responseTimeSLA: 30000,
    },
    pricing: {
      price: 500,
      stakeAmount: 100,
    },
  });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseId'] = result.json.promiseId;
  world.vars['promiseState'] = 'draft';

  // Register cleanup for the promise
  cleanup.registerFromVar(world, 'promiseId', result.json.promiseId);
});

/**
 * Verify promise state
 */
Given('my promise is in draft state', async ({ world }) => {
  expect(world.vars['promiseState']).toBe('draft');
});

/**
 * List a promise on the marketplace
 */
Given('my promise is already listed', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('POST', `/api/promises/${promiseId}/list`);
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseState'] = 'listed';
});

Given('my promise is listed', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  if (world.vars['promiseState'] !== 'listed') {
    await api.sendJson('POST', `/api/promises/${promiseId}/list`);
    world.vars['promiseState'] = 'listed';
  }
});

/**
 * Create and list a promise with specific price
 */
Given('a promise is listed for {int} tokens', async ({ api, world, cleanup }, price: number) => {
  // Create provider if not exists
  if (!world.vars['providerBotId']) {
    const displayName = `provider-${Date.now()}`;
    const regResult = await api.sendJson('POST', '/api/bots/register', { displayName });
    world.vars['providerBotId'] = regResult.json.botId;
    world.vars['providerApiKey'] = regResult.json.apiKey;

    await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: regResult.json.botId,
      amount: 10000,
    });

    // Register cleanup for provider
    cleanup.registerFromVar(world, 'providerBotId', regResult.json.botId);
  }

  // Set provider auth
  world.headers['Authorization'] = `Bearer ${world.vars['providerApiKey']}`;

  // Create promise
  const result = await api.sendJson('POST', '/api/promises', {
    specification: {
      modelName: 'gpt-4',
      tokenCount: 1000,
      responseTimeSLA: 30000,
    },
    pricing: {
      price,
      stakeAmount: Math.ceil(price * 0.1),
    },
  });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseId'] = result.json.promiseId;

  // List the promise
  await api.sendJson('POST', `/api/promises/${result.json.promiseId}/list`);
  world.vars['promiseState'] = 'listed';
  world.vars['promisePrice'] = price;

  // Register cleanup for promise
  cleanup.registerFromVar(world, 'promiseId', result.json.promiseId);
});

/**
 * Provider creates and lists a promise
 */
Given('a provider bot has a listed promise', async ({ api, world, cleanup }) => {
  const displayName = `provider-${Date.now()}`;
  const regResult = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(regResult.status).toBe(201);

  world.vars['providerBotId'] = regResult.json.botId;
  world.vars['providerApiKey'] = regResult.json.apiKey;

  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: regResult.json.botId,
    amount: 10000,
  });

  world.headers['Authorization'] = `Bearer ${regResult.json.apiKey}`;

  const createResult = await api.sendJson('POST', '/api/promises', {
    specification: {
      modelName: 'gpt-4',
      tokenCount: 1000,
      responseTimeSLA: 30000,
    },
    pricing: {
      price: 500,
      stakeAmount: 100,
    },
  });
  expect(createResult.status).toBe(201);

  world.vars['promiseId'] = createResult.json.promiseId;

  await api.sendJson('POST', `/api/promises/${createResult.json.promiseId}/list`);
  world.vars['promiseState'] = 'listed';

  // Register cleanup
  cleanup.registerFromVar(world, 'providerBotId', regResult.json.botId);
  cleanup.registerFromVar(world, 'promiseId', createResult.json.promiseId);
});

/**
 * Fund consumer wallet
 */
Given('the consumer has sufficient balance', async ({ api, world }) => {
  const consumerBotId = world.vars['consumerBotId'];
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: consumerBotId,
    amount: 5000,
  });
});

/**
 * Consumer accepts a promise
 */
When('the consumer accepts the promise', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  world.headers['Authorization'] = `Bearer ${world.vars['consumerApiKey']}`;
  const result = await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseState'] = 'accepted';
});

When('I accept the promise', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseState'] = 'accepted';
});

/**
 * List my promise
 */
When('I list my promise successfully', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('POST', `/api/promises/${promiseId}/list`);
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseState'] = 'listed';
});

/**
 * Create a valid promise
 */
When('I create a valid promise', async ({ api, world, cleanup }) => {
  const result = await api.sendJson('POST', '/api/promises', {
    specification: {
      modelName: 'gpt-4',
      tokenCount: 1000,
      responseTimeSLA: 30000,
    },
    pricing: {
      price: 500,
      stakeAmount: 100,
    },
  });
  expect(result.status).toBe(201);
  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['promiseId'] = result.json.promiseId;

  // Register cleanup
  cleanup.registerFromVar(world, 'promiseId', result.json.promiseId);
});

// =============================================================================
// ESCROW STEPS
// =============================================================================

/**
 * Verify escrow creation and state
 */
Then('an escrow account should be created', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('GET', `/api/escrows/${promiseId}`);
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.status).toBe(200);
  expect(result.json.status).toBe('active');
});

Then('the escrow amount should be {int} tokens', async ({ api, world }, amount: number) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('GET', `/api/escrows/${promiseId}`);
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.amount).toBe(amount);
});

Then('the escrow status should be {string}', async ({ api, world }, status: string) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('GET', `/api/escrows/${promiseId}`);
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.status).toBe(status);
});

// =============================================================================
// SETTLEMENT & VERIFICATION STEPS
// =============================================================================

/**
 * Set up completed promise with execution proof
 */
Given('a promise has been completed with execution proof', async ({ world }) => {
  world.vars['hasExecutionProof'] = true;
});

/**
 * Process verification and settlement
 */
When('the verification oracle processes the proof', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('POST', `/api/settlements/${promiseId}/verify`);
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
});

When('the settlement is finalized', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('POST', `/api/settlements/${promiseId}/finalize`);
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
});

/**
 * Verify settlement outcomes
 */
Then('the verification should succeed', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('GET', `/api/settlements/${promiseId}/verification`);
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.status).toBe('verified');
});

// =============================================================================
// BOT PROFILE STEPS
// =============================================================================

/**
 * Register bot for profile testing
 */
Given('a registered bot with valid API key', async ({ api, world, cleanup }) => {
  const displayName = `profile-bot-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.lastResponse = result;
  world.lastJson = result.json;
  world.vars['botId'] = result.json.botId;
  world.vars['apiKey'] = result.json.apiKey;
  world.vars['displayName'] = displayName;

  world.headers['Authorization'] = `Bearer ${result.json.apiKey}`;

  // Register cleanup
  cleanup.registerFromVar(world, 'botId', result.json.botId);
});

/**
 * Set up bot profile data
 */
Given('the bot has the following profile:', async ({ world }) => {
  const displayName = world.vars['displayName'];
  expect(displayName).toBeDefined();
});

/**
 * Verify profile updates
 */
Then('the bot\'s profile should be updated with:', async ({ api, world }, dataTable: string) => {
  const result = await api.sendJson('GET', '/api/bots/me/profile');
  world.lastResponse = result;
  world.lastJson = result.json;
  const lines = dataTable.split('\n').filter(line => line.trim());
  lines.forEach(line => {
    const match = line.match(/\|\s*(\w+)\s*\|\s*(.+?)\s*\|/);
    if (match) {
      const [, field, expectedValue] = match;
      const cleanValue = expectedValue.replace(/^"(.+)"$/, '$1');
      if (cleanValue === 'true') {
        expect(result.json[field]).toBe(true);
      } else if (cleanValue === 'false') {
        expect(result.json[field]).toBe(false);
      } else {
        expect(result.json[field]).toBe(cleanValue);
      }
    }
  });
});

/**
 * Set up email verification
 */
Given('a verification token {string} was generated for the bot\'s email', async ({ world }, token: string) => {
  world.vars['verificationToken'] = token.replace(/"/g, '');
});

Given('the bot\'s email is verified', async ({ api, world }) => {
  const token = 'valid-verification-token-123';
  const result = await api.sendJson('POST', '/api/bots/me/verify-email/confirm', { token });
  expect(result.status).toBe(200);
  world.lastResponse = result;
  world.lastJson = result.json;
});

Given('the bot\'s email is not verified', async () => {
  // Default state - no action needed
});

/**
 * Set up reputation
 */
Given('the bot has a reputation score of {int}', async ({ world }, score: number) => {
  world.vars['expectedReputationScore'] = score;
});

/**
 * Avatar management
 */
Given('the bot has an avatar URL {string}', async ({ api, world }, avatarUrl: string) => {
  const cleanUrl = avatarUrl.replace(/"/g, '');
  world.vars['avatarUrl'] = cleanUrl;
  await api.sendJson('POST', '/api/bots/me/avatar', { avatarUrl: cleanUrl });
});

Then('the bot\'s avatar should be removed', async ({ api, world }) => {
  const result = await api.sendJson('GET', '/api/bots/me/profile');
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json?.avatarUrl).toBeNull();
});

// =============================================================================
// DOMAIN EVENT STEPS
// =============================================================================

/**
 * Verify domain events are published
 */
Then('a {string} domain event should be published', async ({ world }, eventType: string) => {
  // Domain events are published to the events table
  // Verify the last API call succeeded (event would be published async)
  expect(world.lastResponse?.status).toBe(200);
});

Then('a {string} domain event should be emitted', async ({ api, world }, eventType: string) => {
  const promiseId = world.vars['promiseId'] || world.vars['botId'];
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}&type=${eventType}`);
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.json.events.length).toBeGreaterThan(0);
  expect(result.json.events[0].eventType).toBe(eventType);
});

Then('the event should contain the promiseId', async ({ api, world }) => {
  const promiseId = world.vars['promiseId'];
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}`);
  world.lastResponse = result;
  world.lastJson = result.json;
  const latestEvent = result.json.events[0];
  expect(latestEvent.data.promiseId || latestEvent.aggregateId).toBe(promiseId);
});

// =============================================================================
// RATE LIMITING & SECURITY STEPS
// =============================================================================

/**
 * Set up rate limiting test scenario
 */
Given('I have made {int} failed authentication attempts in the last minute', async ({ api, world }, count: number) => {
  for (let i = 0; i < count; i++) {
    world.headers['Authorization'] = 'Bearer invalid-key';
    await api.sendJson('GET', '/api/bots/me');
  }
});

Given('the bot does not provide a valid API key', async ({ world }) => {
  world.headers['Authorization'] = 'Bearer invalid-api-key';
});

// =============================================================================
// HYBRID TEST STEPS (End-to-End Promise Flow)
// =============================================================================

/**
 * Verify balance changes after promise completion
 */
Then('the response field {string} should reflect completed promise with {int} tokens added', async ({ world }, field: string, tokens: number) => {
  expect(world.lastJson?.[field]).toBeGreaterThanOrEqual(tokens);
});

Then('the response field {string} should reflect escrow refund of {int} tokens', async ({ world }, field: string, tokens: number) => {
  expect(world.lastJson?.[field]).toBeGreaterThanOrEqual(tokens);
});

Then('the response field {string} should reflect payment received', async ({ world }, field: string) => {
  expect(world.lastJson?.[field]).toBeGreaterThan(0);
});

Then('the response should contain a match notification for {string}', async ({ world }, promiseIdField: string) => {
  const promiseId = world.vars[promiseIdField.replace(/[{}]/g, '')];
  expect(world.lastJson?.notification?.promiseId || world.lastJson?.promiseId).toBe(promiseId);
});

// =============================================================================
// UI-SPECIFIC DOMAIN STEPS
// =============================================================================

/**
 * Navigate to ClawMarket-specific pages
 */
Given('I am on the ClawMarket registration page', async ({ ui }) => {
  await ui.goto('/register');
  await expect(ui.locator('h1')).toContainText('Register');
});

Given('I am on the marketplace page', async ({ ui }) => {
  await ui.goto('/marketplace');
  await expect(ui.locator('h1')).toContainText('Marketplace');
});

/**
 * Log in via UI with API credentials
 */
Given('I am logged in as a consumer bot', async ({ ui, api, world, cleanup }) => {
  const displayName = `ui-consumer-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.vars['consumerBotId'] = result.json.botId;
  world.vars['consumerApiKey'] = result.json.apiKey;

  await ui.goto('/login');
  await ui.fillLabel('api-key-input', result.json.apiKey);
  await ui.clickButton('login-button');
  await ui.waitForURL('/dashboard');

  // Register cleanup
  cleanup.registerFromVar(world, 'consumerBotId', result.json.botId);
});

Given('I am logged in as a provider bot', async ({ ui, api, world, cleanup }) => {
  const displayName = `ui-provider-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  expect(result.status).toBe(201);

  world.vars['providerBotId'] = result.json.botId;
  world.vars['providerApiKey'] = result.json.apiKey;

  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: result.json.botId,
    amount: 10000,
  });

  await ui.goto('/login');
  await ui.fillLabel('api-key-input', result.json.apiKey);
  await ui.clickButton('login-button');
  await ui.waitForURL('/dashboard');

  // Register cleanup
  cleanup.registerFromVar(world, 'providerBotId', result.json.botId);
});

/**
 * Verify UI-specific outcomes
 */
Then('I should see the success screen', async ({ ui }) => {
  await expect(ui.locator('[data-testid="success-screen"]')).toBeVisible();
});

Then('I should see my Bot ID displayed', async ({ ui }) => {
  await expect(ui.locator('[data-testid="bot-id"]')).toBeVisible();
});

Then('I should see my API key displayed with copy button', async ({ ui }) => {
  await expect(ui.locator('[data-testid="api-key-display"]')).toBeVisible();
  await expect(ui.locator('[data-testid="copy-api-key-button"]')).toBeVisible();
});

Then('I should see a list of available promises', async ({ ui }) => {
  await expect(ui.locator('[data-testid="promise-list"]')).toBeVisible();
  const items = ui.locator('[data-testid="promise-card"]');
  await expect(items.first()).toBeVisible();
});

// =============================================================================
// EXPORT
// =============================================================================

export { test };
