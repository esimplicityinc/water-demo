# ROAD-007: Reputation System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Implement the complete reputation system for bot-identity context, including performance history tracking, reputation calculation algorithm, and API endpoints.

**Architecture:** Extend the existing BotAccount aggregate with performance history. Implement a ReputationCalculator service for the algorithm. Create domain events for reputation changes. Add REST API endpoints and UI components following Hexagonal Architecture.

**Tech Stack:** TypeScript, Next.js 14 (App Router), Convex (backend), React, shadcn/ui, Vitest

---

## Context & Prerequisites

### Existing Domain Model
- **BotAccount aggregate** (`src/bot-identity/domain/BotAccount.ts`): Has `reputationScore: ReputationScore` field
- **ReputationScore value object** (`src/shared/domain/value-objects/ReputationScore.ts`): 0-1000 range with tiers (beginner/intermediate/advanced/expert)
- **DDD documentation**: Defines PerformanceRecord entity but not yet implemented
- **BDD scenarios**: Exist at `stack-tests/features/api/bot-identity/03_bot_reputation.feature`

### Acceptance Criteria (from BDD)
1. Query bot reputation (score, tier, history)
2. Reputation tiers calculated correctly
3. Reputation adjustments on:
   - Promise fulfilled on time: +10
   - Promise fulfilled late: +5
   - Promise failed: -20
   - Dispute won: +15
   - Dispute lost: -50
4. Bounds: 0-1000
5. Leaderboard query endpoint

---

## Task 1: Create PerformanceRecord Entity

**Files:**
- Create: `src/bot-identity/domain/PerformanceRecord.ts`
- Test: `src/bot-identity/domain/__tests__/PerformanceRecord.test.ts`

**Step 1: Write failing test**

```typescript
// src/bot-identity/domain/__tests__/PerformanceRecord.test.ts
import { describe, it, expect } from 'vitest';
import { PerformanceRecord, PerformanceOutcome } from '../PerformanceRecord';

describe('PerformanceRecord', () => {
  it('should create a performance record with all required fields', () => {
    const record = PerformanceRecord.create({
      promiseId: 'promise-123',
      outcome: 'fulfilled',
      executionTime: 10000, // 10 seconds
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    });

    expect(record.getPromiseId()).toBe('promise-123');
    expect(record.getOutcome()).toBe('fulfilled');
    expect(record.getExecutionTime()).toBe(10000);
    expect(record.getReputationDelta()).toBe(10);
    expect(record.getReason()).toBe('promise_fulfilled_on_time');
    expect(record.getRecordedAt()).toBeInstanceOf(Date);
  });

  it('should validate outcome is one of allowed values', () => {
    expect(() => {
      PerformanceRecord.create({
        promiseId: 'promise-123',
        outcome: 'invalid' as any,
        executionTime: 10000,
        reputationDelta: 10,
        reason: 'test',
      });
    }).toThrow('Invalid outcome');
  });

  it('should validate execution time is positive', () => {
    expect(() => {
      PerformanceRecord.create({
        promiseId: 'promise-123',
        outcome: 'fulfilled',
        executionTime: -1,
        reputationDelta: 10,
        reason: 'test',
      });
    }).toThrow('Execution time must be positive');
  });
});
```

**Step 2: Run test to verify failure**

```bash
cd /Users/aaronwest/Projects2/clawmarket
bun test src/bot-identity/domain/__tests__/PerformanceRecord.test.ts
```

Expected: FAIL - "PerformanceRecord not found"

**Step 3: Implement PerformanceRecord entity**

```typescript
// src/bot-identity/domain/PerformanceRecord.ts

export type PerformanceOutcome = 
  | 'fulfilled' 
  | 'failed' 
  | 'disputed_won' 
  | 'disputed_lost' 
  | 'fulfilled_late';

export interface PerformanceRecordData {
  promiseId: string;
  outcome: PerformanceOutcome;
  executionTime: number; // milliseconds
  reputationDelta: number;
  reason: string;
  recordedAt: Date;
}

export class PerformanceRecord {
  private readonly promiseId: string;
  private readonly outcome: PerformanceOutcome;
  private readonly executionTime: number;
  private readonly reputationDelta: number;
  private readonly reason: string;
  private readonly recordedAt: Date;

  private constructor(data: PerformanceRecordData) {
    this.promiseId = data.promiseId;
    this.outcome = data.outcome;
    this.executionTime = data.executionTime;
    this.reputationDelta = data.reputationDelta;
    this.reason = data.reason;
    this.recordedAt = data.recordedAt;
  }

  static create(data: Omit<PerformanceRecordData, 'recordedAt'>): PerformanceRecord {
    // Validation
    const validOutcomes: PerformanceOutcome[] = [
      'fulfilled', 'failed', 'disputed_won', 'disputed_lost', 'fulfilled_late'
    ];
    
    if (!validOutcomes.includes(data.outcome)) {
      throw new Error('Invalid outcome');
    }

    if (data.executionTime < 0) {
      throw new Error('Execution time must be positive');
    }

    return new PerformanceRecord({
      ...data,
      recordedAt: new Date(),
    });
  }

  // Getters
  getPromiseId(): string {
    return this.promiseId;
  }

  getOutcome(): PerformanceOutcome {
    return this.outcome;
  }

  getExecutionTime(): number {
    return this.executionTime;
  }

  getReputationDelta(): number {
    return this.reputationDelta;
  }

  getReason(): string {
    return this.reason;
  }

  getRecordedAt(): Date {
    return this.recordedAt;
  }

  toData(): PerformanceRecordData {
    return {
      promiseId: this.promiseId,
      outcome: this.outcome,
      executionTime: this.executionTime,
      reputationDelta: this.reputationDelta,
      reason: this.reason,
      recordedAt: this.recordedAt,
    };
  }
}
```

