
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import AddHoldingForm from './AddHoldingForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RealHoldingsListProps {
  portfolioId: string;
}

const RealHoldingsList: React.FC<RealHoldingsListProps> = ({ portfolioId }) => {
  const { holdings, loading, fetchHoldings, deleteHolding } = usePortfolio();

  useEffect(() => {
    if (portfolioId) {
      fetchHoldings(portfolioId);
    }
  }, [portfolioId]);

  const handleDelete = async (holdingId: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      await deleteHolding(holdingId);
    }
  };

  if (loading) {
    return (
      <Card className="financial-card">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading holdings...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Holdings</h2>
        <AddHoldingForm 
          portfolioId={portfolioId} 
          onSuccess={() => fetchHoldings(portfolioId)}
        />
      </div>

      {holdings.length === 0 ? (
        <Card className="financial-card">
          <div className="text-center p-8 space-y-4">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No holdings yet</h3>
              <p className="text-muted-foreground">Start building your portfolio by adding your first holding.</p>
            </div>
            <AddHoldingForm 
              portfolioId={portfolioId} 
              onSuccess={() => fetchHoldings(portfolioId)}
            />
          </div>
        </Card>
      ) : (
        <Card className="financial-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const marketValue = holding.shares * holding.avg_cost; // Using avg_cost as current price for now
                const isPositive = true; // Placeholder for actual P&L calculation
                
                return (
                  <TableRow key={holding.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{holding.ticker}</span>
                      </div>
                    </TableCell>
                    <TableCell>{holding.company_name}</TableCell>
                    <TableCell className="text-right">{holding.shares.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${holding.avg_cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="font-semibold">
                          ${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-profit" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-loss" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {holding.sector && (
                        <Badge variant="secondary">{holding.sector}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(holding.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default RealHoldingsList;
