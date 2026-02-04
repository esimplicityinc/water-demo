# Repositories

Repositories mediate between domain and data layers, acting like in-memory collections of aggregates. They encapsulate data access logic with clean separation from domain concerns.

---

## Repository Pattern Principles

1. **Aggregate Retrieval**: Load aggregates by unique identifiers
2. **Aggregate Persistence**: Save aggregate changes to data store
3. **Query Interface**: Find aggregates by criteria
4. **Collection Semantics**: Treat aggregates like a collection
5. **Transaction Boundary**: Work within transaction boundaries

---

## Customer Account Context Repositories

### CustomerAccountRepository

```typescript
export interface CustomerAccountRepository {
  // Core CRUD
  findById(id: AccountId): Promise<CustomerAccount>;
  findByAddress(address: Address): Promise<CustomerAccount | null>;
  save(account: CustomerAccount): Promise<void>;
  delete(id: AccountId): Promise<void>;

  // Queries
  findByStatus(status: AccountStatus, options: QueryOptions): Promise<PaginatedResult<CustomerAccount>>;
  findDelinquent(options: QueryOptions): Promise<PaginatedResult<CustomerAccount>>;
  findByCityState(city: string, state: string, options: QueryOptions): Promise<PaginatedResult<CustomerAccount>>;
  count(): Promise<number>;
}
```

**Implementation Notes**:
- Use indexes on: id, address, status, city, delinquency
- Cache frequently accessed accounts (1 minute TTL)
- Paginate results for large queries

---

## Usage Tracking Context Repositories

### MeterReadingRepository

```typescript
export interface MeterReadingRepository {
  findById(id: ReadingId): Promise<MeterReading>;
  findByMeter(meterId: MeterId, options: QueryOptions): Promise<PaginatedResult<MeterReading>>;
  findByAccount(accountId: AccountId, billingPeriod: Period): Promise<MeterReading[]>;
  save(reading: MeterReading): Promise<void>;

  // Queries for analysis
  getLatestReading(meterId: MeterId): Promise<MeterReading | null>;
  getReadingsInRange(meterId: MeterId, from: Date, to: Date): Promise<MeterReading[]>;
}
```

**Key Indexes**: meterId, accountId, readingDate

---

### ConsumptionRepository

```typescript
export interface ConsumptionRepository {
  findById(id: ConsumptionId): Promise<ConsumptionData>;
  findByAccount(accountId: AccountId, billingPeriod: Period): Promise<ConsumptionData | null>;
  save(consumption: ConsumptionData): Promise<void>;

  // Analytics queries
  getHistoricalConsumption(accountId: AccountId, months: number): Promise<ConsumptionData[]>;
  findAnomalous(options: QueryOptions): Promise<PaginatedResult<ConsumptionData>>;
}
```

---

## Billing & Payments Repositories

### InvoiceRepository

```typescript
export interface InvoiceRepository {
  findById(id: InvoiceId): Promise<Invoice>;
  findByAccount(accountId: AccountId, options: QueryOptions): Promise<PaginatedResult<Invoice>>;
  findByStatus(status: InvoiceStatus, options: QueryOptions): Promise<PaginatedResult<Invoice>>;
  save(invoice: Invoice): Promise<void>;

  // Queries
  getOutstandingBalance(accountId: AccountId): Promise<Money>;
  findDueInvoices(beforeDate: Date): Promise<Invoice[]>;
  findOverdueInvoices(options: QueryOptions): Promise<PaginatedResult<Invoice>>;
}
```

**Key Indexes**: invoiceId, accountId, status, dueDate, issuedAt

---

### PaymentAccountRepository

```typescript
export interface PaymentAccountRepository {
  findByAccountId(accountId: AccountId): Promise<PaymentAccount>;
  save(account: PaymentAccount): Promise<void>;

  // Queries
  getTransactionHistory(accountId: AccountId, options: QueryOptions): Promise<PaginatedResult<Transaction>>;
  getTotalPaid(accountId: AccountId, year: number): Promise<Money>;
  getLastPaymentDate(accountId: AccountId): Promise<Date | null>;
}
```

---

## Meter Operations Repositories

### MeterRepository

```typescript
export interface MeterRepository {
  findById(id: MeterId): Promise<Meter>;
  findByAccount(accountId: AccountId): Promise<Meter | null>;
  findByMeterNumber(meterNumber: string): Promise<Meter | null>;
  save(meter: Meter): Promise<void>;

  // Queries
  findByStatus(status: MeterStatus, options: QueryOptions): Promise<PaginatedResult<Meter>>;
  findDueForReplacement(): Promise<Meter[]>;
  findFaulty(options: QueryOptions): Promise<PaginatedResult<Meter>>;
}
```

**Key Indexes**: meterId, accountId, meterNumber, status, installationDate

---

### ServiceRequestRepository

```typescript
export interface ServiceRequestRepository {
  findById(id: RequestId): Promise<ServiceRequest>;
  findByAccount(accountId: AccountId, options: QueryOptions): Promise<PaginatedResult<ServiceRequest>>;
  findByStatus(status: RequestStatus, options: QueryOptions): Promise<PaginatedResult<ServiceRequest>>;
  save(request: ServiceRequest): Promise<void>;

  // Queries
  findOpenRequests(options: QueryOptions): Promise<PaginatedResult<ServiceRequest>>;
  findByTechnician(technician: string, status: RequestStatus): Promise<ServiceRequest[]>;
  getAverageResolutionTime(): Promise<Duration>;
}
```

