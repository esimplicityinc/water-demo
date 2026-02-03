import { EscrowReleased } from "../../domain/escrow";
import {
  EscrowRepository,
  WalletService,
  StakeService,
  EventPublisher,
} from "./CreateEscrowUseCase";

/**
 * Input for ReleaseEscrowUseCase
 */
export interface ReleaseEscrowInput {
  escrowId: string;
}

/**
 * Output from ReleaseEscrowUseCase
 */
export interface ReleaseEscrowOutput {
  success: boolean;
  error?: string;
  events: EscrowReleased[];
}

/**
 * ReleaseEscrowUseCase
 * Releases escrow funds to provider on successful verification
 */
export class ReleaseEscrowUseCase {
  constructor(
    private readonly escrowRepository: EscrowRepository,
    private readonly walletService: WalletService,
    private readonly stakeService: StakeService,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: ReleaseEscrowInput): Promise<ReleaseEscrowOutput> {
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

      // Release escrow (will validate state)
      escrow.release();

      // Transfer funds to provider
      await this.walletService.releaseFunds(
        escrow.providerId,
        escrow.lockedFunds.amount
      );

      // Release provider's stake
      if (escrow.stakeLock.stakeLockId) {
        await this.stakeService.releaseStake(escrow.stakeLock.stakeLockId);
      }

      // Persist updated escrow
      await this.escrowRepository.save(escrow);

      // Publish events
      for (const event of escrow.domainEvents) {
        await this.eventPublisher.publish(event);
      }

      // Extract EscrowReleased events for response
      const releasedEvents = escrow.domainEvents.filter(
        (e): e is EscrowReleased => e.eventType === "EscrowReleased"
      );

      return {
        success: true,
        events: releasedEvents,
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
