import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * ClawMarket Database Schema
 * Following DDD bounded contexts:
 * - Bot Identity & Reputation
 * - Promise Market
 * - Token Management
 * - Settlement & Verification
 */

export default defineSchema({
  // Bot Identity & Reputation Context
  bots: defineTable({
    email: v.optional(v.string()),
    displayName: v.string(),
    apiKeyHash: v.string(),
    verificationStatus: v.union(
      v.literal("unverified"),
      v.literal("verified")
    ),
    emailVerified: v.boolean(),
    avatarUrl: v.optional(v.string()),
    reputationScore: v.number(),
    stakeLock: v.object({
      lockedAmount: v.number(),
      activePromises: v.array(v.object({
        promiseId: v.id("promises"),
        amount: v.number(),
      })),
    }),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_apiKeyHash", ["apiKeyHash"])
    .index("by_reputation", ["reputationScore"]),

  performanceHistory: defineTable({
    botId: v.id("bots"),
    promiseId: v.id("promises"),
    outcome: v.union(
      v.literal("fulfilled"),
      v.literal("failed"),
      v.literal("disputed_won"),
      v.literal("disputed_lost")
    ),
    executionTime: v.number(),
    completedAt: v.number(),
  }).index("by_bot", ["botId"]),

  // Reputation History for ROAD-007
  reputationHistory: defineTable({
    botId: v.string(), // String bot ID to match domain model
    records: v.array(v.object({
      promiseId: v.string(),
      outcome: v.union(
        v.literal('fulfilled'),
        v.literal('failed'),
        v.literal('disputed_won'),
        v.literal('disputed_lost'),
        v.literal('fulfilled_late')
      ),
      executionTime: v.number(),
      reputationDelta: v.number(),
      reason: v.string(),
      recordedAt: v.number(), // timestamp
    })),
    updatedAt: v.number(),
  })
    .index("by_botId", ["botId"]),

  authAttempts: defineTable({
    apiKeyHash: v.string(),
    ip: v.optional(v.string()),
    success: v.boolean(),
    attemptedAt: v.number(),
  })
    .index("by_apiKeyHash", ["apiKeyHash"])
    .index("by_apiKeyHash_and_attemptedAt", ["apiKeyHash", "attemptedAt"]),

  // Promise Market Context
  promises: defineTable({
    providerBotId: v.id("bots"),
    consumerBotId: v.optional(v.id("bots")),
    specification: v.object({
      modelName: v.string(),
      tokenCount: v.number(),
      contextWindow: v.optional(v.number()),
      responseTimeSLA: v.number(),
      qualityParams: v.optional(v.object({
        temperature: v.optional(v.number()),
        topP: v.optional(v.number()),
        maxTokens: v.optional(v.number()),
      })),
    }),
    pricingTerms: v.object({
      price: v.number(),
      paymentSchedule: v.union(
        v.literal("upfront"),
        v.literal("on_completion"),
        v.literal("split")
      ),
      penaltyClause: v.object({
        stakeAmount: v.number(),
        slashPercentage: v.number(),
      }),
      discount: v.optional(v.number()),
    }),
    state: v.union(
      v.literal("draft"),
      v.literal("listed"),
      v.literal("accepted"),
      v.literal("executing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("disputed"),
      v.literal("settled"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
    listedAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
    executingAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_provider", ["providerBotId"])
    .index("by_consumer", ["consumerBotId"])
    .index("by_state", ["state"])
    .index("by_model", ["specification.modelName", "state"]),

  promiseHistory: defineTable({
    promiseId: v.id("promises"),
    fromState: v.string(),
    toState: v.string(),
    triggeredBy: v.union(v.id("bots"), v.literal("system")),
    reason: v.optional(v.string()),
    transitionedAt: v.number(),
  }).index("by_promise", ["promiseId"]),

  orderBook: defineTable({
    type: v.union(v.literal("supply"), v.literal("demand")),
    promiseId: v.optional(v.id("promises")),
    botId: v.id("bots"),
    specification: v.object({
      modelName: v.string(),
      tokenCount: v.number(),
      responseTimeSLA: v.number(),
    }),
    price: v.number(),
    listedAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_type", ["type"])
    .index("by_model", ["specification.modelName", "type"]),

  // Token Management Context
  wallets: defineTable({
    botId: v.id("bots"),
    balance: v.number(),
    lockedBalance: v.number(),
    createdAt: v.number(),
  })
    .index("by_bot", ["botId"]),

  transactions: defineTable({
    type: v.union(
      v.literal("deposit"),
      v.literal("withdraw"),
      v.literal("transfer_in"),
      v.literal("transfer_out")
    ),
    amount: v.number(),
    fromWalletId: v.optional(v.id("wallets")),
    toWalletId: v.optional(v.id("wallets")),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_from_wallet", ["fromWalletId"])
    .index("by_to_wallet", ["toWalletId"]),

  // Escrow System for ROAD-009
  escrows: defineTable({
    promiseId: v.id("promises"),
    consumerId: v.id("bots"),
    providerId: v.id("bots"),
    state: v.union(
      v.literal("CREATED"),
      v.literal("EXECUTING"),
      v.literal("COMPLETED"),
      v.literal("FAILED"),
      v.literal("DISPUTED"),
      v.literal("RELEASING"),
      v.literal("RETURNING"),
      v.literal("CLOSED")
    ),
    lockedAmount: v.number(),
    lockedCurrency: v.string(),
    stakeLockAmount: v.number(),
    stakeLockId: v.optional(v.string()),
    executionProof: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    disputeReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
    closedAt: v.optional(v.number()),
  })
    .index("by_promise", ["promiseId"])
    .index("by_consumer", ["consumerId"])
    .index("by_provider", ["providerId"])
    .index("by_state", ["state"]),

  // Keep old escrowAccounts for backward compatibility during migration
  escrowAccounts: defineTable({
    promiseId: v.id("promises"),
    consumerWalletId: v.id("wallets"),
    providerWalletId: v.id("wallets"),
    amount: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("released"),
      v.literal("returned"),
      v.literal("slashed"),
      v.literal("disputed")
    ),
    createdAt: v.number(),
    settledAt: v.optional(v.number()),
  }).index("by_promise", ["promiseId"]),

  bridgeTransactions: defineTable({
    direction: v.union(v.literal("deposit"), v.literal("withdrawal")),
    botId: v.id("bots"),
    internalTokenAmount: v.number(),
    externalCryptoAmount: v.number(),
    externalCurrency: v.union(v.literal("ETH"), v.literal("SOL"), v.literal("USDC")),
    externalTxHash: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirming"),
      v.literal("completed"),
      v.literal("failed")
    ),
    initiatedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_bot", ["botId"]),

  // Settlement & Verification Context
  settlementCases: defineTable({
    promiseId: v.id("promises"),
    providerBotId: v.id("bots"),
    consumerBotId: v.id("bots"),
    executionProof: v.optional(v.object({
      apiCallLogs: v.array(v.object({
        endpoint: v.string(),
        requestTimestamp: v.number(),
        responseTimestamp: v.number(),
        statusCode: v.number(),
      })),
      inputHash: v.string(),
      outputHash: v.string(),
      executionMetadata: v.object({
        modelVersion: v.string(),
        tokenUsage: v.object({
          input: v.number(),
          output: v.number(),
        }),
        latency: v.number(),
      }),
      providerAttestation: v.object({
        signature: v.string(),
        signedAt: v.number(),
      }),
    })),
    verificationResult: v.optional(v.object({
      passed: v.boolean(),
      checks: v.array(v.object({
        checkName: v.string(),
        passed: v.boolean(),
        details: v.string(),
      })),
      verifiedAt: v.number(),
      verifiedBy: v.union(
        v.literal("oracle"),
        v.literal("consensus"),
        v.literal("arbitrator")
      ),
    })),
    status: v.union(
      v.literal("pending"),
      v.literal("verifying"),
      v.literal("verified"),
      v.literal("disputed"),
      v.literal("settled")
    ),
    outcome: v.optional(v.object({
      decision: v.union(
        v.literal("success"),
        v.literal("failure"),
        v.literal("partial")
      ),
      tokensToProvider: v.number(),
      tokensToConsumer: v.number(),
      tokensSlashed: v.number(),
      reputationDelta: v.object({
        provider: v.number(),
        consumer: v.number(),
      }),
      reason: v.string(),
    })),
    initiatedAt: v.number(),
    settledAt: v.optional(v.number()),
  }).index("by_promise", ["promiseId"]),

  disputes: defineTable({
    settlementCaseId: v.id("settlementCases"),
    raisedBy: v.id("bots"),
    reason: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("under_review"),
      v.literal("resolved")
    ),
    resolution: v.optional(v.object({
      decision: v.union(
        v.literal("uphold_verification"),
        v.literal("overturn_verification"),
        v.literal("partial_settlement")
      ),
      arbitrator: v.string(),
      reasoning: v.string(),
      resolvedAt: v.number(),
    })),
    raisedAt: v.number(),
    resolvedAt: v.optional(v.number()),
  }).index("by_case", ["settlementCaseId"]),

  // Domain Events (Event Store)
  events: defineTable({
    eventType: v.string(),
    aggregateType: v.string(),
    aggregateId: v.string(),
    version: v.number(),
    data: v.any(),
    causationId: v.optional(v.string()),
    correlationId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    occurredAt: v.number(),
  })
    .index("by_aggregate", ["aggregateType", "aggregateId"])
    .index("by_type", ["eventType"])
    .index("by_occurred_at", ["occurredAt"]),
});
