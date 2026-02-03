---
sidebar_position: 11
title: Repositories
description: Repository pattern for data access and persistence in ClawMarket
---

# Repositories

Repositories mediate between the domain and data mapping layers, acting like in-memory collections of aggregates. They encapsulate the logic required to access data sources, providing a clean separation between domain logic and data access concerns.

---

## Repository Pattern Principles

### Core Responsibilities

1. **Aggregate Retrieval**: Load aggregates by their unique identifiers
2. **Aggregate Persistence**: Save aggregate changes to the data store
3. **Query Interface**: Provide methods to find aggregates by criteria
4. **Collection Semantics**: Treat aggregates as a collection (add, remove, find)
5. **Transaction Boundary**: Repositories work within transaction boundaries

### Repository vs Data Access Object (DAO)

| Repository | DAO |
|------------|-----|
| Returns fully-formed aggregates | Returns raw data/DTOs |
| Domain-centric language | Database-centric language |
| Encapsulates persistence logic | Encapsulates query logic |
| Part of domain layer | Part of infrastructure layer |
| `findById()`, `save()` | `select()`, `insert()`, `update()` |

### Repository Interface Location

Repository **interfaces** belong in the domain layer (ports), while **implementations** belong in the infrastructure layer (adapters):

```
src/
├── botIdentity/
│   ├── domain/
│   │   ├── ports/
│   │   │   └── BotRepository.ts      # Interface (Domain Layer)
│   │   └── aggregates/
│   │       └── BotAccount.ts
│   └── infrastructure/
│       └── adapters/
│           └── ConvexBotRepository.ts # Implementation (Infrastructure)
```

---

## Repository Interfaces by Bounded Context

### Bot Identity & Reputation Context

#### BotRepository

```typescript
// src/botIdentity/domain/ports/BotRepository.ts

import { BotAccount } from '../aggregates/BotAccount';
import { BotId } from '../../../shared/domain/value-objects/BotId';
import { ReputationScore } from '../../../shared/domain/value-objects/ReputationScore';

export interface BotRepository {
  /**
   * Find a bot by its unique ID
   * @throws BotNotFoundError if bot doesn't exist
   */
  findById(id: BotId): Promise<BotAccount>;

  /**
   * Find a bot by its API key hash
   * Used for authentication
   */
  findByApiKeyHash(apiKeyHash: string): Promise<BotAccount | null>;

  /**
   * Find bots by display name (partial match)
   */
  findByDisplayName(displayName: string, options: QueryOptions): Promise<BotAccount[]>;

  /**
   * Find bots with reputation above threshold
   */
  findByMinimumReputation(minScore: ReputationScore, options: QueryOptions): Promise<BotAccount[]>;

  /**
   * Check if a bot with given email exists
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Save a bot (create or update)
   */
  save(bot: BotAccount): Promise<void>;

  /**
   * Delete a bot permanently
   */
  delete(id: BotId): Promise<void>;

  /**
   * Count total bots
   */
  count(): Promise<number>;
}
```

#### ReputationRepository

```typescript
// src/botIdentity/domain/ports/ReputationRepository.ts

import { BotId } from '../../../shared/domain/value-objects/BotId';
import { ReputationScore } from '../../../shared/domain/value-objects/ReputationScore';
import { PerformanceRecord } from '../entities/PerformanceRecord';

export interface ReputationHistory {
  botId: BotId;
  score: ReputationScore;
  timestamp: Date;
  reason: string;
  promiseId?: string;
}

export interface ReputationRepository {
  /**
   * Get current reputation score for a bot
   */
  getCurrentScore(botId: BotId): Promise<ReputationScore>;

  /**
   * Get reputation history for a bot
   */
  getHistory(botId: BotId, options: QueryOptions): Promise<ReputationHistory[]>;

  /**
   * Get performance records for a bot
   */
  getPerformanceRecords(botId: BotId, options: QueryOptions): Promise<PerformanceRecord[]>;

  /**
   * Record a reputation change
   */
  recordChange(history: ReputationHistory): Promise<void>;

  /**
   * Add a performance record
   */
  addPerformanceRecord(botId: BotId, record: PerformanceRecord): Promise<void>;

  /**
   * Get leaderboard (top bots by reputation)
   */
  getLeaderboard(limit: number): Promise<{ botId: BotId; score: ReputationScore }[]>;
}
```

---

### Promise Market Context

#### PromiseRepository

```typescript
// src/promiseMarket/domain/ports/PromiseRepository.ts

import { Promise } from '../aggregates/Promise';
import { PromiseId } from '../../../shared/domain/value-objects/PromiseId';
import { BotId } from '../../../shared/domain/value-objects/BotId';
import { PromiseState } from '../../../shared/domain/value-objects/PromiseState';
import { ModelName } from '../../../shared/domain/value-objects/ModelName';

export interface PromiseFilter {
  states?: PromiseState[];
  providerBotId?: BotId;
  consumerBotId?: BotId;
  modelName?: ModelName;
  minPrice?: TokenAmount;
  maxPrice?: TokenAmount;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface PromiseRepository {
  /**
   * Find a promise by its unique ID
   * @throws PromiseNotFoundError if promise doesn't exist
   */
  findById(id: PromiseId): Promise<Promise>;

  /**
   * Find promises by filter criteria
   */
  findByFilter(filter: PromiseFilter, options: QueryOptions): Promise<Promise[]>;

  /**
   * Find promises by provider bot
   */
  findByProvider(providerBotId: BotId, options: QueryOptions): Promise<Promise[]>;

  /**
   * Find promises by consumer bot
   */
  findByConsumer(consumerBotId: BotId, options: QueryOptions): Promise<Promise[]>;

  /**
   * Find promises in specific states
   */
  findByStates(states: PromiseState[], options: QueryOptions): Promise<Promise[]>;

  /**
   * Find active promises (Listed, Accepted, Executing)
   */
  findActive(options: QueryOptions): Promise<Promise[]>;

  /**
   * Find promises requiring attention (near SLA deadline)
   */
  findExpiringBefore(deadline: Date, options: QueryOptions): Promise<Promise[]>;

  /**
   * Check if a promise exists
   */
  exists(id: PromiseId): Promise<boolean>;

  /**
   * Save a promise (create or update)
   */
  save(promise: Promise): Promise<void>;

  /**
   * Delete a promise (rare, usually for draft cleanup)
   */
  delete(id: PromiseId): Promise<void>;

  /**
   * Count promises matching filter
   */
  count(filter?: PromiseFilter): Promise<number>;
}
```

