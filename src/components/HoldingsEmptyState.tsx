
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import AddHoldingForm from './AddHoldingForm';

interface HoldingsEmptyStateProps {
  portfolioId: string;
  onHoldingAdded: () => void;
}

const HoldingsEmptyState: React.FC<HoldingsEmptyStateProps> = ({ 
  portfolioId, 
  onHoldingAdded 
}) => {
  return (
    <Card className="financial-card">
      <div className="text-center p-8 space-y-4">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">No holdings yet</h3>
          <p className="text-muted-foreground">Start building your portfolio by adding your first holding.</p>
        </div>
        <AddHoldingForm 
          portfolioId={portfolioId} 
          onSuccess={onHoldingAdded}
        />
      </div>
    </Card>
  );
};

export default HoldingsEmptyState;
