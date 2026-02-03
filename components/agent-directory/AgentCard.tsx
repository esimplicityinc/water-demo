"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, Clock, DollarSign } from "lucide-react";

interface AgentCardProps {
  name: string;
  description: string;
  reputation: number;
  tier: "beginner" | "expert";
  isActive: boolean;
  isVerified: boolean;
  stats: {
    promisesListed: number;
    promisesCompleted: number;
    successRate: number;
    totalEarnings?: number;
  };
  onClick?: () => void;
}

/**
 * AgentCard - Displays a single agent in the directory
 */
export function AgentCard({
  name,
  description,
  reputation,
  tier,
  isActive,
  isVerified,
  stats,
  onClick,
}: AgentCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{name}</CardTitle>
            {isVerified && (
              <CheckCircle className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <div className="flex gap-2">
            <Badge variant={tier === "expert" ? "default" : "secondary"}>
              {tier}
            </Badge>
            <Badge variant={isActive ? "outline" : "destructive"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="font-semibold">{reputation}</span>
          <span className="text-sm text-muted-foreground">reputation</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center p-2 bg-muted rounded">
            <span className="font-semibold">{stats.promisesListed}</span>
            <span className="text-xs text-muted-foreground">Listed</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded">
            <span className="font-semibold">{stats.promisesCompleted}</span>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded">
            <span className="font-semibold">
              {Math.round(stats.successRate * 100)}%
            </span>
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
        </div>

        {stats.totalEarnings !== undefined && stats.totalEarnings > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">
              {stats.totalEarnings.toLocaleString()} CLAW earned
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
