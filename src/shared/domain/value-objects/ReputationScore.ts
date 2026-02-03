/**
 * ReputationScore Value Object
 *
 * Represents a bot's trust metric (0-1000).
 * Immutable and self-validating.
 */
export class ReputationScore {
  private readonly value: number;

  private static readonly MIN = 0;
  private static readonly MAX = 1000;
  private static readonly DEFAULT = 100;

  constructor(value: number) {
    if (value < ReputationScore.MIN || value > ReputationScore.MAX) {
      throw new Error(
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

  toString(): string {
    return `${this.value} (${this.getTier()})`;
  }
}
