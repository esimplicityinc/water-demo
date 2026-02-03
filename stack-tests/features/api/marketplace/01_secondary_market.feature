@ROAD-034 @api @marketplace @secondary @pending
Feature: Secondary Market for Promise Positions
  As a marketplace participant
  I want to trade promise positions on a secondary market
  So that I can manage risk, realize gains, and provide liquidity to other traders

  Background:
    Given the secondary market system is operational
    And the marketplace has an active order book mechanism
    And standard trading fees are configured at 2.5%

  # ============================================================================
  # Promise Position Listing for Resale
  # ============================================================================

  @ROAD-034.1 @listing @position @resale
  Scenario: Successfully list a promise position for resale
    Given a trader "Alice" owns a valid compute futures promise position
    And the promise has 1000 tokens of "GPT-4 Compute" capacity
    And the original purchase price was $500
    When Alice lists the position for resale at $600
    Then the listing is created with status "ACTIVE"
    And the position is marked as "LISTED_FOR_RESALE"
    And the listing appears in the secondary market catalog
    And Alice receives a listing confirmation with reference ID

  @ROAD-034.2 @listing @validation @error
  Scenario: Attempt to list an expired promise position
    Given a trader "Bob" owns a compute futures promise position
    And the promise has expired 5 days ago
    When Bob attempts to list the position for $400
    Then the listing request is rejected
    And an error message "Cannot list expired promise position" is returned
    And the position status remains "EXPIRED"

  @ROAD-034.3 @listing @validation @error
  Scenario: Attempt to list a partially consumed promise position
    Given a trader "Carol" owns a compute futures promise position
    And 60% of the compute capacity has already been consumed
    When Carol attempts to list the remaining position for $300
    Then the listing request is rejected
    And an error message "Partially consumed positions cannot be listed" is returned
    And the position status remains "PARTIALLY_CONSUMED"

  # ============================================================================
  # Secondary Market Order Book
  # ============================================================================

  @ROAD-034.4 @orderbook @matching @execution
  Scenario: Execute trade through order book matching
    Given the secondary market order book has an ask for 1000 tokens at $550
    And a buyer "David" places a bid for 1000 tokens at $560
    When the order matching engine processes the orders
    Then a trade is executed at $550
    And the ask order is filled and removed from the book
    And the bid order is filled and removed from the book
    And both traders receive trade execution notifications
    And the trade is recorded in the market history

  @ROAD-034.5 @orderbook @depth @liquidity
  Scenario: View order book depth and liquidity metrics
    Given the secondary market has multiple active orders
    And there are 5 bid orders totaling 5000 tokens
    And there are 3 ask orders totaling 3000 tokens
    When a trader requests the order book for "GPT-4 Compute"
    Then the order book displays bid/ask spreads
    And depth charts show volume at each price level
    And the calculated liquidity score is displayed
    And the 24-hour trading volume is shown

  # ============================================================================
  # Transfer of Promise Ownership
  # ============================================================================

  @ROAD-034.6 @transfer @ownership @settlement
  Scenario: Transfer promise ownership after secondary market trade
    Given a secondary market trade has been executed
    And seller "Eve" owns the promise position being sold
    And buyer "Frank" has sufficient funds for the purchase
    When the trade settlement process initiates
    Then the promise ownership is transferred from Eve to Frank
    And the promise registry is updated with Frank as the new owner
    And Eve receives the sale proceeds minus fees
    And Frank's account is debited for the purchase amount
    And the transfer is recorded in the audit trail

  @ROAD-034.7 @transfer @validation @error
  Scenario: Failed transfer due to insufficient buyer funds
    Given a secondary market trade is ready for settlement
    And buyer "Grace" has insufficient funds in their account
    When the settlement process attempts to complete
    Then the transfer is cancelled
    And the promise ownership remains with the seller
    And Grace receives an "Insufficient funds" notification
    And the order is returned to the order book

  # ============================================================================
  # Price Discovery Mechanisms
  # ============================================================================

  @ROAD-034.8 @pricing @discovery @valuation
  Scenario: Calculate fair market value for promise positions
    Given multiple promise positions are listed for "GPT-4 Compute"
    And recent trades have occurred at prices between $450 and $550
    When the price discovery algorithm runs
    Then a fair market value of $500 is calculated
    And the value is weighted by recent trade volume
    And a confidence interval of ±5% is provided
    And the valuation is updated in real-time as new trades occur

  @ROAD-034.9 @pricing @oracle @external
  Scenario: Incorporate external price oracles for valuation
    Given external compute pricing data is available from 3 oracles
    And the oracles report prices of $480, $520, and $510
    When the secondary market requests a price reference
    Then the median price of $510 is selected
    And outlier prices are identified and flagged
    And the final reference price incorporates both oracle and market data
    And the price source is transparently documented

  # ============================================================================
  # Secondary Market Fees
  # ============================================================================

  @ROAD-034.10 @fees @calculation @revenue
  Scenario: Calculate and distribute secondary market trading fees
    Given a secondary market trade executes at $1000
    And the standard trading fee is 2.5%
    When the trade settlement completes
    Then a trading fee of $25 is calculated
    And 70% of the fee ($17.50) goes to the marketplace treasury
    And 20% of the fee ($5.00) goes to market makers
    And 10% of the fee ($2.50) goes to the original promise issuer
    And the fee distribution is recorded on-chain

  @ROAD-034.11 @fees @tiered @volume
  Scenario: Apply tiered fee structure based on trading volume
    Given a trader "Henry" has traded $50000 in the last 30 days
    And the volume tier thresholds are:
      | Tier | Volume Range | Fee Rate |
      | Standard | $0 - $10000 | 2.5% |
      | Silver | $10001 - $50000 | 2.0% |
      | Gold | $50001 - $100000 | 1.5% |
      | Platinum | $100000+ | 1.0% |
    When Henry executes a trade worth $5000
    Then the Silver tier fee rate of 2.0% is applied
    And the trading fee is $100
    And Henry's volume tier is recalculated for future trades

  # ============================================================================
  # Partial Position Sales
  # ============================================================================

  @ROAD-034.12 @partial @fractional @split
  Scenario: Execute partial sale of a promise position
    Given a trader "Ivan" owns a promise position of 10000 tokens
    And Ivan lists the position for sale
    When a buyer purchases 3000 tokens from the position
    Then Ivan retains ownership of 7000 tokens
    And the buyer receives ownership of 3000 tokens
    And two separate promise position records are created
    And both positions maintain the same original terms and expiration
    And the partial sale is recorded in the position history

  @ROAD-034.13 @partial @validation @minimum
  Scenario: Enforce minimum position size for partial sales
    Given a promise position has a minimum tradable unit of 100 tokens
    And a trader attempts to sell 50 tokens from a position
    When the partial sale request is validated
    Then the request is rejected
    And an error message "Minimum position size is 100 tokens" is returned
    And the minimum unit size is displayed to the trader

  # ============================================================================
  # Market Maker Incentives
  # ============================================================================

  @ROAD-034.14 @marketmaker @incentives @liquidity
  Scenario: Reward market makers for providing liquidity
    Given a market maker "Jane" has placed resting orders on both sides
    And Jane's orders have been filled providing $10000 in liquidity
    And the market maker incentive rate is 0.1% of liquidity provided
    When the daily incentive calculation runs
    Then Jane receives an incentive payment of $10
    And the payment is distributed to Jane's account
    And a market maker performance report is generated
    And Jane's market maker score increases

  @ROAD-034.15 @marketmaker @spread @requirements
  Scenario: Verify market maker spread requirements
    Given a market maker "Kevin" is registered in the program
    And the maximum allowed spread is 5%
    And Kevin places a bid at $480 and an ask at $530
    When the spread validation runs
    Then the calculated spread is 10.4%
    And the orders are flagged as "SPREAD_TOO_WIDE"
    And Kevin receives a warning about spread requirements
    And the orders are not eligible for market maker incentives

  # ============================================================================
  # Settlement of Secondary Trades
  # ============================================================================

  @ROAD-034.16 @settlement @atomic @guarantee
  Scenario: Atomic settlement of secondary market trade
    Given a secondary market trade is matched between "Laura" and "Mike"
    And Laura is selling a promise position worth $2000
    And Mike has $2000 available in his trading account
    When the atomic settlement executes
    Then the promise ownership transfers to Mike
    And $2000 is debited from Mike's account
    And $1950 is credited to Laura's account (after fees)
    And $50 in fees is distributed according to fee schedule
    And either all operations succeed or all fail atomically
    And the settlement is completed within 3 seconds

  @ROAD-034.17 @settlement @failure @rollback
  Scenario: Handle settlement failure with proper rollback
    Given a secondary market trade is in the settlement process
    And a system error occurs during the ownership transfer
    When the settlement failure is detected
    Then all partial operations are rolled back
    And the promise ownership remains with the original seller
    And buyer funds are returned to their account
    And the trade is marked as "SETTLEMENT_FAILED"
    And both parties are notified of the failure
    And the orders are reinstated to the order book

  @ROAD-034.18 @settlement @confirmation @receipt
  Scenario: Generate trade confirmation and settlement receipt
    Given a secondary market trade has been successfully settled
    And the trade involved 500 tokens at $2.50 per token
    When the settlement completes
    Then a trade confirmation is generated
    And the confirmation includes:
      | Field | Value |
      | Trade ID | Unique identifier |
      | Timestamp | Settlement time |
      | Buyer | Buyer identity |
      | Seller | Seller identity |
      | Promise Type | Compute type |
      | Quantity | 500 tokens |
      | Price | $2.50 per token |
      | Total Value | $1250 |
      | Fees | $31.25 |
      | Net Proceeds | $1218.75 |
    And the receipt is digitally signed
    And both parties can access the confirmation in their trade history