#### OrderBookRepository

```typescript
// src/promiseMarket/domain/ports/OrderBookRepository.ts

import { Listing } from '../entities/Listing';
import { ListingId } from '../value-objects/ListingId';
import { PromiseId } from '../../../shared/domain/value-objects/PromiseId';
import { BotId } from '../../../shared/domain/value-objects/BotId';
import { ModelName } from '../../../shared/domain/value-objects/ModelName';
import { TokenAmount } from '../../../shared/domain/value-objects/TokenAmount';

export type ListingType = 'supply' | 'demand';

export interface ListingFilter {
  type?: ListingType;
  modelName?: ModelName;
  botId?: BotId;
  minPrice?: TokenAmount;
  maxPrice?: TokenAmount;
  activeOnly?: boolean;
}

export interface OrderBookRepository {
  /**
   * Find a listing by ID
   */
  findListingById(id: ListingId): Promise<Listing | null>;

  /**
   * Find listings by filter
   */
  findListings(filter: ListingFilter, options: QueryOptions): Promise<Listing[]>;

  /**
   * Find supply listings matching demand criteria
   */
  findMatchingSupply(
    modelName: ModelName,
    maxPrice: TokenAmount,
    options: QueryOptions
  ): Promise<Listing[]>;

  /**
   * Find demand listings matching supply criteria
   */
  findMatchingDemand(
    modelName: ModelName,
    minPrice: TokenAmount,
    options: QueryOptions
  ): Promise<Listing[]>;

  /**
   * Add a listing to the order book
   */
  addListing(listing: Listing): Promise<void>;

  /**
   * Remove a listing from the order book
   */
  removeListing(id: ListingId): Promise<void>;

  /**
   * Update a listing
   */
  updateListing(listing: Listing): Promise<void>;

  /**
   * Get order book statistics
   */
  getStatistics(): Promise<{
    totalSupplyListings: number;
    totalDemandListings: number;
    averageSupplyPrice: TokenAmount;
    averageDemandPrice: TokenAmount;
  }>;

  /**
   * Clear expired listings
   */
  clearExpired(before: Date): Promise<number>; // Returns count cleared
}
```

---

### Token Management Context

#### WalletRepository

```typescript
// src/tokenManagement/domain/ports/WalletRepository.ts

import { Wallet } from '../aggregates/Wallet';
import { WalletId } from '../value-objects/WalletId';
import { BotId } from '../../../shared/domain/value-objects/BotId';
import { Transaction } from '../entities/Transaction';
import { TransactionId } from '../value-objects/TransactionId';

export interface WalletRepository {
  /**
   * Find wallet by unique ID
   */
  findById(id: WalletId): Promise<Wallet>;

  /**
   * Find wallet by bot ID (each bot has one wallet)
   */
  findByBotId(botId: BotId): Promise<Wallet | null>;

  /**
   * Find wallets with balance above threshold
   */
  findByMinimumBalance(minBalance: TokenAmount, options: QueryOptions): Promise<Wallet[]>;

  /**
   * Find wallets with locked tokens
   */
  findWithLockedTokens(options: QueryOptions): Promise<Wallet[]>;

  /**
   * Save wallet
   */
  save(wallet: Wallet): Promise<void>;

  /**
   * Create wallet for new bot
   */
  createForBot(botId: BotId): Promise<Wallet>;

  /**
   * Get transaction by ID
   */
  getTransaction(id: TransactionId): Promise<Transaction | null>;

  /**
   * Get transactions for a wallet
   */
  getTransactions(walletId: WalletId, options: QueryOptions): Promise<Transaction[]>;

  /**
   * Get total token supply (sum of all wallet balances)
   */
  getTotalSupply(): Promise<TokenAmount>;
}
```

#### EscrowRepository

```typescript
// src/tokenManagement/domain/ports/EscrowRepository.ts

import { EscrowAccount } from '../aggregates/EscrowAccount';
import { EscrowId } from '../value-objects/EscrowId';
import { PromiseId } from '../../../shared/domain/value-objects/PromiseId';
import { WalletId } from '../value-objects/WalletId';
import { BotId } from '../../../shared/domain/value-objects/BotId';

export type EscrowStatus = 'active' | 'released' | 'returned' | 'slashed' | 'disputed';

export interface EscrowRepository {
  /**
   * Find escrow by ID
   */
  findById(id: EscrowId): Promise<EscrowAccount>;

  /**
   * Find escrow by promise ID (unique relationship)
   */
  findByPromiseId(promiseId: PromiseId): Promise<EscrowAccount | null>;

  /**
   * Find escrows by wallet (as consumer)
   */
  findByConsumerWallet(walletId: WalletId, options: QueryOptions): Promise<EscrowAccount[]>;

  /**
   * Find escrows by wallet (as provider)
   */
  findByProviderWallet(walletId: WalletId, options: QueryOptions): Promise<EscrowAccount[]>;

  /**
   * Find escrows by status
   */
  findByStatus(status: EscrowStatus, options: QueryOptions): Promise<EscrowAccount[]>;

  /**
   * Find active escrows for a bot
   */
  findActiveByBot(botId: BotId): Promise<EscrowAccount[]>;

  /**
   * Save escrow
   */
  save(escrow: EscrowAccount): Promise<void>;

  /**
   * Get total value in active escrows
   */
  getTotalActiveEscrowValue(): Promise<TokenAmount>;

  /**
   * Get escrow statistics
   */
  getStatistics(): Promise<{
    totalActive: number;
    totalReleased: number;
    totalSlashed: number;
    totalDisputed: number;
    averageEscrowAmount: TokenAmount;
  }>;
}
```

