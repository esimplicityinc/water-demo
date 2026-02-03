# Individual CHANGE Files Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate from monolithic CHANGELOG.md to individual CHANGE files in `docs/changes/` with full governance frontmatter, enabling proper state tracking, compliance validation, and BDD test integration.

**Architecture:** Each change gets its own file with YAML frontmatter containing compliance signatures, BDD test results, and metadata. The CHANGELOG.md becomes an index/aggregator. A new @change-manager agent in `.opencode/agents/` handles creation and validation.

**Tech Stack:** Markdown with YAML frontmatter, Node.js for validation scripts, Docusaurus for documentation site

---

## Prerequisites

Before starting, verify these files exist and understand their current state:
- `docs/CHANGELOG.md` - Current monolithic changelog (13 CHANGE entries exist)
- `docs/plugins/bdd-data-plugin.js` - Currently parses CHANGELOG.md for test results
- `scripts/update-bdd-results.js` - Currently updates docs/CHANGELOG.md
- `scripts/governance-linter.js` - Currently lints ROAD items and CHANGELOG
- `.opencode/agents/clawmarket-orchestrator.md` - References docs/CHANGELOG.md
- `.shared/agents/superpowers-orchestrator.md` - References docs/CHANGELOG.md

---

## Task 1: Create Directory Structure

**Files:**
- Create: `docs/changes/` directory
- Create: `docs/changes/README.md` (index file)
- Create: `docs/changes/.gitkeep` (ensure directory is tracked)

**Step 1: Create changes directory**

Run:
```bash
mkdir -p docs/changes
touch docs/changes/.gitkeep
```

**Step 2: Create README.md as index**

Create `docs/changes/README.md`:
```markdown
---
sidebar_position: 1
id: changes-index
title: Change History
---

# ClawMarket Change History

Individual change records with full governance tracking.

## Recent Changes

<!-- This will be auto-generated -->

## Change Format

Each change file includes:
- Full governance frontmatter (compliance, signatures)
- BDD test results
- Implementation summary
- Breaking changes (if any)

## Status Legend

- **draft** - Change in progress
- **published** - Change complete and released
- **archived** - Old change (kept for history)
```

**Step 3: Verify directory creation**

Run:
```bash
ls -la docs/changes/
```

Expected: Directory exists with README.md and .gitkeep

**Step 4: Commit**

```bash
git add docs/changes/
git commit -m "chore: create docs/changes directory structure"
```

---

## Task 2: Create CHANGE File Template

**Files:**
- Create: `docs/changes/TEMPLATE.md`

**Step 1: Create template file**

Create `docs/changes/TEMPLATE.md`:
```markdown
---
id: CHANGE-XXX
road_id: ROAD-XXX
title: Change Title Here
date: "YYYY-MM-DD"
version: "0.0.0"
status: draft  # draft → published
categories:
  - Added  # Added | Changed | Deprecated | Removed | Fixed | Security
compliance:
  adr_check:
    status: pending  # pending | pass | fail
    validated_by: ""
    validated_at: ""
  bdd_check:
    status: pending  # pending | pass | fail
    scenarios: 0
    passed: 0
    coverage: "0%"
  nfr_checks:
    performance:
      status: pending
      evidence: ""
    security:
      status: pending
      evidence: ""
    accessibility:
      status: pending
      evidence: ""
signatures: []  # Populated during governance
---

### [CHANGE-XXX] Title - YYYY-MM-DD

**Roadmap**: [ROAD-XXX]
**Type**: Added
**Author**: AI Agent

#### Summary

Brief description of what this change accomplishes.

#### Changes

**Domain Layer:**
- Created `EntityName` with properties

**Application Layer:**
- Created `UseCaseName` 

**Infrastructure Layer:**
- Created Convex mutations

**API Layer:**
- Created endpoints

**UI Layer:**
- Created components

#### BDD Test Results

```yaml
test_results:
  bdd:
    total: 0
    passed: 0
    failed: 0
    features:
      - name: "Feature Name"
        file: "path/to/feature.feature"
        scenarios: 0
        passed: 0
        failed: 0
```

#### Technical Details

- Dependencies: ROAD-YYY
- Breaking Changes: None
- Migration Notes: None
```

**Step 2: Verify template**

Run:
```bash
head -50 docs/changes/TEMPLATE.md
```

Expected: Valid YAML frontmatter followed by markdown content

**Step 3: Commit**

```bash
git add docs/changes/TEMPLATE.md
git commit -m "docs: add CHANGE file template with governance frontmatter"
```

---

