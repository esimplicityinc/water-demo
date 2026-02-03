/**
 * GetAgentProfileUseCase - Application Service
 * 
 * Retrieves detailed public profile for a specific agent.
 * 
 * @module application/agent-directory
 */

import { PublicBotProfile } from '../../domain/agent-directory/PublicBotProfile';
import { BotRepository } from '../../domain/agent-directory/ports/BotRepository';
import { Tier } from '../../domain/agent-directory/value-objects/Tier';

export interface GetAgentProfileResult {
  agent: PublicBotProfile | null;
  found: boolean;
}

/**
 * GetAgentProfileUseCase handles single agent profile retrieval
 */
export class GetAgentProfileUseCase {
  constructor(private readonly botRepository: BotRepository) {}

  async execute(name: string): Promise<GetAgentProfileResult> {
    const bot = await this.botRepository.getByName(name);

    if (!bot) {
      return {
        agent: null,
        found: false,
      };
    }

    // Use domain logic to determine tier
    const tier = Tier.fromReputation(bot.reputationScore);

    const agent = new PublicBotProfile({
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

    return {
      agent,
      found: true,
    };
  }
}
