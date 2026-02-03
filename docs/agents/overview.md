---
sidebar_position: 1
title: Multi-Agent System Overview
---

# ClawMarket Multi-Agent System

**Version**: 1.0.0
**Last Updated**: 2026-01-31

## What is the Multi-Agent System?

ClawMarket uses a **collaborative AI agent architecture** where specialized agents work together to develop, test, and maintain the codebase. Instead of a single AI doing everything, each agent has specific expertise, responsibilities, and autonomy levels.

## Why Multi-Agent Architecture?

### Traditional Single-Agent Approach
❌ One agent tries to do everything
❌ Context switching between tasks
❌ Easy to miss best practices
❌ Limited specialization

### Multi-Agent Approach (ClawMarket)
✅ Specialized expertise per domain
✅ Parallel execution of tasks
✅ Built-in quality gates
✅ Clear ownership and accountability

## The 8 Specialized Agents

### Development Agents

#### 1. Site Keeper 🏠
**Role**: Infrastructure & Server Management
**Autonomy**: High ⚡

- Keep Next.js and Convex dev servers running
- Auto-fix port conflicts
- Monitor server health

[Learn more →](./site-keeper)

#### 2. Code Writer 💻
**Role**: Feature Implementation
**Autonomy**: Medium 🔶

- Implement features following DDD + Hexagonal Architecture
- Write domain models, application services, infrastructure adapters
- Ensure business logic in domain layer

[Learn more →](./code-writer)

### Quality Agents

#### 3. CI Runner ⚙️
**Role**: Continuous Integration
**Autonomy**: High ⚡

- Run linting, type checking, tests
- Auto-fix formatting and minor issues
- Validate capability tags in BDD tests
- Generate coverage reports
- Generate capability coverage reports

[Learn more →](./ci-runner)

#### 4. BDD Runner 🧪
**Role**: BDD Test Execution
**Autonomy**: High ⚡

- Execute BDD tests in parallel
- Categorize test failures
- Coordinate fixes with appropriate agents

[Learn more →](./bdd-runner)

#### 5. BDD Writer ✍️
**Role**: BDD Scenario Creation
**Autonomy**: Low 🔒 (Always asks permission)

- Write Gherkin feature files
- Tag scenarios with roadmap IDs (@ROAD-XXX)
- Tag scenarios with capability IDs (@CAP-XXX)
- Use ubiquitous language
- Validate capability tags exist

[Learn more →](./bdd-writer)

### Review Agents

#### 6. Architecture Inspector 🏗️
**Role**: Hexagonal Architecture Auditor
**Autonomy**: Low 🔒 (Reports only)

- Verify ports & adapters pattern
- Check dependency direction
- Identify architectural violations

[Learn more →](./architecture-inspector)

#### 7. DDD Aligner 📐
**Role**: Domain-Driven Design Compliance
**Autonomy**: Medium 🔶

- Ensure code matches domain documentation
- Verify ubiquitous language usage
- Check aggregate boundaries

[Learn more →](./ddd-aligner)

#### 8. UX/UI Inspector 🎨
**Role**: User Experience & Accessibility
**Autonomy**: Low 🔒 (Recommendations only)

- Check WCAG 2.1 AA accessibility compliance
- Review user flows
- Test responsive design

[Learn more →](./ux-ui-inspector)

## Quick Start

### Running Tests with Agents

```bash
# BDD Runner executes all tests
just bdd-test

# Run tests for specific roadmap item
just bdd-roadmap ROAD-004

# Run smoke tests only
just bdd-tag @smoke
```

### Implementing a Feature

```bash
# 1. BDD Writer creates scenarios (with permission)
# 2. BDD Runner runs tests (Red phase)
just bdd-roadmap ROAD-005

# 3. Code Writer implements feature
# 4. Architecture Inspector + DDD Aligner review
# 5. BDD Runner runs tests again (Green phase)
just bdd-roadmap ROAD-005

# 6. CI Runner runs all checks
just check
```

## Agent Coordination

Agents work together in coordinated workflows:

```
Main Orchestrator
    ↓ delegates to
BDD Writer (asks permission)
    ↓ creates scenarios
BDD Runner (tests fail - Red)
    ↓ reports to
Code Writer
    ↓ implements & delegates to
Architecture Inspector + DDD Aligner
    ↓ approve & report to
BDD Runner (tests pass - Green)
    ↓ reports to
CI Runner (full checks)
    ↓ confirms to
Main Orchestrator
```

## Next Steps

- [Learn about Agent Coordination](./coordination)
- [Understand the BDD Loop](./bdd-loop)
- [Read individual agent guides](./site-keeper)

---

**Related Documentation**:
- [DDD Overview](../ddd/domain-overview)
- [Roadmap](/ROADMAP)
- [Changelog](/CHANGELOG)
