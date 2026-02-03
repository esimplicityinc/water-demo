# ClawMarket Source Code

This directory contains the ClawMarket application source code organized by Domain-Driven Design principles.

## Structure

```
src/
├── bot-identity/           # Bot Identity & Reputation Bounded Context
│   ├── domain/            # Domain models, aggregates, value objects
│   ├── application/       # Application services, use cases
│   └── infrastructure/    # Convex functions, external integrations
│
├── promise-market/         # Promise Market Bounded Context
│   ├── domain/            # Promise aggregate, OrderBook, state machine
│   ├── application/       # Promise creation, listing, matching services
│   └── infrastructure/    # Convex queries/mutations, order book matching
│
├── token-management/       # Token Management Bounded Context
│   ├── domain/            # Wallet, Escrow, Transaction models
│   ├── application/       # Transfer, escrow, bridge services
│   └── infrastructure/    # Convex functions, blockchain integrations
│
├── settlement-verification/ # Settlement & Verification Bounded Context
│   ├── domain/            # SettlementCase, Dispute, VerificationResult
│   ├── application/       # Verification, dispute resolution services
│   └── infrastructure/    # Oracle implementation, arbitration
│
└── shared/                 # Shared kernel
    ├── domain/            # Common value objects, base classes
    ├── events/            # Domain event definitions
    └── primitives/        # Common types and utilities
```

## Bounded Contexts

Each bounded context follows the same layered architecture:

### Domain Layer
- **Aggregates**: Consistency boundaries (e.g., `BotAccount`, `Promise`, `Wallet`)
- **Entities**: Domain objects with identity
- **Value Objects**: Immutable domain primitives (e.g., `TokenAmount`, `ReputationScore`)
- **Domain Events**: What happened in the domain
- **Domain Services**: Logic that doesn't belong to a single aggregate

### Application Layer
- **Application Services**: Orchestrate use cases
- **Commands**: Input DTOs for mutations
- **Queries**: Read-only operations
- **Event Handlers**: React to domain events

### Infrastructure Layer
- **Convex Functions**: Database queries and mutations
- **Repositories**: Aggregate persistence
- **Event Publishers**: Publish domain events
- **External Integrations**: APIs, blockchains, etc.

## Dependency Rules

1. **Domain layer**: No dependencies on other layers or contexts
2. **Application layer**: Can depend on domain layer only
3. **Infrastructure layer**: Can depend on domain and application layers

## Communication Between Contexts

Contexts communicate via:
- **Domain Events**: Primary integration mechanism
- **Application Services**: For synchronous operations
- **Shared Kernel**: Common primitives (value objects, base types)

## Example: Creating a Promise

```typescript
// 1. Domain Layer (src/promise-market/domain/Promise.ts)
class Promise {
  static create(spec: PromiseSpecification, pricing: PricingTerms): Promise {
    // Domain logic
  }
}

// 2. Application Layer (src/promise-market/application/PromiseCreationService.ts)
class PromiseCreationService {
  async createPromise(command: CreatePromiseCommand): Promise<PromiseId> {
    // Orchestrate use case
    // Publish events
  }
}

// 3. Infrastructure Layer (convex/promiseMarket/mutations.ts)
export const createPromise = mutation({
  handler: async (ctx, args) => {
    const service = new PromiseCreationService(ctx);
    return await service.createPromise(args);
  }
});
```

## Getting Started

1. Read `/docs/ddd/` for comprehensive domain documentation
2. Start with the domain layer (understand the models)
3. Implement application services (use cases)
4. Wire up Convex functions (infrastructure)

## Testing

- **Unit Tests**: Domain logic (aggregates, value objects)
- **Integration Tests**: Application services with Convex
- **E2E Tests**: Full user flows via Playwright

Run tests: `bun test`
