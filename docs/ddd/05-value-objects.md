# Value Objects

Value Objects are immutable domain primitives defined by their attributes rather than identity. They have no lifecycle and are compared by value equality.

---

## Characteristics of Value Objects

1. **Immutable**: Cannot be changed after creation
2. **Value Equality**: Two instances with same values are considered equal
3. **No Identity**: No unique ID field
4. **Self-Validating**: Enforce invariants in constructor
5. **Side-Effect Free**: Methods return new instances, don't mutate

---

## Core Value Objects

### AccountId
```typescript
class AccountId {
  private readonly value: string; // UUID v4

  constructor(value: string) {
    if (!isValidUUID(value)) {
      throw new InvalidAccountIdError(value);
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: AccountId): boolean {
    return this.value === other.value;
  }

  static generate(): AccountId {
    return new AccountId(uuidv4());
  }
}
```

**Usage**: Identifies customer water accounts.

---

### MeterId
```typescript
class MeterId {
  private readonly value: string; // UUID or device serial number

  constructor(value: string) {
    if (!value || value.length === 0) {
      throw new InvalidMeterIdError(value);
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: MeterId): boolean {
    return this.value === other.value;
  }
}
```

**Usage**: Identifies physical water meters.

---

### CubicMeters
```typescript
class CubicMeters {
  private readonly value: number; // m³

  constructor(value: number) {
    if (value < 0) {
      throw new InvalidCubicMetersError("Cannot be negative");
    }
    if (!Number.isFinite(value)) {
      throw new InvalidCubicMetersError("Must be finite");
    }
    // Store with 3 decimal precision
    this.value = Math.round(value * 1000) / 1000;
  }

  getValue(): number {
    return this.value;
  }

  add(other: CubicMeters): CubicMeters {
    return new CubicMeters(this.value + other.value);
  }

  subtract(other: CubicMeters): CubicMeters {
    return new CubicMeters(this.value - other.value);
  }

  multiply(factor: number): CubicMeters {
    return new CubicMeters(this.value * factor);
  }

  isGreaterThan(other: CubicMeters): boolean {
    return this.value > other.value;
  }

  isLessThan(other: CubicMeters): boolean {
    return this.value < other.value;
  }

  equals(other: CubicMeters): boolean {
    return this.value === other.value;
  }

  static zero(): CubicMeters {
    return new CubicMeters(0);
  }
}
```

**Usage**: All water volume measurements (meter readings, consumption, allowances).

**Why not a primitive?** Encapsulates validation, prevents negative values, provides domain operations.

---

### Money
```typescript
class Money {
  private readonly value: number;
  private readonly currency: Currency;

  constructor(value: number, currency: Currency = Currency.USD) {
    if (value < 0) {
      throw new InvalidMoneyError("Amount cannot be negative");
    }
    this.value = Math.round(value * 100) / 100;
    this.currency = currency;
  }

  getValue(): number {
    return this.value;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new CurrencyMismatchError();
    }
    return new Money(this.value + other.value, this.currency);
  }

  subtract(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new CurrencyMismatchError();
    }
    return new Money(this.value - other.value, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.value * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.value === other.value && 
           this.currency.equals(other.currency);
  }

  static zero(currency: Currency = Currency.USD): Money {
    return new Money(0, currency);
  }
}

class Currency {
  constructor(private readonly code: string) {}

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  static USD = new Currency('USD');
  static EUR = new Currency('EUR');
}
```

**Usage**: All monetary values (rates, deposits, invoices, payments).

---

