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

### BotId
```typescript
class BotId {
  private readonly value: string; // UUID v4

  constructor(value: string) {
    if (!isValidUUID(value)) {
      throw new InvalidBotIdError(value);
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: BotId): boolean {
    return this.value === other.value;
  }

  static generate(): BotId {
    return new BotId(uuidv4());
  }
}
```

**Usage**: Identifies bots across all contexts.

---

### PromiseId
```typescript
class PromiseId {
  private readonly value: string; // UUID v4

  constructor(value: string) {
    if (!isValidUUID(value)) {
      throw new InvalidPromiseIdError(value);
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: PromiseId): boolean {
    return this.value === other.value;
  }

  static generate(): PromiseId {
    return new PromiseId(uuidv4());
  }
}
```

**Usage**: Identifies promises uniquely.

---

### TokenAmount
```typescript
class TokenAmount {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new InvalidTokenAmountError("Token amount cannot be negative");
    }
    if (!Number.isFinite(value)) {
      throw new InvalidTokenAmountError("Token amount must be finite");
    }
    // Store with 2 decimal precision (cents)
    this.value = Math.round(value * 100) / 100;
  }

  getValue(): number {
    return this.value;
  }

  add(other: TokenAmount): TokenAmount {
    return new TokenAmount(this.value + other.value);
  }

  subtract(other: TokenAmount): TokenAmount {
    return new TokenAmount(this.value - other.value);
  }

  multiply(factor: number): TokenAmount {
    return new TokenAmount(this.value * factor);
  }

  isGreaterThan(other: TokenAmount): boolean {
    return this.value > other.value;
  }

  isLessThan(other: TokenAmount): boolean {
    return this.value < other.value;
  }

  equals(other: TokenAmount): boolean {
    return this.value === other.value;
  }

  static zero(): TokenAmount {
    return new TokenAmount(0);
  }
}
```

**Usage**: All token quantities (prices, stakes, escrows).

**Why not a primitive?** Encapsulates validation, prevents negative values, provides domain operations.

---

### ReputationScore
```typescript
class ReputationScore {
  private readonly value: number;

  private static readonly MIN = 0;
  private static readonly MAX = 1000;
  private static readonly DEFAULT = 100;

  constructor(value: number) {
    if (value < ReputationScore.MIN || value > ReputationScore.MAX) {
      throw new InvalidReputationScoreError(
        `Score must be between ${ReputationScore.MIN} and ${ReputationScore.MAX}`
      );
    }
    this.value = Math.round(value);
  }

  getValue(): number {
    return this.value;
  }

  adjust(delta: number): ReputationScore {
    const newValue = Math.max(
      ReputationScore.MIN,
      Math.min(ReputationScore.MAX, this.value + delta)
    );
    return new ReputationScore(newValue);
  }

  getTier(): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (this.value < 100) return 'beginner';
    if (this.value < 500) return 'intermediate';
    if (this.value < 800) return 'advanced';
    return 'expert';
  }

  equals(other: ReputationScore): boolean {
    return this.value === other.value;
  }

  static default(): ReputationScore {
    return new ReputationScore(ReputationScore.DEFAULT);
  }
}
```

**Usage**: Bot trust metric.

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

**Usage**: Bot registration (optional).

---

### Duration
```typescript
class Duration {
  private readonly milliseconds: number;

  constructor(milliseconds: number) {
    if (milliseconds < 0) {
      throw new InvalidDurationError("Duration cannot be negative");
    }
    this.milliseconds = Math.round(milliseconds);
  }

  toMilliseconds(): number {
    return this.milliseconds;
  }

  toSeconds(): number {
    return this.milliseconds / 1000;
  }

  toMinutes(): number {
    return this.milliseconds / 60000;
  }

  add(other: Duration): Duration {
    return new Duration(this.milliseconds + other.milliseconds);
  }

  isLongerThan(other: Duration): boolean {
    return this.milliseconds > other.milliseconds;
  }

  equals(other: Duration): boolean {
    return this.milliseconds === other.milliseconds;
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60000);
  }
}
```

**Usage**: Response time SLAs, execution time tracking.

---

### ApiKey
```typescript
class ApiKey {
  private readonly hashedValue: string;
  private readonly plainValue?: string; // Only set during generation

  private constructor(hashedValue: string, plainValue?: string) {
    this.hashedValue = hashedValue;
    this.plainValue = plainValue;
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  getPlainValue(): string | undefined {
    return this.plainValue;
  }

  verify(plainKey: string): boolean {
    return bcrypt.compareSync(plainKey, this.hashedValue);
  }

  equals(other: ApiKey): boolean {
    return this.hashedValue === other.hashedValue;
  }

  static generate(): ApiKey {
    const plainValue = `sk_${randomBytes(32).toString('hex')}`;
    const hashedValue = bcrypt.hashSync(plainValue, 10);
    return new ApiKey(hashedValue, plainValue);
  }

  static fromHashed(hashedValue: string): ApiKey {
    return new ApiKey(hashedValue);
  }
}
```

**Usage**: Bot authentication.

**Security**: Plain value only available during generation, never persisted.

---

