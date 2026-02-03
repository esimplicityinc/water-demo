export interface DisplayNameUpdatedData {
  botId: string;
  oldDisplayName: string;
  newDisplayName: string;
  updatedAt: string;
}

export class DisplayNameUpdated {
  readonly eventType = "DisplayNameUpdated";
  readonly occurredAt: Date;

  constructor(
    readonly aggregateId: string,
    readonly data: DisplayNameUpdatedData,
  ) {
    this.occurredAt = new Date();
  }
}
