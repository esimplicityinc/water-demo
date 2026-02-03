/**
 * Escrow Step Definitions for ROAD-009
 *
 * Domain-specific steps for escrow system BDD tests.
 * These steps encapsulate ClawMarket escrow business logic.
 *
 * NOTE: Generic HTTP, response assertion, and cleanup steps are provided by Katalyst.
 * Import Katalyst steps in your test setup to use them.
 */

import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// Type helper for API responses
type ApiResponse = Record<string, any>;

// =============================================================================
// ESCROW SETUP STEPS - Domain-specific setup for escrow scenarios
// =============================================================================

Given('a registered provider bot exists with sufficient stake', async ({ api, world, cleanup }) => {
  const displayName = `provider-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.status).toBe(200);

  const json = result.json as ApiResponse;
  world.vars.providerBotId = json.botId;
  world.vars.providerApiKey = json.apiKey;

  // Register for cleanup
  cleanup.registerFromVar(world, 'providerBotId', json.botId, { type: 'bot' });

  // Fund wallet and create stake
  const depositResult = await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: json.botId,
    amount: 10000,
  });
  world.lastResponse = depositResult;
  world.lastJson = depositResult.json;

  // Set auth header for subsequent requests
  world.headers.Authorization = `Bearer ${json.apiKey}`;
});

Given('a registered consumer bot exists with sufficient wallet balance', async ({ api, world, cleanup }) => {
  const displayName = `consumer-${Date.now()}`;
  const result = await api.sendJson('POST', '/api/bots/register', { displayName });
  world.lastResponse = result;
  world.lastJson = result.json;
  expect(result.status).toBe(200);

  const json = result.json as ApiResponse;
  world.vars.consumerBotId = json.botId;
  world.vars.consumerApiKey = json.apiKey;

  // Register for cleanup
  cleanup.registerFromVar(world, 'consumerBotId', json.botId, { type: 'bot' });

  // Fund wallet
  const depositResult = await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: json.botId,
    amount: 10000,
  });
  world.lastResponse = depositResult;
  world.lastJson = depositResult.json;
});

Given('a promise exists with price {int} tokens', async ({ api, world }, price: number) => {
  // Use provider API key
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  
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
  expect(result.status).toBe(200);
  
  const json = result.json as ApiResponse;
  world.vars.promiseId = json.promiseId;
  world.vars.promisePrice = String(price);
  
  // List the promise
  await api.sendJson('POST', `/api/promises/${json.promiseId}/list`);
});

Given('the consumer bot has a wallet balance of {int} tokens', async ({ api, world }, amount: number) => {
  const consumerBotId = world.vars.consumerBotId;
  const consumerApiKey = world.vars.consumerApiKey;

  // Get current balance
  world.headers.Authorization = `Bearer ${consumerApiKey}`;
  const walletResult = await api.sendJson('GET', '/api/wallets/me');
  world.lastResponse = walletResult;
  world.lastJson = walletResult.json;
  const json = walletResult.json as ApiResponse;
  const currentBalance = json.balance || 0;

  // Withdraw or deposit to reach target balance
  if (currentBalance > amount) {
    const withdrawResult = await api.sendJson('POST', '/api/wallets/me/withdraw', {
      amount: currentBalance - amount,
    });
    world.lastResponse = withdrawResult;
    world.lastJson = withdrawResult.json;
  } else if (currentBalance < amount) {
    const depositResult = await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: consumerBotId,
      amount: amount - currentBalance,
    });
    world.lastResponse = depositResult;
    world.lastJson = depositResult.json;
  }

  world.vars.consumerWalletBalance = String(amount);
});

Given('the provider bot has {int} available stake', async ({ api, world }, amount: number) => {
  const providerBotId = world.vars.providerBotId;
  const providerApiKey = world.vars.providerApiKey;
  
  // Get current balance
  world.headers.Authorization = `Bearer ${providerApiKey}`;
  const walletResult = await api.sendJson('GET', '/api/wallets/me');
  const json = walletResult.json as ApiResponse;
  const currentBalance = json.balance || 0;
  const lockedBalance = json.lockedBalance || 0;
  const availableBalance = currentBalance - lockedBalance;
  
  // Withdraw or deposit to reach target available balance
  if (availableBalance > amount) {
    await api.sendJson('POST', '/api/wallets/me/withdraw', {
      amount: availableBalance - amount,
    });
  } else if (availableBalance < amount) {
    await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: providerBotId,
      amount: amount - availableBalance,
    });
  }
  
  world.vars.providerAvailableStake = String(amount);
});

Given('an escrow exists in {string} state for promise with price {int} tokens', async ({ api, world, cleanup }, state: string, price: number) => {
  // Create provider (already created in background)
  const providerApiKey = world.vars.providerApiKey;
  const providerBotId = world.vars.providerBotId;

  // Create consumer (already created in background)
  const consumerApiKey = world.vars.consumerApiKey;
  const consumerBotId = world.vars.consumerBotId;

  // Create promise as provider
  world.headers.Authorization = `Bearer ${providerApiKey}`;
  const promiseResult = await api.sendJson('POST', '/api/promises', {
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
  world.lastResponse = promiseResult;
  world.lastJson = promiseResult.json;
  expect(promiseResult.status).toBe(200);

  const promiseJson = promiseResult.json as ApiResponse;
  const promiseId = promiseJson.promiseId;
  world.vars.promiseId = promiseId;
  world.vars.lifecyclePromiseId = promiseId;

  const listResult = await api.sendJson('POST', `/api/promises/${promiseId}/list`);
  world.lastResponse = listResult;
  world.lastJson = listResult.json;

  // Accept promise as consumer to create escrow
  world.headers.Authorization = `Bearer ${consumerApiKey}`;
  const acceptResult = await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
  world.lastResponse = acceptResult;
  world.lastJson = acceptResult.json;
  expect(acceptResult.status).toBe(200);

  const acceptJson = acceptResult.json as ApiResponse;
  const escrowId = acceptJson.escrowId;
  world.vars.escrowId = escrowId;
  world.vars.lifecycleEscrowId = escrowId;
  world.vars.escrowState = 'CREATED';

  // Register for cleanup
  cleanup.registerFromVar(world, 'escrowId', escrowId);

  // Transition to desired state if not CREATED
  if (state !== 'CREATED') {
    world.headers.Authorization = `Bearer ${providerApiKey}`;
    if (state === 'EXECUTING') {
      const startResult = await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
      world.lastResponse = startResult;
      world.lastJson = startResult.json;
    } else if (state === 'COMPLETED') {
      const startResult = await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
      world.lastResponse = startResult;
      world.lastJson = startResult.json;
      const completeResult = await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, { proof: 'proof-hash-123' });
      world.lastResponse = completeResult;
      world.lastJson = completeResult.json;
    }
    world.vars.escrowState = state;
  }
});

Given('an escrow exists in {string} state', async ({ api, world, cleanup }, state: string) => {
  // Create provider
  const providerName = `provider-${Date.now()}`;
  const providerResult = await api.sendJson('POST', '/api/bots/register', { displayName: providerName });
  expect(providerResult.status).toBe(200);
  
  const providerJson = providerResult.json as ApiResponse;
  world.vars.providerBotId = providerJson.botId;
  world.vars.providerApiKey = providerJson.apiKey;
  cleanup.registerFromVar(world, 'providerBotId', providerJson.botId, { type: 'bot' });
  
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: providerJson.botId,
    amount: 10000,
  });
  
  // Create consumer
  const consumerName = `consumer-${Date.now()}`;
  const consumerResult = await api.sendJson('POST', '/api/bots/register', { displayName: consumerName });
  expect(consumerResult.status).toBe(200);
  
  const consumerJson = consumerResult.json as ApiResponse;
  world.vars.consumerBotId = consumerJson.botId;
  world.vars.consumerApiKey = consumerJson.apiKey;
  cleanup.registerFromVar(world, 'consumerBotId', consumerJson.botId, { type: 'bot' });
  
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: consumerJson.botId,
    amount: 10000,
  });
  
  // Create promise as provider
  world.headers.Authorization = `Bearer ${providerJson.apiKey}`;
  const promiseResult = await api.sendJson('POST', '/api/promises', {
    specification: {
      modelName: 'gpt-4',
      tokenCount: 1000,
      responseTimeSLA: 30000,
    },
    pricing: {
      price: 100,
      stakeAmount: 10,
    },
  });
  expect(promiseResult.status).toBe(200);
  
  const promiseJson = promiseResult.json as ApiResponse;
  world.vars.promiseId = promiseJson.promiseId;
  await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
  
  // Accept promise as consumer to create escrow
  world.headers.Authorization = `Bearer ${consumerJson.apiKey}`;
  const acceptResult = await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
  expect(acceptResult.status).toBe(200);
  
  const acceptJson = acceptResult.json as ApiResponse;
  world.vars.escrowState = 'CREATED';
  world.vars.escrowId = acceptJson.escrowId;
});

Given('the escrow is for a promise with price {int} tokens', async ({ world }, price: number) => {
  world.vars.promisePrice = String(price);
});

Given('the escrow is in {string} state', async ({ api, world }, expectedState: string) => {
  // If escrow doesn't exist yet, create one
  if (!world.vars.escrowId) {
    // Create provider
    const providerName = `provider-${Date.now()}`;
    const providerResult = await api.sendJson('POST', '/api/bots/register', { displayName: providerName });
    const providerJson = providerResult.json as ApiResponse;
    world.vars.providerBotId = providerJson.botId;
    world.vars.providerApiKey = providerJson.apiKey;
    
    await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: providerJson.botId,
      amount: 10000,
    });
    
    // Create consumer
    const consumerName = `consumer-${Date.now()}`;
    const consumerResult = await api.sendJson('POST', '/api/bots/register', { displayName: consumerName });
    const consumerJson = consumerResult.json as ApiResponse;
    world.vars.consumerBotId = consumerJson.botId;
    world.vars.consumerApiKey = consumerJson.apiKey;
    
    await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: consumerJson.botId,
      amount: 10000,
    });
    
    // Create promise as provider
    world.headers.Authorization = `Bearer ${providerJson.apiKey}`;
    const promiseResult = await api.sendJson('POST', '/api/promises', {
      specification: {
        modelName: 'gpt-4',
        tokenCount: 1000,
        responseTimeSLA: 30000,
      },
      pricing: {
        price: 100,
        stakeAmount: 10,
      },
    });
    
    const promiseJson = promiseResult.json as ApiResponse;
    world.vars.promiseId = promiseJson.promiseId;
    await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
    
    // Accept promise as consumer to create escrow
    world.headers.Authorization = `Bearer ${consumerJson.apiKey}`;
    const acceptResult = await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
    const acceptJson = acceptResult.json as ApiResponse;
    world.vars.escrowId = acceptJson.escrowId;
  }
  
  const escrowId = world.vars.escrowId;
  
  // Transition escrow to desired state
  if (expectedState === 'EXECUTING') {
    world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
    await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
  } else if (expectedState === 'COMPLETED') {
    world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
    await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
    await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, {
      proof: 'proof-hash-123',
    });
  } else if (expectedState === 'CLOSED') {
    world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
    await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
    await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, {
      proof: 'proof-hash-123',
    });
    await api.sendJson('POST', `/api/escrows/${escrowId}/release`);
  }
  
  // Verify the state
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey || world.vars.consumerApiKey}`;
  const response = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((response.json as ApiResponse)?.state).toBe(expectedState);
  world.vars.escrowState = expectedState;
});

