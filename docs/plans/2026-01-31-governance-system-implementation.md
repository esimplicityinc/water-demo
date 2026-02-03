# Governance-Driven Approval System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a deterministic approval system where ADRs and NFRs govern all changes, with every CHANGE tied to a ROAD item that must pass BDD and NFR gates.

**Architecture:** ADRs (individual files with front matter) + NFRs (per-type files) define governance rules. ROAD items track compliance state. CHANGE entries require evidence of passing all gates. Strict enforcement via validation scripts.

**Tech Stack:** YAML front matter, Markdown, validation scripts (TypeScript/Node), CI/CD integration

---

## Overview

This plan transforms ClawMarket's documentation into a **governance-driven system** where:

1. **ADRs** are individual files with front matter defining architectural rules
2. **NFRs** are split by type (performance, security, accessibility) defining standards
3. **ROAD items** track compliance against ADRs and NFRs
4. **CHANGE entries** require proof of passing all gates
5. **Strict enforcement** prevents progression without satisfying all requirements

### Governance Flow

```
ROAD-XXX: proposed → adr_validated → bdd_pending → bdd_complete → implementing → nfr_validating → complete
                  ↓                ↓              ↓
              ADR check         BDD scenarios   NFR gates
              (@arch-inspector) (@bdd-writer   (@performance-agent
                                 @bdd-runner)   @security-agent
                                                @a11y-agent)
                                                        ↓
CHANGE-XXX: draft → linked_to_road → adr_compliant → nfr_passed → published
```

---

## Prerequisites

Before starting:
- Read `docs/ddd/09-architecture-decisions.md` (contains all 24 ADRs to refactor)
- Read `docs/ROADMAP.md` (understand current ROAD format)
- Read `docs/CHANGELOG.md` (understand current CHANGE format)
- Read `docs/bdd/` and `docs/ddd/` directories

---

## Task 1: Create ADR Directory Structure

**Files:**
- Create: `docs/adr/` directory
- Create: `docs/adr/README.md`
- Create: `docs/adr/adr-001-domain-driven-design.md` through `docs/adr/adr-024-*.md`

**Step 1: Create ADR directory**

```bash
mkdir -p docs/adr
```

**Step 2: Create ADR README template**

```markdown
---
title: Architecture Decision Records (ADRs)
description: All architectural decisions for ClawMarket
last_updated: 2026-01-31
---

# Architecture Decision Records

This directory contains all architectural decisions for ClawMarket.

## Format

Each ADR is a separate Markdown file with YAML front matter:

```yaml
---
id: ADR-XXX
title: [Short Title]
status: accepted  # proposed | accepted | deprecated | superseded
category: [architecture | infrastructure | security | performance]
scope: project-wide
created: YYYY-MM-DD
---
```

## Categories

- **Architecture**: High-level design patterns (DDD, Hexagonal, etc.)
- **Infrastructure**: Deployment, runtime, database choices
- **Security**: Authentication, authorization, data protection
- **Performance**: Optimization strategies, caching, scalability

## Status Definitions

- **Proposed**: Under discussion, not yet accepted
- **Accepted**: Active governance rule - all changes must comply
- **Deprecated**: No longer recommended, but not actively harmful
- **Superseded**: Replaced by a newer ADR (see `superseded_by` field)

## Active Governance Rules

| ID | Title | Category | Status |
|----|-------|----------|--------|
| ADR-001 | Domain-Driven Design | Architecture | Accepted |
| ... | ... | ... | ... |

```

**Step 3: Commit**

```bash
git add docs/adr/README.md
git commit -m "docs: create ADR directory structure and README"
```

---

## Task 2: Refactor ADR-001 (Domain-Driven Design)

**Files:**
- Create: `docs/adr/adr-001-domain-driven-design.md`
- Reference: `docs/ddd/09-architecture-decisions.md` lines 7-29

**Step 1: Extract ADR-001 content**

Copy from `docs/ddd/09-architecture-decisions.md`:
- Title: "Adopt Domain-Driven Design"
- Status: Accepted
- Context: lines 11-15
- Decision: lines 17-21
- Consequences: lines 23-28

**Step 2: Create ADR file with front matter**

```markdown
---
id: ADR-001
title: Adopt Domain-Driven Design
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-001: Adopt Domain-Driven Design

## Status

**Accepted**

## Context

ClawMarket is a complex marketplace with multiple interacting domains (identity, trading, tokens, settlement). We need an architecture that:
- Reflects business complexity
- Enables team scalability
- Maintains clean separation of concerns
- Supports evolution without major rewrites

## Decision

Use Domain-Driven Design (DDD) with:
- Bounded contexts for major subdomains
- Aggregates for consistency boundaries
- Domain events for inter-context communication
- Ubiquitous language shared with domain experts

## Consequences

**Positive:**
- Domain logic centralized in domain layer
- Clear context boundaries
- Easier to onboard new developers (read the domain docs)

**Negative:**
- Requires discipline to maintain boundaries
- More upfront design vs. simple CRUD

## Governance

All changes MUST:
- Respect bounded context boundaries
- Use aggregates for consistency
- Emit domain events for cross-context communication
- Follow ubiquitous language from `docs/ddd/03-ubiquitous-language.md`

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Hexagonal architecture compliance, bounded context boundaries
```

**Step 3: Commit**

```bash
git add docs/adr/adr-001-domain-driven-design.md
git commit -m "docs(adr): extract ADR-001 Domain-Driven Design with front matter"
```

---

## Task 3: Refactor ADR-002 (Modular Monolith)

**Files:**
- Create: `docs/adr/adr-002-modular-monolith.md`
- Reference: `docs/ddd/09-architecture-decisions.md` lines 32-56

**Step 1: Extract ADR-002 content**

From lines 32-56 of architecture decisions document.

**Step 2: Create ADR file**

```markdown
---
id: ADR-002
title: Modular Monolith over Microservices (v1)
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-002: Modular Monolith over Microservices (v1)

## Status

**Accepted**

## Context

We're a small team building an MVP. We need to move fast but want to design for future microservices migration.

## Decision

Build as a modular monolith where:
- Each bounded context is a module with clear boundaries
- All contexts share a database (Convex) but have logical separation
- Event bus is in-process (Convex reactive system)
- Can extract to microservices later without domain rewrite

## Consequences

**Positive:**
- Fast development and deployment
- Easy local development
- Shared transactions (escrow + promise acceptance atomic)
- Simple infrastructure

**Negative:**
- Must enforce module boundaries via code reviews/linting
- All contexts scale together (can't scale settlement independently)

## Migration Path

Extract contexts to services when:
- Team grows beyond 10 engineers
- Contexts have different scaling needs
- Contexts need different tech stacks

## Governance

All changes MUST:
- Maintain module boundaries (no direct imports between contexts)
- Use domain events for inter-context communication
- Keep all database access within bounded context

## Validation

**Enforced by:** `@arch-inspector`
**Check:** No cross-context imports, proper event-driven communication
```

**Step 3: Commit**

```bash
git add docs/adr/adr-002-modular-monolith.md
git commit -m "docs(adr): extract ADR-002 Modular Monolith with front matter"
```

---

## Task 4: Continue Refactoring Remaining ADRs (003-024)

**Pattern for each ADR:**

For ADR-003 through ADR-024, follow the same pattern:

1. Extract content from `docs/ddd/09-architecture-decisions.md`
2. Create file: `docs/adr/adr-XXX-kebab-case-title.md`
3. Add front matter with `id`, `title`, `status: accepted`, `category`, `scope: project-wide`, `created: 2026-01-31`
4. Include Governance and Validation sections
5. Commit each ADR separately

**ADR List to Extract:**