**Step 4: Run test to verify it passes**

```bash
bun test src/bot-identity/domain/__tests__/PerformanceRecord.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/bot-identity/domain/PerformanceRecord.ts src/bot-identity/domain/__tests__/PerformanceRecord.test.ts
git commit -m "feat(ROAD-007): add PerformanceRecord entity for reputation history"
```

---

## Task 2: Create ReputationCalculator Service

**Files:**
- Create: `src/bot-identity/domain/ReputationCalculator.ts`
- Test: `src/bot-identity/domain/__tests__/ReputationCalculator.test.ts`

**Step 1: Write failing test**

```typescript
// src/bot-identity/domain/__tests__/ReputationCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { ReputationCalculator } from '../ReputationCalculator';

describe('ReputationCalculator', () => {
  it('should calculate +10 for promise fulfilled on time', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'fulfilled',
      isOnTime: true,
      isDispute: false,
    });
    expect(result.delta).toBe(10);
    expect(result.reason).toBe('promise_fulfilled_on_time');
    expect(result.newScore).toBe(510);
  });

  it('should calculate +5 for promise fulfilled late', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'fulfilled',
      isOnTime: false,
      isLateWithin2xSLA: true,
      isDispute: false,
    });
    expect(result.delta).toBe(5);
    expect(result.reason).toBe('promise_fulfilled_late');
    expect(result.newScore).toBe(505);
  });

  it('should calculate -20 for promise failure', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'failed',
      isDispute: false,
    });
    expect(result.delta).toBe(-20);
    expect(result.reason).toBe('promise_failed');
    expect(result.newScore).toBe(480);
  });

  it('should calculate +15 for winning dispute', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'fulfilled',
      isDispute: true,
      disputeWon: true,
    });
    expect(result.delta).toBe(15);
    expect(result.reason).toBe('dispute_won');
    expect(result.newScore).toBe(515);
  });

  it('should calculate -50 for losing dispute', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 500,
      outcome: 'failed',
      isDispute: true,
      disputeWon: false,
    });
    expect(result.delta).toBe(-50);
    expect(result.reason).toBe('dispute_lost');
    expect(result.newScore).toBe(450);
  });

  it('should cap at maximum score of 1000', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 995,
      outcome: 'fulfilled',
      isOnTime: true,
      isDispute: false,
    });
    expect(result.delta).toBe(10);
    expect(result.newScore).toBe(1000);
  });

  it('should floor at minimum score of 0', () => {
    const result = ReputationCalculator.calculate({
      currentScore: 15,
      outcome: 'failed',
      isDispute: false,
    });
    expect(result.delta).toBe(-20);
    expect(result.newScore).toBe(0);
  });
});
```

**Step 2: Run test to verify failure**

```bash
bun test src/bot-identity/domain/__tests__/ReputationCalculator.test.ts
```

Expected: FAIL

**Step 3: Implement ReputationCalculator**

```typescript
// src/bot-identity/domain/ReputationCalculator.ts

export interface ReputationCalculationResult {
  delta: number;
  newScore: number;
  reason: string;
}

export interface ReputationCalculationInput {
  currentScore: number;
  outcome: 'fulfilled' | 'failed';
  isOnTime?: boolean;
  isLateWithin2xSLA?: boolean;
  isDispute?: boolean;
  disputeWon?: boolean;
}

export class ReputationCalculator {
  private static readonly MAX_SCORE = 1000;
  private static readonly MIN_SCORE = 0;

  static calculate(input: ReputationCalculationInput): ReputationCalculationResult {
    let delta = 0;
    let reason = '';

    if (input.isDispute) {
      // Dispute outcomes
      if (input.disputeWon) {
        delta = 15;
        reason = 'dispute_won';
      } else {
        delta = -50;
        reason = 'dispute_lost';
      }
    } else if (input.outcome === 'fulfilled') {
      // Successful promise fulfillment
      if (input.isOnTime) {
        delta = 10;
        reason = 'promise_fulfilled_on_time';
      } else if (input.isLateWithin2xSLA) {
        delta = 5;
        reason = 'promise_fulfilled_late';
      } else {
        // Very late, treat as failed
        delta = -20;
        reason = 'promise_failed';
      }
    } else if (input.outcome === 'failed') {
      // Promise failure
      delta = -20;
      reason = 'promise_failed';
    }

    const newScore = Math.max(
      this.MIN_SCORE,
      Math.min(this.MAX_SCORE, input.currentScore + delta)
    );

    return {
      delta,
      newScore,
      reason,
    };
  }
}
```

