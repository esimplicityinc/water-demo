import { EscrowId } from "../value-objects/EscrowId";
import { DomainEvent } from "../../shared/DomainEvent";

/**
 * EscrowCreated Domain Event
 * Published when a new escrow is created
 */
export class EscrowCreated implements DomainEvent {
  readonly eventId: string;
  readonly eventType = "EscrowCreated";
  readonly aggregateType = "Escrow";
  readonly version = 1;
  readonly occurredAt: Date;

  constructor(
    readonly escrowId: EscrowId,
    readonly promiseId: string,
    readonly consumerId: string,
    readonly providerId: string,
    readonly lockedAmount: number,
    readonly lockedCurrency: string,
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
      consumerId: this.consumerId,
      providerId: this.providerId,
      lockedAmount: this.lockedAmount,
      lockedCurrency: this.lockedCurrency,
      occurredAt: this.occurredAt.toISOString(),
      causationId: this.causationId,
      correlationId: this.correlationId,
      metadata: this.metadata,
    };
  }
}