### Rate
```typescript
class Rate {
  private readonly amount: Money;
  private readonly unit: 'per_cubic_meter' | 'fixed_monthly';

  constructor(amount: Money, unit: 'per_cubic_meter' | 'fixed_monthly') {
    if (amount.getValue() < 0) {
      throw new InvalidRateError("Rate cannot be negative");
    }
    this.amount = amount;
    this.unit = unit;
  }

  getAmount(): Money {
    return this.amount;
  }

  getUnit(): string {
    return this.unit;
  }

  calculateCharge(consumption: CubicMeters): Money {
    if (this.unit === 'per_cubic_meter') {
      return this.amount.multiply(consumption.getValue());
    }
    return this.amount; // Fixed rate regardless of consumption
  }

  equals(other: Rate): boolean {
    return this.amount.equals(other.amount) && 
           this.unit === other.unit;
  }
}
```

**Usage**: Billing rates (consumption-based or fixed).

---

### AccountStatus
```typescript
enum AccountStatusEnum {
  PENDING_ACTIVATION = 'pending_activation',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELINQUENT = 'delinquent',
  CLOSED = 'closed'
}

class AccountStatus {
  private readonly value: AccountStatusEnum;

  constructor(value: AccountStatusEnum) {
    this.value = value;
  }

  getValue(): AccountStatusEnum {
    return this.value;
  }

  canTransitionTo(newStatus: AccountStatus): boolean {
    const transitions = {
      [AccountStatusEnum.PENDING_ACTIVATION]: [AccountStatusEnum.ACTIVE, AccountStatusEnum.CLOSED],
      [AccountStatusEnum.ACTIVE]: [AccountStatusEnum.SUSPENDED, AccountStatusEnum.CLOSED],
      [AccountStatusEnum.SUSPENDED]: [AccountStatusEnum.ACTIVE, AccountStatusEnum.DELINQUENT, AccountStatusEnum.CLOSED],
      [AccountStatusEnum.DELINQUENT]: [AccountStatusEnum.ACTIVE, AccountStatusEnum.SUSPENDED, AccountStatusEnum.CLOSED],
      [AccountStatusEnum.CLOSED]: []
    };

    return transitions[this.value]?.includes(newStatus.value) ?? false;
  }

  isActive(): boolean {
    return this.value === AccountStatusEnum.ACTIVE;
  }

  isClosed(): boolean {
    return this.value === AccountStatusEnum.CLOSED;
  }

  equals(other: AccountStatus): boolean {
    return this.value === other.value;
  }

  static pending(): AccountStatus {
    return new AccountStatus(AccountStatusEnum.PENDING_ACTIVATION);
  }

  static active(): AccountStatus {
    return new AccountStatus(AccountStatusEnum.ACTIVE);
  }

  static suspended(): AccountStatus {
    return new AccountStatus(AccountStatusEnum.SUSPENDED);
  }

  static delinquent(): AccountStatus {
    return new AccountStatus(AccountStatusEnum.DELINQUENT);
  }

  static closed(): AccountStatus {
    return new AccountStatus(AccountStatusEnum.CLOSED);
  }
}
```

**Usage**: Account lifecycle management.

**Business Logic**: State transition validation encoded in the value object.

---

### BillingCycle
```typescript
enum BillingCycleEnum {
  MONTHLY = 'monthly',
  BIMONTHLY = 'bimonthly',
  QUARTERLY = 'quarterly'
}

class BillingCycle {
  private readonly value: BillingCycleEnum;

  private static readonly CYCLE_DAYS = {
    [BillingCycleEnum.MONTHLY]: 30,
    [BillingCycleEnum.BIMONTHLY]: 60,
    [BillingCycleEnum.QUARTERLY]: 90
  };

  constructor(value: BillingCycleEnum) {
    this.value = value;
  }

  getValue(): BillingCycleEnum {
    return this.value;
  }

  getDays(): number {
    return BillingCycle.CYCLE_DAYS[this.value];
  }

  getNextBillingDate(from: Date): Date {
    const days = this.getDays();
    return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
  }

  equals(other: BillingCycle): boolean {
    return this.value === other.value;
  }

  static monthly(): BillingCycle {
    return new BillingCycle(BillingCycleEnum.MONTHLY);
  }

  static bimonthly(): BillingCycle {
    return new BillingCycle(BillingCycleEnum.BIMONTHLY);
  }

  static quarterly(): BillingCycle {
    return new BillingCycle(BillingCycleEnum.QUARTERLY);
  }
}
```

