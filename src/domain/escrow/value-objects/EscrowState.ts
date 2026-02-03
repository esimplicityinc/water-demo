/**
 * Escrow State Enumeration
 * Represents all possible states in the escrow lifecycle
 */
export type EscrowStateType =
  | "CREATED"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED"
  | "DISPUTED"
  | "RELEASING"
  | "RETURNING"
  | "CLOSED";

/**
 * EscrowState Value Object
 * Encapsulates state machine logic for escrow lifecycle
 * Ensures valid state transitions
 */
export class EscrowState {
  private readonly _value: EscrowStateType;

  private constructor(value: EscrowStateType) {
    this._value = value;
  }

  /**
   * Create initial state
   */
  static created(): EscrowState {
    return new EscrowState("CREATED");
  }

  /**
   * Create from string value
   */
  static fromString(value: string): EscrowState {
    const validStates: EscrowStateType[] = [
      "CREATED",
      "EXECUTING",
      "COMPLETED",
      "FAILED",
      "DISPUTED",
      "RELEASING",
      "RETURNING",
      "CLOSED",
    ];

    if (!validStates.includes(value as EscrowStateType)) {
      throw new Error(`Invalid escrow state: ${value}`);
    }

    return new EscrowState(value as EscrowStateType);
  }

  /**
   * Get current state value
   */
  get value(): EscrowStateType {
    return this._value;
  }

  /**
   * Check if transition to target state is valid
   */
  canTransitionTo(targetState: EscrowStateType): boolean {
    const validTransitions: Record<EscrowStateType, EscrowStateType[]> = {
      CREATED: ["EXECUTING"],
      EXECUTING: ["COMPLETED", "FAILED", "DISPUTED"],
      COMPLETED: ["RELEASING", "RETURNING"],
      FAILED: ["RETURNING"],
      DISPUTED: ["RELEASING", "RETURNING"],
      RELEASING: ["CLOSED"],
      RETURNING: ["CLOSED"],
      CLOSED: [], // Terminal state
    };

    return validTransitions[this._value]?.includes(targetState) ?? false;
  }

  /**
   * Transition to new state
   * @throws Error if transition is invalid
   */
  transitionTo(targetState: EscrowStateType): EscrowState {
    if (!this.canTransitionTo(targetState)) {
      throw new Error(
        `Invalid state transition from ${this._value} to ${targetState}`
      );
    }
    return new EscrowState(targetState);
  }

  /**
   * Check if escrow is in a terminal state
   */
  isTerminal(): boolean {
    return this._value === "CLOSED";
  }

  /**
   * Check if escrow is active (not closed)
   */
  isActive(): boolean {
    return !this.isTerminal();
  }

  /**
   * Check if tokens are locked
   */
  hasLockedTokens(): boolean {
    return ["CREATED", "EXECUTING", "COMPLETED", "DISPUTED"].includes(
      this._value
    );
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }

  /**
   * Check equality
   */
  equals(other: EscrowState): boolean {
    return this._value === other._value;
  }
}
