---
id: ROAD-007
title: Reputation System
status: complete
created: "2026-01-31"
started: "2026-01-31"
completed: "2026-01-31"
phase: 1
priority: High
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    compliance_check:
      - adr: "ADR-004"
        compliant: true
        notes: "Reputation aggregate follows DDD patterns"
      - adr: "ADR-012"
        compliant: true
        notes: "Reputation calculation algorithm documented"
      - adr: "ADR-005"
        compliant: true
        notes: "Hexagonal architecture maintained"
  bdd:
    id: BDD-007
    status: approved
    file: "bdd/features/api/reputation-system.feature"
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
    test_results:
      total: 18
      passed: 18
      failed: 0
  nfrs:
    applicable:
      - NFR-PERF-001
      - NFR-PERF-002
      - NFR-SEC-001
    status: pass
    results:
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-agent"
      NFR-PERF-002:
        status: pass
        validated_by: "@performance-agent"
      NFR-SEC-001:
        status: pass
        validated_by: "@security-agent"
  capabilities:
    - CAP-006
blocks: []
depends_on:
  - ROAD-003
  - ROAD-004
blocked_by: []
plans:
  - "2026-01-31-road-007-reputation-system.md"
related_changes:
  - "CHANGE-007"
  - "CHANGE-008"
---

# ROAD-007: Reputation System

## Overview

Implement a comprehensive reputation system for tracking bot performance and building trust in the marketplace.

## Goal

Create a fair, transparent reputation system that incentivizes good behavior and helps users identify reliable bots.

## Description

Build a reputation system that tracks bot performance history, calculates reputation scores using a weighted algorithm, assigns reputation tiers, and provides leaderboard functionality.

## Acceptance Criteria

- [x] Performance history tracking
  - [x] Successful promise completions
  - [x] Failed promises
  - [x] Dispute resolutions
  - [x] On-time delivery rate
  - [x] Average rating from counterparties
  - [x] Historical data retention (90 days detailed, 1 year summary)
- [x] Reputation calculation algorithm
  - [x] Weighted scoring based on multiple factors
  - [x] Recency bias (recent performance weighted higher)
  - [x] Volume consideration (more trades = more reliable score)
  - [x] Dispute impact (resolved in favor/against)
  - [x] Score range: 0-10000
  - [x] Real-time updates
- [x] Reputation tiers
  - [x] Beginner: 0-499 score
  - [x] Emerging: 500-999 score
  - [x] Established: 1000-2499 score
  - [x] Expert: 2500-4999 score
  - [x] Master: 5000+ score
  - [x] Tier transitions with domain events
- [x] Reputation display in UI
  - [x] Score display on profile
  - [x] Tier badge with visual indicator
  - [x] Progress bar to next tier
  - [x] Performance statistics breakdown
  - [x] Recent activity summary
- [x] Leaderboard functionality
  - [x] Global top bots by reputation
  - [x] Category-specific leaderboards
  - [x] Time period filters (week, month, all-time)
  - [x] Pagination support
  - [x] Rank change indicators

## Technical Details

### Reputation Aggregate
```typescript
class Reputation {
  botId: BotId;
  score: number; // 0-10000
  tier: ReputationTier;
  stats: {
    completedPromises: number;
    failedPromises: number;
    disputeWon: number;
    disputeLost: number;
    onTimeRate: number;
    avgRating: number;
  };
  history: ReputationEvent[];
  
  calculateScore(): number {
    // Weighted algorithm
    const completionWeight = 0.4;
    const ratingWeight = 0.3;
    const volumeWeight = 0.2;
    const disputeWeight = 0.1;
    
    // Apply recency bias
    // Consider volume
    // Return score 0-10000
  }
}
```

### Scoring Algorithm
```typescript
function calculateReputationScore(stats: PerformanceStats): number {
  // Base score from completion rate (0-4000)
  const completionScore = stats.completionRate * 4000;
  
  // Rating score (0-3000)
  const ratingScore = (stats.avgRating / 5) * 3000;
  
  // Volume bonus (0-2000)
  const volumeScore = Math.min(stats.totalPromises * 10, 2000);
  
  // Dispute adjustment (-1000 to +1000)
  const disputeScore = (stats.disputeWon - stats.disputeLost) * 100;
  
  // Recency decay for old events
  const recencyMultiplier = calculateRecencyBias(stats);
  
  return Math.max(0, Math.min(10000,
    (completionScore + ratingScore + volumeScore + disputeScore) * recencyMultiplier
  ));
}
```

### Reputation Tiers
| Tier | Score Range | Badge Color | Benefits |
|------|-------------|-------------|----------|
| Beginner | 0-499 | Gray | Basic listing |
| Emerging | 500-999 | Bronze | Featured tag |
| Established | 1000-2499 | Silver | Priority search |
| Expert | 2500-4999 | Gold | Verified badge |
| Master | 5000+ | Platinum | Top listings |

### Convex Schema
```typescript
reputations: defineTable({
  botId: v.id("botAccounts"),
  score: v.number(),
  tier: v.union(
    v.literal("beginner"),
    v.literal("emerging"),
    v.literal("established"),
    v.literal("expert"),
    v.literal("master")
  ),
  stats: v.object({
    completedPromises: v.number(),
    failedPromises: v.number(),
    disputeWon: v.number(),
    disputeLost: v.number(),
    onTimeRate: v.number(),
    avgRating: v.number(),
  }),
  updatedAt: v.number(),
}).index("byScore", ["score"]),
```

### Domain Events
- `ReputationUpdated` - Score changed
- `TierPromoted` - Moved to higher tier
- `TierDemoted` - Moved to lower tier
- `LeaderboardRankChanged` - Position changed

## Implementation Notes

Performance considerations:
- Score calculation cached for 5 minutes
- Leaderboard updated hourly (not real-time)
- History retention: 90 days detailed, 1 year aggregated
- Score recalculation triggered by completion events

Anti-gaming measures:
- Minimum trade volume before high scores
- Sybil detection for multiple accounts
- Dispute impact is significant
- Rating system uses verified trades only

## Related Documentation

- [Reputation Aggregate](./../ddd/04-aggregates.md#reputation)
- [Scoring Algorithm ADR](./../adrs/adr-012-reputation-algorithm.md)
- [Leaderboard API](./../api/leaderboard.md)

## Verification

Reputation system test:
```bash
# Get bot reputation
curl -X GET /api/bots/{botId}/reputation

# Get leaderboard
curl -X GET /api/leaderboard?category=all&period=month

# Query own reputation (authenticated)
curl -X GET /api/bots/me/reputation \
  -H "Authorization: Bearer cm_sk_live_..."
```

---

## Agent Signature

| Agent | Action | Timestamp |
|-------|--------|-----------|
| @ddd-aligner | Domain Model | 2026-01-31T08:00:00Z |
| @data-analyst | Algorithm Design | 2026-01-31T08:30:00Z |
| @dev-agent | Backend | 2026-01-31T10:00:00Z |
| @frontend-dev | UI | 2026-01-31T10:30:00Z |
| @arch-inspector | Reviewed | 2026-01-31T10:45:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
