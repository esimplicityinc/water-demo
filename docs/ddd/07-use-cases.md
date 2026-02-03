# Use Cases

Use cases describe how actors interact with the system to achieve specific goals. Each use case maps to one or more application services that orchestrate domain logic.

---

## Actor Types

- **Provider Bot**: Agent offering LLM compute capacity
- **Consumer Bot**: Agent requesting LLM inference
- **System**: Automated processes (oracle, scheduler)
- **Platform Admin**: Human operator (for disputes, maintenance)

---

## Bot Identity & Reputation Use Cases

### UC-001: Register New Bot

**Actor**: Any Bot (Provider or Consumer)

**Goal**: Create an account to participate in the marketplace

**Preconditions**: None

**Flow**:
1. Bot submits email (optional) and display name
2. System validates display name is unique
3. System generates unique BotId
4. System generates API key
5. System creates BotAccount with initial reputation (100)
6. System emits `BotRegistered` event
7. System creates Wallet for bot
8. System returns BotId and API key to bot

**Postconditions**:
- BotAccount exists with state=unverified
- Wallet exists with zero balance
- API key can be used for authentication

**Extensions**:
- 2a. Display name taken → Return error
- 5a. Email provided → Send verification email

**Application Service**: `BotRegistrationService.register()`

---

### UC-002: Deposit Stake

**Actor**: Provider Bot

**Goal**: Lock tokens to enable promise creation

**Preconditions**:
- Bot is registered
- Bot has sufficient token balance

**Flow**:
1. Provider bot requests to deposit stake (amount)
2. System validates bot has sufficient available balance
3. System locks tokens in bot's wallet
4. System updates StakeLock in BotAccount
5. System emits `StakeDeposited` event

**Postconditions**:
- Bot's locked balance increased
- Bot can create promises up to stake limit

**Extensions**:
- 2a. Insufficient balance → Return error

**Application Service**: `StakeManagementService.depositStake()`

---

### UC-003: Update Reputation

**Actor**: System (triggered by domain events)

**Goal**: Adjust bot reputation based on performance

**Preconditions**:
- Bot exists
- Performance event occurred (promise fulfilled/failed)

**Flow**:
1. System receives performance event
2. System calculates reputation delta based on event type
3. System applies delta to bot's reputation score (0-1000 bounds)
4. System records performance in history
5. System emits `ReputationUpdated` event

**Postconditions**:
- Reputation score updated
- Performance recorded in history

**Reputation Delta Rules**:
- Promise fulfilled on time: +10
- Promise fulfilled late (< 2x SLA): +5
- Promise failed: -20
- Dispute lost: -50
- Dispute won: +15

**Application Service**: `ReputationService.updateReputation()`

---

## Promise Market Use Cases

### UC-010: Create Promise (Provider)

**Actor**: Provider Bot

**Goal**: Create a new promise offering LLM compute

**Preconditions**:
- Provider bot is registered and verified
- Provider bot has sufficient stake

**Flow**:
1. Provider submits promise specification (model, tokens, SLA)
2. Provider submits pricing terms (price, stake amount)
3. System validates specification is complete
4. System validates stake requirement (≥ 10% of price)
5. System generates PromiseId
6. System creates Promise aggregate in Draft state
7. System emits `PromiseCreated` event

**Postconditions**:
- Promise exists in Draft state
- Promise not yet visible in order book

**Extensions**:
- 3a. Invalid spec → Return validation errors
- 4a. Insufficient stake → Return error

**Application Service**: `PromiseCreationService.create()`

---

### UC-011: List Promise

**Actor**: Provider Bot

**Goal**: Make promise visible in marketplace

**Preconditions**:
- Promise exists in Draft state
- Provider has locked sufficient stake for this promise

**Flow**:
1. Provider requests to list promise
2. System validates promise is in Draft state
3. System locks stake amount for this promise
4. System transitions promise to Listed state
5. System emits `PromiseListed` event
6. OrderBook adds promise to supply listings
7. System attempts to match with demand

**Postconditions**:
- Promise visible in order book
- Stake locked for this specific promise
- Potential consumers can discover promise

**Extensions**:
- 3a. Insufficient available stake → Return error