**Step 4: Run test to verify it passes**

```bash
bun test src/bot-identity/domain/__tests__/ReputationCalculator.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/bot-identity/domain/ReputationCalculator.ts src/bot-identity/domain/__tests__/ReputationCalculator.test.ts
git commit -m "feat(ROAD-007): add ReputationCalculator service with algorithm"
```

---

## Task 3: Create ReputationHistory Aggregate

**Files:**
- Create: `src/bot-identity/domain/ReputationHistory.ts`
- Test: `src/bot-identity/domain/__tests__/ReputationHistory.test.ts`
- Create: `src/bot-identity/domain/events/ReputationChanged.ts`

**Step 1: Write failing test for domain events**

```typescript
// src/bot-identity/domain/events/ReputationChanged.ts
export interface ReputationChangedEvent {
  type: 'ReputationChanged';
  botId: string;
  oldScore: number;
  newScore: number;
  delta: number;
  reason: string;
  promiseId?: string;
  occurredAt: Date;
}

export function createReputationChangedEvent(
  botId: string,
  oldScore: number,
  newScore: number,
  delta: number,
  reason: string,
  promiseId?: string
): ReputationChangedEvent {
  return {
    type: 'ReputationChanged',
    botId,
    oldScore,
    newScore,
    delta,
    reason,
    promiseId,
    occurredAt: new Date(),
  };
}
```

**Step 2: Write failing test for ReputationHistory aggregate**

```typescript
// src/bot-identity/domain/__tests__/ReputationHistory.test.ts
import { describe, it, expect } from 'vitest';
import { ReputationHistory } from '../ReputationHistory';
import { PerformanceRecord } from '../PerformanceRecord';

describe('ReputationHistory', () => {
  it('should create empty history for a bot', () => {
    const history = ReputationHistory.create('bot-123');
    expect(history.getBotId()).toBe('bot-123');
    expect(history.getRecords()).toHaveLength(0);
  });

  it('should add performance record', () => {
    const history = ReputationHistory.create('bot-123');
    const record = PerformanceRecord.create({
      promiseId: 'promise-1',
      outcome: 'fulfilled',
      executionTime: 5000,
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    });

    history.addRecord(record);
    expect(history.getRecords()).toHaveLength(1);
    expect(history.getLatestRecord()?.getPromiseId()).toBe('promise-1');
  });

  it('should limit history to last 100 records (DDD guideline)', () => {
    const history = ReputationHistory.create('bot-123');
    
    // Add 105 records
    for (let i = 0; i < 105; i++) {
      history.addRecord(PerformanceRecord.create({
        promiseId: `promise-${i}`,
        outcome: 'fulfilled',
        executionTime: 1000,
        reputationDelta: 10,
        reason: 'promise_fulfilled_on_time',
      }));
    }

    expect(history.getRecords()).toHaveLength(100);
    // Should keep the most recent (last 5 added)
    const records = history.getRecords();
    expect(records[99].getPromiseId()).toBe('promise-104');
  });

  it('should calculate stats from records', () => {
    const history = ReputationHistory.create('bot-123');
    
    history.addRecord(PerformanceRecord.create({
      promiseId: 'promise-1',
      outcome: 'fulfilled',
      executionTime: 5000,
      reputationDelta: 10,
      reason: 'promise_fulfilled_on_time',
    }));
    
    history.addRecord(PerformanceRecord.create({
      promiseId: 'promise-2',
      outcome: 'failed',
      executionTime: 10000,
      reputationDelta: -20,
      reason: 'promise_failed',
    }));

    const stats = history.getStats();
    expect(stats.totalPromises).toBe(2);
    expect(stats.successfulPromises).toBe(1);
    expect(stats.failedPromises).toBe(1);
    expect(stats.averageExecutionTime).toBe(7500);
  });
});
```

**Step 3: Implement ReputationHistory aggregate**

