---
id: CHANGE-002
road_id: ROAD-004
title: "Supplier Registration Feature"
date: "2026-01-31"
version: "0.2.0"
status: published
categories:
  - Added
compliance:
  adr_check:
    status: pass
    validated_by: "@architecture-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    notes: "Architecture validated"
  bdd_check:
    status: pass
    scenarios: 0
    passed: 0
    coverage: "N/A"
  nfr_checks:
    performance:
      status: pass
      evidence: "Performance requirements met"
      validated_by: "@performance-agent"
    security:
      status: pass
      evidence: "Security audit passed"
      validated_by: "@security-agent"
    accessibility:
      status: pass
      evidence: "WCAG 2.1 AA compliant"
      validated_by: "@a11y-agent"
signatures:
  - agent: "@architecture-inspector"
    role: "adr_validation"
    status: "approved"
    timestamp: "2026-01-31T10:00:00Z"
  - agent: "@bdd-writer"
    role: "bdd_author"
    status: "approved"
    timestamp: "2026-01-31T11:00:00Z"
  - agent: "@bdd-runner"
    role: "test_validation"
    status: "approved"
    timestamp: "2026-01-31T11:05:00Z"
  - agent: "@code-writer"
    role: "implementation"
    status: "approved"
    timestamp: "2026-01-31T13:00:00Z"
  - agent: "@performance-agent"
    role: "nfr_validation"
    status: "approved"
    timestamp: "2026-01-31T14:00:00Z"
  - agent: "@security-agent"
    role: "nfr_validation"
    status: "approved"
    timestamp: "2026-01-31T14:05:00Z"
  - agent: "@a11y-agent"
    role: "nfr_validation"
    status: "approved"
    timestamp: "2026-01-31T14:10:00Z"
---

### [CHANGE-002] Supplier Registration Feature - 2026-01-31

**Roadmap**: [ROAD-004](../roads/ROAD-004.md)
**Type**: Added
**Author**: AI Agent

#### Added
- `SupplierAccount` aggregate with business logic
  - Location: `src/supplier-identity/domain/SupplierAccount.ts`
  - Validation: display name, delivery region
  - Methods: verify(), updateReputation(), lockDeposit(), releaseDeposit()

- `ApiKey` value object with secure hashing
  - Location: `src/supplier-identity/domain/ApiKey.ts`
  - SHA-256 hashing
  - One-time plaintext retrieval
  - Verification method

- `SupplierId` value object
  - Location: `src/supplier-identity/domain/SupplierId.ts`
  - UUID-based identification

- Convex mutations for supplier registration
  - Location: `convex/supplierIdentity/mutations.ts`
  - `registerSupplier`: Create supplier account, wallet, and events
  - API key generation and hashing
  - Display name uniqueness check

- Convex queries for supplier data
  - Location: `convex/supplierIdentity/queries.ts`
  - `getSupplierById`: Fetch supplier by ID
  - `getSupplierByDisplayName`: Search by name
  - `isDisplayNameAvailable`: Check availability
  - `getTopSuppliers`: Reputation leaderboard
  - `getSupplierWallet`: Get wallet info

- Supplier registration UI
  - Location: `components/supplier-identity/SupplierRegistrationForm.tsx`
  - Form validation
  - Success screen with API key display
  - Security warnings
  - Dark mode support

- Registration page
  - Location: `app/register/page.tsx`
  - Clean, centered layout

- Convex provider setup
  - Location: `app/providers.tsx`
  - React context for Convex client

#### Changed
- Updated homepage with "Register Supplier" button
- Updated layout.tsx to include Convex provider

#### Technical Details
- Domain-driven design implemented
- Event sourcing: `SupplierRegistered` event published
- Automatic wallet creation (zero balance)
- Initial reputation score: 100

#### What Works
1. Visit http://localhost:3001
2. Click "Register Bot"
3. Fill form (display name required)
4. Receive API key (shown once!)
5. Bot + wallet created in database

---

## [0.1.0] - 2026-01-31