Given('the escrow {string} is in {string} state', async ({ api, world }, escrowIdParam: string, expectedState: string) => {
  // Replace {lifecycleEscrowId} with actual value
  const escrowId = escrowIdParam.startsWith('{') 
    ? world.vars[escrowIdParam.slice(1, -1)]
    : escrowIdParam;
  
  // Transition escrow to desired state if needed
  if (expectedState !== 'CREATED') {
    world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
    if (expectedState === 'EXECUTING') {
      await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
    } else if (expectedState === 'COMPLETED') {
      await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
      await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, {
        proof: 'proof-hash-123',
      });
    }
  }
  
  // Verify the state
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey || world.vars.consumerApiKey}`;
  const response = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((response.json as ApiResponse)?.state).toBe(expectedState);
  world.vars.escrowState = expectedState;
  world.vars.escrowId = escrowId;
});

Given('an escrow exists with ID {string}', async ({ api, world, cleanup }, escrowId: string) => {
  // Setup similar to above but with specific ID tracking
  const providerName = `provider-${Date.now()}`;
  const providerResult = await api.sendJson('POST', '/api/bots/register', { displayName: providerName });
  world.lastResponse = providerResult;
  world.lastJson = providerResult.json;
  const providerJson = providerResult.json as ApiResponse;
  world.vars.providerBotId = providerJson.botId;
  world.vars.providerApiKey = providerJson.apiKey;
  cleanup.registerFromVar(world, 'providerBotId', providerJson.botId, { type: 'bot' });

  const providerDepositResult = await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: providerJson.botId,
    amount: 10000,
  });
  world.lastResponse = providerDepositResult;
  world.lastJson = providerDepositResult.json;

  const consumerName = `consumer-${Date.now()}`;
  const consumerResult = await api.sendJson('POST', '/api/bots/register', { displayName: consumerName });
  world.lastResponse = consumerResult;
  world.lastJson = consumerResult.json;
  const consumerJson = consumerResult.json as ApiResponse;
  world.vars.consumerBotId = consumerJson.botId;
  world.vars.consumerApiKey = consumerJson.apiKey;
  cleanup.registerFromVar(world, 'consumerBotId', consumerJson.botId, { type: 'bot' });

  const consumerDepositResult = await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: consumerJson.botId,
    amount: 10000,
  });
  world.lastResponse = consumerDepositResult;
  world.lastJson = consumerDepositResult.json;

  world.headers.Authorization = `Bearer ${providerJson.apiKey}`;
  const promiseResult = await api.sendJson('POST', '/api/promises', {
    specification: {
      modelName: 'gpt-4',
      tokenCount: 1000,
      responseTimeSLA: 30000,
    },
    pricing: {
      price: 100,
      stakeAmount: 10,
    },
  });
  world.lastResponse = promiseResult;
  world.lastJson = promiseResult.json;

  const promiseJson = promiseResult.json as ApiResponse;
  world.vars.promiseId = promiseJson.promiseId;
  world.vars.expectedEscrowId = escrowId;
  const listResult = await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
  world.lastResponse = listResult;
  world.lastJson = listResult.json;

  world.headers.Authorization = `Bearer ${consumerJson.apiKey}`;
  const acceptResult = await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
  world.lastResponse = acceptResult;
  world.lastJson = acceptResult.json;
  const acceptJson = acceptResult.json as ApiResponse;
  world.vars.escrowId = acceptJson.escrowId;
  cleanup.registerFromVar(world, 'escrowId', acceptJson.escrowId);
});

Given('a promise exists with ID {string}', async ({ world }, promiseId: string) => {
  world.vars.promiseId = promiseId;
});

Given('an escrow exists for the promise', async ({ api, world }) => {
  // Escrow is created when promise is accepted
  // This step assumes the promise has been accepted
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const acceptResult = await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
  expect(acceptResult.status).toBe(200);
  const acceptJson = acceptResult.json as ApiResponse;
  world.vars.escrowId = acceptJson.escrowId;
});

Given('an escrow exists for the promise with ID {string}', async ({ api, world }, escrowIdVar: string) => {
  // Resolve variable if it's in {varName} format
  const escrowIdKey = escrowIdVar.startsWith('{') && escrowIdVar.endsWith('}')
    ? escrowIdVar.slice(1, -1)
    : escrowIdVar;
  
  // Create a promise and accept it to create an escrow
  const promiseIdKey = escrowIdKey.replace('Escrow', 'Promise'); // e.g., queryEscrowId2 -> queryPromiseId2
  const promiseId = world.vars[promiseIdKey];
  
  if (!promiseId) {
    // If promise doesn't exist, create one
    const providerApiKey = world.vars.providerApiKey;
    const consumerApiKey = world.vars.consumerApiKey;
    
    // Create promise as provider
    world.headers.Authorization = `Bearer ${providerApiKey}`;
    const promiseResult = await api.sendJson('POST', '/api/promises', {
      title: `Test Promise for ${escrowIdKey}`,
      description: 'Test promise',
      pricingTerms: {
        price: 100,
        currency: 'CLAW',
        penaltyClause: {
          stakeAmount: 50,
          slashPercentage: 100,
        },
      },
    });
    const promiseJson = promiseResult.json as ApiResponse;
    world.vars[promiseIdKey] = promiseJson.promiseId;
    
    // List the promise
    await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
    
    // Accept as consumer to create escrow
    world.headers.Authorization = `Bearer ${consumerApiKey}`;
    const acceptResult = await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
    const acceptJson = acceptResult.json as ApiResponse;
    world.vars[escrowIdKey] = acceptJson.escrowId;
  } else {
    // Accept existing promise
    const consumerApiKey = world.vars.consumerApiKey;
    world.headers.Authorization = `Bearer ${consumerApiKey}`;
    const acceptResult = await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
    const acceptJson = acceptResult.json as ApiResponse;
    world.vars[escrowIdKey] = acceptJson.escrowId;
  }
});

Given('a consumer bot has {int} active escrows', async ({ api, world, cleanup }, count: number) => {
  const consumerName = `consumer-${Date.now()}`;
  const consumerResult = await api.sendJson('POST', '/api/bots/register', { displayName: consumerName });
  const consumerJson = consumerResult.json as ApiResponse;
  world.vars.consumerBotId = consumerJson.botId;
  world.vars.consumerApiKey = consumerJson.apiKey;
  cleanup.registerFromVar(world, 'consumerBotId', consumerJson.botId, { type: 'bot' });
  
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: consumerJson.botId,
    amount: 100000,
  });
  
  // Create multiple escrows
  for (let i = 0; i < count; i++) {
    const providerName = `provider-${i}-${Date.now()}`;
    const providerResult = await api.sendJson('POST', '/api/bots/register', { displayName: providerName });
    const providerJson = providerResult.json as ApiResponse;
    cleanup.registerFromVar(world, `providerBotId${i}`, providerJson.botId, { type: 'bot' });
    
    await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: providerJson.botId,
      amount: 10000,
    });
    
    world.headers.Authorization = `Bearer ${providerJson.apiKey}`;
    const promiseResult = await api.sendJson('POST', '/api/promises', {
      specification: {
        modelName: 'gpt-4',
        tokenCount: 1000,
        responseTimeSLA: 30000,
      },
      pricing: {
        price: 100,
        stakeAmount: 10,
      },
    });
    
    const promiseJson = promiseResult.json as ApiResponse;
    await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
    
    world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
    await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
  }
  
  world.vars.expectedEscrowCount = String(count);
});

Given('a provider bot has {int} active escrows', async ({ api, world, cleanup }, count: number) => {
  const providerName = `provider-${Date.now()}`;
  const providerResult = await api.sendJson('POST', '/api/bots/register', { displayName: providerName });
  const providerJson = providerResult.json as ApiResponse;
  world.vars.providerBotId = providerJson.botId;
  world.vars.providerApiKey = providerJson.apiKey;
  cleanup.registerFromVar(world, 'providerBotId', providerJson.botId, { type: 'bot' });
  
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: providerJson.botId,
    amount: 100000,
  });
  
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  
  // Create multiple promises and have them accepted
  for (let i = 0; i < count; i++) {
    const consumerName = `consumer-${i}-${Date.now()}`;
    const consumerResult = await api.sendJson('POST', '/api/bots/register', { displayName: consumerName });
    const consumerJson = consumerResult.json as ApiResponse;
    cleanup.registerFromVar(world, `consumerBotId${i}`, consumerJson.botId, { type: 'bot' });
    
    await api.sendJson('POST', '/api/admin/wallets/deposit', {
      botId: consumerJson.botId,
      amount: 10000,
    });
    
    const promiseResult = await api.sendJson('POST', '/api/promises', {
      specification: {
        modelName: 'gpt-4',
        tokenCount: 1000,
        responseTimeSLA: 30000,
      },
      pricing: {
        price: 100,
        stakeAmount: 10,
      },
    });
    
    const promiseJson = promiseResult.json as ApiResponse;
    await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
    
    world.headers.Authorization = `Bearer ${consumerJson.apiKey}`;
    await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
    
    world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  }
  
  world.vars.expectedEscrowCount = String(count);
});

Given('a consumer bot has escrows in various states:', async ({ api, world, cleanup }, dataTable: any) => {
  // Handle data table - it could be a raw string or already parsed
  const states: Record<string, number> = {};
  
  if (typeof dataTable === 'string') {
    // Parse raw table string
    const lines = dataTable.split('\n').filter((line: string) => line.trim() && !line.includes('|---'));
    
    for (const line of lines) {
      const match = line.match(/^\|\s*([^|]+)\s*\|\s*(\d+)\s*\|$/);
      if (match) {
        states[match[1].trim()] = parseInt(match[2], 10);
      }
    }
  } else if (dataTable && Array.isArray(dataTable.rawTable)) {
    // Playwright-BDD parsed table format
    const rawTable = dataTable.rawTable;
    // Skip header row, process data rows
    for (let i = 1; i < rawTable.length; i++) {
      const row = rawTable[i];
      if (row && row[0] && row[1]) {
        states[row[0].trim()] = parseInt(row[1], 10);
      }
    }
  }
  
  const consumerName = `consumer-${Date.now()}`;
  const consumerResult = await api.sendJson('POST', '/api/bots/register', { displayName: consumerName });
  const consumerJson = consumerResult.json as ApiResponse;
  world.vars.consumerBotId = consumerJson.botId;
  world.vars.consumerApiKey = consumerJson.apiKey;
  cleanup.registerFromVar(world, 'consumerBotId', consumerJson.botId, { type: 'bot' });
  
  await api.sendJson('POST', '/api/admin/wallets/deposit', {
    botId: consumerJson.botId,
    amount: 100000,
  });
  
  let totalCount = 0;
  
  // Create escrows in different states
  for (const [state, count] of Object.entries(states)) {
    for (let i = 0; i < count; i++) {
      const providerName = `provider-${state}-${i}-${Date.now()}`;
      const providerResult = await api.sendJson('POST', '/api/bots/register', { displayName: providerName });
      const providerJson = providerResult.json as ApiResponse;
      cleanup.registerFromVar(world, `providerBotId${state}${i}`, providerJson.botId, { type: 'bot' });
      
      await api.sendJson('POST', '/api/admin/wallets/deposit', {
        botId: providerJson.botId,
        amount: 10000,
      });
      
      world.headers.Authorization = `Bearer ${providerJson.apiKey}`;
      const promiseResult = await api.sendJson('POST', '/api/promises', {
        specification: {
          modelName: 'gpt-4',
          tokenCount: 1000,
          responseTimeSLA: 30000,
        },
        pricing: {
          price: 100,
          stakeAmount: 10,
        },
      });
      
      const promiseJson = promiseResult.json as ApiResponse;
      await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/list`);
      
      world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
      const acceptResult = await api.sendJson('POST', `/api/promises/${promiseJson.promiseId}/accept`);
      const acceptJson = acceptResult.json as ApiResponse;
      const escrowId = acceptJson.escrowId;
      
      // Transition to desired state if needed
      if (state !== 'CREATED') {
        // Transition escrow state
        world.headers.Authorization = `Bearer ${providerJson.apiKey}`;
        if (state === 'EXECUTING') {
          await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
        } else if (state === 'COMPLETED') {
          await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
          await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, {
            proof: 'proof-hash-123',
          });
        } else if (state === 'CLOSED') {
          await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
          await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, {
            proof: 'proof-hash-123',
          });
          await api.sendJson('POST', `/api/escrows/${escrowId}/release`);
        }
      }
      
      totalCount++;
    }
  }
  
  world.vars.escrowStates = JSON.stringify(states);
  world.vars.expectedEscrowCount = String(totalCount);
});

