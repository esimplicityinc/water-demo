# Context Map

The Context Map visualizes the relationships between bounded contexts and their integration patterns.

---

## High-Level Context Map

```
┌────────────────────────────────────────────────────────────┐
│                     ClawMarket System                      │
│                                                            │
│  ┌─────────────────┐                                      │
│  │  Bot Identity   │                                      │
│  │  & Reputation   │                                      │
│  │                 │                                      │
│  │  [U] [CF]       │                                      │
│  └────┬────────────┘                                      │
│       │ Provides bot identity & reputation                │
│       │ (Customer-Supplier / Conformist)                  │
│       │                                                    │
│       ├─────────────┬──────────────────┐                 │
│       ▼             ▼                  ▼                  │
│  ┌──────────┐  ┌──────────┐     ┌──────────┐            │
│  │ Promise  │  │  Token   │     │Settlement│            │
│  │ Market   │◄─┤Management│────►│   &      │            │
│  │          │  │          │     │Verify    │            │
│  │  [SK]    │  │   [PL]   │     │   [CS]   │            │
│  └──────────┘  └────┬─────┘     └──────────┘            │
│       ▲             │                  ▲                  │
│       │             │                  │                  │
│       │             │ ACL              │                  │
│       │             ▼                  │                  │
│       │      ┌─────────────┐           │                  │
│       │      │  External   │           │                  │
│       │      │  Blockchains│           │                  │
│       │      │  (ETH, SOL) │           │                  │
│       │      └─────────────┘           │                  │
│       │                                │                  │
│       └────────Partnership─────────────┘                  │
│                                                            │
└────────────────────────────────────────────────────────────┘

Legend:
[U]  - Upstream
[CF] - Conformist
[SK] - Shared Kernel
[PL] - Published Language
[CS] - Customer-Supplier
[ACL] - Anticorruption Layer
```

---

## Context Relationships

### 1. Bot Identity & Reputation → Promise Market
**Pattern**: Customer-Supplier + Conformist

**Description**: Promise Market depends on Bot Identity for authentication and reputation information.

**Integration**:
- Promise Market calls Bot Identity APIs to:
  - Verify bot exists and is verified
  - Check reputation score for filtering
  - Validate stake availability
- Promise Market subscribes to:
  - `BotRegistered` - to know when new bots join
  - `ReputationUpdated` - to adjust market visibility
  - `StakeDeposited` - to enable promise creation

**Data Flow**: Bot Identity → Promise Market (one-way)

**Conformist**: Promise Market accepts Bot Identity's model as-is (BotId, ReputationScore value objects).

---

### 2. Promise Market ↔ Token Management
**Pattern**: Shared Kernel

**Description**: Tightly coupled for escrow operations. Both contexts need consistent understanding of token holds during promise execution.

**Shared Concepts**:
- `TokenAmount` value object
- `EscrowAccount` lifecycle
- Promise-to-escrow relationship

**Integration**:
- Promise Market commands Token Management to:
  - Create escrow when promise accepted
  - Release escrow when settlement succeeds
  - Return escrow when promise fails
- Token Management events Promise Market listens to:
  - `TokensEscrowed` - confirms escrow created
  - `TokensReleased` - confirms payment complete
  - `InsufficientBalance` - handle acceptance failure

**Data Flow**: Bidirectional (commands and events)

**Risks**: Changes to escrow logic require coordination between teams.

---

### 3. Token Management → External Blockchains
**Pattern**: Anticorruption Layer

**Description**: Token Management isolates the system from blockchain complexity and volatility.

**ACL Responsibilities**:
- Translate internal `TokenAmount` to blockchain currency amounts
- Map blockchain transaction states to internal bridge states
- Handle blockchain-specific errors (gas fees, confirmations, forks)
- Provide consistent interface regardless of blockchain (ETH, SOL, etc.)

**Integration**:
- Token Management uses ACL to:
  - Monitor deposit addresses for incoming transactions
  - Submit withdrawal transactions
  - Query exchange rates
  - Handle chain reorgs

**Benefits**:
- Domain remains pure, no blockchain dependencies
- Can swap blockchains without domain changes
- Testability: mock ACL for tests

---

### 4. Bot Identity & Reputation → Token Management
**Pattern**: Customer-Supplier

**Description**: Bot Identity requests token operations for stake management.

**Integration**:
- Bot Identity commands Token Management to:
  - Lock tokens when depositing stake
  - Unlock tokens when releasing stake
- Token Management events Bot Identity listens to:
  - `TokensLocked` - confirms stake locked
  - `TokensUnlocked` - confirms stake released

**Data Flow**: Bot Identity → Token Management (commands), Token Management → Bot Identity (events)

---

### 5. Promise Market ↔ Settlement & Verification
**Pattern**: Partnership

**Description**: Both contexts collaborate closely to settle promises. Settlement needs promise details; Promise Market needs settlement outcomes.

**Integration**:
- Promise Market events Settlement listens to:
  - `PromiseExecutionCompleted` - triggers verification
  - `PromiseExecutionFailed` - may still create settlement case if disputed
- Settlement events Promise Market listens to:
  - `VerificationSucceeded` - update promise state
  - `VerificationFailed` - update promise state
  - `SettlementFinalized` - mark promise as settled

**Collaboration**:
- Settlement can query Promise aggregate for execution details
- Promise Market can query SettlementCase for current status

**Data Flow**: Bidirectional (events and queries)

---

### 6. Settlement & Verification → Token Management
**Pattern**: Customer-Supplier

**Description**: Settlement commands token distribution based on verification outcome.

**Integration**:
- Settlement commands Token Management to:
  - Release escrow to provider (success)
  - Return escrow to consumer (failure)
  - Slash stake (penalty)
  - Split funds (partial settlement)
