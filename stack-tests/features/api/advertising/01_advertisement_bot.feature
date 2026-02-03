@ROAD-035 @api @advertising @bot @pending
Feature: OpenClaw Advertisement Bot
  As a compute capacity provider
  I want to automate marketing and promotion of my compute resources
  So that I can reach potential buyers efficiently and maximize my revenue

  Background:
    Given the ClawMarket LLM Compute Futures Marketplace is operational
    And the advertisement bot service is enabled
    And I have a registered provider account with valid API credentials

  # Campaign Management
  @campaign @creation
  Scenario: Create new advertisement campaign
    Given I have a compute capacity listing for "RTX 4090 Cluster"
    When I create an advertisement campaign with the following details:
      | name              | "Summer GPU Sale"                    |
      | description       | "High-performance compute for AI/ML" |
      | listing_id        | "listing-rtx4090-001"                |
      | start_date        | "2026-02-01T00:00:00Z"               |
      | end_date          | "2026-02-28T23:59:59Z"               |
      | daily_budget      | 100.00                               |
      | total_budget      | 2800.00                              |
      | currency          | "USD"                                |
    Then the campaign is created successfully
    And the campaign status is "draft"
    And the campaign ID is returned
    And the daily budget is allocated

  @campaign @validation
  Scenario: Validate campaign budget constraints
    Given I attempt to create a campaign with daily budget 500.00
    When the total budget is set to 1000.00
    And the campaign duration is 30 days
    Then the campaign creation should fail
    And the error message should indicate "Insufficient total budget for daily spend over campaign duration"
    And the suggested minimum total budget should be 15000.00

  # Target Audience Selection
  @audience @targeting
  Scenario: Define target audience for campaign
    Given I have an active campaign "AI Researchers Campaign"
    When I configure the target audience with:
      | demographics.min_age          | 25                      |
      | demographics.max_age          | 55                      |
      | demographics.regions          | ["US", "EU", "APAC"]    |
      | interests                     | ["AI", "ML", "Deep Learning", "Data Science"] |
      | compute_requirements.min_vram | 24                      |
      | compute_requirements.gpu_type | ["RTX 4090", "A100", "H100"] |
      | buyer_tier                    | "enterprise"            |
    Then the target audience is saved
    And the estimated reach is calculated
    And the audience definition is validated

  @audience @exclusion
  Scenario: Exclude specific buyer segments
    Given I have a campaign targeting "enterprise" buyers
    When I add exclusion criteria:
      | exclude_buyer_ids    | ["buyer-spam-001", "buyer-fraud-002"] |
      | exclude_regions      | ["sanctioned-region-001"]             |
      | exclude_interests    | ["crypto-mining"]                     |
    Then the excluded segments are removed from targeting
    And the estimated reach is updated
    And the exclusion list is encrypted for privacy

  # Budget Management
  @budget @allocation
  Scenario: Allocate budget across multiple channels
    Given I have a campaign with total budget 5000.00 USD
    When I allocate budget across channels:
      | channel           | percentage | amount  |
      | discord           | 40         | 2000.00 |
      | twitter           | 30         | 1500.00 |
      | forums            | 20         | 1000.00 |
      | email             | 10         | 500.00  |
    Then the budget allocation is saved
    And the sum of allocations equals the total budget
    And each channel has its allocated budget reserved
    And the allocation can be adjusted until campaign starts

  @budget @spend-tracking
  Scenario: Track real-time budget consumption
    Given a campaign "Active Promo" is running with daily budget 200.00
    When advertisements are served throughout the day
    Then the spend is tracked per channel:
      | channel   | spend  | remaining |
      | discord   | 85.50  | 114.50    |
      | twitter   | 62.25  | 137.75    |
      | forums    | 38.00  | 62.00     |
    And the total daily spend is 185.75
    And the remaining daily budget is 14.25
    And a notification is sent when 80% of daily budget is consumed

  # Ad Placement and Scheduling
  @placement @scheduling
  Scenario: Schedule advertisement placements
    Given I have an approved campaign "Weekend Special"
    When I configure the ad schedule:
      | day       | start_time | end_time | timezone     | bid_multiplier |
      | monday    | 09:00      | 17:00    | America/NY   | 1.0            |
      | tuesday   | 09:00      | 17:00    | America/NY   | 1.0            |
      | wednesday | 09:00      | 17:00    | America/NY   | 1.2            |
      | thursday  | 09:00      | 17:00    | America/NY   | 1.0            |
      | friday    | 09:00      | 14:00    | America/NY   | 0.8            |
      | saturday  | 10:00      | 16:00    | America/NY   | 1.5            |
      | sunday    | 10:00      | 16:00    | America/NY   | 1.5            |
    Then the schedule is activated
    And ads are only shown during scheduled windows
    And bid multipliers are applied during respective time slots

  @placement @frequency-capping
  Scenario: Apply frequency capping to prevent ad fatigue
    Given a campaign is targeting buyer segment "AI Startups"
    When I set frequency caps:
      | cap_type          | limit | time_window |
      | per_buyer_daily   | 3     | 24 hours    |
      | per_buyer_weekly  | 10    | 7 days      |
      | per_channel_daily | 5     | 24 hours    |
    Then no buyer sees more than 3 ads per day
    And no buyer sees more than 10 ads per week
    And the frequency cap counters are reset per time window

  # Performance Tracking and Metrics
  @metrics @tracking
  Scenario: Track advertisement performance metrics
    Given campaign "GPU Power Hour" has been running for 24 hours
    When I request performance metrics
    Then the following metrics are returned:
      | metric                    | value    |
      | impressions               | 15420    |
      | clicks                    | 892      |
      | ctr                       | 5.78%    |
      | conversions               | 45       |
      | conversion_rate           | 5.04%    |
      | cost_per_click            | 2.25     |
      | cost_per_mille            | 12.99    |
      | cost_per_acquisition      | 44.44    |
      | total_spend               | 2006.70  |
      | revenue_attributed        | 12500.00 |
      | return_on_ad_spend        | 6.23     |
    And metrics are broken down by channel
    And metrics are available in real-time

  @metrics @reporting
  Scenario: Generate comprehensive performance report
    Given a campaign has been active for 7 days
    When I generate a weekly performance report
    Then the report includes:
      | section                   | content                                      |
      | executive_summary         | Key metrics and ROI summary                  |
      | channel_breakdown         | Performance per advertising channel          |
      | audience_insights         | Best performing buyer segments               |
      | time_analysis             | Peak performance hours and days              |
      | creative_performance      | Best performing ad variants                  |
      | recommendations           | AI-generated optimization suggestions        |
    And the report is exported as PDF
    And the report is emailed to the provider

  # A/B Testing
  @ab-testing @variants
  Scenario: Create A/B test for advertisement variants
    Given I have an active campaign "Compute Promo Q1"
    When I create an A/B test with the following variants:
      | variant_id | headline                              | description                          | cta_text           | image_url              | allocation |
      | variant-a  | "Power Your AI Models"                | "RTX 4090 clusters available now"    | "Get Started"      | "/images/ai-power.jpg" | 50%        |
      | variant-b  | "Train Faster with GPU Clusters"      | "Enterprise-grade compute on demand" | "Start Training"   | "/images/training.jpg" | 50%        |
    Then the A/B test is configured
    And traffic is split 50/50 between variants
    And performance metrics are tracked per variant
    And statistical significance is calculated

  @ab-testing @auto-optimization
  Scenario: Automatically optimize based on A/B test results
    Given an A/B test has been running for 48 hours
    And variant-a has CTR 3.2%
    And variant-b has CTR 5.8%
    And statistical significance is 95%
    When auto-optimization is enabled
    Then traffic allocation shifts to favor variant-b
    And the new allocation becomes:
      | variant   | allocation |
      | variant-a | 20%        |
      | variant-b | 80%        |
    And a notification is sent about the optimization
    And the underperforming variant is flagged for review

  # Automated Bid Adjustments
  @bidding @automation
  Scenario: Configure automated bid adjustments
    Given I have a campaign with base bid 2.50 USD
    When I enable automated bidding with rules:
      | condition                    | action              | adjustment |
      | ctr > 5%                     | increase_bid        | +20%       |
      | ctr < 2%                     | decrease_bid        | -15%       |
      | conversion_rate > 8%         | increase_bid        | +30%       |
      | cost_per_acquisition > 50    | decrease_bid        | -25%       |
      | remaining_budget < 20%       | decrease_bid        | -40%       |
      | high_competition_detected    | increase_bid        | +10%       |
    Then the bid adjustment rules are saved
    And bids are automatically adjusted every 15 minutes
    And bid changes are logged with reason
    And maximum bid is capped at 5.00 USD

  @bidding @smart-bidding
  Scenario: Use smart bidding for conversion optimization
    Given I have a campaign with goal "maximize_conversions"
    And target cost per acquisition is 40.00 USD
    When I enable smart bidding mode
    Then the system automatically:
      | action                                           |
      | Analyzes historical conversion data              |
      | Predicts conversion probability per impression   |
      | Adjusts bids based on predicted value            |
      | Prioritizes high-intent buyer segments           |
      | Reduces bids for low-conversion time slots       |
    And the system aims to maintain CPA below 40.00 USD
    And daily bid adjustments are limited to ±50% of base bid

  # Campaign Optimization
  @optimization @ai-recommendations
  Scenario: Receive AI-powered campaign optimization recommendations
    Given a campaign has been running for 3 days
    When the AI optimization engine analyzes performance
    Then the following recommendations are generated:
      | priority | recommendation                                      | expected_impact   |
      | high     | Increase bids by 15% on Wednesday afternoons        | +25% conversions  |
      | high     | Add "Data Science" to target interests              | +18% reach        |
      | medium   | Reduce frequency cap from 5 to 3 per day            | +12% CTR          |
      | medium   | Pause underperforming "forums" channel              | Save 20% budget   |
      | low      | Test new headline: "Scale Your ML Pipelines"        | +8% CTR potential |
    And each recommendation includes confidence score
    And recommendations can be applied with one click
    And A/B test is suggested for high-impact changes

  @optimization @auto-pilot
  Scenario: Enable auto-pilot mode for hands-free optimization
    Given I have a campaign with consistent performance history
    When I enable auto-pilot mode with constraints:
      | constraint                | value    |
      | max_daily_budget          | 500.00   |
      | target_cpa                | 45.00    |
      | min_roas                  | 4.0      |
      | allowed_bid_adjustment    | ±30%     |
      | optimization_frequency    | hourly   |
    Then the system automatically optimizes:
      | optimization_type         | description                              |
      | bid_management            | Adjust bids based on performance         |
      | budget_allocation         | Shift budget to best performing channels |
      | audience_refinement       | Add/remove targeting criteria            |
      | scheduling_optimization   | Adjust active hours based on data        |
      | creative_rotation         | Promote best performing variants         |
    And I receive daily optimization summary reports
    And I can pause auto-pilot at any time
    And significant changes require manual approval

  @optimization @fraud-protection
  Scenario: Detect and prevent click fraud
    Given a campaign is receiving high volume of clicks
    When the fraud detection system identifies suspicious patterns:
      | pattern                              | threshold    | detected |
      | Same IP multiple clicks              | > 5 per hour | yes      |
      | Bot-like behavior                    | score > 0.8  | yes      |
      | Click without engagement             | bounce > 95% | yes      |
      | Geographic anomalies                 | mismatch     | yes      |
      | Rapid sequential clicks              | < 1 second   | yes      |
    Then fraudulent clicks are filtered out
    And the provider is not charged for fraudulent clicks
    And suspicious IPs are added to blocklist
    And a fraud report is generated
    And the campaign performance metrics are adjusted

  # Campaign Lifecycle
  @lifecycle @activation
  Scenario: Activate campaign and begin advertising
    Given I have a campaign in "draft" status
    And all required fields are completed
    And the campaign passes validation checks
    When I activate the campaign
    Then the campaign status changes to "active"
    And advertisements begin serving according to schedule
    And the campaign appears in active campaigns list
    And real-time monitoring is enabled
    And billing begins for served advertisements

  @lifecycle @pause-resume
  Scenario: Pause and resume active campaign
    Given a campaign "Holiday Special" is active
    When I pause the campaign
    Then all ad serving stops immediately
    And the campaign status changes to "paused"
    And current performance data is preserved
    And budget allocation is frozen
    When I resume the campaign
    Then ad serving resumes according to schedule
    And the campaign status returns to "active"
    And optimization algorithms continue from previous state

   @lifecycle @completion
   Scenario: Complete campaign and generate final report
     Given a campaign has reached its end date or budget is exhausted
     When the campaign automatically completes
    Then the campaign status changes to "completed"
    And all ad serving stops
    And a final performance report is generated
    And unused budget is returned to provider account
    And campaign learnings are saved for future campaigns
    And the campaign moves to campaign history

  # Integration and API
  @api @integration
  Scenario: Integrate advertisement bot with external platforms
    Given I have API credentials for external advertising platforms
    When I configure platform integrations:
      | platform      | api_key_reference        | enabled | sync_frequency |
      | discord       | discord_api_key_001      | true    | real-time      |
      | twitter       | twitter_api_key_001      | true    | real-time      |
      | reddit        | reddit_api_key_001       | true    | 5 minutes      |
      | linkedin      | linkedin_api_key_001     | false   | -              |
    Then the integrations are validated
    And API health checks are performed
    And campaign data syncs to enabled platforms
    And performance metrics are aggregated from all platforms
    And failed API calls are retried with exponential backoff

  @api @webhooks
  Scenario: Configure webhooks for real-time event notifications
    Given I have a webhook endpoint URL
    When I configure webhooks for the following events:
      | event_type              | payload_format | retry_policy    |
      | campaign.created        | json           | 3 attempts      |
      | campaign.activated      | json           | 3 attempts      |
      | campaign.paused         | json           | 3 attempts      |
      | campaign.completed      | json           | 5 attempts      |
      | budget.threshold_80     | json           | 3 attempts      |
      | budget.threshold_95     | json           | 5 attempts      |
      | performance.milestone   | json           | 3 attempts      |
      | fraud.detected          | json           | 5 attempts      |
    Then webhook configurations are saved
    And webhook signatures are generated for security
    And events are delivered to the endpoint in real-time
    And failed deliveries are queued for retry
