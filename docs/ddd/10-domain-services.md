# Domain Services

Domain Services encapsulate business logic that doesn't naturally belong to any single aggregate. They coordinate across aggregates and perform complex calculations.

---

## When to Use Domain Services

| Use Domain Service | Use Aggregate Method |
|------------------|---------------------|
| Logic spans multiple aggregates | Logic affects single aggregate |
| Complex calculation without state | State change within boundary |
| Cross-cutting domain concern | Natural entity behavior |

---

## Customer Account Context Services

### AccountVerificationService

**Purpose**: Validates customer eligibility and account requirements.

```typescript
interface AccountVerificationService {
  /**
   * Check if address is in service area
   */
  isInServiceArea(address: Address): Promise<boolean>;

  /**
   * Verify no active account exists at address
   */
  addressAvailable(address: Address): Promise<boolean>;

  /**
   * Calculate required service deposit based on customer profile
   */
  calculateRequiredDeposit(
    accountType: 'residential' | 'commercial' | 'industrial'
  ): Money;
}
```

**Business Rules**:
- Service area determined by municipal boundaries
- One active account per service address
- Deposit amounts: Residential $150, Commercial $500, Industrial $2000

---

## Usage Tracking Context Services

### AnomalyDetectionService

**Purpose**: Identifies unusual consumption patterns.

```typescript
interface AnomalyDetectionService {
  /**
   * Detect anomalies in reading
   */
  detectAnomalies(
    reading: MeterReading,
    historicalData: ConsumptionData[]
  ): Anomaly[];

  /**
   * Calculate expected consumption based on history
   */
  getExpectedConsumption(accountId: AccountId): CubicMeters;

  /**
   * Check if reading indicates meter malfunction
   */
  isMeterFaulty(reading: MeterReading): boolean;
}
```

**Anomaly Types**:
- Negative consumption (reading went backward)
- High usage (>200% of average)
- Low usage (&lt;10% of average)
- Meter malfunction patterns

---

### ConsumptionAnalysisService

**Purpose**: Analyzes consumption patterns for insights and conservation.

```typescript
interface ConsumptionAnalysisService {
  /**
   * Get customer's consumption statistics
   */
  getConsumptionStats(
    accountId: AccountId,
    months: number = 12
  ): ConsumptionStats;

  /**
   * Compare customer to similar accounts
   */
  compareToSimilarCustomers(accountId: AccountId): ComparisonResult;

  /**
   * Identify conservation opportunities
   */
  suggestConservationMeasures(accountId: AccountId): ConservationTip[];
}
```

**Usage**: Customer portal, billing analytics, conservation programs

---

## Billing & Payments Context Services

### BillingCalculationService

**Purpose**: Calculates invoice amounts and rates.

```typescript
interface BillingCalculationService {
  /**
   * Calculate total charges for consumption
   */
  calculateCharges(
    consumption: CubicMeters,
    baseRate: Rate,
    consumptionRate: Rate,
    tieredRates?: TieredRate[]
  ): LineItem[];

  /**
   * Calculate late fees for overdue invoices
   */
  calculateLateFees(
    amountDue: Money,
    daysOverdue: number
  ): Money;

  /**
   * Apply conservation discounts
   */
  applyConservationDiscount(
    consumption: CubicMeters,
    targetUsage: CubicMeters
  ): Money;
}
```

**Pricing Rules**:
- Base rate: Fixed monthly charge
- Consumption rate: $/m³ for usage
- Tiered rates: Variable rates based on volume tiers
- Late fees: 5% of amount due + $10 if >30 days
- Conservation discounts: 10% if under conservation target

---

### DelinquencyManagementService

**Purpose**: Manages escalation of overdue accounts.

```typescript
interface DelinquencyManagementService {
  /**
   * Determine delinquency status
   */
  getDelinquencyStatus(accountId: AccountId): DelinquencyStatus;

  /**
   * Generate payment reminder notice
   */
  generatePaymentReminder(accountId: AccountId): Notice;

  /**
   * Prepare service disconnection notice
   */
  generateDisconnectionNotice(accountId: AccountId): Notice;

  /**
   * Calculate reconnection fee
   */
  calculateReconnectionFee(): Money;
}
```