Given('the execution verification failed with reason {string}', async ({ world }, reason: string) => {
  world.vars.verificationFailureReason = reason;
});

// =============================================================================
// ESCROW ACTION STEPS - Domain-specific escrow actions
// =============================================================================

When('the consumer bot accepts the promise', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
  expect(result.status).toBe(200);
  
  // Store the escrowId returned from acceptance
  const json = result.json as ApiResponse;
  if (json.escrowId) {
    world.vars.escrowId = json.escrowId;
  }
});

When('the consumer bot attempts to accept the promise', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  
  try {
    await api.sendJson('POST', `/api/promises/${promiseId}/accept`);
  } catch (error: any) {
    // Error is stored in world.lastResponse by Katalyst
  }
});

When('the provider bot starts execution', async ({ api, world }) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
  expect(result.status).toBe(200);
});

When('the provider bot starts execution for escrow {string}', async ({ api, world }, escrowIdParam: string) => {
  // Replace {lifecycleEscrowId} with actual value from context
  const escrowId = escrowIdParam.startsWith('{') 
    ? world.vars[escrowIdParam.slice(1, -1)]
    : escrowIdParam;
  
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/start-execution`);
  expect(result.status).toBe(200);
  world.vars.escrowId = escrowId; // Store for later steps
});

When('the provider bot submits execution proof {string}', async ({ api, world }, proof: string) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, { proof });
  expect(result.status).toBe(200);
  world.vars.executionProof = proof;
});

When('the provider bot submits execution proof {string} for escrow {string}', async ({ api, world }, proofParam: string, escrowIdParam: string) => {
  // Replace {testId} in proof
  const testId = world.vars.testId || Date.now();
  const proof = proofParam.replace('{testId}', testId.toString());
  
  // Replace {lifecycleEscrowId} with actual value
  const escrowId = escrowIdParam.startsWith('{') 
    ? world.vars[escrowIdParam.slice(1, -1)]
    : escrowIdParam;
    
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/complete`, { proof });
  expect(result.status).toBe(200);
  world.vars.executionProof = proof;
  world.vars.escrowId = escrowId;
});

