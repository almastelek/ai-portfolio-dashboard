
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { Portfolio } from '../types/portfolio';

interface PortfolioOverviewProps {
  portfolio: Portfolio;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio }) => {
  const stats = [
    {
      title: 'Total Value',
      value: `$${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: portfolio.dayChange,
      changePercent: portfolio.dayChangePercent,
      description: 'Portfolio market value'
    },
    {
      title: 'Total P&L',
      value: `$${portfolio.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: portfolio.totalPnLPercent >= 0 ? TrendingUp : TrendingDown,
      change: portfolio.totalPnL,
      changePercent: portfolio.totalPnLPercent,
      description: 'Unrealized gains/losses'
    },
    {
      title: 'Day Change',
      value: `${portfolio.dayChangePercent >= 0 ? '+' : ''}$${portfolio.dayChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: portfolio.dayChangePercent >= 0 ? TrendingUp : TrendingDown,
      change: portfolio.dayChange,
      changePercent: portfolio.dayChangePercent,
      description: "Today's performance"
    },
    {
      title: 'Total Return',
      value: `${portfolio.totalPnLPercent >= 0 ? '+' : ''}${portfolio.totalPnLPercent.toFixed(2)}%`,
      icon: Percent,
      change: portfolio.totalPnL,
      changePercent: portfolio.totalPnLPercent,
      description: 'Overall return percentage'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.changePercent >= 0;
        
        return (
          <Card key={stat.title} className={`financial-card hover:shadow-lg transition-all duration-300 ${
            isPositive ? 'hover:shadow-profit/20' : 'hover:shadow-loss/20'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className={`p-2 rounded-full ${
                  isPositive ? 'bg-profit/10' : 'bg-loss/10'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    isPositive ? 'text-profit' : 'text-loss'
                  }`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${
                    isPositive ? 'text-profit' : 'text-loss'
                  }`}>
                    {isPositive ? '+' : ''}{stat.changePercent.toFixed(2)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PortfolioOverview;