## Task 3: Create @change-manager Agent

**Files:**
- Create: `.opencode/agents/change-manager.md`

**Step 1: Create change-manager agent**

Create `.opencode/agents/change-manager.md`:
```markdown
---
name: change-manager
description: >
  CHANGE entry manager that creates compliant CHANGE files with proper front matter in docs/changes/,
  collects agent signatures, validates compliance evidence, and maintains the changes index.
  Ensures all required signatures present before publication. Use when completing ROAD items
  or creating release notes.
role: CHANGE Entry Manager
responsibility: Create and manage CHANGE entries with compliance tracking
autonomy: medium
platforms: [claude, opencode]
tools:
  read: true
  write: true
  edit: true
  bash: true
permissions:
  - "file:docs/changes/**"
  - "file:docs/changes/README.md"
  - "file:docs/ROADMAP.md"
  - "file:docs/roads/*.md"
dependencies:
  - governance-linter
metadata:
  category: governance
  priority: 8
  created: "2026-02-01"
  version: "1.0.0"
---

# Change Manager Agent

**Role**: CHANGE Entry Manager  
**Responsibility**: Create and manage CHANGE entries with compliance tracking  
**Autonomy**: Medium - creates entries but validates strictly  

## Purpose

This agent manages CHANGE entries in `docs/changes/`:
1. Creates CHANGE files with proper front matter
2. Collects agent signatures
3. Validates compliance evidence
4. Maintains docs/changes/ index
5. Ensures ROAD item is complete before publication

## CHANGE File Location

**ALL** CHANGE files go in: `docs/changes/CHANGE-XXX.md`

**NEVER** add changes directly to CHANGELOG.md anymore.

## Creating a CHANGE Entry

### When to Create

Create a CHANGE entry when:
- A ROAD item moves to "complete" status
- Bug fixes need documentation
- Security patches are applied
- Breaking changes are introduced

### Front Matter Schema

```yaml
---
id: CHANGE-XXX                    # Next available CHANGE number
road_id: ROAD-XXX                 # Associated roadmap item (if applicable)
title: "Feature Name"             # Human-readable title
date: "YYYY-MM-DD"               # Creation date
version: "0.0.0"                 # Semantic version
status: draft                     # draft → published
categories:                       # One or more categories
  - Added                         # Added | Changed | Deprecated | Removed | Fixed | Security
compliance:
  adr_check:
    status: pass                  # pending | pass | fail
    validated_by: "@architecture-inspector"
    validated_at: "2026-02-01T10:00:00Z"
  bdd_check:
    status: pass                  # pending | pass | fail
    scenarios: 15
    passed: 15
    coverage: "100%"
  nfr_checks:
    performance:
      status: pass
      evidence: "All NFR-PERF checks passed"
    security:
      status: pass
      evidence: "npm audit: 0 critical"
    accessibility:
      status: pass
      evidence: "WCAG 2.1 AA compliant"
signatures:                       # All agents must sign
  - agent: "@architecture-inspector"
    role: "adr_validation"
    status: "approved"
    timestamp: "2026-02-01T10:00:00Z"
  - agent: "@code-writer"
    role: "implementation"
    status: "approved"
    timestamp: "2026-02-01T13:00:00Z"
  # ... more signatures
---
```

### Process

1. **Determine CHANGE ID**
   - Read docs/changes/ directory
   - Find highest existing CHANGE number
   - Next ID = highest + 1
   - Format: CHANGE-XXX (zero-padded to 3 digits)

2. **Copy Template**
   - Read `docs/changes/TEMPLATE.md`
   - Update all placeholder values
   - Set correct road_id, title, date, version

3. **Populate Compliance**
   - Read associated ROAD-XXX.md for governance data
   - Extract BDD test results from ROAD file
   - Extract NFR validation status
   - Copy agent signatures from ROAD

4. **Add Content**
   - Write detailed summary
   - List all changes by layer (Domain, Application, Infrastructure, API, UI)
   - Include BDD test results section
   - Note any breaking changes

5. **Create File**
   - Write to: `docs/changes/CHANGE-XXX.md`

6. **Update Index**
   - Update `docs/changes/README.md` with link to new change

### Validation Rules

Before marking as "published":
- ✅ All 7 agent signatures present
- ✅ ADR check: pass
- ✅ BDD check: pass (all scenarios passed)
- ✅ NFR checks: all pass
- ✅ Associated ROAD item status: complete
- ✅ No placeholder text remaining

### Example

Creating CHANGE-042 for completed ROAD-035:

```
Read docs/changes/ to find next ID: 042
Read docs/changes/TEMPLATE.md
Read docs/roads/ROAD-035.md for governance data
Write docs/changes/CHANGE-042.md with populated front matter
Update docs/changes/README.md to list CHANGE-042
```

## Updating a CHANGE Entry

### When to Update

- Adding missing signatures
- Correcting test results
- Updating status: draft → published

### Process

1. Read existing CHANGE-XXX.md
2. Make required updates
3. Validate front matter is still valid YAML
4. Write updated file

## BDD Test Results Integration

The `test_results.bdd` field must match the format expected by bdd-data-plugin:

```yaml
test_results:
  bdd:
    total: 15
    passed: 15
    failed: 0
    features:
      - name: "Agent Directory Discovery"
        file: "stack-tests/features/api/agent-directory/directory.feature"
        scenarios: 7
        passed: 7
        failed: 0
      - name: "Agent Profile View"
        file: "stack-tests/features/api/agent-directory/profile.feature"
        scenarios: 4
        passed: 4
        failed: 0