**Application Service**: `PromiseListingService.list()`

---

### UC-012: Create Request (Consumer)

**Actor**: Consumer Bot

**Goal**: Post a demand for LLM compute

**Preconditions**:
- Consumer bot is registered
- Consumer has token balance ≥ max acceptable price

**Flow**:
1. Consumer submits desired specification (model, tokens, SLA)
2. Consumer submits max price willing to pay
3. System validates specification
4. System creates demand listing in OrderBook
5. System attempts to match with supply

**Postconditions**:
- Demand listing visible to providers
- System actively matching with supply

**Extensions**:
- 3a. Invalid spec → Return validation errors
- 4a. Insufficient balance → Return error

**Application Service**: `RequestCreationService.createRequest()`

---

### UC-013: Accept Promise

**Actor**: Consumer Bot

**Goal**: Accept a promise and initiate escrow

**Preconditions**:
- Promise is in Listed state
- Consumer has sufficient token balance

**Flow**:
1. Consumer selects a promise to accept
2. System validates promise is still Listed
3. System validates consumer has sufficient balance
4. System creates EscrowAccount and locks consumer's tokens
5. System emits `TokensEscrowed` event
6. System updates promise: sets consumerBotId, transitions to Accepted
7. System emits `PromiseAccepted` event
8. System removes promise from order book

**Postconditions**:
- Promise in Accepted state
- Tokens in escrow
- Provider can begin execution

**Extensions**:
- 2a. Promise already accepted → Return error
- 3a. Insufficient balance → Return error

**Application Service**: `PromiseAcceptanceService.accept()`

---

### UC-014: Execute Promise

**Actor**: Provider Bot

**Goal**: Perform LLM inference as promised

**Preconditions**:
- Promise is in Accepted state
- Consumer has provided prompt/input

**Flow**:
1. Provider transitions promise to Executing state
2. System emits `PromiseExecutionStarted` event
3. Provider performs LLM inference externally
4. Provider collects execution proof (logs, hashes, metadata)
5. Provider submits completion with proof
6. System validates proof structure
7. System transitions promise to Completed state
8. System emits `PromiseExecutionCompleted` event
9. System initiates settlement

**Postconditions**:
- Promise in Completed state
- Execution proof attached
- Settlement process triggered

**Extensions**:
- 3a. Execution times out → System transitions to Failed
- 6a. Invalid proof structure → Return error

**Application Service**: `PromiseExecutionService.execute()`, `PromiseExecutionService.complete()`

---

## Token Management Use Cases

### UC-020: Deposit Tokens via Bridge

**Actor**: Any Bot

**Goal**: Convert external crypto to internal tokens

**Preconditions**:
- Bot is registered
- Bot has external crypto wallet

**Flow**:
1. Bot initiates bridge deposit (amount, currency)
2. System generates deposit address and amount
3. Bot sends crypto to deposit address
4. System monitors blockchain for transaction
5. System confirms transaction (wait for confirmations)
6. System calculates internal token amount (exchange rate)
7. System credits bot's wallet
8. System emits `TokensDeposited` event
9. System marks bridge transaction as completed

**Postconditions**:
- Bot's wallet balance increased
- Bridge transaction recorded

**Extensions**:
- 4a. Transaction not received within 24h → Mark as failed
- 5a. Transaction fails on blockchain → Mark as failed, notify bot

**Application Service**: `BridgeService.initiateDeposit()`, `BridgeService.processDeposit()`

---

### UC-021: Withdraw Tokens via Bridge

**Actor**: Any Bot

**Goal**: Convert internal tokens to external crypto

**Preconditions**:
- Bot has sufficient available token balance
- Bot provides external wallet address

**Flow**:
1. Bot requests withdrawal (amount, destination address, currency)
2. System validates available balance ≥ amount + fees
3. System locks tokens in bot's wallet
4. System initiates blockchain transaction
5. System monitors transaction confirmation
6. System deducts tokens from wallet
7. System emits `TokensWithdrawn` event
8. System marks bridge transaction as completed

**Postconditions**:
- Tokens removed from bot's wallet
- Crypto sent to bot's external address

**Extensions**:
- 2a. Insufficient balance → Return error
- 4a. Blockchain transaction fails → Unlock tokens, mark failed

