import { NextRequest, NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ReputationService } from "@/src/bot-identity/application/ReputationService";
import { ReputationRepositoryConvex } from "@/src/bot-identity/infrastructure/convex/ReputationRepositoryConvex";

/**
 * Database context for Convex HTTP client
 * Implements the DatabaseContext interface required by ReputationRepositoryConvex
 */
const convexHttpContext = {
  query: async (name: string, args: any): Promise<any> => {
    // Map function names to api object paths
    const pathParts = name.split(":");
    let queryApi: any = api;
    
    for (const part of pathParts) {
      queryApi = queryApi[part];
    }
    
    return await fetchQuery(queryApi, args);
  },
  
  mutation: async (_name: string, _args: any): Promise<any> => {
    // Note: Mutations from API routes would need fetchMutation
    // For now, this is a placeholder - GET endpoint doesn't need mutations
    throw new Error("Mutations not supported in GET requests");
  },
};

const repository = new ReputationRepositoryConvex(convexHttpContext);
const service = new ReputationService(repository);

/**
 * GET /api/bots/{botId}/reputation
 *
 * Returns the reputation data for a specific bot.
 *
 * @param request - The incoming request
 * @param params - Route parameters containing botId
 * @returns ReputationDto with score, tier, history, and stats
 * @example
 * Response: {
 *   "botId": "bot-123",
 *   "score": 500,
 *   "tier": "intermediate",
 *   "history": [...],
 *   "stats": {
 *     "totalPromises": 10,
 *     "successfulPromises": 8,
 *     "failedPromises": 2,
 *     "disputedWon": 1,
 *     "disputedLost": 0,
 *     "averageExecutionTime": 5000
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } },
) {
  try {
    const { botId } = await params;

    if (!botId) {
      return NextResponse.json(
        { error: "Bot ID is required" },
        { status: 400 },
      );
    }

    // Get current score from bot account via Convex query
    // For now using mock, will be from auth context later
    let currentScore = 500; // Default intermediate score

    try {
      const bot = await fetchQuery(api.botIdentity.queries.getBotById, {
        botId: botId as any,
      });
      
      if (bot && typeof bot.reputationScore === "number") {
        currentScore = bot.reputationScore;
      }
    } catch {
      // Bot not found or error fetching, use default score
      console.warn(`Could not fetch bot ${botId}, using default score`);
    }

    const reputation = await service.getReputation(botId, currentScore);

    return NextResponse.json(reputation, { status: 200 });
  } catch (error) {
    console.error("Error fetching reputation:", error);

    return NextResponse.json(
      { error: "Failed to fetch reputation" },
      { status: 500 },
    );
  }
}
