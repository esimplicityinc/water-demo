---
id: ADR-020
title: shadcn/ui for Component Library
status: accepted
category: infrastructure
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-020: shadcn/ui for Component Library

## Status

**Accepted**

## Context

Building UI components from scratch is time-consuming. Pre-built libraries often:
- Don't match our design needs
- Are hard to customize
- Include unused components
- Have complex theming systems

## Decision

Use **shadcn/ui** for the component library:
- Copy-paste components (not a dependency)
- Built on Radix UI primitives
- Fully customizable via Tailwind
- Accessibility built-in
- TypeScript-first
- CLI for adding components

Components we use:
- Button, Input, Select
- Dialog, Sheet, Dropdown
- Table, Card
- Form components with validation

## Consequences

**Positive:**
- Full ownership of component code
- Easy to customize for our needs
- No runtime dependency bloat
- Accessible out of the box
- Professional design patterns

**Negative:**
- Must update components manually
- Initial setup requires copying files
- Requires understanding of Radix primitives
- More code in repository

## Governance

All changes MUST:
- Install components via `npx shadcn add`
- Customize components for our design system
- Maintain accessibility standards
- Document component usage patterns
- Keep components in `components/ui/`

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Component customization, accessibility, design consistency
