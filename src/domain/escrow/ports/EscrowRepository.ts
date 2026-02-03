import { Escrow } from "../aggregates/Escrow";
import { EscrowId } from "../value-objects/EscrowId";
import { EscrowStateType } from "../value-objects/EscrowState";

/**
 * EscrowRepository Port
 * Defines the contract for escrow persistence
 * Infrastructure layer must implement this interface
 */
export interface EscrowRepository {
  /**
   * Save an escrow (create or update)
   */
  save(escrow: Escrow): Promise<void>;

  /**
   * Find escrow by ID
   */
  findById(id: EscrowId | string): Promise<Escrow | null>;

  /**
   * Find escrow by promise ID
   */
  findByPromiseId(promiseId: string): Promise<Escrow | null>;

  /**
   * Find escrows by consumer
   */
  findByConsumer(consumerId: string, state?: EscrowStateType): Promise<Escrow[]>;

  /**
   * Find escrows by provider
   */
  findByProvider(providerId: string, state?: EscrowStateType): Promise<Escrow[]>;

  /**
   * Find escrows by state
   */
  findByState(state: EscrowStateType): Promise<Escrow[]>;
}