**Escalation**:
- 15 days overdue: Payment reminder email
- 30 days overdue: Second notice + late fee applied
- 60 days overdue: Disconnection notice + opportunity to pay
- 90+ days overdue: Service disconnect

---

## Meter Operations Context Services

### MeterMaintenanceService

**Purpose**: Manages meter lifecycle and maintenance scheduling.

```typescript
interface MeterMaintenanceService {
  /**
   * Determine if meter needs maintenance
   */
  requiresMaintenance(meter: Meter): boolean;

  /**
   * Check meter accuracy based on age and usage
   */
  getMeterAccuracyRating(meter: Meter): number; // 0-100%

  /**
   * Calculate meter replacement schedule
   */
  getReplacementSchedule(meterType: string): ReplacementPlan;

  /**
   * Generate maintenance work order
   */
  createMaintenanceWorkOrder(meterId: MeterId): WorkOrder;
}
```

**Maintenance Rules**:
- Meters aged 15+ years: Priority replacement
- Meters with 3+ faults in 12 months: Schedule replacement
- Large commercial meters: Annual calibration

---

### ServiceRequestSchedulingService

**Purpose**: Coordinates field technician scheduling.

```typescript
interface ServiceRequestSchedulingService {
  /**
   * Find available technician for request
   */
  findAvailableTechnician(
    territory: string,
    requestType: string
  ): Technician | null;

  /**
   * Generate optimal reading schedule
   */
  generateReadingSchedule(billingCycle: BillingCycle): ReadingAssignment[];

  /**
   * Calculate estimated travel time between properties
   */
  estimateTravelTime(from: Address, to: Address): Duration;

  /**
   * Batch requests into efficient routes
   */
  optimizeRoute(requests: ServiceRequest[]): RoutedRequests[];
}
```

**Scheduling Optimization**:
- Group requests by geographic territory
- Order by address proximity
- Respect customer preferences for time windows
- Balance workload across technicians

---

## Cross-Context Services

### BillingCycleOrchestrationService

**Purpose**: Coordinates the complete billing cycle across contexts.

```typescript
interface BillingCycleOrchestrationService {
  /**
   * Execute complete billing cycle
   */
  executeBillingCycle(cycleDate: Date): BillingCycleResult;

  /**
   * For each active account:
   * 1. Usage Tracking calculates consumption
   * 2. Billing generates invoice
   * 3. Notify customer
   */
}
```

**Workflow**:
```
1. Identify active accounts with due billing cycle
2. For each account:
   a. Get consumption from usage tracker
   b. Calculate invoice
   c. Send notification
   d. Record in billing history
3. Report on cycle completion (success rate, total billed, errors)
```

---

## Domain Service Best Practices

### ✅ DO

1. **Name after domain concept**
   ```typescript
   // Good
   class AnomalyDetectionService { }
   
   // Bad
   class ValidateReadingService { }
   ```

2. **Keep stateless**
   ```typescript
   // Good: No state
   async detectAnomalies(reading, history): Anomaly[] { }
   
   // Bad: Maintains state
   private history = [];
   async detect(reading): Anomaly[] { this.history.push(reading); }
   ```

3. **Accept aggregates or value objects**
   ```typescript
   // Good: Domain-specific types
   async calculate(consumption: CubicMeters, rate: Rate): Money
   
   // Bad: Primitive types
   async calculate(consumption: number, rate: number): number
   ```

### ❌ DON'T

1. **Don't put business rules in application services**
   ```typescript
   // Bad: Billing logic in service
   class BillingService {
     calculatePrice(consumption: number): number {
       return consumption * 1.25; // ❌
     }
   }
   
   // Good: In value object
   class Rate {
     calculateCharge(consumption: CubicMeters): Money { ... }
   }
   ```

2. **Don't bypass aggregates**
   - Always load aggregate, modify, save
   - Don't query child entities directly

---

**Next**: [Repositories](./11-repositories.md)
