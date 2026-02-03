export interface EmailVerifiedData {
  botId: string;
  email: string;
  verifiedAt: string;
}

export class EmailVerified {
  readonly eventType = "EmailVerified";
  readonly occurredAt: Date;

  constructor(
    readonly aggregateId: string,
    readonly data: EmailVerifiedData,
  ) {
    this.occurredAt = new Date();
  }
}
