/**
 * LockedFunds Value Object
 * Represents tokens locked in escrow
 * Immutable and validated
 */
export class LockedFunds {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
  }

  /**
   * Create LockedFunds with validation
   * @throws Error if amount is invalid
   */
  static create(amount: number, currency: string = "CLAW"): LockedFunds {
    if (!Number.isInteger(amount)) {
      throw new Error("Amount must be an integer");
    }

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (!currency || currency.trim().length === 0) {
      throw new Error("Currency is required");
    }

    if (currency.length > 10) {
      throw new Error("Currency code too long (max 10 characters)");
    }

    return new LockedFunds(amount, currency.toUpperCase());
  }

  /**
   * Create from stored values (skips validation for reconstruction)
   */
  static fromStorage(amount: number, currency: string): LockedFunds {
    return new LockedFunds(amount, currency);
  }

  /**
   * Get locked amount
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Get currency code
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Check equality
   */
  equals(other: LockedFunds): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  /**
   * Convert to plain object for storage
   */
  toJSON(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }
}