| # | Title | Category | Lines |
|---|-------|----------|-------|
| 003 | Convex for Backend and Database | Infrastructure | 59-86 |
| 004 | Next.js for Frontend | Infrastructure | 89-106 |
| 005 | Event-Driven Communication | Architecture | 109-134 |
| 006 | Aggregates as Consistency Boundaries | Architecture | 137-161 |
| 007 | Hybrid Settlement | Architecture | 164-194 |
| 008 | Hybrid Token Model | Architecture | 197-225 |
| 009 | API Key Authentication | Security | 228-258 |
| 010 | Stake Requirements | Architecture | 261-291 |
| 011 | Order Book Style Market | Architecture | 294-321 |
| 012 | Promise Lifecycle States | Architecture | 324-356 |
| 013 | Value Objects for Domain Primitives | Architecture | 359-378 |
| 014 | Real-Time Order Book Updates | Performance | 381-397 |
| 015 | Eventual Consistency Between Contexts | Architecture | 400-424 |
| 016 | Convex Functions as Application Services | Architecture | 427-473 |
| 017 | Bun as Runtime and Package Manager | Infrastructure | 496-524 |
| 018 | Vercel for Deployment | Infrastructure | 527-554 |
| 019 | Tailwind CSS for Styling | Infrastructure | 557-589 |
| 020 | shadcn/ui for Component Library | Infrastructure | 592-627 |
| 021 | Clerk for Authentication | Security | 630-662 |
| 022 | Security Best Practices | Security | 665-700 |
| 023 | (Continue if exists) | | |
| 024 | (Continue if exists) | | |

**Batch commit after every 5 ADRs:**

```bash
git add docs/adr/
git commit -m "docs(adr): extract ADRs 003-007 with front matter"
```

---

## Task 5: Update Main Architecture Decisions Document

**Files:**
- Modify: `docs/ddd/09-architecture-decisions.md`

**Step 1: Replace content with index**

Replace the entire file with an index pointing to individual ADRs:

```markdown
---
title: Architecture Decisions
description: Index of all architectural decisions for ClawMarket
---

# Architecture Decisions

This document indexes all architectural decisions (ADRs) for ClawMarket.

**Full ADRs are now in:** `docs/adr/`

## Active Decisions

| ID | Title | Category | Status |
|----|-------|----------|--------|
| [ADR-001](../adr/adr-001-domain-driven-design) | Domain-Driven Design | Architecture | ✅ Accepted |
| [ADR-002](../adr/adr-002-modular-monolith) | Modular Monolith over Microservices | Architecture | ✅ Accepted |
| [ADR-003](../adr/adr-003-convex-backend) | Convex for Backend and Database | Infrastructure | ✅ Accepted |
| ... | ... | ... | ... |

## Governance

All accepted ADRs are active governance rules. Every change must comply with all accepted ADRs.

See individual ADR files for:
- Full decision context
- Consequences
- Governance requirements
- Validation criteria

## Contributing

To propose a new ADR:
1. Create `docs/adr/adr-XXX-title.md` with status `proposed`
2. Include full context, decision, consequences
3. Request review from @arch-inspector
4. Upon acceptance, change status to `accepted`
```

**Step 2: Commit**

```bash
git add docs/ddd/09-architecture-decisions.md
git commit -m "docs(adr): convert architecture decisions to index pointing to individual ADRs"
```

---

## Task 6: Create NFR Directory and README

**Files:**
- Create: `docs/nfr/` directory
- Create: `docs/nfr/README.md`

**Step 1: Create NFR directory**

```bash
mkdir -p docs/nfr
```

**Step 2: Create NFR README**

```markdown
---
title: Non-Functional Requirements (NFRs)
description: Standards for performance, security, and accessibility
last_updated: 2026-01-31
---

# Non-Functional Requirements (NFRs)

This directory contains all non-functional requirements that govern ClawMarket.

## Types

- **Performance**: Response times, throughput, resource usage
- **Security**: Vulnerability thresholds, compliance standards
- **Accessibility**: WCAG standards, assistive technology support

## Format

Each NFR type is a separate Markdown file with YAML front matter:

```yaml
---
id: NFR-[TYPE]-001
type: [performance | security | accessibility]
scope: project-wide
created: YYYY-MM-DD
---
```

## Active Gates

| Type | ID | Description |
|------|-----|-------------|
| Performance | NFR-PERF-001 | API response times, bundle size |
| Security | NFR-SEC-001 | Vulnerability scanning, dependencies |
| Accessibility | NFR-A11Y-001 | WCAG 2.1 AA compliance |

## Governance

Every ROAD item must pass all applicable NFR gates before being marked complete.
```

**Step 3: Commit**

```bash
git add docs/nfr/README.md
git commit -m "docs(nfr): create NFR directory structure and README"
```

---

## Task 7: Create Performance NFR Document

**Files:**
- Create: `docs/nfr/nfr-performance-001.md`

**Step 1: Create performance NFR file**

```markdown
---
id: NFR-PERF-001
type: performance
scope: project-wide
created: 2026-01-31
last_updated: 2026-01-31
enforced_by: "@performance-agent"
---

# NFR-PERF-001: Performance Standards

## Status

**Active**

## Scope

All API endpoints, frontend pages, and background processes.

## Criteria

### API Response Times

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| p50 response time | < 100ms | `npm run test:performance` |
| p95 response time | < 200ms | `npm run test:performance` |
| p99 response time | < 500ms | `npm run test:performance` |

### Frontend Performance

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| First Contentful Paint | < 1.5s | Lighthouse CI |
| Time to Interactive | < 3.5s | Lighthouse CI |
| Bundle size (initial) | < 500KB | `npm run analyze` |
| Bundle size (total) | < 2MB | `npm run analyze` |

### Database Performance

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| Query execution time | < 50ms | Convex monitoring |
| Index usage | > 95% | Convex analytics |

## Gates

Performance validation runs at:
- **Implementing stage**: Baseline benchmarks
- **Complete stage**: Final validation (must pass)

## Enforcement

**Enforced by:** `@performance-agent`
**CI Check:** `performance-tests` workflow
**Failure Action:** Blocks ROAD item from `complete` status

## Evidence Requirements

When marking NFR as passed, include:
- Link to CI run
- Screenshot of metrics dashboard
- Performance test results file

## Exceptions

None. All changes must meet performance standards.
```

**Step 2: Commit**

```bash
git add docs/nfr/nfr-performance-001.md
git commit -m "docs(nfr): create performance NFR with standards and gates"
```

---

## Task 8: Create Security NFR Document

**Files:**
- Create: `docs/nfr/nfr-security-001.md`
- Reference: ADR-022 Security Best Practices

**Step 1: Create security NFR file**

```markdown
---
id: NFR-SEC-001
type: security
scope: project-wide
created: 2026-01-31
last_updated: 2026-01-31
enforced_by: "@security-agent"
---

# NFR-SEC-001: Security Standards

## Status

**Active**

## Scope

All code, dependencies, APIs, and user-facing features.

## Criteria

### Vulnerability Scanning

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| Critical vulnerabilities | 0 | `npm audit --audit-level=critical` |
| High vulnerabilities | 0 | `npm audit --audit-level=high` |
| Moderate vulnerabilities | < 5 | `npm audit --audit-level=moderate` |

### Static Analysis

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| ESLint security rules | 0 errors | `npm run lint:security` |
| TypeScript strict mode | Pass | `npm run typecheck` |

### Secrets Detection

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| Hardcoded secrets | 0 | `npm run scan:secrets` |
| API keys in code | 0 | Manual review + git-secrets |

### Authentication & Authorization

| Metric | Threshold | Test Command |
|--------|-----------|--------------|
| Auth bypass tests | 100% pass | `npm run test:security:auth` |
| RBAC enforcement | All routes | Code review + automated tests |

## Gates

Security validation runs at:
- **Implementing stage**: Dependency scan, secrets check
- **Complete stage**: Full security suite (must pass)

## Enforcement

**Enforced by:** `@security-agent`
**CI Check:** `security-tests` workflow
**Failure Action:** Blocks ROAD item from `complete` status

## Evidence Requirements

When marking NFR as passed, include:
- npm audit output (clean)
- Dependency check report
- Security test results

## Exceptions

None. Security is non-negotiable.
```

**Step 2: Commit**

```bash
git add docs/nfr/nfr-security-001.md
git commit -m "docs(nfr): create security NFR with vulnerability and secrets scanning"
```

---

## Task 9: Create Accessibility NFR Document

**Files:**
- Create: `docs/nfr/nfr-accessibility-001.md`

**Step 1: Create accessibility NFR file**

