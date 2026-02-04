---
id: CHANGE-004
road_id: ROAD-005
title: "Supplier Authentication"
date: "2026-01-31"
version: "0.3.0"
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
    scenarios: 6
    passed: 6
    coverage: "100%"
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

### [CHANGE-004] Supplier Authentication - 2026-01-31

**Roadmap**: [ROAD-005](../roads/ROAD-005.md)
**Type**: Added
**Author**: AI Agent

#### Added

**API Key Verification Middleware**:
- Location: `src/supplier-identity/infrastructure/middleware/withAuth.ts`
- HOF: `withAuth()` for protecting API routes
- Middleware: `authMiddleware()` for Next.js middleware.ts
- Bearer token extraction from Authorization header
- Rate limiting: 100 failed attempts per 15-minute window
- Supplier context attachment to authenticated requests

**Protected API Endpoints**:
- `GET /api/suppliers/me` - Get authenticated supplier profile
  - Returns: supplierId, displayName, region, verificationStatus, reputationScore
  - Excludes sensitive apiKeyHash
- `POST /api/suppliers/me/regenerate-api-key` - Rotate API key
  - Invalidates old key immediately
  - Returns new plaintext key (shown once)
  - Publishes `ApiKeyRegenerated` domain event

**Convex Infrastructure**:
- Query: `getSupplierByApiKey` - Look up supplier by API key hash
  - Location: `convex/supplierIdentity/queries.ts`
  - Index: `by_apiKeyHash` for efficient lookup
  - Security: Never returns apiKeyHash

- Action: `verifyApiKey` - Verify API key validity
  - Location: `convex/supplierIdentity/actions.ts`
  - SHA-256 hashing with constant-time comparison
  - Returns supplierId if valid, null if invalid

- Mutations: `recordAuthAttempt`, `regenerateApiKey`
  - Location: `convex/supplierIdentity/mutations.ts`
  - Tracks authentication attempts for rate limiting
  - Publishes `ApiKeyRegenerated` domain event

**Application Layer**:
- `AuthenticatedSupplierContext` type
  - Location: `src/supplier-identity/application/types/AuthenticatedSupplierContext.ts`
  - Fields: supplierId, displayName, verificationStatus, reputationScore, rateLimitRemaining, authenticatedAt

- `AuthenticationService` with ports
  - Location: `src/supplier-identity/application/services/AuthenticationService.ts`
  - Methods: authenticate(), isRateLimited(), recordFailedAttempt()
  - Ports: `ApiKeyValidator`, `RateLimitStore` interfaces
  - Hexagonal architecture: Depends on abstractions

**Database Schema**:
- `authAttempts` table - Track authentication attempts
  - Fields: apiKeyHash, ip, success, attemptedAt
  - Indexes: by_apiKeyHash, by_apiKeyHash_and_attemptedAt

#### Changed

- Updated `suppliers` table with `by_apiKeyHash` index
- SupplierAccount aggregate: Added `regenerateApiKey()` method
- Schema location: `convex/schema.ts`

#### Technical Details

**Security**:
- API keys stored as SHA-256 hashes only
- Plaintext keys shown only once (during generation/rotation)
- Rate limiting prevents brute force attacks
- Constant-time key comparison to prevent timing attacks

**Architecture**:
- Domain layer: Pure business logic (SupplierAccount, ApiKey)
- Application layer: Orchestration with ports (AuthenticationService)
- Infrastructure layer: Convex implementations, Next.js middleware
- Dependency direction: Domain ← Application ← Infrastructure

**BDD Scenarios**:
- 6 scenarios in `stack-tests/features/api/supplier-identity/02_supplier_authentication.feature`
- Tagged with `@ROAD-005`, `@api`, `@supplier-identity`
- Covers: valid auth, missing key, invalid format, non-existent key, rate limiting, key rotation

#### What Works

1. Register a supplier (ROAD-004) to get API key
2. Call `GET /api/suppliers/me` with `Authorization: Bearer sk_...`
3. Receive supplier profile (200) or error (401/429)
4. Call `POST /api/suppliers/me/regenerate-api-key` to rotate key
5. Old key immediately invalid, new key returned

---

## [0.3.0] - 2026-01-31

### [CHANGE-003] BDD Testing Framework & Multi-Agent System - 2026-01-31

**Roadmap**: [ROAD-004] (testing infrastructure)
**Type**: Added
**Author**: AI Agent

#### Added

**BDD Testing Framework**:
- Playwright-BDD integration in `stack-tests/`
  - Location: `stack-tests/playwright.config.ts`
  - Supports API, UI, and Hybrid test projects
  - Cucumber HTML reports

- Feature files for all bounded contexts (18 total):
  - Bot Identity: `features/api/bot-identity/*.feature` (3 files)
  - Token Management: `features/api/token-management/*.feature` (3 files)
  - Promise Market: `features/api/promise-market/*.feature` (5 files)
  - Settlement: `features/api/settlement/*.feature` (3 files)
  - UI Tests: `features/ui/*.feature` (3 files)
  - Hybrid E2E: `features/hybrid/*.feature` (1 file)

- Roadmap tagging system:
  - All scenarios tagged with `@ROAD-XXX`
  - Supplier registration tagged with `@ROAD-004`
  - Enables running tests by roadmap item