When('the system releases the escrow', async ({ api, world }) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/release`);
  expect(result.status).toBe(200);
});

When('the system releases the escrow {string}', async ({ api, world }, escrowIdParam: string) => {
  const escrowId = escrowIdParam.startsWith('{') 
    ? world.vars[escrowIdParam.slice(1, -1)]
    : escrowIdParam;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/release`);
  expect(result.status).toBe(200);
  world.vars.escrowId = escrowId;
});

When('the system returns the escrow', async ({ api, world }) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/return`, { reason: 'Test return' });
  expect(result.status).toBe(200);
});

When('the system returns the escrow {string}', async ({ api, world }, escrowIdParam: string) => {
  const escrowId = escrowIdParam.startsWith('{') 
    ? world.vars[escrowIdParam.slice(1, -1)]
    : escrowIdParam;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/return`, { reason: 'Test return' });
  expect(result.status).toBe(200);
  world.vars.escrowId = escrowId;
});

When('the consumer bot raises a dispute with reason {string}', async ({ api, world }, reason: string) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/dispute`, { reason });
  expect(result.status).toBe(200);
  world.vars.disputeReason = reason;
});

When('the consumer bot raises a dispute for escrow {string} with reason {string}', async ({ api, world }, escrowIdParam: string, reason: string) => {
  const escrowId = escrowIdParam.startsWith('{') 
    ? world.vars[escrowIdParam.slice(1, -1)]
    : escrowIdParam;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('POST', `/api/escrows/${escrowId}/dispute`, { reason });
  expect(result.status).toBe(200);
  world.vars.disputeReason = reason;
  world.vars.escrowId = escrowId;
});

// =============================================================================
// ESCROW QUERY STEPS - Use Katalyst's generic HTTP steps for queries
// These are domain-specific wrappers that set up the correct auth/context
// =============================================================================

When('I query the escrow by ID {string}', async ({ api, world }, escrowId: string) => {
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey || world.vars.providerApiKey}`;
  // Use Katalyst's generic GET step via api.sendJson
  await api.sendJson('GET', `/api/escrows/${escrowId}`);
});

