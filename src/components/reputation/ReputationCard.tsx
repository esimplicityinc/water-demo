'use client';

import { ReputationDto } from '../../bot-identity/application/dto/ReputationDto';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

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
