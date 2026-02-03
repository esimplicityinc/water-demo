/**
 * ClawMarket Step Definitions Registration
 *
 * Registers all step definitions for BDD tests including:
 * - ClawMarket domain-specific steps
 */

import { test } from './fixtures.js';

// Import ClawMarket custom steps (they self-register via the test import)
import './clawmarket-steps.js';
import './escrow-steps.js';
import './agent-directory-steps.js';

export { test };
