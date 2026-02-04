---
id: ADR-002
title: Modular Monolith Architecture
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-002: Modular Monolith Architecture

## Status

**Accepted**

## Context

AquaTrack needs to balance rapid development with long-term maintainability. A distributed microservices architecture would add unnecessary complexity at this stage, while a traditional monolith risks becoming a "big ball of mud."

## Decision

Use a **Modular Monolith** architecture with:
- Clear module boundaries matching bounded contexts
- Internal APIs between modules
- Shared infrastructure (database, deployment)
- Potential to extract to services later

## Consequences

**Positive:**
- Simpler deployment and operations
- Easier refactoring across modules
- Lower latency between components
- Single codebase for development velocity

**Negative:**
- Risk of tight coupling if boundaries not respected
- Shared database can create dependencies
- All-or-nothing deployments

## Governance

All changes MUST:
- Respect module boundaries
- Not create circular dependencies between modules
- Use defined APIs for inter-module communication
- Keep database schema isolated per module

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Module dependency graph, circular dependency detection
