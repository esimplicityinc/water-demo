/**
 * ConvexBotRepository Adapter
 * 
 * Implements BotRepository port using Convex as the persistence layer.
 * This is a driven adapter in hexagonal architecture.
 * 
 * @module infrastructure/adapters
 */

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  BotRepository,
  BotStatsRepository,
  BotData,
  ListBotsResult,
} from "@/src/domain/agent-directory/ports/BotRepository";
import { DirectoryQuery } from "@/src/domain/agent-directory/DirectoryQuery";
import { Tier } from "@/src/domain/agent-directory/value-objects/Tier";
import { BotStatsCalculator } from "@/src/domain/agent-directory/services/BotStatsCalculator";

/**
 * Convex implementation of BotRepository
 */
export class ConvexBotRepository implements BotRepository, BotStatsRepository {
  async listPublic(query: DirectoryQuery): Promise<ListBotsResult> {
    const result = await fetchQuery(api.agentDirectory.queries.listPublic, {
      limit: query.limit,
      offset: query.offset,
      tier: query.tier,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    // Transform to domain BotData format
    const bots: BotData[] = result.bots.map((bot: any) => ({
      _id: bot._id,
      name: bot.name,
      displayName: bot.name,
      description: bot.description,
      reputationScore: bot.reputation,
      verificationStatus: bot.isVerified ? 'verified' : 'unverified',
      emailVerified: bot.isActive,
      isVerified: bot.isVerified,
      isActive: bot.isActive,
      createdAt: new Date(bot.createdAt).getTime(),
      promisesListed: bot.stats?.promisesListed,
      promisesCompleted: bot.stats?.promisesCompleted,
      successRate: bot.stats?.successRate,
      totalEarnings: bot.stats?.totalEarnings,
      apiKeyHash: '', // Filtered out, never exposed
    }));

    return {
      bots,
      total: result.total,
    };
  }

  async searchPublic(query: DirectoryQuery): Promise<ListBotsResult> {
    if (!query.search) {
      return { bots: [], total: 0 };
    }

    const result = await fetchQuery(api.agentDirectory.queries.searchPublic, {
      search: query.search,
      limit: query.limit,
      offset: query.offset,
      tier: query.tier,
    });

    // Transform to domain BotData format
    const bots: BotData[] = result.bots.map((bot: any) => ({
      _id: bot._id,
      name: bot.name,
      displayName: bot.name,
      description: bot.description,
      reputationScore: bot.reputation,
      verificationStatus: bot.isVerified ? 'verified' : 'unverified',
      emailVerified: bot.isActive,
      isVerified: bot.isVerified,
      isActive: bot.isActive,
      createdAt: new Date(bot.createdAt).getTime(),
      promisesListed: bot.stats?.promisesListed,
      promisesCompleted: bot.stats?.promisesCompleted,
      successRate: bot.stats?.successRate,
      totalEarnings: bot.stats?.totalEarnings,
      apiKeyHash: '', // Filtered out, never exposed
    }));

    return {
      bots,
      total: result.total,
    };
  }

  async getByName(name: string): Promise<BotData | null> {
    const profile = await fetchQuery(
      api.agentDirectory.queries.getPublicProfileByName,
      { name }
    );

    if (!profile) {
      return null;
    }

    // Transform to domain BotData format
    return {
      _id: profile._id as string,
      name: profile.name,
      displayName: profile.name,
      description: profile.description,
      reputationScore: profile.reputation,
      verificationStatus: profile.isVerified ? 'verified' : 'unverified',
      emailVerified: profile.isActive,
      isVerified: profile.isVerified,
      isActive: profile.isActive,
      createdAt: new Date(profile.createdAt).getTime(),
      promisesListed: profile.stats?.promisesListed,
      promisesCompleted: profile.stats?.promisesCompleted,
      successRate: profile.stats?.successRate,
      totalEarnings: profile.stats?.totalEarnings,
      apiKeyHash: '', // Filtered out, never exposed
    };
  }

  async getStats(botId: string): Promise<{
    promisesListed: number;
    promisesCompleted: number;
    successRate: number;
    totalEarnings: number;
  }> {
    // Fetch promises for this bot from Convex
    const promises = await fetchQuery(api.promiseMarket.queries.getPromisesByProvider, {
      providerId: botId as any,
    });

    // Use domain service to calculate stats
    const promiseData = promises.map((p: any) => ({
      state: p.state,
      pricingTerms: p.pricingTerms,
      consumerBotId: p.consumerBotId,
    }));

    return BotStatsCalculator.calculate(promiseData);
  }
}
