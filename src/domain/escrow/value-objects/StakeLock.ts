/**
 * StakeLock Value Object
 * Represents provider's stake locked for an escrow
 * Tracks the stake amount and reference
 */
export class StakeLock {
  private readonly _amount: number;
  private readonly _stakeLockId: string | null;

  private constructor(amount: number, stakeLockId: string | null) {
    this._amount = amount;
    this._stakeLockId = stakeLockId;
  }

  /**
   * Create a new StakeLock
   */
  static create(amount: number, stakeLockId?: string): StakeLock {
    if (!Number.isInteger(amount)) {
      throw new Error("Stake amount must be an integer");
    }

    if (amount < 0) {
      throw new Error("Stake amount cannot be negative");
    }

    return new StakeLock(amount, stakeLockId ?? null);
  }

  /**
   * Create from stored values
   */
  static fromStorage(amount: number, stakeLockId: string | null): StakeLock {
    return new StakeLock(amount, stakeLockId);
  }

  /**
   * Get locked stake amount
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Get stake lock reference ID
   */
  get stakeLockId(): string | null {
    return this._stakeLockId;
  }

  /**
   * Check if stake is locked
   */
  isLocked(): boolean {
    return this._amount > 0 && this._stakeLockId !== null;
  }

  /**
   * Check equality
   */
  equals(other: StakeLock): boolean {
    return (
      this._amount === other._amount && this._stakeLockId === other._stakeLockId
    );
  }

  /**
   * Convert to plain object
   */
  toJSON(): { amount: number; stakeLockId: string | null } {
    return {
      amount: this._amount,
      stakeLockId: this._stakeLockId,
    };
  }
}
