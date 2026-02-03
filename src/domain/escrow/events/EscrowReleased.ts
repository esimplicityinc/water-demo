import { EscrowId } from "../value-objects/EscrowId";
import { DomainEvent } from "../../shared/DomainEvent";

/**
 * EscrowReleased Domain Event
 * Published when escrow funds are released to provider
 */
export class EscrowReleased implements DomainEvent {
  readonly eventId: string;
  readonly eventType = "EscrowReleased";
  readonly aggregateType = "Escrow";
  readonly version = 1;
  readonly occurredAt: Date;

  constructor(
    readonly escrowId: EscrowId,
    readonly promiseId: string,
    readonly providerId: string,
    readonly amount: number,
    readonly currency: string,
    readonly causationId?: string,
    readonly correlationId?: string,
    readonly metadata?: Record<string, unknown>,
    occurredAt?: Date
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = occurredAt ?? new Date();
  }

  get aggregateId(): string {
    return this.escrowId.value;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      aggregateType: this.aggregateType,
      version: this.version,
      escrowId: this.escrowId.value,
      promiseId: this.promiseId,
      providerId: this.providerId,
      amount: this.amount,
      currency: this.currency,
      occurredAt: this.occurredAt.toISOString(),
      causationId: this.causationId,
      correlationId: this.correlationId,
      metadata: this.metadata,
    };
  }
}