```markdown
---
id: NFR-A11Y-001
type: accessibility
scope: project-wide
created: 2026-01-31
last_updated: 2026-01-31
enforced_by: "@a11y-agent"
---

# NFR-A11Y-001: Accessibility Standards

## Status

**Active**

## Scope

All user-facing UI components and pages.

## Criteria

### WCAG 2.1 AA Compliance

| Guideline | Requirement | Test Method |
|-----------|-------------|-------------|
| 1.1 Text Alternatives | All images have alt text | axe-core automated scan |
| 1.3 Adaptable | Semantic HTML structure | axe-core + manual review |
| 1.4 Distinguishable | Color contrast ≥ 4.5:1 | axe-core color contrast |
| 2.1 Keyboard Accessible | All features work with keyboard | Manual testing |
| 2.4 Navigable | Skip links, focus indicators | axe-core + manual |
| 3.1 Readable | Language declared | HTML validation |
| 3.3 Input Assistance | Form labels and errors | axe-core + manual |
| 4.1 Compatible | ARIA used correctly | axe-core validation |

### Screen Reader Support

| Metric | Threshold | Test Method |
|--------|-----------|-------------|
| NVDA compatibility | All critical paths | Manual testing |
| VoiceOver compatibility | All critical paths | Manual testing |
| Logical heading order | H1 → H2 → H3 | axe-core |

### Automated Testing

| Tool | Minimum Score | Command |
|------|---------------|---------|
| Lighthouse Accessibility | 95+ | `npm run test:a11y:lighthouse` |
| axe-core | 0 violations | `npm run test:a11y:axe` |

## Gates

Accessibility validation runs at:
- **Implementing stage**: Automated axe-core scan
- **Complete stage**: Full Lighthouse + manual review (must pass)

## Enforcement

**Enforced by:** `@a11y-agent`
**CI Check:** `accessibility-tests` workflow
**Failure Action:** Blocks ROAD item from `complete` status

## Evidence Requirements

When marking NFR as passed, include:
- Lighthouse accessibility report
- axe-core scan results (0 violations)
- Manual testing checklist completed

## Exceptions

Bot-facing API endpoints are exempt from accessibility requirements.
```

**Step 2: Commit**

```bash
git add docs/nfr/nfr-accessibility-001.md
git commit -m "docs(nfr): create accessibility NFR with WCAG 2.1 AA standards"
```

---

## Task 10: Create Governance Workflow Documentation

**Files:**
- Create: `docs/governance/README.md`
- Create: `docs/governance/workflow.md`

**Step 1: Create governance directory and README**

```bash
mkdir -p docs/governance
```

```markdown
---
title: Governance System
description: How ADRs, NFRs, BDD, and CHANGE work together
---

# Governance System

ClawMarket uses a **deterministic approval system** where:

1. **ADRs** define architectural rules (in `docs/adr/`)
2. **NFRs** define quality standards (in `docs/nfr/`)
3. **ROAD items** track compliance state
4. **BDD scenarios** define behavior requirements
5. **CHANGE entries** prove all gates passed

## Key Principle

> **Every change must satisfy all accepted ADRs and pass all applicable NFR gates.**

## Quick Links

- [Workflow](./workflow.md) - Step-by-step approval process
- [Validation Rules](./validation-rules.md) - Enforcement criteria
- [Agent Responsibilities](./agents.md) - Who validates what
```

**Step 2: Create workflow documentation**

```markdown
---
title: Governance Workflow
description: Step-by-step approval process for changes
---

# Governance Workflow

## Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ROAD-XXX  │────▶│    BDD      │────▶│     NFR     │
│   Proposed  │     │  Scenarios  │     │   Gates     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ADR Check │     │  BDD Agent  │     │  Perf/Sec   │
│ @arch-inspector   │  Approval   │     │  /A11y      │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  CHANGE-XXX │
                                        │  Published  │
                                        └─────────────┘
```

## Stage 1: ROAD Proposal

**Starting Point:** Create ROAD item in `docs/ROADMAP.md`

**Required Front Matter:**
```yaml
---
id: ROAD-005
title: Bot Authentication
status: proposed  # Initial state
governance:
  adrs:
    validated: false
  nfrs:
    applicable: [NFR-PERF-001, NFR-SEC-001, NFR-A11Y-001]
    status: pending
---
```

**Gate:** None (initial proposal)

## Stage 2: ADR Validation

**Agent:** `@arch-inspector`

**Action:** Validate that proposal complies with all accepted ADRs

**Checklist:**
- [ ] Respects bounded context boundaries (ADR-001, ADR-002)
- [ ] Uses appropriate architecture patterns
- [ ] Does not violate any accepted ADR

**Front Matter Update:**
```yaml
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T10:00:00Z"
```

**Gate:** Cannot proceed to BDD until `adr_validated: true`

## Stage 3: BDD Scenarios

**Agent:** `@bdd-writer`

**Action:** Write Gherkin scenarios in `stack-tests/features/`

**Create:** `stack-tests/features/[context]/[feature].feature`

**Tag scenarios:**
```gherkin
@ROAD-005
Feature: Bot Authentication
  
  Scenario: Bot authenticates with valid API key
    Given a registered bot with a valid API key
    When the bot sends the API key in the Authorization header
    Then the bot receives a 200 OK response
    And the response includes the bot's identity
```

**Front Matter Update:**
```yaml
governance:
  bdd:
    id: BDD-005
    status: draft
    scenarios_count: 5
```

**Gate:** Scenarios must exist before implementing

## Stage 4: BDD Approval

**Agents:** `@bdd-writer` + `@bdd-runner`

**Actions:**
1. `@bdd-writer`: Review scenarios for completeness
2. `@bdd-runner`: Execute tests, verify they fail (Red phase)

**Front Matter Update:**
```yaml
governance:
  bdd:
    status: approved
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
```

**Gate:** Cannot implement until BDD `status: approved`

## Stage 5: Implementation

**Agent:** `@code-writer`

**Action:** Implement feature following:
- All accepted ADRs
- Approved BDD scenarios
- NFR standards (in mind during development)

**Status Update:**
```yaml
status: implementing
```

**Gate:** Code review for ADR compliance

## Stage 6: NFR Validation

**Agents:** `@performance-agent`, `@security-agent`, `@a11y-agent`

**Actions:**

**@performance-agent:**
```bash
npm run test:performance
# Update front matter with results
```

**@security-agent:**
```bash
npm audit
npm run scan:secrets
# Update front matter with results
```

**@a11y-agent:**
```bash
npm run test:a11y
# Update front matter with results
```

**Front Matter Update:**
```yaml
governance:
  nfrs:
    status: validating
    results:
      NFR-PERF-001: pass
        evidence: "https://ci.clawmarket.dev/perf/12345"
        timestamp: "2026-01-31T14:00:00Z"
      NFR-SEC-001: pass
        evidence: "npm audit: 0 vulnerabilities"
        timestamp: "2026-01-31T14:05:00Z"
      NFR-A11Y-001: pass
        evidence: "Lighthouse: 98 accessibility score"
        timestamp: "2026-01-31T14:10:00Z"
```

**Gate:** All NFRs must be `pass` before complete

## Stage 7: ROAD Complete

**Status Update:**
```yaml
status: complete
completed_at: "2026-01-31T15:00:00Z"
```

## Stage 8: CHANGE Entry

**File:** `docs/CHANGELOG.md`

**Front Matter:**
```yaml
---
id: CHANGE-005
road_id: ROAD-005
title: Bot Authentication Implementation
date: 2026-01-31
status: published
compliance:
  adr_check: pass
  bdd_check: pass
  nfr_checks:
    performance: pass
    security: pass
    accessibility: pass
signatures:
  - agent: "@arch-inspector"
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
```

**Gate:** Cannot have CHANGE entry without all signatures

## Validation Rules

| Rule | Enforcement |
|------|-------------|
| ROAD cannot move to `bdd_pending` | Until `@arch-inspector` validates ADR compliance |
| ROAD cannot move to `implementing` | Until BDD is `approved` by both agents |
| ROAD cannot move to `complete` | Until all NFRs pass |
| CHANGE cannot be `published` | Until ROAD is `complete` and all agents signed |

## Agent Responsibilities

| Agent | When | Action |
|-------|------|--------|
| `@arch-inspector` | ROAD proposed → bdd_pending | Validate ADR compliance |
| `@bdd-writer` | BDD scenarios created | Review and approve scenarios |
| `@bdd-runner` | BDD scenarios created | Run tests, verify red phase |
| `@code-writer` | BDD approved → implementing | Implement feature |
| `@performance-agent` | Implementation complete | Run performance benchmarks |
| `@security-agent` | Implementation complete | Run security scans |
| `@a11y-agent` | Implementation complete | Run accessibility tests |
```

**Step 3: Commit**

```bash
git add docs/governance/
git commit -m "docs(governance): create workflow documentation for approval system"
```

---

## Task 11: Create Validation Rules Documentation

**Files:**
- Create: `docs/governance/validation-rules.md`

**Step 1: Create validation rules document**

```markdown
---
title: Validation Rules
description: Strict enforcement rules for the governance system
---

