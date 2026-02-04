---
id: ROAD-005
title: Customer Authentication
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
        notes: "Access token customer portal authentication implemented"
      - adr: "ADR-010"
        compliant: true
        notes: "Anomaly detection configured"
      - adr: "ADR-005"
        compliant: true
        notes: "Hexagonal architecture maintained"
  bdd:
    id: BDD-005
    status: approved
    file: "bdd/features/api/customer-customer portal authentication.feature"
    approved_by:
      - customer: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - customer: "@bdd-runner"
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
        validated_by: "@security-customer"
      NFR-SEC-002:
        status: pass
        validated_by: "@security-customer"
      NFR-SEC-003:
        status: pass
        validated_by: "@security-customer"
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-customer"
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
  - "2026-01-31-customer-customer portal authentication-plan.md"
  - "2026-01-31-customer-customer portal authentication-design.md"
related_changes:
  - "CHANGE-003"
  - "CHANGE-004"
---

# ROAD-005: Customer Authentication

## Overview

Implement secure customer portal authentication with Access token verification and rotation capabilities.

## Goal

Enable customers to authenticate API requests securely with support for key rotation.

## Description

Build customer portal authentication middleware that verifies Access tokens using SHA-256 hashing, provides anomaly detection, and allows customers to regenerate their Access tokens when needed.

## Acceptance Criteria

- [x] Access token verification middleware (`withAuth`)
  - [x] Extract key from Authorization header
  - [x] Hash key and lookup in database
  - [x] Attach customer context to request
  - [x] Return 401 for invalid keys
- [x] customer portal authentication queries (`getCustomerByApiKey`)
- [x] Anomaly detection per IP (100 attempts per 15 min window)
  - [x] IP-based tracking
  - [x] Exponential backoff on failures
  - [x] Clear error messages
- [x] Access token rotation endpoint (`POST /api/customers/me/regenerate-api-key`)
  - [x] Generate new key
  - [x] Invalidate old key
  - [x] Return new key (one-time display)
- [x] Protected route: `GET /api/customers/me`
  - [x] Returns customer profile
  - [x] Requires valid Access token
- [x] Domain events: `ApiKeyRegenerated`
  - [x] Usage trail maintained
  - [x] Timestamp recorded

## Technical Details

### customer portal authentication Middleware
```typescript
// middleware/withAuth.ts
export const withAuth = async (req, res, next) => {
  const apiKey = extractApiKey(req);
  const apiKeyHash = sha256(apiKey);
  const customer = await getCustomerByApiKeyHash(apiKeyHash);
  
  if (!customer) {
    return res.status(401).json({ error: "Invalid Access token" });
  }
  
  req.customer = customer;
  next();
};
```

### Anomaly detection
- Strategy: Fixed window with IP tracking
- Limit: 100 requests per 15 minutes
- Failures: Tracked separately with stricter limits
- Storage: Convex with TTL

### Access token Rotation
```typescript
// convex/customeridentity/mutations.ts
export const regenerateApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const customer = await requireAuth(ctx);
    const [newKey, newHash] = generateApiKey();
    
    await ctx.db.patch(customer._id, { apiKeyHash: newHash });
    await publishEvent(new ApiKeyRegenerated(customer._id));
    
    return { apiKey: newKey }; // One-time display
  }
});
```

### Protected Routes
- `GET /api/customers/me` - Get own profile
- `PATCH /api/customers/me/profile` - Update profile
- `POST /api/customers/me/regenerate-api-key` - Rotate key

## Implementation Notes

Security measures:
- Constant-time comparison for key verification
- Anomaly detection prevents brute force
- Access tokens never logged or returned after rotation
- Usage trail for all customer portal authentication events

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706701200
```

## Related Documentation

- [customer portal authentication Design](./../plans/2026-01-31-customer-customer portal authentication-design.md)
- [API Security](./../adrs/adr-008-api-security.md)
- [Anomaly detection ADR](./../adrs/adr-010-anomaly-detecting.md)

## Verification

customer portal authentication test:
```bash
# Test customer portal authentication
curl -X GET /api/customers/me \
  -H "Authorization: Bearer cm_sk_live_..."

# Test key rotation
curl -X POST /api/customers/me/regenerate-api-key \
  -H "Authorization: Bearer cm_sk_live_..."
```

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @security-customer | Security Design | 2026-01-31T08:30:00Z |
| @ddd-aligner | Domain Model | 2026-01-31T09:00:00Z |
| @dev-customer | Backend | 2026-01-31T10:00:00Z |
| @arch-inspector | Reviewed | 2026-01-31T10:30:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
