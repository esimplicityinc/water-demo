# Aggregates & Entities

This document defines the key aggregates and entities within each bounded context, including their responsibilities, invariants, and relationships.

---

## Aggregate Design Principles

1. **Consistency Boundary**: Each aggregate enforces its own invariants
2. **Transaction Boundary**: Changes to an aggregate happen in a single transaction
3. **Identity**: Aggregates have unique IDs and are retrieved by ID
4. **Small Aggregates**: Keep aggregates focused and minimize nested entities
5. **Reference by ID**: Aggregates reference other aggregates by ID, not object reference

---

## Bot Identity & Reputation Context

### BotAccount Aggregate

**Root Entity**: `BotAccount`

**Responsibility**: Manages bot identity, authentication, reputation, and staking capacity.

#### Entities

##### BotAccount (Root)
```typescript
{
  botId: BotId (UUID)
  email: Email (optional, for notifications)
  displayName: string
  apiKey: ApiKey (hashed)
  registeredAt: Timestamp
  verificationStatus: VerificationStatus
  reputationScore: ReputationScore
  stakeLock: StakeLock
  performanceHistory: PerformanceRecord[]
}
```

**Invariants**:
- `botId` is unique and immutable
- `apiKey` must never be stored in plaintext
- `reputationScore` must be between 0 and 1000
- `stakeLock.lockedAmount` ≤ bot's wallet balance
- New bots start with reputation score of 100

**Operations**:
- `register(email, displayName)` → BotAccount
- `regenerateApiKey()` → ApiKey
- `lockStake(amount: TokenAmount, promiseId: PromiseId)` → void
- `releaseStake(promiseId: PromiseId)` → void
- `updateReputation(delta: number, reason: string)` → void
- `recordPerformance(promiseId: PromiseId, outcome: Outcome)` → void

#### Child Entities

##### StakeLock
```typescript
{
  lockedAmount: TokenAmount
  activePromises: Map<PromiseId, TokenAmount>
}
```

**Invariants**:
- `lockedAmount` = sum of all `activePromises` values
- Cannot lock more than wallet balance allows

##### PerformanceRecord
```typescript
{
  promiseId: PromiseId
  outcome: 'fulfilled' | 'failed' | 'disputed_won' | 'disputed_lost'
  completedAt: Timestamp
  executionTime: Duration
}
```

**Invariants**:
- Immutable once created
- `executionTime` must be positive

---

## Promise Market Context

### Promise Aggregate

**Root Entity**: `Promise`

**Responsibility**: Manages the lifecycle of a single promise, including specification, pricing, state transitions, and history.

#### Entities

##### Promise (Root)
```typescript
{
  promiseId: PromiseId (UUID)
  providerBotId: BotId
  consumerBotId: BotId | null
  specification: PromiseSpecification
  pricingTerms: PricingTerms
  state: PromiseState
  createdAt: Timestamp
  listedAt: Timestamp | null
  acceptedAt: Timestamp | null
  executingAt: Timestamp | null
  completedAt: Timestamp | null
  history: StateTransition[]
}
```

**Invariants**:
- `promiseId` is unique and immutable
- `providerBotId` is immutable
- `consumerBotId` is null until state = Accepted
- Cannot transition to Executing unless consumerBotId is set
- Timestamps must be monotonically increasing
- Cannot modify specification or pricing after state = Accepted
- `completedAt - acceptedAt` must be ≤ `specification.responseTimeSLA`

**Operations**:
- `create(providerBotId, spec, pricing)` → Promise
- `list()` → void (Draft → Listed)
- `accept(consumerBotId)` → void (Listed → Accepted)
- `startExecution()` → void (Accepted → Executing)
- `completeExecution(proof: ExecutionProof)` → void (Executing → Completed)
- `markFailed(reason: string)` → void (Executing → Failed)
- `raiseDispute(party: BotId, reason: string)` → void (any → Disputed)
- `cancel()` → void (Draft/Listed → Cancelled)

#### Child Entities

##### PromiseSpecification
```typescript
{
  modelName: string (e.g., "chatgpt-5.2")
  tokenCount: number
  contextWindow: number | null
  responseTimeSLA: Duration (e.g., 30 seconds)
  qualityParams: {
    temperature?: number
    topP?: number
    maxTokens?: number
  }
  additionalRequirements: string | null
}
```

**Invariants**:
- `tokenCount` > 0
- `responseTimeSLA` > 0
- `temperature` between 0 and 2 if specified
- `topP` between 0 and 1 if specified

##### PricingTerms
```typescript
{
  price: TokenAmount
  paymentSchedule: 'upfront' | 'on_completion' | 'split'
  penaltyClause: {
    stakeAmount: TokenAmount
    slashPercentage: number (0-100)
  }
  discount: number | null (percentage)
}
```

**Invariants**:
- `price` > 0
- `stakeAmount` ≥ `price * 0.1` (minimum 10% stake)
- `slashPercentage` between 0 and 100
- `discount` between 0 and 100 if specified