# Validation Rules

## Enforcement Philosophy

**ALL rules are strictly enforced.** No exceptions without explicit override from project lead.

## Rule Categories

### 1. ADR Compliance Rules

#### Rule 1.1: All Changes Must Comply with Accepted ADRs

**Applies to:** All code changes, documentation updates, configuration changes

**Validation:** `@arch-inspector` checks:
- Bounded context boundaries respected
- Domain events used for cross-context communication
- Value objects used for domain primitives
- Aggregates maintain consistency boundaries

**Failure:** Blocked from BDD stage

**Evidence:** `governance.adrs.validated: true` with timestamp and validator

#### Rule 1.2: New ADRs Must Be Reviewed

**Applies to:** Proposed ADRs (status: proposed)

**Validation:** 
- Must include full context, decision, consequences
- Must include governance section
- Must specify validation method

**Failure:** Cannot be marked `accepted`

### 2. BDD Rules

#### Rule 2.1: All Features Must Have BDD Scenarios

**Applies to:** All ROAD items

**Validation:** 
- Feature file exists in `stack-tests/features/`
- Scenarios tagged with ROAD ID: `@ROAD-XXX`
- At least one happy path scenario
- At least one error/edge case scenario

**Failure:** Cannot proceed to implementation

#### Rule 2.2: BDD Scenarios Must Use Ubiquitous Language

**Applies to:** All Gherkin scenarios

**Validation:** 
- Terms from `docs/ddd/03-ubiquitous-language.md`
- No technical implementation details in scenarios
- Business-readable language

**Failure:** `@bdd-writer` requests revision

#### Rule 2.3: Tests Must Fail Before Implementation (Red Phase)

**Applies to:** BDD test execution

**Validation:** `@bdd-runner` runs tests before implementation

**Failure (Tests Pass):** ERROR - scenarios may already be implemented or are not testing anything

**Failure (Tests Fail):** Expected - proceed to implementation

### 3. NFR Rules

#### Rule 3.1: All NFRs Must Pass Before Complete

**Applies to:** All ROAD items

**Validation:** 
- NFR-PERF-001: Performance benchmarks pass
- NFR-SEC-001: Security scans clean
- NFR-A11Y-001: Accessibility tests pass

**Evidence Required:**
- CI run links
- Test output
- Screenshot/metrics

**Failure:** Cannot mark ROAD item `complete`

#### Rule 3.2: NFR Evidence Must Be Persisted

**Applies to:** CHANGE entries

**Validation:** Each NFR check includes:
- Status: pass/fail
- Evidence: Link or description
- Timestamp: When validated
- Validator: Agent that validated

**Failure:** Incomplete CHANGE entry

### 4. CHANGE Rules

#### Rule 4.1: All Changes Must Reference a ROAD Item

**Applies to:** All CHANGE entries

**Validation:** Front matter includes `road_id: ROAD-XXX`

**Failure:** Cannot be added to CHANGELOG

#### Rule 4.2: CHANGE Cannot Be Published Before ROAD Complete

**Applies to:** CHANGE entries with `status: published`

**Validation:** Referenced ROAD item has `status: complete`

**Failure:** Blocked - must complete ROAD first

#### Rule 4.3: All Agents Must Sign Off

**Applies to:** Published CHANGE entries

**Validation:** Front matter includes signatures from:
- `@arch-inspector` (ADR validation)
- `@bdd-writer` (BDD scenarios)
- `@bdd-runner` (Test validation)
- `@code-writer` (Implementation)
- `@performance-agent` (Performance NFR)
- `@security-agent` (Security NFR)
- `@a11y-agent` (Accessibility NFR)

**Failure:** Cannot mark `status: published`

### 5. Re-Validation Rules

#### Rule 5.1: ADR Changes Require Re-Validation

**Applies to:** When an ADR changes (new ADR accepted, existing ADR modified)

**Validation:** 
- Check all ROAD items in `implementing` or earlier
- If any violate new ADR, must fix or get explicit exception

**Action:** `@arch-inspector` notifies affected ROAD items

#### Rule 5.2: NFR Changes Apply Prospectively

**Applies to:** When NFR criteria change

**Validation:** 
- Existing ROAD items validated against old criteria
- New ROAD items validated against new criteria

**Exception:** If NFR is stricter, project lead may require re-validation

## Validation Script Requirements

The following validations should be automated:

### Pre-Commit Hooks

```bash
# Check ADR compliance
./scripts/validate-adr.sh ROAD-005

# Check BDD exists
./scripts/validate-bdd.sh ROAD-005

# Check NFR status
./scripts/validate-nfr.sh ROAD-005
```

### CI/CD Gates

```yaml
# .github/workflows/governance.yml
validate-adr:
  runs-on: ubuntu-latest
  steps:
    - name: Check ADR Compliance
      run: ./scripts/validate-adr.sh --ci

validate-bdd:
  runs-on: ubuntu-latest
  steps:
    - name: Check BDD Scenarios
      run: ./scripts/validate-bdd.sh --ci

validate-nfr:
  runs-on: ubuntu-latest
  steps:
    - name: Run Performance Tests
      run: npm run test:performance
    - name: Run Security Scan
      run: npm audit
    - name: Run Accessibility Tests
      run: npm run test:a11y
```

## Exception Process

If a rule must be violated:

1. Document the exception in ROAD item front matter:
```yaml
exceptions:
  - rule: "ADR-XXX"
    reason: "[Clear explanation]"
    approved_by: "@project-lead"
    approved_at: "2026-01-31"
```

2. Get explicit approval from project lead
3. Note exception in CHANGE entry
4. Review exception at next architecture review
```

**Step 2: Commit**

```bash
git add docs/governance/validation-rules.md
git commit -m "docs(governance): define strict validation rules for approval system"
```

---

## Task 12: Create Agent Responsibilities Documentation

**Files:**
- Create: `docs/governance/agents.md`

**Step 1: Create agent responsibilities document**

```markdown
---
title: Agent Responsibilities
description: Roles and responsibilities for governance validation agents
---

# Agent Responsibilities

## Agent Overview

| Agent | Primary Role | Gates | Tools |
|-------|-------------|-------|-------|
| `@arch-inspector` | Architecture validation | ADR compliance | Hexagonal pattern checker |
| `@bdd-writer` | Scenario design | BDD completeness | Gherkin syntax validator |
| `@bdd-runner` | Test execution | Test validation | Playwright, Jest |
| `@code-writer` | Implementation | Code quality | TypeScript, ESLint |
| `@performance-agent` | Performance validation | NFR-PERF-001 | k6, Lighthouse |
| `@security-agent` | Security validation | NFR-SEC-001 | npm audit, secrets scanner |
| `@a11y-agent` | Accessibility validation | NFR-A11Y-001 | axe-core, Lighthouse |

---

## @arch-inspector

### Role

Validates that all changes comply with accepted ADRs.

### When Invoked

- ROAD item moves from `proposed` to `adr_validated`
- Implementation code is written (architecture review)
- New ADR is proposed

### Validation Checklist

- [ ] Bounded context boundaries respected
- [ ] Domain events used for cross-context communication
- [ ] Aggregates maintain consistency boundaries
- [ ] Value objects used for domain primitives
- [ ] No primitive obsession
- [ ] Hexagonal architecture patterns followed
- [ ] No direct database access from domain layer
- [ ] Proper dependency direction (domain → application → infrastructure)

### Actions

1. **Review ROAD item**: Check if proposal violates any ADR
2. **Review code**: Verify implementation follows architecture
3. **Update front matter**: Mark `governance.adrs.validated: true`

### Example Output

```yaml
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    checks:
      - adr: "ADR-001"
        compliant: true
      - adr: "ADR-002"
        compliant: true
```

---

## @bdd-writer

### Role

Designs BDD scenarios using ubiquitous language.

### When Invoked

- BDD scenarios need to be created for ROAD item
- Scenarios need review before approval

### Validation Checklist

- [ ] Uses ubiquitous language from `docs/ddd/03-ubiquitous-language.md`
- [ ] No technical implementation details
- [ ] Business-readable scenarios
- [ ] Happy path covered
- [ ] Error cases covered
- [ ] Edge cases considered
- [ ] Scenarios tagged with `@ROAD-XXX`

