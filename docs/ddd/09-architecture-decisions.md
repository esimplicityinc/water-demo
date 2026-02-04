# Architecture Decisions

This document records key architectural decisions (ADRs) for AquaTrack, following Domain-Driven Design principles.

---

## ADR-001: Adopt Domain-Driven Design

**Status**: Accepted

**Context**: AquaTrack is a complex water utility system with multiple interacting domains (customers, usage, billing, operations). Need architecture that:
- Reflects business complexity
- Enables team scalability
- Maintains clean separation of concerns
- Supports evolution without major rewrites

**Decision**: Use Domain-Driven Design with:
- Bounded contexts for major subdomains
- Aggregates for consistency boundaries
- Domain events for inter-context communication
- Ubiquitous language shared with domain experts

**Consequences**:
- ✅ Domain logic centralized
- ✅ Clear context boundaries
- ✅ Easier team onboarding (read domain docs)
- ⚠️ Requires discipline to maintain boundaries
- ⚠️ More upfront design vs simple CRUD

---

## ADR-002: Modular Monolith over Microservices (v1)

**Status**: Accepted

**Context**: Building MVP for water utility. Need to move fast but design for future scaling.

**Decision**: Build as modular monolith where:
- Each bounded context is a module with clear boundaries
- All contexts share database (Convex) but have logical separation
- Event bus is in-process (Convex reactive system)
- Can extract to microservices later without domain rewrite

**Consequences**:
- ✅ Fast development
- ✅ Easy local development
- ✅ Shared transactions
- ✅ Simple infrastructure
- ⚠️ Must enforce module boundaries via code reviews
- ⚠️ All contexts scale together

---

## ADR-003: Convex for Backend and Database

**Status**: Accepted

**Context**: Need backend supporting:
- Real-time usage updates
- ACID transactions (billing accuracy)
- Event-driven architecture
- Serverless deployment on Vercel

**Decision**: Use Convex as backend + database.

**Why Convex**:
- Built-in reactive queries (real-time updates)
- ACID transactions
- TypeScript-first
- Serverless (no ops)
- Real-time subscriptions (WebSockets)

**Consequences**:
- ✅ Real-time meter readings and bills
- ✅ Strong consistency within context
- ✅ Great DX
- ⚠️ Vendor lock-in (mitigated by clean domain layer)

---

## ADR-004: Event-Driven Communication Between Contexts

**Status**: Accepted

**Context**: Bounded contexts need to communicate without tight coupling.

**Decision**: Use domain events as primary integration:
- Each context publishes events for significant occurrences
- Other contexts subscribe to events they care about
- Event store is Convex's `events` table

**Consequences**:
- ✅ Loose coupling between contexts
- ✅ Audit trail (all events logged)
- ✅ Can replay events for debugging
- ⚠️ Eventual consistency (Settlement → Reputation is async)
- ⚠️ Must handle idempotency

---

## ADR-005: Aggregates as Consistency Boundaries

**Status**: Accepted

**Context**: Need to ensure business rules enforced consistently.

**Decision**: Use aggregates to define consistency boundaries:
- Each aggregate is a transactional boundary
- Only aggregate root is directly accessible
- No object references between aggregates (use IDs)

**Consequences**:
- ✅ Strong consistency within aggregate
- ✅ Invariants enforced by aggregate logic
- ✅ Clear transaction boundaries
- ⚠️ Eventual consistency between aggregates
- ⚠️ Cannot do cross-aggregate transactions

---

## ADR-006: Real-Time Meter Reading Subscriptions

**Status**: Accepted

**Context**: Utilities need instant visibility into meter changes and consumption.

**Decision**: Use Convex's reactive queries for real-time subscriptions:
- Utilities subscribe to meter readings via WebSocket
- Any reading recorded → utilities notified instantly
- Billing system reacts immediately to consumption

**Consequences**:
- ✅ Instant updates (sub-second)
- ✅ Reduced polling load
- ✅ Better operational visibility
- ⚠️ More complex client code (WebSocket management)

---

## ADR-007: Value Objects for Domain Primitives

**Status**: Accepted

**Context**: Primitive obsession (using `number` for m³, `string` for IDs) makes code error-prone.

**Decision**: Wrap domain concepts in value objects:
- `CubicMeters` not `number`
- `AccountId` / `MeterId` not `string`
- `Money` not `number`
- `Address` not separate fields
- `AccountStatus` not `string`

