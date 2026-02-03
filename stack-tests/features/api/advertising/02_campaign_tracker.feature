@ROAD-036
@api
@advertising
@tracking
@analytics
@pending
Feature: Advertisement Campaign Tracker
  As an advertiser on the ClawMarket platform
  I want to track the performance of my advertisement campaigns
  So that I can optimize my marketing spend and maximize ROI

  Background:
    Given the ClawMarket advertising API is operational
    And the analytics tracking system is initialized
    And the following campaigns exist:
      | campaign_id | name                    | budget | start_date | end_date   | status   |
      | camp_001    | Summer Compute Sale     | 5000   | 2026-01-01 | 2026-01-31 | active   |
      | camp_002    | GPU Futures Launch      | 10000  | 2026-01-15 | 2026-02-15 | active   |
      | camp_003    | Winter Promotion        | 3000   | 2025-12-01 | 2025-12-31 | completed|

  # ============================================
  # Campaign Impression Tracking
  # ============================================

  @impression @metrics
  Scenario: Track campaign impression
    Given campaign "camp_001" is active
    When a user views an advertisement from campaign "camp_001"
    Then an impression event is recorded
    And the impression count for campaign "camp_001" increments by 1
    And the impression timestamp is captured
    And the user device type is recorded

  @impression @batch
  Scenario: Track multiple impressions in batch
    Given campaign "camp_002" is active
    When 1000 users view advertisements from campaign "camp_002"
    Then all impression events are recorded within 5 seconds
    And the total impression count for campaign "camp_002" is 1000
    And no duplicate impressions are recorded for the same user within 1 minute

  @impression @filtering
  Scenario: Filter out invalid impressions
    Given campaign "camp_001" is active
    When a bot attempts to register an impression for campaign "camp_001"
    Then the impression is rejected
    And the invalid impression attempt is logged
    And the campaign impression count remains unchanged

  # ============================================
  # Click-Through Rate Monitoring
  # ============================================

  @ctr @engagement
  Scenario: Track advertisement click-through
    Given campaign "camp_001" has 1000 recorded impressions
    When a user clicks on an advertisement from campaign "camp_001"
    Then a click event is recorded
    And the click-through count for campaign "camp_001" increments by 1
    And the click timestamp is captured
    And the referring URL is recorded

  @ctr @calculation
  Scenario: Calculate click-through rate
    Given campaign "camp_002" has the following metrics:
      | metric_type | count |
      | impressions | 10000 |
      | clicks      | 250   |
    When the click-through rate is calculated for campaign "camp_002"
    Then the CTR should be 2.5%
    And the CTR calculation timestamp is recorded

  @ctr @realtime
  Scenario: Monitor real-time CTR changes
    Given campaign "camp_001" is active with current CTR of 1.8%
    When 100 new impressions and 5 new clicks occur within 1 minute
    Then the real-time CTR should update to 2.3%
    And the CTR change event is published to the analytics dashboard

  # ============================================
  # Conversion Tracking
  # ============================================

  @conversion @attribution
  Scenario: Track user conversion from advertisement
    Given a user clicked on campaign "camp_001" advertisement 2 hours ago
    When the user completes a purchase of "Compute Credits" worth $500
    Then a conversion event is recorded
    And the conversion is attributed to campaign "camp_001"
    And the conversion value of $500 is recorded
    And the time-to-conversion of 2 hours is captured

  @conversion @multi-touch
  Scenario: Track multi-touch conversion attribution
    Given a user interacted with the following campaigns:
      | campaign_id | interaction_type | timestamp           |
      | camp_001    | impression       | 2026-01-20T10:00:00Z|
      | camp_002    | click            | 2026-01-20T14:00:00Z|
      | camp_001    | click            | 2026-01-20T18:00:00Z|
    When the user completes a purchase worth $1000
    Then the conversion is attributed using the selected attribution model
    And campaign "camp_002" receives primary attribution (last-click)
    And campaign "camp_001" receives secondary attribution (assisted)

  @conversion @funnel
  Scenario: Track conversion funnel stages
    Given campaign "camp_002" is active
    When users progress through the following funnel stages:
      | stage          | user_count |
      | impression     | 10000      |
      | click          | 500        |
      | landing_page   | 450        |
      | signup_start   | 200        |
      | signup_complete| 150        |
      | purchase       | 50         |
    Then the conversion funnel metrics are recorded for campaign "camp_002"
    And the stage-to-stage conversion rates are calculated
    And the overall conversion rate is 0.5%

  # ============================================
  # Cost Per Acquisition Calculation
  # ============================================

  @cpa @cost-analysis
  Scenario: Calculate cost per acquisition
    Given campaign "camp_001" has the following spend and conversions:
      | metric              | value |
      | total_spend         | 2500  |
      | total_conversions   | 50    |
    When the cost per acquisition is calculated for campaign "camp_001"
    Then the CPA should be $50.00
    And the CPA calculation is timestamped
    And the CPA trend is compared to previous periods

  @cpa @channel-breakdown
  Scenario: Calculate CPA by advertising channel
    Given campaign "camp_002" runs on multiple channels with the following performance:
      | channel    | spend  | conversions |
      | discord    | 4000   | 80          |
      | twitter    | 3000   | 30          |
      | newsletter | 2000   | 50          |
    When the CPA is calculated per channel for campaign "camp_002"
    Then the following CPA values should be returned:
      | channel    | cpa   |
      | discord    | $50.00|
      | twitter    | $100.00|
      | newsletter | $40.00|
    And the best performing channel is identified as "newsletter"

  # ============================================
  # ROI Reporting
  # ============================================

  @roi @reporting
  Scenario: Calculate campaign return on investment
    Given campaign "camp_001" has the following financial data:
      | metric              | value  |
      | total_spend         | 5000   |
      | total_revenue       | 15000  |
      | total_conversions   | 100    |
    When the ROI is calculated for campaign "camp_001"
    Then the ROI should be 200%
    And the ROAS (Return on Ad Spend) should be 3.0
    And the profit margin should be $10000
    And the ROI report is generated

  @roi @forecasting
  Scenario: Forecast campaign ROI at completion
    Given campaign "camp_002" is 50% through its duration with the following metrics:
      | metric              | value  |
      | current_spend       | 5000   |
      | current_revenue     | 12000  |
      | days_elapsed        | 15     |
      | total_duration_days | 30     |
    When the projected ROI is calculated for campaign "camp_002"
    Then the projected total spend should be $10000
    Then the projected total revenue should be $24000
    And the projected ROI should be 140%
    And the forecast confidence level should be 85%

  @roi @comparison
  Scenario: Compare ROI across multiple campaigns
    Given the following campaigns have completed with ROI data:
      | campaign_id | name                | spend  | revenue | roi   |
      | camp_003    | Winter Promotion    | 3000   | 9000    | 200%  |
      | camp_004    | Spring Launch       | 8000   | 16000   | 100%  |
      | camp_005    | Holiday Special     | 5000   | 20000   | 300%  |
    When the ROI comparison report is generated
    Then the campaigns should be ranked by ROI as:
      | rank | campaign_id | roi   |
      | 1    | camp_005    | 300%  |
      | 2    | camp_003    | 200%  |
      | 3    | camp_004    | 100%  |
    And the average ROI across all campaigns should be 200%

  # ============================================
  # Campaign Comparison Analytics
  # ============================================

  @analytics @comparison
  Scenario: Generate comprehensive campaign comparison report
    Given the following active campaigns with performance data:
      | campaign_id | impressions | clicks | conversions | spend  | revenue |
      | camp_001    | 50000       | 1250   | 125         | 2500   | 12500   |
      | camp_002    | 100000      | 2000   | 200         | 5000   | 20000   |
    When the campaign comparison analytics are requested
    Then the following comparative metrics should be calculated:
      | metric         | camp_001 | camp_002 | winner   |
      | CTR            | 2.5%     | 2.0%     | camp_001 |
      | Conv. Rate     | 10.0%    | 10.0%    | tie      |
      | CPA            | $20.00   | $25.00   | camp_001 |
      | ROI            | 400%     | 300%     | camp_001 |
      | Revenue/Spend  | 5.0      | 4.0      | camp_001 |
    And a visual comparison chart is generated

  @analytics @trend
  Scenario: Analyze campaign performance trends over time
    Given campaign "camp_001" has daily performance data for the past 30 days
    When the trend analysis is performed
    Then the following trends should be identified:
      | metric         | trend      | change_percent |
      | impressions    | increasing | 15%            |
      | CTR            | stable     | 0.2%           |
      | conversions    | increasing | 25%            |
      | CPA            | decreasing | -10%           |
    And performance anomalies should be flagged
    And recommendations should be generated based on trends

  # ============================================
  # Real-Time Performance Dashboard
  # ============================================

  @dashboard @realtime
  Scenario: Display real-time campaign performance dashboard
    Given campaign "camp_002" is currently active
    When the real-time dashboard is accessed
    Then the following live metrics should be displayed:
      | metric              | value    | update_frequency |
      | current_spend       | $7,250   | 1 minute         |
      | impressions_today   | 5,420    | 30 seconds       |
      | clicks_today        | 142      | 30 seconds       |
      | conversions_today   | 18       | 1 minute         |
      | current_ctr         | 2.62%    | 5 minutes        |
      | current_cpa         | $23.89   | 1 hour           |
    And the dashboard should auto-refresh every 30 seconds
    And alerts should display if metrics deviate from targets

  @dashboard @alert
  Scenario: Trigger performance alerts based on thresholds
    Given campaign "camp_001" has the following alert thresholds configured:
      | metric      | min_threshold | max_threshold |
      | CTR         | 1.5%          | 5.0%          |
      | CPA         | $10           | $50           |
      | daily_spend | -             | $200          |
    When the CTR drops to 1.2%
    Then a "LOW_CTR" alert should be triggered
    And the alert should be sent to campaign managers
    And recommended actions should be included in the alert

  @dashboard @export
  Scenario: Export dashboard data for external analysis
    Given campaign "camp_002" has 30 days of performance data
    When the dashboard data export is requested in "CSV" format
    Then a CSV file should be generated containing:
      | column_name     | description              |
      | date            | Date of metrics          |
      | impressions     | Daily impression count   |
      | clicks          | Daily click count        |
      | conversions     | Daily conversion count   |
      | spend           | Daily spend amount       |
      | revenue         | Daily revenue amount     |
      | ctr             | Daily click-through rate |
      | cpa             | Daily cost per acquisition|
    And the file should be available for download within 10 seconds

  # ============================================
  # Attribution Modeling
  # ============================================

  @attribution @model
  Scenario: Apply first-click attribution model
    Given a user had the following campaign interactions before converting:
      | order | campaign_id | interaction_type | timestamp           |
      | 1     | camp_001    | click            | 2026-01-20T08:00:00Z|
      | 2     | camp_002    | click            | 2026-01-20T12:00:00Z|
      | 3     | camp_001    | impression       | 2026-01-20T16:00:00Z|
    When the conversion value of $500 is attributed using "first-click" model
    Then campaign "camp_001" should receive 100% attribution ($500)
    And campaign "camp_002" should receive 0% attribution ($0)

  @attribution @model
  Scenario: Apply linear attribution model
    Given a user had the following campaign interactions before converting:
      | order | campaign_id | interaction_type | timestamp           |
      | 1     | camp_001    | click            | 2026-01-20T08:00:00Z|
      | 2     | camp_002    | click            | 2026-01-20T12:00:00Z|
      | 3     | camp_003    | click            | 2026-01-20T16:00:00Z|
    When the conversion value of $600 is attributed using "linear" model
    Then campaign "camp_001" should receive 33.33% attribution ($200)
    And campaign "camp_002" should receive 33.33% attribution ($200)
    And campaign "camp_003" should receive 33.33% attribution ($200)

  @attribution @model
  Scenario: Apply time-decay attribution model
    Given a user had the following campaign interactions before converting:
      | order | campaign_id | interaction_type | hours_before_conversion |
      | 1     | camp_001    | click            | 72                      |
      | 2     | camp_002    | click            | 24                      |
      | 3     | camp_001    | click            | 2                       |
    When the conversion value of $700 is attributed using "time-decay" model with 7-day half-life
    Then campaign "camp_001" should receive combined attribution
    And campaign "camp_002" should receive less attribution than recent interactions
    And the total attributed value should equal $700

  @attribution @comparison
  Scenario: Compare different attribution models
    Given a campaign set with known interaction patterns
    When attribution is calculated using multiple models:
      | model_name     |
      | first-click    |
      | last-click     |
      | linear         |
      | time-decay     |
      | position-based |
    Then a comparison report should be generated showing:
      | metric                    | description                           |
      | attributed_revenue_by_model | Revenue attribution per model         |
      | model_differences         | Variance between models               |
      | recommended_model         | Best model based on campaign type     |
    And the report should include confidence scores for each model

  @attribution @cross-device
  Scenario: Track cross-device conversion attribution
    Given a user interacts with campaign "camp_001" on multiple devices:
      | device_type | interaction | timestamp           |
      | mobile      | impression  | 2026-01-20T08:00:00Z|
      | desktop     | click       | 2026-01-20T14:00:00Z|
      | tablet      | conversion  | 2026-01-20T20:00:00Z|
    When the cross-device identity is resolved
    Then all interactions should be linked to the same user
    And the conversion should be attributed to campaign "camp_001"
    And the cross-device journey should be recorded

  # ============================================
  # Error Handling & Edge Cases
  # ============================================

  @error @validation
  Scenario: Handle invalid campaign ID in tracking request
    When impression tracking is requested for non-existent campaign "invalid_camp_999"
    Then a 404 error should be returned
    And the error message should indicate "Campaign not found"
    And the invalid request should be logged for analysis

  @error @data-integrity
  Scenario: Handle missing required tracking parameters
    Given a valid campaign "camp_001" exists
    When an impression event is submitted without required fields:
      | missing_field | description          |
      | user_id       | Anonymous user ID    |
      | timestamp     | Event timestamp      |
    Then a 400 error should be returned
    And the response should list all missing required fields
    And the partial event should not be recorded

  @edge-case @timezone
  Scenario: Handle timezone conversions for global campaigns
    Given campaign "camp_002" targets users in multiple timezones
    When analytics are requested for "2026-01-20"
    Then the data should include events from 00:00:00 UTC to 23:59:59 UTC
    And the report should indicate the timezone used for aggregation
    And daily metrics should be consistent regardless of user's local timezone

  @edge-case @data-retention
  Scenario: Apply data retention policies to old campaign data
    Given campaign "camp_003" ended 2 years ago
    When raw impression data older than 1 year is processed
    Then the detailed impression records should be archived
    And aggregated daily metrics should be retained
    And the campaign summary report should still be available
    And archived data should be recoverable within 48 hours if needed
