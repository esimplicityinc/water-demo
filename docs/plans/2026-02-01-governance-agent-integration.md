# Governance System Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the governance system (ADRs, NFRs, state machine) into the PrimaDemo multi-agent framework with strict enforcement and auto-escalation.

**Architecture:** Central @governance-orchestrator manages all governance state. Specialized agents (@governance-linter, @road-manager, @change-manager) handle specific governance tasks. Existing agents updated to check gates before proceeding.

**Key Features:**
- Auto-escalate when gates not met
- Small NFR violations auto-fixed
- Large violations create blocked ROAD items
- All state tracked in front matter
- Strict enforcement (exit 1 on violations)

---

## Overview

This plan integrates the governance system into the agent framework:

1. **New Governance Agents** (4 files)
2. **Updated Existing Agents** (8 files)
3. **New/Updated Skills** (3 skills)
4. **Integration Points** throughout the workflow

### State Machine with Governance

```
User Request
    ↓
@governance-orchestrator: Check current state
    ↓
IF status = proposed:
    @governance-linter: Validate front matter
    @architecture-inspector: Check ADR compliance
    @road-manager: Update to adr_validated
    ↓
IF status = adr_validated:
    @bdd-writer: Create scenarios (permission required)
    @bdd-runner: Validate
    @road-manager: Update to bdd_complete
    ↓
IF status = bdd_complete:
    @code-writer: Implement
    @architecture-inspector + @ddd-aligner: Review
    @road-manager: Update to implementing
    ↓
IF status = implementing:
    @ci-runner: Run NFR tests
    @performance-agent: Validate NFR-PERF-001
    @security-agent: Validate NFR-SEC-001
    @a11y-agent: Validate NFR-A11Y-001
    IF all pass:
        @road-manager: Update to complete
    ELSE IF small issue:
        Auto-fix and retry
    ELSE:
        Create blocked ROAD item
    ↓
@change-manager: Create CHANGE entry
    ↓
All 7 agents sign CHANGE
    ↓
Published
```

---

## Task 1: Create @governance-orchestrator Agent

**Files:**
- Create: `.shared/agents/governance-orchestrator.md`

**Purpose:** Central governance coordinator that manages all governance state and enforces gates.

**Agent Definition:**

```yaml
---
name: governance-orchestrator
description: >
  Central governance coordinator that manages the ROAD item lifecycle, enforces ADR/NFR compliance,
  validates state machine transitions, and coordinates all governance-related activities.
  Auto-escalates when gates are not met. Creates blocked items for large violations.
  Use to manage governance state, validate compliance, and coordinate governance gates.
role: Governance System Coordinator
responsibility: Manage ROAD/CHANGE lifecycle and enforce governance compliance
autonomy: high
platforms: [claude, opencode]
tools:
  read: true
  write: true
  edit: true
  bash: true
  skill: true
  task: true
permissions:
  - "file:docs/ROADMAP.md"
  - "file:docs/CHANGELOG.md"
  - "file:docs/adr/**"
  - "file:docs/nfr/**"
  - "file:docs/plans/*.md"
  - "file:scripts/governance-linter.js"
  - "just:governance-lint"
dependencies:
  - governance-linter
  - road-manager
  - change-manager
  - architecture-inspector
  - bdd-writer
  - bdd-runner
  - code-writer
  - ci-runner
metadata:
  category: governance
  priority: 9
  created: "2026-01-31"
  version: "1.0.0"
---
```

**Content:**

```markdown
# Governance Orchestrator Agent

**Role**: Governance System Coordinator  
**Responsibility**: Manage ROAD/CHANGE lifecycle and enforce governance compliance  
**Autonomy**: High - manages state and escalates when needed  

## Purpose

This agent is the central coordinator for all governance activities:
1. Validates current governance state
2. Manages ROAD item lifecycle transitions
3. Enforces ADR/NFR compliance gates
4. Auto-escalates when gates not met
5. Creates blocked items for large violations
6. Coordinates agent activities around governance

## Critical Rules

### 1. ALWAYS Validate Before Progress

Before any agent proceeds with work, this agent MUST:
```
1. Run @governance-linter to validate current state
2. Check if required gates are met
3. If gates NOT met → Escalate to fix gates first
4. If gates met → Allow agent to proceed
```

### 2. State Machine Enforcement

Valid transitions ONLY:
- `proposed` → `adr_validated` (requires ADR validation)
- `adr_validated` → `bdd_pending` (ready for BDD)
- `bdd_pending` → `bdd_complete` (requires BDD approval)
- `bdd_complete` → `implementing` (ready for code)
- `implementing` → `nfr_validating` (code complete)
- `nfr_validating` → `complete` (all NFRs pass)

### 3. Auto-Escalation

When gates not met:
```
IF current_status = proposed AND agent wants bdd:
    Escalate: "Need ADR validation first"
    Delegate to @architecture-inspector
    THEN proceed to bdd

IF current_status = adr_validated AND agent wants to implement:
    Escalate: "Need BDD approval first"
    Delegate to @bdd-writer + @bdd-runner
    THEN proceed to implementation
```

### 4. NFR Failure Handling

```
IF NFR tests fail:
    Analyze failure:
        
    IF small fix (config, typo, simple refactor):
        Auto-fix via @code-writer
        Re-run NFR tests
        
    IF large fix (architecture change, major refactor):
        Create new ROAD item:
            - Title: "Fix [NFR type] for [original ROAD]"
            - blocks: [original ROAD-XXX]
            - depends_on: [original ROAD-XXX]
            - Status: proposed
        Update original ROAD:
            - blocked_by: [new ROAD-XXX]
        Mark original as "nfr_blocked"
        Report to user
```

## Workflow Integration

### When Starting Any Work

```
User: "Implement ROAD-005"

