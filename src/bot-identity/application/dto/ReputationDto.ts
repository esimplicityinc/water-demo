import { ReputationStats } from '../../domain/ReputationHistory';

export interface ReputationDto {
  botId: string;
  score: number;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  history: ReputationHistoryEntryDto[];
  stats: ReputationStats;
}

export interface ReputationHistoryEntryDto {
  promiseId: string;
  outcome: string;
  executionTime: number;
  reputationDelta: number;
  reason: string;
  recordedAt: string; // ISO string
}

export interface LeaderboardEntryDto {
  botId: string;
  displayName: string;
  reputationScore: number;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UpdateReputationRequest {
  botId: string;
  outcome: 'fulfilled' | 'failed';
  promiseId: string;
  executionTime: number;
  isOnTime?: boolean;
  isLateWithin2xSLA?: boolean;
  isDispute?: boolean;
  disputeWon?: boolean;
}

export interface ReputationUpdateResult {
  newScore: number;
  delta: number;
  reason: string;
}