```typescript
// src/bot-identity/domain/ReputationHistory.ts
import { PerformanceRecord } from './PerformanceRecord';

export interface ReputationStats {
  totalPromises: number;
  successfulPromises: number;
  failedPromises: number;
  disputedWon: number;
  disputedLost: number;
  averageExecutionTime: number;
}

export interface ReputationHistoryData {
  botId: string;
  records: PerformanceRecord[];
}

export class ReputationHistory {
  private static readonly MAX_RECORDS = 100;
  
  private readonly botId: string;
  private records: PerformanceRecord[];

  private constructor(data: ReputationHistoryData) {
    this.botId = data.botId;
    this.records = data.records;
  }

  static create(botId: string): ReputationHistory {
    return new ReputationHistory({
      botId,
      records: [],
    });
  }

  static fromData(data: ReputationHistoryData): ReputationHistory {
    return new ReputationHistory(data);
  }

  // Getters
  getBotId(): string {
    return this.botId;
  }

  getRecords(): PerformanceRecord[] {
    return [...this.records]; // Return copy
  }

  getLatestRecord(): PerformanceRecord | undefined {
    return this.records[this.records.length - 1];
  }

  // Business logic
  addRecord(record: PerformanceRecord): void {
    this.records.push(record);
    
    // Maintain max size (keep most recent)
    if (this.records.length > ReputationHistory.MAX_RECORDS) {
      this.records = this.records.slice(-ReputationHistory.MAX_RECORDS);
    }
  }

  getStats(): ReputationStats {
    let totalPromises = 0;
    let successfulPromises = 0;
    let failedPromises = 0;
    let disputedWon = 0;
    let disputedLost = 0;
    let totalExecutionTime = 0;

    for (const record of this.records) {
      totalPromises++;
      totalExecutionTime += record.getExecutionTime();

      switch (record.getOutcome()) {
        case 'fulfilled':
        case 'fulfilled_late':
          successfulPromises++;
          break;
        case 'failed':
          failedPromises++;
          break;
        case 'disputed_won':
          disputedWon++;
          successfulPromises++;
          break;
        case 'disputed_lost':
          disputedLost++;
          failedPromises++;
          break;
      }
    }

    return {
      totalPromises,
      successfulPromises,
      failedPromises,
      disputedWon,
      disputedLost,
      averageExecutionTime: totalPromises > 0 ? totalExecutionTime / totalPromises : 0,
    };
  }

  toData(): ReputationHistoryData {
    return {
      botId: this.botId,
      records: this.records,
    };
  }
}
```

**Step 4: Run tests**

```bash
bun test src/bot-identity/domain/__tests__/ReputationHistory.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/bot-identity/domain/ReputationHistory.ts src/bot-identity/domain/__tests__/ReputationHistory.test.ts src/bot-identity/domain/events/ReputationChanged.ts
git commit -m "feat(ROAD-007): add ReputationHistory aggregate with stats and events"
```

---

## Task 4: Create Repository Port and Convex Adapter

**Files:**
- Create: `src/bot-identity/ports/ReputationRepository.ts` (port)
- Create: `src/bot-identity/infrastructure/convex/ReputationRepositoryConvex.ts` (adapter)
- Modify: `convex/schema.ts` (add reputationHistory table)

**Step 1: Write repository port interface**

```typescript
// src/bot-identity/ports/ReputationRepository.ts
import { ReputationHistory } from '../domain/ReputationHistory';
import { PerformanceRecord } from '../domain/PerformanceRecord';

export interface ReputationRepository {
  findByBotId(botId: string): Promise<ReputationHistory | null>;
  save(reputationHistory: ReputationHistory): Promise<void>;
  addPerformanceRecord(botId: string, record: PerformanceRecord): Promise<void>;
  getTopBotsByReputation(limit: number): Promise<Array<{
    botId: string;
    reputationScore: number;
    displayName: string;
  }>>;
}

export const REPUTATION_REPOSITORY_TOKEN = Symbol('ReputationRepository');
```

**Step 2: Update Convex schema**

```typescript
// convex/schema.ts - add to existing schema
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ... existing tables ...
  
  reputationHistory: defineTable({
    botId: v.string(),
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
});
```

**Step 3: Write Convex adapter**

