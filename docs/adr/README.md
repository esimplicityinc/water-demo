---
title: Architecture Decision Records (ADRs)
description: All architectural decisions for AquaTrack
last_updated: 2026-01-31
---

# Architecture Decision Records

This directory contains all architectural decisions for AquaTrack.

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
| ADR-002 | Modular Monolith | Architecture | Accepted |
| ADR-003 | Convex for Backend and Database | Infrastructure | Accepted |
| ADR-004 | Next.js for Frontend | Infrastructure | Accepted |
| ADR-005 | Event-Driven Communication | Architecture | Accepted |
| ADR-006 | Aggregates as Consistency Boundaries | Architecture | Accepted |
| ADR-007 | Hybrid Transfer Architecture | Architecture | Accepted |
| ADR-008 | Hybrid Resource Model | Architecture | Accepted |
| ADR-009 | API Key Authentication | Security | Accepted |
| ADR-010 | Deposit Requirements for Suppliers | Architecture | Accepted |
| ADR-011 | Request Matching Market | Architecture | Accepted |
| ADR-012 | Water Request Lifecycle States | Architecture | Accepted |
| ADR-013 | Value Objects for Domain Primitives | Architecture | Accepted |
| ADR-014 | Real-Time Request Board Updates | Performance | Accepted |
| ADR-015 | Eventual Consistency Between Contexts | Architecture | Accepted |
| ADR-016 | Convex Functions as Application Services | Architecture | Accepted |
| ADR-017 | Bun as Runtime and Package Manager | Infrastructure | Accepted |
| ADR-018 | Vercel for Deployment | Infrastructure | Accepted |
| ADR-019 | Tailwind CSS for Styling | Infrastructure | Accepted |
| ADR-020 | shadcn/ui for Component Library | Infrastructure | Accepted |
| ADR-021 | Clerk for Authentication | Security | Accepted |
| ADR-022 | Security Best Practices | Security | Accepted |
| ADR-023 | Performance Best Practices | Performance | Accepted |
| ADR-024 | Testing Strategy | Architecture | Accepted |

## Governance

All accepted ADRs are active governance rules. Every change must comply with all accepted ADRs. See [Governance System](../governance/) for details.
