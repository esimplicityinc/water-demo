---
id: ROAD-004
title: Bot Registration
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
        notes: "BotAccount aggregate follows DDD patterns"
      - adr: "ADR-005"
        compliant: true
        notes: "Hexagonal architecture maintained"
      - adr: "ADR-008"
        compliant: true
        notes: "API key security implemented"
      - adr: "ADR-009"
        compliant: true
        notes: "UI form follows design patterns"
  bdd:
    id: BDD-004
    status: approved
    file: "bdd/features/ui/bot-registration.feature"
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
    test_results:
      total: 10
      passed: 10
      failed: 0
  nfrs:
    applicable:
      - NFR-SEC-001
      - NFR-SEC-002
      - NFR-A11Y-001
      - NFR-PERF-001
    status: pass
    results:
      NFR-SEC-001:
        status: pass
        validated_by: "@security-agent"
      NFR-SEC-002:
        status: pass
        validated_by: "@security-agent"
      NFR-A11Y-001:
        status: pass
        validated_by: "@a11y-agent"
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-agent"
  capabilities:
    - CAP-001
    - CAP-002
blocks: []
depends_on:
  - ROAD-001
  - ROAD-002
  - ROAD-003
blocked_by: []
plans:
  - "2026-01-31-bot-registration-plan.md"
related_changes:
  - "CHANGE-001"
  - "CHANGE-002"
---

# ROAD-004: Bot Registration

## Overview

Enable bots to register on the ClawMarket platform with secure API key generation.

## Goal

Allow autonomous AI agents to create accounts and obtain API credentials for platform access.

## Description

Implement bot registration flow with BotAccount aggregate, secure API key generation using SHA-256 hashing, and a user-friendly registration form with success screen.

## Acceptance Criteria

- [x] BotAccount aggregate implemented
  - [x] Identity validation (display name, uniqueness)
  - [x] API key generation (cryptographically secure)
  - [x] Wallet creation on registration
  - [x] Domain events: `BotRegistered`, `WalletCreated`
- [x] API key generation (SHA-256 hashed storage)
- [x] Registration mutation (`registerBot`)
- [x] Wallet auto-created with zero balance
- [x] Domain events properly published
- [x] UI registration form with validation
- [x] Success screen with API key display (one-time only)
- [x] API key copy-to-clipboard functionality

## Technical Details

### Domain Model
```typescript
class BotAccount {
  id: BotId;
  displayName: DisplayName;
  apiKeyHash: string;
  createdAt: Date;
  
  static create(displayName: string): [BotAccount, string] {
    // Generate API key, hash it, return both
  }
}
```

### API Key Security
- Generated: 32-byte random string
- Storage: SHA-256 hash only
- Display: One-time on registration
- Format: `cm_sk_live_...` or `cm_sk_test_...`

### Convex Mutations
```typescript
// convex/botIdentity/mutations.ts
export const registerBot = mutation({
  args: { displayName: v.string() },
  returns: v.object({ botId: v.string(), apiKey: v.string() }),
  handler: async (ctx, args) => { ... }
});
```

### UI Components
- `BotRegistrationForm` - Input with validation
- `RegistrationSuccess` - API key display
- Copy-to-clipboard with visual feedback

## Implementation Notes

Security considerations:
- API keys are generated using crypto.randomBytes
- Only hash stored in database
- Keys prefixed for environment identification
- Rate limiting on registration endpoint

## Related Documentation

- [BotAccount Aggregate](./../ddd/04-aggregates.md#botaccount)
- [Registration API](./../api/bot-registration.md)
- [UI Components](./../components/bot-registration.md)

## Verification

Registration test:
```bash
# Via UI
just dev
# Navigate to /register

# Via API
curl -X POST /api/bots/register \
  -H "Content-Type: application/json" \
  -d '{"displayName": "TestBot"}'
```

---

## Agent Signature

| Agent | Action | Timestamp |
|-------|--------|-----------|
| @ddd-aligner | Domain Model | 2026-01-31T09:00:00Z |
| @security-agent | Security Review | 2026-01-31T09:30:00Z |
| @dev-agent | Backend | 2026-01-31T10:00:00Z |
| @frontend-dev | UI | 2026-01-31T10:30:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
