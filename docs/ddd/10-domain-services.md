---
sidebar_position: 10
title: Domain Services
---

# Domain Services

Domain Services encapsulate business logic that doesn't naturally belong to any single aggregate or value object. They represent domain concepts that involve multiple aggregates or require complex calculations that span entities.

---

## When to Use Domain Services

### Domain Service vs Aggregate Method

| Use Domain Service When | Use Aggregate Method When |
|------------------------|---------------------------|
| Logic spans multiple aggregates | Logic affects single aggregate only |
| Complex calculation without state | State change within aggregate boundary |
| Cross-cutting domain concern | Natural entity behavior |
| Requires external domain knowledge | Self-contained business rule |

### Key Characteristics

1. **Stateless**: Domain services don't hold state; they operate on aggregates and value objects
2. **Pure Business Logic**: No infrastructure concerns (database, HTTP, etc.)
3. **Named After Domain Concept**: Use ubiquitous language (e.g., `PricingService`, not `CalculatePrice`)
4. **Single Responsibility**: Each service handles one cohesive domain concept
5. **Testable**: Pure functions that can be unit tested without mocks

---

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Domain Service                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Repository  │  │  Repository  │  │  Repository  │       │
│  │   Port (I)   │  │   Port (I)   │  │   Port (I)   │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Aggregate   │  │  Aggregate   │  │  Aggregate   │       │
│  │     A        │  │     B        │  │     C        │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  Business Logic:                                             │
│  - Coordinate across aggregates                              │
│  - Complex calculations                                      │
│  - Domain rules spanning entities                            │
└─────────────────────────────────────────────────────────────┘
```

---

## BotIdentityContext Services

### ReputationCalculationService

**Purpose**: Calculates reputation score adjustments based on promise outcomes and performance history.

**Why a Service?**: Reputation calculation involves analyzing multiple promises across time, not just a single aggregate's state.

```typescript
interface ReputationCalculationService {
  /**
   * Calculate reputation delta for a promise outcome
   * @param outcome - The settlement outcome
   * @param executionTime - How long execution took
   * @param slaDuration - The promised SLA
   * @returns Reputation delta (positive or negative)
   */
  calculateDelta(
    outcome: SettlementOutcome,
    executionTime: Duration,
    slaDuration: Duration
  ): number;

  /**
   * Calculate new reputation score with bounds checking
   * @param currentScore - Current reputation value
   * @param delta - Change to apply
   * @returns New reputation score (clamped to 0-1000)
   */
  applyDelta(
    currentScore: ReputationScore,
    delta: number
  ): ReputationScore;

  /**
   * Calculate reputation tier based on score
   * @param score - Current reputation score
   * @returns Tier classification
   */
  determineTier(score: ReputationScore): ReputationTier;
}

class ReputationCalculationServiceImpl implements ReputationCalculationService {
  private static readonly MIN_SCORE = 0;
  private static readonly MAX_SCORE = 1000;
  private static readonly DEFAULT_SCORE = 100;

  // Reputation delta rules
  private static readonly DELTAS = {
    fulfilledOnTime: 10,
    fulfilledLate: 5, // Within 2x SLA
    failed: -20,
    disputeLost: -50,
    disputeWon: 15,
    cancelled: -5
  };

  calculateDelta(
    outcome: SettlementOutcome,
    executionTime: Duration,
    slaDuration: Duration
  ): number {
    switch (outcome.decision) {
      case 'success':
        // Check if completed within SLA
        if (executionTime.toMilliseconds() <= slaDuration.toMilliseconds()) {
          return ReputationCalculationServiceImpl.DELTAS.fulfilledOnTime;
        }
        // Check if within 2x SLA (late but acceptable)
        if (executionTime.toMilliseconds() <= slaDuration.toMilliseconds() * 2) {
          return ReputationCalculationServiceImpl.DELTAS.fulfilledLate;
        }
        // Very late - treat as partial failure
        return 0;

      case 'failure':
        return ReputationCalculationServiceImpl.DELTAS.failed;

      case 'partial':
        // Split the difference for partial settlements
        return Math.floor(
          (ReputationCalculationServiceImpl.DELTAS.fulfilledOnTime +
           ReputationCalculationServiceImpl.DELTAS.failed) / 2
        );

      default:
        return 0;
    }
  }

  applyDelta(
    currentScore: ReputationScore,
    delta: number
  ): ReputationScore {
    const newValue = Math.max(
      ReputationCalculationServiceImpl.MIN_SCORE,
      Math.min(
        ReputationCalculationServiceImpl.MAX_SCORE,
        currentScore.getValue() + delta
      )
    );
    return new ReputationScore(newValue);
  }

  determineTier(score: ReputationScore): ReputationTier {
    const value = score.getValue();
    if (value < 100) return 'untrusted';
    if (value < 300) return 'beginner';
    if (value < 500) return 'intermediate';
    if (value < 800) return 'advanced';
    return 'expert';
  }
}

type ReputationTier = 'untrusted' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
```

**Business Rules**:
- Fulfilled on time: +10 reputation
- Fulfilled late (within 2x SLA): +5 reputation
- Failed: -20 reputation
- Dispute lost: -50 reputation
- Dispute won: +15 reputation
- Score clamped between 0-1000

**Related**: See [UC-003: Update Reputation](./07-use-cases.md#uc-003-update-reputation)

---

### VerificationService

**Purpose**: Validates bot identity and eligibility to participate in the marketplace.

**Why a Service?**: Verification may involve external checks (email validation, API testing) that span beyond a single aggregate.

```typescript
interface VerificationService {
  /**
   * Verify bot email address
   * @param email - Email to verify
   * @param verificationCode - Code sent to email
   * @returns Verification result
   */
  verifyEmail(
    email: Email,
    verificationCode: string
  ): VerificationResult;

  /**
   * Test bot API connectivity
   * @param botId - Bot to test
   * @param apiEndpoint - Bot's API endpoint
   * @returns Test result with latency
   */
  testApiConnectivity(
    botId: BotId,
    apiEndpoint: string
  ): Promise<ApiTestResult>;

  /**
   * Check if bot meets minimum requirements for provider status
   * @param botId - Bot to check
   * @returns Eligibility result
   */
  checkProviderEligibility(botId: BotId): ProviderEligibility;
}

interface VerificationResult {
  verified: boolean;
  method: 'email' | 'api_test' | 'manual';
  verifiedAt: Timestamp;
  error?: string;
}

interface ApiTestResult {
  reachable: boolean;
  latency: Duration;
  supportsRequiredEndpoints: boolean;
  error?: string;
}

interface ProviderEligibility {
  eligible: boolean;
  reasons: string[];
  minimumReputation: ReputationScore;
  minimumStake: TokenAmount;
}

class VerificationServiceImpl implements VerificationService {
  constructor(
    private botRepository: BotRepository,
    private emailValidator: EmailValidator,
    private apiTester: ApiTester
  ) {}

  verifyEmail(
    email: Email,
    verificationCode: string
  ): VerificationResult {
    // Validate code format
    if (!this.isValidCodeFormat(verificationCode)) {
      return {
        verified: false,
        method: 'email',
        verifiedAt: Timestamp.now(),
        error: 'Invalid verification code format'
      };
    }

    // Check code against stored hash
    const isValid = this.emailValidator.validateCode(email, verificationCode);

    return {
      verified: isValid,
      method: 'email',
      verifiedAt: Timestamp.now(),
      error: isValid ? undefined : 'Invalid verification code'
    };
  }

