/**
 * BotId Value Object
 * Unique identifier for a bot
 */
export class BotId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("BotId cannot be empty");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BotId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static fromString(value: string): BotId {
    return new BotId(value);
  }
}
