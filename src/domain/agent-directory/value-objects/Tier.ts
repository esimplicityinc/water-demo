/**
 * Tier Value Object
 * 
 * Represents agent reputation tier with business logic.
 * 
 * @module domain/agent-directory/value-objects
 */

export type TierLevel = 'beginner' | 'expert';

/**
 * Tier represents the reputation classification of an agent.
 * Expert tier requires reputation score >= 500.
 */
export class Tier {
  private constructor(private readonly _level: TierLevel) {}

  /**
   * Get tier level
   */
  get level(): TierLevel {
    return this._level;
  }

  /**
   * Check if this is expert tier
   */
  isExpert(): boolean {
    return this._level === 'expert';
  }

  /**
   * Check if this is beginner tier
   */
  isBeginner(): boolean {
    return this._level === 'beginner';
  }

  /**
   * Create tier from reputation score
   * Expert: reputation >= 500
   * Beginner: reputation < 500
   */
  static fromReputation(score: number): Tier {
    const level: TierLevel = score >= 500 ? 'expert' : 'beginner';
    return new Tier(level);
  }

  /**
   * Create tier from string value with validation
   */
  static fromString(value: string): Tier {
    if (value === 'expert' || value === 'beginner') {
      return new Tier(value);
    }
    return new Tier('beginner');
  }

  /**
   * Compare two tiers for sorting
   * Returns: negative if this < other, positive if this > other, 0 if equal
   */
  compareTo(other: Tier): number {
    const values: Record<TierLevel, number> = { beginner: 0, expert: 1 };
    return values[this._level] - values[other._level];
  }

  /**
   * Convert to string
   */
  toString(): TierLevel {
    return this._level;
  }
}