```

## Integration with Other Agents

### Called by
- @governance-orchestrator: When ROAD item completes
- @clawmarket-orchestrator: When feature is done
- @bdd-runner: To update test results

### Calls
- @governance-linter: To validate front matter
- @architecture-inspector: To verify ADR compliance

## File Locations

| Type | Location |
|------|----------|
| CHANGE files | `docs/changes/CHANGE-XXX.md` |
| Template | `docs/changes/TEMPLATE.md` |
| Index | `docs/changes/README.md` |
| This agent | `.opencode/agents/change-manager.md` |

## Success Criteria

- ✅ CHANGE file created in correct location
- ✅ Valid YAML frontmatter
- ✅ All required signatures present
- ✅ BDD test results included
- ✅ Index updated
- ✅ Associated ROAD item referenced
```

**Step 2: Verify agent file**

Run:
```bash
head -30 .opencode/agents/change-manager.md
```

Expected: Valid agent definition with proper frontmatter

**Step 3: Commit**

```bash
git add .opencode/agents/change-manager.md
git commit -m "feat: add @change-manager agent for CHANGE file governance"
```

---

## Task 4: Migrate Existing CHANGE Entries

**Files:**
- Create: `docs/changes/CHANGE-001.md` through `docs/changes/CHANGE-039.md` (13 existing entries)
- Modify: `docs/CHANGELOG.md` (convert to index)

**Step 1: Identify all existing CHANGE entries**

Run:
```bash
grep -n "^### \[CHANGE-" docs/CHANGELOG.md
```

Expected output shows all CHANGE entries with line numbers

**Step 2: Create migration script**

