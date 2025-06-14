
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Trash2, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useRealTimePortfolio } from '@/hooks/useRealTimePortfolio';
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
  const { portfolio: realTimePortfolio, loading: priceLoading, refreshData } = useRealTimePortfolio(portfolioId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch holdings when component mounts or portfolioId changes
  useEffect(() => {
    if (portfolioId) {
      console.log('Fetching holdings for portfolio:', portfolioId);
      fetchHoldings(portfolioId);
    }
  }, [portfolioId, fetchHoldings]);

  const handleDelete = async (holdingId: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      await deleteHolding(holdingId);
      // Refresh holdings after deletion
      if (portfolioId) {
        fetchHoldings(portfolioId);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      if (portfolioId) {
        await fetchHoldings(portfolioId);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleHoldingAdded = () => {
    if (portfolioId) {
      fetchHoldings(portfolioId);
    }
  };

  // Use real-time portfolio holdings if available, otherwise use basic holdings
  const displayHoldings = realTimePortfolio?.holdings || [];

  if (loading) {
    return (
      <Card className="financial-card">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          <div className="text-muted-foreground">Loading holdings...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-section="holdings">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Holdings</h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Prices</span>
          </Button>
          <div data-testid="add-holding-button">
            <AddHoldingForm 
              portfolioId={portfolioId} 
              onSuccess={handleHoldingAdded}
            />
          </div>
        </div>
      </div>

      {displayHoldings.length === 0 ? (
        <Card className="financial-card">
          <div className="text-center p-8 space-y-4">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No holdings yet</h3>
              <p className="text-muted-foreground">Start building your portfolio by adding your first holding.</p>
            </div>
            <AddHoldingForm 
              portfolioId={portfolioId} 
              onSuccess={handleHoldingAdded}
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
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayHoldings.map((holding) => {
                const isPositive = holding.unrealizedPnLPercent >= 0;
                const isDayPositive = holding.dayChangePercent >= 0;
                
                return (
                  <TableRow key={holding.id}>
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
                        onClick={() => handleDelete(holding.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
