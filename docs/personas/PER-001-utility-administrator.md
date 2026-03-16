---
name: "Utility Administrator"
tag: "@PER-001"
type: human
status: approved
archetype: creator

description: "Administrators managing water utility operations and customer accounts. These are technical users who enroll customers, manage service areas, and oversee platform operations."

goals:
  - Enroll new customers quickly with accurate data
  - Manage service area boundaries and facility information
  - Monitor system health and audit logs
  - Generate reports on service area performance
  - Ensure regulatory compliance

pain_points:
  - Complex multi-step customer enrollment process
  - Unclear service area mapping with geographic data
  - Limited visibility into system audit trails
  - Difficulty identifying service issues quickly
  - Regulatory reporting is time-consuming

behaviors:
  - Values comprehensive documentation with examples
  - Prefers web UI for configuration and monitoring
  - Needs clear error messages with remediation steps
  - Regularly reviews system logs and metrics
  - Follows security and compliance best practices

typical_capabilities:
  - CAP-001
  - CAP-002
  - CAP-006

technical_profile:
  skill_level: intermediate
  integration_type: web_ui
  frequency: daily

related_stories:
  - US-001
  - US-002
  - US-006

related_personas:
  - PER-002
  - PER-004

created: "2026-01-31"
updated: "2026-02-01"
validated_by: "@ddd-aligner"
---

# PER-001: Utility Administrator

## Profile

Utility Administrators are the primary human managers of the AquaTrack platform. They manage customer enrollment, service area configuration, and oversight of water utility operations. These professionals work for municipal water utilities and private water companies.

## User Journey

1. **Discovery** - Learns about AquaTrack platform capabilities
2. **Initial Setup** - Configures service areas and facilities (US-006)
3. **Customer Enrollment** - Registers new customers in the system (US-001)
4. **Service Activation** - Initiates water service to new locations (US-002)
5. **Monitoring** - Regularly reviews system health and audit logs
6. **Reporting** - Generates compliance and performance reports

## Key Characteristics

- **Technical Proficiency**: Intermediate to advanced
- **Integration Preference**: Web UI with API access when needed
- **Security Conscious**: Values audit trails and compliance logging
- **Data Driven**: Relies on metrics and reports for decisions

## Pain Points & Solutions

| Pain Point | Platform Solution |
|------------|-------------------|
| Enrollment complexity | Simplified customer enrollment form (US-001) |
| Service area mapping | Interactive map interface (US-006) |
| Limited audit visibility | Comprehensive audit logging (CAP-002) |
| Reporting burden | Automated report generation |

## BDD Tag

Use `@PER-001` to tag BDD scenarios involving Utility Administrators:

```gherkin
@PER-001 @US-001 @CAP-001
Feature: Customer Enrollment
  As a utility administrator
  I want to enroll a new customer
  So that they can receive water service
```

---

**Tag**: `@PER-001` | **Type**: Human | **Archetype**: Creator | **Status**: Approved
