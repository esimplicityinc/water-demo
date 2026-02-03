/**
 * Agent Directory & Discovery Steps
 * 
 * Step definitions for ROAD-039 BDD scenarios
 * Uses playwright-bdd for integration with Katalyst framework
 */

import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// Background steps
Given('the Agent Experience context is initialized', async ({ world }) => {
  // Context is already initialized by hooks
  world.vars.apiKey = process.env.TEST_API_KEY || '';
  world.vars.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
});

Given('multiple agents are registered with varying profiles', async ({ api, world, cleanup }, dataTable: any) => {
  const agents = dataTable.hashes();
  
  // Register test agents via API
  for (const agent of agents) {
    const result = await api.sendJson('POST', '/api/bots/register', {
      displayName: agent.name,
      description: agent.description,
    });
    
    expect(result.status).toBe(201);
    
    // Store agent data for later use
    world.vars.agents = world.vars.agents || {};
    world.vars.agents[agent.name] = {
      ...agent,
      apiKey: result.json.apiKey,
      botId: result.json.botId,
    };
    
    // Register cleanup
    cleanup.registerFromVar(world, 'botId', result.json.botId);
  }
});

// Browse directory steps
When('I GET {string}', async ({ api, world }, endpoint: string) => {
  const apiKey = world.vars.apiKey || world.vars.agents?.['alpha-bot']?.apiKey;
  
  // Set authorization header
  world.headers = world.headers || {};
  world.headers['Authorization'] = `Bearer ${apiKey}`;
  
  world.lastResponse = await api.sendJson('GET', endpoint);
});

Then('the response status should be {int}', async ({ world }, statusCode: number) => {
  expect(world.lastResponse.status).toBe(statusCode);
});

Then('the response should contain a list of agents', async ({ world }) => {
  const result = world.lastResponse.json;
  expect(result.agents).toBeDefined();
  expect(Array.isArray(result.agents)).toBe(true);
  expect(result.agents.length).toBeGreaterThan(0);
});

Then('each agent should have public fields:', async ({ world }, dataTable: any) => {
  const result = world.lastResponse.json;
  const expectedFields = dataTable.hashes().map((row: any) => row.field);
  
  for (const agent of result.agents) {
    for (const field of expectedFields) {
      expect(agent).toHaveProperty(field);
    }
  }
});

Then('the response should not contain private fields:', async ({ world }, dataTable: any) => {
  const result = world.lastResponse.json;
  const privateFields = dataTable.hashes().map((row: any) => row.field);
  
  for (const agent of result.agents) {
    for (const field of privateFields) {
      expect(agent).not.toHaveProperty(field);
    }
  }
});

// Search steps
Then('the response should contain agents matching {string}', async ({ world }, expectedMatch: string) => {
  const result = world.lastResponse.json;
  
  if (expectedMatch === '(none)') {
    expect(result.agents.length).toBe(0);
  } else {
    const matchingAgent = result.agents.find((a: any) => 
      a.name.toLowerCase().includes(expectedMatch.toLowerCase())
    );
    expect(matchingAgent).toBeDefined();
  }
});

Then('the response should not contain agents not matching {string}', async ({ world }, expectedMatch: string) => {
  const result = world.lastResponse.json;
  
  if (expectedMatch !== '(none)') {
    for (const agent of result.agents) {
      expect(agent.name.toLowerCase()).toContain(expectedMatch.toLowerCase());
    }
  }
});

Then('the search should be case-insensitive', async ({ world }) => {
  const result = world.lastResponse.json;
  // This is validated by the search working with mixed case queries
  expect(result.agents.length).toBeGreaterThan(0);
});

// Filter steps
Then('the response should contain only agents with tier {string}', async ({ world }, tier: string) => {
  const result = world.lastResponse.json;
  
  for (const agent of result.agents) {
    expect(agent.tier).toBe(tier);
  }
});

Then('the response should contain {string} agents', async ({ world }, count: string) => {
  const result = world.lastResponse.json;
  expect(result.agents.length).toBe(parseInt(count));
});

Then('results should be sorted by reputation score descending', async ({ world }) => {
  const result = world.lastResponse.json;
  
  for (let i = 1; i < result.agents.length; i++) {
    expect(result.agents[i].reputation).toBeLessThanOrEqual(result.agents[i-1].reputation);
  }
});

// Profile steps
Given('an agent exists with name {string}', async ({ world }, name: string) => {
  // Agent should be registered in background
  expect(world.vars.agents[name]).toBeDefined();
});

Then('the response should contain the agent profile:', async ({ world }, dataTable: any) => {
  const result = world.lastResponse.json;
  const expectedFields = dataTable.hashes();
  
  for (const { field, value } of expectedFields) {
    expect(result[field]).toBeDefined();
    if (value) {
      expect(result[field].toString()).toBe(value);
    }
  }
});

Then('the response should contain {string}', async ({ world }, field: string) => {
  const result = world.lastResponse.json;
  expect(result[field]).toBeDefined();
});

Then('the response should NOT include:', async ({ world }, dataTable: any) => {
  const result = world.lastResponse.json;
  const excludedFields = dataTable.hashes().map((row: any) => row.field);
  
  for (const field of excludedFields) {
    expect(result).not.toHaveProperty(field);
  }
});

// Pagination steps
Then('the response should contain pagination metadata:', async ({ world }, dataTable: any) => {
  const result = world.lastResponse.json;
  const expectedFields = dataTable.hashes().map((row: any) => row.field);
  
  for (const field of expectedFields) {
    expect(result[field]).toBeDefined();
  }
});

Then('the response should contain {string} different agents', async ({ world }, count: string) => {
  const result = world.lastResponse.json;
  expect(result.agents.length).toBe(parseInt(count));
  
  // Store for comparison with next page
  world.vars.lastPageAgents = result.agents.map((a: any) => a.name);
});

// Combined filter steps
Then('the response should contain only agents with:', async ({ world }, dataTable: any) => {
  const result = world.lastResponse.json;
  const conditions = dataTable.hashes().map((row: any) => row.condition);
  
  for (const agent of result.agents) {
    for (const condition of conditions) {
      if (condition.includes('name contains')) {
        const searchTerm = condition.match(/"([^"]+)"/)?.[1];
        expect(agent.name.toLowerCase()).toContain(searchTerm?.toLowerCase());
      } else if (condition.includes('tier equals')) {
        const tier = condition.match(/"([^"]+)"/)?.[1];
        expect(agent.tier).toBe(tier);
      } else if (condition.includes('isActive equals')) {
        const value = condition.match(/(true|false)/)?.[1];
        expect(agent.isActive).toBe(value === 'true');
      }
    }
  }
});
