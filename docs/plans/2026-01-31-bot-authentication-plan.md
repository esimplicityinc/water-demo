---
title: ROAD-005 Implementation Plan
---

# ROAD-005 Implementation Plan

**Date**: 2026-01-31  
**Roadmap Item**: ROAD-005  
**Design**: [2026-01-31-bot-authentication-design.md](./2026-01-31-bot-authentication-design.md)

---

## Task Breakdown

### Task 1: Update BDD Scenarios (5 min)
**Agent**: @bdd-writer  
**Files**: `stack-tests/features/api/bot-identity/02_bot_authentication.feature`

- [ ] Review existing scenarios against design
- [ ] Update @pending tags to reflect implementation order
- [ ] Add any missing edge cases if identified
- [ ] Verify step definitions exist or can be created

**Verification**: All scenarios are clear and implementable

---

### Task 2: Create Application Types (5 min)
**Agent**: @code-writer  
**Files**: `src/bot-identity/application/types/AuthenticatedBotContext.ts`

- [ ] Create `AuthenticatedBotContext` interface with:
  - botId: string
  - displayName: string
  - verificationStatus: string
  - reputationScore: number
  - rateLimitRemaining: number
  - authenticatedAt: Date

**Verification**: Type compiles without errors

---

### Task 3: Create Authentication Service (10 min)
**Agent**: @code-writer  
**Files**: `src/bot-identity/application/services/AuthenticationService.ts`

- [ ] Create `AuthenticationService` class
- [ ] Implement `authenticate(apiKey: string)` method:
  - Returns `Promise&lt;AuthenticatedBotContext | null&gt;`
  - Calls convex to verify key
  - Handles rate limiting checks
- [ ] Implement `isRateLimited(identifier: string)` method
- [ ] Implement `recordFailedAttempt(identifier: string)` method

**Verification**: Service compiles and has no external dependencies (pure domain logic)

---

### Task 4: Create Convex Query - getBotByApiKey (5 min)
**Agent**: @code-writer  
**Files**: `convex/botIdentity/queries.ts`

- [ ] Add `getBotByApiKey` query:
  - Input: apiKeyHash: string
  - Returns: Bot document or null
  - Uses index lookup
  - Excludes apiKeyHash from return

**Verification**: Query is registered and type-safe

---

### Task 5: Create Convex Action - verifyApiKey (10 min)
**Agent**: @code-writer  
**Files**: `convex/botIdentity/actions.ts` (new file)

- [ ] Create new actions file
- [ ] Add `verifyApiKey` action:
  - Input: plainApiKey: string
  - Hash the key using SHA-256
  - Query for bot by hash
  - Return botId if found, null if not
  - Constant-time comparison (already in ApiKey domain)

**Verification**: Action is registered and works end-to-end

---

### Task 6: Create Convex Mutation - recordAuthAttempt (5 min)
**Agent**: @code-writer  
**Files**: `convex/botIdentity/mutations.ts`

- [ ] Add `recordAuthAttempt` mutation:
  - Input: apiKey: string, success: boolean, ip?: string
  - Store in authAttempts table (create if not exists)
  - Track timestamp, success/failure

**Verification**: Mutation works and data is stored

---

### Task 7: Create Convex Mutation - regenerateApiKey (10 min)
**Agent**: @code-writer  
**Files**: `convex/botIdentity/mutations.ts`