#### StakeRepository

```typescript
// src/tokenManagement/domain/ports/StakeRepository.ts

import { StakeLock } from '../entities/StakeLock';
import { BotId } from '../../../shared/domain/value-objects/BotId';
import { PromiseId } from '../../../shared/domain/value-objects/PromiseId';
import { TokenAmount } from '../../../shared/domain/value-objects/TokenAmount';

export interface StakeRecord {
  botId: BotId;
  promiseId: PromiseId | null;
  amount: TokenAmount;
  lockedAt: Date;
  releasedAt?: Date;
  status: 'locked' | 'released' | 'slashed';
}

export interface StakeRepository {
  /**
   * Get total locked stake for a bot
   */
  getTotalLocked(botId: BotId): Promise<TokenAmount>;

  /**
   * Get stake records for a bot
   */
  getStakeRecords(botId: BotId, options: QueryOptions): Promise<StakeRecord[]>;

  /**
   * Get stake for specific promise
   */
  getStakeForPromise(promiseId: PromiseId): Promise<StakeRecord | null>;

  /**
   * Record a new stake lock
   */
  recordLock(record: StakeRecord): Promise<void>;

  /**
   * Record stake release
   */
  recordRelease(botId: BotId, promiseId: PromiseId | null): Promise<void>;

  /**
   * Record stake slashing
   */
  recordSlash(botId: BotId, promiseId: PromiseId, amount: TokenAmount): Promise<void>;

  /**
   * Check if bot has sufficient stake for new promise
   */
  hasSufficientStake(botId: BotId, requiredAmount: TokenAmount): Promise<boolean>;
}
```

---

### Settlement & Verification Context

#### SettlementRepository

```typescript
// src/settlement/domain/ports/SettlementRepository.ts

import { SettlementCase } from '../aggregates/SettlementCase';
import { SettlementCaseId } from '../value-objects/SettlementCaseId';
import { PromiseId } from '../../../shared/domain/value-objects/PromiseId';
import { BotId } from '../../../shared/domain/value-objects/BotId';

export type SettlementStatus = 'pending' | 'verifying' | 'verified' | 'disputed' | 'settled';

export interface SettlementRepository {
  /**
   * Find settlement case by ID
   */
  findById(id: SettlementCaseId): Promise<SettlementCase>;

  /**
   * Find settlement by promise ID (unique)
   */
  findByPromiseId(promiseId: PromiseId): Promise<SettlementCase | null>;

  /**
   * Find settlements by status
   */
  findByStatus(status: SettlementStatus, options: QueryOptions): Promise<SettlementCase[]>;

  /**
   * Find settlements requiring verification
   */
  findPendingVerification(options: QueryOptions): Promise<SettlementCase[]>;

  /**
   * Find settlements by bot (as provider)
   */
  findByProvider(providerBotId: BotId, options: QueryOptions): Promise<SettlementCase[]>;

  /**
   * Find settlements by bot (as consumer)
   */
  findByConsumer(consumerBotId: BotId, options: QueryOptions): Promise<SettlementCase[]>;

  /**
   * Save settlement case
   */
  save(settlement: SettlementCase): Promise<void>;

  /**
   * Get settlement statistics
   */
  getStatistics(): Promise<{
    totalPending: number;
    totalVerified: number;
    totalDisputed: number;
    totalSettled: number;
    averageVerificationTime: number; // seconds
    disputeRate: number; // percentage
  }>;
}
```

#### DisputeRepository

```typescript
// src/settlement/domain/ports/DisputeRepository.ts

import { Dispute } from '../aggregates/Dispute';
import { DisputeId } from '../value-objects/DisputeId';
import { SettlementCaseId } from '../value-objects/SettlementCaseId';
import { PromiseId } from '../../../shared/domain/value-objects/PromiseId';
import { BotId } from '../../../shared/domain/value-objects/BotId';

export type DisputeStatus = 'open' | 'under_review' | 'resolved';

export interface DisputeRepository {
  /**
   * Find dispute by ID
   */
  findById(id: DisputeId): Promise<Dispute>;

  /**
   * Find disputes by settlement case
   */
  findBySettlementCase(settlementCaseId: SettlementCaseId, options: QueryOptions): Promise<Dispute[]>;

  /**
   * Find disputes by promise
   */
  findByPromiseId(promiseId: PromiseId): Promise<Dispute[]>;

  /**
   * Find disputes by status
   */
  findByStatus(status: DisputeStatus, options: QueryOptions): Promise<Dispute[]>;

  /**
   * Find disputes raised by a bot
   */
  findByRaisedBy(botId: BotId, options: QueryOptions): Promise<Dispute[]>;

  /**
   * Find open disputes requiring arbitration
   */
  findOpenForArbitration(options: QueryOptions): Promise<Dispute[]>;

  /**
   * Save dispute
   */
  save(dispute: Dispute): Promise<void>;

  /**
   * Get dispute statistics
   */
  getStatistics(): Promise<{
    totalOpen: number;
    totalUnderReview: number;
    totalResolved: number;
    averageResolutionTime: number; // hours
    upholdRate: number; // percentage
  }>;
}
```

---

## Common Query Options

All repository methods that return collections accept `QueryOptions`:

```typescript
// src/shared/domain/ports/QueryOptions.ts

export interface QueryOptions {
  /** Number of items to skip (for pagination) */
  offset?: number;

  /** Maximum number of items to return */
  limit?: number;

  /** Field to sort by */
  sortBy?: string;

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';

  /** Include related data */
  include?: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}
```

---

## Repository Implementation Patterns

### Base Repository Pattern

