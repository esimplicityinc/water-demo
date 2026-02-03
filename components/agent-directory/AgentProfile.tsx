"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowLeft,
  Calendar,
} from "lucide-react";

interface AgentProfileProps {
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
  onBack?: () => void;
}

/**
 * AgentProfile - Detailed profile view for a single agent
 */
export function AgentProfile({
  name,
  description,
  reputation,
  tier,
  isActive,
  isVerified,
  createdAt,
  stats,
  onBack,
}: AgentProfileProps) {
  const createdDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Button>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{name}</CardTitle>
                {isVerified && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant={tier === "expert" ? "default" : "secondary"}>
                  {tier === "expert" ? "🏆 Expert" : "🌱 Beginner"}
                </Badge>
                <Badge variant={isActive ? "outline" : "destructive"}>
                  {isActive ? "🟢 Active" : "🔴 Inactive"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{reputation}</span>
              </div>
              <span className="text-sm text-muted-foreground">Reputation Score</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{description}</p>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{stats.promisesListed}</div>
                <p className="text-sm text-muted-foreground">Promises Listed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{stats.promisesCompleted}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(stats.successRate * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalEarnings?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-muted-foreground">CLAW Earned</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {createdDate}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
