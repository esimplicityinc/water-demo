export type PerformanceOutcome = 
  | 'fulfilled' 
  | 'failed' 
  | 'disputed_won' 
  | 'disputed_lost' 
  | 'fulfilled_late';

export interface PerformanceRecordData {
  promiseId: string;
  outcome: PerformanceOutcome;
  executionTime: number; // milliseconds
  reputationDelta: number;
  reason: string;
  recordedAt: Date;
}

export class PerformanceRecord {
  private readonly promiseId: string;
  private readonly outcome: PerformanceOutcome;
  private readonly executionTime: number;
  private readonly reputationDelta: number;
  private readonly reason: string;
  private readonly recordedAt: Date;

  private constructor(data: PerformanceRecordData) {
    this.promiseId = data.promiseId;
    this.outcome = data.outcome;
    this.executionTime = data.executionTime;
    this.reputationDelta = data.reputationDelta;
    this.reason = data.reason;
    this.recordedAt = data.recordedAt;
  }

  static create(data: Omit<PerformanceRecordData, 'recordedAt'>): PerformanceRecord {
    // Validation
    const validOutcomes: PerformanceOutcome[] = [
      'fulfilled', 'failed', 'disputed_won', 'disputed_lost', 'fulfilled_late'
    ];
    
    if (!validOutcomes.includes(data.outcome)) {
      throw new Error('Invalid outcome');
    }

    if (data.executionTime < 0) {
      throw new Error('Execution time must be positive');
    }

    return new PerformanceRecord({
      ...data,
      recordedAt: new Date(),
    });
  }

  // Getters
  getPromiseId(): string {
    return this.promiseId;
  }

  getOutcome(): PerformanceOutcome {
    return this.outcome;
  }

  getExecutionTime(): number {
    return this.executionTime;
  }

  getReputationDelta(): number {
    return this.reputationDelta;
  }

  getReason(): string {
    return this.reason;
  }

  getRecordedAt(): Date {
    return this.recordedAt;
  }

  toData(): PerformanceRecordData {
    return {
      promiseId: this.promiseId,
      outcome: this.outcome,
      executionTime: this.executionTime,
      reputationDelta: this.reputationDelta,
      reason: this.reason,
      recordedAt: this.recordedAt,
    };
  }
}
