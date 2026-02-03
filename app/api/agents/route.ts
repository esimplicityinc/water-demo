import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  AuthenticatedRequest,
} from "@/src/bot-identity/infrastructure/middleware/withAuth";
import { DirectoryQuery } from "@/src/domain/agent-directory/DirectoryQuery";
import { ListAgentsUseCase } from "@/src/application/agent-directory/ListAgentsUseCase";
import { SearchAgentsUseCase } from "@/src/application/agent-directory/SearchAgentsUseCase";
import { ConvexBotRepository } from "@/src/infrastructure/adapters/ConvexBotRepository";

/**
 * GET /api/agents
 *
 * List and search agents in the directory.
 * Supports filtering, pagination, and text search.
 *
 * Query Parameters:
 * - search: Text search on name/description (optional)
 * - tier: Filter by tier - "beginner" or "expert" (optional)
 * - status: Filter by status - "active", "inactive", or "all" (optional, default: "all")
 * - limit: Number of results per page (optional, default: 20, max: 100)
 * - offset: Pagination offset (optional, default: 0)
 * - sortBy: Sort field - "reputation", "name", "createdAt" (optional, default: "reputation")
 * - sortOrder: Sort direction - "asc" or "desc" (optional, default: "desc")
 *
 * @returns List of agents with pagination metadata
 * @example
 * Response: {
 *   "agents": [
 *     {
 *       "name": "AlphaBot",
 *       "description": "High-performance compute agent",
 *       "reputation": 850,
 *       "tier": "expert",
 *       "isActive": true,
 *       "isVerified": true,
 *       "createdAt": "2026-01-15T10:00:00Z",
 *       "stats": {
 *         "promisesListed": 42,
 *         "promisesCompleted": 38,
 *         "successRate": 0.95,
 *         "totalEarnings": 15000
 *       }
 *     }
 *   ],
 *   "total": 156,
 *   "page": 1,
 *   "pageSize": 20,
 *   "hasMore": true
 * }
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const queryParams = {
      search: url.searchParams.get("search") || undefined,
      tier: url.searchParams.get("tier") as "beginner" | "expert" | undefined,
      status: url.searchParams.get("status") as "active" | "inactive" | "all" | undefined,
      limit: url.searchParams.get("limit") || undefined,
      offset: url.searchParams.get("offset") || undefined,
      sortBy: url.searchParams.get("sortBy") as "reputation" | "name" | "createdAt" | undefined,
      sortOrder: url.searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };

    // Create domain query object
    const directoryQuery = DirectoryQuery.fromQueryParams(queryParams);

    // Create repository and use case instances
    const repository = new ConvexBotRepository();

    let result;

    // Use search use case if search query provided, otherwise list use case
    if (directoryQuery.search && directoryQuery.search.trim() !== "") {
      const searchUseCase = new SearchAgentsUseCase(repository);
      result = await searchUseCase.execute(directoryQuery);
    } else {
      const listUseCase = new ListAgentsUseCase(repository);
      result = await listUseCase.execute(directoryQuery);
    }

    // Format response
    return NextResponse.json({
      agents: result.agents.map(agent => agent.toJSON()),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      hasMore: result.hasMore,
    }, { status: 200 });
  } catch (error) {
    console.error("Error listing agents:", error);

    return NextResponse.json(
      { error: "Failed to list agents" },
      { status: 500 },
    );
  }
});
