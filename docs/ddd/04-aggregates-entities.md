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

## Customer Account Management Context

### CustomerAccount Aggregate

**Root Entity**: `CustomerAccount`

**Responsibility**: Manages customer account lifecycle, status, service deposit, and account standing.

#### Entities

##### CustomerAccount (Root)
```typescript
{
  accountId: AccountId (UUID)
  customerId: CustomerId (UUID)
  serviceAddress: Address
  accountHolder: CustomerInfo
  accountStatus: AccountStatus
  serviceDepositAmount: CubicMeters
  accountStanding: AccountStanding
  createdAt: Timestamp
  activatedAt: Timestamp | null
  closedAt: Timestamp | null
  billingPreferences: BillingPreferences
  contactInfo: ContactInfo
}
```

**Invariants**:
- `accountId` is unique and immutable
- `customerId` is immutable
- `accountStatus` must be valid state
- `serviceDepositAmount` ≥ 0
- Cannot close account unless balance ≤ 0
- Account cannot be activated until deposit cleared

**Operations**:
- `create(customerId, serviceAddress)` → CustomerAccount
- `activateAccount()` → void (Draft → Active)
- `depositServiceDeposit(amount)` → void
- `updateAccountStatus(newStatus)` → void
- `updateAccountStanding(standing)` → void
- `suspendAccount(reason)` → void (Active → Suspended)
- `closeAccount()` → void (any → Closed)

#### Child Entities

##### BillingPreferences
```typescript
{
  billingCycle: 'monthly' | 'quarterly' | 'bimonthly'
  deliveryMethod: 'email' | 'paper' | 'both'
  autopay: boolean
  paymentAccount?: BankAccount
}
```

##### ContactInfo
```typescript
{
  primaryPhone: PhoneNumber
  secondaryPhone: PhoneNumber | null
  email: Email
  preferredContact: 'phone' | 'email' | 'mail'
}
```

##### Address
```typescript
{
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}
```

---

## Usage Tracking Context

### MeterReading Aggregate

**Root Entity**: `MeterReading`

**Responsibility**: Records meter measurements and validates consumption calculations.

#### Entities

##### MeterReading (Root)
```typescript
{
  readingId: ReadingId (UUID)
  meterId: MeterId
  accountId: AccountId
  readingValue: CubicMeters
  previousReadingValue: CubicMeters | null
  calculatedConsumption: CubicMeters | null
  readingDate: Timestamp
  readingSource: 'manual' | 'automated' | 'estimated'
  status: 'valid' | 'estimated' | 'anomalous' | 'rejected'
  recordedAt: Timestamp
}
```

