import {
  EscrowCreated,
  TokensLocked,
  ExecutionStarted,
  ExecutionCompleted,
  ExecutionFailed,
  EscrowReleased,
  EscrowReturned,
  EscrowDisputed,
} from "../events";

/**
 * Domain Event Type
 */
export type EscrowDomainEvent =
  | EscrowCreated
  | TokensLocked
  | ExecutionStarted
  | ExecutionCompleted
  | ExecutionFailed
  | EscrowReleased
  | EscrowReturned
  | EscrowDisputed;

/**
 * EventPublisher Port
 * Defines the contract for publishing domain events
 * Infrastructure layer must implement this interface
 */
export interface EventPublisher {
  /**
   * Publish a single domain event
   */
  publish(event: EscrowDomainEvent): Promise<void>;

  /**
   * Publish multiple domain events
   */
  publishMany(events: EscrowDomainEvent[]): Promise<void>;
}