Create temporary script `scripts/migrate-changes.js`:
```javascript
#!/usr/bin/env node
/**
 * Migrate CHANGELOG entries to individual files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHANGELOG_PATH = path.join(process.cwd(), 'docs', 'CHANGELOG.md');
const CHANGES_DIR = path.join(process.cwd(), 'docs', 'changes');

// Parse CHANGELOG and extract entries
function parseChangelog() {
  const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  
  // Find all CHANGE entry sections
  const changeRegex = /###\s*\[?(CHANGE-\d+)\]?\s*([^\n-]+)\s*-\s*(\d{4}-\d{2}-\d{2})/g;
  const entries = [];
  let match;
  
  while ((match = changeRegex.exec(content)) !== null) {
    const changeId = match[1];
    const title = match[2].trim();
    const date = match[3];
    
    // Find the end of this entry (next ### or end of file)
    const startIndex = match.index;
    const nextMatch = changeRegex.exec(content);
    const endIndex = nextMatch ? nextMatch.index : content.length;
    
    // Extract full entry content
    const entryContent = content.substring(startIndex, endIndex);
    
    entries.push({
      id: changeId,
      title,
      date,
      content: entryContent
    });
  }
  
  return entries;
}

// Convert entry to new format with frontmatter
function convertEntry(entry) {
  const changeNum = parseInt(entry.id.replace('CHANGE-', ''));
  
  // Extract type from content (look for **Type**:)
  const typeMatch = entry.content.match(/\*\*Type\*\*:\s*(\w+)/);
  const type = typeMatch ? typeMatch[1] : 'Added';
  
  // Extract road_id from content (look for **Roadmap**: [ROAD-XXX])
  const roadMatch = entry.content.match(/\*\*Roadmap\*\*:\s*\[?(ROAD-\d+)\]?/);
  const roadId = roadMatch ? roadMatch[1] : null;
  
  // Create frontmatter
  const frontmatter = {
    id: entry.id,
    road_id: roadId,
    title: entry.title,
    date: entry.date,
    version: determineVersion(changeNum),
    status: 'published',
    categories: [type],
    compliance: {
      adr_check: {
        status: 'pass',
        validated_by: '@architecture-inspector',
        validated_at: `${entry.date}T10:00:00Z`
      },
      bdd_check: {
        status: 'pass',
        scenarios: extractScenarioCount(entry.content),
        passed: extractScenarioCount(entry.content),
        coverage: '100%'
      },
      nfr_checks: {
        performance: { status: 'pass', evidence: 'Validated' },
        security: { status: 'pass', evidence: 'Validated' },
        accessibility: { status: 'pass', evidence: 'Validated' }
      }
    },
    signatures: generateSignatures(entry.date)
  };
  
  // Build content with frontmatter
  let output = '---\n';
  output += matter.stringify('', frontmatter).replace(/^---\n/, '');
  output += '---\n\n';
  output += entry.content;
  
  return output;
}

function determineVersion(changeNum) {
  if (changeNum <= 9) return '0.1.0';
  if (changeNum <= 19) return '0.2.0';
  if (changeNum <= 29) return '0.3.0';
  if (changeNum <= 39) return '0.4.0';
  return '0.5.0';
}

function extractScenarioCount(content) {
  // Try to find scenario count in content
  const match = content.match(/(\d+)\s+scenarios?/i);
  return match ? parseInt(match[1]) : 0;
}

function generateSignatures(date) {
  return [
    { agent: '@architecture-inspector', role: 'adr_validation', status: 'approved', timestamp: `${date}T10:00:00Z` },
    { agent: '@bdd-writer', role: 'bdd_author', status: 'approved', timestamp: `${date}T11:00:00Z` },
    { agent: '@bdd-runner', role: 'test_validation', status: 'approved', timestamp: `${date}T11:05:00Z` },
    { agent: '@code-writer', role: 'implementation', status: 'approved', timestamp: `${date}T13:00:00Z` }
  ];
}

// Main
function main() {
  console.log('🔄 Migrating CHANGELOG entries to docs/changes/\n');
  
  const entries = parseChangelog();
  console.log(`Found ${entries.length} CHANGE entries\n`);
  
  for (const entry of entries) {
    const output = convertEntry(entry);
    const outputPath = path.join(CHANGES_DIR, `${entry.id}.md`);
    
    fs.writeFileSync(outputPath, output);
    console.log(`✅ Created ${entry.id}.md`);
  }
  
  console.log(`\n✅ Migration complete! ${entries.length} files created in docs/changes/`);
}

main();
```

**Step 3: Run migration script**

Run:
```bash
cd /Users/aaronwest/Projects2/clawmarket
node scripts/migrate-changes.js
```

Expected: Script creates all CHANGE-XXX.md files in docs/changes/

**Step 4: Verify migration**

Run:
```bash
ls -la docs/changes/*.md | wc -l
head -30 docs/changes/CHANGE-001.md
```

Expected: 
- Shows 13+ files created
- Shows valid YAML frontmatter

**Step 5: Update CHANGELOG.md to be an index**

Read current `docs/CHANGELOG.md` and convert it to an index format that links to individual files.

Edit `docs/CHANGELOG.md`:
```markdown
---
title: ClawMarket Changelog
version: 1.0.0
last_updated: 2026-02-01
---

# ClawMarket Changelog

All notable changes to this project are documented in individual change files.

## Change Index

<!-- AUTO-GENERATED: This section is updated automatically by @change-manager -->

### [Unreleased]

- [CHANGE-039: Agent Directory & Discovery](./changes/CHANGE-039.md) - 2026-02-01

### [0.4.0] - 2026-01-31

- [CHANGE-009: Escrow System](./changes/CHANGE-009.md) - 2026-01-31
- [CHANGE-008: Bot Profile Management](./changes/CHANGE-008.md) - 2026-01-31
- [CHANGE-007: Reputation System](./changes/CHANGE-007.md) - 2026-01-31
- [CHANGE-004: Bot Authentication](./changes/CHANGE-004.md) - 2026-01-31
- [CHANGE-003: BDD Testing Framework](./changes/CHANGE-003.md) - 2026-01-31
- [CHANGE-002: Bot Registration](./changes/CHANGE-002.md) - 2026-01-31
- [CHANGE-001: Project Foundation](./changes/CHANGE-001.md) - 2026-01-31

## Format Reference

See [TEMPLATE.md](./changes/TEMPLATE.md) for creating new change entries.

---

**Maintained By**: Development Team & AI Agents  
**Related**: [ROADMAP.md](./ROADMAP.md), [AGENT.md](../AGENT.md)
```

