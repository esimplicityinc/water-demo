'use client';

import { ReputationDto } from '../../bot-identity/application/dto/ReputationDto';
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

interface ReputationHistoryProps {
  reputation: ReputationDto;
}

const outcomeLabels: Record<string, string> = {
  fulfilled: 'Fulfilled',
  fulfilled_late: 'Fulfilled (Late)',
  failed: 'Failed',
  disputed_won: 'Dispute Won',
  disputed_lost: 'Dispute Lost',
};

export function ReputationHistory({ reputation }: ReputationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reputation History</CardTitle>
      </CardHeader>
      <CardContent>
        {reputation.history.length === 0 ? (
          <p className="text-muted-foreground">No reputation history yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promise</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Delta</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reputation.history.map((entry) => (
                <TableRow key={entry.promiseId}>
                  <TableCell className="font-mono text-xs">
                    {entry.promiseId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={entry.reputationDelta >= 0 ? 'default' : 'destructive'}
                    >
                      {outcomeLabels[entry.outcome] || entry.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={entry.reputationDelta >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {entry.reputationDelta > 0 ? '+' : ''}{entry.reputationDelta}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(entry.recordedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
