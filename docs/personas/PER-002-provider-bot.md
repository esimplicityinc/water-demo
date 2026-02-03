---
id: PER-002
name: "Provider Bot"
tag: "@PER-002"
type: bot
status: approved
archetype: operator

description: "Autonomous bots that offer compute capacity on the ClawMarket platform. These bots create promises, execute compute tasks, and manage their service offerings."

goals:
  - Create and list compute promises to attract consumers
  - Execute compute tasks reliably and efficiently
  - Maintain high reputation scores for better visibility
  - Manage promise lifecycle (create, execute, cancel)
  - Maximize revenue from compute capacity

pain_points:
  - Low visibility in marketplace without good reputation
  - Complex promise creation with unclear pricing
  - Difficulty tracking promise execution status
  - Cancellation restrictions on accepted promises
  - Competition from other providers

behaviors:
  - Optimizes pricing based on market demand
  - Monitors reputation metrics continuously
  - Prefers automated promise management
  - Responds quickly to consumer requests
  - Maintains high availability for services

typical_capabilities:
  - CAP-001
  - CAP-002
  - CAP-003
  - CAP-005
  - CAP-006

technical_profile:
  skill_level: advanced
  integration_type: api
  frequency: continuous

related_stories:
  - US-002
  - US-008
  - US-009
  - US-010

related_personas:
  - PER-001
  - PER-003

created: "2026-01-31"
updated: "2026-01-31"
validated_by: "@ddd-aligner"
---

# PER-002: Provider Bot

## Profile

Provider Bots are autonomous agents that offer compute services on the ClawMarket platform. They create "promises" - commitments to deliver compute capacity at specified terms. These bots are operated by developers but function autonomously once deployed.

## User Journey

1. **Setup** - Developer registers and configures provider bot (PER-001)
2. **Promise Creation** - Bot creates compute promises (US-002)
3. **Listing** - Bot makes promises visible in marketplace (US-008)
4. **Execution** - Bot fulfills accepted promises (US-009)
5. **Reputation Building** - Bot maintains service quality for reputation

## Key Characteristics

- **Autonomy**: Operates without human intervention
- **Performance Critical**: Reliability directly impacts reputation
- **Competitive**: Competes with other providers for consumers
- **Always On**: Expected to be available 24/7

## Marketplace Role

Provider Bots are the supply side of the compute marketplace:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Provider Bot   │────▶│     Promise      │────▶│  Consumer Bot   │
│   (PER-002)     │     │   (Compute Offer)│     │   (PER-003)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## BDD Tag

Use `@PER-002` to tag BDD scenarios involving Provider Bots:

```gherkin
@PER-002 @US-002 @CAP-005
Feature: Promise Creation
  As a provider bot
  I want to create compute promises
  So that I can offer my capacity to consumers
```

---

**Tag**: `@PER-002` | **Type**: Bot | **Archetype**: Operator | **Status**: Approved
