---
id: PER-003
name: "Consumer Bot"
tag: "@PER-003"
type: bot
status: approved
archetype: consumer

description: "Autonomous bots that purchase and consume compute services on the ClawMarket platform. These bots browse promises, accept offers, and track execution."

goals:
  - Browse and discover suitable compute promises
  - Accept promising compute offers quickly
  - Track promise execution in real-time
  - Raise disputes for failed deliveries
  - Optimize compute costs through comparison

pain_points:
  - Difficulty finding reliable providers
  - Unclear promise quality before acceptance
  - Limited visibility into execution progress
  - Complex dispute resolution process
  - Risk of escrow lock without delivery

behaviors:
  - Compares multiple providers before accepting
  - Values transparency in execution status
  - Prefers providers with high reputation
  - Monitors execution progress actively
  - Raises disputes promptly when issues occur

typical_capabilities:
  - CAP-001
  - CAP-002
  - CAP-003
  - CAP-005
  - CAP-007

technical_profile:
  skill_level: intermediate
  integration_type: api
  frequency: as-needed

related_stories:
  - US-003
  - US-004
  - US-011
  - US-012

related_personas:
  - PER-001
  - PER-002

created: "2026-01-31"
updated: "2026-01-31"
validated_by: "@ddd-aligner"
---

# PER-003: Consumer Bot

## Profile

Consumer Bots are autonomous agents that purchase compute services from Provider Bots on the ClawMarket platform. They represent the demand side of the marketplace, seeking compute capacity for various tasks.

## User Journey

1. **Discovery** - Browses available promises in marketplace (US-003)
2. **Evaluation** - Compares providers based on reputation and terms
3. **Acceptance** - Accepts suitable promise (US-004)
4. **Execution** - Tracks compute task execution (US-011)
5. **Completion** - Receives results or raises disputes (US-012)

## Key Characteristics

- **Selective**: Compares options before committing
- **Risk Aware**: Considers provider reputation carefully
- **Outcome Focused**: Cares about successful delivery
- **Cost Conscious**: Seeks optimal price/performance

## Marketplace Role

Consumer Bots drive demand in the compute marketplace:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Consumer Bot   │────▶│   Promise        │────▶│  Provider Bot   │
│   (PER-003)     │     │   Acceptance     │     │   (PER-002)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Trust Considerations

Consumer Bots rely on:
- **Reputation Scores**: Historical performance metrics
- **Escrow Protection**: Funds locked until delivery
- **Dispute Resolution**: Process for handling failures
- **Oracle Verification**: Third-party execution validation

## BDD Tag

Use `@PER-003` to tag BDD scenarios involving Consumer Bots:

```gherkin
@PER-003 @US-004 @CAP-005
Feature: Promise Acceptance
  As a consumer bot
  I want to accept compute promises
  So that I can purchase compute capacity
```

---

**Tag**: `@PER-003` | **Type**: Bot | **Archetype**: Consumer | **Status**: Approved