- [ ] Add `regenerateApiKey` mutation:
  - Input: botId (from authenticated context)
  - Verify bot exists
  - Generate new API key (use existing generateApiKey function)
  - Update bot record with new hash
  - Return plaintext key (only time it's shown)
  - Publish `ApiKeyRegenerated` domain event

**Verification**: Old key no longer works, new key works

---

### Task 8: Update Schema for Auth Attempts (5 min)
**Agent**: @code-writer  
**Files**: `convex/schema.ts`

- [ ] Add `authAttempts` table:
  - apiKeyHash: string (indexed)
  - ip: optional string
  - success: boolean
  - attemptedAt: number
  - Index by apiKeyHash + attemptedAt

**Verification**: Schema compiles and deploys

---

### Task 9: Create withAuth Middleware (10 min)
**Agent**: @code-writer  
**Files**: `src/bot-identity/infrastructure/middleware/withAuth.ts`

- [ ] Create Next.js middleware/HOC
- [ ] Extract Bearer token from Authorization header
- [ ] Call convex.verifyApiKey
- [ ] On success: attach bot context to request
- [ ] On failure: return 401 with appropriate error message
- [ ] Handle rate limiting (429 response)

**Verification**: Middleware can be applied to API routes

---

### Task 10: Create GET /api/bots/me Route (10 min)
**Agent**: @code-writer  
**Files**: `app/api/bots/me/route.ts`

- [ ] Create Next.js API route
- [ ] Apply withAuth middleware
- [ ] Return bot profile (exclude apiKeyHash)
- [ ] Handle 401/429 errors

**Verification**: Route returns correct data with valid key, 401 without

---

### Task 11: Create POST /api/bots/me/regenerate-api-key Route (10 min)
**Agent**: @code-writer  
**Files**: `app/api/bots/me/regenerate-api-key/route.ts`

- [ ] Create Next.js API route
- [ ] Apply withAuth middleware
- [ ] Call convex.regenerateApiKey
- [ ] Return new API key in response

**Verification**: Route regenerates key and invalidates old one

---

### Task 12: Verify Hexagonal Architecture (10 min)
**Agent**: @architecture-inspector

- [ ] Check domain layer has no infrastructure imports
- [ ] Verify application services use repository ports
- [ ] Confirm dependency direction (domain ← application ← infrastructure)
- [ ] Validate ports are properly defined

**Verification**: Architecture report shows no violations

---

### Task 13: Verify Domain Alignment (10 min)
**Agent**: @ddd-aligner

- [ ] Check ubiquitous language consistency
- [ ] Verify aggregate boundaries
- [ ] Validate domain event names
- [ ] Confirm BotAccount logic is correct

**Verification**: Domain alignment report shows compliance

---

### Task 14: Run BDD Tests (15 min)
**Agent**: @bdd-runner

- [ ] Start dev servers if not running
- [ ] Execute all bot authentication scenarios
- [ ] Report pass/fail for each scenario
- [ ] Fix any failing tests

**Verification**: All 6 scenarios pass

---

### Task 15: Run CI Checks (5 min)
**Agent**: @ci-runner

- [ ] Run lint check
- [ ] Run TypeScript typecheck
- [ ] Run unit tests
- [ ] Verify format

**Verification**: All CI checks pass

---

## Execution Order

```
Phase 1: Infrastructure Setup
├── Task 8: Update Schema
├── Task 4: getBotByApiKey Query
├── Task 5: verifyApiKey Action
├── Task 6: recordAuthAttempt Mutation
└── Task 7: regenerateApiKey Mutation

Phase 2: Application Layer
├── Task 2: Application Types
└── Task 3: Authentication Service

Phase 3: API Layer
├── Task 9: withAuth Middleware
├── Task 10: GET /api/bots/me
└── Task 11: POST regenerate-api-key

Phase 4: Quality Gates
├── Task 1: Update BDD Scenarios
├── Task 12: Architecture Review
├── Task 13: Domain Alignment
├── Task 14: BDD Tests
└── Task 15: CI Checks
```

## Dependencies

- Task 3 depends on Task 2 (types)
- Task 5 depends on Task 4 (query)
- Task 9 depends on Task 5 (action)
- Task 10,11 depend on Task 9 (middleware)
- Tasks 12-15 can run in parallel after implementation

## Success Criteria

- ✅ All 6 BDD scenarios pass
- ✅ GET /api/bots/me returns authenticated bot profile
- ✅ POST regenerate-api-key works and invalidates old key
- ✅ Rate limiting enforced after 100 failed attempts
- ✅ Architecture review passes
- ✅ Domain alignment verified
- ✅ CI checks all green

## Estimated Total Time: 2-3 hours