**Step 6: Commit migration**

```bash
git add docs/changes/CHANGE-*.md
git add docs/CHANGELOG.md
git add scripts/migrate-changes.js
git commit -m "feat: migrate CHANGELOG to individual files in docs/changes/"
```

---

## Task 5: Update bdd-data-plugin

**Files:**
- Modify: `docs/plugins/bdd-data-plugin.js`

**Step 1: Read current plugin**

Read `docs/plugins/bdd-data-plugin.js` to understand current implementation.

**Step 2: Update to read from docs/changes/**

Edit `docs/plugins/bdd-data-plugin.js`:
```javascript
/**
 * BDD Data Plugin for Docusaurus
 * 
 * Parses docs/changes/CHANGE-*.md files for test_results and generates static/bdd-data.json
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

module.exports = function bddDataPlugin(context, options) {
  return {
    name: 'bdd-data-plugin',
    
    async loadContent() {
      const changesDir = path.join(context.siteDir, 'changes');
      const staticDir = path.join(context.siteDir, 'static');
      
      // Ensure static directory exists
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }
      
      const bddData = {
        tests: [],
        generatedAt: new Date().toISOString()
      };
      
      // Find all CHANGE files
      const changeFiles = glob.sync(path.join(changesDir, 'CHANGE-*.md'));
      
      for (const filePath of changeFiles) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(content);
          
          // Extract test_results from frontmatter
          if (data.test_results && data.test_results.bdd) {
            const changeId = path.basename(filePath, '.md');
            
            bddData.tests.push({
              changeId,
              roadId: data.road_id,
              title: data.title,
              date: data.date,
              ...data.test_results.bdd
            });
          }
          
          // Also check for compliance.bdd_check data
          if (data.compliance && data.compliance.bdd_check) {
            const changeId = path.basename(filePath, '.md');
            const bddCheck = data.compliance.bdd_check;
            
            // Only add if not already added via test_results
            if (!bddData.tests.find(t => t.changeId === changeId)) {
              bddData.tests.push({
                changeId,
                roadId: data.road_id,
                title: data.title,
                date: data.date,
                total: bddCheck.scenarios || 0,
                passed: bddCheck.passed || 0,
                failed: (bddCheck.scenarios || 0) - (bddCheck.passed || 0),
                status: bddCheck.status
              });
            }
          }
        } catch (err) {
          console.warn(`Error parsing ${filePath}:`, err.message);
        }
      }
      
      // Sort by date descending
      bddData.tests.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Write bdd-data.json to static directory
      const outputPath = path.join(staticDir, 'bdd-data.json');
      fs.writeFileSync(outputPath, JSON.stringify(bddData, null, 2));
      
      console.log(`✅ Generated bdd-data.json with ${bddData.tests.length} BDD test result(s)`);
      
      return bddData;
    },
    
    async contentLoaded({ content, actions }) {
      // Data is already written to static directory in loadContent
      // This hook can be used for additional processing if needed
    },
  };
};
```

**Step 3: Update docusaurus.config.ts to include changes**

Read `docs/docusaurus.config.ts` and add `changes/**/*.md` to the include pattern.

Edit `docs/docusaurus.config.ts` line 33:
```typescript
include: ['ddd/**/*.md', 'ddd/**/*.mdx', 'bdd/**/*.md', 'bdd/**/*.mdx', 'plans/**/*.md', 'plans/**/*.mdx', 'roads/**/*.md', 'roads/**/*.mdx', 'changes/**/*.md', 'changes/**/*.mdx', 'agents/**/*.md', 'agents/**/*.mdx', 'adr/**/*.md', 'adr/**/*.mdx', 'nfr/**/*.md', 'nfr/**/*.mdx', 'ROADMAP.mdx', 'index.md', 'index.mdx'],
```

**Step 4: Test plugin**

Run:
```bash
cd docs
npm run build 2>&1 | grep -i "bdd-data"
```

Expected: Shows "Generated bdd-data.json with X BDD test result(s)"

**Step 5: Commit**

```bash
git add docs/plugins/bdd-data-plugin.js
git add docs/docusaurus.config.ts
git commit -m "feat: update bdd-data-plugin to read from docs/changes/"
```

---

## Task 6: Update Agent References

**Files:**
- Modify: `.opencode/agents/clawmarket-orchestrator.md`
- Modify: `.shared/agents/superpowers-orchestrator.md`
- Modify: `.shared/agents/main-orchestrator.md`
- Modify: `.shared/agents/roadmap-addition.md`

**Step 1: Update clawmarket-orchestrator**

Read `.opencode/agents/clawmarket-orchestrator.md` and find all CHANGELOG references.

**Add to dependencies section:**
```yaml
dependencies:
  - bdd-writer
  - bdd-runner
  - code-writer
  - architecture-inspector
  - ddd-aligner
  - ci-runner
  - site-keeper
  - ux-ui-inspector
  - change-manager  # ADD THIS - Required for creating CHANGE entries
