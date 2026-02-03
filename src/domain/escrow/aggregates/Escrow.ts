import { EscrowId } from "../value-objects/EscrowId";
import { EscrowState } from "../value-objects/EscrowState";
import { LockedFunds } from "../value-objects/LockedFunds";
import { StakeLock } from "../value-objects/StakeLock";
import { EscrowCreated } from "../events/EscrowCreated";
import { TokensLocked } from "../events/TokensLocked";
import { ExecutionStarted } from "../events/ExecutionStarted";
import { ExecutionCompleted } from "../events/ExecutionCompleted";
import { ExecutionFailed } from "../events/ExecutionFailed";
import { EscrowReleased } from "../events/EscrowReleased";
import { EscrowReturned } from "../events/EscrowReturned";
import { EscrowDisputed } from "../events/EscrowDisputed";

/**
 * Escrow Aggregate Root
 * Manages the lifecycle of token escrow for promise execution
 * Enforces business rules and state transitions
 */
export class Escrow {
  private _id: EscrowId;
  private _promiseId: string;
  private _consumerId: string;
  private _providerId: string;
  private _state: EscrowState;
  private _lockedFunds: LockedFunds;
  private _stakeLock: StakeLock;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _completedAt: Date | null;
  private _closedAt: Date | null;
  private _executionProof: string | null;
  private _failureReason: string | null;
  private _disputeReason: string | null;

  // Domain events collected during operations
  private _domainEvents: Array<
    | EscrowCreated
    | TokensLocked
    | ExecutionStarted
    | ExecutionCompleted
    | ExecutionFailed
    | EscrowReleased
    | EscrowReturned
    | EscrowDisputed
  > = [];

  private constructor(
    id: EscrowId,
    promiseId: string,
    consumerId: string,
    providerId: string,
    state: EscrowState,
    lockedFunds: LockedFunds,
    stakeLock: StakeLock,
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date | null = null,
    closedAt: Date | null = null,
    executionProof: string | null = null,
    failureReason: string | null = null,
    disputeReason: string | null = null
  ) {
    this._id = id;
    this._promiseId = promiseId;
    this._consumerId = consumerId;
    this._providerId = providerId;
    this._state = state;
    this._lockedFunds = lockedFunds;
    this._stakeLock = stakeLock;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._completedAt = completedAt;
    this._closedAt = closedAt;
    this._executionProof = executionProof;
    this._failureReason = failureReason;
    this._disputeReason = disputeReason;
  }

  // ============== Factory Methods ==============

  /**
   * Create a new Escrow
   * @throws Error if parameters are invalid
   */
  static create(
    promiseId: string,
    consumerId: string,
    providerId: string,
    lockedAmount: number,
    lockedCurrency: string,
    stakeLockAmount: number,
    stakeLockId?: string
  ): Escrow {
    // Validate IDs
    if (!promiseId || promiseId.trim().length === 0) {
      throw new Error("Promise ID is required");
    }
    if (!consumerId || consumerId.trim().length === 0) {
      throw new Error("Consumer ID is required");
    }
    if (!providerId || providerId.trim().length === 0) {
      throw new Error("Provider ID is required");
    }

    // Consumer and provider must be different
    if (consumerId === providerId) {
      throw new Error("Consumer and provider cannot be the same bot");
    }

    const id = EscrowId.generate();
    const state = EscrowState.created();
    const lockedFunds = LockedFunds.create(lockedAmount, lockedCurrency);
    const stakeLock = StakeLock.create(stakeLockAmount, stakeLockId);
    const now = new Date();

    const escrow = new Escrow(
      id,
      promiseId,
      consumerId,
      providerId,
      state,
      lockedFunds,
      stakeLock,
      now,
      now
    );

    // Emit domain events
    escrow._domainEvents.push(
      new EscrowCreated(
        id,
        promiseId,
        consumerId,
        providerId,
        lockedFunds.amount,
        lockedFunds.currency
      )
    );

    escrow._domainEvents.push(
      new TokensLocked(
        id,
        consumerId,
        lockedFunds.amount,
        lockedFunds.currency
      )
    );

    return escrow;
  }

