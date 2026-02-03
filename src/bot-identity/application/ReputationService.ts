import { ReputationRepository } from '../ports/ReputationRepository';
import { ReputationCalculator } from '../domain/ReputationCalculator';
import { PerformanceRecord } from '../domain/PerformanceRecord';
import { ReputationHistory } from '../domain/ReputationHistory';
import { ReputationScore } from '../../shared/domain/value-objects/ReputationScore';
import { 
  ReputationDto, 
  LeaderboardEntryDto, 
  UpdateReputationRequest,
  ReputationUpdateResult,
} from './dto/ReputationDto';

export class ReputationService {
  constructor(private readonly repository: ReputationRepository) {}

  async getReputation(botId: string, currentScore: number): Promise<ReputationDto> {
    // Get or create history
    let history = await this.repository.findByBotId(botId);
    if (!history) {
      history = ReputationHistory.create(botId);
    }

    // Get tier from score
    const score = new ReputationScore(currentScore);

    return {
      botId,
      score: currentScore,
      tier: score.getTier(),
      history: history.getRecords().map(r => ({
        promiseId: r.getPromiseId(),
        outcome: r.getOutcome(),
        executionTime: r.getExecutionTime(),
        reputationDelta: r.getReputationDelta(),
        reason: r.getReason(),
        recordedAt: r.getRecordedAt().toISOString(),
      })),
      stats: history.getStats(),
    };
  }

  async updateReputation(
    request: UpdateReputationRequest,
    currentScore: number
  ): Promise<ReputationUpdateResult> {
    // Calculate new reputation
    const calculation = ReputationCalculator.calculate({
      currentScore,
      outcome: request.outcome,
      isOnTime: request.isOnTime,
      isLateWithin2xSLA: request.isLateWithin2xSLA,
      isDispute: request.isDispute,
      disputeWon: request.disputeWon,
    });

    // Create performance record
    const record = PerformanceRecord.create({
      promiseId: request.promiseId,
      outcome: this.mapOutcome(request.outcome, request.isOnTime, request.isLateWithin2xSLA),
      executionTime: request.executionTime,
      reputationDelta: calculation.delta,
      reason: calculation.reason,
    });

    // Save to history
    await this.repository.addPerformanceRecord(request.botId, record);

    return {
      newScore: calculation.newScore,
      delta: calculation.delta,
      reason: calculation.reason,
    };
  }

  async getLeaderboard(limit: number): Promise<LeaderboardEntryDto[]> {
    const bots = await this.repository.getTopBotsByReputation(limit);
    
    return bots.map(bot => {
      const score = new ReputationScore(bot.reputationScore);
      return {
        botId: bot.botId,
        displayName: bot.displayName,
        reputationScore: bot.reputationScore,
        tier: score.getTier(),
      };
    });
  }

  private mapOutcome(
    outcome: 'fulfilled' | 'failed',
    isOnTime?: boolean,
    isLateWithin2xSLA?: boolean
  ): 'fulfilled' | 'failed' | 'fulfilled_late' {
    if (outcome === 'failed') {
      return 'failed';
    }
    if (isOnTime) {
      return 'fulfilled';
    }
    if (isLateWithin2xSLA) {
      return 'fulfilled_late';
    }
    return 'failed';
  }
}
