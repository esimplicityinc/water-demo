# Agent Instructions for ClawMarket

This document provides instructions for AI agents (like Claude, GPT, etc.) working on the ClawMarket project.

---

## 🎯 Core Principles

1. **ALWAYS update the changelog when making changes.**
2. **ALWAYS use `just` commands instead of running tools directly.**
3. **ALWAYS coordinate with specialized subagents for complex tasks.**

---

## 🚀 Superpowers Integration (NEW - DEFAULT WORKFLOW)

ClawMarket now uses **Superpowers** as the default development methodology, integrated with our custom domain agents.

### The Dual-Loop System

**Outer Loop (Superpowers - Methodology):**
- `/superpowers:brainstorm` → Design refinement with TDD/BDD mindset
- `/superpowers:write-plan` → Break into tasks, assign to domain agents  
- `/superpowers:execute-plan` → Orchestrate execution with checkpoints

**Inner Loop (Domain Agents - Implementation):**
- `@bdd-writer` → Create BDD scenarios (RED phase)
- `@code-writer` → Implement features (GREEN phase)
- `@architecture-inspector` → Verify hexagonal compliance
- `@ddd-aligner` → Check domain alignment
- `@bdd-runner` → Execute tests (REFACTOR phase)
- `@ci-runner` → Full CI validation

### When to Use Superpowers

**ALWAYS use for:**
- ✅ New roadmap items (ROAD-XXX)
- ✅ Feature implementation
- ✅ Complex bug fixes
- ✅ Refactoring with domain changes
- ✅ Any work touching business logic

**Can skip for:**
- 🔧 Pure UI changes (no logic)
- 🔧 Single file modifications
- 🔧 Documentation updates
- 🔧 Config changes
- 🔧 < 10 minutes of work

### The Standard Workflow

```
1. /superpowers:brainstorm
   └─→ Design document with BDD scenarios outline

2. /superpowers:write-plan
   └─→ Task list with agent assignments

3. /superpowers:execute-plan
   ├─→ @bdd-writer creates scenarios (RED)
   ├─→ @code-writer implements (GREEN)
   ├─→ @architecture-inspector reviews
   ├─→ @ddd-aligner verifies domain
   ├─→ @bdd-runner runs tests (REFACTOR)
   └─→ @ci-runner final check

4. /superpowers:finish-branch
   └─→ Merge/PR/cleanup
```

### Loading the Integration Skill

Before starting complex work, load the integration skill:

```
use skill tool to load superpowers-integration
```

This provides:
- Detailed workflow examples
- Decision trees
- Troubleshooting guides
- Command reference

### Example: Implementing ROAD-035

```
# Phase 1: Design
/superpowers:brainstorm
"Design the advertisement bot feature"

# Phase 2: Plan  
/superpowers:write-plan
"Create implementation plan with agent assignments"

# Phase 3: Execute
/superpowers:execute-plan
"Execute the plan with checkpoint reviews"

# Phase 4: Complete

---

## 🎛️ Automatic Development Workflow

**For maximum productivity, use the `@superpowers-orchestrator` agent which automates the complete development workflow.**

### Orchestrator Behavior

**The orchestrator will:**

1. **Auto-discover work** - Check ROADMAP.md for 🚧 (in-progress) items
2. **Present options** - Show list of active roadmap items for you to choose
3. **BDD-first** - Check/create scenarios (asks permission before creating)
4. **Auto-ensure app health** - Verify servers running, start if needed
5. **Execute Superpowers TDD** - Run full RED-GREEN-REFACTOR cycle
6. **Auto-fix failures** - Attempt to fix issues without asking (max 3 attempts)
7. **Quality gates** - Run all inspectors automatically
8. **UI review** - Only for UI-related changes
9. **Log everything** - Detailed log with model, agent, tools used

### Usage

```
@superpowers-orchestrator start development workflow
```

### Workflow Steps

**Phase 1: Discovery**
- Reads ROADMAP.md
- Finds items with 🚧 status
- Presents numbered list: "1. ROAD-035: Advertisement Bot, 2. ROAD-036: Campaign Tracker"
- You pick: "1" or "ROAD-035"

**Phase 2: BDD Verification** 
- Checks if BDD scenarios exist in `bdd/features/`
- If missing → **ASKS PERMISSION**: "Create BDD scenarios for ROAD-035?"
- If you say yes → `@bdd-writer` creates them
- Shows scenarios for your review

**Phase 3: Environment**
- `@site-keeper` checks Next.js + Convex status
- Auto-starts if down (no permission needed)
- Verifies clean test baseline

**Phase 4: Superpowers Execution**
```
/superpowers:execute-plan
  ├─ @bdd-writer: Create scenarios (if not exists)
  ├─ @code-writer: Implement domain layer
  ├─ @code-writer: Implement application layer  
  ├─ @code-writer: Implement infrastructure
  ├─ @bdd-runner: Run tests (RED → GREEN)
  └─ Auto-fix loop (if failures)
