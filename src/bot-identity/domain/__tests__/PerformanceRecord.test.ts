import { describe, it, expect } from 'vitest';
import { PerformanceRecord, PerformanceOutcome } from '../PerformanceRecord';

describe('PerformanceRecord', () => {
  it('should create a performance record with all required fields', () => {
    const record = PerformanceRecord.create({
      promiseId: 'promise-123',
      outcome: 'fulfilled',
      executionTime: 10000, // 10 seconds
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    });

    expect(record.getPromiseId()).toBe('promise-123');
    expect(record.getOutcome()).toBe('fulfilled');
    expect(record.getExecutionTime()).toBe(10000);
    expect(record.getReputationDelta()).toBe(10);
    expect(record.getReason()).toBe('promise_fulfilled_on_time');
    expect(record.getRecordedAt()).toBeInstanceOf(Date);
  });

  it('should validate outcome is one of allowed values', () => {
    expect(() => {
      PerformanceRecord.create({
        promiseId: 'promise-123',
        outcome: 'invalid' as any,
        executionTime: 10000,
        reputationDelta: 10,
        reason: 'test',
      });
    }).toThrow('Invalid outcome');
  });

  it('should validate execution time is positive', () => {
    expect(() => {
      PerformanceRecord.create({
        promiseId: 'promise-123',
        outcome: 'fulfilled',
        executionTime: -1,
        reputationDelta: 10,
        reason: 'test',
      });
    }).toThrow('Execution time must be positive');
  });

  it('should support all valid outcomes', () => {
    const validOutcomes: PerformanceOutcome[] = [
      'fulfilled',
      'failed',
      'disputed_won',
      'disputed_lost',
      'fulfilled_late',
    ];

    validOutcomes.forEach((outcome) => {
      const record = PerformanceRecord.create({
        promiseId: `promise-${outcome}`,
        outcome,
        executionTime: 5000,
        reputationDelta: 10,
        reason: 'test',
      });

      expect(record.getOutcome()).toBe(outcome);
    });
  });

  it('should allow zero execution time', () => {
    const record = PerformanceRecord.create({
      promiseId: 'promise-123',
      outcome: 'fulfilled',
      executionTime: 0,
      reputationDelta: 10,
      reason: 'test',
    });

    expect(record.getExecutionTime()).toBe(0);
  });

  it('should expose toData method for serialization', () => {
    const record = PerformanceRecord.create({
      promiseId: 'promise-123',
      outcome: 'fulfilled',
      executionTime: 5000,
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    });

    const data = record.toData();

    expect(data.promiseId).toBe('promise-123');
    expect(data.outcome).toBe('fulfilled');
    expect(data.executionTime).toBe(5000);
    expect(data.reputationDelta).toBe(10);
    expect(data.reason).toBe('promise_fulfilled_on_time');
    expect(data.recordedAt).toBeInstanceOf(Date);
  });
});
