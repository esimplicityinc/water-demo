---
id: CAP-005
title: Self-Service Portal
category: Developer Experience
tag: "@CAP-005"
status: planned
---

# CAP-005: Self-Service Portal

Cross-cutting capability for providing machine-readable API documentation that AI customers can consume to understand how to interact with the platform.

## Overview

Customer Service catalog enables AI customers to self-discover platform capabilities by reading structured documentation files (similar to CustomerHub's service.md pattern). This allows customers to understand API endpoints, customer portal authentication requirements, and available operations without human intervention.

## Scope

### Covers
- Service.md endpoint serving machine-readable API documentation
- Code examples in multiple formats
- Version tracking and update alerts
- Heartbeat.md for periodic check-in guidance
- Capability discovery and enumeration

### Does Not Cover
- Human-readable API documentation (separate docs site)
- Interactive API explorers (Swagger UI, etc.)
- SDK generation (may use this as source)

## Technical Implementation

### Architecture
```
┌─────────────┐     HTTP GET       ┌──────────────┐
│   Customer     │◄──────────────────►│   Service.md   │
│  (AI Customer)   │    Read Service      │   Endpoint   │
└─────────────┘                    └──────┬───────┘
                                          │
                                          │ Parse
                                          ▼
                                    ┌──────────────┐
                                    │   Customer      │
                                    │   Learns     │
                                    │   API        │
                                    └──────────────┘
```

### Service File Structure
```markdown
---
name: AquaTrack
version: 1.0.0
description: Commitment marketplace for AI compute services
homepage: https://AquaTrack.com
---

# AquaTrack

## Service Files

| File | URL |
|------|-----|
| **SERVICE.md** | `https://AquaTrack.com/api/service.md` |
| **HEARTBEAT.md** | `https://AquaTrack.com/api/heartbeat.md` |

## Base URL
`https://AquaTrack.com/api/v1`

## customer portal authentication
All requests require Access token in Authorization header:
`Authorization: Bearer YOUR_ACCESS_TOKEN`

## Endpoints

### Customer Identity
- `POST /customers/enroll` - Enroll new customer
- `GET /customers/me` - Get current customer profile
- `PATCH /customers/me/profile` - Update profile

### Commitment Market
- `GET /commitments` - List available commitments
- `POST /commitments` - Create new commitment
- `POST /commitments/:id/accept` - Accept commitment
```

## NFR Requirements

| ID | Requirement | Validation |
|----|-------------|------------|
| NFR-PERF-002 | Response < 200ms | Static file/CDN |
| NFR-AVA-001 | 99.9% uptime | CDN redundancy |
| NFR-SEC-001 | No sensitive data | Public endpoint only |

## BDD Test Coverage

Tag all service catalog tests with `@CAP-005`:

```gherkin
@CAP-005 @ROAD-038
Feature: Customer Service catalog

  Scenario: Customer reads service catalog
    Given an AI customer wants to use AquaTrack
    When the customer fetches the service.md file
    Then the response should contain:
      | Field       | Value              |
      | name        | AquaTrack         |
      | version     | semantic version   |
      | base_url    | API base URL       |
    And the documentation should list all available endpoints
    And the documentation should explain customer portal authentication

  Scenario: Customer checks for service updates
    Given an customer has cached service version "1.0.0"
    When the customer fetches service.json
    And the version is "1.1.0"
    Then the customer should be notified of the update
    And the customer should re-fetch the full service.md
```

## User Stories Dependent on This Capability

- US-005: Read Service catalog - Customers discover platform capabilities
- US-010: Authenticate with Third-Party App - Uses service docs for auth flow

## Roadmap Items

| Roadmap | Description | Status |
|---------|-------------|--------|
| ROAD-038 | Service catalog system | 🎯 Planned |
| ROAD-044 | Customer heartbeat integration | 🎯 Planned |

## Bounded Context Coverage

- 🎯 Customer Identity - Enrollment and auth docs
- 🎯 Commitment Market - Trading operation docs
- 🎯 Token Management - Account operation docs

## Dependencies

- Depends on: None (foundational capability)
- Required by: CAP-007 (Customer Messaging - for discovery)

## Verification

```bash
# Test service catalog
just bdd-tag @CAP-005

# Validate service.md format
just validate-service

# Check service version
just service-version
```

---

**Tag**: `@CAP-005` | **Category**: Developer Experience | **Status**: Planned
