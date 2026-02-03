---
id: ROAD-005
title: Bot Authentication
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
      - adr: "ADR-008"
        compliant: true
        notes: "API key authentication implemented"
      - adr: "ADR-010"
        compliant: true
        notes: "Rate limiting configured"
      - adr: "ADR-005"
        compliant: true
        notes: "Hexagonal architecture maintained"
  bdd:
    id: BDD-005
    status: approved
    file: "bdd/features/api/bot-authentication.feature"
    approved_by:
      - agent: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - agent: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
    test_results:
      total: 15
      passed: 15
      failed: 0
  nfrs:
    applicable:
      - NFR-SEC-001
      - NFR-SEC-002
      - NFR-SEC-003
      - NFR-PERF-001
    status: pass
    results:
      NFR-SEC-001:
        status: pass
        validated_by: "@security-agent"
      NFR-SEC-002:
        status: pass
        validated_by: "@security-agent"
      NFR-SEC-003:
        status: pass
        validated_by: "@security-agent"
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-agent"
  capabilities:
    - CAP-001
    - CAP-002
    - CAP-004
blocks: []
depends_on:
  - ROAD-003
  - ROAD-004
blocked_by: []
plans:
  - "2026-01-31-bot-authentication-plan.md"
  - "2026-01-31-bot-authentication-design.md"
related_changes:
  - "CHANGE-003"
  - "CHANGE-004"
---

# ROAD-005: Bot Authentication

## Overview

Implement secure bot authentication with API key verification and rotation capabilities.

## Goal

Enable bots to authenticate API requests securely with support for key rotation.

## Description

Build authentication middleware that verifies API keys using SHA-256 hashing, provides rate limiting, and allows bots to regenerate their API keys when needed.

## Acceptance Criteria

- [x] API key verification middleware (`withAuth`)
  - [x] Extract key from Authorization header
  - [x] Hash key and lookup in database
  - [x] Attach bot context to request
  - [x] Return 401 for invalid keys
- [x] Authentication queries (`getBotByApiKey`)
- [x] Rate limiting per IP (100 attempts per 15 min window)
  - [x] IP-based tracking
  - [x] Exponential backoff on failures
  - [x] Clear error messages
- [x] API key rotation endpoint (`POST /api/bots/me/regenerate-api-key`)
  - [x] Generate new key
  - [x] Invalidate old key
  - [x] Return new key (one-time display)
- [x] Protected route: `GET /api/bots/me`
  - [x] Returns bot profile
  - [x] Requires valid API key
- [x] Domain events: `ApiKeyRegenerated`
  - [x] Audit trail maintained
  - [x] Timestamp recorded

## Technical Details

### Authentication Middleware
```typescript
// middleware/withAuth.ts
export const withAuth = async (req, res, next) => {
  const apiKey = extractApiKey(req);
  const apiKeyHash = sha256(apiKey);
  const bot = await getBotByApiKeyHash(apiKeyHash);
  
  if (!bot) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  
  req.bot = bot;
  next();
};
```

### Rate Limiting
- Strategy: Fixed window with IP tracking
- Limit: 100 requests per 15 minutes
- Failures: Tracked separately with stricter limits
- Storage: Convex with TTL

### API Key Rotation
```typescript
// convex/botIdentity/mutations.ts
export const regenerateApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const bot = await requireAuth(ctx);
    const [newKey, newHash] = generateApiKey();
    
    await ctx.db.patch(bot._id, { apiKeyHash: newHash });
    await publishEvent(new ApiKeyRegenerated(bot._id));
    
    return { apiKey: newKey }; // One-time display
  }
});
```

### Protected Routes
- `GET /api/bots/me` - Get own profile
- `PATCH /api/bots/me/profile` - Update profile
- `POST /api/bots/me/regenerate-api-key` - Rotate key

## Implementation Notes

Security measures:
- Constant-time comparison for key verification
- Rate limiting prevents brute force
- API keys never logged or returned after rotation
- Audit trail for all authentication events

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706701200
```

## Related Documentation

- [Authentication Design](./../plans/2026-01-31-bot-authentication-design.md)
- [API Security](./../adrs/adr-008-api-security.md)
- [Rate Limiting ADR](./../adrs/adr-010-rate-limiting.md)

## Verification

Authentication test:
```bash
# Test authentication
curl -X GET /api/bots/me \
  -H "Authorization: Bearer cm_sk_live_..."

# Test key rotation
curl -X POST /api/bots/me/regenerate-api-key \
  -H "Authorization: Bearer cm_sk_live_..."
```

---

## Agent Signature

| Agent | Action | Timestamp |
|-------|--------|-----------|
| @security-agent | Security Design | 2026-01-31T08:30:00Z |
| @ddd-aligner | Domain Model | 2026-01-31T09:00:00Z |
| @dev-agent | Backend | 2026-01-31T10:00:00Z |
| @arch-inspector | Reviewed | 2026-01-31T10:30:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