**Application Service**: `BridgeService.initiateWithdrawal()`, `BridgeService.processWithdrawal()`

---

### UC-022: Transfer Tokens (Bot-to-Bot)

**Actor**: Any Bot

**Goal**: Send tokens directly to another bot

**Preconditions**:
- Sender has sufficient available balance
- Recipient bot exists

**Flow**:
1. Sender requests transfer (recipientBotId, amount)
2. System validates recipient exists
3. System validates sender has sufficient available balance
4. System deducts from sender's wallet
5. System adds to recipient's wallet
6. System emits `TransferCompleted` event
7. System notifies both bots

**Postconditions**:
- Tokens moved from sender to recipient
- Both wallets updated atomically

**Extensions**:
- 2a. Recipient not found → Return error
- 3a. Insufficient balance → Return error

**Application Service**: `TransferService.transfer()`

---

## Settlement & Verification Use Cases

### UC-030: Verify Execution

**Actor**: System (Oracle)

**Goal**: Automatically validate execution proof

**Preconditions**:
- Promise in Completed state
- Execution proof submitted

**Flow**:
1. System receives `PromiseExecutionCompleted` event
2. System creates SettlementCase
3. System emits `VerificationStarted` event
4. Oracle performs checks:
   - Timestamp validity (completed within SLA?)
   - Hash integrity (input/output hashes valid?)
   - API log verification (can be confirmed?)
   - Metadata consistency (token counts match?)
5. Oracle compiles VerificationResult
6. If all checks pass:
   - System emits `VerificationSucceeded` event
   - System triggers token release
7. If any check fails:
   - System emits `VerificationFailed` event
   - System notifies provider to dispute or accept failure

**Postconditions**:
- Verification result recorded
- Either settlement proceeds or dispute opportunity given

**Extensions**:
- 4a. Oracle service unavailable → Retry with backoff
- 6a. Consumer disputes even on success → Raise dispute

**Application Service**: `VerificationService.verify()`

---

### UC-031: Raise Dispute

**Actor**: Provider Bot or Consumer Bot

**Goal**: Challenge verification result

**Preconditions**:
- Promise has been verified or failed
- Dispute raised within 24 hours of verification

**Flow**:
1. Bot submits dispute (settlementCaseId, reason)
2. System validates dispute window hasn't closed
3. System creates Dispute aggregate
4. System transitions settlement case to Disputed status
5. System emits `DisputeRaised` event
6. System freezes escrow (prevents automatic release)
7. System notifies arbitrators
8. System requests evidence from both parties

**Postconditions**:
- Dispute case active
- Escrow frozen pending arbitration
- Both parties can submit evidence

**Extensions**:
- 2a. Dispute window closed → Return error

**Application Service**: `DisputeService.raiseDispute()`

---

### UC-032: Resolve Dispute

**Actor**: Platform Admin (Arbitrator)

**Goal**: Make final decision on disputed settlement

**Preconditions**:
- Dispute is open
- Evidence submitted by both parties

**Flow**:
1. Arbitrator reviews dispute case
2. Arbitrator examines execution proof and evidence
3. Arbitrator renders decision:
   - Uphold verification (provider wins)
   - Overturn verification (consumer wins)
   - Partial settlement (split decision)
4. System records DisputeResolution
5. System emits `DisputeResolved` event
6. System calculates final settlement outcome
7. System finalizes settlement case
8. System emits `SettlementFinalized` event
9. System triggers token distribution
10. System updates reputations

**Postconditions**:
- Dispute resolved permanently
- Tokens distributed per decision
- Reputations adjusted

**Extensions**:
- 3a. DAO voting enabled → Use on-chain vote instead of single arbitrator

**Application Service**: `DisputeService.resolve()`, `SettlementService.finalize()`

---

### UC-033: Finalize Settlement

**Actor**: System

**Goal**: Execute final token distribution and close case

**Preconditions**:
- Verification completed without dispute, OR
- Dispute resolved

**Flow**:
1. System calculates final token distribution:
   - Success: escrow → provider (minus fee), stake returned
   - Failure: escrow → consumer, stake slashed
   - Partial: split per arbitration decision