### Actions

1. **Draft scenarios**: Write Gherkin feature file
2. **Review**: Ensure completeness and correctness
3. **Approve**: Mark BDD as approved in front matter

### Example Output

```yaml
governance:
  bdd:
    id: BDD-005
    status: approved
    scenarios_count: 5
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
```

---

## @bdd-runner

### Role

Executes BDD tests and validates red/green phases.

### When Invoked

- BDD scenarios are ready for validation
- Implementation is complete (verify green phase)

### Validation Checklist

- [ ] All scenarios can be executed
- [ ] Step definitions exist or can be created
- [ ] Red phase verified (tests fail before implementation)
- [ ] Green phase verified (tests pass after implementation)
- [ ] Coverage meets threshold (if defined)

### Actions

1. **Run tests**: Execute all scenarios
2. **Verify phases**: Confirm red → green progression
3. **Update front matter**: Mark test validation complete

### Example Output

```yaml
governance:
  bdd:
    test_results:
      total: 5
      passed: 5
      failed: 0
      coverage: "100%"
    approved_by:
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
```

---

## @code-writer

### Role

Implements features following DDD and BDD specifications.

### When Invoked

- BDD scenarios are approved and ready for implementation

### Validation Checklist

- [ ] Follows hexagonal architecture
- [ ] Implements all approved BDD scenarios
- [ ] Passes all NFR gates
- [ ] Includes proper error handling
- [ ] Has adequate test coverage
- [ ] No TODOs or FIXMEs in production code

### Actions

1. **Implement domain layer**: Pure business logic
2. **Implement application layer**: Orchestration
3. **Implement infrastructure layer**: Convex integration
4. **Create step definitions**: BDD test steps
5. **Run tests**: Verify all scenarios pass
6. **Update front matter**: Mark implementation complete

### Example Output

```yaml
implementation:
  status: complete
  completed_by: "@code-writer"
  completed_at: "2026-01-31T13:00:00Z"
  files_changed:
    - "src/bot-identity/domain/BotAccount.ts"
    - "src/bot-identity/application/BotService.ts"
    - "convex/botAccounts.ts"
```

---

## @performance-agent

### Role

Validates performance against NFR-PERF-001 standards.

### When Invoked

- Implementation is complete (NFR validation stage)
- ROAD item moves to `nfr_validating`

### Validation Checklist

- [ ] API p95 response time < 200ms
- [ ] Frontend bundle size < 500KB
- [ ] Lighthouse performance score > 90
- [ ] Database queries < 50ms

### Commands

```bash
# Run performance tests
npm run test:performance

# Analyze bundle
npm run analyze

# Lighthouse CI
npm run test:lighthouse
```

### Actions

1. **Run benchmarks**: Execute all performance tests
2. **Compare against thresholds**: NFR-PERF-001 criteria
3. **Update front matter**: Record results and evidence

### Example Output

```yaml
governance:
  nfrs:
    results:
      NFR-PERF-001:
        status: pass
        evidence: "https://ci.clawmarket.dev/perf/12345"
        metrics:
          api_p95: "150ms"
          bundle_size: "420KB"
          lighthouse_score: 95
        timestamp: "2026-01-31T14:00:00Z"
        validated_by: "@performance-agent"
```

---

## @security-agent

### Role

Validates security against NFR-SEC-001 standards.

### When Invoked

- Implementation is complete (NFR validation stage)
- Dependencies are updated

### Validation Checklist

- [ ] 0 critical vulnerabilities
- [ ] 0 high vulnerabilities
- [ ] < 5 moderate vulnerabilities
- [ ] No hardcoded secrets
- [ ] No API keys in code
- [ ] ESLint security rules pass
- [ ] Authentication/authorization tests pass

### Commands

```bash
# Audit dependencies
npm audit --audit-level=moderate

# Scan for secrets
git-secrets --scan

# Run security tests
npm run test:security
```

### Actions

1. **Run security scans**: Audit and secrets detection
2. **Verify compliance**: NFR-SEC-001 criteria
3. **Update front matter**: Record results and evidence

### Example Output

```yaml
governance:
  nfrs:
    results:
      NFR-SEC-001:
        status: pass
        evidence: "npm audit: 0 critical, 0 high, 3 moderate"
        vulnerabilities:
          critical: 0
          high: 0
          moderate: 3
        timestamp: "2026-01-31T14:05:00Z"
        validated_by: "@security-agent"
```

---

## @a11y-agent

### Role

Validates accessibility against NFR-A11Y-001 standards.

### When Invoked

- Implementation is complete (NFR validation stage)
- UI changes are made

### Validation Checklist

- [ ] WCAG 2.1 AA compliance
- [ ] Lighthouse accessibility score > 95
- [ ] axe-core 0 violations
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### Commands

```bash
# Run automated accessibility tests
npm run test:a11y:axe

# Run Lighthouse
npm run test:a11y:lighthouse
```

### Actions

1. **Run accessibility tests**: Automated and manual
2. **Verify compliance**: NFR-A11Y-001 criteria
3. **Update front matter**: Record results and evidence

### Example Output

```yaml
governance:
  nfrs:
    results:
      NFR-A11Y-001:
        status: pass
        evidence: "Lighthouse: 98, axe-core: 0 violations"
        scores:
          lighthouse: 98
          axe_violations: 0
        timestamp: "2026-01-31T14:10:00Z"
        validated_by: "@a11y-agent"
```

---

## Multi-Agent Workflows

### BDD Approval Flow

```
@bdd-writer writes scenarios
        ↓
@bdd-runner executes (Red phase)
        ↓
Both approve → BDD status: approved
```

### NFR Validation Flow

```
@performance-agent runs benchmarks ──┐
@security-agent runs scans ──────────┼──► All pass → NFR status: pass
@a11y-agent runs tests ──────────────┘
```

### CHANGE Publication Flow

```
ROAD item complete
        ↓
All agents sign off
        ↓
CHANGE entry created with signatures
        ↓
Status: published
```

---

## Conflict Resolution

If agents disagree:

1. **Document disagreement** in ROAD item front matter
2. **Escalate to project lead** for decision
3. **Record resolution** with rationale
4. **Update ADR** if new pattern emerges

Example:
```yaml
conflict:
  description: "@security-agent and @code-writer disagree on API key storage"
  escalated_to: "@project-lead"
  resolution: "Store in Convex with bcrypt hash per ADR-009"
  timestamp: "2026-01-31T16:00:00Z"
```
```

**Step 2: Commit**

```bash
git add docs/governance/agents.md
git commit -m "docs(governance): document agent responsibilities and workflows"
```

---

## Task 13: Create Example ROAD Item with Full Governance

**Files:**
- Create: `docs/governance/example-road-item.md`

**Step 1: Create example ROAD item showing complete governance**

```markdown
---
id: ROAD-005
title: Bot Authentication System
status: complete
created: 2026-01-31
started: 2026-01-31
completed: 2026-01-31
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T09:00:00Z"
    applicable:
      - ADR-001  # Domain-Driven Design
      - ADR-003  # Convex Backend
      - ADR-009  # API Key Authentication
      - ADR-016  # Convex Functions as App Layer
    compliance_check:
      - adr: ADR-001
        compliant: true
        notes: "Uses BotAccount aggregate"
      - adr: ADR-003
        compliant: true
        notes: "Convex mutations for auth"
      - adr: ADR-009
        compliant: true
        notes: "SHA-256 API keys with bcrypt"
      - adr: ADR-016
        compliant: true
        notes: "Application services in convex/"
  
  bdd:
    id: BDD-005
    file: "stack-tests/features/api/bot-identity/02_bot_authentication.feature"
    status: approved
    scenarios_count: 5
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T10:00:00Z"
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T10:30:00Z"
    test_results:
      total: 5
      passed: 5
      failed: 0
      coverage: "100%"
  
  nfrs:
    applicable:
      - NFR-PERF-001
      - NFR-SEC-001
      - NFR-A11Y-001
    status: pass
    results:
      NFR-PERF-001:
        status: pass
        evidence: "https://ci.clawmarket.dev/perf/12345"
        metrics:
          api_p95: "45ms"
          bundle_size: "N/A (backend only)"
        timestamp: "2026-01-31T14:00:00Z"
        validated_by: "@performance-agent"
      
      NFR-SEC-001:
        status: pass
        evidence: "npm audit: 0 critical, 0 high"
        vulnerabilities:
          critical: 0
          high: 0
          moderate: 2
        timestamp: "2026-01-31T14:05:00Z"
        validated_by: "@security-agent"
      
      NFR-A11Y-001:
        status: pass
        evidence: "No UI changes - backend only feature"
        timestamp: "2026-01-31T14:10:00Z"
        validated_by: "@a11y-agent"