@governance-orchestrator:
1. Read ROAD-005 front matter
2. Run @governance-linter ROAD-005
3. Check current status

IF status = "proposed":
    → Delegate to @architecture-inspector for ADR validation
    → After validation, update status to "adr_validated"
    → Continue

IF status = "adr_validated":
    → Check if BDD exists
    → If no BDD: Delegate to @bdd-writer (asks permission)
    → If BDD exists: Delegate to @bdd-runner
    → After BDD approval, update to "bdd_complete"
    → Continue

IF status = "bdd_complete":
    → Delegate to @code-writer for implementation
    → Update to "implementing"
    → Continue

IF status = "implementing":
    → Delegate to @ci-runner for NFR tests
    → If pass: Update to "complete"
    → If fail: Handle per NFR failure rules above
```

### Gate Enforcement

**Before @bdd-writer creates scenarios:**
```
@governance-orchestrator: Check ADR validation
IF NOT validated:
    Escalate to @architecture-inspector
    Block @bdd-writer until validation complete
```

**Before @code-writer implements:**
```
@governance-orchestrator: Check BDD approval
IF NOT approved:
    Escalate: "Need BDD scenarios first"
    Block @code-writer until BDD approved
```

**Before marking ROAD complete:**
```
@governance-orchestrator: Check NFR status
IF any NFR != "pass":
    Run NFR validation agents
    IF pass: Mark complete
    ELSE: Handle failure per rules
```

## State Management

### Updating ROAD Status

This agent updates ROAD item front matter:

```yaml
---
id: ROAD-005
status: implementing  # Updated by this agent
governance:
  adrs:
    validated: true   # Set after @architecture-inspector
    validated_by: "@architecture-inspector"
    validated_at: "2026-01-31T10:00:00Z"
  bdd:
    id: BDD-005
    status: approved  # Set after @bdd-runner
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
  nfrs:
    status: pass      # Set after NFR validation
    results:
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-agent"
      NFR-SEC-001:
        status: pass
        validated_by: "@security-agent"
      NFR-A11Y-001:
        status: pass
        validated_by: "@a11y-agent"
---
```

### Creating Blocked Items

When large NFR violation:

```yaml
---
id: ROAD-042
title: Fix Performance Issues in Bot Authentication
status: proposed
governance:
  adrs:
    validated: false
  nfrs:
    applicable: [NFR-PERF-001]
    status: pending
blocks: [ROAD-005]  # This blocks ROAD-005
depends_on: []      # Can be worked on independently
---
```

Update original ROAD:

```yaml
---
id: ROAD-005
status: nfr_blocked  # Special blocked status
blocked_by: [ROAD-042]  # Waiting for this
---
```

## Coordination Patterns

### Pattern 1: Gate Validation

```
@governance-orchestrator:
  Check current gates
  IF all gates met:
    → Allow agent to proceed
  ELSE:
    → Identify missing gates
    → Delegate to appropriate agents
    → Wait for completion
    → Re-check gates
    → THEN allow agent to proceed
```

### Pattern 2: State Transition

```
@governance-orchestrator:
  Validate transition allowed
  Update front matter
  Delegate to next phase agent
  Monitor completion
  Update status when phase complete
```

### Pattern 3: Failure Recovery

```
@governance-orchestrator:
  Detect failure (NFR or validation)
  Analyze severity:
    IF small:
      → Auto-fix
      → Retry
    IF large:
      → Create blocked ROAD item
      → Update dependencies
      → Report to user
```

## Reporting

### Status Report Format

```
📊 Governance Report for ROAD-005
═══════════════════════════════════════════

Current Status: implementing

Gate Status:
  ✅ ADR Validation: Pass (@architecture-inspector)
  ✅ BDD Approval: Pass (@bdd-writer, @bdd-runner)
  ⏳ NFR Validation: In Progress
    - Performance: Running...
    - Security: Pending
    - Accessibility: Pending

Blocked By: None
Blocks: None

Next Actions:
  1. Wait for NFR tests to complete
  2. If pass: Mark as complete
  3. If fail: Handle per NFR failure policy

Estimated Completion: After NFR validation
```

## Error Handling

### Invalid State Transition

```
ERROR: Invalid state transition attempted
  From: proposed
  To: complete
  
Valid transitions from "proposed":
  - adr_validated (requires ADR validation)

Action: Delegate to @architecture-inspector for ADR validation first.
```

### Missing Gate

```
ERROR: Cannot proceed - Missing required gate
  Required: BDD approval
  Current: BDD status = "draft"
  
Action: Delegate to @bdd-writer and @bdd-runner first.
```

### NFR Failure

```
ERROR: NFR validation failed
  NFR-PERF-001: FAILED
  Reason: API p95 response time 450ms (threshold: 200ms)
  
Analysis: Large violation requiring architecture changes
  
Action: 
  1. Created ROAD-042 to track fix
  2. ROAD-005 marked as "nfr_blocked"
  3. ROAD-042 blocks ROAD-005
  
Next: User should prioritize ROAD-042
```

## Success Metrics

- ✅ All ROAD items follow state machine
- ✅ No invalid transitions
- ✅ All gates validated before progression
- ✅ NFR failures handled appropriately
- ✅ Blocked items clearly tracked

---

**Dependencies**: @governance-linter, @road-manager, @change-manager  
**Related Skills**: governance-validation, road-management, change-management
```

---

## Task 2: Create @governance-linter Agent

**Files:**
- Create: `.shared/agents/governance-linter.md`

**Purpose:** Runs the governance linter script and reports violations.

**Agent Definition:**

