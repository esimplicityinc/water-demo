---
title: Service Area Lookup
persona: PER-002
status: planned
capabilities:
  - CAP-006
  - CAP-001
use_cases:
  - UC-021
roadmap:
  - ROAD-039
---

# US-006: Service Area Lookup

## Story

**As a** treatment operator  
**I want** to browse and search service areas and find facility information  
**So that** I can locate customers, identify service problems, and manage territory coverage

## Acceptance Criteria

- [ ] Operator can browse service area map
- [ ] Operator can search areas by name or zip code
- [ ] Operator can view facility locations and details
- [ ] Operator can see coverage area boundaries
- [ ] Operator can view active customer count per area
- [ ] Operator can access area-specific performance metrics
- [ ] Private customer information is not exposed
- [ ] Results are paginated and filterable
- [ ] Directory updates in real-time when service changes

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-006: Service Area Directory | Browse areas and find facilities | 🎯 Planned |
| CAP-001: Authentication | Secure API access | ✅ Available |

### Maps to Use Cases
- **UC-021: Locate Service Area** - Primary use case
  - Search for service areas
  - View facility details
  - Check coverage zones

### Implemented By Roadmap
- **ROAD-039: Service Area Directory** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/water-service/02_service_area_lookup.feature`

```gherkin
@US-006 @CAP-006 @CAP-001 @ROAD-039
Feature: Service Area Lookup
  As a treatment operator
  I want to discover service areas
  So that I can manage water distribution

  Background:
    Given the Water Service context is initialized
    And multiple service areas are defined

  Scenario: Browse service area directory
    When an authenticated operator requests service areas
    Then the response should contain area directory
    And each area should have public profile fields:
      | Field | Type |
      | area_name | string |
      | facility | string |
      | zip_codes | array |
      | customer_count | number |
      | coverage_area | geospatial |
      | is_active | boolean |
    And private fields should not be exposed:
      | Field | Reason |
      | internal_id | Implementation detail |
      | cost_data | Financial |

  Scenario: Search service areas by location
    Given areas "North District", "South District", and "Central Hub" exist
    When searching for "District"
    Then all three areas should appear in results
    When searching for "North"
    Then only "North District" should appear
    And the search should be case-insensitive

  Scenario: Find areas with specific characteristics
    Given areas with varying characteristics:
      | Area | Status | Customers | Facility |
      | Urban North | active | 5000 | Treatment Plant A |
      | Rural South | active | 500 | Pump Station B |
      | Downtown | active | 8000 | Treatment Plant C |
    When filtering for areas with >1000 customers
    Then "Urban North" and "Downtown" should be returned
    And results should be sorted by customer count descending

  Scenario: View facility details
    Given facility "Treatment Plant A" exists
    When requesting facility profile
    Then the response should include:
      | Field | Description |
      | name | Facility name |
      | type | Treatment or pump |
      | location | Geographic coordinates |
      | service_areas | Areas served |
      | capacity | Processing capacity |
      | status | Operational status |
```

## Technical Notes

### Service Area Directory Endpoint
```http
GET /api/service-areas?search={query}&status={active}&limit={20}&offset={0}
Authorization: Bearer {api_key}

Response:
{
  "areas": [
    {
      "areaId": "area_001",
      "name": "North District",
      "facility": "Treatment Plant A",
      "zipCodes": ["12345", "12346"],
      "customerCount": 5000,
      "coverageArea": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pageSize": 20
}
```

### Facility Details Endpoint
```http
GET /api/facilities/{facilityId}
Authorization: Bearer {api_key}

Response:
{
  "facilityId": "fac_001",
  "name": "Treatment Plant A",
  "type": "treatment_plant",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "serviceAreas": ["area_001", "area_002"],
  "capacity": "50000 gallons/day",
  "operationalStatus": "operational",
  "lastMaintenance": "2026-01-15T10:00:00Z"
}
```

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-006

# Test service area search
just test-area-search

# Test directory pagination
just test-directory-pagination
```

## Related Documentation

- [CAP-006: Service Area Directory](../capabilities/CAP-006-service-area-directory)
- [ROAD-039: Service Area Directory](../roads/ROAD-039)
- [UC-021: Locate Service Area](../ddd/07-use-cases#uc-021-locate-service-area)

---

**ID**: US-006 | **Actor**: Treatment Operator | **Status**: Planned 🎯