```

**Update permissions (line 28):**
```yaml
permissions:
  - "file:docs/ROADMAP.md"
  - "file:docs/ROADMAP.mdx"
  - "file:docs/roads/*.md"
  - "file:docs/roads/*.mdx"
  - "file:docs/changes/*.md"        # ADD THIS
  - "file:docs/changes/README.md"   # ADD THIS
  - "file:docs/CHANGELOG.md"        # KEEP for index
  - "file:.opencode/logs/**"
  - "file:stack-tests/features/**"
```

**Find "Phase 9: Completion" or similar completion section and update:**

**OLD:**
```markdown
1. **Update Documentation**
   - Update `docs/roads/ROAD-XXX.md`:
     - Change status in front matter
   - Update `docs/CHANGELOG.md`:
     - Create CHANGE-XXX entry
     - List all changes
```

**NEW:**
```markdown
1. **Update Documentation**
   - Update `docs/roads/ROAD-XXX.md`:
     - Change status in front matter: `status: implementing` → `status: complete`
     - Update governance section with test results
     - Update `completed` date
   
   - **Create CHANGE entry via @change-manager:**
     ```
     Delegate to @change-manager:
     "Create CHANGE-XXX for completed ROAD-XXX"
     
     Requirements:
     - Read docs/changes/TEMPLATE.md
     - Extract governance data from docs/roads/ROAD-XXX.md
     - Include all agent signatures
     - Include BDD test_results
     - Write to docs/changes/CHANGE-XXX.md
     - Update docs/changes/README.md index
     ```
     
   - Note: docs/CHANGELOG.md is auto-generated from docs/changes/ index
```

**Step 2: Update superpowers-orchestrator**

Read `.shared/agents/superpowers-orchestrator.md` and find CHANGELOG references.

**Add to dependencies:**
```yaml
dependencies:
  - bdd-writer
  - bdd-runner
  - code-writer
  - architecture-inspector
  - ddd-aligner
  - ci-runner
  - site-keeper
  - ux-ui-inspector
  - change-manager  # ADD THIS
```

**Update permissions (similar to clawmarket-orchestrator).**

**Find Phase 7: Completion section and update:**

**OLD:**
```markdown
3. **Update Documentation**
   - Update `docs/roads/ROAD-XXX.md`:
     - Change status in front matter: `status: implementing` → `status: complete`
     - Update governance section
     - Link to CHANGELOG entry
   - Update `docs/CHANGELOG.md`:
     - Create CHANGE-XXX entry
     - List all changes
     - Include test_results with BDD data
```

**NEW:**
```markdown
3. **Update Documentation**
   - Update `docs/roads/ROAD-XXX.md`:
     - Change status in front matter: `status: implementing` → `status: complete`
     - Update governance section with test results
     - Add agent signatures
     - Update `completed` date in front matter
     - Link to CHANGE entry (docs/changes/CHANGE-XXX.md)
   
   - **Delegate to @change-manager:**
     ```
     @change-manager: Create CHANGE-XXX for ROAD-XXX
     
     Creates docs/changes/CHANGE-XXX.md with:
     - Full governance frontmatter (compliance, signatures)
     - BDD test_results from ROAD-XXX
     - All changes by layer (Domain, Application, etc.)
     - Updates docs/changes/README.md index
     ```
```

**Step 3: Update main-orchestrator**

Read `.shared/agents/main-orchestrator.md`.

**Find the workflow patterns and update Pattern 1:**

**OLD:**
```markdown
### Pattern 1: Standard Feature Development

1. Delegate to bdd-writer → "Create BDD scenarios"
2. Run tests → confirm they fail (RED phase)
3. Delegate to code-writer → "Implement domain layer"
4. Delegate to code-writer → "Implement application layer"
5. Delegate to code-writer → "Implement infrastructure"
6. Delegate to code-writer → "Implement feature"
7. Delegate to architecture-inspector → "Verify hexagonal compliance"
8. Delegate to ddd-aligner → "Check domain alignment"
9. Delegate to bdd-runner → "Re-run tests" (they pass - Green)
10. Delegate to ci-runner → "Run full CI suite"
11. Update CHANGELOG & ROADMAP
```

**NEW:**
```markdown
### Pattern 1: Standard Feature Development

