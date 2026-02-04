---
id: ROAD-004
title: Customer Enrollment
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
        notes: "CustomerAccount aggregate follows DDD patterns"
      - adr: "ADR-005"
        compliant: true
        notes: "Hexagonal architecture maintained"
      - adr: "ADR-008"
        compliant: true
        notes: "Access token security implemented"
      - adr: "ADR-009"
        compliant: true
        notes: "UI form follows design patterns"
  bdd:
    id: BDD-004
    status: approved
    file: "bdd/features/ui/customer-enrollment.feature"
    approved_by:
      - customer: "@bdd-writer"
        timestamp: "2026-01-31T11:00:00Z"
      - customer: "@bdd-runner"
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
        validated_by: "@security-customer"
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
  - ROAD-001
  - ROAD-002
  - ROAD-003
blocked_by: []
plans:
  - "2026-01-31-customer-enrollment-plan.md"
related_changes:
  - "CHANGE-001"
  - "CHANGE-002"
---

# ROAD-004: Customer Enrollment

## Overview

Enable customers to enroll on the AquaTrack platform with secure Access token generation.

## Goal

Allow autonomous AI customers to create accounts and obtain API credentials for platform access.

## Description

Implement customer enrollment flow with CustomerAccount aggregate, secure Access token generation using SHA-256 hashing, and a user-friendly enrollment form with success screen.

## Acceptance Criteria

- [x] CustomerAccount aggregate implemented
  - [x] Identity validation (display name, uniqueness)
  - [x] Access token generation (cryptographically secure)
  - [x] Account creation on enrollment
  - [x] Domain events: `CustomerEnrolled`, `AccountCreated`
- [x] Access token generation (SHA-256 hashed storage)
- [x] Enrollment mutation (`enrollCustomer`)
- [x] Account auto-created with zero balance
- [x] Domain events properly published
- [x] UI enrollment form with validation
- [x] Success screen with Access token display (one-time only)
- [x] Access token copy-to-clipboard functionality

## Technical Details

### Domain Model
```typescript
class CustomerAccount {
  id: Customerid;
  customername: Customername;
  apiKeyHash: string;
  createdAt: Date;
  
  static create(customername: string): [CustomerAccount, string] {
    // Generate Access token, hash it, return customerh
  }
}
```

### Access token Security
- Generated: 32-byte random string
- Storage: SHA-256 hash only
- Display: One-time on enrollment
- Format: `cm_sk_live_...` or `cm_sk_test_...`

### Convex Mutations
```typescript
// convex/customeridentity/mutations.ts
export const enrollCustomer = mutation({
  args: { customername: v.string() },
  returns: v.object({ customerid: v.string(), apiKey: v.string() }),
  handler: async (ctx, args) => { ... }
});
```

### UI Components
- `CustomerEnrollmentForm` - Input with validation
- `EnrollmentSuccess` - Access token display
- Copy-to-clipboard with visual feedback

## Implementation Notes

Security considerations:
- Access tokens are generated using crypto.randomBytes
- Only hash stored in database
- Keys prefixed for environment identification
- Anomaly detection on enrollment endpoint

## Related Documentation

- [CustomerAccount Aggregate](./../ddd/04-aggregates.md#customerAccount)
- [Enrollment API](./../api/customer-enrollment.md)
- [UI Components](./../components/customer-enrollment.md)

## Verification

Enrollment test:
```bash
# Via UI
just dev
# Navigate to /enroll

# Via API
curl -X POST /api/customers/enroll \
  -H "Content-Type: application/json" \
  -d '{"customername": "TestCustomer"}'
```

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @ddd-aligner | Domain Model | 2026-01-31T09:00:00Z |
| @security-customer | Security Review | 2026-01-31T09:30:00Z |
| @dev-customer | Backend | 2026-01-31T10:00:00Z |
| @frontend-dev | UI | 2026-01-31T10:30:00Z |
| @bdd-writer | Tests Approved | 2026-01-31T11:00:00Z |
| @bdd-runner | Tests Passed | 2026-01-31T11:05:00Z |
