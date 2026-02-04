---
sidebar_position: 1
id: changes-index
title: Change History
---

# AquaTrack Change History

Individual change records with full governance tracking. Each change includes compliance validation, agent signatures, and BDD test results.

## Recent Changes

<!-- AUTO-GENERATED: This section is updated automatically by @change-manager -->

### [Unreleased]

*No unreleased changes*

### [0.4.0] - 2026-01-31

- [CHANGE-039: Agent Directory & Discovery](./CHANGE-039.md) - 2026-02-01
- [CHANGE-009: Water Request System](./CHANGE-009.md) - 2026-01-31
- [CHANGE-008: Supplier Profile Management](./CHANGE-008.md) - 2026-01-31
- [CHANGE-007: Reputation System](./CHANGE-007.md) - 2026-01-31

### [0.3.0] - 2026-01-31

- [CHANGE-004: Supplier Authentication](./CHANGE-004.md) - 2026-01-31
- [CHANGE-003: BDD Testing Framework](./CHANGE-003.md) - 2026-01-31
- [CHANGE-002: Supplier Registration](./CHANGE-002.md) - 2026-01-31
- [CHANGE-001: Project Foundation](./CHANGE-001.md) - 2026-01-31

## Change Format

Each change file includes:
- **Full governance frontmatter** (compliance checks, agent signatures)
- **BDD test results** (scenarios, pass/fail counts)
- **Implementation summary** by architectural layer
- **Breaking changes** (if any)
- **Migration notes** (if applicable)

## Status Legend

| Status | Description |
|--------|-------------|
| **draft** | Change in progress, not yet complete |
| **published** | Change complete, fully validated, and released |
| **archived** | Old change kept for historical reference |

## Categories

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features marked for removal
- **Removed** - Deleted features
- **Fixed** - Bug fixes
- **Security** - Security improvements

## Compliance Requirements

Before a change can be marked as `published`:
- ✅ ADR compliance check: **pass**
- ✅ BDD scenarios: All passing
- ✅ NFR checks: Performance, Security, Accessibility all pass
- ✅ Agent signatures: Minimum 4 agents (architecture, BDD, code, NFR)

## Related

- [Roadmap](../ROADMAP.mdx) - Current development status
- [Template](./TEMPLATE.md) - Format for creating new changes
- [Master Changelog](../CHANGELOG.md) - Aggregated change history

---

**Last Updated**: 2026-02-01  
**Maintained By**: @change-manager agent