```typescript
// src/bot-identity/infrastructure/convex/ReputationRepositoryConvex.ts
import { query, mutation } from "./_generated/server";
import { ReputationRepository } from '../../ports/ReputationRepository';
import { ReputationHistory } from '../../domain/ReputationHistory';
import { PerformanceRecord } from '../../domain/PerformanceRecord';
import { Id } from "../../../convex/_generated/dataModel";

export class ReputationRepositoryConvex implements ReputationRepository {
  async findByBotId(botId: string): Promise<ReputationHistory | null> {
    const record = await query("reputationHistory:getByBotId", { botId });
    
    if (!record) {
      return null;
    }

    return ReputationHistory.fromData({
      botId: record.botId,
      records: record.records.map((r: any) => 
        PerformanceRecord.create({
          promiseId: r.promiseId,
          outcome: r.outcome,
          executionTime: r.executionTime,
          reputationDelta: r.reputationDelta,
          reason: r.reason,
          // Note: recordedAt is set by create, we ignore the stored timestamp
        })
      ),
    });
  }

  async save(reputationHistory: ReputationHistory): Promise<void> {
    const data = reputationHistory.toData();
    
    await mutation("reputationHistory:save", {
      botId: data.botId,
      records: data.records.map(r => ({
        promiseId: r.getPromiseId(),
        outcome: r.getOutcome(),
        executionTime: r.getExecutionTime(),
        reputationDelta: r.getReputationDelta(),
        reason: r.getReason(),
        recordedAt: r.getRecordedAt().getTime(),
      })),
    });
  }

  async addPerformanceRecord(botId: string, record: PerformanceRecord): Promise<void> {
    await mutation("reputationHistory:addRecord", {
      botId,
      record: {
        promiseId: record.getPromiseId(),
        outcome: record.getOutcome(),
        executionTime: record.getExecutionTime(),
        reputationDelta: record.getReputationDelta(),
        reason: record.getReason(),
        recordedAt: record.getRecordedAt().getTime(),
      },
    });
  }

  async getTopBotsByReputation(limit: number): Promise<Array<{
    botId: string;
    reputationScore: number;
    displayName: string;
  }>> {
    const results = await query("reputationHistory:getTopBots", { limit });
    return results.map((r: any) => ({
      botId: r.botId,
      reputationScore: r.reputationScore,
      displayName: r.displayName,
    }));
  }
}
```

**Step 4: Create Convex functions**

```typescript
// convex/reputationHistory.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByBotId = query({
  args: { botId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reputationHistory")
      .withIndex("by_botId", (q) => q.eq("botId", args.botId))
      .unique();
  },
});

export const save = mutation({
  args: {
    botId: v.string(),
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
      recordedAt: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reputationHistory")
      .withIndex("by_botId", (q) => q.eq("botId", args.botId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        records: args.records,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("reputationHistory", {
        botId: args.botId,
        records: args.records,
        updatedAt: Date.now(),
      });
    }
  },
});

export const addRecord = mutation({
  args: {
    botId: v.string(),
    record: v.object({
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
      recordedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reputationHistory")
      .withIndex("by_botId", (q) => q.eq("botId", args.botId))
      .unique();

    if (existing) {
      const records = [...existing.records, args.record];
      // Keep only last 100
      if (records.length > 100) {
        records.shift();
      }
      
      await ctx.db.patch(existing._id, {
        records,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("reputationHistory", {
        botId: args.botId,
        records: [args.record],
        updatedAt: Date.now(),
      });
    }
  },
});

export const getTopBots = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    // Get all bots with their accounts
    const botAccounts = await ctx.db.query("botAccounts").collect();
    
    // Sort by reputation score descending
    const sorted = botAccounts
      .sort((a, b) => b.reputationScore - a.reputationScore)
      .slice(0, args.limit);

    return sorted.map(bot => ({
      botId: bot.botId,
      reputationScore: bot.reputationScore,
      displayName: bot.displayName,
    }));
  },
});
```

**Step 5: Commit**

```bash
git add src/bot-identity/ports/ReputationRepository.ts src/bot-identity/infrastructure/convex/ReputationRepositoryConvex.ts convex/reputationHistory.ts convex/schema.ts
git commit -m "feat(ROAD-007): add ReputationRepository port and Convex adapter"
```

---

## Task 5: Create Application Service

**Files:**
- Create: `src/bot-identity/application/ReputationService.ts`
- Create: `src/bot-identity/application/dto/ReputationDto.ts`
- Test: `src/bot-identity/application/__tests__/ReputationService.test.ts`

**Step 1: Create DTOs**

```typescript
// src/bot-identity/application/dto/ReputationDto.ts
import { ReputationStats } from '../../domain/ReputationHistory';

export interface ReputationDto {
  botId: string;
  score: number;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  history: ReputationHistoryEntryDto[];
  stats: ReputationStats;
}

export interface ReputationHistoryEntryDto {
  promiseId: string;
  outcome: string;
  executionTime: number;
  reputationDelta: number;
  reason: string;
  recordedAt: string; // ISO string
}

export interface LeaderboardEntryDto {
  botId: string;
  displayName: string;
  reputationScore: number;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UpdateReputationRequest {
  botId: string;
  outcome: 'fulfilled' | 'failed';
  promiseId: string;
  executionTime: number;
  isOnTime?: boolean;
  isLateWithin2xSLA?: boolean;
  isDispute?: boolean;
  disputeWon?: boolean;
}
```

**Step 2: Write failing test for service**

