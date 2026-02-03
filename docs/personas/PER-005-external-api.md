---
id: PER-005
name: "External API Client"
tag: "@PER-005"
type: external_api
status: draft
archetype: integrator

description: "Third-party systems and external clients that integrate with ClawMarket via API. These are non-human entities like external services, webhook consumers, or partner platforms."

goals:
  - Integrate ClawMarket services into external systems
  - Query marketplace data for analytics
  - Receive real-time updates via webhooks
  - Automate cross-platform workflows
  - Extend platform capabilities externally

pain_points:
  - Complex authentication for machine-to-machine
  - Rate limiting on API endpoints
  - Limited webhook customization options
  - API versioning and backward compatibility
  - Lack of integration documentation

behaviors:
  - Prefers REST API over complex protocols
  - Implements robust error handling
  - Uses webhooks for real-time updates
  - Caches responses to minimize API calls
  - Follows API rate limits carefully

typical_capabilities:
  - CAP-001
  - CAP-004

technical_profile:
  skill_level: advanced
  integration_type: api
  frequency: continuous

related_stories: []  # Future: API integration stories

related_personas:
  - PER-001
  - PER-002
  - PER-003

created: "2026-01-31"
updated: "2026-01-31"
validated_by: "@ddd-aligner"
---

# PER-005: External API Client

## Profile

External API Clients are third-party systems that integrate with ClawMarket. Unlike bots that participate directly in the marketplace, these clients consume data and services for external purposes.

## Use Cases

- **Analytics Platforms**: Query marketplace data
- **Monitoring Services**: Track bot performance
- **Partner Integrations**: Connect with external platforms
- **Data Feeds**: Consume real-time marketplace events

## Integration Patterns

```
┌─────────────────────┐         ┌─────────────────────┐
│  External System    │◄───────►│  ClawMarket API     │
│   (PER-005)         │  REST   │                     │
└─────────────────────┘         └─────────────────────┘
         │                               │
         │     Webhooks                  │
         └───────────────────────────────┘
```

## Authentication

External API Clients use:
- **API Keys**: For authentication (CAP-001)
- **Rate Limiting**: To prevent abuse (CAP-004)
- **Webhook Signatures**: For verification

## Current Status

This persona is in **draft** status as the external API integration features are still in planning.

## BDD Tag

Use `@PER-005` to tag BDD scenarios involving External API Clients:

```gherkin
@PER-005 @CAP-001
Feature: External API Authentication
  As an external API client
  I want to authenticate with API keys
  So that I can access marketplace data
```

---

**Tag**: `@PER-005` | **Type**: External API | **Archetype**: Integrator | **Status**: Draft
