---
sidebar_position: 2
title: Quick Reference
---

# Agent System Quick Reference

## Just Commands by Agent

### Site Keeper Commands
```bash
just dev-all          # Start Next.js + Convex
just dev              # Start Next.js only
just convex-dev       # Start Convex only
```

### Code Writer Commands
```bash
just typecheck        # TypeScript type checking
just lint             # Run ESLint
just test             # Run unit tests
```

### CI Runner Commands
```bash
just check            # Run all checks (lint + typecheck + test)
just lint-fix         # Auto-fix linting issues
just format           # Format code with Prettier
just test-coverage    # Run tests with coverage report
```

### BDD Runner Commands
```bash
just bdd-test         # Run all BDD tests
just bdd-api          # Run API tests only (fast)
just bdd-ui           # Run UI tests only
just bdd-hybrid       # Run hybrid/E2E tests
just bdd-tag @smoke   # Run smoke tests
just bdd-roadmap ROAD-004  # Test specific roadmap item
just bdd-headed       # Run with visible browser
just bdd-report       # Open HTML test report
```

### BDD Writer Commands
```bash
just bdd-gen          # Generate BDD test files from feature specs
just bdd-clean        # Clean generated test files
```

### Capability & User Story Commands
```bash
just bdd-validate-cap-tags          # Validate @CAP-XXX tags exist
just bdd-validate-cap-tags-strict   # Validate all features have capability tags
just capability-coverage            # Show capability test coverage
just capability-coverage-json       # Coverage report in JSON
```

### Governance Linter Commands
```bash
./scripts/governance-linter.js ROAD-005           # Lint specific ROAD
./scripts/governance-linter.js CAP-001            # Lint specific capability
./scripts/governance-linter.js US-001             # Lint specific user story
./scripts/governance-linter.js --all-roads        # Lint all ROADs
./scripts/governance-linter.js --capabilities     # Lint all capabilities
./scripts/governance-linter.js --user-stories     # Lint all user stories
./scripts/governance-linter.js --ci               # CI mode (lints everything)
```

## Common Workflows

### Workflow 1: Check Everything Before Commit
```bash
# Run all quality checks
just check

# If issues found, auto-fix what's possible
just lint-fix
just format

# Re-check
just check
```

### Workflow 2: Run BDD Tests
```bash
# Start servers (keep running in background)
just dev-all

# In another terminal, run BDD tests
just bdd-tag @smoke           # Quick smoke tests
just bdd-roadmap ROAD-004     # Test specific feature
just bdd-test                 # Run all tests
```

### Workflow 3: Implement New Feature
```bash
# 1. Review BDD scenarios (already exist or create with BDD Writer)

# 2. Validate capability tags
just bdd-validate-cap-tags

# 3. Run tests (Red phase - will fail)
just bdd-roadmap ROAD-XXX

# 4. Implement feature (Code Writer)
# ... write code ...

# 5. Run tests again (Green phase - should pass)
just bdd-roadmap ROAD-XXX

# 6. Validate governance
./scripts/governance-linter.js ROAD-XXX

# 7. Run full checks
just check

# 8. Check capability coverage
just capability-coverage

# 9. View test report
just bdd-report
```

## Agent Autonomy Levels

| Agent | Can Execute Without Permission | Requires Approval For |
|-------|-------------------------------|----------------------|
| Site Keeper ⚡ | Restart servers, fix ports | Manual intervention |
| Code Writer 🔶 | Implement features | Architecture changes |
| CI Runner ⚡ | Auto-fix lint/format | - |
| BDD Runner ⚡ | Execute tests | - |
| BDD Writer 🔒 | Draft scenarios | **Creating scenarios** |
| Architecture Inspector 🔒 | Report issues | Code modifications |
| DDD Aligner 🔶 | Update docs | Domain model changes |
| UX/UI Inspector 🔒 | Recommendations | UI changes |

**Legend**:
- ⚡ High - Can execute most actions automatically
- 🔶 Medium - Can execute within guidelines, needs approval for major changes
- 🔒 Low - Primarily advisory, requires approval for actions

## Quick Decision Tree

### "Should I run tests?"

```
Is it a new feature? ──Yes──> Run BDD tests for that roadmap item
    │                         just bdd-roadmap ROAD-XXX
    No
    │
Is it a bug fix? ──Yes──────> Run affected BDD tests + unit tests
    │                         just bdd-tag @component
    │                         just test
    No
    │
Is it a refactor? ──Yes────> Run all tests to ensure nothing broke
                              just bdd-test
                              just test
```

### "Which agent should handle this?"

```
Server not running? ─────────> Site Keeper
Need to implement code? ─────> Code Writer
Tests failing? ──────────────> BDD Runner (diagnose) → Code Writer (fix)
Need BDD scenarios? ─────────> BDD Writer (asks permission first!)
Architecture review? ────────> Architecture Inspector
Domain model change? ────────> DDD Aligner
UI/UX issue? ────────────────> UX/UI Inspector
Quality checks? ─────────────> CI Runner
```

### "Does this feature have proper documentation?"

```
Has capability tags? ──No──> Add @CAP-XXX tags to BDD tests
    │                           just bdd-validate-cap-tags
    Yes
    │
Linked to capability? ──No──> Add to ROAD front matter
    │                           governance.capabilities
    Yes
    │
Linked to use case? ──No──> Add to US front matter
    │                           use_cases
    Yes
    │
Lint passes? ──No──> Fix validation errors
    │                 ./scripts/governance-linter.js --ci
    Yes
    │
Coverage OK? ──No──> Add missing tests
                      just capability-coverage
```

## Status Indicators

Agents use consistent status indicators:

- ✅ **Success** - Task completed successfully
- ❌ **Failure** - Task failed, action required
- ⚠️ **Warning** - Issue found but not blocking
- 🔄 **In Progress** - Task currently executing
- ⏸️ **Waiting** - Waiting for input or dependency

## Example Reports

### Good Report Format

```
✅ BDD Runner Report: Tests Passing

Summary:
  Features: 18
  Scenarios: 127/127 passed
  Duration: 4m 32s

By Context:
  ✅ Bot Identity: 35 scenarios
  ✅ Token Management: 28 scenarios
  ✅ Promise Market: 45 scenarios
  ✅ Settlement: 19 scenarios

Report: stack-tests/cucumber-report/index.html
```

### Bad Report Format

```
Some tests passed. A few failed. Not sure why.
Maybe check the logs?
```

## Troubleshooting

### Tests Won't Run

```bash
# 1. Check if dependencies installed
just bdd-install

# 2. Ensure servers are running
just dev-all

# 3. Verify environment variables
cat stack-tests/.env

# 4. Try generating tests again
just bdd-gen
```

### Servers Won't Start

```bash
# 1. Check for port conflicts
lsof -ti:3000
lsof -ti:3001

# 2. Kill conflicting processes
kill -9 <PID>

# 3. Clean and restart
just clean
just install
just dev-all
```

### CI Checks Failing

```bash
# 1. Auto-fix what's possible
just lint-fix
just format

# 2. Check TypeScript errors
just typecheck

# 3. Run tests
just test

# 4. Run full check
just check
```

## Next Steps

- [Learn about Agent Coordination](./coordination)
- [Understand the BDD Loop](./bdd-loop)
- [Read full agent specifications](../../.claude/agents/)

---

**Tip**: Keep this page bookmarked for quick reference during development!
