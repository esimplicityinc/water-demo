export interface AvatarUpdatedData {
  botId: string;
  avatarUrl: string;
  updatedAt: string;
}

export class AvatarUpdated {
  readonly eventType = "AvatarUpdated";
  readonly occurredAt: Date;

  constructor(
    readonly aggregateId: string,
    readonly data: AvatarUpdatedData,
  ) {
    this.occurredAt = new Date();
  }
}