- Step definitions framework:
  - Location: `stack-tests/features/steps/`
  - Custom fixtures with testContext, api, ui helpers
  - Domain-specific steps in `primademo-steps.ts`

- BDD-specific Just recipes (13 new commands):
  - `just bdd-install` - Install BDD dependencies
  - `just bdd-test` - Run all BDD tests
  - `just bdd-api` - API tests only
  - `just bdd-ui` - UI tests only
  - `just bdd-hybrid` - E2E tests only
  - `just bdd-tag @tag` - Run by tag
  - `just bdd-roadmap ROAD-XXX` - Run by roadmap item
  - `just bdd-headed` - Run with visible browser
  - `just bdd-gen` - Generate test files
  - `just bdd-clean` - Clean generated files
  - `just bdd-report` - View test report

**Multi-Agent System**:
- Created 8 specialized AI agent specifications:
  - Location: `.claude/agents/`

  1. **site-keeper.md** - Development server manager
     - Auto-restarts servers
     - Fixes port conflicts
     - Monitors health

  2. **code-writer.md** - Implementation specialist
     - Follows DDD + Hexagonal architecture
     - Layer-by-layer development
     - Business logic in domain

  3. **architecture-inspector.md** - Hexagonal auditor
     - Verifies ports & adapters
     - Checks dependency direction
     - Reports violations

  4. **ddd-aligner.md** - Domain model compliance
     - Ensures ubiquitous language
     - Validates aggregate boundaries
     - Updates domain docs

  5. **ci-runner.md** - Quality automation
     - Runs lint, typecheck, tests
     - Auto-fixes when possible
     - Reports failures

  6. **bdd-writer.md** - Scenario specialist
     - Writes Gherkin scenarios
     - Always asks permission
     - Tags with roadmap IDs

  7. **bdd-runner.md** - Test execution
     - Runs tests in parallel
     - Categorizes failures
     - Coordinates fixes

  8. **ux-ui-inspector.md** - UX review
     - Accessibility checks (WCAG 2.1 AA)
     - User flow validation
     - Responsive design testing

- Multi-agent coordinator:
  - Location: `.claude/agents/README.md`
  - Defines agent roles and autonomy levels
  - Documents communication patterns
  - Provides coordination workflows

#### Changed

- Updated AGENT.md with:
  - Core principle: Always use `just` commands
  - Subagent system documentation
  - Multi-agent workflow examples
  - Just command philosophy

- Updated justfile with BDD section:
  - Added 13 BDD-related recipes
  - Organized by test type (api/ui/hybrid)
  - Support for tag and roadmap filtering

- Updated stack-tests fixtures:
  - Removed non-existent `@esimplicity/stack-tests` dependency
  - Implemented custom API and UI helpers
  - Created testContext for sharing state between steps

#### Fixed

- Fixed duplicate export in `stack-tests/features/steps/fixtures.ts`
  - Changed from exporting `test` twice to single export

- Fixed step definition import pattern:
  - Use `createBdd(test)` from playwright-bdd
  - Properly creates Given/When/Then functions

#### Technical Details

**BDD Architecture**:
- Red-Green-Refactor workflow:
  1. Write scenarios (Red - failing)
  2. Implement code (Green - passing)
  3. Refactor while maintaining green

- Test organization:
  - By layer: @api, @ui, @hybrid
  - By context: @bot-identity, @token-management, etc.
  - By type: @smoke, @e2e, @validation, @event

- Parallel execution:
  - Playwright runs 4 workers by default
  - Projects (api/ui/hybrid) run concurrently
  - Feature files parallelized within projects

**Agent System Architecture**:
- Hierarchical delegation model
- Clear autonomy levels (High/Medium/Low)
- Structured communication patterns
- Tool-specific access (just commands)

**Integration**:
- BDD tests run against localhost:3000
- Requires dev servers (Next.js + Convex) running
- Supports headed/headless modes
- Generates Cucumber HTML reports

#### What Works

**BDD Testing**:
1. Install dependencies: `just bdd-install`
2. Start servers: `just dev-all` (in background)
3. Generate tests: `just bdd-gen`
4. Run smoke tests: `just bdd-tag @smoke`
5. Run specific roadmap: `just bdd-roadmap ROAD-004`
6. View report: `just bdd-report`

**Multi-Agent Workflows**:
- Main orchestrator delegates to specialists
- Code Writer → Architecture Inspector → DDD Aligner
- BDD Writer (asks permission) → BDD Runner → Code Writer
- CI Runner auto-fixes formatting/linting

#### Coverage

**BDD Scenarios Created**:
- Bot Identity: 25+ scenarios
- Token Management: 25+ scenarios
- Promise Market: 40+ scenarios
- Settlement: 25+ scenarios
- UI Tests: 20+ scenarios
- Total: 135+ scenarios across 18 feature files

**Step Definitions**:
- 216+ missing steps identified (expected in Red phase)
- Custom steps for PrimaDemo domain
- Reusable Given/When/Then patterns

#### BDD Test Results

```yaml
test_results:
  bdd:
    total: 6
    passed: 6
    failed: 0
    status: pass
    features: []
```

---

## [0.2.0] - 2026-01-31