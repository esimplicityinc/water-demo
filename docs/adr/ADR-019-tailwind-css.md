---
id: ADR-019
title: Tailwind CSS for Styling
status: accepted
category: infrastructure
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-019: Tailwind CSS for Styling

## Status

**Accepted**

## Context

Styling approaches vary widely:
- CSS-in-JS has runtime overhead
- CSS modules can lead to duplication
- Plain CSS lacks design system consistency
- Component libraries may not match our design needs

## Decision

Use **Tailwind CSS v4** for styling:
- Utility-first CSS framework
- Consistent design system via configuration
- Just-in-Time (JIT) compiler for small bundles
- Easy responsive design with breakpoints
- Dark mode support built-in
- TypeScript support with class variance authority

Configuration:
- `app/globals.css` with `@theme inline` pattern
- CSS variables for design tokens
- Custom theme configuration in CSS
- No JavaScript config file

## Consequences

**Positive:**
- Consistent design language
- Small CSS bundle (only used utilities)
- Rapid development with utility classes
- Easy to maintain and refactor
- Great for component libraries

**Negative:**
- HTML can become verbose with many classes
- Learning curve for utility-first approach
- Can lead to inconsistency without discipline
- Harder to write semantic CSS

## Governance

All changes MUST:
- Use Tailwind utility classes
- Define design tokens in CSS variables
- Follow responsive design patterns
- Use `@theme inline` for Tailwind v4
- Avoid arbitrary values (use theme values)

## Validation

**Enforced by:** `@arch-inspector`
**Check:** CSS organization, theme consistency, responsive design
