import { EscrowId } from "../value-objects/EscrowId";
import { DomainEvent } from "../../shared/DomainEvent";

/**
 * ExecutionFailed Domain Event
 * Published when execution fails verification
 */
export class ExecutionFailed implements DomainEvent {
  readonly eventId: string;
  readonly eventType = "ExecutionFailed";
  readonly aggregateType = "Escrow";
  readonly version = 1;
  readonly occurredAt: Date;

  constructor(
    readonly escrowId: EscrowId,
    readonly promiseId: string,
    readonly providerId: string,
    readonly reason: string,
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
      reason: this.reason,
      occurredAt: this.occurredAt.toISOString(),
      causationId: this.causationId,
      correlationId: this.correlationId,
      metadata: this.metadata,
    };
  }
}