  /**
   * Reconstruct Escrow from persistence
   */
  static fromPersistence(data: {
    id: string;
    promiseId: string;
    consumerId: string;
    providerId: string;
    state: string;
    lockedAmount: number;
    lockedCurrency: string;
    stakeLockAmount: number;
    stakeLockId: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    completedAt?: string | Date | null;
    closedAt?: string | Date | null;
    executionProof?: string | null;
    failureReason?: string | null;
    disputeReason?: string | null;
  }): Escrow {
    return new Escrow(
      EscrowId.fromString(data.id),
      data.promiseId,
      data.consumerId,
      data.providerId,
      EscrowState.fromString(data.state),
      LockedFunds.fromStorage(data.lockedAmount, data.lockedCurrency),
      StakeLock.fromStorage(data.stakeLockAmount, data.stakeLockId),
      data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt),
      data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt),
      data.completedAt
        ? data.completedAt instanceof Date
          ? data.completedAt
          : new Date(data.completedAt)
        : null,
      data.closedAt
        ? data.closedAt instanceof Date
          ? data.closedAt
          : new Date(data.closedAt)
        : null,
      data.executionProof ?? null,
      data.failureReason ?? null,
      data.disputeReason ?? null
    );
  }

  // ============== State Transition Methods ==============

  /**
   * Start execution (provider begins work)
   * @throws Error if state transition is invalid or caller is not provider
   */
  startExecution(callerId: string): void {
    this._ensureIsProvider(callerId);
    this._ensureActive();

    this._state = this._state.transitionTo("EXECUTING");
    this._updatedAt = new Date();

    this._domainEvents.push(
      new ExecutionStarted(this._id, this._promiseId, this._providerId)
    );
  }

  /**
   * Complete execution with proof
   * @throws Error if state transition is invalid or caller is not provider
   */
  completeExecution(callerId: string, executionProof: string): void {
    this._ensureIsProvider(callerId);
    this._ensureActive();

    if (!executionProof || executionProof.trim().length === 0) {
      throw new Error("Execution proof is required");
    }

    this._state = this._state.transitionTo("COMPLETED");
    this._executionProof = executionProof;
    this._completedAt = new Date();
    this._updatedAt = new Date();

    this._domainEvents.push(
      new ExecutionCompleted(
        this._id,
        this._promiseId,
        this._providerId,
        executionProof
      )
    );
  }

  /**
   * Mark execution as failed
   * @throws Error if state transition is invalid
   */
  markFailed(reason: string): void {
    this._ensureActive();

    if (!reason || reason.trim().length === 0) {
      throw new Error("Failure reason is required");
    }

    this._state = this._state.transitionTo("FAILED");
    this._failureReason = reason;
    this._updatedAt = new Date();

    this._domainEvents.push(
      new ExecutionFailed(this._id, this._promiseId, this._providerId, reason)
    );
  }

  /**
   * Release escrow to provider (successful completion)
   * @throws Error if state transition is invalid
   */
  release(): void {
    this._ensureActive();

    // Can only release from COMPLETED or DISPUTED (if resolved in provider's favor)
    if (!["COMPLETED", "DISPUTED"].includes(this._state.value)) {
      throw new Error(
        `Cannot release escrow from state ${this._state.value}`
      );
    }

    this._state = this._state.transitionTo("RELEASING");
    this._updatedAt = new Date();

    this._domainEvents.push(
      new EscrowReleased(
        this._id,
        this._promiseId,
        this._providerId,
        this._lockedFunds.amount,
        this._lockedFunds.currency
      )
    );
  }

  /**
   * Close escrow after release or return
   * @throws Error if state transition is invalid
   */
  close(): void {
    // Can only close from RELEASING or RETURNING
    if (!["RELEASING", "RETURNING"].includes(this._state.value)) {
      throw new Error(
        `Cannot close escrow from state ${this._state.value}`
      );
    }

    this._state = this._state.transitionTo("CLOSED");
    this._closedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Return escrow to consumer (failed completion)
   * @throws Error if state transition is invalid
   */
  returnToConsumer(reason: string): void {
    this._ensureActive();

    // Can return from COMPLETED, FAILED, or DISPUTED
    if (!["COMPLETED", "FAILED", "DISPUTED"].includes(this._state.value)) {
      throw new Error(
        `Cannot return escrow from state ${this._state.value}`
      );
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error("Return reason is required");
    }

    this._state = this._state.transitionTo("RETURNING");
    this._updatedAt = new Date();

    this._domainEvents.push(
      new EscrowReturned(
        this._id,
        this._promiseId,
        this._consumerId,
        this._lockedFunds.amount,
        this._lockedFunds.currency,
        reason
      )
    );
  }

  /**
   * Raise a dispute
   * @throws Error if state transition is invalid or caller is not consumer
   */
  raiseDispute(callerId: string, reason: string): void {
    this._ensureIsConsumer(callerId);
    this._ensureActive();

    if (!reason || reason.trim().length === 0) {
      throw new Error("Dispute reason is required");
    }

    // Can only dispute from EXECUTING or COMPLETED
    if (!["EXECUTING", "COMPLETED"].includes(this._state.value)) {
      throw new Error(
        `Cannot raise dispute from state ${this._state.value}`
      );
    }

    this._state = this._state.transitionTo("DISPUTED");
    this._disputeReason = reason;
    this._updatedAt = new Date();

    this._domainEvents.push(
      new EscrowDisputed(
        this._id,
        this._promiseId,
        this._consumerId,
        this._providerId,
        reason
      )
    );
  }

  // ============== Private Helpers ==============

  private _ensureIsProvider(callerId: string): void {
    if (callerId !== this._providerId) {
      throw new Error("Only the provider can perform this action");
    }
  }

  private _ensureIsConsumer(callerId: string): void {
    if (callerId !== this._consumerId) {
      throw new Error("Only the consumer can perform this action");
    }
  }

  private _ensureActive(): void {
    if (!this._state.isActive()) {
      throw new Error(`Escrow is already closed`);
    }
  }

  // ============== Getters ==============

  get id(): EscrowId {
    return this._id;
  }

  get promiseId(): string {
    return this._promiseId;
  }

  get consumerId(): string {
    return this._consumerId;
  }

  get providerId(): string {
    return this._providerId;
  }

  get state(): EscrowState {
    return this._state;
  }

  get lockedFunds(): LockedFunds {
    return this._lockedFunds;
  }

  get stakeLock(): StakeLock {
    return this._stakeLock;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get closedAt(): Date | null {
    return this._closedAt;
  }

  get executionProof(): string | null {
    return this._executionProof;
  }

  get failureReason(): string | null {
    return this._failureReason;
  }

  get disputeReason(): string | null {
    return this._disputeReason;
  }

  get domainEvents(): ReadonlyArray<
    | EscrowCreated
    | TokensLocked
    | ExecutionStarted
    | ExecutionCompleted
    | ExecutionFailed
    | EscrowReleased
    | EscrowReturned
    | EscrowDisputed
  > {
    return this._domainEvents;
  }

  // ============== Serialization ==============

  toJSON() {
    return {
      id: this._id.value,
      promiseId: this._promiseId,
      consumerId: this._consumerId,
      providerId: this._providerId,
      state: this._state.value,
      lockedFunds: this._lockedFunds.toJSON(),
      stakeLock: this._stakeLock.toJSON(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      completedAt: this._completedAt?.toISOString() ?? null,
      closedAt: this._closedAt?.toISOString() ?? null,
      executionProof: this._executionProof,
      failureReason: this._failureReason,
      disputeReason: this._disputeReason,
    };
  }
}
