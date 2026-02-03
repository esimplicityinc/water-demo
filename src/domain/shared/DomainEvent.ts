/**
 * Base Domain Event Interface
 * All domain events should implement this interface
 * Provides metadata for event sourcing and tracing
 */
export interface DomainEvent {
  /**
   * Unique identifier for this event instance
   */
  readonly eventId: string;

  /**
   * Type of the event (e.g., "EscrowCreated")
   */
  readonly eventType: string;

  /**
   * When the event occurred
   */
  readonly occurredAt: Date;

  /**
   * ID of the aggregate that produced this event
   */
  readonly aggregateId: string;

  /**
   * Type of the aggregate (e.g., "Escrow")
   */
  readonly aggregateType: string;

  /**
   * Version of the event schema (for evolution)
   */
  readonly version: number;

  /**
   * ID of the event that caused this event (for causation chains)
   */
  readonly causationId?: string;

  /**
   * ID for correlating related events across aggregates
   */
  readonly correlationId?: string;

  /**
   * Additional metadata
   */
  readonly metadata?: Record<string, unknown>;

  /**
   * Serialize event to JSON for persistence
   */
  toJSON(): Record<string, unknown>;
}