```

**Phase 5: Quality Gates (Auto-run)**
- `@architecture-inspector` → Reports violations
- `@ddd-aligner` → Reports domain issues
- `@bdd-runner` → Test results
- `@ci-runner` → CI status
- **Only if UI changes**: `@ux-ui-inspector` → UI review

**Phase 6: Auto-Fix (if issues)**
```
If any gate fails:
  1. Analyze failure type
  2. Delegate to appropriate agent to fix
  3. Re-run gate
  4. Repeat up to 3 times
  5. If still failing → Report to you with options
```

**Phase 7: Completion**
- `/superpowers:finish-branch`
- Update ROADMAP.md status
- **Delegate to @change-manager** to create CHANGE-XXX entry in docs/changes/
- Create execution log

### Execution Log Format

Every orchestrator run creates a log at `.opencode/logs/YYYY-MM-DD-HHMMSS-{ROAD-XXX}.md`:

```markdown
---
date: 2026-01-31
roadmap_item: ROAD-035
model: anthropic/claude-sonnet-4-20250514
agent: superpowers-orchestrator
started_at: 14:30:00
completed_at: 15:45:00
status: success
---

# Execution Log: ROAD-035

## Tools Used
- skill (superpowers-integration)
- task (bdd-writer, code-writer, architecture-inspector)
- bash (just dev-all, just bdd-test)
- edit (ROADMAP.md, CHANGELOG.md)

## Subagents Invoked
1. @site-keeper - Started dev servers
2. @bdd-writer - Created 5 scenarios
3. @code-writer - Implemented domain + app + infra
4. @architecture-inspector - Passed
5. @ddd-aligner - Passed
6. @bdd-runner - 5/5 tests passing
7. @ci-runner - All checks green
8. @ux-ui-inspector - N/A (no UI changes)

## Changes Made
- Created: src/advertising/domain/AdvertisementBot.ts
- Created: convex/advertising/mutations.ts
- Modified: docs/ROADMAP.md (status: 🚧 → ✅)
- Modified: docs/CHANGELOG.md (added CHANGE-XXX)

## Quality Gate Results
- Architecture: ✅ Pass
- Domain Model: ✅ Pass
- BDD Tests: ✅ 5/5 Pass
- CI Checks: ✅ Pass
- UX/UI: ⏭️ Skipped (no UI)

## Notes
- Had to retry code-writer once due to type error
- Auto-fixed by ci-runner lint --fix
```

### Permission Points

**The orchestrator ASKS before:**
- Creating new BDD scenarios
- Editing existing BDD scenarios
- Deleting any files
- Deploying to production
- Major architectural changes

**The orchestrator AUTO-EXECUTES:**
- Starting dev servers
- Running tests
- Fixing lint errors
- Updating documentation
- Creating new files
- Running CI checks

### Failure Handling

**Auto-fix attempts (max 3):**
1. **TypeScript errors** → `@code-writer` fixes types
2. **Lint errors** → `@ci-runner` runs lint-fix
3. **Test failures** → Analyze, delegate to appropriate agent
4. **Architecture violations** → `@code-writer` refactors

**After 3 failed attempts:**
- Report detailed failure to you
- Show options: retry, skip, manual fix, abort

### Best Practices

1. **Start orchestrator at beginning of work session**
   ```
   @superpowers-orchestrator start
   ```

2. **Let it run autonomously**
   - Check back in 30-60 minutes
   - Review the execution log
   - Approve any permission requests

3. **Review quality gate results**
   - Even if auto-fixed, understand what failed
   - Learn patterns to avoid future issues

4. **Check logs for insights**
   - See which agents were most active
   - Track auto-fix patterns
   - Identify recurring issues

---
/superpowers:finish-branch
"Finish and merge"
```