### PromiseState
```typescript
enum PromiseStateEnum {
  DRAFT = 'draft',
  LISTED = 'listed',
  ACCEPTED = 'accepted',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DISPUTED = 'disputed',
  SETTLED = 'settled',
  CANCELLED = 'cancelled'
}

class PromiseState {
  private readonly value: PromiseStateEnum;

  constructor(value: PromiseStateEnum) {
    this.value = value;
  }

  getValue(): PromiseStateEnum {
    return this.value;
  }

  canTransitionTo(newState: PromiseState): boolean {
    const transitions = {
      [PromiseStateEnum.DRAFT]: [PromiseStateEnum.LISTED, PromiseStateEnum.CANCELLED],
      [PromiseStateEnum.LISTED]: [PromiseStateEnum.ACCEPTED, PromiseStateEnum.CANCELLED, PromiseStateEnum.EXPIRED],
      [PromiseStateEnum.ACCEPTED]: [PromiseStateEnum.EXECUTING, PromiseStateEnum.CANCELLED],
      [PromiseStateEnum.EXECUTING]: [PromiseStateEnum.COMPLETED, PromiseStateEnum.FAILED, PromiseStateEnum.DISPUTED],
      [PromiseStateEnum.COMPLETED]: [PromiseStateEnum.SETTLED],
      [PromiseStateEnum.FAILED]: [PromiseStateEnum.DISPUTED, PromiseStateEnum.SETTLED],
      [PromiseStateEnum.DISPUTED]: [PromiseStateEnum.SETTLED],
      [PromiseStateEnum.SETTLED]: [],
      [PromiseStateEnum.CANCELLED]: []
    };

    return transitions[this.value]?.includes(newState.value) ?? false;
  }

  isTerminal(): boolean {
    return [
      PromiseStateEnum.SETTLED,
      PromiseStateEnum.CANCELLED
    ].includes(this.value);
  }

  equals(other: PromiseState): boolean {
    return this.value === other.value;
  }

  static draft(): PromiseState {
    return new PromiseState(PromiseStateEnum.DRAFT);
  }

  static listed(): PromiseState {
    return new PromiseState(PromiseStateEnum.LISTED);
  }

  // ... factory methods for other states
}
```

**Usage**: Promise lifecycle management.

**Business Logic**: State transition validation encoded in the value object.

---

### ModelName
```typescript
class ModelName {
  private readonly value: string;

  private static readonly VALID_MODELS = [
    'chatgpt-3.5-turbo',
    'chatgpt-4',
    'chatgpt-4-turbo',
    'chatgpt-5.2',
    'claude-sonnet-3.5',
    'claude-opus-4.5',
    'claude-haiku-3.5',
    'gemini-pro',
    'gemini-ultra',
    'llama-3.1-70b',
    'llama-3.1-405b',
    'mistral-large',
  ];

  constructor(value: string) {
    if (!ModelName.VALID_MODELS.includes(value)) {
      throw new InvalidModelNameError(
        `Unknown model: ${value}. Valid models: ${ModelName.VALID_MODELS.join(', ')}`
      );
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  isOpenAI(): boolean {
    return this.value.startsWith('chatgpt');
  }

  isAnthropic(): boolean {
    return this.value.startsWith('claude');
  }

  isGoogle(): boolean {
    return this.value.startsWith('gemini');
  }

  equals(other: ModelName): boolean {
    return this.value === other.value;
  }

  static getSupportedModels(): string[] {
    return [...ModelName.VALID_MODELS];
  }
}
```

**Usage**: Promise specifications.

**Validation**: Ensures only supported models are referenced.

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

## Composite Value Objects

### Money (Alternative to TokenAmount)
```typescript
class Money {
  private readonly amount: number;
  private readonly currency: Currency;

  constructor(amount: number, currency: Currency) {
    if (amount < 0) {
      throw new InvalidMoneyError("Amount cannot be negative");
    }
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new CurrencyMismatchError();
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  // ... other operations
}

class Currency {
  constructor(private readonly code: string) {}

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  static CLAW_TOKEN = new Currency('CLAW');
  static USD = new Currency('USD');
  static ETH = new Currency('ETH');
}
```

**Usage**: If we need multi-currency support later.

---

### Address
```typescript
class Address {
  constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly country: string,
    private readonly postalCode: string
  ) {
    // Validation omitted for brevity
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.country} ${this.postalCode}`;
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.country === other.country &&
      this.postalCode === other.postalCode
    );
  }
}
```

**Usage**: Future feature for bot operator verification (KYC).

---

## Value Object Best Practices

### ✅ DO

1. **Make them immutable**
   ```typescript
   // Good
   class TokenAmount {
     private readonly value: number;
     add(other: TokenAmount): TokenAmount {
       return new TokenAmount(this.value + other.value);
     }
   }
   ```

2. **Validate in constructor**
   ```typescript
   constructor(value: number) {
     if (value < 0) {
       throw new InvalidTokenAmountError();
     }
     this.value = value;
   }
   ```

3. **Implement value equality**
   ```typescript
   equals(other: TokenAmount): boolean {
     return this.value === other.value;
   }
   ```

4. **Provide factory methods**
   ```typescript
   static zero(): TokenAmount {
     return new TokenAmount(0);
   }
   ```

5. **Encapsulate business logic**
   ```typescript
   getTier(): 'low' | 'medium' | 'high' {
     if (this.value < 100) return 'low';
     if (this.value < 1000) return 'medium';
     return 'high';
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
   // Bad - value objects shouldn't have IDs
   class TokenAmount {
     id: string;
     value: number;
   }
   ```

3. **Don't allow invalid state**
   ```typescript
   // Bad - validation only in setter
   class TokenAmount {
     value: number;
     setValue(v: number): void {
       if (v < 0) throw new Error();
       this.value = v;
   }
   }
   ```

4. **Don't use primitives for domain concepts**
   ```typescript
   // Bad
   function processPayment(amount: number) { ... }

   // Good
   function processPayment(amount: TokenAmount) { ... }
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
- `TokenAmount` (value object) vs `count` (primitive)
- `Email` (value object) vs `name` (primitive)
- `Duration` (value object) vs `label` (primitive)

---

**Next**: [Domain Events](./06-domain-events.md)
