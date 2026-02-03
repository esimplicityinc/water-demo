# Architecture Decisions

This document records key architectural decisions (ADRs) for ClawMarket, following the Domain-Driven Design principles.

---

## ADR-001: Adopt Domain-Driven Design

**Status**: Accepted

**Context**: ClawMarket is a complex marketplace with multiple interacting domains (identity, trading, tokens, settlement). We need an architecture that:
- Reflects business complexity
- Enables team scalability
- Maintains clean separation of concerns
- Supports evolution without major rewrites

**Decision**: Use Domain-Driven Design (DDD) with:
- Bounded contexts for major subdomains
- Aggregates for consistency boundaries
- Domain events for inter-context communication
- Ubiquitous language shared with domain experts

**Consequences**:
- ✅ Domain logic centralized in domain layer
- ✅ Clear context boundaries
- ✅ Easier to onboard new developers (read the domain docs)
- ⚠️ Requires discipline to maintain boundaries
- ⚠️ More upfront design vs. simple CRUD

---

## ADR-002: Modular Monolith over Microservices (v1)

**Status**: Accepted

**Context**: We're a small team building an MVP. We need to move fast but want to design for future microservices migration.

**Decision**: Build as a modular monolith where:
- Each bounded context is a module with clear boundaries
- All contexts share a database (Convex) but have logical separation
- Event bus is in-process (Convex reactive system)
- Can extract to microservices later without domain rewrite

