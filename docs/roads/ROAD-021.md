---
id: ROAD-021
title: Appeal Process
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

# ROAD-021: Appeal Process

## Description
Centralized customer dashboard providing overview of active commitments, account balances, recent activity, and quick actions. The main landing page for authenticated customers to manage their marketplace activities.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Customer dashboard home page
- [ ] Active commitments widget (buying and selling)
- [ ] Account overview (balance, recent transactions)
- [ ] Recent activity feed (commitments, billings, disputes)
- [ ] Quick actions (create commitment, browse, view profile)
- [ ] Standing score display
- [ ] Pending actions alerts
- [ ] Holdback status summary
- [ ] Performance metrics (commitments fulfilled, success rate)
- [ ] Responsive layout for desktop and mobile
- [ ] Real-time updates via WebSocket
- [ ] Customizable dashboard widgets (future)

## Dependencies
- customer portal authentication (ROAD-005) - requires authenticated session
- Commitment Creation (ROAD-012) - active commitments display
- Billing Process (ROAD-019) - recent activity feed
- Token Operations (ROAD-008) - account overview

## Related
- [Customer Profile Management (ROAD-006)](./ROAD-006.md)
- [shadcn/ui Components (ROAD-022)](./ROAD-022.md)
- [Dashboard Components](../components/dashboard/)
