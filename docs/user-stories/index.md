---
sidebar_position: 1
title: User Stories Catalog
---

# User Stories

User stories describe **user needs** that depend on system capabilities. Each story follows the format:

> **As a** [persona]  
> **I want** [goal]  
> **So that** [benefit]  
> **Depends on** [capabilities]

## What is a User Story?

A user story captures a specific user need:
- Has a clear persona (who)
- Describes a goal (what)
- Explains the benefit (why)
- **Depends on specific capabilities** (how it's enabled)
- Maps to one or more use cases
- Implemented by roadmap items

```mermaid
graph TB
    subgraph "User Stories"
        US1[US-001: Customer Enrollment]
        US2[US-002: Service Activation]
        US3[US-004: Meter Reading]
        US4[US-005: Usage History]
    end
    
    subgraph "Capabilities"
        C1[CAP-001: Authentication]
        C2[CAP-002: Audit Logging]
        C3[CAP-005: Analytics]
    end
    
    US1 --> C1
    US1 --> C2
    US2 --> C1
    US2 --> C2
    US3 --> C1
    US3 --> C2
    US4 --> C3
```

## Story Catalog by Actor

### Utility Administrator
Stories for administrators enrolling customers and managing accounts:

- [US-001: Enroll New Customer](./US-001-customer-enrollment) - Create customer account
- [US-002: Activate Water Service](./US-002-service-activation) - Start water delivery
- [US-006: Service Area Lookup](./US-006-service-area-lookup) - Find service areas

### Treatment Operator
Stories for operators managing water distribution and service:

- [US-002: Activate Water Service](./US-002-service-activation) - Initiate customer service
- [US-005: View Usage History](./US-005-view-usage-history) - Analyze consumption patterns
- [US-006: Service Area Lookup](./US-006-service-area-lookup) - Locate service zones
- [US-007: Submit Service Request](./US-007-submit-service-request) - Handle requests
- [US-009: Customer Communication](./US-009-customer-communication) - Coordinate service

### Residential Customer
Stories for customers monitoring water usage and requesting service:

- [US-004: Record Meter Reading](./US-004-meter-reading) - View consumption
- [US-007: Submit Service Request](./US-007-submit-service-request) - Report issues
- [US-008: Technician Dispatch](./US-008-technician-dispatch) - Track service visits

### Field Operations Manager
Stories for managing field personnel and service delivery:

- [US-008: Technician Dispatch](./US-008-technician-dispatch) - Assign technicians
- [US-009: Customer Communication](./US-009-customer-communication) - Coordinate with technicians

## Dependency Matrix

| Story | Persona | Capabilities Required | Use Cases | Roadmap |
|-------|---------|----------------------|-----------|---------|
| US-001 | PER-001 | CAP-001, CAP-002 | UC-001 | ROAD-004 |
| US-002 | PER-002 | CAP-001, CAP-002, CAP-005 | UC-010 | ROAD-012 |
| US-004 | PER-003 | CAP-001, CAP-002, CAP-003, CAP-005 | UC-013 | ROAD-016 |
| US-005 | PER-002 | CAP-005 | UC-020 | ROAD-038 |
| US-006 | PER-002 | CAP-001, CAP-006 | UC-021 | ROAD-039 |
| US-007 | PER-003 | CAP-001, CAP-006, CAP-007 | UC-022 | ROAD-042 |
| US-008 | PER-001 | CAP-007 | UC-023 | ROAD-042 |
| US-009 | PER-002 | CAP-003, CAP-007 | UC-024 | ROAD-042 |
| US-010 | PER-002 | CAP-001, CAP-008 | UC-025 | ROAD-043 |

## Story States

Stories progress through states:

```mermaid
stateDiagram-v2
    [*] --> Defined: Story written
    Defined --> Ready: Capabilities available
    Ready --> InProgress: Roadmap item started
    InProgress --> Implemented: Code complete
    Implemented --> Verified: BDD tests pass
    Verified --> [*]: Released
```

## Story Format

Each story document includes:

```markdown
---
id: US-XXX
title: Story Title
persona: [PER-001|PER-002|PER-003|PER-004|PER-005]
status: [defined|ready|in-progress|implemented|verified]
capabilities: [CAP-001, CAP-002, ...]
use_cases: [UC-XXX, ...]
roadmap: [ROAD-XXX, ...]
---

## Story
As a [actor], I want [goal], so that [benefit].

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Dependencies
- **Capabilities**: CAP-001, CAP-002
- **Use Cases**: UC-XXX
- **Roadmap**: ROAD-XXX

## BDD Scenarios
Link to feature files covering this story.
```

## Creating New Stories

1. **Identify the actor** - Who needs this?
2. **Define the goal** - What do they want to do?
3. **Explain the benefit** - Why does it matter?
4. **Map capabilities** - What system abilities are needed?
5. **Link to use cases** - Which DDD use cases cover this?
6. **Create roadmap item** - Plan the implementation

---

**Related**: [Capabilities](../capabilities/index) • [Use Cases](../ddd/07-use-cases) • [Roadmap](../ROADMAP)