```yaml
---
name: governance-linter
description: >
  Governance validation specialist that runs the governance-linter.js script to validate
  front matter compliance, state machine adherence, and required fields. Reports specific
  errors and warnings for ROAD, CHANGE, ADR, and NFR documents. Use to validate governance
  compliance before state transitions.
role: Governance Validation Specialist
responsibility: Validate governance front matter and state machine compliance
autonomy: high
platforms: [claude, opencode]
tools:
  read: true
  bash: true
permissions:
  - "file:docs/**/*.md"
  - "file:scripts/governance-linter.js"
  - "bash:./scripts/governance-linter.js"
metadata:
  category: governance
  priority: 8
  created: "2026-01-31"
  version: "1.0.0"
---
```

**Content:**

```markdown
# Governance Linter Agent

**Role**: Governance Validation Specialist  
**Responsibility**: Validate governance front matter and state machine compliance  
**Autonomy**: High - runs validation and reports results  

## Purpose

This agent validates that all governance documents follow the required schema and state machine:
1. Runs `./scripts/governance-linter.js`
2. Validates ROAD item front matter
3. Checks CHANGE entry compliance
4. Verifies ADR/NFR document structure
5. Reports specific errors and warnings

## Capabilities

### Validate ROAD Item

```bash
./scripts/governance-linter.js ROAD-005
```

**Validates:**
- Required front matter fields (id, title, status, governance)
- Valid status values
- State machine compliance
- ADR validation before BDD stages
- BDD approval before implementing
- NFR pass status before complete

### Validate All ROAD Items

```bash
./scripts/governance-linter.js --all-roads
```

### Validate CHANGE Entries

```bash
./scripts/governance-linter.js --changelog
```

### Validate ADR Files

```bash
./scripts/governance-linter.js --adrs
```

### CI Mode

```bash
./scripts/governance-linter.js --ci
```

## Validation Rules

### ROAD Item Rules

| Rule | Check | Error If |
|------|-------|----------|
| R001 | Required fields | Missing id, title, status, or governance |
| R002 | ID format | Not matching `ROAD-XXX` pattern |
| R003 | Status value | Not in valid state list |
| R004 | ADR validation | `adr_validated: false` but status is `bdd_pending`+ |
| R005 | BDD approval | No BDD approval but status is `implementing`+ |
| R006 | NFR status | Any NFR != "pass" but status is `complete` |

### CHANGE Entry Rules

| Rule | Check | Error If |
|------|-------|----------|
| C001 | Required fields | Missing id, road_id, status |
| C002 | ID format | Not matching `CHANGE-XXX` pattern |
| C003 | Road reference | ROAD item doesn't exist |
| C004 | Road complete | Referenced ROAD not `complete` |
| C005 | Signatures | Published without all 7 agent signatures |

### ADR Rules

| Rule | Check | Error If |
|------|-------|----------|
| A001 | Required fields | Missing id, title, status, category |
| A002 | ID format | Not matching `ADR-XXX` pattern |
| A003 | Status | Not in [proposed, accepted, deprecated, superseded] |

### NFR Rules

| Rule | Check | Error If |
|------|-------|----------|
| N001 | Required fields | Missing id, type |
| N002 | ID format | Not matching `NFR-TYPE-XXX` pattern |
| N003 | Type | Not in [performance, security, accessibility] |

## Output Format

### Human-Readable

```
🔍 Governance Linter
═══════════════════════════════════════════

[ROAD-005] Bot Authentication
File: docs/plans/2026-01-31-bot-authentication.md

❌ ERRORS (1)
───────────────────────────────────────────
  Missing required field: governance.adrs.validated_by
  Location: front matter
  
⚠️  WARNINGS (1)
───────────────────────────────────────────
  governance.nfrs.results missing evidence links
  
✅ PASSED (0)
───────────────────────────────────────────

Summary: 1 errors, 1 warnings, 0 passed
```

### JSON

```json
{
  "summary": {
    "total": 1,
    "errors": 1,
    "warnings": 1,
    "passed": 0
  },
  "errors": [
    {
      "file": "docs/plans/2026-01-31-bot-authentication.md",
      "roadId": "ROAD-005",
      "message": "Missing required field: governance.adrs.validated_by",
      "severity": "error"
    }
  ]
}
```

## Integration

### Before State Transitions

Always run linter before updating status:

```
@governance-linter: Validate ROAD-005
  ↓
IF errors:
  Report to @governance-orchestrator
  Block transition
  ↓
ELSE:
  Allow transition
```

### In CI/CD

```yaml
- name: Validate Governance
  run: ./scripts/governance-linter.js --ci
```

## Exit Codes

- `0`: All validations passed
- `1`: Errors found (strict mode - blocks progression)
- `3`: Linter script error

## Reporting

### Success Report

```
✅ Governance Validation Passed

ROAD-005: All checks passed
  - Front matter: Complete
  - State machine: Valid
  - Gates: All met

Ready for next phase.
```

### Failure Report

```
❌ Governance Validation Failed

ROAD-005: 2 errors found

Errors:
  1. Missing governance.adrs.validated_by
     Fix: Add validated_by field after @architecture-inspector reviews
     
  2. Invalid status transition: proposed → implementing
     Fix: Must go through adr_validated and bdd_complete first

Action Required:
  1. Complete ADR validation
  2. Complete BDD scenarios
  3. Then retry implementation
```

## Best Practices

1. **Run before every state transition**
2. **Run in CI on every PR**
3. **Fix errors immediately**
4. **Don't ignore warnings**
5. **Use JSON mode for automation**
```

---

## Task 3: Create @road-manager Agent

**Files:**
- Create: `.shared/agents/road-manager.md`

**Purpose:** Manages ROAD item lifecycle, status transitions, and dependency tracking.

**Agent Definition:**

