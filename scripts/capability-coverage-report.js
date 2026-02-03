#!/usr/bin/env node
/**
 * Capability Coverage Report
 * Generates report showing test coverage by capability
 *
 * Usage:
 *   ./scripts/capability-coverage-report.js
 *   ./scripts/capability-coverage-report.js --format=json
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const FEATURES_DIR = path.join(process.cwd(), 'stack-tests/features');
const CAPABILITIES_DIR = path.join(process.cwd(), 'docs/capabilities');

// Parse arguments
const args = process.argv.slice(2);
const format = args.includes('--format=json') ? 'json' : 'human';

// All known capabilities
const ALL_CAPABILITIES = [
  { id: 'CAP-001', name: 'Authentication', status: 'stable' },
  { id: 'CAP-002', name: 'Audit Logging', status: 'stable' },
  { id: 'CAP-003', name: 'Real-time Notifications', status: 'planned' },
  { id: 'CAP-004', name: 'Rate Limiting', status: 'stable' },
  { id: 'CAP-005', name: 'Escrow Management', status: 'stable' },
  { id: 'CAP-006', name: 'Reputation Calculation', status: 'stable' },
  { id: 'CAP-007', name: 'Oracle Verification', status: 'planned' }
];

/**
 * Extract tags from feature file
 */
function extractTags(content) {
  const tags = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('@')) {
      const lineTags = trimmed.split(/\s+/);
      for (const tag of lineTags) {
        if (tag.startsWith('@')) {
          tags.push(tag);
        }
      }
    }
  }

  return tags;
}

/**
 * Count scenarios in feature file
 */
function countScenarios(content) {
  const matches = content.match(/Scenario:/g);
  return matches ? matches.length : 0;
}

/**
 * Generate coverage report
 */
function generateReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCapabilities: ALL_CAPABILITIES.length,
      coveredCapabilities: 0,
      coveragePercent: 0
    },
    capabilities: {}
  };

  // Initialize capability tracking
  for (const cap of ALL_CAPABILITIES) {
    report.capabilities[cap.id] = {
      name: cap.name,
      status: cap.status,
      scenarioCount: 0,
      featureFiles: [],
      covered: false
    };
  }

  // Scan feature files
  const featureFiles = glob.sync(path.join(FEATURES_DIR, '**/*.feature'));

  for (const file of featureFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const tags = extractTags(content);
    const scenarioCount = countScenarios(content);
    const relativePath = path.relative(FEATURES_DIR, file);

    const capTags = tags.filter(tag => tag.match(/^@CAP-\d+$/));

    for (const tag of capTags) {
      const capId = tag.substring(1);
      if (report.capabilities[capId]) {
        report.capabilities[capId].scenarioCount += scenarioCount;
        report.capabilities[capId].featureFiles.push(relativePath);
        report.capabilities[capId].covered = true;
      }
    }
  }

  // Calculate summary
  const coveredCount = Object.values(report.capabilities)
    .filter(cap => cap.covered).length;
  report.summary.coveredCapabilities = coveredCount;
  report.summary.coveragePercent = Math.round(
    (coveredCount / report.summary.totalCapabilities) * 100
  );

  return report;
}

/**
 * Output in human-readable format
 */
function outputHuman(report) {
  console.log('📊 Capability Coverage Report');
  console.log('═══════════════════════════════════════════\n');

  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Coverage: ${report.summary.coveredCapabilities}/${report.summary.totalCapabilities} capabilities (${report.summary.coveragePercent}%)\n`);

  console.log('Capability Coverage:');
  console.log('───────────────────────────────────────────\n');

  for (const [capId, capData] of Object.entries(report.capabilities)) {
    const status = capData.covered ? '✅' : '❌';
    const scenarios = capData.scenarioCount > 0
      ? `${capData.scenarioCount} scenarios`
      : 'No test coverage';

    console.log(`${status} ${capId}: ${capData.name}`);
    console.log(`   Status: ${capData.status}`);
    console.log(`   Tests: ${scenarios}`);

    if (capData.featureFiles.length > 0) {
      console.log(`   Features: ${capData.featureFiles.length} files`);
    }
    console.log('');
  }

  // Uncovered capabilities
  const uncovered = Object.entries(report.capabilities)
    .filter(([_, cap]) => !cap.covered)
    .map(([id, _]) => id);

  if (uncovered.length > 0) {
    console.log('❌ Uncovered Capabilities:');
    console.log('───────────────────────────────────────────');
    for (const capId of uncovered) {
      const cap = report.capabilities[capId];
      console.log(`  ${capId}: ${cap.name} (${cap.status})`);
    }
    console.log('');
  }
}

/**
 * Main
 */
function main() {
  const report = generateReport();

  if (format === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    outputHuman(report);
  }

  // Exit with error if coverage < 100%
  if (report.summary.coveragePercent < 100) {
    process.exit(1);
  }

  process.exit(0);
}

main();
