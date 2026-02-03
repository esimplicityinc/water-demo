@ROAD-032 @api @analytics @reporting @pending
Feature: Advanced Analytics and Business Intelligence
  As a marketplace administrator
  I want comprehensive analytics and reporting capabilities
  So that I can monitor marketplace health, track performance metrics, and make data-driven decisions

  Background:
    Given the analytics system is initialized
    And the marketplace has historical transaction data
    And I am authenticated as an analytics administrator

  # ============================================
  # Marketplace Volume Analytics
  # ============================================

  @volume @metrics @critical
  Scenario: Retrieve marketplace trading volume over time
    Given the marketplace has processed transactions for the last 30 days
    When I request volume analytics with timeframe "last_30_days"
    Then the response should contain daily volume metrics
    And each metric should include:
      | field              | type   |
      | date               | date   |
      | total_volume       | number |
      | transaction_count  | number |
      | unique_traders     | number |
    And the total volume should be aggregated correctly
    And the response time should be under 2 seconds

  @volume @comparison @medium
  Scenario: Compare marketplace volume across different time periods
    Given there is volume data for Q1 and Q2 2026
    When I request a period comparison between "2026-Q1" and "2026-Q2"
    Then the response should show side-by-side comparison
    And include percentage change calculations
    And highlight significant volume fluctuations (>10%)

  # ============================================
  # Bot Performance Metrics
  # ============================================

  @bots @performance @critical
  Scenario: Generate bot performance leaderboard
    Given there are registered bots with trading history
    When I request the bot performance leaderboard
    And filter by metric "success_rate"
    Then the response should contain a ranked list of bots
    And each bot entry should include:
      | field                | type   |
      | bot_id               | string |
      | bot_name             | string |
      | total_promises       | number |
      | completed_promises   | number |
      | success_rate         | float  |
      | average_response_time| number |
      | reputation_score     | float  |
    And the list should be sorted by the selected metric descending

  @bots @efficiency @medium
  Scenario: Analyze bot efficiency metrics
    Given a specific bot has processed multiple compute jobs
    When I request efficiency analytics for bot "bot-123"
    Then the response should include efficiency metrics:
      | metric                    | description                           |
      | compute_utilization_rate  | Percentage of allocated compute used  |
      | average_job_duration      | Mean time to complete jobs            |
      | cost_per_computation      | Average cost per compute unit         |
      | throughput_rate           | Jobs completed per hour               |
    And efficiency trends should be calculated over time

  # ============================================
  # Promise Completion Rates
  # ============================================

  @promises @completion @critical
  Scenario: Calculate promise completion and fulfillment rates
    Given there are promises in various states: pending, active, completed, failed, expired
    When I request promise completion analytics
    Then the response should contain completion statistics:
      | status    | count | percentage |
      | completed | <count> | <pct>    |
      | failed    | <count> | <pct>    |
      | expired   | <count> | <pct>    |
      | pending   | <count> | <pct>    |
    And the overall completion rate should be calculated
    And breakdown by promise type should be provided

  @promises @sla @high
  Scenario: Analyze SLA compliance and breach patterns
    Given promises have SLA requirements defined
    And historical SLA tracking data exists
    When I request SLA compliance analytics
    Then the response should show:
      | metric                      | value  |
      | sla_compliance_rate         | float  |
      | average_resolution_time     | number |
      | sla_breach_count            | number |
      | breach_reasons_breakdown    | object |
    And common breach patterns should be identified
    And recommendations for improvement should be suggested

  # ============================================
  # Revenue and Fee Analytics
  # ============================================

  @revenue @financial @critical
  Scenario: Generate revenue and fee breakdown report
    Given the marketplace has collected fees over the reporting period
    When I request revenue analytics for period "last_quarter"
    Then the response should contain detailed revenue data:
      | revenue_type        | amount | percentage |
      | trading_fees        | <amt>  | <pct>      |
      | compute_markups     | <amt>  | <pct>      |
      | premium_services    | <amt>  | <pct>      |
      | total_revenue       | <amt>  | 100%       |
    And fee distribution by bot should be available
    And revenue trends should show growth or decline indicators

  @revenue @projections @high
  Scenario: Calculate revenue projections and forecasts
    Given there is at least 6 months of historical revenue data
    When I request revenue projections for the next 3 months
    Then the response should include:
      | projection_type | value | confidence_interval |
      | conservative    | <amt> | ±5%               |
      | expected        | <amt> | ±10%              |
      | optimistic      | <amt> | ±15%              |
    And the forecasting model used should be specified
    And key assumptions should be documented

  # ============================================
  # Trend Analysis and Forecasting
  # ============================================

  @trends @forecasting @high
  Scenario: Identify marketplace trends and patterns
    Given there is sufficient historical data for trend analysis
    When I request trend analysis with parameters:
      | parameter     | value         |
      | timeframe     | 6_months      |
      | granularity   | weekly        |
      | metrics       | volume,price  |
    Then the response should identify:
      | trend_type        | description                    |
      | seasonal_patterns | Recurring patterns by time     |
      | growth_trends     | Sustained growth or decline    |
      | anomaly_detection | Unusual spikes or drops        |
      | correlation_insights | Relationships between metrics |
    And trend confidence scores should be provided

  @trends @predictive @medium
  Scenario: Generate predictive analytics for marketplace health
    Given the predictive models are trained and available
    When I request predictive analytics for the next 30 days
    Then the response should include predictions for:
      | metric                  | prediction | confidence |
      | expected_volume         | <value>    | <score>    |
      | active_bot_count        | <value>    | <score>    |
      | price_volatility_index  | <value>    | <score>    |
      | network_utilization     | <value>    | <score>    |
    And prediction accuracy metrics should be shown
    And model retraining recommendations should be included

  # ============================================
  # Custom Report Generation
  # ============================================

  @reports @custom @high
  Scenario: Create custom analytics report with selected metrics
    Given I have defined a custom report configuration:
      | setting           | value                          |
      | report_name       | Q1 Bot Performance Review      |
      | metrics           | success_rate, revenue, volume  |
      | filters           | bot_type:compute, status:active|
      | group_by          | bot_category                   |
      | date_range        | 2026-01-01 to 2026-03-31       |
    When I submit the custom report request
    Then the report should be generated asynchronously
    And I should receive a report ID for tracking
    When the report generation completes
    Then the report should contain only the selected metrics
    And data should be filtered and grouped as specified
    And the report should be available for download

  @reports @scheduled @medium
  Scenario: Schedule recurring analytics reports
    Given I want to create a scheduled report
    When I configure a weekly report with:
      | setting        | value                    |
      | frequency      | weekly                   |
      | day_of_week    | Monday                   |
      | time           | 09:00 UTC                |
      | recipients     | admin@clawmarket.ai      |
      | format         | PDF                      |
      | metrics        | volume, revenue, bots    |
    Then the scheduled report should be created
    And I should receive a confirmation with schedule ID
    And the first report should be generated on the next scheduled date

  # ============================================
  # Data Export Functionality
  # ============================================

  @export @data @high
  Scenario: Export analytics data in multiple formats
    Given I have generated an analytics report
    When I request to export the report with format "CSV"
    Then the export should be prepared
    And the file should contain properly formatted data
    And column headers should match the metric names
    When I request export with format "JSON"
    Then the JSON structure should be valid
    And nested objects should be properly serialized
    When I request export with format "Excel"
    Then the Excel file should have multiple sheets if needed
    And formulas should be preserved where applicable

  @export @bulk @medium
  Scenario: Perform bulk data export for external analysis
    Given I need to export large dataset for external BI tools
    When I request bulk export with parameters:
      | parameter     | value                    |
      | data_types    | transactions, bots, fees |
      | date_range    | 2026-01-01 to 2026-01-31 |
      | format        | Parquet                  |
      | compression   | gzip                     |
    Then the system should initiate bulk export job
    And I should receive a job ID for tracking
    When the export completes
    Then I should receive a secure download link
    And the link should expire after 24 hours
    And data should be anonymized per privacy settings

  # ============================================
  # Real-time Analytics Dashboard
  # ============================================

  @dashboard @realtime @critical
  Scenario: Retrieve real-time dashboard metrics
    Given the real-time analytics pipeline is active
    When I request current dashboard metrics
    Then the response should include live data:
      | metric                  | freshness_requirement |
      | active_users            | < 30 seconds          |
      | current_volume_24h      | < 1 minute            |
      | pending_promises        | < 30 seconds          |
      | system_health_score     | < 5 minutes           |
      | current_compute_demand  | < 1 minute            |
    And each metric should include a last_updated timestamp
    And data freshness indicators should be provided

  @dashboard @alerts @high
  Scenario: Configure and receive real-time analytics alerts
    Given I have dashboard access
    When I configure an alert with conditions:
      | condition                    | threshold | severity |
      | volume_drop_percent          | > 20%     | high     |
      | bot_failure_rate             | > 15%     | critical |
      | revenue_below_expected       | < 80%     | medium   |
      | unusual_trading_pattern      | detected  | warning  |
    Then the alert configuration should be saved
    When a monitored condition is triggered
    Then I should receive a real-time notification
    And the alert should include context and recommended actions
    And alert history should be logged for audit

  @dashboard @widgets @medium
  Scenario: Customize dashboard widgets and layout
    Given I have a personalized dashboard
    When I add a new widget with configuration:
      | setting       | value                    |
      | widget_type   | line_chart               |
      | data_source   | volume_timeseries        |
      | timeframe     | 7_days                   |
      | refresh_rate  | 5_minutes                |
      | position      | row_1, column_1          |
    Then the widget should appear on my dashboard
    And it should display the configured data
    And it should refresh at the specified interval
    When I rearrange widgets on the dashboard
    Then the new layout should be saved
    And persist across sessions

  # ============================================
  # Error Handling and Edge Cases
  # ============================================

  @error_handling @validation @high
  Scenario: Handle invalid analytics requests gracefully
    Given I submit an analytics request with invalid parameters:
      | parameter    | invalid_value    | reason              |
      | start_date   | 2026-13-01       | Invalid month       |
      | end_date     | 2025-01-01       | Before start date   |
      | granularity  | invalid_value    | Not in enum         |
      | bot_id       | nonexistent_bot  | Bot not found       |
    Then the API should return a 400 Bad Request status
    And the error response should include:
      | field          | description                     |
      | error_code     | Specific error identifier       |
      | message        | Human-readable description      |
      | invalid_fields | List of fields with errors      |
      | suggestions    | Valid alternatives if applicable|
    And no partial data should be returned

  @performance @caching @medium
  Scenario: Analytics response caching for performance
    Given I request analytics data that was recently queried
    When the same request is made within the cache TTL
    Then the response should be served from cache
    And the response should include a cache_hit indicator
    And the response time should be under 500ms
    When I request with cache-bypass header
    Then fresh data should be fetched from the database
    And the response should indicate cache was bypassed

  @security @authorization @critical
  Scenario: Enforce role-based access to analytics data
    Given there are users with different roles:
      | role           | permissions                          |
      | admin          | full_access                          |
      | analyst        | read_only, no_financial_details      |
      | bot_operator   | own_bot_data_only                    |
      | external_user  | public_metrics_only                  |
    When each user requests sensitive analytics data
    Then access should be granted or denied based on role:
      | role           | financial_data | bot_details | raw_transactions |
      | admin          | allowed        | allowed     | allowed          |
      | analyst        | denied         | allowed     | denied           |
      | bot_operator   | denied         | own_only    | own_only         |
      | external_user  | denied         | denied      | denied           |
    And unauthorized requests should return 403 Forbidden
    And access attempts should be logged for audit
