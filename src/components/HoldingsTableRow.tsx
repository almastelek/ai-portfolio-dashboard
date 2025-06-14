
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Trash2, RefreshCw } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { EnrichedHolding } from '@/types/realTimePortfolio';

interface HoldingsTableRowProps {
  holding: EnrichedHolding;
  isRefreshing: boolean;
  onDelete: (holdingId: string) => void;
}

const HoldingsTableRow: React.FC<HoldingsTableRowProps> = ({ 
  holding, 
  isRefreshing, 
  onDelete 
}) => {
  const isPositive = holding.unrealizedPnLPercent >= 0;
  const isDayPositive = holding.dayChangePercent >= 0;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <span className="font-bold">{holding.ticker}</span>
          {isRefreshing && (
            <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
        </div>
      </TableCell>
      <TableCell>{holding.companyName}</TableCell>
      <TableCell className="text-right">{holding.shares.toLocaleString()}</TableCell>
      <TableCell className="text-right">${holding.avgCost.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <div className="space-y-1">
          <div className="font-semibold">${holding.currentPrice.toFixed(2)}</div>
          <div className={`text-xs ${isDayPositive ? 'text-profit' : 'text-loss'}`}>
            {isDayPositive ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-1">
          <span className="font-semibold">
            ${holding.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          {isDayPositive ? (
            <TrendingUp className="h-4 w-4 text-profit" />
          ) : (
            <TrendingDown className="h-4 w-4 text-loss" />
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="space-y-1">
          <div className={`font-semibold ${isPositive ? 'text-profit' : 'text-loss'}`}>
            ${holding.unrealizedPnL.toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              signDisplay: 'always'
            })}
          </div>
          <div className={`text-xs ${isPositive ? 'text-profit' : 'text-loss'}`}>
            ({isPositive ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%)
          </div>
        </div>
      </TableCell>
      <TableCell>
        {holding.sector && (
          <Badge variant="secondary">{holding.sector}</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(holding.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default HoldingsTableRow;