---

# ROAD-005: Bot Authentication System

## Description

Enable bots to authenticate using API keys to access protected endpoints.

## Status

✅ **Complete**

## Implementation

### Domain Layer
- `BotAccount` aggregate with API key support
- `ApiKey` value object with validation
- `AuthenticationService` domain service

### Application Layer
- `AuthenticationApplicationService`
- DTOs: `AuthenticationRequest`, `AuthenticatedBotContext`

### Infrastructure Layer
- Convex mutations: `authenticateBot`
- Middleware: `withAuth` for protected routes

### BDD Scenarios

See: [BDD-005](../bdd/ROAD-005)

- Bot authenticates with valid API key
- Bot fails authentication with invalid API key
- Bot fails authentication with missing API key
- Bot accesses protected endpoint after authentication
- Bot receives 401 for unauthorized access

## CHANGE Entry

[CHANGE-005: Bot Authentication Implementation](../CHANGELOG.md#change-005)

## Signatures

| Agent | Role | Status | Timestamp |
|-------|------|--------|-----------|
| @arch-inspector | ADR Validation | ✅ Approved | 2026-01-31T09:00:00Z |
| @bdd-writer | BDD Author | ✅ Approved | 2026-01-31T10:00:00Z |
| @bdd-runner | Test Validation | ✅ Approved | 2026-01-31T10:30:00Z |
| @code-writer | Implementation | ✅ Approved | 2026-01-31T13:00:00Z |
| @performance-agent | Performance NFR | ✅ Approved | 2026-01-31T14:00:00Z |
| @security-agent | Security NFR | ✅ Approved | 2026-01-31T14:05:00Z |
| @a11y-agent | Accessibility NFR | ✅ Approved | 2026-01-31T14:10:00Z |
```

**Step 2: Commit**

```bash
git add docs/governance/example-road-item.md
git commit -m "docs(governance): add example ROAD item with complete governance tracking"
```

---

## Task 14: Update ROADMAP.md with New Front Matter Schema

**Files:**
- Modify: `docs/ROADMAP.md`

**Step 1: Read current ROADMAP.md**

Understand the current format and structure.

**Step 2: Update front matter and add governance section to active items**

For existing ROAD items that are in progress or later, add governance tracking:

Example update for ROAD-005:

```markdown
### [ROAD-005] Bot Authentication ✅
**Status**: Complete
**Started**: 2026-01-31
**Completed**: 2026-01-31

**Governance**:
- ADRs: ✅ Validated by @arch-inspector
- BDD: ✅ BDD-005 approved
- NFRs: ✅ All passed
  - Performance: 45ms p95
  - Security: 0 critical vulnerabilities
  - Accessibility: N/A (backend)

<!-- Full governance tracking in front matter below -->
```

Then add YAML front matter at the top of the document showing how future ROAD items should be structured.

Actually, better approach: Keep ROADMAP as the index, but document the governance front matter schema in governance docs, and individual plans in docs/plans/ can have the full governance tracking.

**Step 3: Add governance schema documentation to ROADMAP**

Add a section explaining the governance integration:

```markdown
## Governance Integration

Each ROAD item now includes governance tracking:

### Required Front Matter

```yaml
---
id: ROAD-XXX
title: Feature Name
status: proposed | adr_validated | bdd_pending | bdd_complete | implementing | nfr_validating | complete
governance:
  adrs:
    validated: boolean
    validated_by: string
    validated_at: ISO8601
  bdd:
    id: BDD-XXX
    status: draft | approved | implemented
  nfrs:
    applicable: [NFR-XXX, ...]
    status: pending | validating | pass | fail
---
```

### Status Flow

1. **proposed** → Initial idea
2. **adr_validated** → @arch-inspector confirms ADR compliance
3. **bdd_pending** → Waiting for BDD scenarios
4. **bdd_complete** → BDD scenarios written and approved
5. **implementing** → Code being written
6. **nfr_validating** → Running NFR tests
7. **complete** → All gates passed, CHANGE entry created

See [Governance Workflow](./governance/workflow.md) for full details.
```

**Step 4: Commit**

```bash
git add docs/ROADMAP.md
git commit -m "docs(roadmap): add governance integration documentation"
```

---

## Task 15: Create Example CHANGE Entry

**Files:**
- Create: `docs/governance/example-change-entry.md`

**Step 1: Create example CHANGE entry**

```markdown
---
id: CHANGE-005
road_id: ROAD-005
title: Bot Authentication System Implementation
date: 2026-01-31
version: "0.5.0"
status: published
categories:
  - Added
compliance:
  adr_check:
    status: pass
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T09:00:00Z"
    notes: "Complies with ADR-001, ADR-003, ADR-009, ADR-016"
  
  bdd_check:
    status: pass
    scenarios: 5
    passed: 5
    coverage: "100%"
    validated_by: "@bdd-runner"
    validated_at: "2026-01-31T10:30:00Z"
  
  nfr_checks:
    performance:
      status: pass
      evidence: "https://ci.clawmarket.dev/perf/12345"
      metrics:
        api_p95: "45ms"
      validated_by: "@performance-agent"
      validated_at: "2026-01-31T14:00:00Z"
    
    security:
      status: pass
      evidence: "npm audit: 0 critical, 0 high"
      vulnerabilities:
        critical: 0
        high: 0
        moderate: 2
      validated_by: "@security-agent"
      validated_at: "2026-01-31T14:05:00Z"
    
    accessibility:
      status: pass
      evidence: "No UI changes"
      validated_by: "@a11y-agent"
      validated_at: "2026-01-31T14:10:00Z"

signatures:
  - agent: "@arch-inspector"
    role: adr_validation
    status: approved
    timestamp: "2026-01-31T09:00:00Z"
  
  - agent: "@bdd-writer"
    role: bdd_author
    status: approved
    timestamp: "2026-01-31T10:00:00Z"
  
  - agent: "@bdd-runner"
    role: test_validation
    status: approved
    timestamp: "2026-01-31T10:30:00Z"
  
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

# CHANGE-005: Bot Authentication System Implementation

## Summary

Implemented complete bot authentication system with API key generation, verification, and protected endpoints.

## Related

- **Roadmap**: [ROAD-005](./ROADMAP.md#road-005)
- **BDD**: [BDD-005](../bdd/ROAD-005)
- **Design**: [Bot Authentication Design](../plans/2026-01-31-bot-authentication-design.md)

## Changes

### Added

**Domain Layer**:
- `BotAccount` aggregate with API key support
- `ApiKey` value object with SHA-256 generation
- `AuthenticationService` domain service
- `ApiKeyRegenerated` domain event

**Application Layer**:
- `AuthenticationApplicationService`
- DTOs: `AuthenticationRequest`, `AuthenticatedBotContext`
- Authentication middleware

**Infrastructure Layer**:
- Convex mutations: `authenticateBot`, `regenerateApiKey`
- `withAuth` middleware for protected routes
- Protected endpoint: `GET /api/bots/me`

**BDD Tests**:
- 5 scenarios covering authentication flows
- 100% test coverage

## Verification

### Architecture
✅ All ADRs validated by @arch-inspector
- ADR-001 (DDD): Uses aggregates, domain events
- ADR-003 (Convex): Proper mutation/query structure
- ADR-009 (API Keys): SHA-256 with bcrypt
- ADR-016 (App Layer): Clean application services

### BDD
✅ All 5 scenarios pass
- Bot authenticates with valid API key ✅
- Bot fails with invalid API key ✅
- Bot fails with missing API key ✅
- Protected endpoint accessible ✅
- Unauthorized returns 401 ✅

### Performance
✅ API p95 response time: 45ms (threshold: < 200ms)

### Security
✅ 0 critical vulnerabilities
✅ 0 high vulnerabilities
✅ API keys stored as bcrypt hashes
✅ Rate limiting: 100 req/min

### Accessibility
✅ No UI changes (backend only)

## Agent Signatures

All 7 agents have signed off on this change.

See front matter for full signature details.

## Evidence

- **Performance**: [CI Run](https://ci.clawmarket.dev/perf/12345)
- **Security**: `npm audit` output in CI
- **BDD Tests**: All green in CI
```

**Step 2: Commit**

```bash
git add docs/governance/example-change-entry.md
git commit -m "docs(governance): add example CHANGE entry with full compliance tracking"
```

---

## Task 16: Create Validation Script Skeleton

**Files:**
- Create: `scripts/validate-governance.sh`
- Create: `scripts/lib/validate-adr.js`
- Create: `scripts/lib/validate-bdd.js`
- Create: `scripts/lib/validate-nfr.js`

**Step 1: Create main validation script**

```bash
#!/bin/bash
# scripts/validate-governance.sh
# Main governance validation script

set -e

ROAD_ID=$1
COMMAND=$2

if [ -z "$ROAD_ID" ]; then
  echo "Usage: ./scripts/validate-governance.sh ROAD-XXX [adr|bdd|nfr|all]"
  exit 1
fi

if [ -z "$COMMAND" ]; then
  COMMAND="all"
fi

echo "🔍 Validating governance for $ROAD_ID"
echo ""

case $COMMAND in
  adr)
    echo "Checking ADR compliance..."
    node scripts/lib/validate-adr.js "$ROAD_ID"
    ;;
  bdd)
    echo "Checking BDD scenarios..."
    node scripts/lib/validate-bdd.js "$ROAD_ID"
    ;;
  nfr)
    echo "Checking NFR status..."
    node scripts/lib/validate-nfr.js "$ROAD_ID"
    ;;
  all)
    echo "Running all validations..."
    node scripts/lib/validate-adr.js "$ROAD_ID"
    node scripts/lib/validate-bdd.js "$ROAD_ID"
    node scripts/lib/validate-nfr.js "$ROAD_ID"
    ;;
  *)
    echo "Unknown command: $COMMAND"
    echo "Usage: ./scripts/validate-governance.sh ROAD-XXX [adr|bdd|nfr|all]"
    exit 1
    ;;