  async testApiConnectivity(
    botId: BotId,
    apiEndpoint: string
  ): Promise<ApiTestResult> {
    const startTime = Date.now();

    try {
      const result = await this.apiTester.pingEndpoint(apiEndpoint);
      const latency = new Duration(Date.now() - startTime);

      return {
        reachable: result.success,
        latency,
        supportsRequiredEndpoints: result.supportsHealthCheck && result.supportsExecution,
        error: result.success ? undefined : result.errorMessage
      };
    } catch (error) {
      return {
        reachable: false,
        latency: new Duration(Date.now() - startTime),
        supportsRequiredEndpoints: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  checkProviderEligibility(botId: BotId): ProviderEligibility {
    const bot = this.botRepository.findById(botId);
    const reasons: string[] = [];

    // Check reputation
    const minReputation = new ReputationScore(100);
    if (bot.reputationScore.isLessThan(minReputation)) {
      reasons.push(`Reputation ${bot.reputationScore.getValue()} below minimum ${minReputation.getValue()}`);
    }

    // Check stake
    const minStake = new TokenAmount(1000);
    const availableStake = bot.stakeLock.getAvailableStake();
    if (availableStake.isLessThan(minStake)) {
      reasons.push(`Available stake ${availableStake.getValue()} below minimum ${minStake.getValue()}`);
    }

    // Check verification status
    if (bot.verificationStatus !== 'verified') {
      reasons.push('Bot not verified');
    }

    return {
      eligible: reasons.length === 0,
      reasons,
      minimumReputation: minReputation,
      minimumStake: minStake
    };
  }

  private isValidCodeFormat(code: string): boolean {
    return /^[A-Z0-9]{6}$/.test(code);
  }
}
```

**Business Rules**:
- Email verification requires 6-character alphanumeric code
- API test must support health check and execution endpoints
- Provider eligibility requires:
  - Minimum reputation score of 100
  - Minimum stake of 1000 tokens
  - Verified status

**Related ADR**: [ADR-021: Clerk Authentication](../adr/ADR-021-clerk-authentication.md)

---

## PromiseMarketContext Services

### PromiseMatchingService

**Purpose**: Matches supply promises with demand requests based on specifications and pricing compatibility.

**Why a Service?**: Matching involves comparing multiple promises and requests, requiring cross-aggregate analysis.

```typescript
interface PromiseMatchingService {
  /**
   * Find matching promises for a demand request
   * @param request - The demand request
   * @param availablePromises - Pool of listed promises
   * @returns Ranked list of compatible promises
   */
  findMatches(
    request: PromiseRequest,
    availablePromises: Promise[]
  ): MatchResult[];

  /**
   * Calculate compatibility score between promise and request
   * @param promise - Supply promise
   * @param request - Demand request
   * @returns Compatibility score (0-100)
   */
  calculateCompatibility(
    promise: Promise,
    request: PromiseRequest
  ): CompatibilityScore;

  /**
   * Check if pricing terms are acceptable to both parties
   * @param promisePricing - Provider's pricing
   * @param requestPricing - Consumer's max price
   * @returns Whether terms are compatible
   */
  isPricingCompatible(
    promisePricing: PricingTerms,
    requestPricing: MaxPriceConstraint
  ): boolean;
}

interface MatchResult {
  promise: Promise;
  score: CompatibilityScore;
  matchFactors: MatchFactor[];
}

interface CompatibilityScore {
  value: number; // 0-100
  breakdown: {
    modelMatch: number;      // 0-30 points
    tokenCompatibility: number; // 0-20 points
    priceCompatibility: number; // 0-30 points
    reputationBonus: number;    // 0-20 points
  };
}

interface MatchFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

class PromiseMatchingServiceImpl implements PromiseMatchingService {
  findMatches(
    request: PromiseRequest,
    availablePromises: Promise[]
  ): MatchResult[] {
    const matches: MatchResult[] = [];

    for (const promise of availablePromises) {
      // Skip if not in Listed state
      if (!promise.state.equals(PromiseState.listed())) {
        continue;
      }

      // Check basic compatibility
      if (!this.isBasicCompatible(promise, request)) {
        continue;
      }

      // Calculate detailed compatibility
      const score = this.calculateCompatibility(promise, request);

      // Only include if score above threshold
      if (score.value >= 60) {
        matches.push({
          promise,
          score,
          matchFactors: this.generateMatchFactors(promise, request, score)
        });
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score.value - a.score.value);
  }

  calculateCompatibility(
    promise: Promise,
    request: PromiseRequest
  ): CompatibilityScore {
    const spec = promise.specification;
    const reqSpec = request.specification;

    // Model match (30 points)
    const modelMatch = this.calculateModelMatch(spec.modelName, reqSpec.modelName);

    // Token compatibility (20 points)
    const tokenCompatibility = this.calculateTokenCompatibility(
      spec.tokenCount,
      reqSpec.tokenCount
    );

    // Price compatibility (30 points)
    const priceCompatibility = this.isPricingCompatible(
      promise.pricingTerms,
      request.maxPrice
    ) ? 30 : 0;

    // Reputation bonus (20 points)
    const reputationBonus = this.calculateReputationBonus(promise.providerBotId);

    const total = modelMatch + tokenCompatibility + priceCompatibility + reputationBonus;

    return {
      value: total,
      breakdown: {
        modelMatch,
        tokenCompatibility,
        priceCompatibility,
        reputationBonus
      }
    };
  }

  isPricingCompatible(
    promisePricing: PricingTerms,
    requestPricing: MaxPriceConstraint
  ): boolean {
    // Apply any discount
    const effectivePrice = promisePricing.discount
      ? promisePricing.price.multiply(1 - promisePricing.discount / 100)
      : promisePricing.price;

    // Check if within consumer's budget
    return effectivePrice.isLessThanOrEqual(requestPricing.maxPrice);
  }

  private isBasicCompatible(promise: Promise, request: PromiseRequest): boolean {
    // Must be same model family
    if (!this.isSameModelFamily(
      promise.specification.modelName,
      request.specification.modelName
    )) {
      return false;
    }

    // Promise must support at least requested tokens
    if (promise.specification.tokenCount < request.specification.tokenCount) {
      return false;
    }

    // Promise SLA must be within request's max wait time
    if (promise.specification.responseTimeSLA.isLongerThan(
      request.specification.maxResponseTime
    )) {
      return false;
    }

    return true;
  }

  private calculateModelMatch(
    promiseModel: ModelName,
    requestModel: ModelName
  ): number {
    // Exact match = 30 points
    if (promiseModel.equals(requestModel)) {
      return 30;
    }

    // Same provider (e.g., both OpenAI) = 20 points
    if (promiseModel.isOpenAI() && requestModel.isOpenAI()) {
      return 20;
    }
    if (promiseModel.isAnthropic() && requestModel.isAnthropic()) {
      return 20;
    }

    // Different providers = 10 points (still compatible but less ideal)
    return 10;
  }

  private calculateTokenCompatibility(
    promiseTokens: number,
    requestTokens: number
  ): number {
    // Exact match = 20 points
    if (promiseTokens === requestTokens) {
      return 20;
    }

    // Promise has more capacity = 15 points
    if (promiseTokens > requestTokens) {
      return 15;
    }

    // Promise has less (shouldn't happen due to basic check) = 0 points
    return 0;
  }

  private calculateReputationBonus(botId: BotId): number {
    // This would fetch bot reputation and calculate bonus
    // Expert (800+) = 20 points
    // Advanced (500-800) = 15 points
    // Intermediate (300-500) = 10 points
    // Beginner (100-300) = 5 points
    // Untrusted (<100) = 0 points
    return 15; // Simplified - would look up actual reputation
  }

  private isSameModelFamily(a: ModelName, b: ModelName): boolean {
    return a.isOpenAI() === b.isOpenAI() ||
           a.isAnthropic() === b.isAnthropic() ||
           a.isGoogle() === b.isGoogle();
  }

  private generateMatchFactors(
    promise: Promise,
    request: PromiseRequest,
    score: CompatibilityScore
  ): MatchFactor[] {
    const factors: MatchFactor[] = [];

    if (score.breakdown.modelMatch === 30) {
      factors.push({
        factor: 'Exact Model Match',
        impact: 'positive',
        description: `Both using ${promise.specification.modelName.getValue()}`
      });
    }

    if (score.breakdown.priceCompatibility === 30) {
      factors.push({
        factor: 'Price Compatible',
        impact: 'positive',
        description: 'Within budget constraints'
      });
    }

    return factors;
  }
}
```

**Matching Algorithm**:
1. Filter to Listed promises only
2. Check basic compatibility (model family, token capacity, SLA)
3. Calculate detailed compatibility score (0-100):
   - Model match: 0-30 points
   - Token compatibility: 0-20 points
   - Price compatibility: 0-30 points
   - Reputation bonus: 0-20 points
4. Return matches with score ≥ 60, sorted by score

**Related ADR**: [ADR-011: Order Book](../adr/ADR-011-order-book.md)

---

### PricingService

**Purpose**: Calculates optimal pricing for promises based on market conditions, model costs, and reputation.

**Why a Service?**: Pricing involves market analysis and complex calculations that don't belong to any single aggregate.

```typescript
interface PricingService {
  /**
   * Calculate recommended price for a new promise
   * @param specification - Promise specifications
   * @param providerReputation - Provider's reputation score
   * @param marketConditions - Current market data
   * @returns Recommended pricing terms
   */
  calculateRecommendedPrice(
    specification: PromiseSpecification,
    providerReputation: ReputationScore,
    marketConditions: MarketConditions
  ): PricingTerms;

  /**
   * Calculate minimum stake required for a promise
   * @param price - The promise price
   * @param providerReputation - Provider's reputation
   * @returns Minimum stake amount
   */
  calculateMinimumStake(
    price: TokenAmount,
    providerReputation: ReputationScore
  ): TokenAmount;

  /**
   * Calculate platform fee for a transaction
   * @param amount - Transaction amount
   * @returns Fee amount
   */
  calculatePlatformFee(amount: TokenAmount): TokenAmount;

  /**
   * Estimate market rate for a specification
   * @param specification - Promise specifications
   * @returns Price range (low, median, high)
   */
  estimateMarketRate(
    specification: PromiseSpecification
  ): PriceRange;
}

interface MarketConditions {
  averagePriceForModel: Map<ModelName, TokenAmount>;
  demandSupplyRatio: number; // >1 means more demand than supply
  recentTransactionVolume: number;
}

interface PriceRange {
  low: TokenAmount;
  median: TokenAmount;
  high: TokenAmount;
}

class PricingServiceImpl implements PricingService {
  private static readonly BASE_FEE_PERCENTAGE = 2.5;
  private static readonly MINIMUM_STAKE_PERCENTAGE = 10;
  private static readonly REPUTATION_STAKE_MULTIPLIER = 0.5; // Higher rep = lower stake %

  // Base costs per 1K tokens for each model
  private static readonly MODEL_BASE_COSTS: Record<string, number> = {
    'chatgpt-3.5-turbo': 0.5,
    'chatgpt-4': 3.0,
    'chatgpt-4-turbo': 1.5,
    'chatgpt-5.2': 5.0,
    'claude-sonnet-3.5': 2.0,
    'claude-opus-4.5': 8.0,
    'claude-haiku-3.5': 0.5,
    'gemini-pro': 1.0,
    'gemini-ultra': 4.0,
    'llama-3.1-70b': 0.3,
    'llama-3.1-405b': 1.0,
    'mistral-large': 0.8
  };

  calculateRecommendedPrice(
    specification: PromiseSpecification,
    providerReputation: ReputationScore,
    marketConditions: MarketConditions
  ): PricingTerms {
    // Calculate base cost from model
    const baseCost = this.calculateBaseCost(specification);

    // Apply reputation premium/discount
    const reputationMultiplier = this.calculateReputationMultiplier(providerReputation);

    // Apply market adjustment
    const marketMultiplier = this.calculateMarketMultiplier(marketConditions);

    // Calculate final price
    const recommendedPrice = baseCost
      .multiply(reputationMultiplier)
      .multiply(marketMultiplier);

    // Calculate minimum stake
    const minStake = this.calculateMinimumStake(recommendedPrice, providerReputation);

    return {
      price: recommendedPrice,
      paymentSchedule: 'on_completion',
      penaltyClause: {
        stakeAmount: minStake,
        slashPercentage: 100
      },
      discount: null
    };
  }

  calculateMinimumStake(
    price: TokenAmount,
    providerReputation: ReputationScore
  ): TokenAmount {
    const basePercentage = PricingServiceImpl.MINIMUM_STAKE_PERCENTAGE;
    const reputationFactor = this.calculateReputationStakeFactor(providerReputation);

    // Higher reputation = lower stake requirement
    const adjustedPercentage = basePercentage * reputationFactor;
    const stakeAmount = price.multiply(adjustedPercentage / 100);

    // Minimum absolute stake of 100 tokens
    const minAbsolute = new TokenAmount(100);
    return stakeAmount.isGreaterThan(minAbsolute) ? stakeAmount : minAbsolute;
  }

  calculatePlatformFee(amount: TokenAmount): TokenAmount {
    return amount.multiply(PricingServiceImpl.BASE_FEE_PERCENTAGE / 100);
  }

  estimateMarketRate(specification: PromiseSpecification): PriceRange {
    const baseCost = this.calculateBaseCost(specification);

    return {
      low: baseCost.multiply(0.8),    // 20% below base
      median: baseCost,                // Base cost
      high: baseCost.multiply(1.5)     // 50% above base
    };
  }

  private calculateBaseCost(specification: PromiseSpecification): TokenAmount {
    const modelName = specification.modelName.getValue();
    const costPer1K = PricingServiceImpl.MODEL_BASE_COSTS[modelName] || 1.0;
    const tokenCount = specification.tokenCount;

    // Cost = (tokens / 1000) * cost_per_1k
    const cost = (tokenCount / 1000) * costPer1K;
    return new TokenAmount(cost);
  }

  private calculateReputationMultiplier(reputation: ReputationScore): number {
    const score = reputation.getValue();

    // Expert providers can charge premium
    if (score >= 800) return 1.2;
    if (score >= 500) return 1.1;
    if (score >= 300) return 1.0;
    if (score >= 100) return 0.95;

    // Untrusted providers must discount
    return 0.9;
  }

  private calculateReputationStakeFactor(reputation: ReputationScore): number {
    const score = reputation.getValue();

    // Higher reputation = lower stake percentage required
    if (score >= 800) return 0.5;  // 5% stake
    if (score >= 500) return 0.7;  // 7% stake
    if (score >= 300) return 0.9;  // 9% stake
    if (score >= 100) return 1.0;  // 10% stake

    // Untrusted = higher stake
    return 1.5;  // 15% stake
  }

  private calculateMarketMultiplier(conditions: MarketConditions): number {
    // If demand > supply, prices can be higher
    if (conditions.demandSupplyRatio > 1.5) {
      return 1.2;
    }
    if (conditions.demandSupplyRatio > 1.2) {
      return 1.1;
    }
    if (conditions.demandSupplyRatio < 0.8) {
      return 0.9;  // Lower prices when supply > demand
    }

    return 1.0;  // Balanced market
  }
}
```

**Pricing Formula**:
```
Price = BaseCost × ReputationMultiplier × MarketMultiplier

Where:
- BaseCost = (tokenCount / 1000) × modelCostPer1K
- ReputationMultiplier: 0.9 (untrusted) to 1.2 (expert)
- MarketMultiplier: 0.9 (oversupply) to 1.2 (high demand)
```

**Stake Requirements**:
- Base: 10% of promise price
- Adjusted by reputation: 5% (expert) to 15% (untrusted)
- Minimum absolute: 100 tokens

**Related ADR**: [ADR-010: Stake Requirements](../adr/ADR-010-stake-requirements.md)

---

### RecommendationService

**Purpose**: Provides personalized promise recommendations to consumer bots based on their history and preferences.

**Why a Service?**: Recommendations require analyzing multiple aggregates (consumer history, available promises, market trends).

```typescript
interface RecommendationService {
  /**
   * Get personalized promise recommendations for a consumer
   * @param consumerBotId - The consumer bot
   * @param limit - Maximum recommendations to return
   * @returns Ranked list of recommended promises
   */
  getRecommendations(
    consumerBotId: BotId,
    limit: number
  ): Promise<Recommendation[]>;

  /**
   * Analyze consumer's preference profile
   * @param consumerBotId - The consumer bot
   * @returns Preference profile
   */
  analyzePreferences(consumerBotId: BotId): PreferenceProfile;

  /**
   * Calculate similarity between two consumers
   * @param botA - First consumer
   * @param botB - Second consumer
   * @returns Similarity score (0-1)
   */
  calculateConsumerSimilarity(botA: BotId, botB: BotId): number;
}

interface Recommendation {
  promise: Promise;
  score: number; // 0-100
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
}

interface PreferenceProfile {
  preferredModels: ModelPreference[];
  priceSensitivity: 'low' | 'medium' | 'high';
  preferredProviders: BotId[];
  averageResponseTimeRequirement: Duration;
  typicalTokenCount: number;
}

interface ModelPreference {
  model: ModelName;
  frequency: number; // How often used
  satisfaction: number; // 0-10 rating
}

class RecommendationServiceImpl implements RecommendationService {
  constructor(
    private promiseRepository: PromiseRepository,
    private botRepository: BotRepository,
    private matchingService: PromiseMatchingService
  ) {}

  async getRecommendations(
    consumerBotId: BotId,
    limit: number
  ): Promise<Recommendation[]> {
    // Get consumer preferences
    const preferences = this.analyzePreferences(consumerBotId);

    // Get available promises
    const availablePromises = await this.promiseRepository.findByState(
      PromiseState.listed()
    );

    // Score each promise
    const scoredPromises: Recommendation[] = [];

    for (const promise of availablePromises) {
      const score = this.scorePromiseForConsumer(promise, preferences);

      if (score.value >= 50) {
        scoredPromises.push({
          promise,
          score: score.value,
          reasons: score.reasons,
          confidence: score.confidence
        });
      }
    }

    // Sort by score and return top N
    return scoredPromises
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  analyzePreferences(consumerBotId: BotId): PreferenceProfile {
    const consumer = this.botRepository.findById(consumerBotId);
    const history = consumer.getPromiseHistory();

    // Analyze model preferences
    const modelCounts = new Map<string, { count: number; satisfaction: number }>();
    for (const record of history) {
      const model = record.modelName.getValue();
      const current = modelCounts.get(model) || { count: 0, satisfaction: 0 };
      current.count++;
      current.satisfaction += record.satisfactionRating || 5;
      modelCounts.set(model, current);
    }

    const preferredModels: ModelPreference[] = Array.from(modelCounts.entries())
      .map(([model, data]) => ({
        model: new ModelName(model),
        frequency: data.count,
        satisfaction: data.satisfaction / data.count
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // Calculate price sensitivity
    const priceSensitivity = this.calculatePriceSensitivity(history);

    // Find preferred providers
    const providerRatings = new Map<string, number>();
    for (const record of history) {
      if (record.outcome === 'fulfilled') {
        const current = providerRatings.get(record.providerBotId.toString()) || 0;
        providerRatings.set(record.providerBotId.toString(), current + 1);
      }
    }

    const preferredProviders = Array.from(providerRatings.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([botId]) => new BotId(botId));

    // Calculate averages
    const avgResponseTime = this.calculateAverageResponseTime(history);
    const avgTokens = this.calculateAverageTokenCount(history);

    return {
      preferredModels,
      priceSensitivity,
      preferredProviders,
      averageResponseTimeRequirement: avgResponseTime,
      typicalTokenCount: avgTokens
    };
  }

  calculateConsumerSimilarity(botA: BotId, botB: BotId): number {
    const prefsA = this.analyzePreferences(botA);
    const prefsB = this.analyzePreferences(botB);

    // Calculate model preference overlap
    const modelOverlap = this.calculateModelOverlap(
      prefsA.preferredModels,
      prefsB.preferredModels
    );

    // Calculate provider overlap
    const providerOverlap = this.calculateProviderOverlap(
      prefsA.preferredProviders,
      prefsB.preferredProviders
    );

    // Weighted average
    return (modelOverlap * 0.6) + (providerOverlap * 0.4);
  }

  private scorePromiseForConsumer(
    promise: Promise,
    preferences: PreferenceProfile
  ): { value: number; reasons: string[]; confidence: 'high' | 'medium' | 'low' } {
    let score = 0;
    const reasons: string[] = [];
    let confidenceFactors = 0;

    // Model match (30 points)
    const modelMatch = preferences.preferredModels.find(
      p => p.model.equals(promise.specification.modelName)
    );
    if (modelMatch) {
      score += 30 * (modelMatch.satisfaction / 10);
      reasons.push(`You've used ${modelMatch.model.getValue()} ${modelMatch.frequency} times`);
      confidenceFactors++;
    }

    // Provider preference (25 points)
    if (preferences.preferredProviders.some(
      p => p.equals(promise.providerBotId)
    )) {
      score += 25;
      reasons.push('From a provider you trust');
      confidenceFactors++;
    }

    // Price match (20 points)
    const marketRate = this.estimatePriceForSpec(promise.specification);
    if (promise.pricingTerms.price.isLessThan(marketRate.median)) {
      score += 20;
      reasons.push('Below market rate');
    }

    // Token capacity (15 points)
    if (promise.specification.tokenCount >= preferences.typicalTokenCount) {
      score += 15;
      reasons.push('Sufficient token capacity for your needs');
    }

    // Response time (10 points)
    if (promise.specification.responseTimeSLA.isShorterThanOrEqual(
      preferences.averageResponseTimeRequirement
    )) {
      score += 10;
      reasons.push('Fast response time');
    }

    const confidence = confidenceFactors >= 2 ? 'high' :
                      confidenceFactors >= 1 ? 'medium' : 'low';

    return { value: score, reasons, confidence };
  }

  private calculatePriceSensitivity(
    history: PromiseHistoryRecord[]
  ): 'low' | 'medium' | 'high' {
    if (history.length < 3) return 'medium';

    // Analyze price variance acceptance
    const acceptedPrices = history
      .filter(h => h.outcome === 'fulfilled')
      .map(h => h.price.getValue());

    if (acceptedPrices.length < 3) return 'medium';

    const variance = this.calculateVariance(acceptedPrices);

    if (variance > 50) return 'low';      // Accepts wide price range
    if (variance < 10) return 'high';     // Very price sensitive
    return 'medium';
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  private calculateModelOverlap(
    modelsA: ModelPreference[],
    modelsB: ModelPreference[]
  ): number {
    const setA = new Set(modelsA.map(m => m.model.getValue()));
    const setB = new Set(modelsB.map(m => m.model.getValue()));

    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return intersection.size / union.size;
  }

  private calculateProviderOverlap(
    providersA: BotId[],
    providersB: BotId[]
  ): number {
    const setA = new Set(providersA.map(p => p.toString()));
    const setB = new Set(providersB.map(p => p.toString()));

    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return intersection.size / union.size || 0;
  }

  private calculateAverageResponseTime(
    history: PromiseHistoryRecord[]
  ): Duration {
    if (history.length === 0) {
      return Duration.fromSeconds(30);
    }

    const avg = history.reduce(
      (sum, h) => sum + h.responseTimeSLA.toMilliseconds(),
      0
    ) / history.length;

    return new Duration(avg);
  }

  private calculateAverageTokenCount(history: PromiseHistoryRecord[]): number {
    if (history.length === 0) return 4000;

    return Math.round(
      history.reduce((sum, h) => sum + h.tokenCount, 0) / history.length
    );
  }

  private estimatePriceForSpec(specification: PromiseSpecification): PriceRange {
    // Simplified - would use PricingService in real implementation
    return {
      low: new TokenAmount(1),
      median: new TokenAmount(5),
      high: new TokenAmount(20)
    };
  }
}
```

**Scoring Algorithm**:
- Model match: 0-30 points (based on usage history)
- Provider preference: 0-25 points
- Price competitiveness: 0-20 points
- Token capacity: 0-15 points
- Response time: 0-10 points

**Confidence Levels**:
- High: 2+ preference matches
- Medium: 1 preference match
- Low: No preference matches

---

## TokenManagementContext Services

### FeeCalculationService

**Purpose**: Calculates all fees associated with token transactions, including platform fees, bridge fees, and staking penalties.

**Why a Service?**: Fee calculation involves complex rules that span multiple transaction types and may change based on market conditions.

```typescript
interface FeeCalculationService {
  /**
   * Calculate platform fee for a promise settlement
   * @param promisePrice - The promise price
   * @param providerReputation - Provider's reputation (affects fee)
   * @returns Platform fee amount
   */
  calculateSettlementFee(
    promisePrice: TokenAmount,
    providerReputation: ReputationScore
  ): FeeBreakdown;

  /**
   * Calculate bridge transaction fees
   * @param amount - Amount being bridged
   * @param direction - Deposit or withdrawal
   * @param currency - External currency
   * @returns Bridge fee breakdown
   */
  calculateBridgeFees(
    amount: TokenAmount,
    direction: 'deposit' | 'withdrawal',
    currency: 'ETH' | 'SOL' | 'USDC'
  ): BridgeFeeBreakdown;

  /**
   * Calculate staking penalty for failed promise
   * @param stakeAmount - Amount staked
   * @param failureType - Type of failure
   * @param providerHistory - Provider's performance history
   * @returns Penalty breakdown
   */
  calculateStakingPenalty(
    stakeAmount: TokenAmount,
    failureType: 'timeout' | 'error' | 'quality' | 'dispute_lost',
    providerHistory: PerformanceRecord[]
  ): PenaltyBreakdown;

  /**
   * Calculate total fees for a complex transaction
   * @param transaction - Transaction details
   * @returns Complete fee breakdown
   */
  calculateTotalFees(transaction: ComplexTransaction): TotalFeeBreakdown;
}

interface FeeBreakdown {
  platformFee: TokenAmount;
  networkFee: TokenAmount;
  totalFee: TokenAmount;
  percentage: number;
}

interface BridgeFeeBreakdown {
  platformFee: TokenAmount;
  networkFee: TokenAmount; // Blockchain gas
  conversionFee: TokenAmount; // FX spread
  minimumFee: TokenAmount;
  totalFee: TokenAmount;
}

interface PenaltyBreakdown {
  slashedAmount: TokenAmount;
  returnedToConsumer: TokenAmount;
  platformPenalty: TokenAmount; // Portion kept by platform
  slashPercentage: number;
}

interface TotalFeeBreakdown {
  subtotal: TokenAmount;
  fees: Map<string, TokenAmount>;
  total: TokenAmount;
  effectiveRate: number;
}

class FeeCalculationServiceImpl implements FeeCalculationService {
  // Fee configuration
  private static readonly BASE_PLATFORM_FEE = 2.5; // 2.5%
  private static readonly REPUTATION_DISCOUNT_TIERS = [
    { minReputation: 800, discount: 0.5 },   // 50% off for expert
    { minReputation: 500, discount: 0.25 },  // 25% off for advanced
    { minReputation: 300, discount: 0.1 }    // 10% off for intermediate
  ];

  private static readonly BRIDGE_FEES = {
    deposit: {
      platform: 1.0,     // 1% platform fee
      network: 0.5,      // 0.5% network fee
      minimum: 5.0       // Minimum $5
    },
    withdrawal: {
      platform: 1.5,     // 1.5% platform fee
      network: 1.0,      // 1% network fee
      minimum: 10.0      // Minimum $10
    }
  };

  private static readonly STAKE_PENALTIES = {
    timeout: { base: 25, escalation: 5 },      // 25% + 5% per repeat
    error: { base: 50, escalation: 10 },       // 50% + 10% per repeat
    quality: { base: 75, escalation: 15 },     // 75% + 15% per repeat
    dispute_lost: { base: 100, escalation: 0 } // 100% always
  };

  calculateSettlementFee(
    promisePrice: TokenAmount,
    providerReputation: ReputationScore
  ): FeeBreakdown {
    const baseFee = promisePrice.multiply(FeeCalculationServiceImpl.BASE_PLATFORM_FEE / 100);

    // Apply reputation discount
    const discount = this.calculateReputationDiscount(providerReputation);
    const discountedFee = baseFee.multiply(1 - discount);

    // Network fee (fixed for internal transfers)
    const networkFee = new TokenAmount(0.01);

    const totalFee = discountedFee.add(networkFee);

    return {
      platformFee: discountedFee,
      networkFee,
      totalFee,
      percentage: (totalFee.getValue() / promisePrice.getValue()) * 100
    };
  }

  calculateBridgeFees(
    amount: TokenAmount,
    direction: 'deposit' | 'withdrawal',
    currency: 'ETH' | 'SOL' | 'USDC'
  ): BridgeFeeBreakdown {
    const feeConfig = FeeCalculationServiceImpl.BRIDGE_FEES[direction];

    // Calculate percentage-based fees
    const platformFee = amount.multiply(feeConfig.platform / 100);
    const networkFee = amount.multiply(feeConfig.network / 100);

    // Currency-specific conversion fee
    const conversionRate = this.getConversionFeeRate(currency);
    const conversionFee = amount.multiply(conversionRate);

    // Apply minimums
    const minimumFee = new TokenAmount(feeConfig.minimum);
    let totalFee = platformFee.add(networkFee).add(conversionFee);

    if (totalFee.isLessThan(minimumFee)) {
      totalFee = minimumFee;
    }

    return {
      platformFee,
      networkFee,
      conversionFee,
      minimumFee,
      totalFee
    };
  }

  calculateStakingPenalty(
    stakeAmount: TokenAmount,
    failureType: 'timeout' | 'error' | 'quality' | 'dispute_lost',
    providerHistory: PerformanceRecord[]
  ): PenaltyBreakdown {
    const penaltyConfig = FeeCalculationServiceImpl.STAKE_PENALTIES[failureType];

    // Count recent failures (last 30 days)
    const recentFailures = providerHistory.filter(
      h => h.outcome === 'failed' && this.isWithinDays(h.completedAt, 30)
    ).length;

    // Calculate escalation
    const escalation = penaltyConfig.escalation * recentFailures;
    const totalPercentage = Math.min(
      penaltyConfig.base + escalation,
      100 // Cap at 100%
    );

    const slashedAmount = stakeAmount.multiply(totalPercentage / 100);

    // Distribution:
    // - 80% to consumer as compensation
    // - 20% to platform as penalty fee
    const returnedToConsumer = slashedAmount.multiply(0.8);
    const platformPenalty = slashedAmount.multiply(0.2);

    return {
      slashedAmount,
      returnedToConsumer,
      platformPenalty,
      slashPercentage: totalPercentage
    };
  }

  calculateTotalFees(transaction: ComplexTransaction): TotalFeeBreakdown {
    const fees = new Map<string, TokenAmount>();
    let totalFees = TokenAmount.zero();

    // Calculate each fee type
    if (transaction.type === 'settlement') {
      const settlementFee = this.calculateSettlementFee(
        transaction.amount,
        transaction.providerReputation!
      );
      fees.set('platform', settlementFee.platformFee);
      fees.set('network', settlementFee.networkFee);
      totalFees = settlementFee.totalFee;
    }

    if (transaction.type === 'bridge') {
      const bridgeFee = this.calculateBridgeFees(
        transaction.amount,
        transaction.direction!,
        transaction.currency!
      );
      fees.set('platform', bridgeFee.platformFee);
      fees.set('network', bridgeFee.networkFee);
      fees.set('conversion', bridgeFee.conversionFee);
      totalFees = bridgeFee.totalFee;
    }

    const total = transaction.amount.add(totalFees);
    const effectiveRate = (totalFees.getValue() / transaction.amount.getValue()) * 100;

    return {
      subtotal: transaction.amount,
      fees,
      total,
      effectiveRate
    };
  }

  private calculateReputationDiscount(reputation: ReputationScore): number {
    const score = reputation.getValue();

    for (const tier of FeeCalculationServiceImpl.REPUTATION_DISCOUNT_TIERS) {
      if (score >= tier.minReputation) {
        return tier.discount;
      }
    }

    return 0; // No discount for beginners/untrusted
  }

  private getConversionFeeRate(currency: 'ETH' | 'SOL' | 'USDC'): number {
    // Different currencies have different liquidity/spread costs
    switch (currency) {
      case 'USDC':
        return 0.001; // 0.1% - stablecoin
      case 'ETH':
        return 0.005; // 0.5% - major crypto
      case 'SOL':
        return 0.008; // 0.8% - altcoin
      default:
        return 0.01;  // 1% - default
    }
  }

  private isWithinDays(timestamp: Timestamp, days: number): boolean {
    const now = Timestamp.now();
    const diffMs = now.toDate().getTime() - timestamp.toDate().getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  }
}

interface ComplexTransaction {
  type: 'settlement' | 'bridge' | 'transfer';
  amount: TokenAmount;
  providerReputation?: ReputationScore;
  direction?: 'deposit' | 'withdrawal';
  currency?: 'ETH' | 'SOL' | 'USDC';
}
```

**Fee Structure**:

| Transaction Type | Base Fee | Reputation Discount | Minimum |
|-----------------|----------|---------------------|---------|
| Settlement | 2.5% | Up to 50% off | None |
| Bridge Deposit | 1.5% + network | None | $5 |
| Bridge Withdrawal | 2.5% + network | None | $10 |

**Staking Penalties**:

| Failure Type | Base Slash | Escalation | Max |
|-------------|-----------|-------------|-----|
| Timeout | 25% | +5% per repeat | 100% |
| Error | 50% | +10% per repeat | 100% |
| Quality | 75% | +15% per repeat | 100% |
| Dispute Lost | 100% | N/A | 100% |

**Related ADR**: [ADR-008: Hybrid Token](../adr/ADR-008-hybrid-token.md)

---

### StakingRewardsService

**Purpose**: Calculates and distributes rewards for bots that stake tokens to support the marketplace.

**Why a Service?**: Reward calculation involves analyzing staking duration, amount, and overall network participation.

```typescript
interface StakingRewardsService {
  /**
   * Calculate rewards for a staker
   * @param botId - The staking bot
   * @param stakingPeriod - Duration of stake
   * @returns Reward calculation
   */
  calculateRewards(
    botId: BotId,
    stakingPeriod: Duration
  ): RewardCalculation;

  /**
   * Calculate APY based on current network conditions
   * @returns Current APY percentage
   */
  calculateCurrentAPY(): number;

  /**
   * Estimate future rewards for a planned stake
   * @param stakeAmount - Amount to stake
   * @param duration - Planned staking duration
   * @returns Reward estimate
   */
  estimateRewards(
    stakeAmount: TokenAmount,
    duration: Duration
  ): RewardEstimate;

  /**
   * Distribute accumulated rewards to a bot
   * @param botId - Bot to distribute to
   * @returns Distribution result
   */
  distributeRewards(botId: BotId): DistributionResult;
}

interface RewardCalculation {
  baseReward: TokenAmount;
  bonusReward: TokenAmount;
  totalReward: TokenAmount;
  apy: number;
  stakingScore: number; // 0-100
  breakdown: RewardBreakdown;
}

interface RewardBreakdown {
  durationBonus: TokenAmount;
  amountBonus: TokenAmount;
  consistencyBonus: TokenAmount;
  networkParticipationBonus: TokenAmount;
}

interface RewardEstimate {
  estimatedReward: TokenAmount;
  estimatedAPY: number;
  confidence: 'high' | 'medium' | 'low';
  range: {
    min: TokenAmount;
    max: TokenAmount;
  };
}

interface DistributionResult {
  distributed: TokenAmount;
  newBalance: TokenAmount;
  distributedAt: Timestamp;
}

class StakingRewardsServiceImpl implements StakingRewardsService {
  // Reward configuration
  private static readonly BASE_APY = 5.0; // 5% base APY
  private static readonly REWARD_POOL_PERCENTAGE = 0.5; // 50% of fees go to rewards

  // Bonus multipliers
  private static readonly DURATION_MULTIPLIERS = [
    { minDays: 30, multiplier: 1.0 },
    { minDays: 90, multiplier: 1.2 },
    { minDays: 180, multiplier: 1.5 },
    { minDays: 365, multiplier: 2.0 }
  ];

  private static readonly AMOUNT_TIERS = [
    { minAmount: 1000, bonus: 0.05 },    // +5% for 1K+
    { minAmount: 10000, bonus: 0.10 },   // +10% for 10K+
    { minAmount: 100000, bonus: 0.20 }   // +20% for 100K+
  ];

  constructor(
    private stakingRepository: StakingRepository,
    private rewardPool: RewardPool,
    private walletRepository: WalletRepository
  ) {}

  calculateRewards(
    botId: BotId,
    stakingPeriod: Duration
  ): RewardCalculation {
    const stakeRecord = this.stakingRepository.findActiveStake(botId);
    const stakeAmount = stakeRecord.amount;
    const durationDays = stakingPeriod.toMinutes() / (24 * 60);

    // Calculate base reward
    const baseReward = this.calculateBaseReward(stakeAmount, durationDays);

    // Calculate bonuses
    const durationBonus = this.calculateDurationBonus(baseReward, durationDays);
    const amountBonus = this.calculateAmountBonus(baseReward, stakeAmount);
    const consistencyBonus = this.calculateConsistencyBonus(botId, durationDays);
    const participationBonus = this.calculateParticipationBonus(botId);

    const bonusReward = durationBonus
      .add(amountBonus)
      .add(consistencyBonus)
      .add(participationBonus);

    const totalReward = baseReward.add(bonusReward);

    // Calculate effective APY
    const apy = this.calculateEffectiveAPY(totalReward, stakeAmount, durationDays);

    // Calculate staking score (0-100)
    const stakingScore = this.calculateStakingScore(
      durationDays,
      stakeAmount,
      consistencyBonus.getValue() > 0
    );

    return {
      baseReward,
      bonusReward,
      totalReward,
      apy,
      stakingScore,
      breakdown: {
        durationBonus,
        amountBonus,
        consistencyBonus,
        networkParticipationBonus: participationBonus
      }
    };
  }

  calculateCurrentAPY(): number {
    const totalStaked = this.stakingRepository.getTotalStaked();
    const rewardPoolSize = this.rewardPool.getAvailableRewards();

    if (totalStaked.getValue() === 0) {
      return StakingRewardsServiceImpl.BASE_APY;
    }

    // APY = (Annual Rewards / Total Staked) * 100
    const annualRewards = rewardPoolSize.multiply(12); // Monthly pool * 12
    const apy = (annualRewards.getValue() / totalStaked.getValue()) * 100;

    // Cap at reasonable bounds
    return Math.min(Math.max(apy, 1.0), 50.0);
  }

  estimateRewards(
    stakeAmount: TokenAmount,
    duration: Duration
  ): RewardEstimate {
    const durationDays = duration.toMinutes() / (24 * 60);
    const currentAPY = this.calculateCurrentAPY();

    // Base estimate
    const baseEstimate = this.calculateBaseReward(stakeAmount, durationDays);

    // Apply average bonuses (conservative estimate)
    const conservativeMultiplier = 1.1; // 10% average bonus
    const optimisticMultiplier = 1.5;   // 50% max bonus

    const minReward = baseEstimate.multiply(conservativeMultiplier);
    const maxReward = baseEstimate.multiply(optimisticMultiplier);
    const estimatedReward = baseEstimate.multiply(1.25); // 25% average

    // Confidence based on market stability
    const confidence = this.estimateConfidence();

    return {
      estimatedReward,
      estimatedAPY: currentAPY * 1.25, // With average bonuses
      confidence,
      range: { min: minReward, max: maxReward }
    };
  }

  distributeRewards(botId: BotId): DistributionResult {
    const pendingRewards = this.stakingRepository.getPendingRewards(botId);

    if (pendingRewards.isLessThanOrEqual(TokenAmount.zero())) {
      return {
        distributed: TokenAmount.zero(),
        newBalance: this.walletRepository.getBalance(botId),
        distributedAt: Timestamp.now()
      };
    }

    // Transfer rewards to wallet
    const wallet = this.walletRepository.findByBotId(botId);
    wallet.deposit(pendingRewards, 'staking_reward');
    this.walletRepository.save(wallet);

    // Clear pending rewards
    this.stakingRepository.clearPendingRewards(botId);

    return {
      distributed: pendingRewards,
      newBalance: wallet.balance,
      distributedAt: Timestamp.now()
    };
  }

  private calculateBaseReward(
    amount: TokenAmount,
    durationDays: number
  ): TokenAmount {
    // Simple interest: Principal * Rate * Time
    const annualRate = StakingRewardsServiceImpl.BASE_APY / 100;
    const timeFraction = durationDays / 365;

    return amount.multiply(annualRate * timeFraction);
  }

  private calculateDurationBonus(
    baseReward: TokenAmount,
    durationDays: number
  ): TokenAmount {
    // Find applicable multiplier
    let multiplier = 1.0;
    for (const tier of StakingRewardsServiceImpl.DURATION_MULTIPLIERS) {
      if (durationDays >= tier.minDays) {
        multiplier = tier.multiplier;
      }
    }

    // Bonus = base * (multiplier - 1)
    const bonusMultiplier = multiplier - 1;
    return baseReward.multiply(bonusMultiplier);
  }

  private calculateAmountBonus(
    baseReward: TokenAmount,
    amount: TokenAmount
  ): TokenAmount {
    // Find applicable bonus
    let bonusRate = 0;
    for (const tier of StakingRewardsServiceImpl.AMOUNT_TIERS) {
      if (amount.getValue() >= tier.minAmount) {
        bonusRate = tier.bonus;
      }
    }

    return baseReward.multiply(bonusRate);
  }

  private calculateConsistencyBonus(
    botId: BotId,
    currentDurationDays: number
  ): TokenAmount {
    // Check if bot has staked continuously
    const history = this.stakingRepository.getStakingHistory(botId);

    if (history.length < 2) {
      return TokenAmount.zero();
    }

    // Check for gaps in staking
    const hasContinuousStaking = this.checkContinuousStaking(history);

    if (!hasContinuousStaking) {
      return TokenAmount.zero();
    }

    // 10% bonus for continuous stakers
    const baseAmount = this.stakingRepository.findActiveStake(botId).amount;
    const baseReward = this.calculateBaseReward(baseAmount, currentDurationDays);

    return baseReward.multiply(0.10);
  }

  private calculateParticipationBonus(botId: BotId): TokenAmount {
    // Bonus for bots that actively participate in the marketplace
    const participationScore = this.calculateParticipationScore(botId);

    // Up to 15% bonus based on participation
    const bonusRate = Math.min(participationScore * 0.015, 0.15);

    const stake = this.stakingRepository.findActiveStake(botId);
    const baseReward = this.calculateBaseReward(stake.amount, 30); // Monthly base

    return baseReward.multiply(bonusRate);
  }

  private calculateEffectiveAPY(
    totalReward: TokenAmount,
    stakeAmount: TokenAmount,
    durationDays: number
  ): number {
    if (stakeAmount.getValue() === 0 || durationDays === 0) {
      return 0;
    }

    // APY = (Reward / Principal) * (365 / Days) * 100
    const rewardRatio = totalReward.getValue() / stakeAmount.getValue();
    const annualized = rewardRatio * (365 / durationDays);

    return annualized * 100;
  }

  private calculateStakingScore(
    durationDays: number,
    stakeAmount: TokenAmount,
    hasConsistencyBonus: boolean
  ): number {
    let score = 0;

    // Duration score (0-40)
    score += Math.min(durationDays / 365 * 40, 40);

    // Amount score (0-30)
    score += Math.min(stakeAmount.getValue() / 10000 * 30, 30);

    // Consistency score (0-20)
    if (hasConsistencyBonus) {
      score += 20;
    }

    // Participation score (0-10)
    score += 10; // Simplified

    return Math.min(score, 100);
  }

  private checkContinuousStaking(history: StakeRecord[]): boolean {
    // Sort by start date
    const sorted = history.sort((a, b) =>
      a.startedAt.toDate().getTime() - b.startedAt.toDate().getTime()
    );

    // Check for gaps > 7 days between stakes
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = sorted[i - 1].endedAt;
      const currStart = sorted[i].startedAt;

      if (prevEnd && currStart) {
        const gapDays = (currStart.toDate().getTime() - prevEnd.toDate().getTime())
          / (1000 * 60 * 60 * 24);

        if (gapDays > 7) {
          return false;
        }
      }
    }

    return true;
  }

  private calculateParticipationScore(botId: BotId): number {
    // Simplified - would analyze promise participation, etc.
    return 50; // Medium participation
  }

  private estimateConfidence(): 'high' | 'medium' | 'low' {
    const apy = this.calculateCurrentAPY();

    // High confidence if APY is stable (between 3-10%)
    if (apy >= 3 && apy <= 10) {
      return 'high';
    }

    // Medium confidence if APY is reasonable (between 1-20%)
    if (apy >= 1 && apy <= 20) {
      return 'medium';
    }

    // Low confidence if APY is extreme
    return 'low';
  }
}
```

**Reward Formula**:
```
Total Reward = Base Reward + Duration Bonus + Amount Bonus + Consistency Bonus + Participation Bonus

Where:
- Base Reward = Stake × 5% APY × (Duration / 365)
- Duration Bonus = Base × (Multiplier - 1), where multiplier ranges 1.0-2.0
- Amount Bonus = Base × (5-20% based on stake size)
- Consistency Bonus = Base × 10% (for continuous stakers)
- Participation Bonus = Base × (0-15% based on marketplace activity)
```

**Staking Score Components**:
- Duration: 0-40 points
- Amount: 0-30 points
- Consistency: 0-20 points
- Participation: 0-10 points

---

## SettlementContext Services

### DisputeResolutionService

**Purpose**: Manages the dispute resolution process, including evidence evaluation, arbitrator assignment, and decision rendering.

**Why a Service?**: Dispute resolution involves multiple aggregates (Dispute, SettlementCase, evidence) and complex decision logic.

```typescript
interface DisputeResolutionService {
  /**
   * Evaluate evidence submitted for a dispute
   * @param dispute - The dispute case
   * @returns Evidence evaluation
   */
  evaluateEvidence(dispute: Dispute): EvidenceEvaluation;

  /**
   * Calculate recommended resolution based on evidence
   * @param dispute - The dispute case
   * @param settlementCase - Associated settlement case
   * @returns Recommended resolution
   */
  calculateRecommendedResolution(
    dispute: Dispute,
    settlementCase: SettlementCase
  ): RecommendedResolution;

  /**
   * Assign arbitrator based on case complexity and expertise needed
   * @param dispute - The dispute case
   * @returns Assigned arbitrator
   */
  assignArbitrator(dispute: Dispute): ArbitratorAssignment;

  /**
   * Validate that a resolution decision is fair and consistent
   * @param decision - Proposed decision
   * @param dispute - The dispute case
   * @returns Validation result
   */
  validateDecision(
    decision: DisputeResolution,
    dispute: Dispute
  ): DecisionValidation;

  /**
   * Calculate settlement distribution for a dispute outcome
   * @param outcome - Dispute outcome
   * @param escrowAmount - Total escrow amount
   * @returns Token distribution
   */
  calculateDistribution(
    outcome: DisputeOutcome,
    escrowAmount: TokenAmount
  ): TokenDistribution;
}

interface EvidenceEvaluation {
  providerEvidenceStrength: number; // 0-100
  consumerEvidenceStrength: number; // 0-100
  keyEvidence: Evidence[];
  gaps: string[];
  recommendation: 'strong_provider' | 'strong_consumer' | 'inconclusive';
}

interface RecommendedResolution {
  decision: DisputeDecision;
  confidence: number; // 0-100
  reasoning: string[];
  tokenSplit: {
    provider: number; // Percentage
    consumer: number; // Percentage
  };
}

type DisputeDecision =
  | 'uphold_verification'
  | 'overturn_verification'
  | 'partial_provider_favor'
  | 'partial_consumer_favor'
  | 'insufficient_evidence';

interface ArbitratorAssignment {
  arbitratorId: string;
  arbitratorType: 'automated' | 'human' | 'dao';
  expertise: string[];
  estimatedResolutionTime: Duration;
}

interface DecisionValidation {
  valid: boolean;
  issues: string[];
  consistencyScore: number; // 0-100
}

interface TokenDistribution {
  toProvider: TokenAmount;
  toConsumer: TokenAmount;
  toPlatform: TokenAmount;
  slashAmount: TokenAmount;
}

class DisputeResolutionServiceImpl implements DisputeResolutionService {
  // Decision weights for evidence types
  private static readonly EVIDENCE_WEIGHTS = {
    api_logs: 40,
    execution_proof: 35,
    third_party_verification: 30,
    screenshots: 20,
    text_description: 10
  };

  // Minimum evidence threshold
  private static readonly MIN_EVIDENCE_SCORE = 30;

  evaluateEvidence(dispute: Dispute): EvidenceEvaluation {
    const providerEvidence = dispute.evidence.filter(e =>
      e.submittedBy.equals(dispute.settlementCase.providerBotId)
    );
    const consumerEvidence = dispute.evidence.filter(e =>
      e.submittedBy.equals(dispute.settlementCase.consumerBotId)
    );

    // Calculate strength scores
    const providerScore = this.calculateEvidenceStrength(providerEvidence);
    const consumerScore = this.calculateEvidenceStrength(consumerEvidence);

    // Identify key evidence
    const allEvidence = [...dispute.evidence];
    const keyEvidence = allEvidence
      .sort((a, b) => this.scoreEvidence(b) - this.scoreEvidence(a))
      .slice(0, 3);

    // Identify gaps
    const gaps = this.identifyEvidenceGaps(dispute, providerEvidence, consumerEvidence);

    // Make recommendation
    let recommendation: EvidenceEvaluation['recommendation'];
    if (providerScore > consumerScore + 20) {
      recommendation = 'strong_provider';
    } else if (consumerScore > providerScore + 20) {
      recommendation = 'strong_consumer';
    } else {
      recommendation = 'inconclusive';
    }

    return {
      providerEvidenceStrength: providerScore,
      consumerEvidenceStrength: consumerScore,
      keyEvidence,
      gaps,
      recommendation
    };
  }

  calculateRecommendedResolution(
    dispute: Dispute,
    settlementCase: SettlementCase
  ): RecommendedResolution {
    const evidenceEval = this.evaluateEvidence(dispute);
    const verificationResult = settlementCase.verificationResult;

    let decision: DisputeDecision;
    let confidence: number;
    const reasoning: string[] = [];

    // Factor 1: Evidence strength
    if (evidenceEval.recommendation === 'strong_provider') {
      reasoning.push('Provider submitted stronger evidence');
      confidence = evidenceEval.providerEvidenceStrength;
    } else if (evidenceEval.recommendation === 'strong_consumer') {
      reasoning.push('Consumer submitted stronger evidence');
      confidence = evidenceEval.consumerEvidenceStrength;
    } else {
      reasoning.push('Evidence is inconclusive');
      confidence = 50;
    }

    // Factor 2: Original verification result
    if (verificationResult) {
      if (verificationResult.passed) {
        reasoning.push('Original verification passed');
      } else {
        reasoning.push('Original verification failed');
      }
    }

    // Determine decision
    if (evidenceEval.recommendation === 'strong_provider' && verificationResult?.passed) {
      decision = 'uphold_verification';
      confidence = Math.min(confidence + 20, 100);
    } else if (evidenceEval.recommendation === 'strong_consumer' && !verificationResult?.passed) {
      decision = 'overturn_verification';
      confidence = Math.min(confidence + 20, 100);
    } else if (evidenceEval.recommendation === 'inconclusive') {
      decision = 'insufficient_evidence';
      confidence = 30;
    } else {
      // Mixed signals - go partial
      decision = evidenceEval.providerEvidenceStrength > evidenceEval.consumerEvidenceStrength
        ? 'partial_provider_favor'
        : 'partial_consumer_favor';
      confidence = 60;
    }

    // Calculate token split
    const tokenSplit = this.calculateTokenSplit(decision, confidence);

    return {
      decision,
      confidence,
      reasoning,
      tokenSplit
    };
  }

  assignArbitrator(dispute: Dispute): ArbitratorAssignment {
    const evidenceEval = this.evaluateEvidence(dispute);
    const complexity = this.assessComplexity(dispute, evidenceEval);

    // Simple cases with strong evidence can be automated
    if (complexity === 'low' && evidenceEval.recommendation !== 'inconclusive') {
      return {
        arbitratorId: 'automated_oracle',
        arbitratorType: 'automated',
        expertise: ['automated_verification'],
        estimatedResolutionTime: Duration.fromMinutes(5)
      };
    }

    // Medium complexity - assign human arbitrator
    if (complexity === 'medium') {
      return {
        arbitratorId: this.selectHumanArbitrator(dispute, ['general']),
        arbitratorType: 'human',
        expertise: ['general_dispute_resolution'],
        estimatedResolutionTime: Duration.fromDays(1)
      };
    }

    // High complexity or DAO governance enabled
    if (this.isDAOGovernanceEnabled()) {
      return {
        arbitratorId: 'dao_vote',
        arbitratorType: 'dao',
        expertise: ['community_governance'],
        estimatedResolutionTime: Duration.fromDays(3)
      };
    }

    // High complexity - assign expert human
    return {
      arbitratorId: this.selectHumanArbitrator(dispute, ['expert', 'technical']),
      arbitratorType: 'human',
      expertise: ['technical_analysis', 'expert_evaluation'],
      estimatedResolutionTime: Duration.fromDays(2)
    };
  }

  validateDecision(
    decision: DisputeResolution,
    dispute: Dispute
  ): DecisionValidation {
    const issues: string[] = [];
    let consistencyScore = 100;

    // Check 1: Decision must have reasoning
    if (!decision.reasoning || decision.reasoning.length === 0) {
      issues.push('Decision lacks reasoning');
      consistencyScore -= 30;
    }

    // Check 2: Token split must sum to 100%
    const totalSplit = decision.newSettlementOutcome.tokensToProvider.getValue() +
                      decision.newSettlementOutcome.tokensToConsumer.getValue() +
                      decision.newSettlementOutcome.tokensSlashed.getValue();

    const escrowAmount = this.getEscrowAmount(dispute.promiseId);
    if (Math.abs(totalSplit - escrowAmount.getValue()) > 0.01) {
      issues.push('Token distribution does not sum to escrow amount');
      consistencyScore -= 40;
    }

    // Check 3: Decision must be consistent with evidence
    const evidenceEval = this.evaluateEvidence(dispute);
    if (decision.decision === 'uphold_verification' &&
        evidenceEval.recommendation === 'strong_consumer') {
      issues.push('Decision contradicts evidence evaluation');
      consistencyScore -= 25;
    }

    // Check 4: Timing constraints
    const disputeDuration = this.calculateDisputeDuration(dispute);
    if (disputeDuration.toDays() > 7 && decision.decision === 'insufficient_evidence') {
      issues.push('Dispute exceeded reasonable timeframe for inconclusive decision');
      consistencyScore -= 15;
    }

    return {
      valid: issues.length === 0,
      issues,
      consistencyScore: Math.max(consistencyScore, 0)
    };
  }

  calculateDistribution(
    outcome: DisputeOutcome,
    escrowAmount: TokenAmount
  ): TokenDistribution {
    let toProvider: TokenAmount;
    let toConsumer: TokenAmount;
    let toPlatform = TokenAmount.zero();
    let slashAmount = TokenAmount.zero();

    switch (outcome.decision) {
      case 'uphold_verification':
        // Provider wins - gets payment minus platform fee
        toProvider = escrowAmount.multiply(0.975); // 2.5% platform fee
        toConsumer = TokenAmount.zero();
        toPlatform = escrowAmount.multiply(0.025);
        break;

      case 'overturn_verification':
        // Consumer wins - gets refund minus small fee
        toProvider = TokenAmount.zero();
        toConsumer = escrowAmount.multiply(0.975);
        toPlatform = escrowAmount.multiply(0.025);
        slashAmount = outcome.stakeAmount || TokenAmount.zero();
        break;

      case 'partial_provider_favor':
        // 70% to provider, 30% to consumer
        toProvider = escrowAmount.multiply(0.70);
        toConsumer = escrowAmount.multiply(0.30);
        toPlatform = escrowAmount.multiply(0.025);
        // Adjust for platform fee
        toProvider = toProvider.subtract(toPlatform.multiply(0.7));
        toConsumer = toConsumer.subtract(toPlatform.multiply(0.3));
        break;

      case 'partial_consumer_favor':
        // 30% to provider, 70% to consumer
        toProvider = escrowAmount.multiply(0.30);
        toConsumer = escrowAmount.multiply(0.70);
        toPlatform = escrowAmount.multiply(0.025);
        toProvider = toProvider.subtract(toPlatform.multiply(0.3));
        toConsumer = toConsumer.subtract(toPlatform.multiply(0.7));
        break;

      case 'insufficient_evidence':
        // Split 50/50 minus fees
        toProvider = escrowAmount.multiply(0.50);
        toConsumer = escrowAmount.multiply(0.50);
        toPlatform = escrowAmount.multiply(0.025);
        toProvider = toProvider.subtract(toPlatform.multiply(0.5));
        toConsumer = toConsumer.subtract(toPlatform.multiply(0.5));
        break;

      default:
        toProvider = TokenAmount.zero();
        toConsumer = escrowAmount;
    }

    return {
      toProvider,
      toConsumer,
      toPlatform,
      slashAmount
    };
  }

  private calculateEvidenceStrength(evidence: Evidence[]): number {
    if (evidence.length === 0) {
      return 0;
    }

    let totalScore = 0;
    for (const item of evidence) {
      totalScore += this.scoreEvidence(item);
    }

    // Bonus for diversity of evidence types
    const uniqueTypes = new Set(evidence.map(e => e.contentType)).size;
    const diversityBonus = uniqueTypes * 5;

    return Math.min(totalScore + diversityBonus, 100);
  }

  private scoreEvidence(evidence: Evidence): number {
    const baseWeight = DisputeResolutionServiceImpl.EVIDENCE_WEIGHTS[evidence.contentType] || 10;

    // Quality factors
    let qualityMultiplier = 1.0;

    // Detailed evidence gets bonus
    if (evidence.content.length > 500) {
      qualityMultiplier += 0.2;
    }

    // Recent evidence is better
    const age = (Timestamp.now().toDate().getTime() - evidence.submittedAt.toDate().getTime())
      / (1000 * 60 * 60); // Hours
    if (age < 1) {
      qualityMultiplier += 0.1; // Submitted within hour
    }

    return Math.round(baseWeight * qualityMultiplier);
  }

  private identifyEvidenceGaps(
    dispute: Dispute,
    providerEvidence: Evidence[],
    consumerEvidence: Evidence[]
  ): string[] {
    const gaps: string[] = [];

    if (providerEvidence.length === 0) {
      gaps.push('Provider has not submitted any evidence');
    }

    if (consumerEvidence.length === 0) {
      gaps.push('Consumer has not submitted any evidence');
    }

    // Check for specific evidence types
    const hasApiLogs = dispute.evidence.some(e => e.contentType === 'log');
    if (!hasApiLogs) {
      gaps.push('No API logs provided');
    }

    const hasExecutionProof = dispute.evidence.some(e => e.contentType === 'api_response');
    if (!hasExecutionProof) {
      gaps.push('No execution proof provided');
    }

    return gaps;
  }

  private calculateTokenSplit(
    decision: DisputeDecision,
    confidence: number
  ): { provider: number; consumer: number } {
    switch (decision) {
      case 'uphold_verification':
        return { provider: 97.5, consumer: 0 };
      case 'overturn_verification':
        return { provider: 0, consumer: 97.5 };
      case 'partial_provider_favor':
        return { provider: 70, consumer: 30 };
      case 'partial_consumer_favor':
        return { provider: 30, consumer: 70 };
      case 'insufficient_evidence':
        return { provider: 50, consumer: 50 };
      default:
        return { provider: 50, consumer: 50 };
    }
  }

  private assessComplexity(
    dispute: Dispute,
    evidenceEval: EvidenceEvaluation
  ): 'low' | 'medium' | 'high' {
    let complexityScore = 0;

    // Evidence volume
    complexityScore += dispute.evidence.length * 5;

    // Evidence conflict
    if (evidenceEval.recommendation === 'inconclusive') {
      complexityScore += 30;
    }

    // Technical complexity
    const hasTechnicalEvidence = dispute.evidence.some(e =>
      e.contentType === 'log' || e.contentType === 'api_response'
    );
    if (hasTechnicalEvidence) {
      complexityScore += 20;
    }

    if (complexityScore < 30) return 'low';
    if (complexityScore < 60) return 'medium';
    return 'high';
  }

  private selectHumanArbitrator(
    dispute: Dispute,
    expertise: string[]
  ): string {
    // Simplified - would query arbitrator pool
    return `arbitrator_${expertise.join('_')}_${Date.now()}`;
  }

  private isDAOGovernanceEnabled(): boolean {
    // Check feature flag or configuration
    return false; // Simplified
  }

  private getEscrowAmount(promiseId: PromiseId): TokenAmount {
    // Simplified - would query escrow repository
    return new TokenAmount(100);
  }

  private calculateDisputeDuration(dispute: Dispute): Duration {
    const now = Timestamp.now();
    const diff = now.toDate().getTime() - dispute.raisedAt.toDate().getTime();
    return new Duration(diff);
  }
}
```

**Evidence Scoring**:
- API logs: 40 points
- Execution proof: 35 points
- Third-party verification: 30 points
- Screenshots: 20 points
- Text description: 10 points
- Diversity bonus: +5 per unique type

**Decision Matrix**:

| Evidence | Verification | Decision | Confidence |
|----------|-------------|----------|------------|
| Strong Provider | Passed | Uphold | High |
| Strong Consumer | Failed | Overturn | High |
| Inconclusive | Any | Insufficient | Low |
| Mixed | Any | Partial | Medium |

**Related**: See [UC-032: Resolve Dispute](./07-use-cases.md#uc-032-resolve-dispute)

---

### OracleAggregationService

**Purpose**: Aggregates verification results from multiple oracle sources to reach consensus on execution proof validity.

**Why a Service?**: Oracle aggregation involves coordinating multiple external verification sources and computing consensus.

```typescript
interface OracleAggregationService {
  /**
   * Submit verification result from an oracle
   * @param promiseId - Promise being verified
   * @param oracleId - ID of the verifying oracle
   * @param result - Verification result
   */
  submitOracleResult(
    promiseId: PromiseId,
    oracleId: string,
    result: OracleVerificationResult
  ): void;

  /**
   * Calculate consensus from submitted oracle results
   * @param promiseId - Promise to check consensus for
   * @returns Consensus result
   */
  calculateConsensus(promiseId: PromiseId): ConsensusResult;

  /**
   * Determine if sufficient oracle results have been collected
   * @param promiseId - Promise to check
   * @returns Whether consensus can be calculated
   */
  hasSufficientOracles(promiseId: PromiseId): boolean;

  /**
   * Get aggregated verification report
   * @param promiseId - Promise to report on
   * @returns Detailed verification report
   */
  getVerificationReport(promiseId: PromiseId): VerificationReport;

  /**
   * Calculate oracle reputation based on accuracy
   * @param oracleId - Oracle to evaluate
   * @returns Oracle reputation score
   */
  calculateOracleReputation(oracleId: string): OracleReputation;
}

interface OracleVerificationResult {
  passed: boolean;
  checks: OracleCheck[];
  confidence: number; // 0-100
  timestamp: Timestamp;
  metadata: Record<string, any>;
}

interface OracleCheck {
  name: string;
  passed: boolean;
  details: string;
  weight: number; // Importance of this check
}

interface ConsensusResult {
  consensusReached: boolean;
  finalDecision: 'verified' | 'rejected' | 'inconclusive';
  confidence: number; // 0-100
  participatingOracles: string[];
  agreementRatio: number; // % of oracles agreeing
  checkBreakdown: ConsensusCheck[];
}

interface ConsensusCheck {
  checkName: string;
  passRate: number; // % of oracles that passed this check
  consensus: 'strong_pass' | 'pass' | 'inconclusive' | 'fail' | 'strong_fail';
}

interface VerificationReport {
  promiseId: PromiseId;
  consensusResult: ConsensusResult;
  oracleResults: Map<string, OracleVerificationResult>;
  executionMetadata: ExecutionMetadata;
  riskAssessment: RiskAssessment;
}

interface OracleReputation {
  oracleId: string;
  accuracy: number; // 0-100
  totalVerifications: number;
  correctVerifications: number;
  stake: TokenAmount;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

class OracleAggregationServiceImpl implements OracleAggregationService {
  // Configuration
  private static readonly MIN_ORACLES = 3;
  private static readonly CONSENSUS_THRESHOLD = 0.67; // 67% agreement required
  private static readonly MIN_CONFIDENCE = 70;

  // Oracle results storage (in real implementation, this would be persistent)
  private oracleResults = new Map<PromiseId, Map<string, OracleVerificationResult>>();

  constructor(
    private oracleRepository: OracleRepository,
    private reputationService: ReputationCalculationService
  ) {}

  submitOracleResult(
    promiseId: PromiseId,
    oracleId: string,
    result: OracleVerificationResult
  ): void {
    // Validate oracle is authorized
    if (!this.isAuthorizedOracle(oracleId)) {
      throw new Error(`Oracle ${oracleId} is not authorized`);
    }

    // Store result
    if (!this.oracleResults.has(promiseId)) {
      this.oracleResults.set(promiseId, new Map());
    }

    const promiseResults = this.oracleResults.get(promiseId)!;

    // Check for duplicate submission
    if (promiseResults.has(oracleId)) {
      throw new Error(`Oracle ${oracleId} has already submitted for promise ${promiseId}`);
    }

    promiseResults.set(oracleId, result);

    // Update oracle reputation (preliminary)
    this.updateOracleStats(oracleId, result);
  }

  calculateConsensus(promiseId: PromiseId): ConsensusResult {
    const results = this.oracleResults.get(promiseId);

    if (!results || results.size === 0) {
      return {
        consensusReached: false,
        finalDecision: 'inconclusive',
        confidence: 0,
        participatingOracles: [],
        agreementRatio: 0,
        checkBreakdown: []
      };
    }

    const oracleArray = Array.from(results.entries());
    const participatingOracles = oracleArray.map(([id]) => id);

    // Count passes and fails
    let passCount = 0;
    let failCount = 0;
    let totalConfidence = 0;

    for (const [, result] of oracleArray) {
      if (result.passed) {
        passCount++;
      } else {
        failCount++;
      }
      totalConfidence += result.confidence;
    }

    const total = oracleArray.length;
    const passRate = passCount / total;
    const averageConfidence = totalConfidence / total;

    // Determine consensus
    let finalDecision: ConsensusResult['finalDecision'];
    let consensusReached: boolean;

    if (passRate >= OracleAggregationServiceImpl.CONSENSUS_THRESHOLD) {
      finalDecision = 'verified';
      consensusReached = averageConfidence >= OracleAggregationServiceImpl.MIN_CONFIDENCE;
    } else if (passRate <= (1 - OracleAggregationServiceImpl.CONSENSUS_THRESHOLD)) {
      finalDecision = 'rejected';
      consensusReached = averageConfidence >= OracleAggregationServiceImpl.MIN_CONFIDENCE;
    } else {
      finalDecision = 'inconclusive';
      consensusReached = false;
    }

    // Calculate check-level consensus
    const checkBreakdown = this.calculateCheckConsensus(oracleArray);

    return {
      consensusReached,
      finalDecision,
      confidence: averageConfidence,
      participatingOracles,
      agreementRatio: Math.max(passRate, 1 - passRate),
      checkBreakdown
    };
  }

  hasSufficientOracles(promiseId: PromiseId): boolean {
    const results = this.oracleResults.get(promiseId);

    if (!results) {
      return false;
    }

    // Need minimum number of oracles
    if (results.size < OracleAggregationServiceImpl.MIN_ORACLES) {
      return false;
    }

    // Need diversity of oracle types
    const oracleTypes = new Set<string>();
    for (const [oracleId] of results) {
      const oracle = this.oracleRepository.findById(oracleId);
      oracleTypes.add(oracle.type);
    }

    // Need at least 2 different oracle types
    return oracleTypes.size >= 2;
  }

  getVerificationReport(promiseId: PromiseId): VerificationReport {
    const consensus = this.calculateConsensus(promiseId);
    const results = this.oracleResults.get(promiseId) || new Map();

    // Calculate risk assessment
    const riskAssessment = this.assessRisk(consensus, results);

    return {
      promiseId,
      consensusResult: consensus,
      oracleResults: results,
      executionMetadata: this.extractExecutionMetadata(results),
      riskAssessment
    };
  }

  calculateOracleReputation(oracleId: string): OracleReputation {
    const oracle = this.oracleRepository.findById(oracleId);
    const stats = oracle.verificationStats;

    const accuracy = stats.totalVerifications > 0
      ? (stats.correctVerifications / stats.totalVerifications) * 100
      : 0;

    // Determine tier based on accuracy and volume
    let tier: OracleReputation['tier'];
    if (accuracy >= 95 && stats.totalVerifications >= 100) {
      tier = 'platinum';
    } else if (accuracy >= 90 && stats.totalVerifications >= 50) {
      tier = 'gold';
    } else if (accuracy >= 80 && stats.totalVerifications >= 20) {
      tier = 'silver';
    } else {
      tier = 'bronze';
    }

    return {
      oracleId,
      accuracy,
      totalVerifications: stats.totalVerifications,
      correctVerifications: stats.correctVerifications,
      stake: oracle.stake,
      tier
    };
  }

  private isAuthorizedOracle(oracleId: string): boolean {
    const oracle = this.oracleRepository.findById(oracleId);
    return oracle?.isActive && oracle.stake.getValue() >= 1000; // Min 1000 tokens staked
  }

  private updateOracleStats(
    oracleId: string,
    result: OracleVerificationResult
  ): void {
    const oracle = this.oracleRepository.findById(oracleId);
    oracle.verificationStats.totalVerifications++;
    // Note: Correctness will be updated after dispute resolution
    this.oracleRepository.save(oracle);
  }

  private calculateCheckConsensus(
    oracleArray: [string, OracleVerificationResult][]
  ): ConsensusCheck[] {
    // Aggregate all checks
    const checkResults = new Map<string, { passes: number; total: number }>();

    for (const [, result] of oracleArray) {
      for (const check of result.checks) {
        const current = checkResults.get(check.name) || { passes: 0, total: 0 };
        current.total++;
        if (check.passed) {
          current.passes++;
        }
        checkResults.set(check.name, current);
      }
    }

    // Calculate consensus for each check
    return Array.from(checkResults.entries()).map(([name, stats]) => {
      const passRate = stats.passes / stats.total;

      let consensus: ConsensusCheck['consensus'];
      if (passRate >= 0.9) consensus = 'strong_pass';
      else if (passRate >= 0.7) consensus = 'pass';
      else if (passRate >= 0.5) consensus = 'inconclusive';
      else if (passRate >= 0.3) consensus = 'fail';
      else consensus = 'strong_fail';

      return {
        checkName: name,
        passRate,
        consensus
      };
    });
  }

  private assessRisk(
    consensus: ConsensusResult,
    results: Map<string, OracleVerificationResult>
  ): RiskAssessment {
    let riskLevel: 'low' | 'medium' | 'high';
    const factors: string[] = [];

    if (!consensus.consensusReached) {
      riskLevel = 'high';
      factors.push('No consensus reached among oracles');
    } else if (consensus.confidence < 80) {
      riskLevel = 'medium';
      factors.push('Low confidence in verification');
    } else {
      riskLevel = 'low';
    }

    // Check for outlier oracles
    const outlierCount = this.countOutlierOracles(results, consensus.finalDecision);
    if (outlierCount > 0) {
      factors.push(`${outlierCount} oracles disagreed with consensus`);
      if (riskLevel === 'low') {
        riskLevel = 'medium';
      }
    }

    return {
      level: riskLevel,
      factors,
      recommendation: riskLevel === 'high'
        ? 'manual_review'
        : riskLevel === 'medium'
        ? 'proceed_with_caution'
        : 'proceed'
    };
  }

  private countOutlierOracles(
    results: Map<string, OracleVerificationResult>,
    consensus: ConsensusResult['finalDecision']
  ): number {
    let outlierCount = 0;

    for (const [, result] of results) {
      const expectedPass = consensus === 'verified';
      if (result.passed !== expectedPass) {
        outlierCount++;
      }
    }

    return outlierCount;
  }

  private extractExecutionMetadata(
    results: Map<string, OracleVerificationResult>
  ): ExecutionMetadata {
    // Extract and aggregate metadata from all oracle results
    const allMetadata: Record<string, any>[] = [];

    for (const [, result] of results) {
      allMetadata.push(result.metadata);
    }

    // Simplified - would aggregate properly
    return {
      averageLatency: 0,
      tokenUsage: { input: 0, output: 0 },
      modelVersion: 'unknown',
      timestamp: Timestamp.now()
    };
  }
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  factors: string[];
  recommendation: 'proceed' | 'proceed_with_caution' | 'manual_review';
}

interface ExecutionMetadata {
  averageLatency: number;
  tokenUsage: { input: number; output: number };
  modelVersion: string;
  timestamp: Timestamp;
}
```

**Consensus Algorithm**:
1. Collect results from minimum 3 oracles
2. Require at least 2 different oracle types
3. Calculate pass rate across all oracles
4. Consensus reached if:
   - ≥67% agree on pass/fail
   - Average confidence ≥70%
5. Check-level consensus for detailed reporting

**Oracle Tiers**:
- Platinum: 95%+ accuracy, 100+ verifications
- Gold: 90%+ accuracy, 50+ verifications
- Silver: 80%+ accuracy, 20+ verifications
- Bronze: `<80%` accuracy or `<20` verifications

**Related ADR**: [ADR-007: Hybrid Settlement](../adr/ADR-007-hybrid-settlement.md)

---

## Cross-Context Services

### Integration Patterns

Domain services often need to coordinate across bounded contexts. Here are the patterns used:

#### 1. Domain Event Coordination

```typescript
class CrossContextCoordinationService {
  constructor(
    private eventPublisher: EventPublisher,
    private promiseRepo: PromiseRepository,
    private walletRepo: WalletRepository,
    private botRepo: BotRepository
  ) {}

  async handlePromiseAccepted(event: PromiseAccepted): Promise<void> {
    // 1. Token Management context: Create escrow
    const consumerWallet = await this.walletRepo.findByBotId(event.data.consumerBotId);
    const promise = await this.promiseRepo.findById(event.data.promiseId);

    // 2. Create escrow (Token Management concern)
    await this.createEscrow(consumerWallet, promise);

    // 3. Update promise state (Promise Market concern)
    promise.accept(event.data.consumerBotId);
    await this.promiseRepo.save(promise);

    // 4. Publish event for other contexts
    await this.eventPublisher.publish(new TokensEscrowed({
      promiseId: event.data.promiseId,
      consumerBotId: event.data.consumerBotId,
      amount: promise.pricingTerms.price
    }));
  }

  private async createEscrow(
    wallet: Wallet,
    promise: Promise
  ): Promise<void> {
    // Escrow creation logic
    wallet.lock(promise.pricingTerms.price, `escrow_${promise.promiseId}`);
    await this.walletRepo.save(wallet);
  }
}
```

#### 2. Anti-Corruption Layer

```typescript
// Token Management's view of Bot Identity
interface BotIdentityACL {
  getBotId(): BotId;
  isVerified(): boolean;
  getReputation(): ReputationScore;
}

class BotIdentityACLImpl implements BotIdentityACL {
  constructor(private botAccount: BotAccount) {}

  getBotId(): BotId {
    return this.botAccount.botId;
  }

  isVerified(): boolean {
    return this.botAccount.verificationStatus === 'verified';
  }

  getReputation(): ReputationScore {
    return this.botAccount.reputationScore;
  }

  // Intentionally hides other BotAccount details
  // Token Management doesn't need to know about API keys, etc.
}
```

#### 3. Shared Kernel

```typescript
// Shared between Promise Market and Token Management
interface EscrowCommand {
  promiseId: PromiseId;
  consumerBotId: BotId;
  providerBotId: BotId;
  amount: TokenAmount;
}

// Used by both contexts - maintained as shared kernel
class EscrowService {
  async createEscrow(command: EscrowCommand): Promise<EscrowAccount> {
    // Implementation used by both contexts
  }
}
```

---

## Service Interfaces

### Port/Adapter Pattern

Domain services define ports (interfaces) that are implemented by adapters in the infrastructure layer:

```typescript
// Domain Layer - Port (Interface)
// src/promiseMarket/domain/ports/PricingService.ts

export interface PricingService {
  calculateRecommendedPrice(
    specification: PromiseSpecification,
    providerReputation: ReputationScore,
    marketConditions: MarketConditions
  ): PricingTerms;

  calculateMinimumStake(
    price: TokenAmount,
    providerReputation: ReputationScore
  ): TokenAmount;
}

// Infrastructure Layer - Adapter (Implementation)
// src/promiseMarket/infrastructure/adapters/PricingServiceAdapter.ts

export class PricingServiceAdapter implements PricingService {
  constructor(
    private marketDataRepo: MarketDataRepository,
    private config: PricingConfig
  ) {}

  calculateRecommendedPrice(
    specification: PromiseSpecification,
    providerReputation: ReputationScore,
    marketConditions: MarketConditions
  ): PricingTerms {
    // Implementation with infrastructure dependencies
    const baseCost = this.config.getBaseCost(specification.modelName);
    // ...
  }

  // ... other methods
}
```

### Dependency Injection

```typescript
// Application Service wiring domain services
export class PromiseCreationApplicationService {
  constructor(
    private pricingService: PricingService, // Port
    private promiseRepository: PromiseRepository,
    private eventPublisher: EventPublisher
  ) {}

  async createPromise(
    providerBotId: BotId,
    specification: PromiseSpecification
  ): Promise<Promise> {
    // Use pricing service (injected)
    const pricing = this.pricingService.calculateRecommendedPrice(
      specification,
      provider.reputationScore,
      marketConditions
    );

    // Create promise with calculated pricing
    const promise = Promise.create(providerBotId, specification, pricing);
    await this.promiseRepository.save(promise);

    return promise;
  }
}
```

---

## Testing Strategies

### Unit Testing Domain Services

Domain services should be tested in isolation without infrastructure dependencies:

```typescript
import { describe, it, expect } from 'bun:test';
import { PricingServiceImpl } from './PricingServiceImpl';
import { TokenAmount } from '../../shared/domain/value-objects/TokenAmount';
import { ReputationScore } from '../../shared/domain/value-objects/ReputationScore';

describe('PricingService', () => {
  let service: PricingServiceImpl;

  beforeEach(() => {
    service = new PricingServiceImpl();
  });

  describe('calculateRecommendedPrice', () => {
    it('should calculate base price from model and tokens', () => {
      const spec = {
        modelName: new ModelName('chatgpt-4'),
        tokenCount: 4000,
        responseTimeSLA: Duration.fromSeconds(30)
      };
      const reputation = new ReputationScore(500);
      const marketConditions = {
        averagePriceForModel: new Map(),
        demandSupplyRatio: 1.0,
        recentTransactionVolume: 100
      };

      const pricing = service.calculateRecommendedPrice(
        spec,
        reputation,
        marketConditions
      );

      // chatgpt-4 = $3 per 1K tokens
      // 4000 tokens = $12 base
      expect(pricing.price.getValue()).toBe(12.0);
    });

    it('should apply reputation premium for expert providers', () => {
      const spec = {
        modelName: new ModelName('chatgpt-4'),
        tokenCount: 1000,
        responseTimeSLA: Duration.fromSeconds(30)
      };
      const expertReputation = new ReputationScore(850); // Expert tier
      const marketConditions = {
        averagePriceForModel: new Map(),
        demandSupplyRatio: 1.0,
        recentTransactionVolume: 100
      };

      const pricing = service.calculateRecommendedPrice(
        spec,
        expertReputation,
        marketConditions
      );

      // Base: $3, Expert premium: 20% = $3.60
      expect(pricing.price.getValue()).toBe(3.6);
    });

    it('should apply market adjustment for high demand', () => {
      const spec = {
        modelName: new ModelName('chatgpt-4'),
        tokenCount: 1000,
        responseTimeSLA: Duration.fromSeconds(30)
      };
      const reputation = new ReputationScore(500);
      const highDemandMarket = {
        averagePriceForModel: new Map(),
        demandSupplyRatio: 1.6, // High demand
        recentTransactionVolume: 100
      };

      const pricing = service.calculateRecommendedPrice(
        spec,
        reputation,
        highDemandMarket
      );

      // Base: $3, High demand: +20% = $3.60
      expect(pricing.price.getValue()).toBe(3.6);
    });
  });

  describe('calculateMinimumStake', () => {
    it('should require 10% stake for intermediate reputation', () => {
      const price = new TokenAmount(100);
      const reputation = new ReputationScore(400); // Intermediate

      const stake = service.calculateMinimumStake(price, reputation);

      expect(stake.getValue()).toBe(10); // 10% of 100
    });

    it('should require lower stake for expert providers', () => {
      const price = new TokenAmount(100);
      const expertReputation = new ReputationScore(850); // Expert

      const stake = service.calculateMinimumStake(price, expertReputation);

      expect(stake.getValue()).toBe(5); // 5% of 100
    });

    it('should require higher stake for untrusted providers', () => {
      const price = new TokenAmount(100);
      const untrustedReputation = new ReputationScore(50); // Untrusted

      const stake = service.calculateMinimumStake(price, untrustedReputation);

      expect(stake.getValue()).toBe(15); // 15% of 100
    });

    it('should enforce minimum absolute stake of 100 tokens', () => {
      const lowPrice = new TokenAmount(50);
      const reputation = new ReputationScore(500);

      const stake = service.calculateMinimumStake(lowPrice, reputation);

      expect(stake.getValue()).toBe(100); // Minimum enforced
    });
  });
});
```

### Property-Based Testing

```typescript
import { describe, it, expect } from 'bun:test';
import { ReputationCalculationServiceImpl } from './ReputationCalculationServiceImpl';

describe('ReputationCalculationService - Property Tests', () => {
  const service = new ReputationCalculationServiceImpl();

  it('should always return score between 0 and 1000', () => {
    // Test with random inputs
    for (let i = 0; i < 100; i++) {
      const currentScore = new ReputationScore(Math.floor(Math.random() * 1000));
      const delta = Math.floor(Math.random() * 200) - 100; // -100 to +100

      const newScore = service.applyDelta(currentScore, delta);

      expect(newScore.getValue()).toBeGreaterThanOrEqual(0);
      expect(newScore.getValue()).toBeLessThanOrEqual(1000);
    }
  });

  it('should be monotonic - positive delta increases score', () => {
    const score = new ReputationScore(500);

    const higherScore = service.applyDelta(score, 10);
    const lowerScore = service.applyDelta(score, -10);

    expect(higherScore.getValue()).toBeGreaterThanOrEqual(score.getValue());
    expect(lowerScore.getValue()).toBeLessThanOrEqual(score.getValue());
  });
});
```

### Integration Testing

```typescript
import { describe, it, expect, beforeAll } from 'bun:test';
import { PromiseMatchingServiceImpl } from './PromiseMatchingServiceImpl';
import { InMemoryPromiseRepository } from '../infrastructure/repositories/InMemoryPromiseRepository';

describe('PromiseMatchingService Integration', () => {
  let service: PromiseMatchingServiceImpl;
  let repository: InMemoryPromiseRepository;

  beforeAll(() => {
    repository = new InMemoryPromiseRepository();
    service = new PromiseMatchingServiceImpl(repository);
  });

  it('should find compatible promises for a request', async () => {
    // Seed repository with test data
    await repository.save(createTestPromise({
      modelName: 'chatgpt-4',
      tokenCount: 4000,
      price: 15
    }));

    await repository.save(createTestPromise({
      modelName: 'claude-opus-4.5',
      tokenCount: 8000,
      price: 50
    }));

    const request = createTestRequest({
      modelName: 'chatgpt-4',
      tokenCount: 2000,
      maxPrice: 20
    });

    const matches = service.findMatches(request, await repository.findAll());

    expect(matches).toHaveLength(1);
    expect(matches[0].promise.specification.modelName.getValue()).toBe('chatgpt-4');
    expect(matches[0].score.value).toBeGreaterThan(60);
  });
});
```

### BDD Test Alignment

Domain services map directly to BDD scenario steps:

```gherkin
# Feature: Promise Pricing
Feature: Promise Pricing

  Scenario: Expert provider gets pricing premium
    Given a provider with reputation score 850
    When they create a promise for "chatgpt-4" with 1000 tokens
    Then the recommended price should be 20% above base cost

  Scenario: Untrusted provider must discount
    Given a provider with reputation score 50
    When they create a promise for "chatgpt-4" with 1000 tokens
    Then the recommended price should be 10% below base cost
```

```typescript
// Step definitions
Given('a provider with reputation score {int}', (score: number) => {
  context.providerReputation = new ReputationScore(score);
});

When('they create a promise for {string} with {int} tokens', (model: string, tokens: number) => {
  const spec = {
    modelName: new ModelName(model),
    tokenCount: tokens,
    responseTimeSLA: Duration.fromSeconds(30)
  };

  context.pricing = pricingService.calculateRecommendedPrice(
    spec,
    context.providerReputation,
    defaultMarketConditions
  );
});

Then('the recommended price should be {int}% above base cost', (percentage: number) => {
  const baseCost = 3.0; // chatgpt-4 base
  const expectedMultiplier = 1 + (percentage / 100);
  const expectedPrice = baseCost * expectedMultiplier;

  expect(context.pricing.price.getValue()).toBeCloseTo(expectedPrice, 2);
});
```

---

## Service Registry

| Service | Context | Responsibility | Complexity |
|---------|---------|---------------|------------|
| ReputationCalculationService | BotIdentity | Calculate reputation changes | Medium |
| VerificationService | BotIdentity | Validate bot identity | Medium |
| PromiseMatchingService | PromiseMarket | Match supply with demand | High |
| PricingService | PromiseMarket | Calculate optimal pricing | High |
| RecommendationService | PromiseMarket | Personalized recommendations | High |
| FeeCalculationService | TokenManagement | Calculate all fees | Medium |
| StakingRewardsService | TokenManagement | Calculate staking rewards | Medium |
| DisputeResolutionService | Settlement | Resolve disputes | High |
| OracleAggregationService | Settlement | Aggregate oracle consensus | High |

---

## Related Documentation

### DDD
- [Aggregates & Entities](./04-aggregates-entities.md) - Domain objects that services operate on
- [Value Objects](./05-value-objects.md) - Immutable domain primitives
- [Domain Events](./06-domain-events.md) - Events services publish and subscribe to
- [Use Cases](./07-use-cases.md) - How services support user goals
- [Bounded Contexts](./02-bounded-contexts.md) - Context boundaries for services

### Architecture
- [ADR-006: Aggregates](../adr/ADR-006-aggregates.md) - Aggregate design decisions
- [ADR-010: Stake Requirements](../adr/ADR-010-stake-requirements.md) - Staking business rules
- [ADR-011: Order Book](../adr/ADR-011-order-book.md) - Matching engine design
- [ADR-016: Convex Application Services](../adr/ADR-016-convex-application-services.md) - Service implementation

### BDD Testing
- [BDD Overview](../bdd/bdd-overview) - Testing approach
- [Feature Index](../bdd/feature-index) - Test scenarios covering services

---

**Next**: [Architecture Decisions](./09-architecture-decisions.md)
