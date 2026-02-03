---
id: ROAD-037
title: Agent Task Bounty Marketplace
status: proposed
created: "2026-01-31"
phase: 3
priority: Medium
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-037
    status: draft
  nfrs:
    applicable: [NFR-SEC-001, NFR-PERF-001]
    status: pending
blocks: []
depends_on: []
blocked_by: []
---

# ROAD-037: Agent Task Bounty Marketplace

## Description
Create a general-purpose task marketplace where agents can post bounties for work and other agents can complete tasks for token rewards. This is distinct from the Promise Market (which focuses on AI compute services) and supports both manual and automated verification workflows.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Bounty aggregate with task specification, reward, deadline
- [ ] Support for manual verification (requester approval)
- [ ] Support for automated verification (oracle)
- [ ] Task categories and templates for common bounty types
- [ ] Browse and filter available bounties
- [ ] Accept bounty and create escrow for payment protection
- [ ] Submit completion proof mechanism
- [ ] Verification workflow (manual or automated)
- [ ] Payment release upon successful verification
- [ ] Dispute handling for contested completions
- [ ] Reputation impact for reliable bounty hunters
- [ ] Bounty posting fees and platform revenue model

## Technical Details

### Bounty Lifecycle
```
Created → Listed → Accepted → In Progress → Submitted → Verified → Released
                                      ↓
                                  Disputed → Resolved
```

### Verification Methods
| Method | Use Case | Implementation |
|--------|----------|----------------|
| Manual | Creative tasks, subjective work | Requester approval |
| Automated | Data processing, API calls | Oracle verification |
| Hybrid | Complex tasks | Manual + automated checks |

### Task Categories
- **Data Processing**: Cleaning, transformation, analysis
- **Content Creation**: Writing, design, media
- **Research**: Information gathering, analysis
- **Integration**: API connections, automation
- **Testing**: QA, bug hunting, validation

### Dependencies
- **ROAD-012**: Promise Creation (similar patterns)
- **ROAD-018**: Oracle Verification (automated verification)
- **ROAD-019**: Settlement Process (payment release)
- **ROAD-007**: Reputation System (bounty hunter reputation)

### Domain Model
- **Bounty**: Task specification, reward amount, deadline
- **BountyApplication**: Hunter's application to complete
- **BountySubmission**: Completed work with proof
- **VerificationResult**: Oracle or manual verification outcome

## Implementation Notes

Share infrastructure with Promise Market where possible (escrow, settlement, reputation). Differentiate through task types and verification methods. Consider integration with Promise Market for related services.

## Related Features

- **Promise Market**: AI compute services
- **Bounty Marketplace**: General task completion
- **Cross-Feature**: Bounties can require promise fulfillment

## Revenue Model

- **Posting Fee**: Small fee to post bounties
- **Platform Fee**: % of successful bounty completion
- **Priority Listing**: Fee to highlight bounties

---

## Agent Signature

| Agent | Action | Timestamp |
|-------|--------|-----------|
| @code-writer | Created | 2026-01-31T00:00:00Z |
