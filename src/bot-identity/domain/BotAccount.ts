import { BotId } from "./BotId";
import { ApiKey } from "./ApiKey";
import { ReputationScore } from "../../shared/domain/value-objects/ReputationScore";
import { TokenAmount } from "../../shared/domain/value-objects/TokenAmount";

export type VerificationStatus = "unverified" | "verified";

export interface StakeLock {
  lockedAmount: TokenAmount;
  activePromises: Array<{
    promiseId: string;
    amount: TokenAmount;
  }>;
}

export interface BotAccountData {
  botId: BotId;
  email?: string;
  displayName: string;
  apiKey: ApiKey;
  verificationStatus: VerificationStatus;
  emailVerified: boolean;
  avatarUrl?: string;
  reputationScore: ReputationScore;
  stakeLock: StakeLock;
  createdAt: Date;
}

/**
 * BotAccount Aggregate Root
 *
 * Manages bot identity, authentication, reputation, and stakes.
 * Enforces business rules around bot registration and reputation.
 */
export class BotAccount {
  private readonly botId: BotId;
  private email?: string;
  private displayName: string;
  private apiKey: ApiKey;
  private verificationStatus: VerificationStatus;
  private emailVerified: boolean;
  private avatarUrl?: string;
  private reputationScore: ReputationScore;
  private stakeLock: StakeLock;
  private readonly createdAt: Date;

  private constructor(data: BotAccountData) {
    this.botId = data.botId;
    this.email = data.email;
    this.displayName = data.displayName;
    this.apiKey = data.apiKey;
    this.verificationStatus = data.verificationStatus;
    this.emailVerified = data.emailVerified ?? false;
    this.avatarUrl = data.avatarUrl;
    this.reputationScore = data.reputationScore;
    this.stakeLock = data.stakeLock;
    this.createdAt = data.createdAt;
  }

  /**
   * Factory method: Create a new bot account
   */
  static async create(
    displayName: string,
    email?: string,
  ): Promise<BotAccount> {
    // Validate display name
    if (!displayName || displayName.trim().length === 0) {
      throw new Error("Display name is required");
    }

    if (displayName.length > 50) {
      throw new Error("Display name must be 50 characters or less");
    }

    // Validate email if provided
    if (email && !this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Generate API key
    const apiKey = await ApiKey.generate();

    // Create new bot account
    return new BotAccount({
      botId: new BotId(crypto.randomUUID()),
      email,
      displayName: displayName.trim(),
      apiKey,
      verificationStatus: "unverified",
      emailVerified: false,
      reputationScore: ReputationScore.default(),
      stakeLock: {
        lockedAmount: TokenAmount.zero(),
        activePromises: [],
      },
      createdAt: new Date(),
    });
  }

  /**
   * Reconstitute from database
   */
  static fromData(data: BotAccountData): BotAccount {
    return new BotAccount(data);
  }

  // Getters
  getBotId(): BotId {
    return this.botId;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getApiKey(): ApiKey {
    return this.apiKey;
  }

  getVerificationStatus(): VerificationStatus {
    return this.verificationStatus;
  }

  getReputationScore(): ReputationScore {
    return this.reputationScore;
  }

  getStakeLock(): StakeLock {
    return this.stakeLock;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getEmailVerified(): boolean {
    return this.emailVerified;
  }

  getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  // Profile management methods

  /**
   * Update display name
   */
  updateDisplayName(newDisplayName: string): void {
    // Validate display name
    if (!newDisplayName || newDisplayName.trim().length === 0) {
      throw new Error("Display name is required");
    }

    if (newDisplayName.length > 32) {
      throw new Error("Display name must be 32 characters or less");
    }

    if (newDisplayName.length < 3) {
      throw new Error("Display name must be at least 3 characters");
    }

    // Validate allowed characters (letters, numbers, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validNameRegex.test(newDisplayName)) {
      throw new Error("Display name can only contain letters, numbers, hyphens, and underscores");
    }

    this.displayName = newDisplayName.trim();
  }

  /**
   * Verify the bot's email
   */
  verifyEmail(): void {
    if (this.emailVerified) {
      throw new Error("Email is already verified");
    }
    this.emailVerified = true;
    this.verificationStatus = "verified";
  }

  /**
   * Update avatar URL
   */
  updateAvatar(avatarUrl: string): void {
    this.avatarUrl = avatarUrl;
  }

  /**
   * Remove avatar
   */
  removeAvatar(): void {
    this.avatarUrl = undefined;
  }

  /**
   * Get verification badge based on email verification and reputation
   */
  getVerificationBadge(): "verified" | "expert" | null {
    if (!this.emailVerified) {
      return null;
    }

    const score = this.reputationScore.getValue();
    if (score >= 90) {
      return "expert";
    }

    return "verified";
  }

  // Business logic methods

  /**
   * Verify the bot (e.g., after email confirmation)
   */
  verify(): void {
    if (this.verificationStatus === "verified") {
      throw new Error("Bot is already verified");
    }
    this.verificationStatus = "verified";
  }

  /**
   * Update reputation score
   */
  updateReputation(delta: number, _reason: string): void {
    this.reputationScore = this.reputationScore.adjust(delta);
  }

  /**
   * Lock stake for a promise
   */
  lockStake(promiseId: string, amount: TokenAmount): void {
    // Check if already locked for this promise
    if (this.stakeLock.activePromises.some((p) => p.promiseId === promiseId)) {
      throw new Error("Stake already locked for this promise");
    }

    this.stakeLock.activePromises.push({ promiseId, amount });
    this.stakeLock.lockedAmount = this.stakeLock.lockedAmount.add(amount);
  }

  /**
   * Release stake for a promise
   */
  releaseStake(promiseId: string): void {
    const promiseIndex = this.stakeLock.activePromises.findIndex(
      (p) => p.promiseId === promiseId,
    );

    if (promiseIndex === -1) {
      throw new Error("No stake locked for this promise");
    }

    const promise = this.stakeLock.activePromises[promiseIndex];
    this.stakeLock.lockedAmount = this.stakeLock.lockedAmount.subtract(
      promise.amount,
    );
    this.stakeLock.activePromises.splice(promiseIndex, 1);
  }

  /**
   * Get available stake (not locked)
   */
  getAvailableStake(totalBalance: TokenAmount): TokenAmount {
    return totalBalance.subtract(this.stakeLock.lockedAmount);
  }

  /**
   * Regenerate API key (security feature)
   */
  async regenerateApiKey(): Promise<ApiKey> {
    this.apiKey = await ApiKey.generate();
    return this.apiKey;
  }

  // Helper methods

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Convert to plain object for persistence
   */
  toData(): BotAccountData {
    return {
      botId: this.botId,
      email: this.email,
      displayName: this.displayName,
      apiKey: this.apiKey,
      verificationStatus: this.verificationStatus,
      emailVerified: this.emailVerified,
      avatarUrl: this.avatarUrl,
      reputationScore: this.reputationScore,
      stakeLock: this.stakeLock,
      createdAt: this.createdAt,
    };
  }
}
