
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useRealTimePortfolio } from '@/hooks/useRealTimePortfolio';
import HoldingsHeader from './HoldingsHeader';
import HoldingsTable from './HoldingsTable';
import HoldingsEmptyState from './HoldingsEmptyState';

interface RealHoldingsListProps {
  portfolioId: string;
}

const RealHoldingsList: React.FC<RealHoldingsListProps> = ({ portfolioId }) => {
  const { loading, deleteHolding, fetchHoldings } = usePortfolio();
  const { portfolio: realTimePortfolio, loading: priceLoading, refreshData } = useRealTimePortfolio(portfolioId);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleHoldingUpdated = () => {
    if (portfolioId) {
      fetchHoldings(portfolioId);
    }
  };

  // Use real-time portfolio holdings if available, otherwise use empty array
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
      <HoldingsHeader
        portfolioId={portfolioId}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onHoldingAdded={handleHoldingUpdated}
      />

      {displayHoldings.length === 0 ? (
        <HoldingsEmptyState
          portfolioId={portfolioId}
          onHoldingAdded={handleHoldingUpdated}
        />
      ) : (
        <HoldingsTable
          holdings={displayHoldings}
          isRefreshing={isRefreshing}
          onDelete={handleDelete}
          onEdit={handleHoldingUpdated}
        />
      )}
    </div>
  );
};

export default RealHoldingsList;