esac

echo ""
echo "✅ Governance validation complete for $ROAD_ID"
```

**Step 2: Create ADR validation library (skeleton)**

```javascript
#!/usr/bin/env node
// scripts/lib/validate-adr.js

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROAD_ID = process.argv[2];

if (!ROAD_ID) {
  console.error('Usage: node validate-adr.js ROAD-XXX');
  process.exit(1);
}

console.log(`Validating ADR compliance for ${ROAD_ID}...\n`);

// TODO: Implement actual validation logic
// 1. Find ROAD item in docs/ROADMAP.md
// 2. Check governance.adrs.validated === true
// 3. List all accepted ADRs
// 4. Verify ROAD item doesn't violate any ADR
// 5. Output compliance report

console.log('📋 ADR Validation Checklist:');
console.log('  ☐ Bounded context boundaries respected');
console.log('  ☐ Domain events used for cross-context communication');
console.log('  ☐ Aggregates maintain consistency boundaries');
console.log('  ☐ Value objects used for domain primitives');
console.log('  ☐ Hexagonal architecture patterns followed');
console.log('');
console.log('⚠️  Full validation logic to be implemented');
console.log('   See: docs/governance/validation-rules.md');

process.exit(0);
```

**Step 3: Create BDD validation library (skeleton)**

```javascript
#!/usr/bin/env node
// scripts/lib/validate-bdd.js

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ROAD_ID = process.argv[2];

if (!ROAD_ID) {
  console.error('Usage: node validate-bdd.js ROAD-XXX');
  process.exit(1);
}

console.log(`Validating BDD scenarios for ${ROAD_ID}...\n`);

// TODO: Implement actual validation logic
// 1. Search for feature files with @ROAD-XXX tag
// 2. Verify at least one file exists
// 3. Count scenarios
// 4. Verify step definitions exist
// 5. Check if tests pass

const featureFiles = glob.sync(`stack-tests/features/**/*.feature`);
console.log(`Found ${featureFiles.length} total feature files`);

console.log('\n📋 BDD Validation Checklist:');
console.log('  ☐ Feature file exists with @' + ROAD_ID + ' tag');
console.log('  ☐ At least 1 happy path scenario');
console.log('  ☐ At least 1 error/edge case scenario');
console.log('  ☐ Uses ubiquitous language');
console.log('  ☐ Step definitions exist');
console.log('');
console.log('⚠️  Full validation logic to be implemented');

process.exit(0);
```

**Step 4: Create NFR validation library (skeleton)**

```javascript
#!/usr/bin/env node
// scripts/lib/validate-nfr.js

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROAD_ID = process.argv[2];

if (!ROAD_ID) {
  console.error('Usage: node validate-nfr.js ROAD-XXX');
  process.exit(1);
}

console.log(`Validating NFR gates for ${ROAD_ID}...\n`);

// TODO: Implement actual validation logic
// 1. Find ROAD item
// 2. Check governance.nfrs.status === 'pass'
// 3. Verify all applicable NFRs have results
// 4. Check CI evidence exists

console.log('📋 NFR Validation Checklist:');
console.log('  ☐ Performance benchmarks pass (NFR-PERF-001)');
console.log('  ☐ Security scans clean (NFR-SEC-001)');
console.log('  ☐ Accessibility tests pass (NFR-A11Y-001)');
console.log('  ☐ Evidence links provided');
console.log('  ☐ All agents signed off');
console.log('');
console.log('⚠️  Full validation logic to be implemented');

process.exit(0);
```

**Step 5: Make scripts executable**

```bash
chmod +x scripts/validate-governance.sh
chmod +x scripts/lib/validate-adr.js
chmod +x scripts/lib/validate-bdd.js
chmod +x scripts/lib/validate-nfr.js
```

**Step 6: Commit**

```bash
git add scripts/
git commit -m "chore(scripts): create governance validation script skeleton"
```

---

## Task 17: Update Main Documentation Index

**Files:**
- Modify: `docs/README.md`

**Step 1: Read current docs/README.md**

**Step 2: Add governance section**

Add a new section to the README:

```markdown
## Governance System

ClawMarket uses a deterministic approval system where all changes must satisfy:

1. **ADRs** (Architecture Decision Records) - Define architectural rules
2. **NFRs** (Non-Functional Requirements) - Define quality standards
3. **BDD** (Behavior-Driven Development) - Define behavior requirements
4. **Agent Signatures** - Multi-agent consensus required

### Quick Links

- [Governance Overview](./governance/) - How the system works
- [Governance Workflow](./governance/workflow.md) - Step-by-step process
- [Validation Rules](./governance/validation-rules.md) - Enforcement criteria
- [Agent Responsibilities](./governance/agents.md) - Who validates what

### Directories

- `docs/adr/` - Individual ADR files with governance front matter
- `docs/nfr/` - Non-functional requirement standards
- `docs/governance/` - Workflow, rules, and examples

### Making Changes

Every change must:
1. Reference a ROAD item in ROADMAP.md
2. Pass ADR validation by @arch-inspector
3. Have approved BDD scenarios
4. Pass all NFR gates (performance, security, accessibility)
5. Be signed off by all responsible agents

See [Governance Workflow](./governance/workflow.md) for details.
```

**Step 3: Commit**

```bash
git add docs/README.md
git commit -m "docs: add governance system overview to main docs README"
```

---

## Task 18: Create CI/CD Integration Documentation

**Files:**
- Create: `docs/governance/ci-cd-integration.md`

**Step 1: Create CI/CD integration guide**

```markdown
---
title: CI/CD Integration
description: How to integrate governance validation into CI/CD pipelines
---

# CI/CD Integration

## Overview

Governance validation should run at multiple stages:

1. **Pre-commit**: Fast validation of local changes
2. **CI Pipeline**: Full validation on every PR
3. **Pre-deployment**: Final validation before production

## Pre-Commit Hooks

### Setup

```bash
# Install husky
npm install --save-dev husky

# Enable hooks
npx husky install
```

### ADR Validation Hook

`.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Get list of changed ROAD items
CHANGED_ROADS=$(git diff --cached --name-only | grep -E 'docs/ROADMAP.md|docs/plans/.*\.md' || true)

if [ -n "$CHANGED_ROADS" ]; then
  echo "🔍 Validating ADR compliance for changed ROAD items..."
  
  for road in $CHANGED_ROADS; do
    ROAD_ID=$(grep -E '^id: ROAD-' "$road" | head -1 | sed 's/id: //')
    if [ -n "$ROAD_ID" ]; then
      ./scripts/validate-governance.sh "$ROAD_ID" adr
    fi
  done
fi
```

