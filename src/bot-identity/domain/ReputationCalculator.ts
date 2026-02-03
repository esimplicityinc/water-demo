export interface ReputationCalculationResult {
  delta: number;
  newScore: number;
  reason: string;
}

export interface ReputationCalculationInput {
  currentScore: number;
  outcome: 'fulfilled' | 'failed';
  isOnTime?: boolean;
  isLateWithin2xSLA?: boolean;
  isDispute?: boolean;
  disputeWon?: boolean;
}

export class ReputationCalculator {
  private static readonly MAX_SCORE = 1000;
  private static readonly MIN_SCORE = 0;

  static calculate(input: ReputationCalculationInput): ReputationCalculationResult {
    let delta = 0;
    let reason = '';

    if (input.isDispute) {
      // Dispute outcomes
      if (input.disputeWon) {
        delta = 15;
        reason = 'dispute_won';
      } else {
        delta = -50;
        reason = 'dispute_lost';
      }
    } else if (input.outcome === 'fulfilled') {
      // Successful promise fulfillment
      if (input.isOnTime) {
        delta = 10;
        reason = 'promise_fulfilled_on_time';
      } else if (input.isLateWithin2xSLA) {
        delta = 5;
        reason = 'promise_fulfilled_late';
      } else {
        // Very late, treat as failed
        delta = -20;
        reason = 'promise_failed';
      }
    } else if (input.outcome === 'failed') {
      // Promise failure
      delta = -20;
      reason = 'promise_failed';
    }

    const newScore = Math.max(
      this.MIN_SCORE,
      Math.min(this.MAX_SCORE, input.currentScore + delta)
    );

    return {
      delta,
      newScore,
      reason,
    };
  }
}