```yaml
---
name: road-manager
description: >
  ROAD item lifecycle manager that handles status transitions, dependency tracking (blocks/depends_on),
  and front matter updates. Ensures proper state machine adherence and maintains governance tracking.
  Use to create, update, and manage ROAD items through their lifecycle.
role: ROAD Item Lifecycle Manager
responsibility: Manage ROAD item status, transitions, and dependencies
autonomy: medium
platforms: [claude, opencode]
tools:
  read: true
  write: true
  edit: true
  bash: true
permissions:
  - "file:docs/ROADMAP.md"
  - "file:docs/plans/*.md"
  - "file:docs/adr/**"
  - "file:docs/nfr/**"
dependencies:
  - governance-linter
  - governance-orchestrator
metadata:
  category: governance
  priority: 8
  created: "2026-01-31"
  version: "1.0.0"
---
```

**Content:**

```markdown
# Road Manager Agent

**Role**: ROAD Item Lifecycle Manager  
**Responsibility**: Manage ROAD item status, transitions, and dependencies  
**Autonomy**: Medium - updates state but escalates major changes  

## Purpose

This agent manages the complete lifecycle of ROAD items:
1. Creates new ROAD items with proper front matter
2. Manages status transitions
3. Tracks dependencies (blocks/depends_on)
4. Updates governance tracking fields
5. Maintains ROADMAP.md index

## Capabilities

### Create ROAD Item

Creates a new ROAD item file with proper front matter:

```yaml
---
id: ROAD-XXX
title: Feature Name
status: proposed
created: "2026-01-31"
governance:
  adrs:
    validated: false
  bdd:
    status: pending
  nfrs:
    applicable: [NFR-PERF-001, NFR-SEC-001, NFR-A11Y-001]
    status: pending
blocks: []
depends_on: []
---

# ROAD-XXX: Feature Name

## Description

Brief description of the feature.

## Status

🎯 **Proposed**

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies

- Blocks: None
- Depends on: None

## Related

- BDD: Not created yet
- Design: Not created yet
```

### Update Status

Transitions ROAD item to new status with validation:

```
Current: proposed
Target: adr_validated

Validation:
  ✓ ADR compliance check passed
  
Action:
  Update front matter:
    status: adr_validated
    governance.adrs:
      validated: true
      validated_by: "@architecture-inspector"
      validated_at: "2026-01-31T10:00:00Z"
```

### Manage Dependencies

**Add blocker:**
```yaml
blocks: [ROAD-042]  # This ROAD blocks ROAD-042
```

**Add dependency:**
```yaml
depends_on: [ROAD-041]  # This ROAD depends on ROAD-041
```

### Create Blocked Item

When NFR fails and requires separate work:

```yaml
---
id: ROAD-042
title: Fix Performance for Bot Authentication
status: proposed
governance:
  adrs:
    validated: false
  nfrs:
    applicable: [NFR-PERF-001]
    status: pending
blocks: [ROAD-005]  # Blocks the original ROAD
depends_on: []
---
```

Update original:
```yaml
---
id: ROAD-005
status: nfr_blocked
blocked_by: [ROAD-042]
---
```

## Status Values

| Status | Description | Next States |
|--------|-------------|-------------|
| proposed | Initial idea | adr_validated |
| adr_validated | ADR compliance confirmed | bdd_pending |
| bdd_pending | BDD being written | bdd_complete |
| bdd_complete | BDD approved | implementing |
| implementing | Code being written | nfr_validating |
| nfr_validating | NFR tests running | complete, nfr_blocked |
| nfr_blocked | NFR failed, blocked item created | implementing (after fix) |
| complete | All gates passed | - |

## State Transition Checklist

### proposed → adr_validated

Required:
- [ ] @governance-linter validation passes
- [ ] @architecture-inspector ADR compliance check passes
- [ ] Front matter updated with validation details

### adr_validated → bdd_complete

Required:
- [ ] BDD scenarios created (by @bdd-writer)
- [ ] BDD scenarios approved (by @bdd-runner)
- [ ] All scenarios tagged with @ROAD-XXX

### bdd_complete → implementing

Required:
- [ ] Implementation started by @code-writer
- [ ] No blocking dependencies

### implementing → complete

Required:
- [ ] All NFRs pass (NFR-PERF-001, NFR-SEC-001, NFR-A11Y-001)
- [ ] @ci-runner all checks pass
- [ ] No blocking dependencies

## Front Matter Schema

### Required Fields

```yaml
---
id: ROAD-XXX                    # Format: ROAD-NNN
title: "Feature Name"           # Human-readable name
status: proposed                # From valid status list
created: "2026-01-31"           # ISO8601 date
governance:                     # Governance tracking
  adrs:                         # ADR compliance
    validated: boolean          # true/false
    validated_by: string        # Agent name (if validated)
    validated_at: string        # ISO8601 timestamp
  bdd:                          # BDD tracking
    id: BDD-XXX                 # BDD identifier
    status: string              # draft, approved
    approved_by:                # List of approvers
      - agent: string
        timestamp: string
  nfrs:                         # NFR tracking
    applicable:                 # List of applicable NFRs
      - NFR-PERF-001
      - NFR-SEC-001
      - NFR-A11Y-001
    status: string              # pending, validating, pass, fail
    results:                    # Detailed results
      NFR-PERF-001:
        status: pass
        evidence: url
blocks: []                      # ROADs this blocks
depends_on: []                  # ROADs this depends on
blocked_by: []                  # ROADs blocking this
---
```

## ROADMAP.md Integration

This agent maintains the index in ROADMAP.md:

```markdown
## Active Items

