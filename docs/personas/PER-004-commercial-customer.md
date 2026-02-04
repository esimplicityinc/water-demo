---
id: PER-004
name: "Commercial Customer"
tag: "@PER-004"
type: human
status: approved
archetype: administrator

description: "Commercial and industrial water customers including businesses, factories, and institutions. These customers need detailed consumption analytics, bulk service management, and integration with their own systems."

goals:
  - Monitor water consumption across multiple locations
  - Analyze usage patterns for cost optimization
  - Manage water service at scale
  - Integrate water data into business systems
  - Ensure regulatory compliance

pain_points:
  - Managing multiple meter locations separately
  - Limited analytics for cost reduction
  - Difficulty integrating with business systems
  - Complex billing with multiple services
  - Regulatory reporting requirements

behaviors:
  - Analyzes consumption trends regularly
  - Uses data for operational decisions
  - Prefers API integration over manual access
  - Follows strict compliance procedures
  - Plans maintenance based on data

typical_capabilities:
  - CAP-001
  - CAP-002
  - CAP-003
  - CAP-005
  - CAP-006

technical_profile:
  skill_level: advanced
  integration_type: api
  frequency: daily

related_stories:
  - US-005
  - US-006

related_personas:
  - PER-001
  - PER-002

created: "2026-01-31"
updated: "2026-02-01"
validated_by: "@ddd-aligner"
---

# PER-004: Commercial Customer

## Profile

Commercial Customers are business entities using water at significant scale. They include offices, restaurants, manufacturing facilities, and institutions that need advanced monitoring and analytics capabilities.

## User Journey

1. **Setup** - Administrator configures multiple meters and locations
2. **Monitoring** - Reviews real-time consumption across sites (US-005)
3. **Analysis** - Uses data to optimize operations
4. **Reporting** - Generates compliance and cost reports
5. **Integration** - Connects AquaTrack data to business systems (PER-005)

## Key Characteristics

- **Data Driven**: Makes decisions based on analytics
- **Integration Focused**: Needs API access
- **Scale Conscious**: Manages multiple locations
- **Compliance Required**: Must meet regulatory standards

## Commercial Functions

Commercial Customers perform:

```
┌──────────────────┐
│  Multi-Location  │
│   Management     │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
Location 1  Location 2
   Meter      Meter
```

## BDD Tag

Use `@PER-004` to tag BDD scenarios involving Commercial Customers:

```gherkin
@PER-004 @US-005 @CAP-005
Feature: View Usage History
  As a commercial customer
  I want to analyze usage across locations
  So that I can optimize water costs
```

---

**Tag**: `@PER-004` | **Type**: Human | **Archetype**: Administrator | **Status**: Approved
