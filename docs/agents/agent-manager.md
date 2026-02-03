# Agent Manager

The Agent Manager is a primary OpenCode agent that helps you create, edit, and analyze agents.

## Overview

Managing agents in OpenCode involves three main operations:

1. **Creating new agents** - Design agents from scratch
2. **Editing existing agents** - Improve agent behavior  
3. **Analyzing sessions** - Review performance and suggest improvements

The Agent Manager provides a unified interface for all three operations.

## Usage

Start the agent manager:

```
@agent-manager
```

You'll see a menu with three options:

```
# Agent Manager

Welcome! I can help you manage OpenCode agents.

What would you like to do?

1. Create New Agent
2. Edit Existing Agent
3. Analyze Agent Sessions
```

### Mode 1: Create New Agent

Select option 1 to create a new agent. The agent creator will:

1. Ask about the agent's purpose and identity
2. Determine required tools and permissions
3. Set behavior and autonomy levels
4. Generate the agent configuration
5. Create the agent prompt file

**Example:**
```
@agent-manager
→ Select "Create New Agent"
→ Answer questionnaire about the new agent
→ Review generated configuration
→ Agent is created and ready to use
```

### Mode 2: Edit Existing Agent

Select option 2 when an agent isn't behaving as expected. The agent editor will:

1. Show list of existing agents
2. Ask what you expected vs. what happened
3. Collect any relevant documentation
4. Suggest improvements
5. Apply changes with your approval

**Example:**
```
@agent-manager
→ Select "Edit Existing Agent"
→ Choose the agent to improve
→ Describe the issue
→ Review suggested changes
→ Changes applied
```

### Mode 3: Analyze Agent Sessions

Select option 3 to analyze how an agent is performing. The session analyzer will:

1. Find session files for the agent
2. Analyze tool usage patterns
3. Identify errors and inefficiencies
4. Track user interventions
5. Generate improvement recommendations

**Example:**
```
@agent-manager
→ Select "Analyze Agent Sessions"
→ Choose agent and time period
→ Review analysis report
→ Apply recommended changes
```

## Agent Configuration

When you create or edit an agent, two files are modified:

### 1. Agent Prompt File

Location: `.shared/agents/{agent-name}.md`

Contains:
- YAML frontmatter with metadata
- Role and responsibility description
- Workflow instructions
- Constraints and examples

### 2. Agent Configuration

Location: `opencode.json`

Contains:
- Agent mode (primary/subagent)
- Tool permissions
- File access permissions
- Temperature and other settings

## Best Practices

### Creating Agents

1. **Start with clear purpose** - Know exactly what the agent should do
2. **Use sub-agents for specialization** - Break complex tasks into smaller agents
3. **Grant minimal permissions** - Only give tools that are needed
4. **Document constraints clearly** - Agents follow rules better when explicit

### Editing Agents

1. **Provide specific examples** - "It did X when I wanted Y" is more helpful than "it's broken"
2. **Reference documentation** - If you have docs showing expected behavior, share them
3. **Test after changes** - Run the agent with a test task to verify fixes

### Analyzing Sessions

1. **Analyze regularly** - Check agent performance monthly
2. **Look for patterns** - Repeated issues indicate prompt problems
3. **Start with high-priority fixes** - Focus on issues with biggest impact

## Troubleshooting

### Agent not showing in list

If you created an agent but it doesn't appear:

1. Check `opencode.json` has the agent entry
2. Verify the prompt file exists at `.shared/agents/{name}.md`
3. Restart OpenCode to reload configuration

### Changes not taking effect

If you edited an agent but behavior hasn't changed:

1. Verify changes were saved to the prompt file
2. Check that `opencode.json` was updated if permissions changed
3. Start a new OpenCode session (agents are loaded at startup)

### Session analysis finds no files

If the analyzer can't find session files:

1. Check that sessions are being logged to `.opencode/sessions/`
2. Verify the agent name matches what's in session files
3. Try searching all sessions instead of filtering by agent

## File Locations

| Purpose | Path |
|---------|------|
| Agent prompts | `.shared/agents/*.md` |
| Agent config | `opencode.json` |
| Session logs | `.opencode/sessions/*.md` |
| Analysis reports | `.opencode/analysis/*.md` |
| This documentation | `docs/agents/agent-manager.md` |

## Related Agents

- **agent-creator** - Used internally for creation mode
- **agent-editor** - Used internally for edit mode
- **agent-analyzer** - Used internally for analysis mode
- **superpowers-orchestrator** - For general development workflows

## Examples

### Creating a Testing Agent

```
@agent-manager
→ 1 (Create)
→ Type: Sub-agent
→ Purpose: Testing
→ Name: api-tester
→ Description: "Tests REST API endpoints and reports results"
→ Tools: read, write, bash
→ Bash permissions: curl, npm test
→ Autonomy: Medium
→ Constraint: "Always show test output to user"
→ Generated files: .shared/agents/api-tester.md
```

### Fixing an Over-Eager Agent

```
@agent-manager
→ 2 (Edit)
→ Select: code-writer
→ Issue: "Commits changes without asking"
→ Expected: "Ask before git commit"
→ Actual: "Committed directly"
→ Change: Add constraint "Never run git commit without explicit user approval"
```

### Analyzing Performance

```
@agent-manager
→ 3 (Analyze)
→ Select: bdd-runner
→ Period: Last 30 days
→ Finding: 60% of sessions had user corrections
→ Recommendation: Add "Always verify test file exists before running"
```