##### StateTransition
```typescript
{
  fromState: PromiseState
  toState: PromiseState
  transitionedAt: Timestamp
  triggeredBy: BotId | 'system'
  reason: string | null
}
```

**Invariants**:
- Immutable once created
- `transitionedAt` must be after previous transition

---

### OrderBook Aggregate

**Root Entity**: `OrderBook`

**Responsibility**: Maintains active supply and demand listings, performs matching.

#### Entities

##### OrderBook (Root)
```typescript
{
  supplyListings: Listing[]
  demandListings: Listing[]
  lastMatchedAt: Timestamp | null
}
```

**Operations**:
- `addSupplyListing(promise: Promise)` → void
- `addDemandListing(request: PromiseRequest)` → void
- `removeListing(listingId: ListingId)` → void
- `findMatches(listing: Listing)` → Match[]
- `executeMatch(match: Match)` → Promise

##### Listing
```typescript
{
  listingId: ListingId (UUID)
  type: 'supply' | 'demand'
  promiseId: PromiseId | null (null for demand)
  botId: BotId
  specification: PromiseSpecification
  maxPrice: TokenAmount (for demand)
  minPrice: TokenAmount (for supply)
  listedAt: Timestamp
  expiresAt: Timestamp | null
}
```

**Invariants**:
- For supply: must reference existing Promise
- For demand: `promiseId` is null
- `expiresAt` must be > `listedAt` if set
- Cannot modify after creation (immutable)

---

## Token Management Context

### Wallet Aggregate

**Root Entity**: `Wallet`

**Responsibility**: Manages a bot's token balance and transaction history.

#### Entities

##### Wallet (Root)
```typescript
{
  walletId: WalletId (UUID)
  botId: BotId (unique)
  balance: TokenAmount
  lockedBalance: TokenAmount
  transactions: Transaction[]
  createdAt: Timestamp
}
```

**Invariants**:
- `balance` ≥ 0
- `lockedBalance` ≥ 0
- `lockedBalance` ≤ `balance`
- `availableBalance` = `balance - lockedBalance`
- One wallet per bot (enforced by unique `botId`)

**Operations**:
- `deposit(amount: TokenAmount, source: string)` → Transaction
- `withdraw(amount: TokenAmount, destination: string)` → Transaction
- `lock(amount: TokenAmount, reason: string)` → void
- `unlock(amount: TokenAmount, reason: string)` → void
- `transfer(toWalletId: WalletId, amount: TokenAmount)` → Transaction

##### Transaction
```typescript
{
  transactionId: TransactionId (UUID)
  type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out'
  amount: TokenAmount
  fromWalletId: WalletId | null
  toWalletId: WalletId | null
  timestamp: Timestamp
  metadata: Record<string, any>
}
```

**Invariants**:
- Immutable once created
- `amount` > 0
- For transfers: must have both `fromWalletId` and `toWalletId`

---

### EscrowAccount Aggregate

**Root Entity**: `EscrowAccount`

**Responsibility**: Holds tokens during promise execution, releases or slashes based on settlement.

#### Entities

##### EscrowAccount (Root)
```typescript
{
  escrowId: EscrowId (UUID)
  promiseId: PromiseId (unique)
  consumerWalletId: WalletId
  providerWalletId: WalletId
  amount: TokenAmount
  status: 'active' | 'released' | 'returned' | 'slashed' | 'disputed'
  createdAt: Timestamp
  settledAt: Timestamp | null
}
```

**Invariants**:
- One escrow per promise (enforced by unique `promiseId`)
- Cannot change `amount` after creation
- `status` transitions: active → (released | returned | slashed | disputed)
- If `status` ≠ 'active', `settledAt` must be set

**Operations**:
- `create(promiseId, consumerWalletId, providerWalletId, amount)` → EscrowAccount
- `release()` → void (sends tokens to provider)
- `return()` → void (sends tokens back to consumer)
- `slash(percentage: number)` → void (distributes per penalty clause)
- `dispute()` → void (marks as disputed, awaits arbitration)

---

### BridgeTransaction Aggregate

**Root Entity**: `BridgeTransaction`

**Responsibility**: Manages conversion between internal tokens and external crypto.

#### Entities

##### BridgeTransaction (Root)
```typescript
{
  bridgeTransactionId: BridgeTransactionId (UUID)
  direction: 'deposit' | 'withdrawal'
  botId: BotId
  internalTokenAmount: TokenAmount
  externalCryptoAmount: CryptoAmount
  externalCurrency: 'ETH' | 'SOL' | 'USDC'
  externalTxHash: string | null
  status: 'pending' | 'confirming' | 'completed' | 'failed'
  initiatedAt: Timestamp
  completedAt: Timestamp | null
}
```

**Invariants**:
- Immutable amounts after creation
- For deposits: `externalTxHash` must be set when status = 'confirming'
- `completedAt` must be set when status ∈ {'completed', 'failed'}

**Operations**:
- `initiateDeposit(botId, cryptoAmount, currency)` → BridgeTransaction
- `initiateWithdrawal(botId, tokenAmount)` → BridgeTransaction
- `confirmExternal(txHash: string)` → void
- `complete()` → void
- `fail(reason: string)` → void

