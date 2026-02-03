export interface ReputationChangedEvent {
  type: 'ReputationChanged';
  botId: string;
  oldScore: number;
  newScore: number;
  delta: number;
  reason: string;
  promiseId?: string;
  occurredAt: Date;
}

export function createReputationChangedEvent(
  botId: string,
  oldScore: number,
  newScore: number,
  delta: number,
  reason: string,
  promiseId?: string
): ReputationChangedEvent {
  return {
    type: 'ReputationChanged',
    botId,
    oldScore,
    newScore,
    delta,
    reason,
    promiseId,
    occurredAt: new Date(),
  };
}