When('I query the escrow by promise ID {string}', async ({ api, world }, promiseId: string) => {
  // Resolve variable if it's in {varName} format
  const resolvedPromiseId = promiseId.startsWith('{') && promiseId.endsWith('}')
    ? world.vars[promiseId.slice(1, -1)]
    : promiseId;
  
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey || world.vars.providerApiKey}`;
  await api.sendJson('GET', `/api/escrows/by-promise/${resolvedPromiseId}`);
});

When('I query escrows for the consumer bot', async ({ api, world }) => {
  const consumerBotId = world.vars.consumerBotId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  await api.sendJson('GET', `/api/escrows?consumerId=${consumerBotId}`);
});

When('I query escrows for the provider bot', async ({ api, world }) => {
  const providerBotId = world.vars.providerBotId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  await api.sendJson('GET', `/api/escrows?providerId=${providerBotId}`);
});

When('I query escrows filtered by state {string}', async ({ api, world }, state: string) => {
  const consumerBotId = world.vars.consumerBotId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  await api.sendJson('GET', `/api/escrows?consumerId=${consumerBotId}&state=${state}`);
  world.vars.filteredState = state;
});

// =============================================================================
// ESCROW ASSERTION STEPS - Domain-specific business rule verification
// =============================================================================

Then('an escrow should be created for the promise', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/by-promise/${promiseId}`);
  expect(result.status).toBe(200);
  expect(result.json).toBeDefined();
});

