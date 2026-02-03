export interface AvatarRemovedData {
  botId: string;
  removedAt: string;
}

export class AvatarRemoved {
  readonly eventType = "AvatarRemoved";
  readonly occurredAt: Date;

  constructor(
    readonly aggregateId: string,
    readonly data: AvatarRemovedData,
  ) {
    this.occurredAt = new Date();
  }
}
