# Domain Events

Domain Events represent significant occurrences in the water management domain that stakeholders care about. They are immutable facts about what has happened.

---

## Event Characteristics

1. **Past Tense**: Named with past-tense verbs (e.g., `AccountCreated`, not `CreateAccount`)
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
  causationId?: string; // What caused this event
  correlationId?: string; // Groups related events
  metadata?: Record<string, any>;
}
```

---

## Customer Account Management Events

### CustomerAccountCreated
Fired when a new customer account is created.

```typescript
interface CustomerAccountCreated extends DomainEvent {
  eventType: 'CustomerAccountCreated';
  aggregateType: 'CustomerAccount';
  aggregateId: AccountId;
  data: {
    accountId: AccountId;
    customerId: CustomerId;
    serviceAddress: Address;
    accountStatus: 'pending_activation';
    createdAt: Timestamp;
  };
}
```

**Subscribers**: Billing (create invoice template), Meter Ops (await meter assignment)

---

### AccountActivated
Fired when account becomes active with service enabled.

```typescript
interface AccountActivated extends DomainEvent {
  eventType: 'AccountActivated';
  aggregateType: 'CustomerAccount';
  aggregateId: AccountId;
  data: {
    accountId: AccountId;
    serviceDepositDeposited: Money;
    activatedAt: Timestamp;
  };
}
```

**Subscribers**: Billing (start billing cycle), Usage Tracking (begin consumption tracking)

---

### ServiceDepositDeposited
Fired when customer pays service deposit.

```typescript
interface ServiceDepositDeposited extends DomainEvent {
  eventType: 'ServiceDepositDeposited';
  aggregateType: 'CustomerAccount';
  aggregateId: AccountId;
  data: {
    accountId: AccountId;
    amount: Money;
    depositedAt: Timestamp;
  };
}
```

**Subscribers**: Billing (track deposit), Payment Account (record transaction)

---

### AccountStatusChanged
Fired when account status transitions.

```typescript
interface AccountStatusChanged extends DomainEvent {
  eventType: 'AccountStatusChanged';
  aggregateType: 'CustomerAccount';
  aggregateId: AccountId;
  data: {
    accountId: AccountId;
    previousStatus: string;
    newStatus: string;
    reason: string;
    changedAt: Timestamp;
  };
}
```

**Subscribers**: Meter Ops (disconnect/reconnect as needed), Billing (adjust billing), Notifications (alert customer)

---

## Usage Tracking Events

### MeterReadingRecorded
Fired when meter reading is submitted.

```typescript
interface MeterReadingRecorded extends DomainEvent {
  eventType: 'MeterReadingRecorded';
  aggregateType: 'MeterReading';
  aggregateId: ReadingId;
  data: {
    readingId: ReadingId;
    meterId: MeterId;
    accountId: AccountId;
    readingValue: CubicMeters;
    readingDate: Timestamp;
    readingSource: string;
    recordedAt: Timestamp;
  };
}
```

**Subscribers**: Usage Tracking (validate and calculate consumption)

---

### ConsumptionCalculated
Fired when consumption for period is calculated.

```typescript
interface ConsumptionCalculated extends DomainEvent {
  eventType: 'ConsumptionCalculated';
  aggregateType: 'ConsumptionData';
  aggregateId: ConsumptionId;
  data: {
    consumptionId: ConsumptionId;
    accountId: AccountId;
    billingPeriod: Period;
    consumption: CubicMeters;
    averageDaily: CubicMeters;
    calculatedAt: Timestamp;
  };
}
```

**Subscribers**: Billing (calculate invoice), Analytics (track trends)

---

### AnomalyDetected
Fired when unusual usage pattern detected.

```typescript
interface AnomalyDetected extends DomainEvent {
  eventType: 'AnomalyDetected';
  aggregateType: 'ConsumptionData';
  aggregateId: ConsumptionId;
  data: {
    consumptionId: ConsumptionId;
    accountId: AccountId;
    anomalyType: string; // 'high_usage', 'low_usage', 'negative', etc
    reason: string;
    detectedAt: Timestamp;
  };
}
```

**Subscribers**: Notifications (alert customer), Meter Ops (schedule inspection)

---

## Billing & Payments Events

### InvoiceGenerated
Fired when invoice is created from consumption.

```typescript
interface InvoiceGenerated extends DomainEvent {
  eventType: 'InvoiceGenerated';
  aggregateType: 'Invoice';
  aggregateId: InvoiceId;
  data: {
    invoiceId: InvoiceId;
    accountId: AccountId;
    billingPeriod: Period;
    consumption: CubicMeters;
    totalDue: Money;
    dueDate: Date;
    issuedAt: Timestamp;
  };
}
```

**Subscribers**: Notifications (send invoice), Analytics (billing metrics)

---

### PaymentReceived
Fired when customer payment is recorded.

```typescript
interface PaymentReceived extends DomainEvent {
  eventType: 'PaymentReceived';
  aggregateType: 'PaymentAccount';
  aggregateId: PaymentAccountId;
  data: {
    paymentAccountId: PaymentAccountId;
    accountId: AccountId;
    amount: Money;
    method: string;
    reference: string;
    receivedAt: Timestamp;
  };
}
```

**Subscribers**: Notifications (send confirmation), Billing (update balance)

---

### AccountBecameDelinquent
Fired when account enters delinquent status.

```typescript
interface AccountBecameDelinquent extends DomainEvent {
  eventType: 'AccountBecameDelinquent';
  aggregateType: 'CustomerAccount';
  aggregateId: AccountId;
  data: {
    accountId: AccountId;
    amountDue: Money;
    daysOverdue: number;
    becameDelinquentAt: Timestamp;
  };
}
```

**Subscribers**: Notifications (send payment reminder), Meter Ops (prepare disconnect), Collections

---

## Meter Operations Events

### MeterActivated
Fired when meter starts recording for account.

```typescript
interface MeterActivated extends DomainEvent {
  eventType: 'MeterActivated';
  aggregateType: 'Meter';
  aggregateId: MeterId;
  data: {
    meterId: MeterId;
    accountId: AccountId;
    meterNumber: string;
    activatedAt: Timestamp;
  };
}
```

**Subscribers**: Usage Tracking (start tracking readings)

---

### ServiceRequestCreated
Fired when service request is initiated.

```typescript
interface ServiceRequestCreated extends DomainEvent {
  eventType: 'ServiceRequestCreated';
  aggregateType: 'ServiceRequest';
  aggregateId: RequestId;
  data: {
    requestId: RequestId;
    accountId: AccountId;
    meterId: MeterId;
    requestType: string;
    createdAt: Timestamp;
  };
}
```

**Subscribers**: Notifications (confirm receipt), Scheduling (assign work)

---

### ServiceRequestCompleted
Fired when field work is finished.

```typescript
interface ServiceRequestCompleted extends DomainEvent {
  eventType: 'ServiceRequestCompleted';
  aggregateType: 'ServiceRequest';
  aggregateId: RequestId;
  data: {
    requestId: RequestId;
    accountId: AccountId;
    meterId: MeterId;
    requestType: string;
    findings: string;
    completedAt: Timestamp;
  };
}
```

**Subscribers**: Notifications (update customer), Usage Tracking (request reading if meter maintenance)

---

## Event Patterns

### Event Sourcing
Store all events as immutable log, reconstitute aggregate state by replaying events.

```typescript
class CustomerAccount {
  private status: AccountStatus;
  private events: DomainEvent[] = [];

