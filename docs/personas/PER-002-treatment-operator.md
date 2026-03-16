---
name: "Treatment Operator"
tag: "@PER-002"
type: human
status: approved
archetype: operator

description: "Water treatment and distribution facility operators. These operators manage water treatment processes, monitor service areas, coordinate with technicians, and handle customer communications."

goals:
  - Monitor water quality and treatment processes
  - Manage service area operations efficiently
  - Coordinate technician deployment for service requests
  - Communicate effectively with customers
  - Maintain high service availability

pain_points:
  - Real-time monitoring of multiple service areas
  - Difficulty dispatching technicians optimally
  - Limited communication tools with field teams
  - Complex usage analysis for billing
  - Integration with legacy metering systems

behaviors:
  - Optimizes operations based on demand patterns
  - Monitors equipment and system metrics continuously
  - Prefers mobile access for field coordination
  - Values real-time notifications and alerts
  - Maintains strict quality and safety standards

typical_capabilities:
  - CAP-001
  - CAP-002
  - CAP-003
  - CAP-005
  - CAP-007

technical_profile:
  skill_level: advanced
  integration_type: web_ui_and_mobile
  frequency: continuous

related_stories:
  - US-002
  - US-005
  - US-006
  - US-009
  - US-010

related_personas:
  - PER-001
  - PER-003

created: "2026-01-31"
updated: "2026-02-01"
validated_by: "@ddd-aligner"
---

# PER-002: Treatment Operator

## Profile

Treatment Operators are experienced water utility professionals responsible for day-to-day operations of water treatment and distribution systems. They manage facility operations, monitor service quality, and coordinate with field technicians and customers.

## User Journey

1. **Setup** - Configures monitoring dashboards and service areas
2. **Service Activation** - Activates water service for new customers (US-002)
3. **Monitoring** - Continuously monitors service area metrics
4. **Communication** - Handles customer requests and coordinates responses (US-009)
5. **Analysis** - Reviews usage patterns and consumption trends (US-005)
6. **Coordination** - Manages technician dispatch and field operations (US-008)

## Key Characteristics

- **Autonomy**: Manages operations with minimal oversight
- **Real-time Focus**: Needs current data on system status
- **Operational Critical**: Decisions directly impact service delivery
- **Field Coordinated**: Works with mobile teams and field technicians

## Operational Responsibilities

Treatment Operators manage:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Treatment   │────▶│   Service    │────▶│  Technician  │
│   Facility   │     │    Area      │     │ Coordination │
└──────────────┘     └──────────────┘     └──────────────┘
```

## BDD Tag

Use `@PER-002` to tag BDD scenarios involving Treatment Operators:

```gherkin
@PER-002 @US-002 @CAP-005
Feature: Service Activation
  As a treatment operator
  I want to activate water service
  So that customers receive treated water
```

---

**Tag**: `@PER-002` | **Type**: Human | **Archetype**: Operator | **Status**: Approved