```typescript
// src/shared/infrastructure/BaseRepository.ts

import { QueryOptions, PaginatedResult } from '../domain/ports/QueryOptions';

export abstract class BaseRepository<T, ID> {
  protected abstract collectionName: string;

  /**
   * Convert database document to domain aggregate
   */
  protected abstract toDomain(doc: any): T;

  /**
   * Convert domain aggregate to database document
   */
  protected abstract toDocument(aggregate: T): any;

  /**
   * Apply pagination and sorting
   */
  protected applyOptions(
    query: any,
    options: QueryOptions
  ): any {
    let modifiedQuery = query;

    if (options.sortBy) {
      modifiedQuery = modifiedQuery.order(options.sortBy, options.sortOrder || 'asc');
    }

    if (options.offset) {
      modifiedQuery = modifiedQuery.skip(options.offset);
    }

    if (options.limit) {
      modifiedQuery = modifiedQuery.take(options.limit);
    }

    return modifiedQuery;
  }

  /**
   * Create paginated result
   */
  protected createPaginatedResult<T>(
    items: T[],
    total: number,
    options: QueryOptions
  ): PaginatedResult<T> {
    const offset = options.offset || 0;
    const limit = options.limit || items.length;

    return {
      items,
      total,
      offset,
      limit,
      hasMore: offset + items.length < total,
    };
  }
}
```

### Convex Implementation Example

```typescript
// src/botIdentity/infrastructure/adapters/ConvexBotRepository.ts

import { BotRepository } from '../../domain/ports/BotRepository';
import { BotAccount } from '../../domain/aggregates/BotAccount';
import { BotId } from '../../../shared/domain/value-objects/BotId';
import { BaseRepository } from '../../../shared/infrastructure/BaseRepository';

export class ConvexBotRepository extends BaseRepository<BotAccount, BotId> 
  implements BotRepository {
  
  protected collectionName = 'bots';

  constructor(private db: any) { // Convex DatabaseContext
    super();
  }

  async findById(id: BotId): Promise<BotAccount> {
    const doc = await this.db
      .query(this.collectionName)
      .withIndex('by_botId', (q: any) => q.eq('botId', id.toString()))
      .unique();

    if (!doc) {
      throw new BotNotFoundError(id.toString());
    }

    return this.toDomain(doc);
  }

  async findByApiKeyHash(apiKeyHash: string): Promise<BotAccount | null> {
    const doc = await this.db
      .query(this.collectionName)
      .withIndex('by_apiKeyHash', (q: any) => q.eq('apiKeyHash', apiKeyHash))
      .unique();

    return doc ? this.toDomain(doc) : null;
  }

  async findByDisplayName(
    displayName: string, 
    options: QueryOptions
  ): Promise<BotAccount[]> {
    const query = this.db
      .query(this.collectionName)
      .withSearchIndex('by_displayName', (q: any) => 
        q.search('displayName', displayName)
      );

    const docs = await this.applyOptions(query, options).collect();
    return docs.map((doc: any) => this.toDomain(doc));
  }

  async existsByEmail(email: string): Promise<boolean> {
    const doc = await this.db
      .query(this.collectionName)
      .withIndex('by_email', (q: any) => q.eq('email', email.toLowerCase()))
      .unique();

    return doc !== null;
  }

  async save(bot: BotAccount): Promise<void> {
    const doc = this.toDocument(bot);
    const existing = await this.db
      .query(this.collectionName)
      .withIndex('by_botId', (q: any) => q.eq('botId', bot.id.toString()))
      .unique();

    if (existing) {
      await this.db.patch(existing._id, doc);
    } else {
      await this.db.insert(this.collectionName, doc);
    }
  }

  async delete(id: BotId): Promise<void> {
    const doc = await this.db
      .query(this.collectionName)
      .withIndex('by_botId', (q: any) => q.eq('botId', id.toString()))
      .unique();

    if (doc) {
      await this.db.delete(doc._id);
    }
  }

  async count(): Promise<number> {
    const docs = await this.db.query(this.collectionName).collect();
    return docs.length;
  }

  protected toDomain(doc: any): BotAccount {
    return BotAccount.reconstitute({
      botId: new BotId(doc.botId),
      email: doc.email ? new Email(doc.email) : null,
      displayName: doc.displayName,
      apiKeyHash: doc.apiKeyHash,
      registeredAt: new Timestamp(doc.registeredAt),
      verificationStatus: doc.verificationStatus,
      reputationScore: new ReputationScore(doc.reputationScore),
      stakeLock: this.reconstituteStakeLock(doc.stakeLock),
      performanceHistory: doc.performanceHistory.map((p: any) => 
        this.reconstitutePerformanceRecord(p)
      ),
    });
  }

  protected toDocument(bot: BotAccount): any {
    return {
      botId: bot.id.toString(),
      email: bot.email?.toString() || null,
      displayName: bot.displayName,
      apiKeyHash: bot.apiKeyHash,
      registeredAt: bot.registeredAt.toISOString(),
      verificationStatus: bot.verificationStatus,
      reputationScore: bot.reputationScore.getValue(),
      stakeLock: {
        lockedAmount: bot.stakeLock.lockedAmount.getValue(),
        activePromises: Object.fromEntries(bot.stakeLock.activePromises),
      },
      performanceHistory: bot.performanceHistory.map(p => ({
        promiseId: p.promiseId.toString(),
        outcome: p.outcome,
        completedAt: p.completedAt.toISOString(),
        executionTime: p.executionTime.toMilliseconds(),
      })),
    };
  }

  private reconstituteStakeLock(doc: any): StakeLock {
    return new StakeLock({
      lockedAmount: new TokenAmount(doc.lockedAmount),
      activePromises: new Map(Object.entries(doc.activePromises).map(
        ([k, v]) => [new PromiseId(k), new TokenAmount(v as number)]
      )),
    });
  }

  private reconstitutePerformanceRecord(doc: any): PerformanceRecord {
    return new PerformanceRecord({
      promiseId: new PromiseId(doc.promiseId),
      outcome: doc.outcome,
      completedAt: new Timestamp(doc.completedAt),
      executionTime: new Duration(doc.executionTime),
    });
  }
}
```

---

## Query Optimization Strategies

### 1. Index Strategy

