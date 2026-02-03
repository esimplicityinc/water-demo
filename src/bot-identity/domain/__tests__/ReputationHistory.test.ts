import { describe, it, expect } from 'vitest';
import { ReputationHistory } from '../ReputationHistory';
import { PerformanceRecord } from '../PerformanceRecord';

describe('ReputationHistory', () => {
  it('should create empty history for a bot', () => {
    const history = ReputationHistory.create('bot-123');
    expect(history.getBotId()).toBe('bot-123');
    expect(history.getRecords()).toHaveLength(0);
  });

  it('should add performance record', () => {
    const history = ReputationHistory.create('bot-123');
    const record = PerformanceRecord.create({
      promiseId: 'promise-1',
      outcome: 'fulfilled',
      executionTime: 5000,
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    });

    history.addRecord(record);
    expect(history.getRecords()).toHaveLength(1);
    expect(history.getLatestRecord()?.getPromiseId()).toBe('promise-1');
  });

  it('should limit history to last 100 records (DDD guideline)', () => {
    const history = ReputationHistory.create('bot-123');
    
    // Add 105 records
    for (let i = 0; i < 105; i++) {
      history.addRecord(PerformanceRecord.create({
        promiseId: `promise-${i}`,
        outcome: 'fulfilled',
        executionTime: 1000,
        reputationDelta: 10,
        reason: 'promise_fulfilled_on_time',
      }));
    }

    expect(history.getRecords()).toHaveLength(100);
    // Should keep the most recent (last 5 added)
    const records = history.getRecords();
    expect(records[99].getPromiseId()).toBe('promise-104');
  });

  it('should calculate stats from records', () => {
    const history = ReputationHistory.create('bot-123');
    
    history.addRecord(PerformanceRecord.create({
      promiseId: 'promise-1',
      outcome: 'fulfilled',
      executionTime: 5000,
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    }));
    
    history.addRecord(PerformanceRecord.create({
      promiseId: 'promise-2',
      outcome: 'failed',
      executionTime: 10000,
      reputationDelta: -20,
      reason: 'promise_failed',
    }));

    const stats = history.getStats();
    expect(stats.totalPromises).toBe(2);
    expect(stats.successfulPromises).toBe(1);
    expect(stats.failedPromises).toBe(1);
    expect(stats.averageExecutionTime).toBe(7500);
  });
});