See the `superpowers-integration` skill for complete documentation.

---

## 🤖 Subagent System

ClawMarket uses a multi-agent system where specialized agents handle specific responsibilities. **Main agents should delegate to subagents rather than doing everything themselves.**

### Available Subagents

Located in `.claude/agents/`:

1. **site-keeper.md** - Development server manager
   - Keeps Next.js + Convex running
   - Troubleshoots port conflicts, build errors
   - **Use when**: Servers won't start, build issues, hot-reload problems

2. **code-writer.md** - Code implementation specialist
   - Writes domain layer, application services, infrastructure
   - Follows DDD and Hexagonal Architecture
   - **Use when**: Implementing features, refactoring, creating aggregates/value objects

3. **architecture-inspector.md** - Hexagonal architecture auditor
   - Verifies ports & adapters pattern
   - Checks dependency direction
   - **Use when**: After code changes, before PR, architectural reviews

4. **ddd-aligner.md** - Domain-Driven Design compliance
   - Ensures code matches domain docs
   - Verifies ubiquitous language
   - **Use when**: Domain model changes, new aggregates, cross-context communication

5. **ci-runner.md** - Continuous integration & testing
   - Runs lint, typecheck, tests, formatting
   - Auto-fixes when possible
   - **Use when**: Before commits, before PRs, CI failures

6. **bdd-writer.md** - BDD scenario specialist
   - Writes Gherkin feature files
   - **ALWAYS asks permission** before creating scenarios
   - **Use when**: New roadmap items, defining acceptance criteria

7. **bdd-runner.md** - BDD test execution
   - Runs BDD tests (parallel when possible)
   - Reports failures, coordinates fixes
   - **Use when**: After code changes, in BDD loop, before deployment

8. **ux-ui-inspector.md** - UX/UI quality reviewer
   - Checks accessibility, user flows, responsive design
   - Provides recommendations
   - **Use when**: UI changes, new pages/components, before launch

### When to Use Subagents

**Simple Tasks** (Main agent handles):
- Reading files
- Small code changes (1-2 lines)
- Documentation updates
- Running single commands

**Complex Tasks** (Delegate to subagents):
- Feature implementation → code-writer
- Architecture review → architecture-inspector + ddd-aligner
- Running full test suite → ci-runner + bdd-runner
- Writing BDD scenarios → bdd-writer
- UI review → ux-ui-inspector

### Multi-Agent Workflows

> **NEW**: All complex workflows now use Superpowers methodology with domain agents as the implementation layer.

**Example 1: Implementing a New Feature with Superpowers (ROAD-XXX)**

**Phase 1: Superpowers Design**
1. `/superpowers:brainstorm` → Refine design with TDD/BDD mindset
2. `/superpowers:write-plan` → Create tasks with agent assignments

**Phase 2: Domain Agent Implementation (via /superpowers:execute-plan)**
3. **bdd-writer** creates BDD scenarios (asks permission) - RED phase
4. **code-writer** implements domain layer (aggregates, value objects)
5. **code-writer** implements application services
6. **code-writer** implements infrastructure (Convex functions)
7. **architecture-inspector** verifies hexagonal compliance
8. **ddd-aligner** checks domain model alignment
9. **bdd-runner** runs tests - GREEN phase
10. **code-writer** refactors while keeping tests green - REFACTOR phase
11. **ci-runner** runs full CI suite

**Phase 3: Superpowers Completion**
12. `/superpowers:finish-branch` → Merge/PR/cleanup
13. **Main Agent** updates changelog & roadmap

