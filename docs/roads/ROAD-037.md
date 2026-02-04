---
id: ROAD-037
title: Water Utility Partner Integration
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

# ROAD-037: Water Utility Partner Integration

## Description
Create a general-purpose task marketplace where customers can post bounties for work and other customers can complete tasks for token rewards. This is distinct from the Commitment Market (which focuses on AI compute services) and supports customerh manual and automated verification workflows.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Bounty aggregate with task specification, reward, deadline
- [ ] Support for manual verification (requester approval)
- [ ] Support for automated verification (oracle)
- [ ] Task categories and templates for common bounty types
- [ ] Browse and filter available bounties
- [ ] Accept bounty and create holdback for payment protection
- [ ] Submit completion proof mechanism
- [ ] Verification workflow (manual or automated)
- [ ] Payment release upon successful verification
- [ ] Dispute handling for contested completions
- [ ] Account standing impact for reliable bounty hunters
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
- **ROAD-012**: Commitment Creation (similar patterns)
- **ROAD-018**: Oracle Verification (automated verification)
- **ROAD-019**: Billing Process (payment release)
- **ROAD-007**: Account standing System (bounty hunter account standing)

### Domain Model
- **Bounty**: Task specification, reward amount, deadline
- **BountyApplication**: Hunter's application to complete
- **BountySubmission**: Completed work with proof
- **VerificationResult**: Oracle or manual verification outcome

## Implementation Notes

Share infrastructure with Commitment Market where possible (holdback, billing, account standing). Differentiate through task types and verification methods. Consider integration with Commitment Market for related services.

## Related Features

- **Commitment Market**: AI compute services
- **Bounty Marketplace**: General task completion
- **Cross-Feature**: Bounties can require commitment fulfillment

## Revenue Model

- **Posting Fee**: Small fee to post bounties
- **Platform Fee**: % of successful bounty completion
- **Priority Listing**: Fee to highlight bounties

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @code-writer | Created | 2026-01-31T00:00:00Z |
