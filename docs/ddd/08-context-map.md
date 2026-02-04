# Context Map

The Context Map visualizes the relationships between bounded contexts and their integration patterns.

---

## High-Level Context Map

```
┌────────────────────────────────────────────────────────────┐
│                     AquaTrack System                       │
│                                                            │
│  ┌──────────────────────┐                                 │
│  │ Customer Account     │                                 │
│  │ Management           │                                 │
│  │                      │                                 │
│  │ [U] [CF]             │                                 │
│  └────┬─────────────────┘                                 │
│       │ Provides account info                              │
│       │                                                    │
│       ├─────────────┬──────────────┐                      │
│       ▼             ▼              ▼                      │
│   ┌──────────┐ ┌──────────┐  ┌──────────┐               │
│   │ Usage    │ │ Billing  │  │  Meter   │               │
│   │Tracking  │◄┤& Payments│◄─┤Operations│               │
│   │          │ │          │  │          │               │
│   │[SK/CS]   │ │ [PL]     │  │ [CS]     │               │
│   └──────────┘ └──────────┘  └──────────┘               │
│       ▲             ▲              ▲                      │
│       │             │              │                      │
│       │             └──Partnership─┘                      │
│       │                                                    │
│       └─────────────Shared Events──────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘

Legend:
[U]  - Upstream
[CF] - Conformist
[SK] - Shared Kernel
[PL] - Published Language
[CS] - Customer-Supplier
```

---

## Context Relationships

### 1. Customer Account → Usage Tracking
**Pattern**: Customer-Supplier

**Description**: Usage Tracking depends on Customer Account for account identification.

**Integration**:
- Usage Tracking calls Customer Account APIs to verify account status
- Usage Tracking subscribes to:
  - `AccountActivated` - begin tracking readings
  - `AccountSuspended` - stop tracking
  - `AccountClosed` - archive historical data

**Data Flow**: Customer Account → Usage Tracking (one-way)

---

### 2. Customer Account → Billing & Payments
**Pattern**: Conformist + Customer-Supplier

**Description**: Billing depends on Customer Account for customer and account information.

**Integration**:
- Billing queries Customer Account for account status, contact info
- Billing subscribes to:
  - `AccountActivated` - start billing cycles
  - `BillingPreferencesChanged` - adjust delivery method
  - `AccountClosed` - finalize billing

**Data Flow**: Customer Account → Billing (one-way)

---

### 3. Usage Tracking ↔ Billing & Payments
**Pattern**: Shared Kernel

**Description**: Tightly coupled for consumption-to-invoice flow. Both contexts need consistent understanding of consumption data.

**Shared Concepts**:
- `CubicMeters` value object
- `BillingPeriod` domain concept
- `Consumption` calculation rules

**Integration**:
- Usage Tracking calculates consumption, publishes `ConsumptionCalculated`
- Billing subscribes and creates Invoice immediately
- If anomaly detected: Billing holds invoice pending approval

**Data Flow**: Bidirectional (events)

**Risks**: Changes to consumption calculation require coordination.

---

### 4. Customer Account ↔ Meter Operations
**Pattern**: Partnership

**Description**: Both collaborate closely on service provisioning and account maintenance.

**Integration**:
- Customer Account subscribes to:
  - `MeterActivated` - confirm service ready
  - `MeterFault Detected` - alert customer
- Meter Operations subscribes to:
  - `AccountActivated` - activate/connect meter
  - `AccountSuspended` - disconnect service
  - `AccountClosed` - remove meter

**Data Flow**: Bidirectional

---

### 5. Meter Operations ↔ Usage Tracking
**Pattern**: Partnership

**Description**: Collaborate on meter readings and consumption verification.

**Integration**:
- Meter Operations submits readings via `MeterReadingRecorded` event
- Usage Tracking validates and calculates consumption
- If anomaly: Usage Tracking notifies Meter Operations for inspection
- Meter Operations can request off-cycle readings

**Data Flow**: Bidirectional (readings and anomalies)

---

## Integration Styles

### Event-Driven Integration (Primary)

All contexts publish domain events to a shared event bus. Subscribers react asynchronously.

**Benefits**:
- Loose coupling
- Scalability
- Auditability (event log)

**Example Flow**:
```
Consumption Calculated
     ↓
Usage Tracking publishes: ConsumptionCalculated
     ↓
Billing subscribes: Creates Invoice
     ↓
Billing publishes: InvoiceGenerated
     ↓
Notifications: Sends to customer
```

---

### Query Pattern (Secondary)

Contexts expose read models for queries without side effects.

**Example**:
```typescript
// Billing queries Customer Account
const account = await accountService.getAccountStatus(accountId);
if (account.status === 'suspended') {
  // Hold invoice generation
}
```

**Usage**:
- Validation checks
- Status verification
- Read-only operations

---

## Team Organization

If AquaTrack grows, teams could own contexts:

| Context | Team | Responsibilities |
|---------|------|------------------|
| Customer Account | Customer Services | Onboarding, account changes, closures |
| Usage Tracking | Operations | Meter readings, consumption validation, anomalies |
| Billing & Payments | Finance | Invoice generation, payment processing, collections |
| Meter Operations | Field Services | Meter installation, maintenance, service requests |

**Cross-Team Coordination**:
- Shared event schema repository
- API contracts (OpenAPI specs)
- Regular sync meetings for integration changes

---

## Evolution Strategy

### Current (v1): Modular Monolith

All contexts in single Next.js + Convex application with logical separation.

**Structure**:
```
src/
  customer-account/
    domain/
    application/
    infrastructure/
  usage-tracking/
    domain/
    application/
    infrastructure/
  billing-payments/
    domain/
    application/
    infrastructure/
  meter-operations/
    domain/
    application/
    infrastructure/
  shared/
    events/
    value-objects/
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
1. Start with Meter Operations (most independent)
2. Extract Billing & Payments (high volume)
3. Keep Customer Account and Usage Tracking together initially
4. Event bus becomes inter-service (Kafka, AWS EventBridge)

**When to Split**:
- Independent scaling needs
- Team growth (> 8 engineers)
- Different tech requirements

---

## Context Boundaries in Code

### Enforcing Boundaries

**Module Imports**:
```typescript
// ❌ BAD: Direct domain coupling
import { CustomerAccount } from '../../customer-account/domain/aggregates/CustomerAccount';

// ✅ GOOD: Through application service
import { AccountService } from '../../customer-account/application/AccountService';
```

**Dependency Rules**:
- Domain layer: No imports from other contexts
- Application layer: Can import other contexts' application services
- Infrastructure layer: Can integrate with anything

---

## Testing Context Integration

### Integration Tests

Test event-driven flows across contexts:

```typescript
describe('Billing Cycle Workflow', () => {
  it('should create invoice after consumption calculated', async () => {
    // Act: Trigger consumption calculation
    await usageTrackingService.calculateConsumption(accountId);
    
    // Assert: Invoice created
    const invoice = await billingService.getLatestInvoice(accountId);
    expect(invoice).toBeDefined();
    expect(invoice.totalDue).toBeGreaterThan(0);
  });
});
```

---

**Next**: [Architecture Decisions](./09-architecture-decisions.md)
