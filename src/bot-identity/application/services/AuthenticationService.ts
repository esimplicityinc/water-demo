import { AuthenticatedBotContext } from "../types/AuthenticatedBotContext";

/**
 * Port: API Key Validator
 *
 * Infrastructure will implement this interface to verify API keys.
 * This keeps the application layer pure and decoupled from Convex.
 */
export interface ApiKeyValidator {
  /**
   * Validate an API key and return bot context if valid
   * @param apiKey - The API key to validate
   * @returns Bot context if valid, null otherwise
   */
  validate(apiKey: string): Promise<AuthenticatedBotContext | null>;
}

/**
 * Port: Rate Limit Store
 *
 * Infrastructure will implement this for persistent rate limiting.
 * The service includes in-memory fallback for testing.
 */
export interface RateLimitStore {
  /**
   * Record a failed authentication attempt
   * @param identifier - The identifier (API key or IP address)
   */
  recordAttempt(identifier: string): Promise<void>;

  /**
   * Get the number of failed attempts in the last minute
   * @param identifier - The identifier to check
   * @returns Number of failed attempts
   */
  getAttemptCount(identifier: string): Promise<number>;

  /**
   * Clear attempts for an identifier (e.g., after successful auth)
   * @param identifier - The identifier to clear
   */
  clearAttempts(identifier: string): Promise<void>;
}

/**
 * Failed Attempt Entry
 *
 * Tracks individual failed authentication attempts with timestamps
 * for rate limit calculation.
 */
interface FailedAttempt {
  identifier: string;
  timestamp: number;
}

/**
 * AuthenticationService
 *
 * Application service that orchestrates bot authentication.
 * Manages API key validation and rate limiting to prevent abuse.
 *
 * Following Hexagonal Architecture:
 * - Depends on ports (interfaces) not concrete implementations
 * - Infrastructure provides the adapters
 * - Pure domain/application logic with no external dependencies
 */
export class AuthenticationService {
  /**
   * Rate limit threshold: maximum failed attempts allowed per minute
   */
  private static readonly RATE_LIMIT_THRESHOLD = 100;

  /**
   * Time window for rate limiting in milliseconds (1 minute)
   */
  private static readonly RATE_LIMIT_WINDOW_MS = 60 * 1000;

  /**
   * In-memory store for failed attempts (fallback when no persistent store provided)
   */
  private inMemoryAttempts: FailedAttempt[] = [];

  /**
   * Creates a new AuthenticationService
   *
   * @param apiKeyValidator - Port implementation for API key validation
   * @param rateLimitStore - Optional persistent store for rate limiting (falls back to in-memory)
   */
  constructor(
    private readonly apiKeyValidator: ApiKeyValidator,
    private readonly rateLimitStore?: RateLimitStore,
  ) {}

  /**
   * Authenticate a bot using its API key
   *
   * This method:
   * 1. Checks if the identifier is rate limited
   * 2. Validates the API key through the validator port
   * 3. Records failed attempts if validation fails
   * 4. Clears attempts on successful authentication
   *
   * @param apiKey - The API key to authenticate
   * @returns AuthenticatedBotContext if successful, null otherwise
   */
  async authenticate(apiKey: string): Promise<AuthenticatedBotContext | null> {
    // Check rate limit before attempting validation
    if (this.isRateLimited(apiKey)) {
      return null;
    }

    // Validate the API key through the port
    const context = await this.apiKeyValidator.validate(apiKey);

    if (context === null) {
      // Record failed attempt
      await this.recordFailedAttempt(apiKey);
      return null;
    }

    // Successful authentication - clear any previous failed attempts
    await this.clearFailedAttempts(apiKey);

    return context;
  }

  /**
   * Check if an identifier has exceeded the rate limit
   *
   * Rate limit: 100 failed attempts in the last minute
   *
   * @param identifier - The identifier to check (API key or IP address)
   * @returns true if rate limited, false otherwise
   */
  isRateLimited(identifier: string): boolean {
    const attemptCount = this.getInMemoryAttemptCount(identifier);
    return attemptCount >= AuthenticationService.RATE_LIMIT_THRESHOLD;
  }

  /**
   * Record a failed authentication attempt
   *
   * Records the attempt both in-memory and to the persistent store if available.
   *
   * @param identifier - The identifier that failed authentication
   */
  async recordFailedAttempt(identifier: string): Promise<void> {
    // Record in-memory
    this.inMemoryAttempts.push({
      identifier,
      timestamp: Date.now(),
    });

    // Clean up old attempts to prevent memory growth
    this.cleanupOldAttempts();

    // Record to persistent store if available
    if (this.rateLimitStore) {
      await this.rateLimitStore.recordAttempt(identifier);
    }
  }

  /**
   * Get the number of failed attempts for an identifier in the current window
   *
   * @param identifier - The identifier to check
   * @returns Number of failed attempts in the last minute
   */
  private getInMemoryAttemptCount(identifier: string): number {
    const now = Date.now();
    const windowStart = now - AuthenticationService.RATE_LIMIT_WINDOW_MS;

    return this.inMemoryAttempts.filter(
      (attempt) =>
        attempt.identifier === identifier && attempt.timestamp > windowStart,
    ).length;
  }

  /**
   * Clear failed attempts for an identifier after successful authentication
   *
   * @param identifier - The identifier to clear
   */
  private async clearFailedAttempts(identifier: string): Promise<void> {
    // Clear from in-memory
    this.inMemoryAttempts = this.inMemoryAttempts.filter(
      (attempt) => attempt.identifier !== identifier,
    );

    // Clear from persistent store if available
    if (this.rateLimitStore) {
      await this.rateLimitStore.clearAttempts(identifier);
    }
  }

  /**
   * Clean up attempts older than the rate limit window to prevent memory growth
   */
  private cleanupOldAttempts(): void {
    const now = Date.now();
    const windowStart = now - AuthenticationService.RATE_LIMIT_WINDOW_MS;

    this.inMemoryAttempts = this.inMemoryAttempts.filter(
      (attempt) => attempt.timestamp > windowStart,
    );
  }
}
