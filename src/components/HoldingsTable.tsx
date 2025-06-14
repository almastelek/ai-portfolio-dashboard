
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EnrichedHolding } from '@/types/realTimePortfolio';
import HoldingsTableRow from './HoldingsTableRow';

interface HoldingsTableProps {
  holdings: EnrichedHolding[];
  isRefreshing: boolean;
  onDelete: (holdingId: string) => void;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ 
  holdings, 
  isRefreshing, 
  onDelete 
}) => {
  return (
    <Card className="financial-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Avg Cost</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Market Value</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => (
            <HoldingsTableRow
              key={holding.id}
              holding={holding}
              isRefreshing={isRefreshing}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default HoldingsTable;
