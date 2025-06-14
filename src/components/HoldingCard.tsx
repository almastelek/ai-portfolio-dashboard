
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface HoldingCardProps {
  holding: Holding;
  onClick: (holding: Holding) => void;
}

const HoldingCard: React.FC<HoldingCardProps> = ({ holding, onClick }) => {
  const isPositive = holding.dayChangePercent >= 0;
  const isProfitable = holding.unrealizedPnLPercent >= 0;

  return (
    <Card 
      className={`financial-card cursor-pointer hover:scale-105 transition-all duration-300 group ${
        isPositive ? 'hover:shadow-profit/20' : 'hover:shadow-loss/20'
      } ${
        Math.abs(holding.dayChangePercent) > 2 ? (isPositive ? 'animate-pulse-profit' : 'animate-pulse-loss') : ''
      }`}
      onClick={() => onClick(holding)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold">{holding.ticker}</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {holding.companyName}
            </p>
            <div className="inline-block px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">
              {holding.sector}
            </div>
          </div>
          <div className={`p-2 rounded-full ${
            isPositive ? 'bg-profit/10' : 'bg-loss/10'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-profit" />
            ) : (
              <TrendingDown className="h-5 w-5 text-loss" />
            )}
          </div>
        </div>

        {/* Price and Performance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                ${holding.currentPrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Current Price
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                isPositive ? 'text-profit' : 'text-loss'
              }`}>
                {isPositive ? '+' : ''}${holding.dayChange.toFixed(2)}
              </p>
              <p className={`text-sm ${
                isPositive ? 'text-profit' : 'text-loss'
              }`}>
                ({isPositive ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%)
              </p>
            </div>
          </div>

          {/* Position Details */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
            <div>
              <p className="text-sm text-muted-foreground">Shares</p>
              <p className="font-semibold">{holding.shares.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Value</p>
              <p className="font-semibold">
                ${holding.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Cost</p>
              <p className="font-semibold">${holding.avgCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-semibold">{holding.weight.toFixed(2)}%</p>
            </div>
          </div>

          {/* Total P&L */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total P&L</span>
              <div className="text-right">
                <span className={`font-semibold ${
                  isProfitable ? 'text-profit' : 'text-loss'
                }`}>
                  {isProfitable ? '+' : ''}${holding.unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-sm ml-2 ${
                  isProfitable ? 'text-profit' : 'text-loss'
                }`}>
                  ({isProfitable ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HoldingCard;