```typescript
// src/bot-identity/application/__tests__/ReputationService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReputationService } from '../ReputationService';
import { ReputationRepository } from '../../ports/ReputationRepository';
import { ReputationHistory } from '../../domain/ReputationHistory';

const mockRepository: ReputationRepository = {
  findByBotId: vi.fn(),
  save: vi.fn(),
  addPerformanceRecord: vi.fn(),
  getTopBotsByReputation: vi.fn(),
};

describe('ReputationService', () => {
  let service: ReputationService;

  beforeEach(() => {
    service = new ReputationService(mockRepository);
    vi.clearAllMocks();
  });

  it('should get reputation for a bot', async () => {
    const history = ReputationHistory.create('bot-123');
    vi.mocked(mockRepository.findByBotId).mockResolvedValue(history);

    const result = await service.getReputation('bot-123', 500);

    expect(result.botId).toBe('bot-123');
    expect(result.score).toBe(500);
    expect(result.tier).toBe('intermediate');
    expect(result.history).toEqual([]);
  });

  it('should update reputation on successful promise', async () => {
    const history = ReputationHistory.create('bot-123');
    vi.mocked(mockRepository.findByBotId).mockResolvedValue(history);

    const result = await service.updateReputation({
      botId: 'bot-123',
      outcome: 'fulfilled',
      promiseId: 'promise-1',
      executionTime: 5000,
      isOnTime: true,
      isDispute: false,
    }, 500);

    expect(result.newScore).toBe(510);
    expect(result.delta).toBe(10);
    expect(mockRepository.addPerformanceRecord).toHaveBeenCalled();
  });

  it('should get leaderboard', async () => {
    vi.mocked(mockRepository.getTopBotsByReputation).mockResolvedValue([
      { botId: 'bot-1', reputationScore: 900, displayName: 'Top Bot' },
      { botId: 'bot-2', reputationScore: 800, displayName: 'Good Bot' },
    ]);

    const result = await service.getLeaderboard(10);

    expect(result).toHaveLength(2);
    expect(result[0].tier).toBe('expert');
    expect(result[1].tier).toBe('advanced');
  });
});
```

**Step 3: Implement ReputationService**

```typescript
// src/bot-identity/application/ReputationService.ts
import { ReputationRepository } from '../ports/ReputationRepository';
import { ReputationCalculator } from '../domain/ReputationCalculator';
import { PerformanceRecord } from '../domain/PerformanceRecord';
import { ReputationHistory } from '../domain/ReputationHistory';
import { ReputationScore } from '../../shared/domain/value-objects/ReputationScore';
import { 
  ReputationDto, 
  LeaderboardEntryDto, 
  UpdateReputationRequest,
  ReputationUpdateResult,
} from './dto/ReputationDto';

export interface ReputationUpdateResult {
  newScore: number;
  delta: number;
  reason: string;
}

export class ReputationService {
  constructor(private readonly repository: ReputationRepository) {}

  async getReputation(botId: string, currentScore: number): Promise<ReputationDto> {
    // Get or create history
    let history = await this.repository.findByBotId(botId);
    if (!history) {
      history = ReputationHistory.create(botId);
    }

    // Get tier from score
    const score = new ReputationScore(currentScore);

    return {
      botId,
      score: currentScore,
      tier: score.getTier(),
      history: history.getRecords().map(r => ({
        promiseId: r.getPromiseId(),
        outcome: r.getOutcome(),
        executionTime: r.getExecutionTime(),
        reputationDelta: r.getReputationDelta(),
        reason: r.getReason(),
        recordedAt: r.getRecordedAt().toISOString(),
      })),
      stats: history.getStats(),
    };
  }

  async updateReputation(
    request: UpdateReputationRequest,
    currentScore: number
  ): Promise<ReputationUpdateResult> {
    // Calculate new reputation
    const calculation = ReputationCalculator.calculate({
      currentScore,
      outcome: request.outcome,
      isOnTime: request.isOnTime,
      isLateWithin2xSLA: request.isLateWithin2xSLA,
      isDispute: request.isDispute,
      disputeWon: request.disputeWon,
    });

    // Create performance record
    const record = PerformanceRecord.create({
      promiseId: request.promiseId,
      outcome: this.mapOutcome(request.outcome, request.isOnTime, request.isLateWithin2xSLA),
      executionTime: request.executionTime,
      reputationDelta: calculation.delta,
      reason: calculation.reason,
    });

    // Save to history
    await this.repository.addPerformanceRecord(request.botId, record);

    return {
      newScore: calculation.newScore,
      delta: calculation.delta,
      reason: calculation.reason,
    };
  }

  async getLeaderboard(limit: number): Promise<LeaderboardEntryDto[]> {
    const bots = await this.repository.getTopBotsByReputation(limit);
    
    return bots.map(bot => {
      const score = new ReputationScore(bot.reputationScore);
      return {
        botId: bot.botId,
        displayName: bot.displayName,
        reputationScore: bot.reputationScore,
        tier: score.getTier(),
      };
    });
  }

  private mapOutcome(
    outcome: 'fulfilled' | 'failed',
    isOnTime?: boolean,
    isLateWithin2xSLA?: boolean
  ): 'fulfilled' | 'failed' | 'fulfilled_late' {
    if (outcome === 'failed') {
      return 'failed';
    }
    if (isOnTime) {
      return 'fulfilled';
    }
    if (isLateWithin2xSLA) {
      return 'fulfilled_late';
    }
    return 'failed';
  }
}
```

