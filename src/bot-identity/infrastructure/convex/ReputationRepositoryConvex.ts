import { ReputationRepository } from '../../ports/ReputationRepository';
import { ReputationHistory } from '../../domain/ReputationHistory';
import { PerformanceRecord } from '../../domain/PerformanceRecord';

/**
 * Convex adapter for ReputationRepository
 * 
 * This adapter implements the repository port using Convex.
 * It uses a generic DatabaseContext interface that can be provided
 * by Convex mutations, actions, or the Convex HTTP client.
 */

export interface DatabaseContext {
  query: (name: string, args: any) => Promise<any>;
  mutation: (name: string, args: any) => Promise<any>;
}

export class ReputationRepositoryConvex implements ReputationRepository {
  constructor(private ctx: DatabaseContext) {}

  async findByBotId(botId: string): Promise<ReputationHistory | null> {
    const record = await this.ctx.query("reputationHistory:getByBotId", { botId });
    
    if (!record) {
      return null;
    }

    return ReputationHistory.fromData({
      botId: record.botId,
      records: record.records.map((r: any) => 
        PerformanceRecord.create({
          promiseId: r.promiseId,
          outcome: r.outcome,
          executionTime: r.executionTime,
          reputationDelta: r.reputationDelta,
          reason: r.reason,
        })
      ),
    });
  }

  async save(reputationHistory: ReputationHistory): Promise<void> {
    const data = reputationHistory.toData();
    
    await this.ctx.mutation("reputationHistory:save", {
      botId: data.botId,
      records: data.records.map(r => ({
        promiseId: r.getPromiseId(),
        outcome: r.getOutcome(),
        executionTime: r.getExecutionTime(),
        reputationDelta: r.getReputationDelta(),
        reason: r.getReason(),
        recordedAt: r.getRecordedAt().getTime(),
      })),
    });
  }

  async addPerformanceRecord(botId: string, record: PerformanceRecord): Promise<void> {
    await this.ctx.mutation("reputationHistory:addRecord", {
      botId,
      record: {
        promiseId: record.getPromiseId(),
        outcome: record.getOutcome(),
        executionTime: record.getExecutionTime(),
        reputationDelta: record.getReputationDelta(),
        reason: record.getReason(),
        recordedAt: record.getRecordedAt().getTime(),
      },
    });
  }

  async getTopBotsByReputation(limit: number): Promise<Array<{
    botId: string;
    reputationScore: number;
    displayName: string;
  }>> {
    const results = await this.ctx.query("reputationHistory:getTopBots", { limit });
    return results.map((r: any) => ({
      botId: r.botId,
      reputationScore: r.reputationScore,
      displayName: r.displayName,
    }));
  }
}
