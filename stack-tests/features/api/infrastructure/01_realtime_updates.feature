@ROAD-023 @api @realtime @websocket @pending
Feature: Real-Time Updates via WebSocket
  As a marketplace participant
  I want to receive real-time updates about promise status, order book changes, and wallet updates
  So that I can react immediately to market changes and manage my positions effectively

  Background:
    Given the ClawMarket real-time infrastructure is operational
    And the WebSocket server is running at wss://api.clawmarket.com/ws

  # ============================================
  # WebSocket Connection Establishment
  # ============================================

  @connection @authentication
  Scenario: Successfully establish authenticated WebSocket connection
    Given a registered user with valid JWT token
    When the user opens a WebSocket connection with authentication token
    Then the connection is established successfully
    And the server sends a "connection_established" event
    And the connection is associated with the user's identity

  @connection @authentication
  Scenario: Reject WebSocket connection without valid authentication
    Given an unauthenticated client
    When the client attempts to open a WebSocket connection without token
    Then the connection is rejected with 401 Unauthorized
    And the server closes the connection immediately

  @connection @authentication
  Scenario: Reject WebSocket connection with expired token
    Given a registered user with expired JWT token
    When the user opens a WebSocket connection with the expired token
    Then the connection is rejected with 401 Unauthorized
    And the error message indicates "Token expired"

  # ============================================
  # Promise Status Change Notifications
  # ============================================

  @promise @status @notification
  Scenario: Receive notification when promise status changes to active
    Given a user has an authenticated WebSocket connection
    And the user has a promise in "pending" status
    When the promise transitions to "active" status
    Then the user receives a "promise.status_changed" event
    And the event contains the promise ID
    And the event contains the new status "active"
    And the event contains the timestamp of the status change

  @promise @status @notification
  Scenario: Receive notification when promise is fulfilled
    Given a user has an authenticated WebSocket connection
    And the user has an active promise
    When the promise is fulfilled by the provider
    Then the user receives a "promise.fulfilled" event
    And the event contains the promise ID
    And the event contains the fulfillment details
    And the event contains the tokens transferred amount

  @promise @status @notification
  Scenario: Receive notification when promise fails or is cancelled
    Given a user has an authenticated WebSocket connection
    And the user has an active promise
    When the promise fails or is cancelled
    Then the user receives a "promise.failed" or "promise.cancelled" event
    And the event contains the promise ID
    And the event contains the reason for failure or cancellation
    And the event contains any refund information

  # ============================================
  # Order Book Update Broadcasts
  # ============================================

  @orderbook @broadcast @market
  Scenario: Receive real-time order book updates for subscribed market
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to the "LLM_COMPUTE" market order book
    When a new bid is placed in the market
    Then the user receives an "orderbook.bid_added" event
    And the event contains the bid details including price and quantity
    And the event contains the updated order book depth

  @orderbook @broadcast @market
  Scenario: Receive notification when order is matched
    Given a user has an authenticated WebSocket connection
    And the user has an active order in the order book
    When the order is matched with a counterparty
    Then the user receives an "orderbook.order_matched" event
    And the event contains the order ID
    And the event contains the match details including matched price and quantity
    And the event contains the counterparty information

  @orderbook @broadcast @market
  Scenario: Receive order book snapshot on subscription
    Given a user has an authenticated WebSocket connection
    When the user subscribes to the "LLM_COMPUTE" market order book
    Then the user immediately receives an "orderbook.snapshot" event
    And the snapshot contains the current bids and asks
    And the snapshot contains the last traded price
    And the snapshot contains the 24-hour volume

  # ============================================
  # Wallet Balance Real-Time Updates
  # ============================================

  @wallet @balance @notification
  Scenario: Receive real-time wallet balance updates on credit
    Given a user has an authenticated WebSocket connection
    And the user has a wallet with 1000 tokens
    When 500 tokens are credited to the user's wallet
    Then the user receives a "wallet.balance_updated" event
    And the event contains the new balance of 1500 tokens
    And the event contains the transaction details
    And the event contains the timestamp of the update

  @wallet @balance @notification
  Scenario: Receive real-time wallet balance updates on debit
    Given a user has an authenticated WebSocket connection
    And the user has a wallet with 1000 tokens
    When 200 tokens are debited from the user's wallet
    Then the user receives a "wallet.balance_updated" event
    And the event contains the new balance of 800 tokens
    And the event contains the transaction details
    And the event contains the reason for the debit

  @wallet @balance @notification
  Scenario: Receive notification for pending transaction status change
    Given a user has an authenticated WebSocket connection
    And the user has a pending transaction
    When the transaction is confirmed on the blockchain
    Then the user receives a "wallet.transaction_confirmed" event
    And the event contains the transaction ID
    And the event contains the confirmation details
    And the event contains the updated wallet balance

  # ============================================
  # Reputation Score Changes
  # ============================================

  @reputation @score @notification
  Scenario: Receive notification when reputation score increases
    Given a user has an authenticated WebSocket connection
    And the user has a reputation score of 85
    When the user receives positive feedback increasing their score to 88
    Then the user receives a "reputation.score_changed" event
    And the event contains the new score of 88
    And the event contains the previous score of 85
    And the event contains the reason for the score change

  @reputation @score @notification
  Scenario: Receive notification when reputation score decreases
    Given a user has an authenticated WebSocket connection
    And the user has a reputation score of 85
    When the user receives negative feedback decreasing their score to 82
    Then the user receives a "reputation.score_changed" event
    And the event contains the new score of 82
    And the event contains the previous score of 85
    And the event contains the reason for the score change

  @reputation @tier @notification
  Scenario: Receive notification when reputation tier changes
    Given a user has an authenticated WebSocket connection
    And the user is in the "Silver" tier
    When the user's reputation score crosses the threshold to "Gold" tier
    Then the user receives a "reputation.tier_changed" event
    And the event contains the new tier "Gold"
    And the event contains the previous tier "Silver"
    And the event contains the benefits unlocked with the new tier

  # ============================================
  # Connection Failure and Reconnection
  # ============================================

  @connection @reconnection @resilience
  Scenario: Handle unexpected connection closure and reconnect
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to multiple channels
    When the connection is unexpectedly closed due to network issues
    Then the client detects the disconnection
    And the client automatically attempts to reconnect
    When the reconnection is successful
    Then the client resubscribes to all previous channels
    And the user receives any missed events during the disconnection period

  @connection @reconnection @resilience
  Scenario: Handle server-side connection termination
    Given a user has an authenticated WebSocket connection
    When the server terminates the connection due to maintenance
    Then the user receives a "connection.closing" event with reason "maintenance"
    And the connection is gracefully closed
    And the client waits for the specified reconnection delay
    And the client reconnects when the server is available

  @connection @reconnection @resilience
  Scenario: Handle reconnection with exponential backoff
    Given a user has an authenticated WebSocket connection
    When the connection is lost
    Then the client attempts reconnection with exponential backoff
    And the first reconnection attempt happens after 1 second
    And subsequent attempts double the delay up to a maximum of 30 seconds
    When the connection is restored
    Then the backoff counter is reset

  # ============================================
  # Subscription Management
  # ============================================

  @subscription @management
  Scenario: Subscribe to specific event channels
    Given a user has an authenticated WebSocket connection
    When the user sends a "subscribe" message for channel "orderbook.LLM_COMPUTE"
    Then the server confirms the subscription with "subscription.confirmed"
    And the confirmation contains the subscribed channel name
    And the user starts receiving events for that channel

  @subscription @management
  Scenario: Unsubscribe from event channels
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to channel "orderbook.LLM_COMPUTE"
    When the user sends an "unsubscribe" message for channel "orderbook.LLM_COMPUTE"
    Then the server confirms the unsubscription with "subscription.cancelled"
    And the user stops receiving events for that channel

  @subscription @management
  Scenario: Subscribe to multiple channels simultaneously
    Given a user has an authenticated WebSocket connection
    When the user sends a "subscribe" message with multiple channels:
      | channel                    |
      | orderbook.LLM_COMPUTE      |
      | wallet.balance             |
      | promise.updates            |
    Then the server confirms all subscriptions
    And the user receives events from all subscribed channels

  @subscription @management
  Scenario: Reject subscription to unauthorized channels
    Given a user has an authenticated WebSocket connection
    When the user attempts to subscribe to channel "admin.system_events"
    Then the server rejects the subscription with "subscription.denied"
    And the error message indicates "Insufficient permissions"

  # ============================================
  # Event Filtering
  # ============================================

  @filtering @events @customization
  Scenario: Filter events by promise type
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to promise updates
    When the user sets a filter for "compute_capacity" promise type only
    Then the user only receives events for promises of type "compute_capacity"
    And events for other promise types are not sent to this connection

  @filtering @events @customization
  Scenario: Filter events by minimum token amount
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to order book updates
    When the user sets a filter for orders with minimum 100 tokens
    Then the user only receives order book events for orders >= 100 tokens
    And smaller orders are filtered out from the events

  @filtering @events @customization
  Scenario: Filter events by market region
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to market updates
    When the user sets a filter for "US_EAST" region only
    Then the user only receives events related to the "US_EAST" region
    And events from other regions are not sent to this connection

  @filtering @events @customization
  Scenario: Combine multiple event filters
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to promise updates
    When the user sets multiple filters:
      | filter_type    | value            |
      | promise_type   | compute_capacity |
      | min_tokens     | 500              |
      | status         | active           |
    Then the user only receives events matching all filter criteria
    And events not matching all criteria are filtered out

  @filtering @events @rate-limiting
  Scenario: Rate limiting for high-frequency events
    Given a user has an authenticated WebSocket connection
    And the user is subscribed to high-frequency order book updates
    When the order book updates exceed 10 events per second
    Then the server applies rate limiting
    And the user receives aggregated updates instead of individual events
    And the aggregation includes the net changes over the time window

  # ============================================
  # Heartbeat and Connection Health
  # ============================================

  @heartbeat @health @connection
  Scenario: WebSocket heartbeat mechanism
    Given a user has an authenticated WebSocket connection
    When the connection is idle for 30 seconds
    Then the server sends a "ping" heartbeat message
    And the client responds with a "pong" message
    And the connection remains active

  @heartbeat @health @connection
  Scenario: Detect stale connection via missed heartbeats
    Given a user has an authenticated WebSocket connection
    When the client misses 3 consecutive heartbeat responses
    Then the client marks the connection as stale
    And the client initiates reconnection
    And the previous connection is forcefully closed

  # ============================================
  # Error Handling
  # ============================================

  @error @handling @validation
  Scenario: Handle malformed WebSocket messages
    Given a user has an authenticated WebSocket connection
    When the user sends a malformed JSON message
    Then the server responds with an "error.invalid_message" event
    And the error contains details about the parsing failure
    And the connection remains open for subsequent valid messages

  @error @handling @validation
  Scenario: Handle invalid subscription requests
    Given a user has an authenticated WebSocket connection
    When the user sends a subscribe request with invalid channel name
    Then the server responds with an "error.invalid_channel" event
    And the error contains the list of valid channel names
    And the subscription is not created

  @error @handling @limits
  Scenario: Enforce maximum subscriptions per connection
    Given a user has an authenticated WebSocket connection
    And the user has reached the maximum of 20 subscriptions
    When the user attempts to subscribe to an additional channel
    Then the server responds with an "error.subscription_limit" event
    And the error indicates the maximum subscription limit
    And the user must unsubscribe from a channel before adding new ones
