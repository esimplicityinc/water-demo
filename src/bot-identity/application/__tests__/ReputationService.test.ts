import { describe, it, expect, beforeEach } from 'vitest';
import { ReputationService } from '../ReputationService';
import { ReputationRepository } from '../../ports/ReputationRepository';
import { ReputationHistory } from '../../domain/ReputationHistory';

// Simple mock implementation
function createMockRepository(): ReputationRepository {
  return {
    findByBotId: async () => null,
    save: async () => {},
    addPerformanceRecord: async () => {},
    getTopBotsByReputation: async () => [],
  };
}

describe('ReputationService', () => {
  let service: ReputationService;
  let mockRepository: ReputationRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new ReputationService(mockRepository);
  });

  it('should get reputation for a bot', async () => {
    const history = ReputationHistory.create('bot-123');
    mockRepository.findByBotId = async () => history;

    const result = await service.getReputation('bot-123', 500);

    expect(result.botId).toBe('bot-123');
    expect(result.score).toBe(500);
    expect(result.tier).toBe('advanced'); // 500 is in advanced tier
    expect(result.history).toEqual([]);
  });

  it('should update reputation on successful promise', async () => {
    let recordAdded = false;
    mockRepository.addPerformanceRecord = async () => {
      recordAdded = true;
    };

    const result = await service.updateReputation({
      botId: 'bot-123',
      outcome: 'fulfilled',
      promiseId: 'promise-1',
      executionTime: 5000,
      isOnTime: true,
      isDispute: false,
    }, 500);

    expect(result.newScore).toBe(510);
    expect(result.delta).toBe(10);
    expect(recordAdded).toBe(true);
  });

  it('should get leaderboard', async () => {
    mockRepository.getTopBotsByReputation = async () => [
      { botId: 'bot-1', reputationScore: 900, displayName: 'Top Bot' },
      { botId: 'bot-2', reputationScore: 750, displayName: 'Good Bot' },
    ];

    const result = await service.getLeaderboard(10);

    expect(result).toHaveLength(2);
    expect(result[0].tier).toBe('expert');
    expect(result[1].tier).toBe('advanced');
  });
});
