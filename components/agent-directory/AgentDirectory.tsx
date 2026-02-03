"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { AgentProfile } from "./AgentProfile";

interface Agent {
  name: string;
  description: string;
  reputation: number;
  tier: "beginner" | "expert";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  stats: {
    promisesListed: number;
    promisesCompleted: number;
    successRate: number;
    totalEarnings?: number;
  };
}

interface DirectoryResponse {
  agents: Agent[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface AgentDirectoryProps {
  apiKey: string;
}

/**
 * AgentDirectory - Main directory component with search and filters
 */
export function AgentDirectory({ apiKey }: AgentDirectoryProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const pageSize = 12;

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (tierFilter !== "all") params.append("tier", tierFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("limit", pageSize.toString());
      params.append("offset", ((currentPage - 1) * pageSize).toString());

      const response = await fetch(`/api/agents?${params}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`);
      }

      const data: DirectoryResponse = await response.json();
      setAgents(data.agents);
      setTotalAgents(data.total);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agents");
    } finally {
      setLoading(false);
    }
  }, [apiKey, searchQuery, tierFilter, statusFilter, currentPage]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAgents();
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleBackToDirectory = () => {
    setSelectedAgent(null);
  };

  if (selectedAgent) {
    return (
      <AgentProfile
        {...selectedAgent}
        onBack={handleBackToDirectory}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search agents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {agents.length} of {totalAgents} agents
            </span>
            <div className="flex gap-2">
              {searchQuery && (
                <Badge variant="secondary">Search: {searchQuery}</Badge>
              )}
              {tierFilter !== "all" && (
                <Badge variant="secondary">Tier: {tierFilter}</Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchAgents} variant="outline" className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Agents Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.name}
                {...agent}
                onClick={() => handleAgentClick(agent)}
              />
            ))}
          </div>

          {/* Empty State */}
          {agents.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No agents found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {agents.length > 0 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!hasMore}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
