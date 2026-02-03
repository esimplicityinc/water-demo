---
id: ADR-004
title: Next.js for Frontend
status: accepted
category: infrastructure
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-004: Next.js for Frontend

## Status

**Accepted**

## Context

The frontend needs to support:
- Server-side rendering for SEO
- Static site generation for docs
- API routes for backend-for-frontend pattern
- Modern React features

## Decision

Use **Next.js** as the frontend framework:
- App Router for modern React patterns
- Server Components for data fetching
- API Routes for backend endpoints
- Static export for documentation

## Consequences

**Positive:**
- Excellent React ecosystem support
- Flexible rendering strategies
- Built-in optimizations
- Strong TypeScript integration

**Negative:**
- Learning curve for new developers
- Vercel dependency for full features
- Complex build process

## Governance

All changes MUST:
- Use App Router (not Pages Router)
- Leverage Server Components where appropriate
- Follow Next.js file conventions
- Use Next.js API routes for backend endpoints

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Next.js patterns, proper use of Server/Client Components