**Invariants**:
- `readingId` is unique and immutable
- `readingValue` ≥ previous reading (meter doesn't go backward)
- `readingDate` &lt;= `recordedAt`
- If `status` = 'valid', consumption must be calculated
- Consumption cannot be negative

**Operations**:
- `create(meterId, readingValue, previousReading)` → MeterReading
- `calculateConsumption()` → CubicMeters
- `validateReading()` → ValidationResult
- `flagAsAnomaly(reason)` → void
- `reject(reason)` → void
- `approve()` → void

#### Child Entities

##### ValidationResult
```typescript
{
  isValid: boolean
  anomalies: string[]
  warnings: string[]
  confidence: 0-100 (percentage)
}
```

---

### ConsumptionData Aggregate

**Root Entity**: `ConsumptionData`

**Responsibility**: Aggregates consumption patterns for analysis and anomaly detection.

#### Entities

##### ConsumptionData (Root)
```typescript
{
  consumptionId: ConsumptionId (UUID)
  accountId: AccountId
  billingPeriod: Period
  consumption: CubicMeters
  averageDaily: CubicMeters
  meterReadings: MeterReadingId[]
  status: 'recorded' | 'anomalous' | 'verified'
  lastVerifiedAt: Timestamp | null
}
```

**Invariants**:
- One consumption record per account per billing period
- `consumption` ≥ 0
- `averageDaily` = `consumption` / days in period

**Operations**:
- `record(readings: MeterReading[])` → ConsumptionData
- `detectAnomalies(historicalData)` → Anomaly[]
- `verify()` → void
- `reject()` → void

---

## Billing & Payments Context

### Invoice Aggregate

**Root Entity**: `Invoice`

**Responsibility**: Manages billing document, payment status, and account balance.

#### Entities

##### Invoice (Root)
```typescript
{
  invoiceId: InvoiceId (UUID)
  accountId: AccountId
  billingPeriod: Period
  consumption: CubicMeters
  baseRate: Rate
  consumptionRate: Rate
  totalDue: Money
  balanceRemaining: Money
  dueDate: Date
  issuedAt: Timestamp
  paidAt: Timestamp | null
  status: 'draft' | 'issued' | 'due' | 'overdue' | 'paid' | 'cancelled'
  lineItems: LineItem[]
}
```

**Invariants**:
- `invoiceId` is unique and immutable
- `totalDue` = sum of all line items
- `balanceRemaining` &lt;= `totalDue`
- Invoice transitions: draft → issued → due → (paid | overdue)
- Cannot modify invoice after issued

**Operations**:
- `create(accountId, consumption, rates)` → Invoice
- `issue()` → void (draft → issued)
- `recordPayment(amount)` → void
- `markOverdue()` → void (due → overdue)
- `cancel()` → void
- `getBalanceDue()` → Money

#### Child Entities

##### LineItem
```typescript
{
  description: string
  quantity: number | CubicMeters
  unitPrice: Money
  amount: Money
}
```

Examples:
- "Base service charge" - 1 × $15.00 = $15.00
- "Water consumption (12.5 m³)" - 12.5 × $1.25 = $15.63
- "Late payment fee" - 1 × $5.00 = $5.00

---

### PaymentAccount Aggregate

**Root Entity**: `PaymentAccount`

**Responsibility**: Manages payment history and running balance for customer account.

#### Entities

##### PaymentAccount (Root)
```typescript
{
  paymentAccountId: PaymentAccountId (UUID)
  accountId: AccountId
  balance: Money
  creditBalance: Money
  lastPaymentAt: Timestamp | null
  lastPaymentAmount: Money | null
  totalPaidYTD: Money
  transactions: PaymentTransaction[]
}
```

**Invariants**:
- One payment account per customer account
- `balance` ≥ 0 (amount owed)
- `creditBalance` ≥ 0 (overpayment)
- Transaction history is immutable

**Operations**:
- `recordPayment(amount, method)` → Transaction
- `addCharge(invoiceId, amount)` → void
- `applyCredit(amount, reason)` → void
- `getBalance()` → Money
- `getPaymentHistory(period)` → Transaction[]

#### Child Entities

##### PaymentTransaction
```typescript
{
  transactionId: TransactionId (UUID)
  type: 'payment' | 'charge' | 'credit' | 'adjustment'
  amount: Money
  balance: Money (after transaction)
  date: Timestamp
  method: 'check' | 'ach' | 'card' | 'cash' | 'other'
  reference: string
}
```

**Invariants**:
- Immutable once created
- `amount` > 0
- `balance` correctly updated from previous balance

---

## Meter Operations Context

### Meter Aggregate

**Root Entity**: `Meter`

**Responsibility**: Manages physical meter lifecycle, status, and readings.

#### Entities

##### Meter (Root)
```typescript
{
  meterId: MeterId (UUID)
  accountId: AccountId
  meterNumber: string (physical device identifier)
  meterType: 'residential' | 'commercial' | 'industrial'
  installationDate: Date
  meterStatus: 'active' | 'faulty' | 'scheduled_maintenance' | 'disconnected'
  lastReadingDate: Timestamp | null
  lastReadingValue: CubicMeters | null
  meterCapacity: CubicMeters (max reliable reading)
  serviceHistory: MaintenanceRecord[]
}
```

**Invariants**:
- `meterId` is unique and immutable
- `meterNumber` is unique (physical device)
- `installationDate` &lt;= today
- `lastReadingDate` is monotonically increasing
- `lastReadingValue` never decreases

**Operations**:
- `install(accountId, meterNumber, meterType)` → Meter
- `recordReading(value, source)` → MeterReading
- `markFaulty(reason)` → void
- `scheduleReplacement(date)` → void
- `disconnect()` → void (active → disconnected)
- `reconnect()` → void (disconnected → active)
- `recordMaintenance(work)` → void

#### Child Entities

##### MaintenanceRecord
```typescript
{
  maintenanceId: MaintenanceId (UUID)
  workType: 'inspection' | 'repair' | 'replacement' | 'calibration'
  workDate: Date
  description: string
  technician: string
  findings: string
  completedAt: Timestamp | null
}
```

---

### ServiceRequest Aggregate

**Root Entity**: `ServiceRequest`

**Responsibility**: Manages meter-related service work and scheduling.

#### Entities

##### ServiceRequest (Root)
```typescript
{
  requestId: RequestId (UUID)
  accountId: AccountId
  meterId: MeterId
  requestType: 'reading' | 'repair' | 'replacement' | 'inspection'
  requestStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  requestedAt: Timestamp
  scheduledFor: Timestamp | null
  completedAt: Timestamp | null
  assignedTechnician: string | null
  notes: string
}
```

**Invariants**:
- `requestId` is unique and immutable
- Status transitions: pending → (scheduled | cancelled) → (in_progress | cancelled) → (completed | cancelled)
- Can only assign technician when scheduled
- Cannot complete without completion notes

**Operations**:
- `create(accountId, meterId, requestType)` → ServiceRequest
- `schedule(technician, scheduledDate)` → void
- `start()` → void (scheduled → in_progress)
- `complete(findings)` → void (in_progress → completed)
- `cancel(reason)` → void

---

## Aggregate Relationships

```
CustomerAccount (1) ──< (0..*) MeterReading
                          [accountId]

CustomerAccount (1) ──── (1) PaymentAccount
                          [accountId]

Meter (1) ──< (0..*) MeterReading
         [meterId]

Meter (1) ──< (0..*) ServiceRequest
     [meterId]

Invoice (1) ──── (0..*) PaymentTransaction
         [accountId]

CustomerAccount (1) ──< (0..*) Invoice
                        [accountId]
```

**Note**: These are logical relationships via IDs, not in-memory object references.

---

## Aggregate Size Guidelines

| Aggregate | Max Entities | Notes |
|-----------|-------------|-------|
| CustomerAccount | 1 root + 2 children | Minimal; billing prefs separate if complex |
| MeterReading | 1 root only | Simple; validation results computed |
| ConsumptionData | 1 root only | Lightweight; references readings by ID |
| Invoice | 1 root + N LineItems | Cap at 20 line items |
| PaymentAccount | 1 root + N Transactions | Paginate transactions; keep summary in root |
| Meter | 1 root + N Maintenance | Limit history to recent 50 records |
| ServiceRequest | 1 root only | Simple; references meter by ID |

---

**Next**: [Value Objects](./05-value-objects.md)
