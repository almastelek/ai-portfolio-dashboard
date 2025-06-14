
import React from 'react';
import { Button } from './ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import UserProfile from './UserProfile';

interface DashboardHeaderProps {
  onGenerateIdeas: () => void;
  onRefresh: () => void;
  aiLoading: boolean;
  portfolioDataLoading: boolean;
  lastUpdated?: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onGenerateIdeas,
  onRefresh,
  aiLoading,
  portfolioDataLoading,
  lastUpdated
}) => {
  return (
    <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-financial bg-clip-text text-transparent">
              Investment Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time portfolio tracking and AI-powered insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onGenerateIdeas}
              disabled={aiLoading}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{aiLoading ? 'Generating...' : 'AI Trade Ideas'}</span>
            </Button>
            <Button
              onClick={onRefresh}
              disabled={portfolioDataLoading}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${portfolioDataLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <div className="text-sm text-muted-foreground">
              {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
            </div>
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