---

## Common Query Options

All repositories support pagination and sorting:

```typescript
export interface QueryOptions {
  offset?: number;           // Skip this many
  limit?: number;            // Return this many
  sortBy?: string;           // Field to sort
  sortOrder?: 'asc' | 'desc';
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

## Repository Implementation Example

```typescript
// src/customer-account/infrastructure/ConvexAccountRepository.ts

export class ConvexAccountRepository implements CustomerAccountRepository {
  constructor(private db: DatabaseContext) {}

  async findById(id: AccountId): Promise<CustomerAccount> {
    const doc = await this.db
      .query('accounts')
      .withIndex('by_id', (q) => q.eq('accountId', id.toString()))
      .unique();

    if (!doc) {
      throw new AccountNotFoundError(id.toString());
    }

    return this.toDomain(doc);
  }

  async save(account: CustomerAccount): Promise<void> {
    const doc = this.toDocument(account);
    const existing = await this.db
      .query('accounts')
      .withIndex('by_id', (q) => q.eq('accountId', account.id.toString()))
      .unique();

    if (existing) {
      await this.db.patch(existing._id, doc);
    } else {
      await this.db.insert('accounts', doc);
    }
  }

  async findByStatus(
    status: AccountStatus,
    options: QueryOptions
  ): Promise<PaginatedResult<CustomerAccount>> {
    let query = this.db
      .query('accounts')
      .withIndex('by_status', (q) => q.eq('status', status.getValue()));

    // Apply pagination
    if (options.offset) {
      query = query.skip(options.offset);
    }
    if (options.limit) {
      query = query.take(options.limit);
    }

    const docs = await query.collect();
    const total = await this.db.query('accounts').withIndex('by_status', (q) => q.eq('status', status.getValue())).collect().length;

    return {
      items: docs.map((doc) => this.toDomain(doc)),
      total,
      offset: options.offset || 0,
      limit: options.limit || docs.length,
      hasMore: (options.offset || 0) + docs.length < total,
    };
  }

  protected toDomain(doc: any): CustomerAccount {
    return CustomerAccount.reconstitute({
      accountId: new AccountId(doc.accountId),
      serviceAddress: new Address(...doc.address),
      accountStatus: new AccountStatus(doc.status),
      // ... other fields
    });
  }

  protected toDocument(account: CustomerAccount): any {
    return {
      accountId: account.id.toString(),
      serviceAddress: account.address,
      status: account.status.getValue(),
      // ... other fields
    };
  }
}
```

---

## In-Memory Repository for Testing

```typescript
// tests/shared/infrastructure/InMemoryAccountRepository.ts

export class InMemoryAccountRepository implements CustomerAccountRepository {
  private accounts: Map<string, CustomerAccount> = new Map();

  async findById(id: AccountId): Promise<CustomerAccount> {
    const account = this.accounts.get(id.toString());
    if (!account) {
      throw new AccountNotFoundError(id.toString());
    }
    return account;
  }

  async save(account: CustomerAccount): Promise<void> {
    this.accounts.set(account.id.toString(), account);
  }

  // ... implement other methods similarly

  // Test helpers
  clear(): void {
    this.accounts.clear();
  }

  seed(accounts: CustomerAccount[]): void {
    accounts.forEach((a) => this.accounts.set(a.id.toString(), a));
  }
}
```

---

## Convex Schema for Repositories

```typescript
// convex/schema.ts

export default defineSchema({
  accounts: defineTable({
    accountId: v.string(),
    customerId: v.string(),
    serviceAddress: v.object({ street: v.string(), city: v.string(), state: v.string() }),
    status: v.string(),
    createdAt: v.number(),
  })
    .index('by_id', ['accountId'])
    .index('by_status', ['status'])
    .index('by_customer', ['customerId']),

  readings: defineTable({
    readingId: v.string(),
    meterId: v.string(),
    accountId: v.string(),
    readingValue: v.number(),
    readingDate: v.number(),
  })
    .index('by_id', ['readingId'])
    .index('by_meter', ['meterId'])
    .index('by_account', ['accountId'])
    .index('by_date', ['readingDate']),

  // ... other tables
});
```

---

## Repository Best Practices

### ✅ DO

1. **Return fully-formed aggregates** - Never return raw data
2. **Use value objects in interfaces** - Type-safe IDs, amounts
3. **Support pagination** - For large result sets
4. **Index frequently queried fields** - Perf critical
5. **Handle nulls explicitly** - Throw for required, null for optional

### ❌ DON'T

1. **Don't expose database details** - Hide implementation
2. **Don't bypass aggregates** - Always load whole aggregate
3. **Don't use repositories in domain layer** - Dependency should flow the other way
4. **Don't return partial aggregates** - Always complete
5. **Don't mix query and command** - Separate concerns

---

**End of DDD Documentation**

Return to: [Domain Overview](./01-domain-overview.md)
