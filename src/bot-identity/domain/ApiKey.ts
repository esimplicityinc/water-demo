/**
 * ApiKey Value Object
 * Secure bot authentication credential
 */
export class ApiKey {
  private readonly hashedValue: string;
  private readonly plainValue?: string; // Only set during generation

  private constructor(hashedValue: string, plainValue?: string) {
    this.hashedValue = hashedValue;
    this.plainValue = plainValue;
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  /**
   * Get plain value - only available during generation
   * After this is called once, the plain value should be given to the bot
   * and never stored or returned again
   */
  getPlainValue(): string | undefined {
    return this.plainValue;
  }

  equals(other: ApiKey): boolean {
    return this.hashedValue === other.hashedValue;
  }

  /**
   * Generate a new API key
   * Format: sk_<random_hex>
   */
  static async generate(): Promise<ApiKey> {
    // Generate random bytes for the key
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const hex = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const plainValue = `sk_${hex}`;
    const hashedValue = await this.hash(plainValue);

    return new ApiKey(hashedValue, plainValue);
  }

  /**
   * Create from existing hash
   */
  static fromHash(hashedValue: string): ApiKey {
    return new ApiKey(hashedValue);
  }

  /**
   * Hash an API key for storage
   */
  private static async hash(plainKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Verify a plain key against this hashed key
   */
  async verify(plainKey: string): Promise<boolean> {
    const hashedInput = await ApiKey.hash(plainKey);
    return hashedInput === this.hashedValue;
  }
}
