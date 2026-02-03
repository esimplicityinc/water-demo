/**
 * DirectoryQuery - Value Object
 * 
 * Query parameters for agent directory searches.
 * Supports filtering, pagination, and text search.
 * 
 * @module domain/agent-directory
 */

export interface DirectoryQueryProps {
  search?: string;
  tier?: 'beginner' | 'expert';
  status?: 'active' | 'inactive' | 'all';
  limit: number;
  offset: number;
  sortBy: 'reputation' | 'name' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

/**
 * DirectoryQuery encapsulates search and filter criteria
 * for the agent directory.
 */
export class DirectoryQuery {
  constructor(private readonly props: DirectoryQueryProps) {}

  // Getters
  get search(): string | undefined { return this.props.search; }
  get tier(): 'beginner' | 'expert' | undefined { return this.props.tier; }
  get status(): 'active' | 'inactive' | 'all' { return this.props.status || 'all'; }
  get limit(): number { return this.props.limit; }
  get offset(): number { return this.props.offset; }
  get sortBy(): 'reputation' | 'name' | 'createdAt' { return this.props.sortBy; }
  get sortOrder(): 'asc' | 'desc' { return this.props.sortOrder; }

  /**
   * Calculate next offset for pagination
   */
  get nextOffset(): number {
    return this.props.offset + this.props.limit;
  }

  /**
   * Check if there could be more results
   */
  hasMore(total: number): boolean {
    return this.nextOffset < total;
  }

  /**
   * Create a new query with updated offset for next page
   */
  nextPage(): DirectoryQuery {
    return new DirectoryQuery({
      ...this.props,
      offset: this.nextOffset,
    });
  }

  /**
   * Create from HTTP query parameters
   */
  static fromQueryParams(params: {
    search?: string;
    tier?: string;
    status?: string;
    limit?: string;
    offset?: string;
    sortBy?: string;
    sortOrder?: string;
  }): DirectoryQuery {
    const limit = Math.min(parseInt(params.limit || '20', 10), 100); // Max 100
    const offset = Math.max(parseInt(params.offset || '0', 10), 0);
    
    let tier: 'beginner' | 'expert' | undefined;
    if (params.tier === 'beginner' || params.tier === 'expert') {
      tier = params.tier;
    }

    let status: 'active' | 'inactive' | 'all' = 'all';
    if (params.status === 'active' || params.status === 'inactive') {
      status = params.status;
    }

    let sortBy: 'reputation' | 'name' | 'createdAt' = 'reputation';
    if (params.sortBy === 'name' || params.sortBy === 'createdAt') {
      sortBy = params.sortBy;
    }

    let sortOrder: 'asc' | 'desc' = 'desc';
    if (params.sortOrder === 'asc') {
      sortOrder = 'asc';
    }

    return new DirectoryQuery({
      search: params.search,
      tier,
      status,
      limit,
      offset,
      sortBy,
      sortOrder,
    });
  }

  /**
   * Default query for initial directory load
   */
  static default(): DirectoryQuery {
    return new DirectoryQuery({
      limit: 20,
      offset: 0,
      sortBy: 'reputation',
      sortOrder: 'desc',
    });
  }
}