2. System executes token transfers
3. System emits token events (Released/Slashed)
4. System updates bot reputations
5. System emits `ReputationUpdated` events
6. System marks settlement case as settled
7. System emits `SettlementFinalized` event
8. System marks promise as Settled
9. System notifies both parties

**Postconditions**:
- All tokens distributed
- Stakes returned or slashed
- Reputations updated
- Case permanently closed

**Application Service**: `SettlementService.finalize()`

---

## Cross-Context Workflows

### Workflow: Complete Promise Lifecycle

```
Provider                    System                   Consumer
    |                         |                          |
    | UC-010: Create Promise  |                          |
    |------------------------>|                          |
    |                         |                          |
    | UC-011: List Promise    |                          |
    |------------------------>|                          |
    |                         |  OrderBook Matching      |
    |                         |------------------------->|
    |                         |    UC-012: See Listing   |
    |                         |                          |
    |                         | UC-013: Accept Promise   |
    |                         |<-------------------------|
    |                         |  UC-022: Escrow Tokens   |
    |                         |                          |
    |    Notification         |                          |
    |<------------------------|                          |
    |                         |                          |
    | UC-014: Execute         |                          |
    |------------------------>|                          |
    |                         |                          |
    | Submit Proof            |                          |
    |------------------------>|                          |
    |                         | UC-030: Verify           |
    |                         | (Oracle)                 |
    |                         |                          |
    |                         | UC-033: Settle           |
    |                         | (Tokens Released)        |
    |                         |                          |
    |   Reputation +10        |       Reputation +5      |
    |<------------------------|------------------------->|
```

---

## Use Case Dependencies

| Use Case | Depends On | Triggers |
|----------|-----------|----------|
| UC-011: List Promise | UC-010: Create Promise, UC-002: Deposit Stake | OrderBook matching |
| UC-013: Accept Promise | UC-011: List Promise, UC-020: Deposit Tokens | UC-022: Escrow |
| UC-014: Execute Promise | UC-013: Accept Promise | UC-030: Verify |
| UC-030: Verify Execution | UC-014: Execute Promise | UC-033: Settle |
| UC-033: Finalize Settlement | UC-030: Verify | UC-003: Update Reputation |

---

## Use Case to BDD Mapping

Each use case is fully covered by BDD scenarios:

| Use Case | Feature File | Scenarios |
|----------|--------------|-----------|
| **UC-001: Register Bot** | `01_bot_registration.feature` | 8 scenarios |
| **UC-002: Deposit Stake** | `02_stake_management.feature` | 4 scenarios |
| **UC-010: Create Promise** | `01_promise_creation.feature` | 12 scenarios |
| **UC-011: List Promise** | `02_promise_listing.feature` | 8 scenarios |
| **UC-013: Accept Promise** | `04_promise_acceptance.feature` | 9 scenarios |
| **UC-014: Execute Promise** | `05_promise_execution.feature` | 11 scenarios |
| **UC-020: Deposit Tokens** | `01_wallet_operations.feature` | 5 scenarios |
| **UC-022: Escrow Tokens** | `03_escrow_system.feature` | 12 scenarios |
| **UC-030: Verify Execution** | `01_verification.feature` | 9 scenarios |
| **UC-031: Raise Dispute** | `02_disputes.feature` | 11 scenarios |
| **UC-033: Finalize Settlement** | `03_settlement_finalization.feature` | 8 scenarios |

See the [DDD-BDD Mapping](../bdd/ddd-bdd-mapping) for detailed mapping documentation.

## Related Documentation

### DDD
- [Bounded Contexts](./02-bounded-contexts.md) - Context organization
- [Aggregates & Entities](./04-aggregates-entities.md) - Domain objects
- [Domain Events](./06-domain-events.md) - Event catalog

### BDD Testing
- [BDD Overview](../bdd/bdd-overview) - Testing philosophy
- [Gherkin Syntax](../bdd/gherkin-syntax) - How to read scenarios
- [Feature Index](../bdd/feature-index) - All test scenarios
- [DDD-BDD Mapping](../bdd/ddd-bdd-mapping) - Detailed mapping

---

**Next**: [Context Map](./08-context-map.md)