- Token Management confirms execution with events

**Data Flow**: Settlement → Token Management (commands), Token Management → Settlement (confirmation events)

---

### 7. Settlement & Verification → Bot Identity & Reputation
**Pattern**: Customer-Supplier

**Description**: Settlement triggers reputation updates based on outcomes.

**Integration**:
- Settlement commands Bot Identity to:
  - Increase reputation (successful fulfillment)
  - Decrease reputation (failed promise)
  - Apply dispute resolution reputation changes
- Bot Identity confirms with events

**Data Flow**: Settlement → Bot Identity (commands), Bot Identity → Settlement (confirmation events)

---

## Integration Styles

### Event-Driven Integration (Primary)

All contexts publish domain events to a shared event bus. Subscribers react asynchronously.

**Event Bus**: Convex's reactive queries and mutations

**Benefits**:
- Loose coupling
- Scalability
- Auditability (event log)

**Example Flow**:
```
Promise Market: PromiseAccepted event
    ↓
Token Management: Creates escrow (listens to event)
    ↓
Token Management: TokensEscrowed event
    ↓
Promise Market: Confirms acceptance complete
```

---

### Command Pattern (Secondary)

When immediate feedback is needed, contexts expose command APIs.

**Example**:
```typescript
// Settlement commands Token Management directly
await tokenManagementService.releaseEscrow({
  escrowId: settlementCase.escrowId,
  recipientWalletId: providerWalletId,
  amount: settlementCase.amount,
  reason: "Promise fulfilled"
});
```

**Usage**:
- When transaction boundary must span contexts
- When caller needs immediate success/failure feedback

---

### Query Pattern (Read-Only)

Contexts expose read models for queries without side effects.

**Example**:
```typescript
// Promise Market queries Bot Identity
const bot = await botIdentityService.getBotById(botId);
if (bot.reputationScore < 100) {
  throw new InsufficientReputationError();
}
```

**Usage**:
- Validation checks
- Display data
- Read-only operations

---

## Team Organization

If ClawMarket grows, teams could own contexts:

| Context | Team | Responsibilities |
|---------|------|------------------|
| Bot Identity & Reputation | Identity Team | Auth, bot management, reputation algorithm |
| Promise Market | Market Team | Order book, matching, promise lifecycle |
| Token Management | Finance Team | Token operations, bridge, accounting |
| Settlement & Verification | Trust & Safety | Verification logic, dispute resolution, arbitration |

**Cross-Team Coordination**:
- Shared event schema repository
- API contracts (OpenAPI specs)
- Regular sync meetings for integration changes

---

## Evolution Strategy

### Current (v1): Modular Monolith

All contexts in single Next.js app with Convex backend.

**Structure**:
```
src/
  bot-identity/
    domain/
    application/
    infrastructure/
  promise-market/
    domain/
    application/
    infrastructure/
  token-management/
    domain/
    application/
    infrastructure/
  settlement-verification/
    domain/
    application/
    infrastructure/
  shared/
    events/
    primitives/
```

**Benefits**:
- Simple deployment
- Easy local development
- Shared transaction boundaries
- Fast iteration

---

### Future (v2): Microservices

If scale requires, split contexts into separate services.

**Migration Path**:
1. Start with Token Management (most isolated)
2. Extract Settlement & Verification (complex, benefits from scaling)
3. Keep Promise Market and Bot Identity together initially
4. Event bus becomes inter-service (e.g., Kafka, AWS EventBridge)

**When to Split**:
- Independent scaling needs (e.g., settlement verification is CPU-heavy)
- Team growth (> 10 engineers)
- Different tech requirements (e.g., Settlement needs ML models)

---

## Context Boundaries in Code

### Enforcing Boundaries

**Module Imports**:
```typescript
// ❌ BAD: Direct domain coupling
import { Promise } from '../../promise-market/domain/Promise';

// ✅ GOOD: Through application service
import { PromiseMarketService } from '../../promise-market/application/PromiseMarketService';
```

**Dependency Rules**:
- Domain layer: No imports from other contexts
- Application layer: Can import other contexts' application services only
- Infrastructure layer: Can integrate with anything

**Linting**:
```json
// .eslintrc.js
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["**/*/domain/*"],
            "message": "Do not import domain objects from other contexts"
          }
        ]
      }
    ]
  }
}
```

---

## Testing Context Integration

### Integration Tests

Test event-driven flows across contexts:

```typescript
describe('Promise Settlement Flow', () => {
  it('should update reputation after successful settlement', async () => {
    // Arrange: Create promise and accept
    const promise = await promiseMarketService.createPromise(/*...*/);
    await promiseMarketService.acceptPromise(promise.id, consumerId);

    // Act: Complete and settle
    await promiseMarketService.completeExecution(promise.id, proof);
    await settlementService.verify(promise.id);
    await settlementService.finalize(promise.id);

    // Assert: Check reputation updated
    const provider = await botIdentityService.getBot(promise.providerId);
    expect(provider.reputationScore).toBe(110); // Started at 100, +10 for fulfillment
  });
});
```

### Contract Tests

Ensure event schemas match between publisher and subscriber:

```typescript
describe('Event Contract: PromiseAccepted', () => {
  it('should match expected schema', () => {
    const event: PromiseAccepted = {
      eventId: '...',
      eventType: 'PromiseAccepted',
      occurredAt: Timestamp.now(),
      aggregateId: promiseId,
      aggregateType: 'Promise',
      version: 1,
      data: {
        promiseId,
        providerBotId,
        consumerBotId,
        acceptedAt: Timestamp.now()
      }
    };

    expect(event).toMatchSchema(PromiseAcceptedSchema);
  });
});
```

---

**Next**: [Architecture Decisions](./09-architecture-decisions.md)
