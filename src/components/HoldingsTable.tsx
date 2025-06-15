
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import HoldingsTableRow from './HoldingsTableRow';
import { EnrichedHolding } from '@/types/realTimePortfolio';

interface HoldingsTableProps {
  holdings: EnrichedHolding[];
  isRefreshing: boolean;
  onDelete: (id: string) => void;
  onEdit?: () => void;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ 
  holdings, 
  isRefreshing, 
  onDelete, 
  onEdit 
}) => {
  return (
    <Card className="financial-card">
      <div className="space-y-4">
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Updating prices...</span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Day Change</TableHead>
                <TableHead className="text-right">Total Return</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <HoldingsTableRow
                  key={holding.id}
                  holding={holding}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default HoldingsTable;