**Step 4: Run tests**

```bash
bun test src/bot-identity/application/__tests__/ReputationService.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/bot-identity/application/ReputationService.ts src/bot-identity/application/dto/ReputationDto.ts src/bot-identity/application/__tests__/ReputationService.test.ts
git commit -m "feat(ROAD-007): add ReputationService application layer"
```

---

## Task 6: Create REST API Endpoints

**Files:**
- Create: `src/app/api/bots/[botId]/reputation/route.ts`
- Create: `src/app/api/bots/leaderboard/route.ts`

**Step 1: Create reputation endpoint**

```typescript
// src/app/api/bots/[botId]/reputation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ReputationRepositoryConvex } from '../../../../../bot-identity/infrastructure/convex/ReputationRepositoryConvex';
import { ReputationService } from '../../../../../bot-identity/application/ReputationService';

const repository = new ReputationRepositoryConvex();
const service = new ReputationService(repository);

export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;
    
    // Get current score from bot account (mock for now, will be from auth context)
    const currentScore = 500; // This should come from authenticated bot account

    const reputation = await service.getReputation(botId, currentScore);

    return NextResponse.json(reputation);
  } catch (error) {
    console.error('Error fetching reputation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reputation' },
      { status: 500 }
    );
  }
}
```

**Step 2: Create leaderboard endpoint**

```typescript
// src/app/api/bots/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ReputationRepositoryConvex } from '../../../../bot-identity/infrastructure/convex/ReputationRepositoryConvex';
import { ReputationService } from '../../../../bot-identity/application/ReputationService';

const repository = new ReputationRepositoryConvex();
const service = new ReputationService(repository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const leaderboard = await service.getLeaderboard(limit);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
```

**Step 3: Commit**

```bash
git add src/app/api/bots/[botId]/reputation/route.ts src/app/api/bots/leaderboard/route.ts
git commit -m "feat(ROAD-007): add REST API endpoints for reputation"
```

---

## Task 7: Create UI Components

**Files:**
- Create: `src/components/reputation/ReputationCard.tsx`
- Create: `src/components/reputation/ReputationHistory.tsx`
- Create: `src/components/reputation/Leaderboard.tsx`

**Step 1: Create ReputationCard component**

```typescript
// src/components/reputation/ReputationCard.tsx
'use client';

import { ReputationDto } from '../../bot-identity/application/dto/ReputationDto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ReputationCardProps {
  reputation: ReputationDto;
}

const tierColors = {
  beginner: 'bg-gray-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
  expert: 'bg-yellow-500',
};

export function ReputationCard({ reputation }: ReputationCardProps) {
  const progressPercentage = (reputation.score / 1000) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reputation</span>
          <Badge className={tierColors[reputation.tier]}>
            {reputation.tier.charAt(0).toUpperCase() + reputation.tier.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Score</span>
              <span className="font-medium">{reputation.score} / 1000</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{reputation.stats.totalPromises}</div>
              <div className="text-sm text-muted-foreground">Total Promises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reputation.stats.successfulPromises}
              </div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Create ReputationHistory component**

```typescript
// src/components/reputation/ReputationHistory.tsx
'use client';

import { ReputationDto } from '../../bot-identity/application/dto/ReputationDto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ReputationHistoryProps {
  reputation: ReputationDto;
}

const outcomeLabels: Record<string, string> = {
  fulfilled: 'Fulfilled',
  fulfilled_late: 'Fulfilled (Late)',
  failed: 'Failed',
  disputed_won: 'Dispute Won',
  disputed_lost: 'Dispute Lost',
};

