
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Bell, BookOpen, Target } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface HoldingDetailModalProps {
  holding: Holding | null;
  isOpen: boolean;
  onClose: () => void;
}

const HoldingDetailModal: React.FC<HoldingDetailModalProps> = ({ holding, isOpen, onClose }) => {
  if (!holding) return null;

  const isPositive = holding.dayChangePercent >= 0;
  const isProfitable = holding.unrealizedPnLPercent >= 0;

  const mockNews = [
    {
      title: `${holding.companyName} Reports Strong Q4 Earnings`,
      summary: "Company beats expectations with solid revenue growth and improved margins.",
      sentiment: "positive",
      time: "2 hours ago"
    },
    {
      title: `Analyst Upgrades ${holding.ticker} Price Target`,
      summary: "Investment firm raises target price citing strong fundamentals and market position.",
      sentiment: "positive", 
      time: "1 day ago"
    },
    {
      title: "Sector Rotation May Impact Performance",
      summary: "Market rotation from growth to value stocks could affect short-term performance.",
      sentiment: "neutral",
      time: "2 days ago"
    }
  ];

  const upcomingEvents = [
    { event: "Earnings Call", date: "Next Tuesday", type: "earnings" },
    { event: "Dividend Ex-Date", date: "March 15", type: "dividend" },
    { event: "Analyst Conference", date: "March 22", type: "conference" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-2xl font-bold">{holding.ticker}</span>
            <Badge variant="secondary">{holding.sector}</Badge>
            <div className={`flex items-center space-x-1 ${
              isPositive ? 'text-profit' : 'text-loss'
            }`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
              </span>
            </div>
          </DialogTitle>
          <p className="text-muted-foreground">{holding.companyName}</p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Price & Performance */}
          <Card className="financial-card col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Price & Performance</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Price</span>
                <span className="text-2xl font-bold">${holding.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Day Change</span>
                <span className={`font-semibold ${isPositive ? 'text-profit' : 'text-loss'}`}>
                  {isPositive ? '+' : ''}${holding.dayChange.toFixed(2)} ({isPositive ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total P&L</span>
                <span className={`font-semibold ${isProfitable ? 'text-profit' : 'text-loss'}`}>
                  {isProfitable ? '+' : ''}${holding.unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Return %</span>
                <span className={`font-semibold ${isProfitable ? 'text-profit' : 'text-loss'}`}>
                  {isProfitable ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Position Details */}
          <Card className="financial-card col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Position Details</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shares</span>
                <span className="font-semibold">{holding.shares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Cost</span>
                <span className="font-semibold">${holding.avgCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Value</span>
                <span className="font-semibold">
                  ${holding.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Portfolio Weight</span>
                <span className="font-semibold">{holding.weight.toFixed(2)}%</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="financial-card col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Events</span>
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <div>
                    <p className="font-medium text-sm">{event.event}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* AI-Generated News Summary */}
          <Card className="financial-card col-span-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>AI-Generated News & Analysis</span>
            </h3>
            <div className="space-y-4">
              {mockNews.map((news, index) => (
                <div key={index} className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{news.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={news.sentiment === 'positive' ? 'default' : news.sentiment === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {news.sentiment}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{news.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{news.summary}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">AI Forward-Looking Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Based on recent news and market trends, {holding.ticker} shows strong fundamentals with positive sentiment. 
                Key catalysts include upcoming earnings and continued sector strength. Monitor for any changes in 
                regulatory environment or competitive pressures. Overall outlook remains {isProfitable ? 'positive' : 'cautious'}.
              </p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HoldingDetailModal;
