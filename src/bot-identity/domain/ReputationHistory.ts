import { PerformanceRecord } from './PerformanceRecord';

export interface ReputationStats {
  totalPromises: number;
  successfulPromises: number;
  failedPromises: number;
  disputedWon: number;
  disputedLost: number;
  averageExecutionTime: number;
}

export interface ReputationHistoryData {
  botId: string;
  records: PerformanceRecord[];
}

export class ReputationHistory {
  private static readonly MAX_RECORDS = 100;
  
  private readonly botId: string;
  private records: PerformanceRecord[];

  private constructor(data: ReputationHistoryData) {
    this.botId = data.botId;
    this.records = data.records;
  }

  static create(botId: string): ReputationHistory {
    return new ReputationHistory({
      botId,
      records: [],
    });
  }

  static fromData(data: ReputationHistoryData): ReputationHistory {
    return new ReputationHistory(data);
  }

  // Getters
  getBotId(): string {
    return this.botId;
  }

  getRecords(): PerformanceRecord[] {
    return [...this.records]; // Return copy
  }

  getLatestRecord(): PerformanceRecord | undefined {
    return this.records[this.records.length - 1];
  }

  // Business logic
  addRecord(record: PerformanceRecord): void {
    this.records.push(record);
    
    // Maintain max size (keep most recent)
    if (this.records.length > ReputationHistory.MAX_RECORDS) {
      this.records = this.records.slice(-ReputationHistory.MAX_RECORDS);
    }
  }

  getStats(): ReputationStats {
    let totalPromises = 0;
    let successfulPromises = 0;
    let failedPromises = 0;
    let disputedWon = 0;
    let disputedLost = 0;
    let totalExecutionTime = 0;

    for (const record of this.records) {
      totalPromises++;
      totalExecutionTime += record.getExecutionTime();

      switch (record.getOutcome()) {
        case 'fulfilled':
        case 'fulfilled_late':
          successfulPromises++;
          break;
        case 'failed':
          failedPromises++;
          break;
        case 'disputed_won':
          disputedWon++;
          successfulPromises++;
          break;
        case 'disputed_lost':
          disputedLost++;
          failedPromises++;
          break;
      }
    }

    return {
      totalPromises,
      successfulPromises,
      failedPromises,
      disputedWon,
      disputedLost,
      averageExecutionTime: totalPromises > 0 ? totalExecutionTime / totalPromises : 0,
    };
  }

  toData(): ReputationHistoryData {
    return {
      botId: this.botId,
      records: this.records,
    };
  }
}
