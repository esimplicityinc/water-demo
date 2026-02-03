---
id: ADR-018
title: Vercel for Deployment
status: accepted
category: infrastructure
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-018: Vercel for Deployment

## Status

**Accepted**

## Context

We need a deployment platform that:
- Integrates with Next.js
- Provides CI/CD out of the box
- Handles scaling automatically
- Offers preview deployments
- Supports environment management

## Decision

Use **Vercel** for deployment:
- Native Next.js support
- Automatic deployments from Git
- Preview deployments for PRs
- Edge network for global distribution
- Serverless functions
- Environment variable management

Setup:
- Production branch: `main`
- Preview deployments on all PRs
- Environment variables in Vercel dashboard
- Convex backend separate from Vercel hosting

## Consequences

**Positive:**
- Zero-config Next.js deployment
- Automatic scaling
- Global CDN for static assets
- Preview environments for testing
- Great developer experience

**Negative:**
- Vendor lock-in to Vercel ecosystem
- Function cold start latency
- Cost at scale
- Limited backend capabilities (Convex handles this)

## Governance

All changes MUST:
- Deploy via Vercel Git integration
- Use environment variables for configuration
- Test in preview deployments before merging
- Follow Vercel's performance best practices
- Document any Vercel-specific features used

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Deployment configuration, environment setup, performance