**Example 2: Quick Bug Fix (Direct Agent Mode)**

*Note: Skip Superpowers for simple fixes*

1. **bdd-runner** reports test failures
2. **Main Agent** analyzes failure types
3. If server issue → **site-keeper** fixes
4. If missing code → **code-writer** implements
5. If test issue → **bdd-writer** fixes scenario
6. **bdd-runner** re-runs tests
7. **ci-runner** confirms all checks pass

**Example 3: Breaking Change with Migration (Superpowers)**

**Phase 1: Design**
1. `/superpowers:brainstorm` → Migration strategy
2. `/superpowers:write-plan` → Tasks including data migration

**Phase 2: Implementation**
3. **bdd-writer** → Migration BDD scenarios
4. **code-writer** → New aggregate structure
5. **code-writer** → Migration scripts
6. **bdd-runner** → Test migration
7. **architecture-inspector** → Verify backwards compatibility
8. **ci-runner** → Full validation

**Phase 3: Complete**
9. `/superpowers:finish-branch` → Deploy with migration

---

## 📌 Just Command Philosophy

**Golden Rule**: Never run tools directly. Always use `just` recipes.

### Why Just Commands?

✅ **Consistency**: Same commands work for everyone
✅ **Discoverability**: `just --list` shows all options
✅ **Maintainability**: Update command in one place (justfile)
✅ **Simplicity**: Short aliases (just d = just dev-all)

### Common Patterns

❌ **Don't**:
```bash
~/.bun/bin/bun dev
~/.bun/bin/bunx convex dev
cd stack-tests && npm test
```

✅ **Do**:
```bash
just dev-all
just bdd-test
```

### Essential Just Commands

**Development**:
- `just dev-all` - Start Next.js + Convex
- `just dev` - Start Next.js only
- `just convex-dev` - Start Convex only

**Testing**:
- `just test` - Run unit tests
- `just bdd-test` - Run all BDD tests
- `just bdd-tag @smoke` - Run smoke tests
- `just bdd-roadmap ROAD-004` - Test specific roadmap item
- `just check` - Run all checks (lint + typecheck + test)

**BDD Specific**:
- `just bdd-api` - API tests only
- `just bdd-ui` - UI tests only
- `just bdd-hybrid` - E2E tests only
- `just bdd-headed` - Run UI tests with visible browser
- `just bdd-gen` - Generate BDD test files
- `just bdd-report` - Open test report

**Code Quality**:
- `just lint` - Run ESLint
- `just lint-fix` - Auto-fix linting issues
- `just format` - Format code
- `just typecheck` - TypeScript type checking

**Complete Reference**: See [`COMMANDS.md`](./COMMANDS.md)

### When Just Commands Don't Exist

If you need to run something not in justfile:

1. **Check if it should be a recipe**
   - Will it be run again?
   - Is it complex or hard to remember?
   - Would others benefit?

2. **If yes, add to justfile**:
   ```just
   # Description of what this does
   recipe-name:
       command here
   ```

3. **Update COMMANDS.md** with the new recipe

4. **Then use it**: `just recipe-name`

---

## 📋 Required Actions

### When Making ANY Code Changes

1. **Create CHANGE Entry via @change-manager**
   - **DO NOT** edit CHANGELOG.md directly
   - Delegate to @change-manager: "Create CHANGE-XXX for ROAD-XXX"
   - Creates individual file: `docs/changes/CHANGE-XXX.md`
   - Includes full governance frontmatter (compliance, signatures, test results)
   - Format: `### [CHANGE-XXX] Title - YYYY-MM-DD`
   - Link to roadmap items: `**Roadmap**: [ROAD-XXX](../roads/ROAD-XXX.md)`

2. **Update ROADMAP.md (if applicable)**
   - Update status emoji (🎯 → 🚧 → ✅)
   - Update "Started" and "Completed" dates
   - Add "Related Changes" links

3. **Check Documentation**
   - Update README.md if architecture changes
   - Update DDD docs if domain changes
   - Update COMMANDS.md if new Just recipes

