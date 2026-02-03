import { EscrowRepository, EventPublisher } from "./CreateEscrowUseCase";

/**
 * Input for StartExecutionUseCase
 */
export interface StartExecutionInput {
  escrowId: string;
  providerId: string;
}

/**
 * Output from StartExecutionUseCase
 */
export interface StartExecutionOutput {
  success: boolean;
  error?: string;
}

/**
 * StartExecutionUseCase
 * Allows provider to start working on a promise
 */
export class StartExecutionUseCase {
  constructor(
    private readonly escrowRepository: EscrowRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: StartExecutionInput): Promise<StartExecutionOutput> {
    try {
      // Find escrow
      const escrow = await this.escrowRepository.findById(input.escrowId);

      if (!escrow) {
        return {
          success: false,
          error: "Escrow not found",
        };
      }

      // Start execution (will validate provider and state)
      escrow.startExecution(input.providerId);

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
