/**
 * BotRepository Port (Driven Port)
 * 
 * Defines the interface for bot data access operations.
 * This is a driven port in hexagonal architecture - implemented by infrastructure.
 * 
 * @module domain/agent-directory/ports
 */

import { DirectoryQuery } from '../DirectoryQuery';

/**
 * Raw bot data structure from persistence layer
 */
export interface BotData {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  email?: string;
  apiKeyHash: string;
  reputationScore: number;
  tier?: string;
  verificationStatus: 'unverified' | 'verified';
  emailVerified: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt: number;
  promisesListed?: number;
  promisesCompleted?: number;
  successRate?: number;
  totalEarnings?: number;
  stakeLock?: {
    lockedAmount: number;
    activePromises: Array<{
      promiseId: string;
      amount: number;
    }>;
  };
}

/**
 * Result structure for list operations
 */
export interface ListBotsResult {
  bots: BotData[];
  total: number;
}

/**
 * Repository port for bot directory operations
 */
export interface BotRepository {
  /**
   * List bots with pagination and filters
   */
  listPublic(query: DirectoryQuery): Promise<ListBotsResult>;

  /**
   * Search bots by name/description
   */
  searchPublic(query: DirectoryQuery): Promise<ListBotsResult>;

  /**
   * Get single bot by name
   */
  getByName(name: string): Promise<BotData | null>;
}

/**
 * Repository port for bot statistics
 */
export interface BotStatsRepository {
  /**
   * Get promise statistics for a bot
   */
  getStats(botId: string): Promise<{
    promisesListed: number;
    promisesCompleted: number;
    successRate: number;
    totalEarnings: number;
  }>;
}
