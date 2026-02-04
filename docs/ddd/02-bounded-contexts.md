# Bounded Contexts

AquaTrack is decomposed into four primary bounded contexts, each with its own domain model, language, and responsibilities.

## Context Map Overview

```
┌─────────────────────┐
│ Customer Account    │
│ Management          │
│                     │
│ - Account creation  │
│ - Customer profile  │
│ - Account standing  │
│ - Service deposits  │
└──────────┬──────────┘
           │ provides
           │ customer
           │ info
           ▼
┌─────────────────────┐        ┌─────────────────────┐
│   Usage Tracking    │◄──────►│    Billing &        │
│                     │        │  Payments           │
│ - Meter readings    │        │                     │
│ - Usage calculation │        │ - Invoice creation  │
│ - Consumption data  │        │ - Billing cycles    │
│                     │        │ - Payment processing│
└──────────┬──────────┘        │ - Settlement        │
           │ triggers          │                     │
           │ billing           └─────────────────────┘
           ▼
┌─────────────────────┐
│  Meter Operations   │
│                     │
│ - Meter lifecycle   │
│ - Reading requests  │
│ - Service requests  │
│ - Maintenance      │
└─────────────────────┘
```

---

## 1. Customer Account Management Context

### Responsibility
Manages the lifecycle of customer water service accounts, authentication, account standing, and service deposits.

### Core Concepts
- **Customer Account**: Service agreement for water delivery with terms and conditions
- **Account Status**: Active, Suspended, Closed, Delinquent
- **Service Deposit**: Upfront payment to activate account
- **Account Standing**: Credit rating based on payment history
- **Billing Address**: Service location for water delivery

### Key Aggregates
- **CustomerAccount**: Root aggregate containing identity, contact, status, and deposit info

### Public Events
- `CustomerAccountCreated`
- `AccountStatusChanged`
- `ServiceDepositDeposited`
- `ServiceDepositReleased`
- `AccountStandingUpdated`
- `BillingAddressUpdated`

### Relationships
- **Upstream from**: Billing & Payments (provides customer info)
- **Upstream from**: Usage Tracking (provides account context)
- **Customer-Supplier**: Meter Operations (requests meter operations)

### Boundaries
- Does NOT handle meter reading or calculations
- Does NOT process payments directly (delegates to Billing)
- Does NOT track usage (delegates to Usage Tracking)

---

## 2. Usage Tracking Context

### Responsibility
Core marketplace logic: collecting meter readings, calculating consumption, and maintaining usage history.

### Core Concepts
- **Meter Reading**: Record of water consumption from meter device
- **Meter ID**: Unique identifier for physical meter at property
- **Usage Period**: Time interval between readings
- **Consumption**: Calculated water volume used (cubic meters)
- **Anomaly**: Unusual usage pattern detected

### Key Aggregates
- **MeterReading**: Root aggregate containing reading data and validation
- **UsageHistory**: Maintains consumption records and patterns
- **ConsumptionData**: Aggregated usage statistics

### Public Events
- `MeterReadingRecorded`
- `MeterReadingValidated`
- `MeterReadingRejected`
- `ConsumptionCalculated`
- `AnomalyDetected`
- `UsageHistoryUpdated`

### Relationships
- **Conformist**: Customer Account Management (must use their customer identities)
- **Customer-Supplier**: Billing & Payments (requests billing calculation)
- **Partnership**: Meter Operations (collaborates on meter readings)

### Boundaries
- Does NOT handle payment processing
- Does NOT manage physical meters (delegates to Meter Operations)
- Does NOT calculate bills (delegates to Billing)

---

## 3. Billing & Payments Context

### Responsibility
Manages invoices, billing cycles, payment processing, and financial settlement.

### Core Concepts
- **Invoice**: Bill for water consumption and service charges
- **Billing Cycle**: Recurring interval (monthly, quarterly) for invoicing
- **Rate**: Pricing per cubic meter or base rate
- **Payment**: Customer settlement of invoice
- **Account Balance**: Outstanding amount owed or credit balance

### Key Aggregates
- **Invoice**: Root aggregate for billing document
- **PaymentAccount**: Manages payment history and balance
- **BillingCycle**: Tracks billing periods and processing

