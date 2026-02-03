---
id: ADR-024
title: Testing Strategy
status: accepted
category: architecture
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-024: Testing Strategy

## Status

**Accepted**

## Context

Testing is essential for confidence in changes:
- Regression bugs are costly
- Manual testing doesn't scale
- Financial systems require correctness
- Refactoring needs safety net

## Decision

Use a **Multi-Layer Testing Strategy**:
- **Unit Tests**: Domain logic, value objects, utilities
- **Integration Tests**: Application services, repositories
- **BDD Tests**: End-to-end user scenarios with Katalyst
- **Contract Tests**: API boundaries between contexts

Tools:
- **Bun test runner** for unit/integration tests
- **Katalyst BDD** for behavior-driven tests
- **Playwright** for UI automation via Katalyst

Testing principles:
- Test behavior, not implementation
- Domain tests are pure (no mocks)
- Integration tests use test databases
- BDD tests verify user value
- All tests run in CI/CD

## Consequences

**Positive:**
- Confidence in refactoring
- Living documentation
- Faster feedback loops
- Reduced bugs in production
- Better code design (testable code is better code)

**Negative:**
- Initial development overhead
- Test maintenance burden
- Can slow down rapid iteration
- Flaky tests if not careful

## Governance

All changes MUST:
- Include tests for new features
- Maintain > 80% code coverage
- Follow TDD/BDD practices (Superpowers)
- Keep tests fast (< 10 seconds per suite)
- Not disable tests without justification
- Document test patterns and helpers

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Test coverage, test quality, CI/CD integration