| ID | Title | Status | Dependencies |
|----|-------|--------|--------------|
| ROAD-005 | Bot Authentication | 🚧 implementing | - |
| ROAD-042 | Fix Performance | 🎯 proposed | Blocks: ROAD-005 |
```

## Reporting

### Status Update Report

```
📋 ROAD Item Updated: ROAD-005
═══════════════════════════════════════════

Previous Status: bdd_complete
New Status: implementing

Governance Updates:
  ✅ BDD approval recorded
     - @bdd-writer: 2026-01-31T11:00:00Z
     - @bdd-runner: 2026-01-31T11:05:00Z

Next Steps:
  1. @code-writer implements feature
  2. After implementation: NFR validation
  3. Target: complete

Dependencies:
  Blocks: None
  Blocked by: None
  
Ready for implementation phase.
```

### Dependency Graph Report

```
📊 Dependency Graph
═══════════════════════════════════════════

ROAD-041 (complete)
  ↓
ROAD-005 (implementing) ← ROAD-042 (proposed)
  ↓
ROAD-006 (adr_validated)

Legend:
  → = blocks
  ← = blocked_by
```

## Error Handling

### Invalid Transition

```
❌ Cannot transition: proposed → complete

Valid transitions from "proposed":
  - adr_validated

Missing gates:
  - ADR validation
  
Action: Complete ADR validation first.
```

### Circular Dependency

```
❌ Circular dependency detected

ROAD-005 → ROAD-006 → ROAD-005

Cannot create circular dependencies.
Action: Remove one dependency link.
```

## Coordination

### With @governance-orchestrator

```
@governance-orchestrator: "Transition ROAD-005 to implementing"
  ↓
@road-manager: Validate transition
  ↓
@road-manager: Check dependencies
  ↓
@road-manager: Update front matter
  ↓
@road-manager: Update ROADMAP.md
  ↓
@road-manager: Report success
```

### With Other Agents

- **@bdd-writer**: Updates BDD status after scenario creation
- **@bdd-runner**: Updates BDD status after test execution
- **@architecture-inspector**: Updates ADR validation status
- **@ci-runner**: Updates NFR status after tests

---

**Dependencies**: @governance-linter, @governance-orchestrator  
**Related**: ROADMAP.md, docs/plans/*.md
```

---

## Task 4: Create @change-manager Agent

**Files:**
- Create: `.shared/agents/change-manager.md`

**Purpose:** Manages CHANGE entries, signature collection, and CHANGELOG integration.

**Agent Definition:**

```yaml
---
name: change-manager
description: >
  CHANGE entry manager that creates compliant CHANGE entries with proper front matter,
  collects agent signatures, validates compliance evidence, and maintains CHANGELOG.md.
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
permissions:
  - "file:docs/CHANGELOG.md"
  - "file:docs/plans/*.md"
  - "file:docs/ROADMAP.md"
dependencies:
  - governance-linter
  - road-manager
metadata:
  category: governance
  priority: 8
  created: "2026-01-31"
  version: "1.0.0"
---
```

**Content:**

```markdown
# Change Manager Agent

**Role**: CHANGE Entry Manager  
**Responsibility**: Create and manage CHANGE entries with compliance tracking  
**Autonomy**: Medium - creates entries but validates strictly  

## Purpose

This agent manages CHANGE entries:
1. Creates CHANGE entries with proper front matter
2. Collects agent signatures
3. Validates compliance evidence
4. Maintains CHANGELOG.md
5. Ensures ROAD item is complete before publication

## Capabilities

### Create CHANGE Entry

Creates a CHANGE entry for a completed ROAD item:

```yaml
---
id: CHANGE-005
road_id: ROAD-005
title: Bot Authentication Implementation
date: "2026-01-31"
version: "0.5.0"
status: draft  # draft → published
categories:
  - Added
compliance:
  adr_check:
    status: pass
    validated_by: "@architecture-inspector"
    validated_at: "2026-01-31T10:00:00Z"
  bdd_check:
    status: pass
    scenarios: 5
    passed: 5
    coverage: "100%"
  nfr_checks:
    performance:
      status: pass
      evidence: "https://ci.primademo.dev/perf/12345"
    security:
      status: pass
      evidence: "npm audit: 0 critical"
    accessibility:
      status: pass
      evidence: "Lighthouse: 98"
signatures:
  - agent: "@architecture-inspector"
    role: adr_validation
    status: approved
    timestamp: "2026-01-31T10:00:00Z"
  - agent: "@bdd-writer"
    role: bdd_author
    status: approved
    timestamp: "2026-01-31T11:00:00Z"
  - agent: "@bdd-runner"
    role: test_validation
    status: approved
    timestamp: "2026-01-31T11:05:00Z"
  - agent: "@code-writer"
    role: implementation
    status: approved
    timestamp: "2026-01-31T13:00:00Z"
  - agent: "@performance-agent"
    role: nfr_validation
    status: approved
    timestamp: "2026-01-31T14:00:00Z"
  - agent: "@security-agent"
    role: nfr_validation
    status: approved
    timestamp: "2026-01-31T14:05:00Z"
  - agent: "@a11y-agent"
    role: nfr_validation
    status: approved
    timestamp: "2026-01-31T14:10:00Z"
---

### [CHANGE-005] Bot Authentication Implementation - 2026-01-31

**Roadmap**: [ROAD-005]
**Type**: Added
**Author**: AI Agent

#### Summary

Implemented complete bot authentication system with API key generation, verification middleware, and protected endpoints.

#### Changes

**Domain Layer:**
- Created `BotAccount` aggregate with API key support
- Created `ApiKey` value object

**Application Layer:**
- Created `AuthenticationApplicationService`

**Infrastructure Layer:**
- Created Convex mutations
- Created `withAuth` middleware

#### Verification