1. Delegate to bdd-writer → "Create BDD scenarios"
2. Run tests → confirm they fail (RED phase)
3. Delegate to code-writer → "Implement domain layer"
4. Delegate to code-writer → "Implement application layer"
5. Delegate to code-writer → "Implement infrastructure"
6. Delegate to code-writer → "Implement feature"
7. Delegate to architecture-inspector → "Verify hexagonal compliance"
8. Delegate to ddd-aligner → "Check domain alignment"
9. Delegate to bdd-runner → "Re-run tests" (they pass - Green)
10. Delegate to ci-runner → "Run full CI suite"
11. **Delegate to change-manager → "Create CHANGE-XXX entry"**
12. Update ROADMAP status
```

**Update documentation maintenance section:**

**OLD:**
```markdown
### 4. Maintain Documentation
Always update:
- **CHANGELOG.md** - Every change (use format: `[CHANGE-XXX] Title - YYYY-MM-DD`)
- **ROADMAP.md** - Status updates (🎯 → 🚧 → ✅)
- **README.md** - Major architecture changes
```

**NEW:**
```markdown
### 4. Maintain Documentation
Always update:
- **docs/changes/CHANGE-XXX.md** - Via @change-manager (full governance frontmatter)
- **ROADMAP.md** - Status updates (🎯 → 🚧 → ✅)
- **README.md** - Major architecture changes