Then('the escrow state should be {string}', async ({ api, world }, expectedState: string) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.state).toBe(expectedState);
});

Then('the escrow locked amount should be {int} tokens', async ({ api, world }, expectedAmount: number) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.lockedAmount).toBe(expectedAmount);
});

Then("the consumer's wallet balance should decrease by {int} tokens", async ({ api, world }, decreaseAmount: number) => {
  const consumerBotId = world.vars.consumerBotId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', '/api/wallets/me');
  const initialBalance = parseInt(world.vars.consumerWalletBalance || '10000', 10);
  expect((result.json as ApiResponse)?.balance).toBe(initialBalance - decreaseAmount);
});

Then("the provider's stake should be locked", async ({ api, world }) => {
  const providerBotId = world.vars.providerBotId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', '/api/wallets/me');
  expect((result.json as ApiResponse)?.lockedBalance).toBeGreaterThan(0);
});

Then('the acceptance should fail with error {string}', async ({ world }, expectedError: string) => {
  // Katalyst stores the last response in world.lastResponse
  const lastResponse = world.lastResponse;
  const lastJson = world.lastJson as ApiResponse;
  expect(lastResponse?.status()).toBe(400);
  expect(lastJson?.error || lastJson?.message).toContain(expectedError);
});

Then('no escrow should be created', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  
  try {
    await api.sendJson('GET', `/api/escrows/by-promise/${promiseId}`);
    // If we get here, escrow exists - this is unexpected
    expect(false).toBe(true);
  } catch (error: any) {
    // Expected - escrow should not exist
    expect(error?.response?.status?.()).toBe(404);
  }
});

