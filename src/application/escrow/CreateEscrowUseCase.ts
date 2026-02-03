import { Escrow, EscrowCreated } from "../../domain/escrow";

/**
 * Input for CreateEscrowUseCase
 */
export interface CreateEscrowInput {
  promiseId: string;
  consumerId: string;
  providerId: string;
  amount: number;
  currency: string;
  stakeLockAmount: number;
  stakeLockId?: string;
}

/**
 * Output from CreateEscrowUseCase
 */
export interface CreateEscrowOutput {
  success: boolean;
  escrowId?: string;
  error?: string;
  events: EscrowCreated[];
}

/**
 * Repository interface for escrow persistence
 * Infrastructure layer will implement this
 */
export interface EscrowRepository {
  save(escrow: Escrow): Promise<void>;
  findById(id: string): Promise<Escrow | null>;
  findByPromiseId(promiseId: string): Promise<Escrow | null>;
}

/**
 * Wallet service interface
 * Infrastructure layer will implement this
 */
export interface WalletService {
  hasSufficientBalance(botId: string, amount: number): Promise<boolean>;
  lockFunds(botId: string, amount: number): Promise<void>;
  releaseFunds(botId: string, amount: number): Promise<void>;
}

/**
 * Stake service interface
 * Infrastructure layer will implement this
 */
export interface StakeService {
  hasSufficientAvailableStake(botId: string, amount: number): Promise<boolean>;
  lockStake(botId: string, amount: number): Promise<string>; // returns stakeLockId
  releaseStake(stakeLockId: string): Promise<void>;
  slashStake(stakeLockId: string): Promise<void>;
}

/**
 * Event publisher interface
 * Infrastructure layer will implement this
 */
export interface EventPublisher {
  publish(event: unknown): Promise<void>;
}

/**
 * CreateEscrowUseCase
 * Coordinates escrow creation with wallet and stake locking
 */
export class CreateEscrowUseCase {
  constructor(
    private readonly escrowRepository: EscrowRepository,
    private readonly walletService: WalletService,
    private readonly stakeService: StakeService,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: CreateEscrowInput): Promise<CreateEscrowOutput> {
    try {
      // Validate input
      if (input.amount <= 0) {
        return {
          success: false,
          error: "Amount must be positive",
          events: [],
        };
      }

      // Check consumer has sufficient funds
      const hasBalance = await this.walletService.hasSufficientBalance(
        input.consumerId,
        input.amount
      );

      if (!hasBalance) {
        return {
          success: false,
          error: "Insufficient wallet balance",
          events: [],
        };
      }

      // Check provider has sufficient stake
      const hasStake = await this.stakeService.hasSufficientAvailableStake(
        input.providerId,
        input.stakeLockAmount
      );

      if (!hasStake) {
        return {
          success: false,
          error: "Insufficient provider stake",
          events: [],
        };
      }

      // Lock consumer funds
      await this.walletService.lockFunds(input.consumerId, input.amount);

      // Lock provider stake
      const stakeLockId = await this.stakeService.lockStake(
        input.providerId,
        input.stakeLockAmount
      );

      // Create escrow aggregate
      const escrow = Escrow.create(
        input.promiseId,
        input.consumerId,
        input.providerId,
        input.amount,
        input.currency,
        input.stakeLockAmount,
        stakeLockId
      );

      // Persist escrow
      await this.escrowRepository.save(escrow);

      // Publish domain events
      for (const event of escrow.domainEvents) {
        await this.eventPublisher.publish(event);
      }

      // Extract EscrowCreated events for response
      const createdEvents = escrow.domainEvents.filter(
        (e): e is EscrowCreated => e.eventType === "EscrowCreated"
      );

      return {
        success: true,
        escrowId: escrow.id.value,
        events: createdEvents,
      };
    } catch (error) {
      // In a real system, we might need to rollback the locks here
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        events: [],
      };
    }
  }
}
