import { EscrowRepository, EventPublisher } from "./CreateEscrowUseCase";

/**
 * Input for CompleteExecutionUseCase
 */
export interface CompleteExecutionInput {
  escrowId: string;
  providerId: string;
  executionProof: string;
}

/**
 * Output from CompleteExecutionUseCase
 */
export interface CompleteExecutionOutput {
  success: boolean;
  error?: string;
}

/**
 * CompleteExecutionUseCase
 * Allows provider to submit execution proof
 */
export class CompleteExecutionUseCase {
  constructor(
    private readonly escrowRepository: EscrowRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: CompleteExecutionInput): Promise<CompleteExecutionOutput> {
    try {
      // Find escrow
      const escrow = await this.escrowRepository.findById(input.escrowId);

      if (!escrow) {
        return {
          success: false,
          error: "Escrow not found",
        };
      }

      // Complete execution (will validate provider and state)
      escrow.completeExecution(input.providerId, input.executionProof);

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
