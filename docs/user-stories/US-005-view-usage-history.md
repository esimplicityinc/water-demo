---
title: View Usage History
persona: PER-002
status: planned
capabilities:
  - CAP-005
use_cases:
  - UC-020
roadmap:
  - ROAD-038
---

# US-005: View Usage History

## Story

**As a** treatment operator  
**I want** to view comprehensive usage history and patterns for customer accounts  
**So that** I can diagnose issues, detect fraud, and optimize water distribution

## Acceptance Criteria

- [ ] Operator can fetch consumption history for any customer
- [ ] History includes daily, weekly, monthly aggregations
- [ ] History includes peak usage times and patterns
- [ ] History shows real-time and batch readings
- [ ] History is machine-readable (structured format)
- [ ] Operator can generate usage reports in multiple formats
- [ ] Data includes confidence scores for readings
- [ ] Operator can compare customers in same area
- [ ] System maintains historical version tracking

## Dependencies

### Required Capabilities
| Capability | Purpose | Status |
|------------|---------|--------|
| CAP-005: Usage Analytics | Provide consumable usage data | 🎯 Planned |

### Maps to Use Cases
- **UC-020: Analyze Usage Patterns** - Primary use case
  - Fetch usage history
  - Parse consumption data
  - Generate insights

### Implemented By Roadmap
- **ROAD-038: Usage Analytics System** - Complete implementation

## BDD Scenarios

Feature file: `stack-tests/features/api/water-service/01_usage_history.feature`

```gherkin
@US-005 @CAP-005 @ROAD-038
Feature: View Usage History
  As a treatment operator
  I want to view usage history
  So that I can understand consumption patterns

  Background:
    Given the Water Service context is initialized

  Scenario: Fetch usage history for customer
    Given a customer "John Smith" with 30 days of usage data
    When the operator requests usage history
    Then the response should contain:
      | Field | Value |
      | daily_readings | Meter readings per day |
      | weekly_total | Total gallons per week |
      | monthly_total | Total gallons per month |
      | peak_usage_hour | Hour of highest usage |
      | baseline_usage | Normal expected consumption |
    And the data should be machine-readable (JSON format)
    And each reading should include confidence score
    And readings should be timestamped

  Scenario: Detect usage pattern anomalies
    Given a customer with 90 days history
    When the operator requests pattern analysis
    Then the system should identify:
      | Pattern | Description |
      | daily_peak | Time of day most water used |
      | weekly_pattern | Weekday vs weekend differences |
      | monthly_trend | Usage increasing/decreasing |
      | anomalies | Days with unusual consumption |

  Scenario: Generate consumption report
    Given a customer "John Smith" with monthly data
    When the operator requests consumption report
    Then the system should generate report with:
      | Section | Content |
      | summary | Total usage, averages, trends |
      | daily_breakdown | Day-by-day consumption |
      | billing_period | Usage for billing cycle |
      | comparisons | Similar customers in area |
```

## Technical Notes

### Usage History Endpoint
```http
GET /api/customers/{customerId}/usage/history?period=month
Content-Type: application/json

Response:
{
  "customerId": "cust_abc123",
  "period": "month",
  "readings": [
    {
      "date": "2026-01-31",
      "reading": "12450",
      "consumption": "100",
      "peakHour": "18",
      "confidence": 0.95
    }
  ],
  "aggregations": {
    "dailyAverage": "95",
    "weeklyTotal": "665",
    "monthlyTotal": "2850"
  },
  "anomalies": [
    {
      "date": "2026-01-25",
      "consumption": "250",
      "reason": "spike_detected"
    }
  ]
}
```

### Report Generation Endpoint
```http
GET /api/customers/{customerId}/reports/consumption?format=pdf&period=month
Content-Type: application/pdf

Response: PDF document with:
- Summary statistics
- Charts showing trends
- Comparison benchmarks
- Recommendations
```

## Verification

```bash
# Run BDD tests for this story
just bdd-tag @US-005

# Validate usage history format
just validate-usage-history

# Check analytics endpoint
just test-analytics-endpoint
```

## Related Documentation

- [CAP-005: Usage Analytics](../capabilities/CAP-005-usage-analytics)
- [ROAD-038: Usage Analytics System](../roads/ROAD-038)
- [UC-020: Analyze Usage Patterns](../ddd/07-use-cases#uc-020-analyze-usage-patterns)

---

**ID**: US-005 | **Persona**: PER-002 | **Status**: Planned 🎯