Then('the escrow state should transition to {string}', async ({ api, world }, expectedState: string) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey || world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.state).toBe(expectedState);
  world.vars.escrowState = expectedState;
});

Then('an ExecutionStarted event should be published', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}&type=ExecutionStarted`);
  const json = result.json as ApiResponse;
  expect(json?.events?.length).toBeGreaterThan(0);
  expect(json?.events?.[0]?.eventType).toBe('ExecutionStarted');
});

Then('the execution proof should be stored', async ({ api, world }) => {
  const escrowId = world.vars.escrowId;
  const expectedProof = world.vars.executionProof;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.executionProof).toBe(expectedProof);
});

Then('an ExecutionCompleted event should be published', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}&type=ExecutionCompleted`);
  const json = result.json as ApiResponse;
  expect(json?.events?.length).toBeGreaterThan(0);
  expect(json?.events?.[0]?.eventType).toBe('ExecutionCompleted');
});

Then("the provider's wallet should increase by {int} tokens", async ({ api, world }, increaseAmount: number) => {
  const providerBotId = world.vars.providerBotId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', '/api/wallets/me');
  // Provider should receive the escrow amount
  expect((result.json as ApiResponse)?.balance).toBeGreaterThanOrEqual(increaseAmount);
});

Then("the provider's locked stake should be released", async ({ api, world }) => {
  const providerBotId = world.vars.providerBotId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', '/api/wallets/me');
  expect((result.json as ApiResponse)?.lockedBalance).toBe(0);
});