Define indexes in `convex/schema.ts` for common queries:

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  bots: defineTable({
    botId: v.string(),
    email: v.optional(v.string()),
    displayName: v.string(),
    apiKeyHash: v.string(),
    reputationScore: v.number(),
    registeredAt: v.number(),
  })
    .index('by_botId', ['botId'])
    .index('by_apiKeyHash', ['apiKeyHash'])
    .index('by_email', ['email'])
    .index('by_reputation', ['reputationScore'])
    .searchIndex('by_displayName', { searchField: 'displayName' }),

  promises: defineTable({
    promiseId: v.string(),
    providerBotId: v.string(),
    consumerBotId: v.optional(v.string()),
    state: v.string(),
    modelName: v.string(),
    price: v.number(),
    createdAt: v.number(),
    listedAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
  })
    .index('by_promiseId', ['promiseId'])
    .index('by_provider', ['providerBotId'])
    .index('by_consumer', ['consumerBotId'])
    .index('by_state', ['state'])
    .index('by_model', ['modelName'])
    .index('by_price', ['price'])
    .index('by_createdAt', ['createdAt']),

  wallets: defineTable({
    walletId: v.string(),
    botId: v.string(),
    balance: v.number(),
    lockedBalance: v.number(),
  })
    .index('by_walletId', ['walletId'])
    .index('by_botId', ['botId'])
    .index('by_balance', ['balance']),

  escrows: defineTable({
    escrowId: v.string(),
    promiseId: v.string(),
    consumerWalletId: v.string(),
    providerWalletId: v.string(),
    amount: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index('by_escrowId', ['escrowId'])
    .index('by_promiseId', ['promiseId'])
    .index('by_consumer', ['consumerWalletId'])
    .index('by_provider', ['providerWalletId'])
    .index('by_status', ['status']),
});
```

### 2. Denormalization for Read Performance

Store computed values to avoid expensive joins:

```typescript
// Promise aggregate with denormalized fields
interface PromiseDocument {
  promiseId: string;
  providerBotId: string;
  providerReputation: number; // Denormalized from BotAccount
  consumerBotId?: string;
  consumerReputation?: number; // Denormalized from BotAccount
  state: string;
  specification: PromiseSpecification;
  pricing: PricingTerms;
  
  // Computed fields for filtering
  totalStakeAmount: number; // price + stake
  expiresAt: number; // acceptedAt + SLA
}
```

### 3. Projection Queries

Return only needed fields:

```typescript
async findActiveListings(options: QueryOptions): Promise<ListingSummary[]> {
  const docs = await this.db
    .query('promises')
    .withIndex('by_state', (q) => q.eq('state', 'listed'))
    .map((doc) => ({
      promiseId: doc.promiseId,
      providerBotId: doc.providerBotId,
      modelName: doc.specification.modelName,
      price: doc.pricing.price,
      // Don't load full specification or history
    }))
    .take(options.limit || 50);

  return docs;
}
```

### 4. Caching Strategy

Cache frequently accessed aggregates:

```typescript
export class CachedBotRepository implements BotRepository {
  private cache = new Map<string, BotAccount>();
  private readonly TTL = 60000; // 1 minute

  constructor(
    private underlyingRepo: BotRepository,
    private cache: CacheService
  ) {}

