import { EscrowRepository, EventPublisher } from "./CreateEscrowUseCase";

/**
 * Input for RaiseDisputeUseCase
 */
export interface RaiseDisputeInput {
  escrowId: string;
  consumerId: string;
  reason: string;
}

/**
 * Output from RaiseDisputeUseCase
 */
export interface RaiseDisputeOutput {
  success: boolean;
  error?: string;
}

/**
 * RaiseDisputeUseCase
 * Allows consumer to raise a dispute on an escrow
 */
export class RaiseDisputeUseCase {
  constructor(
    private readonly escrowRepository: EscrowRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: RaiseDisputeInput): Promise<RaiseDisputeOutput> {
    try {
      // Find escrow
      const escrow = await this.escrowRepository.findById(input.escrowId);

      if (!escrow) {
        return {
          success: false,
          error: "Escrow not found",
        };
      }

      // Raise dispute (will validate consumer and state)
      escrow.raiseDispute(input.consumerId, input.reason);

      // Persist updated escrow
      await this.escrowRepository.save(escrow);

      // Publish events
      for (const event of escrow.domainEvents) {
        await this.eventPublisher.publish(event);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
