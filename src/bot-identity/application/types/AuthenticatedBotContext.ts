import { VerificationStatus } from "../../domain/BotAccount";

/**
 * AuthenticatedBotContext
 *
 * Represents the context attached to authenticated bot requests.
 * This is used by the AuthenticationService to provide bot identity
 * information throughout the application layer.
 */
export interface AuthenticatedBotContext {
  /** Unique identifier for the bot */
  botId: string;

  /** Display name for the bot */
  displayName: string;

  /** Current verification status of the bot */
  verificationStatus: VerificationStatus;

  /** Current reputation score (0-100) */
  reputationScore: number;

  /** Number of remaining API calls in the current rate limit window */
  rateLimitRemaining: number;

  /** Timestamp when the bot was authenticated */
  authenticatedAt: Date;
}
