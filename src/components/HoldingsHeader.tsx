
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import AddHoldingForm from './AddHoldingForm';

interface HoldingsHeaderProps {
  portfolioId: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onHoldingAdded: () => void;
}

const HoldingsHeader: React.FC<HoldingsHeaderProps> = ({ 
  portfolioId, 
  isRefreshing, 
  onRefresh, 
  onHoldingAdded 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Your Holdings</h2>
      <div className="flex items-center space-x-4">
        <Button
          onClick={onRefresh}
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
            onSuccess={onHoldingAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default HoldingsHeader;
