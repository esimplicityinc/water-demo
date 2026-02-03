import { describe, it, expect } from 'vitest';
import { ReputationCalculator } from '../ReputationCalculator';

describe('ReputationCalculator', () => {
  it('should calculate +10 for promise fulfilled on time', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'fulfilled',
      isOnTime: true,
      isDispute: false,
    });
    expect(result.delta).toBe(10);
    expect(result.reason).toBe('promise_fulfilled_on_time');
    expect(result.newScore).toBe(510);
  });

  it('should calculate +5 for promise fulfilled late', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'fulfilled',
      isOnTime: false,
      isLateWithin2xSLA: true,
      isDispute: false,
    });
    expect(result.delta).toBe(5);
    expect(result.reason).toBe('promise_fulfilled_late');
    expect(result.newScore).toBe(505);
  });

  it('should calculate -20 for promise failure', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'failed',
      isDispute: false,
    });
    expect(result.delta).toBe(-20);
    expect(result.reason).toBe('promise_failed');
    expect(result.newScore).toBe(480);
  });

  it('should calculate +15 for winning dispute', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'fulfilled',
      isDispute: true,
      disputeWon: true,
    });
    expect(result.delta).toBe(15);
    expect(result.reason).toBe('dispute_won');
    expect(result.newScore).toBe(515);
  });

  it('should calculate -50 for losing dispute', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'failed',
      isDispute: true,
      disputeWon: false,
    });
    expect(result.delta).toBe(-50);
    expect(result.reason).toBe('dispute_lost');
    expect(result.newScore).toBe(450);
  });

  it('should cap at maximum score of 1000', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 995,
      outcome: 'fulfilled',
      isOnTime: true,
      isDispute: false,
    });
    expect(result.delta).toBe(10);
    expect(result.newScore).toBe(1000);
  });

  it('should floor at minimum score of 0', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 15,
      outcome: 'failed',
      isDispute: false,
    });
    expect(result.delta).toBe(-20);
    expect(result.newScore).toBe(0);
  });
});