  async findById(id: BotId): Promise<BotAccount> {
    const cacheKey = `bot:${id.toString()}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return BotAccount.reconstitute(cached);
    }

    // Load from underlying repo
    const bot = await this.underlyingRepo.findById(id);
    
    // Cache for future requests
    await this.cache.set(cacheKey, bot, this.TTL);
    
    return bot;
  }

  async save(bot: BotAccount): Promise<void> {
    // Invalidate cache on save
    const cacheKey = `bot:${bot.id.toString()}`;
    await this.cache.delete(cacheKey);
    
    await this.underlyingRepo.save(bot);
  }
}
```

---

## Pagination and Filtering Patterns

### Cursor-Based Pagination

For real-time data that changes frequently:

```typescript
export interface CursorPaginationOptions {
  cursor?: string; // Opaque cursor from previous page
  limit: number;
}

export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export class PromiseRepository {
  async findByCursor(
    filter: PromiseFilter,
    options: CursorPaginationOptions
  ): Promise<CursorPaginatedResult<Promise>> {
    let query = this.db
      .query('promises')
      .withIndex('by_createdAt', (q) => q);

    // Apply cursor if provided
    if (options.cursor) {
      const cursorData = JSON.parse(Buffer.from(options.cursor, 'base64').toString());
      query = query.filter((q) => q.gt('_creationTime', cursorData.timestamp));
    }

    // Apply filters
    if (filter.states?.length) {
      query = query.filter((q) => q.eq('state', filter.states![0]));
    }

    const docs = await query.take(options.limit + 1);
    const hasMore = docs.length > options.limit;
    const items = hasMore ? docs.slice(0, -1) : docs;

    // Generate next cursor
    let nextCursor: string | undefined;
    if (hasMore && items.length > 0) {
      const lastDoc = items[items.length - 1];
      const cursorData = { timestamp: lastDoc._creationTime };
      nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64');
    }

    return {
      items: items.map((doc) => this.toDomain(doc)),
      nextCursor,
      hasMore,
    };
  }
}
```

### Filter Composition

Build complex queries from simple filters:

```typescript
export class FilterBuilder {
  private filters: Array<(doc: any) => boolean> = [];

  withState(states: PromiseState[]): this {
    if (states.length > 0) {
      this.filters.push((doc) => states.includes(doc.state));
    }
    return this;
  }

  withPriceRange(min?: TokenAmount, max?: TokenAmount): this {
    if (min !== undefined) {
      this.filters.push((doc) => doc.price >= min.getValue());
    }
    if (max !== undefined) {
      this.filters.push((doc) => doc.price <= max.getValue());
    }
    return this;
  }

  withModelName(model?: ModelName): this {
    if (model) {
      this.filters.push((doc) => doc.modelName === model.getValue());
    }
    return this;
  }

  build(): (doc: any) => boolean {
    return (doc) => this.filters.every((filter) => filter(doc));
  }
}

// Usage
const filter = new FilterBuilder()
  .withState([PromiseState.LISTED, PromiseState.ACCEPTED])
  .withPriceRange(new TokenAmount(10), new TokenAmount(100))
  .withModelName(new ModelName('chatgpt-4'))
  .build();

const promises = await repo.findByFilter(filter, options);
```

---

## Transaction Management

### Single Aggregate Transactions

Convex mutations are automatically transactional:

```typescript
// convex/promises/mutations.ts

export const acceptPromise = mutation({
  args: {
    promiseId: v.string(),
    consumerBotId: v.string(),
  },
  handler: async (ctx, args) => {
    // All operations in this handler are transactional
    const promiseRepo = new ConvexPromiseRepository(ctx.db);
    const escrowRepo = new ConvexEscrowRepository(ctx.db);
    const walletRepo = new ConvexWalletRepository(ctx.db);

    // 1. Load and update promise
    const promise = await promiseRepo.findById(new PromiseId(args.promiseId));
    promise.accept(new BotId(args.consumerBotId));
    await promiseRepo.save(promise);

    // 2. Create escrow
    const consumerWallet = await walletRepo.findByBotId(new BotId(args.consumerBotId));
    const escrow = EscrowAccount.create({
      promiseId: promise.id,
      consumerWalletId: consumerWallet.id,
      providerWalletId: promise.providerWalletId,
      amount: promise.pricingTerms.price,
    });
    await escrowRepo.save(escrow);

    // 3. Lock consumer funds
    consumerWallet.lock(promise.pricingTerms.price);
    await walletRepo.save(consumerWallet);

    // All three operations succeed or all fail (ACID)
  },
});
```

### Saga Pattern for Cross-Aggregate Operations

When operations span multiple aggregates that can't be in one transaction:

```typescript
// src/shared/application/sagas/PromiseAcceptanceSaga.ts

export class PromiseAcceptanceSaga {
  constructor(
    private promiseRepo: PromiseRepository,
    private escrowRepo: EscrowRepository,
    private walletRepo: WalletRepository,
    private eventBus: EventBus
  ) {}

  async execute(promiseId: PromiseId, consumerBotId: BotId): Promise<void> {
    const sagaId = `accept-${promiseId.toString()}-${Date.now()}`;

    try {
      // Step 1: Accept promise
      const promise = await this.promiseRepo.findById(promiseId);
      promise.accept(consumerBotId);
      await this.promiseRepo.save(promise);

      // Publish event for next step
      await this.eventBus.publish(new PromiseAccepted({
        sagaId,
        promiseId,
        consumerBotId,
        amount: promise.pricingTerms.price,
      }));

    } catch (error) {
      // Compensating action: cancel promise
      await this.compensatePromiseAcceptance(promiseId);
      throw error;
    }
  }

  // Handler for next step (triggered by event)
  async onPromiseAccepted(event: PromiseAccepted): Promise<void> {
    try {
      // Step 2: Create escrow
      const consumerWallet = await this.walletRepo.findByBotId(event.consumerBotId);
      const escrow = EscrowAccount.create({
        promiseId: event.promiseId,
        consumerWalletId: consumerWallet.id,
        amount: event.amount,
      });
      await this.escrowRepo.save(escrow);

      // Publish completion
      await this.eventBus.publish(new EscrowCreated({
        sagaId: event.sagaId,
        escrowId: escrow.id,
      }));

    } catch (error) {
      // Compensating action: release promise
      await this.compensateEscrowCreation(event.promiseId);
      throw error;
    }
  }

  private async compensatePromiseAcceptance(promiseId: PromiseId): Promise<void> {
    const promise = await this.promiseRepo.findById(promiseId);
    promise.cancel();
    await this.promiseRepo.save(promise);
  }

  private async compensateEscrowCreation(promiseId: PromiseId): Promise<void> {
    const promise = await this.promiseRepo.findById(promiseId);
    promise.markFailed('Escrow creation failed');
    await this.promiseRepo.save(promise);
  }
}
```

---

## Event Sourcing Integration

### Event Store Repository

```typescript
// src/shared/infrastructure/EventStoreRepository.ts

export interface StoredEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  occurredAt: Date;
  data: any;
  metadata?: any;
}

export class EventStoreRepository {
  constructor(private db: any) {}

  async append(event: StoredEvent): Promise<void> {
    await this.db.insert('events', {
      eventId: event.eventId,
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      version: event.version,
      occurredAt: event.occurredAt.getTime(),
      data: event.data,
      metadata: event.metadata,
    });
  }

  async getEventsForAggregate(
    aggregateId: string,
    options?: { afterVersion?: number }
  ): Promise<StoredEvent[]> {
    let query = this.db
      .query('events')
      .withIndex('by_aggregate', (q: any) => 
        q.eq('aggregateId', aggregateId)
      );

    if (options?.afterVersion !== undefined) {
      query = query.filter((q: any) => q.gt('version', options.afterVersion));
    }

    const docs = await query.order('asc').collect();

    return docs.map((doc: any) => ({
      eventId: doc.eventId,
      eventType: doc.eventType,
      aggregateId: doc.aggregateId,
      aggregateType: doc.aggregateType,
      version: doc.version,
      occurredAt: new Date(doc.occurredAt),
      data: doc.data,
      metadata: doc.metadata,
    }));
  }

  async getEventsByType(eventType: string, options: QueryOptions): Promise<StoredEvent[]> {
    const query = this.db
      .query('events')
      .withIndex('by_type', (q: any) => q.eq('eventType', eventType));

    const docs = await this.applyOptions(query, options).collect();
    return docs.map((doc: any) => this.toEvent(doc));
  }
}
```

### Reconstituting from Events

```typescript
// src/promiseMarket/infrastructure/EventSourcedPromiseRepository.ts

export class EventSourcedPromiseRepository implements PromiseRepository {
  constructor(
    private eventStore: EventStoreRepository,
    private snapshotRepo: PromiseSnapshotRepository
  ) {}

  async findById(id: PromiseId): Promise<Promise> {
    // Try to get snapshot first
    const snapshot = await this.snapshotRepo.getLatest(id);
    const fromVersion = snapshot ? snapshot.version : 0;

    // Get events after snapshot
    const events = await this.eventStore.getEventsForAggregate(
      id.toString(),
      { afterVersion: fromVersion }
    );

    // Reconstitute aggregate
    const promise = snapshot 
      ? Promise.fromSnapshot(snapshot)
      : Promise.createEmpty();

    // Apply events
    for (const event of events) {
      promise.apply(event);
    }

    return promise;
  }

  async save(promise: Promise): Promise<void> {
    // Append uncommitted events
    const uncommitted = promise.getUncommittedEvents();
    for (const event of uncommitted) {
      await this.eventStore.append({
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: promise.id.toString(),
        aggregateType: 'Promise',
        version: event.version,
        occurredAt: event.occurredAt,
        data: event.data,
        metadata: event.metadata,
      });
    }

    // Mark as committed
    promise.markCommitted();

    // Create snapshot every N events
    if (uncommitted.length > 10) {
      await this.snapshotRepo.save(promise.toSnapshot());
    }
  }
}
```

---

## Testing Repositories with Mocks

### In-Memory Repository Implementation

```typescript
// tests/shared/infrastructure/InMemoryBotRepository.ts

export class InMemoryBotRepository implements BotRepository {
  private bots: Map<string, BotAccount> = new Map();

  async findById(id: BotId): Promise<BotAccount> {
    const bot = this.bots.get(id.toString());
    if (!bot) {
      throw new BotNotFoundError(id.toString());
    }
    return bot;
  }

  async findByApiKeyHash(apiKeyHash: string): Promise<BotAccount | null> {
    for (const bot of this.bots.values()) {
      if (bot.apiKeyHash === apiKeyHash) {
        return bot;
      }
    }
    return null;
  }

  async findByDisplayName(
    displayName: string, 
    options: QueryOptions
  ): Promise<BotAccount[]> {
    const results = Array.from(this.bots.values())
      .filter((bot) => 
        bot.displayName.toLowerCase().includes(displayName.toLowerCase())
      );

    return this.applyPagination(results, options);
  }

  async existsByEmail(email: string): Promise<boolean> {
    for (const bot of this.bots.values()) {
      if (bot.email?.toString() === email.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  async save(bot: BotAccount): Promise<void> {
    this.bots.set(bot.id.toString(), bot);
  }

  async delete(id: BotId): Promise<void> {
    this.bots.delete(id.toString());
  }

  async count(): Promise<number> {
    return this.bots.size;
  }

  // Test helper methods
  clear(): void {
    this.bots.clear();
  }

  seed(bots: BotAccount[]): void {
    for (const bot of bots) {
      this.bots.set(bot.id.toString(), bot);
    }
  }

  private applyPagination<T>(items: T[], options: QueryOptions): T[] {
    const offset = options.offset || 0;
    const limit = options.limit || items.length;
    return items.slice(offset, offset + limit);
  }
}
```

### Repository Test Example

```typescript
// tests/botIdentity/infrastructure/BotRepository.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryBotRepository } from '../../shared/infrastructure/InMemoryBotRepository';
import { BotAccount } from '../../../src/botIdentity/domain/aggregates/BotAccount';
import { BotId } from '../../../src/shared/domain/value-objects/BotId';

describe('BotRepository', () => {
  let repository: InMemoryBotRepository;

  beforeEach(() => {
    repository = new InMemoryBotRepository();
  });

  describe('findById', () => {
    it('should return bot when it exists', async () => {
      // Arrange
      const botId = BotId.generate();
      const bot = BotAccount.create({
        botId,
        displayName: 'TestBot',
        email: null,
      });
      await repository.save(bot);

      // Act
      const found = await repository.findById(botId);

      // Assert
      expect(found.id.equals(botId)).toBe(true);
      expect(found.displayName).toBe('TestBot');
    });

    it('should throw BotNotFoundError when bot does not exist', async () => {
      // Arrange
      const nonExistentId = BotId.generate();

      // Act & Assert
      await expect(repository.findById(nonExistentId))
        .rejects
        .toThrow(BotNotFoundError);
    });
  });

  describe('findByApiKeyHash', () => {
    it('should find bot by API key hash', async () => {
      // Arrange
      const bot = BotAccount.create({
        botId: BotId.generate(),
        displayName: 'TestBot',
        email: null,
      });
      bot.regenerateApiKey(); // Sets apiKeyHash
      await repository.save(bot);

      // Act
      const found = await repository.findByApiKeyHash(bot.apiKeyHash);

      // Assert
      expect(found).not.toBeNull();
      expect(found!.id.equals(bot.id)).toBe(true);
    });

    it('should return null when API key not found', async () => {
      // Act
      const found = await repository.findByApiKeyHash('invalid-hash');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('save', () => {
    it('should create new bot', async () => {
      // Arrange
      const bot = BotAccount.create({
        botId: BotId.generate(),
        displayName: 'NewBot',
        email: null,
      });

      // Act
      await repository.save(bot);

      // Assert
      const found = await repository.findById(bot.id);
      expect(found.displayName).toBe('NewBot');
    });

    it('should update existing bot', async () => {
      // Arrange
      const bot = BotAccount.create({
        botId: BotId.generate(),
        displayName: 'Original',
        email: null,
      });
      await repository.save(bot);

      // Act
      bot.updateDisplayName('Updated');
      await repository.save(bot);

      // Assert
      const found = await repository.findById(bot.id);
      expect(found.displayName).toBe('Updated');
    });
  });

  describe('pagination', () => {
    it('should respect offset and limit', async () => {
      // Arrange
      for (let i = 0; i < 10; i++) {
        const bot = BotAccount.create({
          botId: BotId.generate(),
          displayName: `Bot${i}`,
          email: null,
        });
        await repository.save(bot);
      }

      // Act
      const results = await repository.findByDisplayName('Bot', {
        offset: 3,
        limit: 4,
      });

      // Assert
      expect(results).toHaveLength(4);
    });
  });
});
```

---

## Convex-Specific Implementation Details

### Database Context

Convex provides a `DatabaseContext` (`ctx.db`) in mutations and queries:

```typescript
// convex/bots/mutations.ts

import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { ConvexBotRepository } from '../../src/botIdentity/infrastructure/adapters/ConvexBotRepository';

export const registerBot = mutation({
  args: {
    displayName: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // ctx.db is the DatabaseContext
    const repository = new ConvexBotRepository(ctx.db);
    
    const bot = BotAccount.create({
      botId: BotId.generate(),
      displayName: args.displayName,
      email: args.email ? new Email(args.email) : null,
    });

    await repository.save(bot);

    return {
      botId: bot.id.toString(),
      apiKey: bot.getPlainApiKey(), // Only available at creation
    };
  },
});
```

### Query Functions

Use Convex queries for read-only operations:

```typescript
// convex/bots/queries.ts

import { query } from './_generated/server';
import { v } from 'convex/values';

export const getBotById = query({
  args: { botId: v.string() },
  handler: async (ctx, args) => {
    const repository = new ConvexBotRepository(ctx.db);
    const bot = await repository.findById(new BotId(args.botId));
    
    return {
      botId: bot.id.toString(),
      displayName: bot.displayName,
      reputationScore: bot.reputationScore.getValue(),
      verificationStatus: bot.verificationStatus,
    };
  },
});

export const searchBots = query({
  args: {
    displayName: v.string(),
    cursor: v.optional(v.string()),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const repository = new ConvexBotRepository(ctx.db);
    
    return await repository.findByCursor(
      { displayName: args.displayName },
      { cursor: args.cursor, limit: args.limit }
    );
  },
});
```

### Reactive Queries

Convex supports reactive subscriptions:

```typescript
// React component using reactive query
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

function OrderBook() {
  // Automatically re-renders when data changes
  const listings = useQuery(api.promises.queries.getActiveListings, {
    limit: 50,
  });

  if (!listings) return <Loading />;

  return (
    <div>
      {listings.items.map((listing) => (
        <ListingCard key={listing.promiseId} listing={listing} />
      ))}
    </div>
  );
}
```

### Actions for External Calls

Use Convex actions for non-database operations:

```typescript
// convex/bridge/actions.ts

import { action } from './_generated/server';
import { v } from 'convex/values';

export const verifyBlockchainTransaction = action({
  args: {
    txHash: v.string(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    // Actions can make external HTTP calls
    const response = await fetch(
      `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${args.txHash}`
    );
    
    const data = await response.json();
    
    return {
      verified: data.status === '1',
      confirmations: data.confirmations,
    };
  },
});
```

---

## Repository Best Practices

### ✅ DO

1. **Define interfaces in domain layer**
   ```typescript
   // Domain layer defines what it needs
   export interface BotRepository {
     findById(id: BotId): Promise<BotAccount>;
   }
   ```

2. **Return fully-formed aggregates**
   ```typescript
   // Good: Return aggregate
   async findById(id: BotId): Promise<BotAccount>
   
   // Bad: Return raw data
   async findById(id: BotId): Promise<BotDocument>
   ```

3. **Use value objects in interfaces**
   ```typescript
   // Good: Type-safe
   findById(id: BotId): Promise<BotAccount>
   
   // Bad: Stringly-typed
   findById(id: string): Promise<BotAccount>
   ```

4. **Handle nulls explicitly**
   ```typescript
   // Good: Nullable return type
   async findByApiKeyHash(hash: string): Promise<BotAccount | null>
   
   // Good: Throw for required entities
   async findById(id: BotId): Promise<BotAccount> // throws if not found
   ```

5. **Use pagination for large collections**
   ```typescript
   async findAll(options: QueryOptions): Promise<PaginatedResult<BotAccount>>
   ```

### ❌ DON'T

1. **Don't expose database details**
   ```typescript
   // Bad: Leaks MongoDB
   async findByQuery(mongoQuery: any): Promise<BotAccount[]>
   ```

2. **Don't mix query and command**
   ```typescript
   // Bad: Side effect in query
   async findAndUpdate(id: BotId, data: any): Promise<BotAccount>
   ```

3. **Don't return partial aggregates**
   ```typescript
   // Bad: Incomplete aggregate
   async findById(id: BotId): Promise<Partial<BotAccount>>
   ```

4. **Don't use repositories in domain layer**
   ```typescript
   // Bad: Domain depends on repository
   class BotAccount {
     constructor(private repo: BotRepository) {} // ❌
   }
   ```

5. **Don't bypass aggregates**
   ```typescript
   // Bad: Direct child access
   async updateStakeLock(botId: BotId, stake: StakeLock): Promise<void>
   
   // Good: Load aggregate, modify, save
   const bot = await repo.findById(botId);
   bot.lockStake(amount);
   await repo.save(bot);
   ```

---

## Related Architecture Decisions

| ADR | Title | Relevance |
|-----|-------|-----------|
| [ADR-003](./09-architecture-decisions.md#adr-003-convex-for-backend-and-database) | Convex Backend | Repository implementations use Convex |
| [ADR-006](./09-architecture-decisions.md#adr-006-aggregates-as-consistency-boundaries) | Aggregates as Boundaries | Repositories work with aggregate roots |
| [ADR-016](./09-architecture-decisions.md#adr-016-convex-functions-as-application-services) | Convex as App Layer | Convex functions use repositories |
| [ADR-023](./09-architecture-decisions.md#adr-023-playwright--vitest-for-testing) | Testing Strategy | Repository testing approach |

---

## Repository Checklist

When implementing a new repository:

- [ ] Interface defined in domain `ports/` directory
- [ ] Interface uses domain language (not database terms)
- [ ] All aggregate operations supported (findById, save, delete)
- [ ] Query methods return `PaginatedResult` for collections
- [ ] Implementation in infrastructure `adapters/` directory
- [ ] Proper error handling (throw domain exceptions)
- [ ] In-memory implementation for testing
- [ ] Unit tests for repository implementation
- [ ] Indexes defined in Convex schema
- [ ] Documentation comments on interface methods

---

**Next**: [Architecture Decisions](./09-architecture-decisions.md)