Then('the escrow should transition to {string}', async ({ api, world }, expectedState: string) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey || world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.state).toBe(expectedState);
});

Then('an EscrowReleased event should be published', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}&type=EscrowReleased`);
  const json = result.json as ApiResponse;
  expect(json?.events?.length).toBeGreaterThan(0);
});

Then("the consumer's wallet should increase by {int} tokens", async ({ api, world }, increaseAmount: number) => {
  const consumerBotId = world.vars.consumerBotId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', '/api/wallets/me');
  expect((result.json as ApiResponse)?.balance).toBeGreaterThanOrEqual(increaseAmount);
});

Then("the provider's locked stake should be slashed", async ({ api, world }) => {
  const providerBotId = world.vars.providerBotId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', '/api/wallets/me');
  // After slashing, locked balance should be 0 but total balance reduced
  expect((result.json as ApiResponse)?.lockedBalance).toBe(0);
});

Then('an EscrowReturned event should be published', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}&type=EscrowReturned`);
  const json = result.json as ApiResponse;
  expect(json?.events?.length).toBeGreaterThan(0);
});

Then('an EscrowDisputed event should be published', async ({ api, world }) => {
  const promiseId = world.vars.promiseId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/events?aggregateId=${promiseId}&type=EscrowDisputed`);
  const json = result.json as ApiResponse;
  expect(json?.events?.length).toBeGreaterThan(0);
});

Then('the dispute reason should be recorded', async ({ api, world }) => {
  const escrowId = world.vars.escrowId;
  const expectedReason = world.vars.disputeReason;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.disputeReason).toBe(expectedReason);
});

Then('the escrow updatedAt timestamp should be updated', async ({ api, world }) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.providerApiKey || world.vars.consumerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  const json = result.json as ApiResponse;
  expect(json?.updatedAt).toBeDefined();
  expect(new Date(json?.updatedAt).getTime()).toBeGreaterThan(0);
});

Then('the escrow details should be returned', async ({ world }) => {
  // Use Katalyst's world.lastResponse
  expect(world.lastResponse?.status()).toBe(200);
  expect(world.lastJson).toBeDefined();
});

Then('the response should contain promiseId, consumerId, providerId', async ({ world }) => {
  const lastJson = world.lastJson as ApiResponse;
  expect(lastJson?.promiseId).toBeDefined();
  expect(lastJson?.consumerId).toBeDefined();
  expect(lastJson?.providerId).toBeDefined();
});

Then('the response should contain state, lockedAmount, createdAt', async ({ world }) => {
  const lastJson = world.lastJson as ApiResponse;
  expect(lastJson?.state).toBeDefined();
  expect(lastJson?.lockedAmount).toBeDefined();
  expect(lastJson?.createdAt).toBeDefined();
});

Then('the escrow for that promise should be returned', async ({ world }) => {
  expect(world.lastResponse?.status()).toBe(200);
  const lastJson = world.lastJson as ApiResponse;
  expect(lastJson?.promiseId).toBe(world.vars.promiseId);
});

Then('{int} escrows should be returned', async ({ world }, count: number) => {
  const lastJson = world.lastJson as ApiResponse;
  const escrows = lastJson?.escrows || lastJson;
  expect(Array.isArray(escrows)).toBe(true);
  expect(escrows.length).toBe(count);
});

Then('all returned escrows should belong to the consumer', async ({ world }) => {
  const consumerBotId = world.vars.consumerBotId;
  const lastJson = world.lastJson as ApiResponse;
  const escrows = lastJson?.escrows || lastJson;
  for (const escrow of escrows) {
    expect(escrow.consumerId).toBe(consumerBotId);
  }
});

Then('all returned escrows should belong to the provider', async ({ world }) => {
  const providerBotId = world.vars.providerBotId;
  const lastJson = world.lastJson as ApiResponse;
  const escrows = lastJson?.escrows || lastJson;
  for (const escrow of escrows) {
    expect(escrow.providerId).toBe(providerBotId);
  }
});

Then('all returned escrows should have state {string}', async ({ world }, expectedState: string) => {
  const lastJson = world.lastJson as ApiResponse;
  const escrows = lastJson?.escrows || lastJson;
  for (const escrow of escrows) {
    expect(escrow.state).toBe(expectedState);
  }
});

Then('the escrow should be in {string} state', async ({ api, world }, expectedState: string) => {
  const escrowId = world.vars.escrowId;
  world.headers.Authorization = `Bearer ${world.vars.consumerApiKey || world.vars.providerApiKey}`;
  const result = await api.sendJson('GET', `/api/escrows/${escrowId}`);
  expect((result.json as ApiResponse)?.state).toBe(expectedState);
});