- Architecture: ✅ Pass (ADR-001, ADR-003, ADR-009, ADR-016)
- BDD Tests: ✅ 5/5 Pass
- Performance: ✅ 45ms p95
- Security: ✅ 0 vulnerabilities
- Accessibility: ✅ N/A (backend)

#### Signatures

All 7 governance agents have signed off.
```

### Collect Signature

Adds an agent signature to a CHANGE entry:

```yaml
signatures:
  - agent: "@architecture-inspector"
    role: adr_validation
    status: approved
    timestamp: "2026-01-31T10:00:00Z"
```

### Validate CHANGE

Checks if CHANGE entry can be published:

```
Validation Checklist:
  ✓ ROAD-005 exists and is complete
  ✓ All 7 required signatures present
  ✓ All signatures have status: approved
  ✓ Compliance checks all pass
  ✓ Evidence links provided
```

### Publish CHANGE

Updates CHANGE entry status to "published":

```yaml
status: published
published_at: "2026-01-31T15:00:00Z"
```

## Required Signatures

Every CHANGE entry MUST have signatures from:

| Agent | Role | Responsibility |
|-------|------|----------------|
| @architecture-inspector | adr_validation | ADR compliance |
| @bdd-writer | bdd_author | Scenario creation |
| @bdd-runner | test_validation | Test execution |
| @code-writer | implementation | Feature implementation |
| @performance-agent | nfr_validation | Performance NFR |
| @security-agent | nfr_validation | Security NFR |
| @a11y-agent | nfr_validation | Accessibility NFR |

## Front Matter Schema

### Required Fields

```yaml
---
id: CHANGE-XXX              # Format: CHANGE-NNN
road_id: ROAD-XXX           # Linked ROAD item
title: "Description"        # Human-readable
date: "2026-01-31"          # ISO8601 date
version: "0.5.0"            # Release version
status: draft               # draft, published
categories:                 # Change categories
  - Added
  - Changed
  - Fixed
compliance:                 # Compliance tracking
  adr_check:
    status: pass            # pass, fail
    validated_by: string    # Agent name
    validated_at: string    # ISO8601 timestamp
  bdd_check:
    status: pass
    scenarios: number       # Total scenarios
    passed: number          # Passed count
    coverage: string        # Coverage percentage
  nfr_checks:
    performance:
      status: pass
      evidence: string      # Link or description
    security:
      status: pass
      evidence: string
    accessibility:
      status: pass
      evidence: stringsignatures:                # Agent signatures
  - agent: string           # Agent name
    role: string            # Validation role
    status: approved        # approved, pending
    timestamp: string       # ISO8601
---
```

## Integration with ROAD Items

### Before Creating CHANGE

1. Verify ROAD item exists
2. Verify ROAD status is "complete"
3. Verify all gates passed
4. Copy relevant info from ROAD

### After Publishing CHANGE

1. Update ROAD item with CHANGE reference
2. Update ROADMAP.md with completion status
3. Archive or update related documentation

## Validation Rules

### Cannot Publish If:

- ROAD item doesn't exist
- ROAD item not complete
- Missing any required signature
- Any signature not "approved"
- Any compliance check failed
- Missing evidence links

### Publishing Requirements:

- All 7 signatures present
- All signatures approved
- All compliance checks pass
- Evidence documented
- ROAD item complete

## Reporting
n### CHANGE Created Report

```
📝 CHANGE Entry Created: CHANGE-005
═══════════════════════════════════════════

Linked to: ROAD-005 (Bot Authentication)
Status: draft

Compliance Tracking:
  ✅ ADR Validation: @architecture-inspector
  ✅ BDD Tests: 5/5 passed
  ✅ Performance: Pass
  ✅ Security: Pass
  ✅ Accessibility: Pass

Signatures Collected: 0/7
  ⏳ @architecture-inspector: Pending
  ⏳ @bdd-writer: Pending
  ⏳ @bdd-runner: Pending
  ⏳ @code-writer: Pending
  ⏳ @performance-agent: Pending
  ⏳ @security-agent: Pending
  ⏳ @a11y-agent: Pending

Next Steps:
  Collect all 7 agent signatures
```

### CHANGE Published Report

```
📢 CHANGE Entry Published: CHANGE-005
═══════════════════════════════════════════

Title: Bot Authentication Implementation
Date: 2026-01-31
Version: 0.5.0

All Compliance Checks: ✅ Pass
All 7 Signatures: ✅ Complete

Status: PUBLISHED

CHANGELOG.md updated.
```

## Error Handling

### Missing Signatures

```
❌ Cannot publish CHANGE-005

Missing signatures (2):
  - @performance-agent
  - @security-agent

Action: Complete NFR validation first.
```

### ROAD Not Complete

```
❌ Cannot create CHANGE for ROAD-005

ROAD-005 status: implementing
Required status: complete

Action: Complete implementation and NFR validation first.
```

## Coordination

### With @governance-orchestrator

```
@governance-orchestrator: "ROAD-005 complete, create CHANGE"
  ↓
@change-manager: Verify ROAD complete
  ↓
@change-manager: Create CHANGE entry
  ↓
@change-manager: Collect signatures from all agents
  ↓
@change-manager: Validate and publish
  ↓
@change-manager: Update CHANGELOG.md
```

### With Other Agents

Each agent adds their signature after completing their work:
- @architecture-inspector: After ADR validation
- @bdd-writer: After scenario approval
- @bdd-runner: After test execution
- @code-writer: After implementation
- @performance-agent: After performance NFR
- @security-agent: After security NFR
- @a11y-agent: After accessibility NFR

---

**Dependencies**: @governance-linter, @road-manager  
**Related**: CHANGELOG.md, ROADMAP.md
```

---

## Task 5: Update Existing Agents

Now I need to update all existing agents to integrate with the governance system. I'll create updates for:

