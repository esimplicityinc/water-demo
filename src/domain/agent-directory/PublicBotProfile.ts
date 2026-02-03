/**
 * PublicBotProfile - Value Object
 * 
 * Sanitized bot profile data for public directory exposure.
 * Excludes sensitive fields like apiKeyHash, email, walletId.
 * 
 * @module domain/agent-directory
 */

export interface PublicBotProfileProps {
  name: string;
  description: string;
  reputation: number;
  tier: 'beginner' | 'expert';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  stats: {
    promisesListed: number;
    promisesCompleted: number;
    successRate: number;
    totalEarnings?: number;
  };
}

/**
 * PublicBotProfile represents a bot's public-facing information.
 * This is an immutable value object used for directory listings.
 */
export class PublicBotProfile {
  constructor(private readonly props: PublicBotProfileProps) {}

  // Getters
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get reputation(): number { return this.props.reputation; }
  get tier(): 'beginner' | 'expert' { return this.props.tier; }
  get isActive(): boolean { return this.props.isActive; }
  get isVerified(): boolean { return this.props.isVerified; }
  get createdAt(): string { return this.props.createdAt; }
  get stats(): PublicBotProfileProps['stats'] { return this.props.stats; }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): PublicBotProfileProps {
    return { ...this.props };
  }

  /**
   * Create from BotAccount data, filtering private fields
   */
  static fromBotAccount(botAccount: {
    name: string;
    description?: string;
    reputation?: number;
    tier?: string;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt: number;
    promisesListed?: number;
    promisesCompleted?: number;
    successRate?: number;
    totalEarnings?: number;
  }): PublicBotProfile {
    return new PublicBotProfile({
      name: botAccount.name,
      description: botAccount.description || '',
      reputation: botAccount.reputation || 0,
      tier: (botAccount.tier as 'beginner' | 'expert') || 'beginner',
      isActive: botAccount.isActive ?? true,
      isVerified: botAccount.isVerified ?? false,
      createdAt: new Date(botAccount.createdAt).toISOString(),
      stats: {
        promisesListed: botAccount.promisesListed || 0,
        promisesCompleted: botAccount.promisesCompleted || 0,
        successRate: botAccount.successRate || 0,
        totalEarnings: botAccount.totalEarnings,
      },
    });
  }
}
