import { EscrowReturned } from "../../domain/escrow";
import {
  EscrowRepository,
  WalletService,
  StakeService,
  EventPublisher,
} from "./CreateEscrowUseCase";

/**
 * Input for ReturnEscrowUseCase
 */
export interface ReturnEscrowInput {
  escrowId: string;
  reason: string;
}

/**
 * Output from ReturnEscrowUseCase
 */
export interface ReturnEscrowOutput {
  success: boolean;
  error?: string;
  events: EscrowReturned[];
}

/**
 * ReturnEscrowUseCase
 * Returns escrow funds to consumer on failure or dispute
 */
export class ReturnEscrowUseCase {
  constructor(
    private readonly escrowRepository: EscrowRepository,
    private readonly walletService: WalletService,
    private readonly stakeService: StakeService,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: ReturnEscrowInput): Promise<ReturnEscrowOutput> {
    try {
      // Find escrow
      const escrow = await this.escrowRepository.findById(input.escrowId);

      if (!escrow) {
        return {
          success: false,
          error: "Escrow not found",
          events: [],
        };
      }

      // Return escrow (will validate state)
      escrow.returnToConsumer(input.reason);

      // Return funds to consumer
      await this.walletService.releaseFunds(
        escrow.consumerId,
        escrow.lockedFunds.amount
      );

      // Slash provider's stake
      if (escrow.stakeLock.stakeLockId) {
        await this.stakeService.slashStake(escrow.stakeLock.stakeLockId);
      }

      // Persist updated escrow
      await this.escrowRepository.save(escrow);

      // Publish events
      for (const event of escrow.domainEvents) {
        await this.eventPublisher.publish(event);
      }

      // Extract EscrowReturned events for response
      const returnedEvents = escrow.domainEvents.filter(
        (e): e is EscrowReturned => e.eventType === "EscrowReturned"
      );

      return {
        success: true,
        events: returnedEvents,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        events: [],
      };
    }
  }
}
