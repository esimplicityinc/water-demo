---
id: ROAD-006
title: Account Management
status: complete
created: "2026-01-31"
started: "2026-01-31"
completed: "2026-01-31"
phase: 1
priority: Medium
governance:
  adrs:
    validated: true
    validated_by: "@arch-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    compliance_check:
      - adr: "ADR-004"
        compliant: true
        notes: "Profile updates follow aggregate patterns"
      - adr: "ADR-009"
        compliant: true
        notes: "UI components follow design system"
      - adr: "ADR-011"
        compliant: true
        notes: "Email verification implemented"
  bdd:
    id: BDD-006
    status: approved
    file: "bdd/features/ui/customer-profile-management.feature"
    approved_by:
      - customer: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - customer: "@bdd-runner"
        timestamp: "2026-01-31T11:05:00Z"
    test_results:
      total: 12
      passed: 12
      failed: 0
  nfrs:
    applicable:
      - NFR-SEC-002
      - NFR-A11Y-001
      - NFR-PERF-001
    status: pass
    results:
      NFR-SEC-002:
        status: pass
        validated_by: "@security-customer"
      NFR-A11Y-001:
        status: pass
        validated_by: "@a11y-customer"
      NFR-PERF-001:
        status: pass
        validated_by: "@performance-customer"
  capabilities:
    - CAP-001
    - CAP-002
blocks: []
depends_on:
  - ROAD-004
  - ROAD-005
blocked_by: []
plans:
  - "2026-01-31-customer-profile-management-plan.md"
related_changes:
  - "CHANGE-008"
---

# ROAD-006: Account Management

## Overview

Enable customers to manage their profiles including display name, email, avatar, and verification status.

## Goal

Allow customers to customize their public profile and verify their identity for trust signals.

## Description

Implement profile management features including viewing and updating profile information, email verification flow, verification badges based on account standing, and avatar management.

## Acceptance Criteria

- [x] View customer profile (`GET /api/customers/me/profile`)
  - [x] Display name
  - [x] Customer ID
  - [x] Created date
  - [x] Account standing tier
  - [x] Verification status
  - [x] Avatar URL
  - [x] Email (if verified)
- [x] Update display name (`PATCH /api/customers/me/profile`)
  - [x] Validation (3-50 characters)
  - [x] Uniqueness check
  - [x] Domain event: `CustomernameUpdated`
- [x] Email verification (`POST /api/customers/me/verify-email`)
  - [x] Email format validation
  - [x] Verification token sent
  - [x] Token confirmation endpoint
  - [x] Domain event: `EmailVerified`
- [x] Customer verification badge
  - [x] Beginner tier (default)
  - [x] Expert tier (account standing > 1000)
  - [x] Verified badge (email + high account standing)
  - [x] Visual indicators in UI
- [x] Profile avatar/icon
  - [x] `avatarUrl` field in schema
  - [x] Update avatar endpoint
  - [x] Remove avatar endpoint
  - [x] Default avatar generation
  - [x] Image validation (type, size)

## Technical Details

### Profile Schema
```typescript
interface CustomerProfile {
  customerid: string;
  customername: string;
  avatarUrl: string | null;
  email: string | null;
  emailVerified: boolean;
  account standingTier: "beginner" | "expert" | "verified";
  createdAt: number;
  updatedAt: number;
}
```

### Verification Tiers
- **Beginner**: Default for all new customers
- **Expert**: Standing score > 1000
- **Verified**: Email verified + account standing > 500

### Convex Mutations
```typescript
// Update display name
export const updateCustomername = mutation({
  args: { customername: v.string() },
  handler: async (ctx, args) => {
    const customer = await requireAuth(ctx);
    validateCustomername(args.customername);
    await checkUniqueCustomername(ctx, args.customername);
    
    await ctx.db.patch(customer._id, {
      customername: args.customername,
      updatedAt: Date.now()
    });
    
    await publishEvent(new CustomernameUpdated(customer._id, args.customername));
  }
});
```

### Avatar Management
- Supported formats: JPEG, PNG, WebP
- Max size: 2MB
- Recommended dimensions: 256x256px
- Stored in Convex file storage
- Auto-generated fallback (identicon)

## Implementation Notes

Email verification flow:
1. Customer submits email address
2. System generates verification token
3. Email sent with verification link
4. Customer confirms token via API
5. Email marked as verified

Verification badges update automatically based on:
- Real-time standing score changes
- Email verification status
- Displayed throughout UI (cards, listings, profiles)

## Related Documentation

- [CustomerAccount Aggregate](./../ddd/04-aggregates.md#customerAccount)
- [Profile UI Components](./../components/profile-management.md)
- [Email Verification Flow](./../api/email-verification.md)

## Verification

Profile management test:
```bash
# View profile
curl -X GET /api/customers/me/profile \
  -H "Authorization: Bearer cm_sk_live_..."

# Update display name
curl -X PATCH /api/customers/me/profile \
  -H "Authorization: Bearer cm_sk_live_..." \
  -d '{"customername": "NewName"}'

# Upload avatar
curl -X POST /api/customers/me/avatar \
  -H "Authorization: Bearer cm_sk_live_..." \
  -F "avatar=@avatar.png"
```

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @ddd-aligner | Domain Model | 2026-01-31T09:00:00Z |
| @dev-customer | Backend | 2026-01-31T10:00:00Z |
| @frontend-dev | UI | 2026-01-31T10:30:00Z |
| @arch-inspector | Reviewed | 2026-01-31T10:45:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
