
import React from 'react';
import { Holding } from '../types/portfolio';
import HoldingCard from './HoldingCard';

interface HoldingsListProps {
  holdings: Holding[];
  onHoldingClick: (holding: Holding) => void;
}

const HoldingsList: React.FC<HoldingsListProps> = ({ holdings, onHoldingClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Holdings</h2>
        <div className="text-sm text-muted-foreground">
          {holdings.length} positions
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holdings.map((holding) => (
          <HoldingCard
            key={holding.id}
            holding={holding}
            onClick={onHoldingClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HoldingsList;
