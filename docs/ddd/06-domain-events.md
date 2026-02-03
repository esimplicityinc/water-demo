# Domain Events

Domain Events represent significant occurrences in the domain that domain experts care about. They are immutable facts about what has happened.

---

## Event Characteristics

1. **Past Tense**: Named with past-tense verbs (e.g., `PromiseCreated`, not `CreatePromise`)
2. **Immutable**: Cannot be changed after creation
3. **Timestamped**: Always include when the event occurred
4. **Complete**: Contain all data needed by subscribers
5. **Domain-Focused**: Represent business events, not technical occurrences

---

## Event Structure

All domain events follow this base structure:

```typescript
interface DomainEvent {
  eventId: string; // UUID
  eventType: string; // Event class name
  occurredAt: Timestamp;
  aggregateId: string; // ID of affected aggregate
  aggregateType: string; // Type of aggregate
  version: number; // For event versioning
  causationId?: string; // What caused this event (another event)
  correlationId?: string; // Groups related events
  metadata?: Record<string, any>;
}
```

---

## Bot Identity & Reputation Events

### BotRegistered
Fired when a new bot account is created.

```typescript
interface BotRegistered extends DomainEvent {
  eventType: 'BotRegistered';
  aggregateType: 'BotAccount';
  aggregateId: BotId;
  data: {
    botId: BotId;
    email: Email | null;
    displayName: string;
    initialReputationScore: ReputationScore;
    registeredAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: Create wallet for new bot
- Analytics: Track user growth

---

### BotVerified
Fired when a bot completes verification process.

```typescript
interface BotVerified extends DomainEvent {
  eventType: 'BotVerified';
  aggregateType: 'BotAccount';
  aggregateId: BotId;
  data: {
    botId: BotId;
    verificationMethod: 'email' | 'api_test' | 'manual';
    verifiedAt: Timestamp;
  };
}
```

**Subscribers**:
- Promise Market: Enable listing capabilities
- Email Service: Send welcome email

---

### StakeDeposited
Fired when a bot locks tokens for staking.

```typescript
interface StakeDeposited extends DomainEvent {
  eventType: 'StakeDeposited';
  aggregateType: 'BotAccount';
  aggregateId: BotId;
  data: {
    botId: BotId;
    amount: TokenAmount;
    promiseId: PromiseId | null; // null if general stake
    lockedAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: Lock tokens in wallet
- Promise Market: Enable promise listing if threshold met

---

### StakeWithdrawn
Fired when staked tokens are released back to bot.

```typescript
interface StakeWithdrawn extends DomainEvent {
  eventType: 'StakeWithdrawn';
  aggregateType: 'BotAccount';
  aggregateId: BotId;
  data: {
    botId: BotId;
    amount: TokenAmount;
    promiseId: PromiseId | null;
    releasedAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: Unlock tokens in wallet

---

### ReputationUpdated
Fired when a bot's reputation score changes.

```typescript
interface ReputationUpdated extends DomainEvent {
  eventType: 'ReputationUpdated';
  aggregateType: 'BotAccount';
  aggregateId: BotId;
  data: {
    botId: BotId;
    oldScore: ReputationScore;
    newScore: ReputationScore;
    delta: number;
    reason: string;
    promiseId: PromiseId | null; // if related to promise
    updatedAt: Timestamp;
  };
}
```

**Subscribers**:
- Analytics: Track reputation trends
- Notification Service: Alert bot if reputation drops below threshold
- Promise Market: Update bot's market visibility

---

## Promise Market Events

### PromiseCreated
Fired when a provider bot creates a new promise.

```typescript
interface PromiseCreated extends DomainEvent {
  eventType: 'PromiseCreated';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    specification: {
      modelName: ModelName;
      tokenCount: number;
      responseTimeSLA: Duration;
    };
    pricingTerms: {
      price: TokenAmount;
      stakeAmount: TokenAmount;
    };
    createdAt: Timestamp;
  };
}
```

**Subscribers**:
- Bot Identity: Validate provider has sufficient stake
- Analytics: Track promise creation patterns

---

### PromiseListed
Fired when a promise transitions from Draft to Listed.

```typescript
interface PromiseListed extends DomainEvent {
  eventType: 'PromiseListed';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    specification: PromiseSpecification;
    pricing: PricingTerms;
    listedAt: Timestamp;
  };
}
```

**Subscribers**:
- OrderBook: Add to supply listings
- Search Index: Index for discovery
- Notification Service: Alert matching consumers

---

### PromiseMatched
Fired when order book finds a match for a promise.

```typescript
interface PromiseMatched extends DomainEvent {
  eventType: 'PromiseMatched';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    potentialConsumers: BotId[]; // Bots whose requests match
    matchedAt: Timestamp;
  };
}
```

**Subscribers**:
- Notification Service: Alert provider and consumers
- Analytics: Track matching effectiveness

---

### PromiseAccepted
Fired when a consumer accepts a promise.

```typescript
interface PromiseAccepted extends DomainEvent {
  eventType: 'PromiseAccepted';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    consumerBotId: BotId;
    acceptedAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: Create escrow account
- OrderBook: Remove from listings
- Analytics: Track acceptance rate

---

### PromiseExecutionStarted
Fired when provider begins executing the promise.

```typescript
interface PromiseExecutionStarted extends DomainEvent {
  eventType: 'PromiseExecutionStarted';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    consumerBotId: BotId;
    startedAt: Timestamp;
    expectedCompletionBy: Timestamp; // startedAt + SLA
  };
}
```

**Subscribers**:
- Monitoring: Set up timeout alerts
- Analytics: Track execution times

---

### PromiseExecutionCompleted
Fired when provider claims to have completed execution.

```typescript
interface PromiseExecutionCompleted extends DomainEvent {
  eventType: 'PromiseExecutionCompleted';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    consumerBotId: BotId;
    completedAt: Timestamp;
    executionTime: Duration;
    proofSubmitted: boolean;
  };
}
```

**Subscribers**:
- Settlement & Verification: Initiate settlement case
- Analytics: Track completion rates

---

### PromiseExecutionFailed
Fired when execution fails or times out.

```typescript
interface PromiseExecutionFailed extends DomainEvent {
  eventType: 'PromiseExecutionFailed';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    consumerBotId: BotId;
    failedAt: Timestamp;
    reason: 'timeout' | 'error' | 'provider_cancel' | 'consumer_cancel';
    details: string;
  };
}
```

**Subscribers**:
- Token Management: Return escrow to consumer
- Bot Identity: Update provider reputation (negative)
- Settlement: May still create case if disputed

---

### PromiseCancelled
Fired when a promise is cancelled before execution.

```typescript
interface PromiseCancelled extends DomainEvent {
  eventType: 'PromiseCancelled';
  aggregateType: 'Promise';
  aggregateId: PromiseId;
  data: {
    promiseId: PromiseId;
    providerBotId: BotId;
    consumerBotId: BotId | null;
    cancelledBy: BotId | 'system';
    cancelledAt: Timestamp;
    reason: string;
  };
}
```

**Subscribers**:
- Token Management: Release escrow if any
- OrderBook: Remove from listings

---

## Token Management Events

### TokensDeposited
Fired when tokens are added to a wallet.

```typescript
interface TokensDeposited extends DomainEvent {
  eventType: 'TokensDeposited';
  aggregateType: 'Wallet';
  aggregateId: WalletId;
  data: {
    walletId: WalletId;
    botId: BotId;
    amount: TokenAmount;
    source: 'bridge' | 'transfer' | 'reward' | 'admin';
    transactionId: TransactionId;
    depositedAt: Timestamp;
  };
}
```

**Subscribers**:
- Notification Service: Alert bot of deposit
- Analytics: Track token inflows

---

### TokensWithdrawn
Fired when tokens are removed from a wallet.

```typescript
interface TokensWithdrawn extends DomainEvent {
  eventType: 'TokensWithdrawn';
  aggregateType: 'Wallet';
  aggregateId: WalletId;
  data: {
    walletId: WalletId;
    botId: BotId;
    amount: TokenAmount;
    destination: 'bridge' | 'transfer' | 'escrow';
    transactionId: TransactionId;
    withdrawnAt: Timestamp;
  };
}
```

**Subscribers**:
- Analytics: Track token outflows

---

### TokensEscrowed
Fired when tokens are locked in escrow for a promise.

```typescript
interface TokensEscrowed extends DomainEvent {
  eventType: 'TokensEscrowed';
  aggregateType: 'EscrowAccount';
  aggregateId: EscrowId;
  data: {
    escrowId: EscrowId;
    promiseId: PromiseId;
    consumerWalletId: WalletId;
    consumerBotId: BotId;
    amount: TokenAmount;
    escrowedAt: Timestamp;
  };
}
```

**Subscribers**:
- Promise Market: Confirm escrow before execution
- Analytics: Track escrow volume

---

### TokensReleased
Fired when escrowed tokens are released to provider.

```typescript
interface TokensReleased extends DomainEvent {
  eventType: 'TokensReleased';
  aggregateType: 'EscrowAccount';
  aggregateId: EscrowId;
  data: {
    escrowId: EscrowId;
    promiseId: PromiseId;
    providerWalletId: WalletId;
    providerBotId: BotId;
    amount: TokenAmount;
    platformFee: TokenAmount;
    releasedAt: Timestamp;
  };
}
```

**Subscribers**:
- Analytics: Track successful settlements
- Accounting: Record platform revenue

---

### TokensSlashed
Fired when staked tokens are forfeited due to promise failure.

```typescript
interface TokensSlashed extends DomainEvent {
  eventType: 'TokensSlashed';
  aggregateType: 'EscrowAccount';
  aggregateId: EscrowId;
  data: {
    escrowId: EscrowId;
    promiseId: PromiseId;
    providerBotId: BotId;
    slashedAmount: TokenAmount;
    slashPercentage: number;
    returnedToConsumer: TokenAmount;
    platformPenalty: TokenAmount;
    slashedAt: Timestamp;
  };
}
```

**Subscribers**:
- Bot Identity: Update provider reputation (major negative)
- Analytics: Track slashing rates
- Notification Service: Alert both parties

---

### TransferCompleted
Fired when a direct bot-to-bot transfer completes.

```typescript
interface TransferCompleted extends DomainEvent {
  eventType: 'TransferCompleted';
  aggregateType: 'Wallet';
  aggregateId: WalletId; // From wallet
  data: {
    transactionId: TransactionId;
    fromWalletId: WalletId;
    toWalletId: WalletId;
    fromBotId: BotId;
    toBotId: BotId;
    amount: TokenAmount;
    completedAt: Timestamp;
  };
}
```

**Subscribers**:
- Notification Service: Alert both bots

---

## Settlement & Verification Events

### VerificationStarted
Fired when settlement case begins verification.

```typescript
interface VerificationStarted extends DomainEvent {
  eventType: 'VerificationStarted';
  aggregateType: 'SettlementCase';
  aggregateId: SettlementCaseId;
  data: {
    settlementCaseId: SettlementCaseId;
    promiseId: PromiseId;
    providerBotId: BotId;
    consumerBotId: BotId;
    startedAt: Timestamp;
  };
}
```

**Subscribers**:
- Analytics: Track verification times

---

### VerificationSucceeded
Fired when oracle confirms execution proof is valid.

```typescript
interface VerificationSucceeded extends DomainEvent {
  eventType: 'VerificationSucceeded';
  aggregateType: 'SettlementCase';
  aggregateId: SettlementCaseId;
  data: {
    settlementCaseId: SettlementCaseId;
    promiseId: PromiseId;
    verificationResult: {
      passed: boolean;
      checks: { checkName: string; passed: boolean }[];
    };
    verifiedAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: Trigger token release
- Bot Identity: Update provider reputation (positive)

---

### VerificationFailed
Fired when oracle determines execution proof is invalid.

```typescript
interface VerificationFailed extends DomainEvent {
  eventType: 'VerificationFailed';
  aggregateType: 'SettlementCase';
  aggregateId: SettlementCaseId;
  data: {
    settlementCaseId: SettlementCaseId;
    promiseId: PromiseId;
    failedChecks: string[];
    failedAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: May trigger slashing
- Notification Service: Alert provider to fix or dispute

---

### DisputeRaised
Fired when either party challenges a settlement.

```typescript
interface DisputeRaised extends DomainEvent {
  eventType: 'DisputeRaised';
  aggregateType: 'Dispute';
  aggregateId: DisputeId;
  data: {
    disputeId: DisputeId;
    settlementCaseId: SettlementCaseId;
    promiseId: PromiseId;
    raisedBy: BotId;
    reason: string;
    raisedAt: Timestamp;
  };
}
```

**Subscribers**:
- Notification Service: Alert other party and arbitrators
- Analytics: Track dispute rate

---

### DisputeResolved
Fired when arbitration renders a decision.

```typescript
interface DisputeResolved extends DomainEvent {
  eventType: 'DisputeResolved';
  aggregateType: 'Dispute';
  aggregateId: DisputeId;
  data: {
    disputeId: DisputeId;
    settlementCaseId: SettlementCaseId;
    promiseId: PromiseId;
    decision: 'uphold_verification' | 'overturn_verification' | 'partial_settlement';
    arbitratedBy: string;
    resolvedAt: Timestamp;
  };
}
```

**Subscribers**:
- Settlement: Execute final settlement
- Bot Identity: Update reputations based on decision

---

### SettlementFinalized
Fired when settlement case is completely resolved.

```typescript
interface SettlementFinalized extends DomainEvent {
  eventType: 'SettlementFinalized';
  aggregateType: 'SettlementCase';
  aggregateId: SettlementCaseId;
  data: {
    settlementCaseId: SettlementCaseId;
    promiseId: PromiseId;
    outcome: {
      decision: 'success' | 'failure' | 'partial';
      tokensToProvider: TokenAmount;
      tokensToConsumer: TokenAmount;
      tokensSlashed: TokenAmount;
    };
    finalizedAt: Timestamp;
  };
}
```

**Subscribers**:
- Token Management: Execute final token distribution
- Bot Identity: Apply final reputation adjustments
- Promise Market: Mark promise as settled

---

## Event Patterns

### Event Sourcing
Store all events as immutable log, reconstitute aggregate state by replaying events.

```typescript
class Promise {
  private state: PromiseState;
  private events: DomainEvent[] = [];

  static reconstitute(events: DomainEvent[]): Promise {
    const promise = new Promise();
    events.forEach(event => promise.apply(event));
    return promise;
  }

  private apply(event: DomainEvent): void {
    switch (event.eventType) {
      case 'PromiseCreated':
        this.state = PromiseState.draft();
        break;
      case 'PromiseListed':
        this.state = PromiseState.listed();
        break;
      // ... other events
    }
  }
}
```

### Event Handlers
Subscribers implement handlers for events they care about.

```typescript
class ReputationUpdateHandler {
  async handle(event: PromiseExecutionCompleted): Promise<void> {
    const bot = await this.botRepo.findById(event.data.providerBotId);
    bot.updateReputation(+10, 'Promise fulfilled');
    await this.botRepo.save(bot);
  }
}
```

### Sagas (Process Managers)
Coordinate multi-step workflows across aggregates.

```typescript
class PromiseSettlementSaga {
  async handle(event: PromiseExecutionCompleted): Promise<void> {
    // 1. Create settlement case
    const settlementCase = await this.settlementService.createCase(event.data.promiseId);

    // 2. Trigger verification
    await this.verificationService.verify(settlementCase.id);

    // Wait for VerificationSucceeded or VerificationFailed event
    // Then trigger token release or dispute
  }
}
```

---

**Next**: [Use Cases](./07-use-cases.md)