---

## 📝 Changelog Entry Template

```markdown
### [CHANGE-XXX] Brief Description - YYYY-MM-DD

**Roadmap**: [ROAD-XXX], [ROAD-YYY] (if applicable)
**Type**: Added | Changed | Fixed | Security | etc.
**Author**: AI Agent

#### Added
- List new features/files
- Be specific with file paths

#### Changed
- List modifications to existing code
- Explain why if not obvious

#### Fixed
- List bugs fixed
- Reference issue numbers if any

#### Technical Details
- Implementation notes
- Architecture decisions
- Performance implications

#### What Works
- How to test the changes
- User-facing behavior
```

---

## 🗺️ Roadmap Item Statuses

Update status in `docs/ROADMAP.md`:

- 🎯 **Planned** - Not started yet
- 🚧 **In Progress** - Currently working on it (set this when you start)
- ✅ **Complete** - Finished (set this when done + link CHANGE-XXX)
- 🔄 **Iterating** - Done but being improved
- ⏸️ **Paused** - Temporarily deprioritized
- ❌ **Cancelled** - Not doing this anymore

---

## 🏗️ Project Architecture

### Domain-Driven Design

This project follows DDD principles:

```
src/
├── bot-identity/           # Bounded Context 1
│   ├── domain/            # Business logic (aggregates, value objects)
│   ├── application/       # Use cases, services
│   └── infrastructure/    # Convex integration
├── promise-market/         # Bounded Context 2
├── token-management/       # Bounded Context 3
├── settlement-verification/ # Bounded Context 4
└── shared/                # Shared kernel (common value objects)
```

**Key Principles**:
1. **Domain layer** has NO dependencies on other layers
2. **Aggregates** enforce business rules
3. **Value objects** are immutable
4. **Domain events** for cross-context communication
5. **Convex functions** are in infrastructure layer

### When Adding Features

1. **Start with Domain Layer**
   - Create value objects (if needed)
   - Create/update aggregates
   - Define business rules

2. **Application Layer**
   - Create application services
   - Orchestrate use cases

3. **Infrastructure Layer**
   - Create Convex mutations/queries
   - Wire up to domain

4. **UI Layer**
   - Create React components
   - Use Convex hooks

---

## 📁 File Organization

### Naming Conventions

- **Aggregates**: PascalCase (e.g., `BotAccount.ts`)
- **Value Objects**: PascalCase (e.g., `TokenAmount.ts`)
- **Convex Functions**: camelCase (e.g., `registerBot`)
- **React Components**: PascalCase (e.g., `BotRegistrationForm.tsx`)
- **Just Recipes**: kebab-case (e.g., `just dev-all`)

### Where to Put Things

| Type | Location | Example |
|------|----------|---------|
| Aggregate | `src/{context}/domain/` | `BotAccount.ts` |
| Value Object | `src/shared/domain/value-objects/` | `TokenAmount.ts` |
| Application Service | `src/{context}/application/` | `BotRegistrationService.ts` |
| Convex Mutation | `convex/{context}/mutations.ts` | `registerBot` |
| Convex Query | `convex/{context}/queries.ts` | `getBotById` |
| React Component | `components/{context}/` | `BotRegistrationForm.tsx` |
| Page | `app/{route}/page.tsx` | `app/register/page.tsx` |

---

## 🧪 Testing Requirements

When adding features:

1. **Domain Tests** (when implemented)
   - Test aggregates
   - Test value objects
   - Test business rules
   - Target: 90%+ coverage

2. **Integration Tests** (when implemented)
   - Test Convex functions
   - Test application services
   - Target: 80%+ coverage

3. **Manual Testing**
   - Document test steps in changelog
   - Include in "What Works" section

---

## 🔐 Security Considerations

**ALWAYS**:
- Hash API keys (never store plaintext)
- Validate all inputs (never trust user input)
- Sanitize outputs (prevent XSS)
- Use parameterized queries (prevent injection)
- Rate limit API endpoints
- Never commit secrets to git

**When handling sensitive data**:
- API keys: SHA-256 hash
- Passwords: bcrypt (if added)
- Tokens: encrypted at rest
- PII: minimal collection