1. @superpowers-orchestrator - Add governance checks to workflow
2. @bdd-writer - Check ADR validation before creating scenarios
3. @bdd-runner - Update ROAD BDD status after tests
4. @code-writer - Check BDD approval before implementing
5. @architecture-inspector - Update ADR validation status
6. @ci-runner - Run NFR tests and update status
7. @ddd-aligner - Minor updates for consistency
8. @site-keeper - Minor updates for consistency

**Note**: I'll create updates for the key agents (orchestrator, bdd-writer, code-writer, architecture-inspector, ci-runner) in detail.

### Task 5a: Update @superpowers-orchestrator

**Files:**
- Modify: `.shared/agents/superpowers-orchestrator.md`

**Add to front matter dependencies:**
```yaml
dependencies:
  - governance-orchestrator  # ADD THIS
  - governance-linter        # ADD THIS
  - bdd-writer
  ...
```

**Add new Phase 0: Governance Validation**

Insert before Phase 1:

```markdown
### Phase 0: Governance Validation (NEW)

**Goal**: Validate governance state before proceeding

**Steps:**
1. @governance-linter: Validate current ROAD state
2. @governance-orchestrator: Check if gates met
3. IF gates NOT met:
   - Escalate: "Need to complete [gate] first"
   - Delegate to appropriate agents
   - Wait for completion
   - Re-validate
4. IF gates met:
   - Proceed to Phase 1

**Example:**
```
Found ROAD-005 with status: proposed

⚠️  Gate Check Failed:
   Missing: ADR validation
   
Escalating to @architecture-inspector...

✅ ADR validation complete
Updating ROAD status to: adr_validated

Proceeding to Phase 1...
```
```

**Update Phase 5 (Quality Gates):**

Add NFR validation:

```markdown
**Additional Gates (NEW):**

5. @governance-linter: Validate governance state
6. @performance-agent: Validate NFR-PERF-001 (if applicable)
7. @security-agent: Validate NFR-SEC-001 (if applicable)
8. @a11y-agent: Validate NFR-A11Y-001 (if applicable)

**NFR Failure Handling:**

IF NFR tests fail:
   Analyze severity:
      
   IF small fix:
      → @code-writer auto-fixes
      → Re-run NFR tests
      → Continue
      
   IF large fix:
      → @road-manager creates blocked ROAD item
      → @governance-orchestrator marks as nfr_blocked
      → Report to user
      → STOP workflow
```

**Update Phase 7 (Completion):**

Add CHANGE creation:

```markdown
**Additional Steps:**

4. @change-manager: Create CHANGE entry
5. Collect signatures from all 7 agents
6. @change-manager: Publish CHANGE
7. Update CHANGELOG.md
```

### Task 5b: Update @bdd-writer

**Files:**
- Modify: `.shared/agents/bdd-writer.md`

**Add to front matter:**
```yaml
dependencies:
  - governance-orchestrator  # ADD THIS
  - governance-linter        # ADD THIS
  ...
```

**Add new section: "Governance Integration"**

```markdown
## Governance Integration

### Before Creating Scenarios

**MUST check with @governance-orchestrator:**

```
@bdd-writer: "Ready to create scenarios for ROAD-005"
  ↓
@governance-orchestrator: Check current status
  ↓
IF status != adr_validated:
  Escalate: "Need ADR validation first"
  Block until validation complete
  ↓
ELSE:
  Proceed with scenario creation
```

### After Scenario Approval

**MUST notify @road-manager:**

```
@bdd-writer: Scenarios approved by user
  ↓
@bdd-runner: Run tests (Red phase)
  ↓
IF tests fail as expected:
  @road-manager: Update BDD status to "approved"
  @road-manager: Update ROAD status to "bdd_complete"
```

### Required Tags

Always include governance tags:

```gherkin
@ROAD-005                    # Required: Roadmap ID
@api                        # Layer
@bot-identity              # Context
Feature: Bot Authentication
```
```

### Task 5c: Update @code-writer

**Files:**
- Modify: `.shared/agents/code-writer.md`

**Add governance checks to workflow:**

```markdown
## Governance Integration

### Before Implementation

**MUST verify with @governance-orchestrator:**

```
@code-writer: "Ready to implement ROAD-005"
  ↓
@governance-orchestrator: Check gates
  ↓
Gate Checklist:
  ✅ ADR validated
  ✅ BDD approved
  ⏳ Ready for implementation
  
IF all gates met:
  Proceed with implementation
ELSE:
  Block and escalate
```

### ADR Compliance

**MUST follow all accepted ADRs:**

During implementation:
- @architecture-inspector verifies ADR compliance
- Check against all accepted ADRs in docs/adr/
- Ensure no violations

### After Implementation

**MUST trigger NFR validation:**

```
@code-writer: Implementation complete
  ↓
@governance-orchestrator: Update status to "implementing"
  ↓
@ci-runner: Run all NFR tests
  ↓
IF all NFRs pass:
  @road-manager: Update to "complete"
ELSE:
  Handle per NFR failure policy
```
```

### Task 5d: Update @architecture-inspector

**Files:**
- Modify: `.shared/agents/architecture-inspector.md`

**Add governance integration:**

```markdown
## Governance Integration

### ADR Validation

After reviewing code, MUST update ROAD front matter:

```yaml
governance:
  adrs:
    validated: true
    validated_by: "@architecture-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    compliance_check:
      - adr: ADR-001
        compliant: true
        notes: "Uses aggregates correctly"
      - adr: ADR-002
        compliant: true
        notes: "Respects context boundaries"
```

### Validation Report

Report MUST include:
- List of ADRs checked
- Compliance status for each
- Any violations found
- Signature timestamp

### Trigger

Called by @governance-orchestrator when:
- ROAD status = proposed → needs adr_validated
- Implementation complete → needs final review
```