**Consequences**:
- ✅ Type safety (can't pass wrong ID type)
- ✅ Validation centralized (invalid state impossible)
- ✅ Business logic in value objects
- ✅ Self-documenting code
- ⚠️ More boilerplate

---

## ADR-008: Eventual Consistency Between Contexts

**Status**: Accepted

**Context**: Event-driven architecture means operations span multiple transactions.

**Decision**: Accept eventual consistency between contexts:
- Account activated → Usage tracking starts → Billing cycle activates (3 steps, 3 transactions)
- Each step is atomic, but full flow is eventually consistent
- Use compensating actions (saga pattern) if intermediate step fails

**Consequences**:
- ✅ Scalability (no distributed transactions)
- ✅ Resilience
- ⚠️ Complexity (must handle partial failures)
- ⚠️ UI must show intermediate states

---

## ADR-009: Automation of Billing & Collections

**Status**: Accepted

**Context**: Utilities need to process hundreds or thousands of accounts monthly without manual intervention.

**Decision**: Fully automate standard billing and collections:
- Monthly/quarterly billing cycles run automatically
- Invoices generated from consumption data
- Payment reminders sent on schedule
- Late payment detection triggers escalation

**Consequences**:
- ✅ Reduced manual effort
- ✅ Consistent billing (same logic for all)
- ✅ Faster payment collection
- ⚠️ Complex error handling needed
- ⚠️ Test coverage critical

---

## ADR-010: Anomaly Detection for Meter Faults

**Status**: Accepted

**Context**: Need early detection of meter malfunctions or water leaks to help customers and protect revenue.

**Decision**: Implement automated anomaly detection:
- Flag readings that go backward (impossible)
- Flag readings >200% of customer's average (potential leak)
- Flag readings &lt;10% of customer's average (meter fault)
- Hold suspect consumption from billing pending review

**Consequences**:
- ✅ Early leak detection helps customers
- ✅ Meter fault prevention
- ⚠️ False positives possible (requires manual review)
- ⚠️ May delay billing for flagged accounts

---

## ADR-011: Service Deposits for Account Activation

**Status**: Accepted

**Context**: Utilities need protection against non-payment from new customers.

**Decision**: Require service deposit before account activation:
- Deposit amount determined by account type and credit history
- Held in escrow during active account
- Refunded when account closed in good standing
- Applied to final bill if closed with balance

**Consequences**:
- ✅ Revenue protection for unpaid balances
- ✅ Customer commitment signal
- ⚠️ May deter some customers
- ⚠️ Operational complexity (refunds processing)

---

## ADR-012: Billing Cycle Patterns

**Status**: Accepted

**Context**: Utilities serve different customer types with different billing needs.

**Decision**: Support three standard billing cycles:
- Monthly (30 days): Residential customers
- Bi-monthly (60 days): Large residential or small commercial
- Quarterly (90 days): Large commercial or industrial

**Consequences**:
- ✅ Flexibility for different customer types
- ✅ Can optimize reading schedules per cycle
- ⚠️ More complex billing engine
- ⚠️ More complex customer communication

---

## ADR-013: Customer Portal for Account Management

**Status**: Accepted

**Context**: Customers need self-service capabilities to reduce support burden.

**Decision**: Build customer portal allowing:
- View current balance and invoice history
- Make online payments
- Report usage issues or leaks
- Update contact information
- Download billing statements

**Consequences**:
- ✅ Reduced support calls
- ✅ Faster issue reporting
- ✅ Customer satisfaction
- ⚠️ Security and data privacy critical
- ⚠️ Must handle authentication carefully

---

## Decision Log

| # | Decision | Status | Date |
|---|----------|--------|------|
| 001 | Adopt DDD | Accepted | 2026-02-03 |
| 002 | Modular Monolith | Accepted | 2026-02-03 |
| 003 | Convex Backend | Accepted | 2026-02-03 |
| 004 | Event-Driven | Accepted | 2026-02-03 |
| 005 | Aggregates | Accepted | 2026-02-03 |
| 006 | Real-Time Subscriptions | Accepted | 2026-02-03 |
| 007 | Value Objects | Accepted | 2026-02-03 |
| 008 | Eventual Consistency | Accepted | 2026-02-03 |
| 009 | Billing Automation | Accepted | 2026-02-03 |
| 010 | Anomaly Detection | Accepted | 2026-02-03 |
| 011 | Service Deposits | Accepted | 2026-02-03 |
| 012 | Billing Cycles | Accepted | 2026-02-03 |
| 013 | Customer Portal | Accepted | 2026-02-03 |

---

## Future Decisions Needed

- **ADR-0XX**: Multi-language support for international customers
- **ADR-0XX**: Advanced conservation analytics and recommendations
- **ADR-0XX**: Integration with external billing systems (municipalities)
- **ADR-0XX**: Water quality data collection and tracking
- **ADR-0XX**: Emergency response workflows for main breaks

---

**End of DDD Documentation**

Return to: [Domain Overview](./01-domain-overview.md)
