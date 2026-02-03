---
id: ADR-003
title: Convex for Backend and Database
status: accepted
category: infrastructure
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-003: Convex for Backend and Database

## Status

**Accepted**

## Context

We need a backend solution that provides:
- Real-time data synchronization
- Type-safe API layer
- Scalable database
- Minimal operational overhead

## Decision

Use **Convex** as the unified backend platform:
- Convex functions for serverless backend logic
- Convex database (PostgreSQL-compatible)
- Real-time subscriptions for live updates
- Built-in authentication integration

## Consequences

**Positive:**
- Single platform for database + backend
- Excellent TypeScript support
- Automatic real-time sync
- No server management

**Negative:**
- Vendor lock-in to Convex platform
- Limited to Convex's feature set
- Pricing at scale needs monitoring

## Governance

All changes MUST:
- Use Convex functions for backend logic
- Define database schema in Convex
- Use Convex types for type safety
- Handle Convex-specific error patterns

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Convex usage patterns, proper error handling
