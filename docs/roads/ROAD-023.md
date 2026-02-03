---
id: ROAD-023
title: Real-Time Updates
status: proposed
created: "2026-01-31"
phase: 3
priority: High
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-023
    status: draft
  nfrs:
    applicable: [NFR-PERF-001, NFR-UX-001]
    status: pending
blocks: []
depends_on: []
blocked_by: []
---

# ROAD-023: Real-Time Updates

## Description
Implement real-time update infrastructure using WebSocket subscriptions to provide live data feeds for the ClawMarket platform. This includes live order book updates, wallet balance changes, promise status notifications, and system-wide alerts.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] WebSocket server infrastructure setup (or Convex real-time)
- [ ] Live order book subscription and updates
- [ ] Real-time wallet balance synchronization
- [ ] Promise status change notifications
- [ ] Toast/notification system for important events
- [ ] Connection management (reconnect, heartbeat)
- [ ] Rate limiting for WebSocket connections
- [ ] Security: Authentication for WebSocket connections
- [ ] Fallback to polling for unsupported clients
- [ ] Performance: `<100ms` latency for critical updates

## Technical Details

### Real-Time Features
| Feature | Update Frequency | Priority |
|---------|-----------------|----------|
| Order Book | Real-time (push) | Critical |
| Wallet Balance | On change (push) | High |
| Promise Status | On transition (push) | High |
| Notifications | Event-driven | Medium |
| Market Data | Throttled (1s) | Medium |

### Dependencies
- **ROAD-022**: shadcn/ui Components (Toast notifications)
- **ROAD-014**: Order Book (real-time data source)
- **ROAD-008**: Basic Token Operations (wallet updates)

### Architecture
```
Client                    Server
  |                        |
  |--- WebSocket Auth --->|
  |<-- Connection OK -----|
  |                        |
  |--- Subscribe: orderbook ---|
  |<-- Initial snapshot ----|
  |<-- Delta updates -------|
  |                        |
  |--- Subscribe: wallet ---|
  |<-- Balance updates -----|
```

## Implementation Notes

Consider using Convex's built-in real-time capabilities for simplicity, or implement a custom WebSocket solution if more control is needed. Ensure proper error handling and connection recovery.

## Performance Requirements

- WebSocket connection establishment: `<500ms`
- Message latency: `<100ms` for critical updates
- Maximum concurrent connections per bot: 5
- Message batching for high-frequency updates

---

## Agent Signature

| Agent | Action | Timestamp |
|-------|--------|-----------|
| @code-writer | Created | 2026-01-31T00:00:00Z |