### Public Events
- `BillingCycleStarted`
- `InvoiceGenerated`
- `InvoiceDelivered`
- `PaymentReceived`
- `PaymentProcessed`
- `AccountBalanceUpdated`
- `DueNoticeIssued`
- `AccountSuspended`

### Relationships
- **Customer-Supplier**: Customer Account Management (needs account info)
- **Customer-Supplier**: Usage Tracking (requests usage for billing)
- **Published Language**: Exposes payment status via standard API

### Boundaries
- Does NOT manage customer accounts (trusts Customer Account context)
- Does NOT track meter readings (receives usage from Usage Tracking)
- Does NOT physically access meters (separate concern)

---

## 4. Meter Operations Context

### Responsibility
Manages physical meters, reading collection, service requests, and maintenance operations.

### Core Concepts
- **Meter**: Physical device measuring water consumption
- **Meter Status**: Active, Faulty, Scheduled for Replacement, Disconnected
- **Service Request**: Request for meter reading, repair, or maintenance
- **Technician**: Field operator conducting meter-related work
- **Reading Schedule**: Regular intervals for meter reading collection

### Key Aggregates
- **Meter**: Root aggregate for meter lifecycle and status
- **ServiceRequest**: Handles service appointments and work orders
- **ReadingSchedule**: Manages meter reading collection schedule

### Public Events
- `MeterActivated`
- `MeterDeactivated`
- `MeterFault Detected`
- `ServiceRequestCreated`
- `ServiceRequestScheduled`
- `ServiceRequestCompleted`
- `ReadingScheduleUpdated`

### Relationships
- **Customer-Supplier**: Customer Account Management (serves their accounts)
- **Customer-Supplier**: Usage Tracking (provides readings for usage calculation)
- **Partnership**: Billing & Payments (meter status affects billing)

### Boundaries
- Does NOT calculate consumption
- Does NOT process payments
- Does NOT manage customer account data directly (trusts other contexts)

---

## Context Integration Patterns

### Shared Kernel
- **Usage Tracking ↔ Billing & Payments**: Tightly coupled for usage-to-billing flow

### Customer-Supplier
- **Customer Account → Usage Tracking**: Provides account identification
- **Usage Tracking → Billing & Payments**: Provides consumption data
- **Meter Operations → Customer Account**: Services customer's meters
- **Billing & Payments → Customer Account**: Updates account balance

### Partnership
- **Usage Tracking ↔ Meter Operations**: Collaborate on meter readings

---

## Context-Specific Languages

Each context has terminology that may differ:

| Concept | Customer Acct | Usage Tracking | Billing | Meter Ops |
|---------|---|---|---|---|
| Water Device | Property meter | Meter | Meter | Physical device |
| Data Point | Account status | Reading | Invoice | Maintenance record |
| Success | Active account | Accurate reading | Payment collected | Service completed |
| Failure | Suspended | Anomaly detected | Non-payment | Meter faulty |

This is intentional - each context uses language natural to its domain.

---

## BDD Test Coverage

Each bounded context has comprehensive BDD test coverage:

| Bounded Context | Feature Files | Scenarios | Status |
|----------------|---------------|-----------|--------|
| **Customer Account** | 3 files | 25 scenarios | ✅ Complete |
| **Usage Tracking** | 4 files | 35 scenarios | ✅ Complete |
| **Billing & Payments** | 4 files | 40 scenarios | ✅ Complete |
| **Meter Operations** | 3 files | 28 scenarios | ✅ Complete |

See the [Feature Index](../bdd/feature-index) for complete test details.

## Related Documentation

### DDD
- [Domain Overview](./01-domain-overview.md) - Domain vision and scope
- [Ubiquitous Language](./03-ubiquitous-language.md) - Domain terminology
- [Context Map](./08-context-map.md) - Visual context relationships

### BDD Testing
- [BDD Overview](../bdd/bdd-overview) - Testing approach
- [DDD-BDD Mapping](../bdd/ddd-bdd-mapping) - How contexts map to tests
- [Feature Index](../bdd/feature-index) - Browse all test scenarios

---

**Next**: [Ubiquitous Language](./03-ubiquitous-language.md)
