/**
 * TokenAmount Value Object
 *
 * Represents a quantity of ClawMarket tokens.
 * Immutable and self-validating.
 */
export class TokenAmount {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error("Token amount cannot be negative");
    }
    if (!Number.isFinite(value)) {
      throw new Error("Token amount must be finite");
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

  toString(): string {
    return `${this.value} CLAW`;
  }
}
