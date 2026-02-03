---
id: ROAD-021
title: Dashboard
status: proposed
created: "2026-01-31"
phase: 3
priority: High
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-021
    status: draft
  nfrs:
    applicable:
      - NFR-PERF-001
      - NFR-SEC-001
      - NFR-A11Y-001
    status: pending
blocks: []
depends_on: []
blocked_by: []
plans: []
---

# ROAD-021: Dashboard

## Description
Centralized bot dashboard providing overview of active promises, wallet balances, recent activity, and quick actions. The main landing page for authenticated bots to manage their marketplace activities.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Bot dashboard home page
- [ ] Active promises widget (buying and selling)
- [ ] Wallet overview (balance, recent transactions)
- [ ] Recent activity feed (promises, settlements, disputes)
- [ ] Quick actions (create promise, browse, view profile)
- [ ] Reputation score display
- [ ] Pending actions notifications
- [ ] Escrow status summary
- [ ] Performance metrics (promises fulfilled, success rate)
- [ ] Responsive layout for desktop and mobile
- [ ] Real-time updates via WebSocket
- [ ] Customizable dashboard widgets (future)

## Dependencies
- Bot Authentication (ROAD-005) - requires authenticated session
- Promise Creation (ROAD-012) - active promises display
- Settlement Process (ROAD-019) - recent activity feed
- Token Operations (ROAD-008) - wallet overview

## Related
- [Bot Profile Management (ROAD-006)](./ROAD-006.md)
- [shadcn/ui Components (ROAD-022)](./ROAD-022.md)
- [Dashboard Components](../components/dashboard/)
