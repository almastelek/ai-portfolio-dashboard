
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import EditHoldingForm from './EditHoldingForm';
import { EnrichedHolding } from '@/types/realTimePortfolio';

interface HoldingsTableRowProps {
  holding: EnrichedHolding;
  onDelete: (id: string) => void;
  onEdit?: () => void;
}

const HoldingsTableRow: React.FC<HoldingsTableRowProps> = ({ 
  holding, 
  onDelete, 
  onEdit 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number | undefined) => {
    if (value === undefined || value === null) return '-';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatShares = (shares: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(shares);
  };

  const getChangeColor = (value: number | undefined) => {
    if (value === undefined || value === null) return 'text-muted-foreground';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const handleEditSuccess = () => {
    if (onEdit) {
      onEdit();
    }
  };

  // Convert EnrichedHolding to the format expected by EditHoldingForm
  const holdingForEdit = {
    id: holding.id,
    ticker: holding.ticker,
    company_name: holding.companyName,
    shares: holding.shares,
    avg_cost: holding.avgCost,
    purchase_date: new Date().toISOString().split('T')[0], // We'll need to get this from somewhere else
    sector: holding.sector,
    portfolio_id: '' // We'll need to get this from somewhere else
  };

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell className="font-medium">
          <div>
            <div className="font-semibold">{holding.ticker}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[150px]">
              {holding.companyName}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className="text-xs">
            {holding.sector}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          {formatShares(holding.shares)}
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(holding.avgCost)}
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(holding.currentPrice)}
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(holding.marketValue)}
        </TableCell>
        <TableCell className={`text-right ${getChangeColor(holding.dayChange)}`}>
          <div>
            <div>{formatCurrency(holding.dayChange)}</div>
            <div className="text-xs">
              {formatPercent(holding.dayChangePercent)}
            </div>
          </div>
        </TableCell>
        <TableCell className={`text-right ${getChangeColor(holding.unrealizedPnL)}`}>
          <div>
            <div>{formatCurrency(holding.unrealizedPnL)}</div>
            <div className="text-xs">
              {formatPercent(holding.unrealizedPnLPercent)}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          {holding.weight ? `${holding.weight.toFixed(1)}%` : '-'}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(holding.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <EditHoldingForm
        holding={holdingForEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default HoldingsTableRow;