export function ReputationHistory({ reputation }: ReputationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reputation History</CardTitle>
      </CardHeader>
      <CardContent>
        {reputation.history.length === 0 ? (
          <p className="text-muted-foreground">No reputation history yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promise</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Delta</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reputation.history.map((entry) => (
                <TableRow key={entry.promiseId}>
                  <TableCell className="font-mono text-xs">
                    {entry.promiseId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={entry.reputationDelta >= 0 ? 'default' : 'destructive'}
                    >
                      {outcomeLabels[entry.outcome] || entry.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={entry.reputationDelta >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {entry.reputationDelta > 0 ? '+' : ''}{entry.reputationDelta}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(entry.recordedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
```

**Step 3: Create Leaderboard component**

```typescript
// src/components/reputation/Leaderboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { LeaderboardEntryDto } from '../../bot-identity/application/dto/ReputationDto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

const tierColors = {
  beginner: 'bg-gray-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
  expert: 'bg-yellow-500',
};

export function Leaderboard() {
  const [bots, setBots] = useState<LeaderboardEntryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bots/leaderboard?limit=10')
      .then(res => res.json())
      .then(data => {
        setBots(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reputation Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Reputation Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot, index) => (
              <TableRow key={bot.botId}>
                <TableCell className="font-medium">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </TableCell>
                <TableCell>{bot.displayName}</TableCell>
                <TableCell>
                  <Badge className={tierColors[bot.tier]}>
                    {bot.tier.charAt(0).toUpperCase() + bot.tier.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {bot.reputationScore}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/reputation/
git commit -m "feat(ROAD-007): add UI components for reputation display"
```

---

## Task 8: Run BDD Tests

**Step 1: Run BDD tests for reputation feature**

```bash
just bdd-roadmap ROAD-007
```

Or manually:

```bash
cd stack-tests
npm test -- --grep "ROAD-007"
```

**Step 2: Fix any failing tests**

If tests fail, fix issues until all pass.

**Step 3: Commit**

```bash
git commit -m "test(ROAD-007): BDD tests passing for reputation system"
```

---

## Task 9: Update Documentation

**Files:**
- Update: `docs/ROADMAP.md` (status change)
- Update: `docs/CHANGELOG.md` (new entry)
- Update: `docs/ddd/04-aggregates-entities.md` (if needed)

**Step 1: Update ROADMAP.md**

Change ROAD-007 status from 🎯 Planned to ✅ Complete:

```markdown
### [ROAD-007] Reputation System ✅
**Status**: Complete
**Started**: 2026-01-31
**Completed**: 2026-01-31
**Priority**: High

- ✅ Performance history tracking
- ✅ Reputation calculation algorithm
- ✅ Reputation tiers (beginner/expert)
- ✅ Reputation display in UI
- ✅ Historical reputation chart

**Related Changes**: [CHANGE-XXX](#)
```

**Step 2: Add CHANGELOG.md entry**

```markdown
## [CHANGE-XXX] - 2026-01-31

### ROAD-007: Reputation System Implementation

**Added:**
- PerformanceRecord entity for tracking promise outcomes
- ReputationCalculator service with reputation algorithm
- ReputationHistory aggregate with stats
- ReputationRepository port and Convex adapter
- ReputationService application layer
- REST API endpoints: GET /api/bots/{botId}/reputation, GET /api/bots/leaderboard
- UI components: ReputationCard, ReputationHistory, Leaderboard
- Domain events: ReputationChanged

**BDD Scenarios:**
- 9 scenarios covering reputation queries, tiers, adjustments, bounds, and leaderboard

**Technical Details:**
- Algorithm: +10 (on time), +5 (late), -20 (fail), +15 (dispute won), -50 (dispute lost)
- Bounds: 0-1000
- Tiers: beginner (0-99), intermediate (100-499), advanced (500-799), expert (800-1000)
- History limit: 100 records per bot
```

**Step 3: Commit documentation**

```bash
git add docs/ROADMAP.md docs/CHANGELOG.md
git commit -m "docs(ROAD-007): update roadmap and changelog"
```

---

## Task 10: Final Quality Gates

**Step 1: Run full test suite**

```bash
just check
```

**Step 2: Run architecture inspection**

Use @architecture-inspector to verify:
- Hexagonal compliance
- Ports/adapters pattern
- Domain purity

**Step 3: Run domain alignment check**

Use @ddd-aligner to verify:
- Ubiquitous language
- Aggregate boundaries
- Domain events

**Step 4: Run CI checks**

```bash
just check
```

**Step 5: Final commit**

```bash
git commit -m "feat(ROAD-007): complete reputation system implementation"
```

---

## Summary

This implementation plan delivers:

1. **Domain Layer**: PerformanceRecord, ReputationCalculator, ReputationHistory aggregates
2. **Application Layer**: ReputationService with DTOs
3. **Infrastructure Layer**: Convex adapter, Convex functions, database schema
4. **Interface Layer**: REST API endpoints, React UI components
5. **Tests**: Unit tests for domain logic, BDD scenarios for full feature

**Estimated Time**: 2-3 hours
**Dependencies**: None (builds on existing BotAccount)
**BDD Coverage**: All 9 scenarios from `03_bot_reputation.feature`

---

**Ready for execution!** Choose subagent-driven development to implement task-by-task.