**Usage**: Billing schedule management.

---

### Timestamp
```typescript
class Timestamp {
  private readonly value: Date;

  constructor(value: Date | string | number) {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      throw new InvalidTimestampError("Invalid date value");
    }
    this.value = date;
  }

  toDate(): Date {
    return new Date(this.value);
  }

  toISOString(): string {
    return this.value.toISOString();
  }

  toUnixTimestamp(): number {
    return Math.floor(this.value.getTime() / 1000);
  }

  isBefore(other: Timestamp): boolean {
    return this.value < other.value;
  }

  isAfter(other: Timestamp): boolean {
    return this.value > other.value;
  }

  equals(other: Timestamp): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  static fromUnix(seconds: number): Timestamp {
    return new Timestamp(seconds * 1000);
  }
}
```

**Usage**: All temporal data across system.

---

### Address
```typescript
class Address {
  constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly state: string,
    private readonly zipCode: string,
    private readonly country: string = 'USA'
  ) {
    if (!street || !city || !state || !zipCode) {
      throw new InvalidAddressError("All address fields required");
    }
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}`;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    );
  }
}
```

**Usage**: Service addresses and billing addresses.

---

### Email
```typescript
class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidEmailError(value);
    }
    this.value = value.toLowerCase().trim();
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  private isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
```

**Usage**: Customer contact information.

---

### PhoneNumber
```typescript
class PhoneNumber {
  private readonly value: string;

  constructor(value: string) {
    const cleaned = this.cleanPhoneNumber(value);
    if (!this.isValid(cleaned)) {
      throw new InvalidPhoneNumberError(value);
    }
    this.value = cleaned;
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    // Format as (123) 456-7890
    return `(${this.value.slice(0, 3)}) ${this.value.slice(3, 6)}-${this.value.slice(6)}`;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  private cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private isValid(phone: string): boolean {
    return phone.length === 10; // US format
  }
}
```

**Usage**: Customer phone numbers.

---

## Value Object Best Practices

### ✅ DO

1. **Make them immutable**
   ```typescript
   // Good
   class CubicMeters {
     private readonly value: number;
     add(other: CubicMeters): CubicMeters {
       return new CubicMeters(this.value + other.value);
     }
   }
   ```

2. **Validate in constructor**
   ```typescript
   constructor(value: number) {
     if (value < 0) {
       throw new InvalidCubicMetersError();
     }
     this.value = value;
   }
   ```

3. **Implement value equality**
   ```typescript
   equals(other: CubicMeters): boolean {
     return this.value === other.value;
   }
   ```

4. **Provide factory methods**
   ```typescript
   static zero(): CubicMeters {
     return new CubicMeters(0);
   }
   ```

### ❌ DON'T

1. **Don't use setters**
   ```typescript
   // Bad
   setValue(newValue: number): void {
     this.value = newValue;
   }
   ```

2. **Don't give them identity**
   ```typescript
   // Bad
   class CubicMeters {
     id: string;
     value: number;
   }
   ```

3. **Don't use primitives for domain concepts**
   ```typescript
   // Bad
   function calculateRate(consumption: number) { ... }

   // Good
   function calculateRate(consumption: CubicMeters) { ... }
   ```

---

## When to Use Value Objects vs Primitives

| Use Value Object | Use Primitive |
|-----------------|---------------|
| Domain concept with validation rules | Simple data with no rules |
| Needs business operations | Just storage |
| Has units or constraints | Generic data |
| Appears in multiple places | Used once |

**Examples**:
- `CubicMeters` (value object) vs `count` (primitive)
- `Money` (value object) vs `price` (primitive)
- `Email` (value object) vs `name` (primitive)

---

**Next**: [Domain Events](./06-domain-events.md)
