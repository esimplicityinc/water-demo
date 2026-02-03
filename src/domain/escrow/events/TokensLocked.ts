import { EscrowId } from "../value-objects/EscrowId";
import { DomainEvent } from "../../shared/DomainEvent";

/**
 * TokensLocked Domain Event
 * Published when tokens are locked in escrow
 */
export class TokensLocked implements DomainEvent {
  readonly eventId: string;
  readonly eventType = "TokensLocked";
  readonly aggregateType = "Escrow";
  readonly version = 1;
  readonly occurredAt: Date;

  constructor(
    readonly escrowId: EscrowId,
    readonly consumerId: string,
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
      consumerId: this.consumerId,
      amount: this.amount,
      currency: this.currency,
      occurredAt: this.occurredAt.toISOString(),
      causationId: this.causationId,
      correlationId: this.correlationId,
      metadata: this.metadata,
    };
  }
}
