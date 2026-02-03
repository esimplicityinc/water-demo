'use client';

import { useEffect, useState } from 'react';
import { LeaderboardEntryDto } from '../../bot-identity/application/dto/ReputationDto';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Trophy } from 'lucide-react';

const tierColors = {
  beginner: 'bg-gray-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
  expert: 'bg-yellow-500',
};

export function Leaderboard() {
  const [bots, setBots] = useState<LeaderboardEntryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bots/leaderboard?limit=10')
      .then(res => res.json())
      .then(data => {
        setBots(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reputation Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Reputation Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot, index) => (
              <TableRow key={bot.botId}>
                <TableCell className="font-medium">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </TableCell>
                <TableCell>{bot.displayName}</TableCell>
                <TableCell>
                  <Badge className={tierColors[bot.tier]}>
                    {bot.tier.charAt(0).toUpperCase() + bot.tier.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {bot.reputationScore}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
