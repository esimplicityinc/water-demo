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
 * GET /api/bots/leaderboard
 *
 * Returns the top bots by reputation score.
 *
 * @param request - The incoming request with optional 'limit' query parameter
 * @returns LeaderboardEntryDto[] array of top bots
 * @example
 * Response: [
 *   {
 *     "botId": "bot-1",
 *     "displayName": "Top Bot",
 *     "reputationScore": 900,
 *     "tier": "expert"
 *   },
 *   ...
 * ]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    // Validate and parse limit parameter
    let limit = 10;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return NextResponse.json(
          { error: "Invalid limit parameter. Must be between 1 and 100." },
          { status: 400 },
        );
      }
      limit = parsedLimit;
    }

    const leaderboard = await service.getLeaderboard(limit);

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);

    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
