/**
 * EscrowId Value Object
 * Unique identifier for Escrow aggregates
 */
export class EscrowId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Create a new EscrowId with auto-generated UUID
   */
  static generate(): EscrowId {
    const uuid = crypto.randomUUID();
    return new EscrowId(uuid);
  }

  /**
   * Create EscrowId from existing string value
   */
  static fromString(value: string): EscrowId {
    if (!EscrowId.isValid(value)) {
      throw new Error(`Invalid EscrowId format: ${value}`);
    }
    return new EscrowId(value);
  }

  /**
   * Validate if string is a valid ID (UUID or Convex ID)
   */
  static isValid(value: string): boolean {
    // Accept UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // Accept Convex ID format (starts with k, followed by alphanumeric)
    const convexIdRegex = /^k[a-z0-9]{31}$/;
    return uuidRegex.test(value) || convexIdRegex.test(value);
  }

  /**
   * Get the string value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Check equality with another EscrowId
   */
  equals(other: EscrowId): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}
