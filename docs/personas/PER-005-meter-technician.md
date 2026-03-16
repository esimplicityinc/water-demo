---
name: "Meter Technician"
tag: "@PER-005"
type: human
status: draft
archetype: integrator

description: "Field technicians who install and maintain smart water meters. These technicians interact with customers, diagnose meter issues, and transmit readings to AquaTrack system."

goals:
  - Install smart meters correctly and efficiently
  - Troubleshoot meter and service issues
  - Maintain meter readings and calibration
  - Communicate with customers professionally
  - Document work in field systems

pain_points:
  - Complex meter installation procedures
  - Limited mobile access to customer information
  - Unclear service address mapping
  - Difficulty logging work in AquaTrack
  - Communication gaps with dispatch center

behaviors:
  - Works in field with mobile app access
  - Values clear work instructions
  - Needs quick access to customer details
  - Prefers simple, reliable equipment
  - Maintains accurate documentation

typical_capabilities:
  - CAP-001
  - CAP-004
  - CAP-007

technical_profile:
  skill_level: intermediate
  integration_type: mobile_app
  frequency: continuous

related_stories:
  - US-002
  - US-008
  - US-010

related_personas:
  - PER-001
  - PER-002
  - PER-003

created: "2026-01-31"
updated: "2026-02-01"
validated_by: "@ddd-aligner"
---

# PER-005: Meter Technician

## Profile

Meter Technicians are field service professionals responsible for installing, maintaining, and diagnosing smart water meters. They work in the field with mobile access to customer information and dispatch systems.

## Use Cases

- **Meter Installation**: Install smart meters at new service locations
- **Meter Troubleshooting**: Diagnose and fix meter issues
- **Service Requests**: Respond to technician dispatch for service calls
- **Data Verification**: Validate meter readings and functionality
- **Customer Interaction**: Communicate with customers about service

## Integration Patterns

```
┌─────────────────────┐         ┌─────────────────────┐
│  Mobile App         │◄───────►│  AquaTrack API     │
│   (PER-005)         │  WiFi   │                     │
└─────────────────────┘  4G/LTE └─────────────────────┘
         │                               │
         │     Work Orders               │
         └───────────────────────────────┘
```

## Mobile App Access

Meter Technicians use:
- **Work Orders**: Dispatch assignments (CAP-007)
- **Customer Info**: Account and service details
- **Meter Status**: Reading and diagnostic data
- **Photo Upload**: Document installations and issues
- **GPS Routing**: Navigate to service locations

## Current Status

This persona is in **draft** status as field operations features are still in planning.

## BDD Tag

Use `@PER-005` to tag BDD scenarios involving Meter Technicians:

```gherkin
@PER-005 @US-002
Feature: Install Smart Meter
  As a meter technician
  I want to receive install work orders
  So that I can deploy smart meters to customers
```

---

**Tag**: `@PER-005` | **Type**: Human | **Archetype**: Integrator | **Status**: Draft
