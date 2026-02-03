---
id: ADR-023
title: Performance Best Practices
status: accepted
category: performance
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-023: Performance Best Practices

## Status

**Accepted**

## Context

Performance directly impacts user experience and conversion:
- Slow pages lose users
- Order book latency affects trading
- Mobile users need optimization
- Search engines rank by performance

## Decision

Follow **Performance Best Practices**:
- Next.js App Router with Server Components
- Lazy load non-critical components
- Optimize images and fonts
- Minimize JavaScript bundle size
- Database query optimization
- Caching at multiple levels

Specific tactics:
- Use React Server Components by default
- `next/image` for optimized images
- Code splitting with dynamic imports
- Convex query optimization with indexes
- Edge caching for static content
- Debounce/throttle rapid events
- Web Workers for heavy computation

## Consequences

**Positive:**
- Faster user experience
- Better SEO rankings
- Reduced server costs
- Higher conversion rates
- Mobile-friendly performance

**Negative:**
- Additional development complexity
- More testing scenarios
- Trade-offs between DX and performance
- Requires performance monitoring

## Governance

All changes MUST:
- Use Server Components by default
- Lazy load client components
- Optimize database queries
- Monitor bundle size
- Test on real devices
- Measure Core Web Vitals
- Document performance implications

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Component patterns, query performance, bundle analysis
