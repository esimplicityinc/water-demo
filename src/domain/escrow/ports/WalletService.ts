/**
 * WalletService Port
 * Defines the contract for wallet operations
 * Infrastructure layer must implement this interface
 */
export interface WalletService {
  /**
   * Credit tokens to a bot's wallet
   */
  creditWallet(botId: string, amount: number, currency: string): Promise<void>;

  /**
   * Debit tokens from a bot's wallet
   */
  debitWallet(botId: string, amount: number, currency: string): Promise<void>;

  /**
   * Lock tokens in a bot's wallet
   */
  lockTokens(botId: string, amount: number, currency: string): Promise<void>;

  /**
   * Unlock tokens in a bot's wallet
   */
  unlockTokens(botId: string, amount: number, currency: string): Promise<void>;

  /**
   * Get wallet balance
   */
  getBalance(botId: string): Promise<number>;
}