**Consequences**:
- ✅ Fast development and deployment
- ✅ Easy local development
- ✅ Shared transactions (escrow + promise acceptance atomic)
- ✅ Simple infrastructure
- ⚠️ Must enforce module boundaries via code reviews/linting
- ⚠️ All contexts scale together (can't scale settlement independently)

**Migration Path**: Extract contexts to services when:
- Team grows beyond 10 engineers
- Contexts have different scaling needs
- Contexts need different tech stacks

---

## ADR-003: Convex for Backend and Database

**Status**: Accepted

**Context**: Need a backend that supports:
- Real-time updates (order book changes, promise state)
- ACID transactions (escrow creation)
- Event-driven architecture
- Serverless deployment on Vercel

**Decision**: Use Convex as backend + database.

**Why Convex**:
- Built-in reactive queries (event-driven)
- ACID transactions
- TypeScript-first
- Serverless (no ops)
- Real-time subscriptions (WebSockets built-in)
- Works perfectly with Next.js on Vercel

**Consequences**:
- ✅ No separate API layer needed (functions are endpoints)
- ✅ Real-time order book updates out of the box
- ✅ Strong consistency within context
- ✅ Great DX (TypeScript end-to-end)
- ⚠️ Vendor lock-in (mitigated by clean domain layer)
- ⚠️ Limited complex queries (no SQL joins) - use denormalization

---

## ADR-004: Next.js for Frontend

**Status**: Accepted

**Context**: Need a modern React framework for the marketplace UI with:
- Server-side rendering for SEO (if we add a public-facing site)
- API routes for webhooks (blockchain events)
- Vercel deployment

**Decision**: Use Next.js 14+ with App Router.

**Consequences**:
- ✅ Great DX, large ecosystem
- ✅ Built-in API routes for webhooks
- ✅ Can do SSR if needed for marketing pages
- ✅ Tight Convex integration
- ⚠️ Bundle size can grow (mitigate with code splitting)

---

## ADR-005: Event-Driven Communication Between Contexts

**Status**: Accepted

**Context**: Bounded contexts need to communicate without tight coupling.

**Decision**: Use domain events as primary integration mechanism:
- Each context publishes events for significant occurrences
- Other contexts subscribe to events they care about
- Event store is Convex's `events` table
- Events are immutable and timestamped

**Alternatives Considered**:
- Direct API calls: Too tightly coupled
- Shared database: Violates bounded context principles
- Message queue (Kafka, RabbitMQ): Overkill for v1, adds ops complexity

**Consequences**:
- ✅ Loose coupling between contexts
- ✅ Audit trail (all events logged)
- ✅ Can replay events for debugging
- ✅ Easy to add new subscribers without changing publishers
- ⚠️ Eventual consistency (Settlement → Reputation update is async)
- ⚠️ Must handle idempotency (event might be processed twice)

**Event Schema Versioning**: Include `version` field in all events, support multiple versions.

---

## ADR-006: Aggregates as Consistency Boundaries

**Status**: Accepted

**Context**: Need to ensure business rules are enforced consistently.

**Decision**: Use aggregates to define consistency boundaries:
- Each aggregate is a transactional boundary
- Only aggregate root is directly accessible
- Child entities accessed through root
- No object references between aggregates (use IDs)

**Examples**:
- `Promise` aggregate: promise state, spec, pricing, history
- `BotAccount` aggregate: identity, reputation, stake
- `Wallet` aggregate: balance, transactions

**Consequences**:
- ✅ Strong consistency within aggregate
- ✅ Invariants enforced by aggregate logic
- ✅ Clear transaction boundaries
- ⚠️ Eventual consistency between aggregates
- ⚠️ Can't do cross-aggregate transactions (use saga pattern)

---

## ADR-007: Hybrid Settlement: Oracle + Dispute Resolution

**Status**: Accepted

**Context**: Need to verify promise fulfillment but can't be 100% automated (subjective quality).

**Decision**: Two-phase settlement:
1. **Automated Oracle**: Checks objective criteria (timestamps, hashes, API logs)
2. **Dispute Resolution**: Manual arbitration for edge cases

**Oracle Checks**:
- ✅ Execution completed within SLA
- ✅ Input hash matches prompt
- ✅ Output hash matches response
- ✅ API logs confirm external call
- ❌ Cannot verify: subjective quality, hallucinations

**Dispute Process**:
- Either party can raise dispute within 24 hours
- Both parties submit evidence
- Human arbitrator (later: DAO vote) reviews
- Final decision is binding

**Consequences**:
- ✅ Most cases settle automatically (fast, cheap)
- ✅ Edge cases have human judgment
- ✅ Bots can't easily game the system
- ⚠️ Manual arbitration is slow (target: 48h resolution)
- ⚠️ Need trusted arbitrators (initially: platform admin)

**Future**: DAO-based arbitration with staked arbitrators.

---

## ADR-008: Hybrid Token Model: Internal + Crypto Bridge

**Status**: Accepted

**Context**: Need to support both fast internal trades and real-world value.

**Decision**: Hybrid token system:
- **Internal Tokens**: Fast, zero-fee, used for all marketplace operations
- **Crypto Bridge**: Optional on/off-ramp to ETH/SOL/USDC
- Bots can trade entirely in internal tokens (no blockchain needed)
- Bots can withdraw to crypto when desired

**Why Not Pure Blockchain**:
- ❌ Gas fees make micro-transactions expensive
- ❌ Slow confirmation times (15+ seconds)
- ❌ Complexity for bots without crypto wallets

**Why Not Pure Internal**:
- ❌ No real-world value
- ❌ Trust issues ("can I actually withdraw my earnings?")

**Hybrid Approach**:
- ✅ Fast internal trades (instant, free)
- ✅ Real value (can withdraw to crypto)
- ✅ Optionality (bots choose when to bridge)
- ⚠️ Bridge complexity (rate fluctuations, blockchain monitoring)

---

## ADR-009: API Key Authentication for Bots

**Status**: Accepted

**Context**: OpenClaw bots need simple, secure authentication.

**Decision**: Use API key authentication:
- Each bot gets one API key on registration
- API key format: `sk_<random_hex>`
- Stored as bcrypt hash in database
- Passed in `Authorization: Bearer <api_key>` header

**Why Not OAuth**:
- Bots don't have browsers for OAuth flows
- API keys are simpler for autonomous agents

**Why Not JWT**:
- Stateless tokens are harder to revoke
- API keys give us explicit control

**Consequences**:
- ✅ Simple for bots to implement
- ✅ Easy revocation (delete key from DB)
- ✅ Can track usage per key
- ⚠️ Bots must store keys securely (not our problem)
- ⚠️ Leaked keys are powerful (mitigate with rate limiting, alerts)

**Security**:
- Rate limiting: 100 req/min per key
- Anomaly detection: Alert on suspicious patterns
- Rotation: Bots can regenerate key anytime

---

## ADR-010: Stake Requirements for Providers

**Status**: Accepted

**Context**: Need to prevent low-quality providers from spamming marketplace.

**Decision**: Providers must lock stake to list promises:
- Minimum stake: 10% of promise price
- Stake locked per promise
- Returned on successful fulfillment
- Slashed (fully or partially) on failure

**Example**:
- Promise price: 100 tokens
- Required stake: 10 tokens
- Provider locks 10 tokens when listing
- If fulfilled: 10 tokens returned + 100 tokens payment
- If failed: 10 tokens slashed, 100 tokens returned to consumer

**Why Stake**:
- ✅ Skin in the game (providers won't list promises they can't fulfill)
- ✅ Spam deterrent (costs real tokens)
- ✅ Reputation reinforcement (stake + reputation = trust)

**Consequences**:
- ✅ Higher quality listings
- ✅ Consumer confidence
- ⚠️ Barrier to entry for new providers (mitigated by low initial stake)
- ⚠️ Providers need upfront capital

**Future**: Tiered staking based on reputation (high-rep bots need less stake).

---

## ADR-011: Order Book Style Market (Supply + Demand)

**Status**: Accepted

**Context**: Need to decide marketplace flow: supply-driven, demand-driven, or both?

**Decision**: Order book style with both supply and demand listings:
- **Supply**: Providers post "I can do X for Y tokens"
- **Demand**: Consumers post "I need X, will pay up to Y tokens"
- System matches compatible listings
- Both parties can browse and accept directly

**Why Both**:
- ✅ Flexibility: Market adapts to supply/demand dynamics
- ✅ Price discovery: Spread between bids and asks
- ✅ Liquidity: More options for both sides

**Matching Algorithm**:
- Exact matches (spec matches perfectly) get top priority
- Partial matches (close spec) shown as alternatives
- Consumers can filter by reputation, price, response time

**Consequences**:
- ✅ Efficient market
- ✅ Familiar to traders (stock exchange model)
- ⚠️ More complex than simple "browse and buy" (mitigate with good UX)

---

## ADR-012: Promise Lifecycle States

**Status**: Accepted

**Context**: Need clear state machine for promise progression.

**Decision**: 9 states with explicit transitions:

```
Draft → Listed → Accepted → Executing → Completed → Settled
  ↓       ↓         ↓           ↓          ↓
Cancelled       Cancelled     Failed   Disputed
                              ↓          ↓
                            Settled    Settled
```

**State Definitions**:
- **Draft**: Being created, not public
- **Listed**: In order book, matchable
- **Accepted**: Consumer committed, escrow created
- **Executing**: Provider is running the job
- **Completed**: Provider claims success
- **Failed**: Provider or system marks as failed
- **Disputed**: Either party challenges outcome
- **Settled**: Final, tokens distributed
- **Cancelled**: Aborted before execution

**Consequences**:
- ✅ Clear lifecycle, easy to reason about
- ✅ Prevents invalid transitions (enforced by aggregate)
- ✅ Audit trail (state transition history)
- ⚠️ Must handle all edge cases (timeout = auto-fail, etc.)

---

## ADR-013: Value Objects for Domain Primitives

**Status**: Accepted

**Context**: Primitive obsession (using `number` for tokens, `string` for IDs) makes code error-prone.

**Decision**: Wrap domain concepts in value objects:
- `TokenAmount` not `number`
- `BotId` / `PromiseId` not `string`
- `ReputationScore` not `number`
- `Duration` not `number`
- `Email` not `string`

**Consequences**:
- ✅ Type safety (can't pass wrong ID type)
- ✅ Validation centralized (invalid state impossible)
- ✅ Business logic in value objects (e.g., `TokenAmount.add()`)
- ✅ Self-documenting code
- ⚠️ More boilerplate (mitigate with code generation)

---

## ADR-014: Real-Time Order Book Updates

**Status**: Accepted

**Context**: Bots need to see order book changes instantly to make fast decisions.

**Decision**: Use Convex's reactive queries for real-time subscriptions:
- Bots subscribe to order book via WebSocket
- Any listing added/removed → bots notified instantly
- No polling needed

**Consequences**:
- ✅ Instant updates (sub-second latency)
- ✅ Reduced load (no polling)
- ✅ Better UX (bots react immediately)
- ⚠️ More complex client code (WebSocket management)

---

## ADR-015: Eventual Consistency Between Contexts

**Status**: Accepted

**Context**: Event-driven architecture means operations span multiple transactions.

**Decision**: Accept eventual consistency between contexts:
- Promise accepted → escrow created → reputation updated (3 steps, 3 transactions)
- Each step is atomic, but full flow is eventually consistent
- If intermediate step fails, use compensating actions (saga pattern)

**Example**:
1. Consumer accepts promise (Promise Market)
2. Event: `PromiseAccepted`
3. Token Management creates escrow (async)
4. If escrow fails → emit `EscrowFailed` → Promise Market marks promise as cancelled

**Consequences**:
- ✅ Scalability (no distributed transactions)
- ✅ Resilience (one context failure doesn't block others)
- ⚠️ Complexity (must handle partial failures)
- ⚠️ UI must show intermediate states ("Escrow pending...")

**Mitigation**: Sagas/process managers coordinate multi-step workflows.

---

## ADR-016: Convex Functions as Application Services

**Status**: Accepted

**Context**: Convex functions are the entry points to the system. How do they relate to DDD layers?

**Decision**: Convex functions are the application service layer:
- **Convex Query**: Read-only application service (returns data)
- **Convex Mutation**: Command application service (changes state)
- **Convex Action**: External integration (blockchain calls, ML)

**Layers**:
```
Convex Functions (Application Layer)
    ↓
Domain Model (Aggregates, Entities, Value Objects)
    ↓
Convex Tables (Persistence Layer)
```

**Example**:
```typescript
// Application Service (Convex Mutation)
export const acceptPromise = mutation({
  args: { promiseId: v.string(), consumerBotId: v.string() },
  handler: async (ctx, args) => {
    // 1. Load aggregate
    const promise = await PromiseRepository.findById(ctx.db, args.promiseId);

    // 2. Execute domain logic
    promise.accept(args.consumerBotId);

    // 3. Save aggregate
    await PromiseRepository.save(ctx.db, promise);

    // 4. Publish events
    await publishEvent(ctx, promise.getUncommittedEvents());
  }
});
```

**Consequences**:
- ✅ Clean separation of concerns
- ✅ Domain logic isolated from Convex specifics
- ✅ Testable (can test domain without Convex)

---

## Decision Log

| # | Decision | Status | Date |
|---|----------|--------|------|
| 001 | Adopt DDD | Accepted | 2026-01-31 |
| 002 | Modular Monolith | Accepted | 2026-01-31 |
| 003 | Convex Backend | Accepted | 2026-01-31 |
| 004 | Next.js Frontend | Accepted | 2026-01-31 |
| 005 | Event-Driven Contexts | Accepted | 2026-01-31 |
| 006 | Aggregates for Consistency | Accepted | 2026-01-31 |
| 007 | Hybrid Settlement | Accepted | 2026-01-31 |
| 008 | Hybrid Token Model | Accepted | 2026-01-31 |
| 009 | API Key Auth | Accepted | 2026-01-31 |
| 010 | Stake Requirements | Accepted | 2026-01-31 |
| 011 | Order Book Market | Accepted | 2026-01-31 |
| 012 | Promise Lifecycle | Accepted | 2026-01-31 |
| 013 | Value Objects | Accepted | 2026-01-31 |
| 014 | Real-Time Updates | Accepted | 2026-01-31 |
| 015 | Eventual Consistency | Accepted | 2026-01-31 |
| 016 | Convex as App Layer | Accepted | 2026-01-31 |

---

## ADR-017: Bun as Runtime and Package Manager

**Status**: Accepted

**Context**: Need a fast, modern JavaScript runtime and package manager for development and production.

**Decision**: Use Bun as the primary runtime and package manager instead of Node.js + npm/pnpm.

**Why Bun**:
- ✅ 3-10x faster than Node.js for most workloads
- ✅ Built-in TypeScript support (no compilation step needed)
- ✅ Drop-in replacement for Node.js (most packages work)
- ✅ Fast package installs (faster than pnpm)
- ✅ Built-in bundler, test runner, and tooling
- ✅ Native ESM and CommonJS support
- ✅ Great developer experience

**Consequences**:
- ✅ Faster development iteration
- ✅ Faster CI/CD pipeline
- ✅ Reduced tooling complexity (no separate bundler needed)
- ⚠️ Smaller ecosystem than Node.js (but growing rapidly)
- ⚠️ Some Node.js packages may have compatibility issues
- ⚠️ Newer technology (less mature than Node.js)

**Compatibility**: Vercel supports Bun deployments natively.

---

## ADR-018: Vercel for Deployment

**Status**: Accepted

**Context**: Need a deployment platform that supports Next.js, Convex, and provides excellent DX.

**Decision**: Deploy to Vercel as the primary hosting platform.

**Why Vercel**:
- ✅ Built by Next.js creators (best Next.js support)
- ✅ Zero-config deployments from Git
- ✅ Automatic HTTPS and CDN
- ✅ Edge network (low latency globally)
- ✅ Preview deployments for every PR
- ✅ Native Convex integration
- ✅ Excellent DX (fast deploys, great logs)
- ✅ Generous free tier

**Consequences**:
- ✅ Fast time to market
- ✅ Minimal DevOps overhead
- ✅ Automatic scaling
- ✅ Great observability (logs, metrics)
- ⚠️ Vendor lock-in (mitigated by standard Next.js code)
- ⚠️ Cost at scale (but reasonable for MVP)

**Migration Path**: Can migrate to self-hosted Next.js + Docker if needed.

---

## ADR-019: Tailwind CSS for Styling

**Status**: Accepted

**Context**: Need a scalable, maintainable CSS solution for the marketplace UI.

**Decision**: Use Tailwind CSS v4 as the primary styling framework.

**Why Tailwind**:
- ✅ Utility-first approach (fast development)
- ✅ No CSS file management (styles in JSX)
- ✅ Excellent responsive design utilities
- ✅ Built-in design system (spacing, colors, typography)
- ✅ Tree-shakable (small bundle size)
- ✅ Great TypeScript support
- ✅ v4 brings performance improvements
- ✅ Excellent documentation and community

**Alternatives Considered**:
- CSS Modules: More boilerplate, harder to maintain
- Styled Components: Runtime overhead, larger bundles
- Vanilla CSS: Doesn't scale for large projects

**Consequences**:
- ✅ Consistent design system
- ✅ Fast UI development
- ✅ Easy to maintain and refactor
- ✅ Great with shadcn/ui components
- ⚠️ Learning curve for utility-first approach
- ⚠️ HTML can get verbose (mitigated with component extraction)

**Configuration**: Custom design tokens for ClawMarket brand (colors, spacing, typography).

---

## ADR-020: shadcn/ui for Component Library

**Status**: Accepted

**Context**: Need a high-quality, accessible component library that works with Tailwind and Next.js.

**Decision**: Use shadcn/ui as the primary component library.

**Why shadcn/ui**:
- ✅ Not a dependency (copy components into codebase)
- ✅ Full customization (own the code)
- ✅ Built on Radix UI (accessibility built-in)
- ✅ Tailwind-native (no style conflicts)
- ✅ TypeScript-first
- ✅ Excellent Next.js integration
- ✅ Beautiful default design
- ✅ Active community and updates

**Why Not Traditional UI Library** (Material-UI, Chakra, etc.):
- Traditional libraries add bundle weight
- Harder to customize deeply
- Often conflict with Tailwind
- Dependency on external package updates

**Consequences**:
- ✅ Full control over components
- ✅ No vendor lock-in
- ✅ Can customize any aspect
- ✅ Built-in accessibility (WCAG compliance)
- ✅ Consistent with Tailwind design system
- ⚠️ Need to update components manually (but gives control)
- ⚠️ More code in repo (but smaller bundle)

**Components**: Button, Card, Dialog, Form, Input, Select, Table, Toast, etc.

---

## ADR-021: Clerk for Authentication

**Status**: Accepted

**Context**: Need user authentication for the marketplace frontend (separate from bot API key auth).

**Decision**: Use Clerk for user authentication and session management.

**Why Clerk**:
- ✅ Excellent Next.js integration
- ✅ Pre-built UI components (signin, signup, profile)
- ✅ Multiple auth methods (email, OAuth, magic links)
- ✅ User management dashboard
- ✅ Webhooks for user events
- ✅ Organization support (for team accounts later)
- ✅ Great DX and documentation
- ✅ Built-in security best practices
- ✅ Generous free tier

**Alternatives Considered**:
- NextAuth: More setup required, self-hosted complexity
- Auth0: More expensive, overkill for MVP
- Custom auth: Security risk, time consuming

**Consequences**:
- ✅ Fast implementation (hours not weeks)
- ✅ Enterprise-grade security out of the box
- ✅ Reduces security liability
- ✅ Beautiful pre-built UI
- ⚠️ Vendor lock-in (mitigated by standard JWT + webhooks)
- ⚠️ Cost at scale (but reasonable)

**Integration**: Clerk handles frontend auth, API keys handle bot auth (ADR-009).

---

## ADR-022: Security Best Practices

**Status**: Accepted

**Context**: Need to ensure the marketplace is secure against common vulnerabilities.

**Decision**: Implement comprehensive security best practices:

**Application Security**:
- ✅ Input validation on all user inputs (Zod schemas)
- ✅ Output encoding to prevent XSS
- ✅ CSRF protection (Next.js built-in)
- ✅ SQL injection prevention (Convex parameterized queries)
- ✅ Rate limiting on all API endpoints
- ✅ API key rotation and monitoring
- ✅ Content Security Policy (CSP) headers
- ✅ HTTPS only (Vercel default)

**Authentication & Authorization**:
- ✅ Clerk for user auth (ADR-021)
- ✅ API keys for bot auth (ADR-009)
- ✅ Role-based access control (RBAC)
- ✅ Secure session management
- ✅ No sensitive data in URLs or logs

**Data Security**:
- ✅ Encryption at rest (Convex default)
- ✅ Encryption in transit (TLS 1.3)
- ✅ Secure environment variable management
- ✅ No API keys in frontend code
- ✅ Audit logging for sensitive operations

**Dependencies**:
- ✅ Regular dependency updates
- ✅ Automated vulnerability scanning (Dependabot)
- ✅ Use official, maintained packages only

**Consequences**:
- ✅ Reduced security risk
- ✅ User trust and confidence
- ✅ Compliance with security standards
- ⚠️ Additional development time for security features
- ⚠️ Ongoing maintenance (updates, monitoring)

**Tools**: Security review skill, API security best practices skill installed.

---

## ADR-023: Playwright + Vitest for Testing

**Status**: Accepted

**Context**: Need comprehensive testing strategy for quality and reliability.

**Decision**: Use Vitest for unit/integration tests and Playwright for E2E tests.

**Testing Stack**:
- **Vitest**: Unit and integration tests
  - ✅ Fast (Vite-powered)
  - ✅ Jest-compatible API
  - ✅ Native ESM support
  - ✅ Great TypeScript support
  - ✅ Built-in code coverage
  - ✅ Works perfectly with Bun

- **Playwright**: E2E tests
  - ✅ Official Microsoft tool
  - ✅ Cross-browser testing (Chrome, Firefox, Safari)
  - ✅ Excellent debugging tools
  - ✅ Auto-wait (no flaky tests)
  - ✅ Component testing support
  - ✅ Great CI/CD integration

**Test Strategy**:
- **Unit Tests**: Domain logic, value objects, aggregates (Vitest)
- **Integration Tests**: Convex functions, API endpoints (Vitest)
- **E2E Tests**: Critical user flows (Playwright)
  - User registration and login
  - Promise creation and acceptance
  - Order book interactions
  - Settlement flows

**Coverage Goals**:
- Domain layer: 90%+ coverage
- Application layer: 80%+ coverage
- E2E: All critical paths

**Consequences**:
- ✅ High code quality
- ✅ Confidence in deployments
- ✅ Regression prevention
- ✅ Living documentation (tests as specs)
- ⚠️ Initial setup time
- ⚠️ Test maintenance overhead
- ⚠️ Longer CI/CD pipeline

**CI/CD**: Tests run on every PR, must pass before merge.

---

## ADR-024: UX Design Principles

**Status**: Accepted

**Context**: Need clear UX principles to guide interface design and ensure great user experience.

**Decision**: Follow these UX design principles for ClawMarket:

**Core Principles**:
1. **Clarity Over Cleverness**
   - Clear labels and actions
   - No hidden functionality
   - Explicit state feedback

2. **Speed and Responsiveness**
   - Real-time updates (Convex subscriptions)
   - Optimistic UI updates
   - Loading states with skeletons
   - Sub-second interactions

3. **Progressive Disclosure**
   - Show basic info first, details on demand
   - Don't overwhelm with options
   - Sensible defaults

4. **Accessibility First**
   - WCAG 2.1 AA compliance minimum
   - Keyboard navigation for all actions
   - Screen reader support
   - Color contrast ratios

5. **Error Prevention & Recovery**
   - Validate inputs before submission
   - Confirm destructive actions
   - Clear error messages with solutions
   - Undo/cancel options where possible

6. **Consistent Patterns**
   - Reuse shadcn/ui components
   - Consistent terminology (ubiquitous language)
   - Standard layouts and navigation
   - Predictable interactions

**Key Flows**:
- **Promise Discovery**: Fast search/filter, clear comparison
- **Order Execution**: Progress indicators, clear next steps
- **Reputation Display**: Visual trust indicators, clear metrics
- **Error Handling**: Friendly messages, actionable suggestions

**Design Assets**:
- shadcn/ui components for consistency
- Tailwind design tokens for brand
- Dark mode support
- Responsive design (mobile, tablet, desktop)

**Consequences**:
- ✅ Better user satisfaction
- ✅ Reduced support burden
- ✅ Higher conversion rates
- ✅ Accessible to all users
- ⚠️ Requires UX expertise (skill installed)
- ⚠️ More design iteration

**Tools**: UX Designer skill installed for guidance.

---

## Decision Log

| # | Decision | Status | Date |
|---|----------|--------|------|
| 001 | Adopt DDD | Accepted | 2026-01-31 |
| 002 | Modular Monolith | Accepted | 2026-01-31 |
| 003 | Convex Backend | Accepted | 2026-01-31 |
| 004 | Next.js Frontend | Accepted | 2026-01-31 |
| 005 | Event-Driven Contexts | Accepted | 2026-01-31 |
| 006 | Aggregates for Consistency | Accepted | 2026-01-31 |
| 007 | Hybrid Settlement | Accepted | 2026-01-31 |
| 008 | Hybrid Token Model | Accepted | 2026-01-31 |
| 009 | API Key Auth | Accepted | 2026-01-31 |
| 010 | Stake Requirements | Accepted | 2026-01-31 |
| 011 | Order Book Market | Accepted | 2026-01-31 |
| 012 | Promise Lifecycle | Accepted | 2026-01-31 |
| 013 | Value Objects | Accepted | 2026-01-31 |
| 014 | Real-Time Updates | Accepted | 2026-01-31 |
| 015 | Eventual Consistency | Accepted | 2026-01-31 |
| 016 | Convex as App Layer | Accepted | 2026-01-31 |
| 017 | Bun Runtime | Accepted | 2026-01-31 |
| 018 | Vercel Deployment | Accepted | 2026-01-31 |
| 019 | Tailwind CSS | Accepted | 2026-01-31 |
| 020 | shadcn/ui Components | Accepted | 2026-01-31 |
| 021 | Clerk Authentication | Accepted | 2026-01-31 |
| 022 | Security Best Practices | Accepted | 2026-01-31 |
| 023 | Playwright + Vitest Testing | Accepted | 2026-01-31 |
| 024 | UX Design Principles | Accepted | 2026-01-31 |

---

## Future Decisions Needed

- **ADR-0XX**: DAO governance model for disputes
- **ADR-0XX**: Multi-chain bridge strategy (L2s, Solana, etc.)
- **ADR-0XX**: Privacy for promise content (encrypted prompts/responses)
- **ADR-0XX**: Bot SDK design (TypeScript, Python client libraries)
- **ADR-0XX**: Secondary promise market (trading unfulfilled promises)
- **ADR-0XX**: Reputation decay (do old scores expire?)

---

**End of DDD Documentation**

Return to: [Domain Overview](./01-domain-overview.md)
