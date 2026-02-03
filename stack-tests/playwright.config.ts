import { defineConfig } from '@playwright/test';
import { defineBddProject, cucumberReporter } from 'playwright-bdd';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localEnvPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const apiBdd = defineBddProject({
  name: 'api',
  features: 'features/api/**/*.feature',
  steps: 'features/steps/**/*.ts',
  tags: '@api',
});

const uiBdd = defineBddProject({
  name: 'ui',
  features: 'features/ui/**/*.feature',
  steps: 'features/steps/**/*.ts',
  tags: '@ui',
});

const hybridBdd = defineBddProject({
  name: 'hybrid',
  features: 'features/hybrid/**/*.feature',
  steps: 'features/steps/**/*.ts',
  tags: '@hybrid',
});

// TUI project (optional - uncomment when TUI testing is configured)
// const tuiBdd = defineBddProject({
//   name: 'tui',
//   features: 'features/tui/**/*.feature',
//   steps: 'features/steps/**/*.ts',
//   tags: '@tui',
// });

export default defineConfig({
  reporter: [
    cucumberReporter('html', { outputFile: 'cucumber-report/index.html' }),
    cucumberReporter('json', { outputFile: 'cucumber-report/report.json' }),
  ],
  // Add tuiBdd to this array when TUI testing is enabled
  projects: [apiBdd, uiBdd, hybridBdd /* , tuiBdd */],
  use: {
    baseURL: process.env.BASE_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
    headless: process.env.HEADLESS === 'false' ? false : true,
  },
});