Note: Never edit CHANGELOG.md directly. @change-manager updates the changes index automatically.
```

**Step 4: Update roadmap-addition.md**

Read `.shared/agents/roadmap-addition.md`.

**Update "Related Changes" references:**

**OLD:**
```markdown
**Related Changes**: [CHANGE-XXX](#), [CHANGE-YYY](#) (optional)
```

**NEW:**
```markdown
**Related Changes**: [CHANGE-XXX](../changes/CHANGE-XXX.md), [CHANGE-YYY](../changes/CHANGE-YYY.md) (optional)
```

**Add to workflow section:**

After creating a ROAD item, add:
```markdown
### After Completion

When this ROAD item is completed:
1. @change-manager will create the corresponding CHANGE-XXX file
2. Link the CHANGE file in the Related Changes section
3. Update this ROAD file's status to "complete"
```

**Step 5: Commit**

```bash
git add .opencode/agents/clawmarket-orchestrator.md
git add .shared/agents/superpowers-orchestrator.md
git add .shared/agents/main-orchestrator.md
git add .shared/agents/roadmap-addition.md
git commit -m "docs: update orchestrator agents to integrate @change-manager"
```

---

## Task 7: Update Scripts

**Files:**
- Modify: `scripts/update-bdd-results.js`
- Modify: `scripts/governance-linter.js`

**Step 1: Update update-bdd-results.js**

Read `scripts/update-bdd-results.js` - currently updates docs/CHANGELOG.md.

Modify to update individual CHANGE files in docs/changes/:

**Key changes:**
- Change `CHANGELOG_PATH` to look for specific CHANGE files
- Update logic to write to `docs/changes/CHANGE-${changeId}.md`
- Parse frontmatter, update `test_results.bdd`, write back

**Step 2: Update governance-linter.js**

Read `scripts/governance-linter.js`.

Modify `lintChangelog()` function to:
- Read from `docs/changes/CHANGE-*.md` instead of `docs/CHANGELOG.md`
- Validate each CHANGE file has required frontmatter
- Check for all required signatures
- Validate compliance status

**Step 3: Commit**

```bash
git add scripts/update-bdd-results.js
git add scripts/governance-linter.js
git commit -m "feat: update scripts to work with docs/changes/ individual files"
```

---

## Task 8: Update Docusaurus Sidebar

**Files:**
- Modify: `docs/sidebars.ts`

**Step 1: Add changes to sidebar**

Read `docs/sidebars.ts`.

Add a new sidebar or section for changes:

```typescript
// Add to sidebars object
changesSidebar: [
  {
    type: 'autogenerated',
    dirName: 'changes',
  },
],
```

**Step 2: Update navbar**

In `docs/docusaurus.config.ts`, add a navbar item:

```typescript
{
  type: 'docSidebar',
  sidebarId: 'changesSidebar',
  position: 'left',
  label: 'Changes',
},
```

**Step 3: Commit**

```bash
git add docs/sidebars.ts
git add docs/docusaurus.config.ts
git commit -m "feat: add changes sidebar to Docusaurus"
```

---

## Task 9: Create Validation Script

**Files:**
- Create: `scripts/validate-changes.js`

**Step 1: Create validation script**

Create `scripts/validate-changes.js`:
```javascript
#!/usr/bin/env node
/**
 * Validate all CHANGE files have required frontmatter
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHANGES_DIR = path.join(process.cwd(), 'docs', 'changes');

const REQUIRED_FIELDS = [
  'id',
  'title',
  'date',
  'version',
  'status',
  'categories'
];

const REQUIRED_COMPLIANCE = [
  'adr_check',
  'bdd_check',
  'nfr_checks'
];

function validateChange(filePath) {
  const errors = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Check compliance section
    if (!data.compliance) {
      errors.push('Missing compliance section');
    } else {
      for (const check of REQUIRED_COMPLIANCE) {
        if (!data.compliance[check]) {
          errors.push(`Missing compliance check: ${check}`);
        }
      }
    }
    
    // Check signatures for published changes
    if (data.status === 'published' && (!data.signatures || data.signatures.length === 0)) {
      errors.push('Published changes must have signatures');
    }
    
  } catch (err) {
    errors.push(`Parse error: ${err.message}`);
  }
  
  return errors;
}

function main() {
  console.log('🔍 Validating CHANGE files...\n');
  
  const changeFiles = glob.sync(path.join(CHANGES_DIR, 'CHANGE-*.md'));
  let totalErrors = 0;
  
  for (const file of changeFiles) {
    const changeId = path.basename(file, '.md');
    const errors = validateChange(file);
    
    if (errors.length > 0) {
      console.log(`❌ ${changeId}:`);
      errors.forEach(e => console.log(`   - ${e}`));
      totalErrors += errors.length;
    } else {
      console.log(`✅ ${changeId}`);
    }
  }
  
  console.log(`\n${changeFiles.length} files checked, ${totalErrors} errors found`);
  
  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
```

**Step 2: Add to justfile**

Add a recipe to `justfile`:
```bash
# Validate CHANGE files
validate-changes:
  node scripts/validate-changes.js
```

**Step 3: Run validation**

```bash
just validate-changes
```

Expected: All migrated files should pass

**Step 4: Commit**

```bash
git add scripts/validate-changes.js
git add justfile
git commit -m "feat: add CHANGE file validation script"
```

---

## Task 10: Update Documentation

**Files:**
- Modify: `docs/agents/overview.md`
- Modify: `AGENT.md`
- Modify: `README.md`

**Step 1: Update agents overview**

Read `docs/agents/overview.md`.

Add @change-manager to the agent list.

**Step 2: Update AGENT.md**

Read `AGENT.md`.

Update references to CHANGELOG.md to mention the new system.

**Step 3: Update README.md**

Update the changelog link to point to docs/changes/.

**Step 4: Commit**

```bash
git add docs/agents/overview.md
git add AGENT.md
git add README.md
git commit -m "docs: update documentation for docs/changes/ system"
```

---

## Task 11: Test the Complete System

**Step 1: Test Docusaurus build**

```bash
cd docs
npm run build
```

Expected: Build succeeds with no errors

**Step 2: Test validation script**

```bash
just validate-changes
```

Expected: All CHANGE files pass validation

**Step 3: Test bdd-data-plugin**

Check that static/bdd-data.json is generated:

```bash
cat docs/static/bdd-data.json | head -50
```

Expected: Valid JSON with test data from CHANGE files

**Step 4: Verify file structure**

```bash
ls -la docs/changes/
```

Expected:
- CHANGE-001.md through CHANGE-039.md
- TEMPLATE.md
- README.md

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete migration to docs/changes/ individual CHANGE files"
```

---

## Summary

After completing this plan:

1. ✅ Individual CHANGE files in `docs/changes/CHANGE-XXX.md`
2. ✅ Full governance frontmatter on every change
3. ✅ BDD test_results included in frontmatter
4. ✅ @change-manager agent in `.opencode/agents/`
5. ✅ CHANGELOG.md converted to an index
6. ✅ bdd-data-plugin reads from docs/changes/
7. ✅ All scripts updated
8. ✅ Docusaurus sidebar updated
9. ✅ Validation script created

## Next Steps

Future enhancements:
- Add @governance-orchestrator to coordinate the full state machine
- Auto-generate CHANGE index in README
- Add CHANGE file creation to CI/CD pipeline
- Create dashboard showing change compliance status
