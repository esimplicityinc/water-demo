/**
 * BotStatsCalculator Domain Service
 * 
 * Calculates statistics for agents based on promise data.
 * Pure business logic with no external dependencies.
 * 
 * @module domain/agent-directory/services
 */

/**
 * Promise data structure for stats calculation
 */
export interface PromiseData {
  state: string;
  pricingTerms?: {
    price: number;
  };
  consumerBotId?: string;
}

/**
 * Calculated bot statistics
 */
export interface BotStats {
  promisesListed: number;
  promisesCompleted: number;
  successRate: number;
  totalEarnings: number;
}

/**
 * BotStatsCalculator computes agent statistics from promise data.
 * This is a stateless domain service.
 */
export class BotStatsCalculator {
  /**
   * Calculate statistics from a list of promises
   */
  static calculate(promises: PromiseData[]): BotStats {
    const listed = promises.length;
    
    const completed = promises.filter(
      (p) => p.state === 'completed' || p.state === 'settled'
    ).length;
    
    const successRate = listed > 0 ? completed / listed : 0;
    
    const totalEarnings = promises
      .filter((p) => 
        (p.state === 'settled' || p.state === 'completed') && 
        p.consumerBotId &&
        p.pricingTerms?.price
      )
      .reduce((sum, p) => sum + (p.pricingTerms?.price || 0), 0);

    return {
      promisesListed: listed,
      promisesCompleted: completed,
      successRate: Math.round(successRate * 100) / 100,
      totalEarnings,
    };
  }

  /**
   * Calculate success rate percentage for display
   */
  static calculateSuccessRatePercentage(stats: BotStats): number {
    return Math.round(stats.successRate * 100);
  }

  /**
   * Determine if agent has meaningful activity
   */
  static hasActivity(stats: BotStats): boolean {
    return stats.promisesListed > 0 || stats.totalEarnings > 0;
  }
}
