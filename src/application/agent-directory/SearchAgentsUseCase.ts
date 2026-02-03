/**
 * SearchAgentsUseCase - Application Service
 * 
 * Searches agents by name or description with text matching.
 * 
 * @module application/agent-directory
 */

import { PublicBotProfile } from '../../domain/agent-directory/PublicBotProfile';
import { DirectoryQuery } from '../../domain/agent-directory/DirectoryQuery';
import { BotRepository } from '../../domain/agent-directory/ports/BotRepository';
import { Tier } from '../../domain/agent-directory/value-objects/Tier';

export interface SearchAgentsResult {
  agents: PublicBotProfile[];
  total: number;
  query: string;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * SearchAgentsUseCase handles text-based agent searches
 */
export class SearchAgentsUseCase {
  constructor(private readonly botRepository: BotRepository) {}

  async execute(query: DirectoryQuery): Promise<SearchAgentsResult> {
    if (!query.search || query.search.trim() === '') {
      throw new Error('Search query is required');
    }

    const { bots, total } = await this.botRepository.searchPublic(query);

    // Transform to PublicBotProfile using domain logic
    const agents = bots.map(bot => {
      const tier = Tier.fromReputation(bot.reputationScore);
      
      return new PublicBotProfile({
        name: bot.displayName,
        description: bot.description || `Bot with reputation ${bot.reputationScore}`,
        reputation: bot.reputationScore,
        tier: tier.toString(),
        isActive: bot.emailVerified,
        isVerified: bot.verificationStatus === 'verified',
        createdAt: new Date(bot.createdAt).toISOString(),
        stats: {
          promisesListed: bot.promisesListed || 0,
          promisesCompleted: bot.promisesCompleted || 0,
          successRate: bot.successRate || 0,
          totalEarnings: bot.totalEarnings,
        },
      });
    });

    return {
      agents,
      total,
      query: query.search,
      page: Math.floor(query.offset / query.limit) + 1,
      pageSize: query.limit,
      hasMore: query.hasMore(total),
    };
  }
}
