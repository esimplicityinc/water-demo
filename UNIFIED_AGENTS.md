# Unified Agent System: Claude Code + OpenCode

This document explains how the ClawMarket project uses a unified agent system that works with both **Claude Code** and **OpenCode**.

---

## Overview

We've created a system where:
- **Claude Code** uses its agents from `.claude/agents/`
- **OpenCode** uses its agents from `.opencode/agents/` and `opencode.json`
- **Skills are shared** between both tools via `.claude/skills/` (which OpenCode auto-discovers)

This gives you the flexibility to use either tool (or both!) depending on your workflow.

---

## Directory Structure

```
.claude/                          # Claude Code configuration
├── agents/                       # Claude agents (8 total)
│   ├── code-writer.md
│   ├── bdd-runner.md
│   ├── bdd-writer.md
│   ├── architecture-inspector.md
│   ├── ddd-aligner.md
│   ├── ci-runner.md
│   ├── site-keeper.md
│   └── ux-ui-inspector.md
├── skills/                       # SHARED skills
│   └── clean-ddd-hexagonal -> ../../.agents/skills/clean-ddd-hexagonal
└── settings.local.json

.opencode/                        # OpenCode configuration
├── agents/                       # OpenCode agent definitions
│   ├── code-writer.md
│   ├── bdd-runner.md
│   ├── bdd-writer.md
│   ├── architecture-inspector.md
│   ├── ddd-aligner.md
│   ├── ci-runner.md
│   ├── site-keeper.md
│   └── ux-ui-inspector.md
└── [can add more agents here]

opencode.json                     # OpenCode main configuration
AGENT.md                          # Project instructions for AI agents
```

---

## Available Agents

All 8 specialized agents are available in both tools:

| Agent | Purpose | Use When |
|-------|---------|----------|
| **code-writer** | Implementation specialist | Writing features, refactoring, creating aggregates |
| **bdd-runner** | Test execution | Running BDD tests, reporting failures |
| **bdd-writer** | Scenario creation | Writing Gherkin feature files |
| **architecture-inspector** | Hexagonal audit | Verifying ports & adapters compliance |
| **ddd-aligner** | Domain compliance | Checking ubiquitous language |
| **ci-runner** | CI checks | Running lint, typecheck, tests |
| **site-keeper** | Dev server management | Keeping servers running, troubleshooting |
| **ux-ui-inspector** | UI quality review | Accessibility, UX, responsive design |

---

## How to Use

### Using Claude Code

Claude agents are invoked via natural language or the Task tool:

```
Can you implement the bot registration feature?
```

The main agent will coordinate and delegate to `code-writer` as needed.

### Using OpenCode

OpenCode agents can be invoked by **@ mentioning** them:

```
@code-writer implement the bot registration feature following DDD patterns
```

Or by asking the main agent to delegate:

```
Please have the code-writer agent implement bot registration
```

### Switching Agents in OpenCode

Use the **Tab** key to cycle between primary agents:
- **Build** (default) - Full development mode
- **Plan** - Read-only analysis mode

---

## Shared Skills

Skills are stored in `.claude/skills/` and are automatically discovered by OpenCode.

### Current Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| **clean-ddd-hexagonal** | Clean Architecture + DDD + Hexagonal patterns | DDD, Clean Architecture, Hexagonal, aggregates, repositories |

### Using Skills

**In Claude Code:**
```
Apply the clean-ddd-hexagonal patterns to design this API endpoint
```

**In OpenCode:**
```
Let me load the clean-ddd-hexagonal skill first

Then: I need to design a new bounded context for user profiles
```

The skill will be loaded via the `skill` tool and provide specialized instructions.

---

## Configuration Details

### Claude Code (`.claude/`)

Claude uses markdown files with a custom format:
- Frontmatter with role, responsibility, autonomy
- Detailed instructions
- Code examples
- Communication protocols

### OpenCode (`opencode.json`)

OpenCode uses JSON configuration with:
- Agent definitions with mode, model, temperature
- Tool permissions
- Subagent task permissions
- Skill permissions

The `.opencode/agents/*.md` files contain the system prompts that agents use.

---

## Multi-Agent Workflows

Both tools support the same workflows:

### Feature Implementation Flow

```
1. bdd-writer → Create scenarios (asks permission)
2. code-writer → Implement feature
3. architecture-inspector → Verify hexagonal compliance
4. ddd-aligner → Check domain alignment
5. bdd-runner → Run tests
6. ci-runner → Run all checks
```

### Bug Fix Flow

```
1. bdd-runner → Identify failing tests
2. code-writer → Fix implementation
3. architecture-inspector → Verify architecture still valid
4. bdd-runner → Re-run tests
5. ci-runner → Full check
```

---

## Adding New Agents

### For Claude Code

Add a `.md` file to `.claude/agents/`:

```markdown
# My Agent

**Role**: Description  
**Responsibility**: What it does  
**Autonomy**: Level

## Capabilities
...
```

### For OpenCode

Add to both:
1. `.opencode/agents/my-agent.md` with frontmatter
2. `opencode.json` agent section

Or use the CLI:

```bash
opencode agent create
```

---

## Adding New Skills

Skills are **shared**! Add once, use in both tools.

Create `.claude/skills/<skill-name>/SKILL.md`:

```markdown
---
name: my-skill
description: What this skill does
---

## What I do
...

## When to use me
...
```

OpenCode will auto-discover it. Claude can use it via the skill tool.

---

## Command Reference

### Just Commands (Both Tools)

```bash
just dev-all          # Start Next.js + Convex
just test             # Run unit tests
just bdd-test         # Run BDD tests
just check            # Lint + typecheck + test
just bdd-tag @smoke   # Run smoke tests
```

### OpenCode Commands

```bash
opencode              # Start OpenCode
/init                 # Initialize project
/agent                # List available agents
/connect              # Connect to provider
```

---

## Best Practices

### 1. Use Both Tools
- **Claude Code** for complex multi-step workflows
- **OpenCode** for quick tasks and specific agent invocation

### 2. Leverage Skills
Always load relevant skills before specialized work:

```
Load the clean-ddd-hexagonal skill before designing this domain model
```

### 3. Coordinate Agents
Let agents work together:

```
Implement bot registration, then have architecture-inspector verify it
```

### 4. Keep Documentation Updated
Update this file when adding:
- New agents
- New skills
- New workflows
- New commands

---

## Troubleshooting

### Agent Not Found

**Claude**: Check `.claude/agents/` directory exists and file is `.md`

**OpenCode**: Check `opencode.json` has agent defined, or `.opencode/agents/` has `.md` file

### Skill Not Loading

- Verify `SKILL.md` is in all caps
- Check frontmatter has `name` and `description`
- Ensure YAML syntax is valid

### Permission Issues

**OpenCode**: Check `permission` section in `opencode.json` or agent frontmatter

**Claude**: Agents respect tool access defined in their capabilities

---

## Migration Guide

### If You Have Existing Claude Agents

✅ They continue to work as-is
✅ Skills are already shared
✅ Add OpenCode agents to `.opencode/agents/`
✅ Reference them in `opencode.json`

### If You're Starting Fresh

1. Create `.claude/agents/` with your agents
2. Create `.opencode/agents/` with OpenCode versions
3. Create `opencode.json` configuration
4. Add skills to `.claude/skills/`
5. Both tools will work immediately

---

## Questions?

- **DDD/Architecture**: See `docs/ddd/`
- **Commands**: See `COMMANDS.md`
- **Setup**: See `README.md`
- **OpenCode Docs**: https://opencode.ai/docs

---

**Last Updated**: 2026-01-31
**Version**: 1.0.0
