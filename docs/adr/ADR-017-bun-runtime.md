---
id: ADR-017
title: Bun as Runtime and Package Manager
status: accepted
category: infrastructure
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-017: Bun as Runtime and Package Manager

## Status

**Accepted**

## Context

Node.js has been the standard JavaScript runtime but has limitations:
- Slower startup times
- npm package management overhead
- Less optimal TypeScript support
- Build tool complexity (webpack, esbuild, etc.)

## Decision

Use **Bun** as the JavaScript runtime and package manager:
- All-in-one toolkit (runtime, bundler, test runner, package manager)
- Native TypeScript support
- Fast package installation with lockfile
- Built-in bundling and transpilation
- Compatible with Node.js APIs

Configuration:
- `bun.lockb` for dependencies
- `bun run` for scripts
- `bun test` for testing
- `bun build` for production bundles

## Consequences

**Positive:**
- Significantly faster than Node.js + npm
- Simpler toolchain (one tool vs many)
- Better developer experience
- Reduced CI/CD times
- Native TypeScript without ts-node

**Negative:**
- Newer project, less ecosystem maturity
- Some npm packages may have compatibility issues
- Team needs to learn new tooling
- Some Node.js APIs not yet supported

## Governance

All changes MUST:
- Use Bun for package management
- Use Bun for running scripts
- Ensure compatibility with Bun's Node.js API subset
- Document any Bun-specific workarounds
- Pin Bun version in CI/CD

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Build configuration, CI/CD setup, compatibility testing