  static reconstitute(events: DomainEvent[]): CustomerAccount {
    const account = new CustomerAccount();
    events.forEach(event => account.apply(event));
    return account;
  }

  private apply(event: DomainEvent): void {
    switch (event.eventType) {
      case 'CustomerAccountCreated':
        this.status = AccountStatus.pending();
        break;
      case 'AccountActivated':
        this.status = AccountStatus.active();
        break;
      // ... other events
    }
  }
}
```

### Event Handlers
Subscribers implement handlers for events they care about.

```typescript
class BillingOnConsumptionCalculated {
  async handle(event: ConsumptionCalculated): Promise<void> {
    const invoice = await Invoice.createFromConsumption(
      event.data.accountId,
      event.data.consumption,
      event.data.billingPeriod
    );
    await this.invoiceRepository.save(invoice);
  }
}
```

### Sagas (Process Managers)
Coordinate multi-step workflows across aggregates.

```typescript
class BillingCycleSaga {
  async handle(event: ConsumptionCalculated): Promise<void> {
    // 1. Create invoice
    const invoice = Invoice.create(...);
    await this.invoiceRepository.save(invoice);

    // 2. Trigger notification
    await this.eventBus.publish(new InvoiceGenerated(...));

    // 3. If delinquent, schedule meter check
    if (event.data.accountId.isDelinquent()) {
      await this.scheduleServiceRequest(...);
    }
  }
}
```

---

**Next**: [Use Cases](./07-use-cases.md)