---

## 🚀 Deployment Process

When ready to deploy:

1. **Check everything**
   ```bash
   just check    # Runs lint + typecheck + test
   ```

2. **Update version** (if needed)
   - Update `package.json` version
   - Create CHANGE entry in docs/changes/ via @change-manager

3. **Deploy**
   ```bash
   just deploy   # Deploys Vercel + Convex
   ```

4. **Create CHANGE Entry**
   - Use @change-manager to create deployment CHANGE entry
   - Mark roadmap items as complete in ROADMAP.md

---

## 📖 Documentation Standards

### Code Comments

```typescript
/**
 * Brief description of what this does
 *
 * Longer explanation if needed, including:
 * - Use cases
 * - Edge cases
 * - Business rules
 *
 * @param foo - What foo represents
 * @returns What is returned
 */
```

### DDD Documentation

If adding new domain concepts:
1. Add to `docs/ddd/03-ubiquitous-language.md`
2. Update relevant DDD docs
3. Keep docs in sync with code

---

## 🎨 Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Let Prettier handle it
- **Naming**: Use ubiquitous language from DDD docs
- **Imports**: Group by source (React, lib, local)
- **Components**: Functional components with hooks

---

## 🐛 When Things Break

1. **Check logs**
   ```bash
   just logs          # Convex logs
   just logs-follow   # Follow logs
   ```

2. **Reset if needed**
   ```bash
   just reset   # Clean reinstall
   ```

3. **Document the fix**
   - Add to CHANGELOG under "Fixed"
   - Explain root cause
   - Describe solution

---

## 🤝 Communication

### Commit Messages

```
type(scope): brief description

Longer description if needed.

Roadmap: [ROAD-XXX]
Changelog: [CHANGE-XXX]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Pull Requests (when used)

Template:
```markdown
## Description
Brief description of changes

## Roadmap Items
- [ROAD-XXX] Feature Name

## Changelog
- [CHANGE-XXX] Entry added

## Testing
How to test these changes

## Screenshots (if UI)
Before/After images
```

---

## 🔄 Continuous Improvement

### After Completing a Feature

1. ✅ Update ROADMAP.md status
2. ✅ Add detailed CHANGELOG entry
3. ✅ Update relevant documentation
4. ✅ Add tests (when framework ready)
5. ✅ Deploy (if ready)
6. ✅ Monitor logs for issues

### Regular Maintenance

- Review ROADMAP.md weekly
- Archive old CHANGELOG entries monthly
- Update dependencies monthly (`just update`)
- Security audit quarterly (`just audit`)

---

## 📚 Key Documents to Know

| Document | Purpose | Update When |
|----------|---------|-------------|
| `AGENT.md` | This file - agent instructions | Rarely |
| `docs/ROADMAP.md` | Feature roadmap | Starting/completing features |
| `docs/CHANGELOG.md` | Change history | Every change |
| `README.md` | Project overview | Major architecture changes |
| `docs/ddd/*.md` | Domain documentation | Domain model changes |
| `COMMANDS.md` | Just recipe reference | Adding recipes |

---

## ⚡ Quick Reference

```bash
# Development
just dev-all       # Start everything
just d             # Shortcut

# Testing
just test          # Run tests
just check         # Lint + typecheck + test

# Deployment
just deploy        # Deploy to prod
just p             # Shortcut

# Documentation
just docs-dev      # Start docs site
just info          # Show project info

# Utilities
just clean         # Clean build artifacts
just reset         # Full reinstall
```

---

## 🎯 Current Focus

Check `docs/ROADMAP.md` for:
- Current phase
- In-progress items (🚧)
- Next priorities

---

## 📞 Questions?

- DDD concepts: See `docs/ddd/`
- Commands: See `COMMANDS.md`
- Architecture: See `docs/ddd/09-architecture-decisions.md`
- Setup: See `README.md`

---

**Remember**: Documentation is code. Keep it updated! 📝

**Current Version**: 1.0.0
**Last Updated**: 2026-01-31
