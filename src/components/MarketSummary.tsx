
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketSummary as MarketSummaryType } from '../types/portfolio';

interface MarketSummaryProps {
  data: MarketSummaryType;
}

const MarketSummary: React.FC<MarketSummaryProps> = ({ data }) => {
  const markets = [
    { name: 'S&P 500', ...data.sp500 },
    { name: 'NASDAQ', ...data.nasdaq },
    { name: 'Dow Jones', ...data.dow },
    { name: 'VIX', ...data.vix }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {markets.map((market) => (
        <Card key={market.name} className="financial-card hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{market.name}</h3>
              {market.changePercent >= 0 ? (
                <TrendingUp className="h-4 w-4 text-profit" />
              ) : (
                <TrendingDown className="h-4 w-4 text-loss" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {market.value.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${
                  market.changePercent >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {market.changePercent >= 0 ? '+' : ''}{market.change.toFixed(2)}
                </span>
                <span className={`text-xs ${
                  market.changePercent >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  ({market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MarketSummary;
