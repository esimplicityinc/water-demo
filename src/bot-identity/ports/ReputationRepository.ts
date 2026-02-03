import { ReputationHistory } from '../domain/ReputationHistory';
import { PerformanceRecord } from '../domain/PerformanceRecord';

export interface ReputationRepository {
  findByBotId(botId: string): Promise<ReputationHistory | null>;
  save(reputationHistory: ReputationHistory): Promise<void>;
  addPerformanceRecord(botId: string, record: PerformanceRecord): Promise<void>;
  getTopBotsByReputation(limit: number): Promise<Array<{
    botId: string;
    reputationScore: number;
    displayName: string;
  }>>;
}

export const REPUTATION_REPOSITORY_TOKEN = Symbol('ReputationRepository');