---

## Settlement & Verification Context

### SettlementCase Aggregate

**Root Entity**: `SettlementCase`

**Responsibility**: Manages the verification and settlement process for a completed promise.

#### Entities

##### SettlementCase (Root)
```typescript
{
  settlementCaseId: SettlementCaseId (UUID)
  promiseId: PromiseId (unique)
  providerBotId: BotId
  consumerBotId: BotId
  executionProof: ExecutionProof
  verificationResult: VerificationResult | null
  status: 'pending' | 'verifying' | 'verified' | 'disputed' | 'settled'
  initiatedAt: Timestamp
  settledAt: Timestamp | null
  outcome: SettlementOutcome | null
}
```

**Invariants**:
- One case per promise (enforced by unique `promiseId`)
- `verificationResult` must be set when status = 'verified'
- `outcome` must be set when status = 'settled'
- Cannot modify `executionProof` after creation

**Operations**:
- `create(promiseId, providerBotId, consumerBotId, proof)` → SettlementCase
- `verify(oracle: Oracle)` → VerificationResult
- `raiseDispute(party: BotId, reason: string)` → void
- `settle(outcome: SettlementOutcome)` → void

##### ExecutionProof
```typescript
{
  apiCallLogs: {
    endpoint: string
    requestTimestamp: Timestamp
    responseTimestamp: Timestamp
    statusCode: number
  }[]
  inputHash: string (SHA-256)
  outputHash: string (SHA-256)
  executionMetadata: {
    modelVersion: string
    tokenUsage: { input: number, output: number }
    latency: Duration
  }
  providerAttestation: {
    signature: string
    signedAt: Timestamp
  }
}
```

**Invariants**:
- Hashes must be valid SHA-256
- `requestTimestamp` < `responseTimestamp`
- `latency` = `responseTimestamp - requestTimestamp`

##### VerificationResult
```typescript
{
  passed: boolean
  checks: {
    checkName: string
    passed: boolean
    details: string
  }[]
  verifiedAt: Timestamp
  verifiedBy: 'oracle' | 'consensus' | 'arbitrator'
}
```

##### SettlementOutcome
```typescript
{
  decision: 'success' | 'failure' | 'partial'
  tokensToProvider: TokenAmount
  tokensToConsumer: TokenAmount
  tokensSlashed: TokenAmount
  reputationDelta: {
    provider: number
    consumer: number
  }
  reason: string
}
```

**Invariants**:
- `tokensToProvider + tokensToConsumer + tokensSlashed` = total escrow amount
- All token amounts ≥ 0

---

### Dispute Aggregate

**Root Entity**: `Dispute`

**Responsibility**: Handles challenges to settlement outcomes via arbitration.

#### Entities

##### Dispute (Root)
```typescript
{
  disputeId: DisputeId (UUID)
  settlementCaseId: SettlementCaseId
  raisedBy: BotId
  reason: string
  evidence: Evidence[]
  status: 'open' | 'under_review' | 'resolved'
  resolution: DisputeResolution | null
  raisedAt: Timestamp
  resolvedAt: Timestamp | null
}
```

**Operations**:
- `raise(settlementCaseId, botId, reason)` → Dispute
- `submitEvidence(botId, evidence)` → void
- `resolve(decision: DisputeResolution)` → void

##### Evidence
```typescript
{
  submittedBy: BotId
  contentType: 'text' | 'log' | 'screenshot' | 'api_response'
  content: string
  submittedAt: Timestamp
}
```

##### DisputeResolution
```typescript
{
  decision: 'uphold_verification' | 'overturn_verification' | 'partial_settlement'
  arbitrator: string (human or DAO ID)
  reasoning: string
  newSettlementOutcome: SettlementOutcome
  resolvedAt: Timestamp
}
```

---

## Aggregate Relationships

```
BotAccount (1) ──< (0..*) Promise
                  [providerBotId]

BotAccount (1) ──< (0..*) Promise
                  [consumerBotId]

Promise (1) ──── (1) SettlementCase
                [promiseId]

Promise (1) ──── (0..1) EscrowAccount
                [promiseId]

BotAccount (1) ──── (1) Wallet
                   [botId]

SettlementCase (1) ──< (0..*) Dispute
                      [settlementCaseId]
```

**Note**: These are logical relationships via IDs, not in-memory object references.

---

## Aggregate Size Guidelines

| Aggregate | Max Entities | Notes |
|-----------|-------------|-------|
| BotAccount | 1 root + 1 StakeLock + N PerformanceRecords | Limit history to recent 100 records |
| Promise | 1 root + child values + N StateTransitions | Limit history to 50 transitions |
| Wallet | 1 root + N Transactions | Paginate transactions, keep summary in root |
| EscrowAccount | 1 root only | No child entities |
| SettlementCase | 1 root + 1 proof + 1 result | Keep lean |
| Dispute | 1 root + N Evidence | Limit evidence to 20 items |

---

**Next**: [Value Objects](./05-value-objects.md)
