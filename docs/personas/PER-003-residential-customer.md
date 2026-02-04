---
id: PER-003
name: "Residential Customer"
tag: "@PER-003"
type: human
status: approved
archetype: consumer

description: "Residential water customers who use AquaTrack to monitor consumption, request services, and manage their accounts. These customers want easy access to water usage data and quick service response."

goals:
  - Monitor personal water consumption
  - Understand water usage patterns
  - Request service quickly when issues arise
  - Receive timely service from technicians
  - Understand water billing

pain_points:
  - Unclear how much water they're using
  - Difficulty requesting service
  - No visibility into technician arrival time
  - Confusing water bills and charges
  - Limited communication about service issues

behaviors:
  - Checks usage data when receiving high bills
  - Prefers mobile app for service requests
  - Values transparency in billing and charges
  - Appreciates quick response times
  - Wants proactive notifications about issues

typical_capabilities:
  - CAP-001
  - CAP-002
  - CAP-003
  - CAP-004

technical_profile:
  skill_level: beginner
  integration_type: mobile_app
  frequency: monthly

related_stories:
  - US-001
  - US-004
  - US-007

related_personas:
  - PER-001
  - PER-002

created: "2026-01-31"
updated: "2026-02-01"
validated_by: "@ddd-aligner"
---

# PER-003: Residential Customer

## Profile

Residential Customers are household consumers of water services managed through the AquaTrack platform. They use the system to monitor their consumption, request service, and understand their water bills.

## User Journey

1. **Enrollment** - Administrator registers household (PER-001, US-001)
2. **Service Activation** - Technician installs smart meter and activates service
3. **Monitoring** - Views consumption through mobile app (US-004)
4. **Issues** - Submits service request when problems arise (US-007)
5. **Resolution** - Tracks technician dispatch and completion (US-008)

## Key Characteristics

- **Non-technical**: May lack technical expertise
- **Mobile First**: Prefers mobile app over web interface
- **Convenience Focused**: Values ease and speed
- **Cost Conscious**: Interested in reducing water bills

## Customer Needs

Residential customers rely on AquaTrack for:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  View Usage     │────▶│   Understand     │────▶│   Request       │
│   (US-004)      │     │   Consumption    │     │   Service       │
└─────────────────┘     └──────────────────┘     │   (US-007)      │
                                                  └─────────────────┘
```

## BDD Tag

Use `@PER-003` to tag BDD scenarios involving Residential Customers:

```gherkin
@PER-003 @US-004 @CAP-005
Feature: Record Meter Reading
  As a residential customer
  I want to view my meter readings
  So that I can understand my water consumption
```

---

**Tag**: `@PER-003` | **Type**: Human | **Archetype**: Consumer | **Status**: Approved