### Task 5e: Update @ci-runner

**Files:**
- Modify: `.shared/agents/ci-runner.md`

**Add NFR test execution:**

```markdown
## NFR Test Execution (NEW)

### Performance Tests

Run performance benchmarks:
```bash
npm run test:performance
```

Update ROAD front matter with results:
```yaml
governance:
  nfrs:
    results:
      NFR-PERF-001:
        status: pass
        evidence: "https://ci.primademo.dev/perf/12345"
        metrics:
          api_p95: "45ms"
        timestamp: "2026-01-31T14:00:00Z"
        validated_by: "@performance-agent"
```

### Security Tests

Run security scans:
```bash
npm audit
npm run scan:secrets
```

Update results in front matter.

### Accessibility Tests

Run a11y tests:
```bash
npm run test:a11y
```

Update results in front matter.

### Full NFR Suite

```bash
just nfr-test-all  # ADD THIS RECIPE
```

This runs all NFR tests and updates ROAD status accordingly.
```

---

## Task 6: Create/Update Skills

### Skill 1: governance-validation

**File:** `.shared/skills/governance-validation.md`

**Purpose:** Skill for reading/writing governance front matter and validating state.

**Content:**
```markdown
# Governance Validation Skill

## Purpose

Validate and manage governance front matter for ROAD, CHANGE, ADR, and NFR documents.

## Reading Front Matter

```typescript
import { readFrontMatter } from './lib/governance';

const road = readFrontMatter('docs/plans/2026-01-31-feature.md');
console.log(road.id);        // ROAD-005
console.log(road.status);    // implementing
console.log(road.governance.adrs.validated); // true
```

## Validating State

```typescript
import { validateRoadState } from './lib/governance';

const result = validateRoadState('ROAD-005');
// { valid: false, errors: ['Missing BDD approval'] }
```

## State Machine

Valid transitions:
- proposed → adr_validated
- adr_validated → bdd_pending
- bdd_pending → bdd_complete
- bdd_complete → implementing
- implementing → nfr_validating
- nfr_validating → complete

## Required Fields by Status

### proposed
- id, title, status, governance

### adr_validated
- governance.adrs.validated: true
- governance.adrs.validated_by

### bdd_complete
- governance.bdd.status: approved
- governance.bdd.approved_by

### complete
- governance.nfrs.status: pass
- All applicable NFRs: pass
```

### Skill 2: road-management

**File:** `.shared/skills/road-management.md`

**Purpose:** Skill for managing ROAD item lifecycle and dependencies.

### Skill 3: change-management

**File:** `.shared/skills/change-management.md`

**Purpose:** Skill for creating and managing CHANGE entries.

---

## Task 7: Create Just Recipes

**File:** Add to `justfile`

```just
# Governance commands

# Validate governance for specific ROAD item
governance-lint ROAD_ID:
    ./scripts/governance-linter.js {{ROAD_ID}}

# Validate all ROAD items
governance-lint-all:
    ./scripts/governance-linter.js --all-roads

# Validate CHANGELOG
governance-lint-changelog:
    ./scripts/governance-linter.js --changelog

# Run all governance checks (CI mode)
governance-check:
    ./scripts/governance-linter.js --ci

# Run NFR tests
nfr-test-all:
    npm run test:performance
    npm audit
    npm run test:a11y

# Check if ROAD item ready for next phase
governance-gate ROAD_ID:
    @echo "Checking governance gates for {{ROAD_ID}}..."
    ./scripts/governance-linter.js {{ROAD_ID}}
```

---

## Task 8: Update AGENT.md

Add section about governance system:

```markdown
## 🏛️ Governance System (NEW)

PrimaDemo uses a deterministic governance system where all changes must satisfy ADRs and NFRs.

### Key Agents

- **@governance-orchestrator**: Central coordinator
- **@governance-linter**: Validates compliance
- **@road-manager**: Manages ROAD lifecycle
- **@change-manager**: Manages CHANGE entries

### State Machine

ROAD items progress through states:
1. proposed → adr_validated (requires ADR validation)
2. adr_validated → bdd_complete (requires BDD approval)
3. bdd_complete → implementing (ready for code)
4. implementing → complete (requires all NFRs pass)

### Commands

```bash
just governance-lint ROAD-005       # Validate ROAD item
just governance-check               # Validate all
just nfr-test-all                   # Run NFR tests
```

### Required Signatures

Every CHANGE entry needs 7 agent signatures:
1. @architecture-inspector (ADR validation)
2. @bdd-writer (BDD scenarios)
3. @bdd-runner (Test validation)
4. @code-writer (Implementation)
5. @performance-agent (Performance NFR)
6. @security-agent (Security NFR)
7. @a11y-agent (Accessibility NFR)
```

---

## Implementation Order

1. Create new agent files (Tasks 1-4)
2. Update existing agent files (Task 5)
3. Create skills (Task 6)
4. Add just recipes (Task 7)
5. Update AGENT.md (Task 8)
6. Test with governance-linter.js
7. Validate integration works

---

## Success Criteria

- ✅ All 4 new agents created with proper front matter
- ✅ All existing agents updated with governance integration
- ✅ Skills created for governance operations
- ✅ Just recipes added for governance commands
- ✅ AGENT.md updated with governance documentation
- ✅ Integration tested end-to-end
- ✅ State machine enforced correctly
- ✅ NFR failures handled appropriately

**Total Files Created/Modified: 20+**
- 4 new agent files
- 8 updated agent files
- 3 skill files
- 1 justfile update
- 1 AGENT.md update
- Plus supporting documentation

Ready to execute this plan?