## GitHub Actions Workflow

`.github/workflows/governance.yml`:

```yaml
name: Governance Validation

on:
  pull_request:
    paths:
      - 'docs/ROADMAP.md'
      - 'docs/plans/**'
      - 'docs/CHANGELOG.md'
      - 'stack-tests/features/**'
      - 'src/**'

jobs:
  validate-adr:
    name: ADR Compliance
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Validate ADR compliance
        run: |
          # Find changed ROAD items
          ROADS=$(git diff --name-only origin/main | grep -E 'docs/plans/.*\.md' | xargs -I {} grep -l '^id: ROAD-' {} || true)
          
          for road in $ROADS; do
            ROAD_ID=$(grep '^id: ROAD-' "$road" | head -1 | sed 's/id: //')
            echo "Validating $ROAD_ID..."
            ./scripts/validate-governance.sh "$ROAD_ID" adr
          done

  validate-bdd:
    name: BDD Scenarios
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Validate BDD scenarios
        run: |
          # Find ROAD items that should have BDD
          ./scripts/validate-governance.sh all bdd

  validate-nfr:
    name: NFR Gates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Run security scan
        run: npm audit --audit-level=moderate
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Validate NFR status
        run: ./scripts/validate-governance.sh all nfr

  check-signatures:
    name: Agent Signatures
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      
      - name: Check CHANGE entries have all signatures
        run: |
          # Verify all CHANGE entries in PR have complete signatures
          node scripts/lib/check-signatures.js
```

## PR Requirements

### PR Template

`.github/pull_request_template.md`:

```markdown
## Related ROAD Item

<!-- Link to ROAD item -->
ROAD-XXX: [Title]

## Governance Checklist

- [ ] ADR compliance validated by @arch-inspector
- [ ] BDD scenarios approved by @bdd-writer and @bdd-runner
- [ ] Implementation complete
- [ ] NFRs validated:
  - [ ] Performance (NFR-PERF-001) - @performance-agent
  - [ ] Security (NFR-SEC-001) - @security-agent
  - [ ] Accessibility (NFR-A11Y-001) - @a11y-agent
- [ ] All agents signed off

## Evidence

<!-- Links to CI runs, test results, etc. -->
- Performance: [CI Run](url)
- Security: `npm audit` output
- Accessibility: Lighthouse report

## Changes

<!-- Describe what changed -->
```

## Branch Protection

Configure branch protection rules:

1. Go to Settings → Branches
2. Add rule for `main`:
   - Require pull request reviews before merging: 2
   - Require status checks to pass:
     - `ADR Compliance`
     - `BDD Scenarios`
     - `NFR Gates`
     - `Agent Signatures`
   - Require signed commits
   - Include administrators

## Deployment Gates

Before deploying to production:

1. **Verify ROAD item is complete**:
   ```bash
   ./scripts/validate-governance.sh ROAD-XXX all
   ```

2. **Verify CHANGE entry exists**:
   ```bash
   grep -E "^id: CHANGE-XXX" docs/CHANGELOG.md
   ```

3. **Verify all signatures present**:
   ```bash
   node scripts/lib/check-signatures.js ROAD-XXX
   ```

## Monitoring

### Governance Dashboard

Create a simple dashboard showing:
- ROAD items by status
- Pending validations
- Failed NFR checks
- Missing signatures

### Alerts

Set up alerts for:
- ROAD items stuck in status > 7 days
- NFR failures
- Missing agent signatures on PRs

## Troubleshooting

### Validation Fails

1. Check error message in CI logs
2. Run locally: `./scripts/validate-governance.sh ROAD-XXX all`
3. Fix issue and re-push

### Missing Signatures

Ensure all agents have signed off in front matter:
```yaml
signatures:
  - agent: "@arch-inspector"
    status: approved
  - agent: "@bdd-writer"
    status: approved
  # ... etc
```

### NFR Test Failures

Check individual NFR documents for thresholds:
- Performance: `docs/nfr/nfr-performance-001.md`
- Security: `docs/nfr/nfr-security-001.md`
- Accessibility: `docs/nfr/nfr-accessibility-001.md`
```

**Step 2: Commit**

```bash
git add docs/governance/ci-cd-integration.md
git commit -m "docs(governance): add CI/CD integration guide"
```

---

## Task 19: Final Review and Summary

**Step 1: Review all created files**

Ensure all files are created and committed:

```bash
# List all governance files
git status

# Show commit log
git log --oneline -20
```

**Step 2: Create summary document**

Create `docs/governance/IMPLEMENTATION-SUMMARY.md`:

```markdown
---
title: Governance System Implementation Summary
description: Summary of implemented governance system
---

# Governance System Implementation Summary

## What Was Implemented

A deterministic approval system where ADRs and NFRs govern all changes.

### Created Structure

```
docs/
├── adr/
│   ├── README.md
│   ├── adr-001-domain-driven-design.md
│   ├── adr-002-modular-monolith.md
│   ├── ... (adr-003 through adr-024)
│   └── adr-024-*.md
├── nfr/
│   ├── README.md
│   ├── nfr-performance-001.md
│   ├── nfr-security-001.md
│   └── nfr-accessibility-001.md
├── governance/
│   ├── README.md
│   ├── workflow.md
│   ├── validation-rules.md
│   ├── agents.md
│   ├── example-road-item.md
│   ├── example-change-entry.md
│   ├── ci-cd-integration.md
│   └── IMPLEMENTATION-SUMMARY.md
└── ... (updated ROADMAP.md and README.md)

scripts/
├── validate-governance.sh
└── lib/
    ├── validate-adr.js
    ├── validate-bdd.js
    └── validate-nfr.js
```

## Key Features

### 1. Individual ADR Files
- Each ADR is now a separate file with YAML front matter
- Status tracking: proposed → accepted → deprecated → superseded
- Governance section defining validation rules
- All 24 ADRs refactored from monolithic document

### 2. NFR Standards
- Performance standards (response times, bundle size)
- Security standards (vulnerability scanning)
- Accessibility standards (WCAG 2.1 AA)
- Each with clear criteria, gates, and enforcement

### 3. Governance Workflow
- 8-stage approval process
- Clear gates between stages
- Agent consensus required at each gate

### 4. Validation Rules
- Strict enforcement (no exceptions without approval)
- Machine-verifiable constraints
- Documented exception process

### 5. Agent Responsibilities
- @arch-inspector: ADR validation
- @bdd-writer: Scenario design
- @bdd-runner: Test execution
- @code-writer: Implementation
- @performance-agent: Performance NFR
- @security-agent: Security NFR
- @a11y-agent: Accessibility NFR

### 6. CI/CD Integration
- Pre-commit hooks for fast feedback
- GitHub Actions for PR validation
- Branch protection rules
- Deployment gates

## State Machine

```
ROAD-XXX: proposed → adr_validated → bdd_pending → bdd_complete → 
          implementing → nfr_validating → complete

CHANGE-XXX: draft → linked_to_road → adr_compliant → nfr_passed → published
```

## Next Steps

1. **Implement validation scripts**: Add actual validation logic to skeleton scripts
2. **Set up CI/CD**: Configure GitHub Actions workflows
3. **Train agents**: Ensure all agents understand their responsibilities
4. **Backfill existing items**: Add governance tracking to existing ROAD items
5. **Monitor and iterate**: Track effectiveness, adjust rules as needed

## Compliance

All new changes must now follow this governance system.
```

**Step 3: Final commit**

```bash
git add docs/governance/IMPLEMENTATION-SUMMARY.md
git commit -m "docs(governance): add implementation summary"
```

---

## Summary

This plan creates a complete governance system with:

1. **24 ADR files** (refactored from single document)
2. **3 NFR files** (performance, security, accessibility)
3. **Governance documentation** (workflow, rules, agents, examples)
4. **Validation scripts** (skeleton for enforcement)
5. **CI/CD integration guide** (GitHub Actions, branch protection)
6. **Updated main docs** (ROADMAP, README)

The system enforces that every CHANGE is tied to a ROAD item that must pass ADR validation, BDD approval, and all NFR gates with multi-agent consensus.

**Two execution options:**

**1. Subagent-Driven (this session)** - Dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach would you prefer?
