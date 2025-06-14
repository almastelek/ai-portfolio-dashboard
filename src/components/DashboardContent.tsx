
import React from 'react';
import { mockMarketSummary } from '../data/mockData';
import { Portfolio } from '../types/portfolio';
import MarketSummary from './MarketSummary';
import PortfolioOverview from './PortfolioOverview';
import RealHoldingsList from './RealHoldingsList';
import ReportsCenter from './ReportsCenter';
import SuperInvestorTracker from './SuperInvestorTracker';
import AlertsManager from './AlertsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw } from 'lucide-react';

interface DashboardContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  realTimePortfolio: Portfolio | null;
  portfolioDataLoading: boolean;
  portfolios: any[] | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  onTabChange,
  realTimePortfolio,
  portfolioDataLoading,
  portfolios
}) => {
  return (
    <div className="lg:col-span-3">
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
          {/* Market Summary */}
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            <MarketSummary data={mockMarketSummary} />
          </div>

          {/* Portfolio Overview */}
          {realTimePortfolio && (
            <div className="animate-slide-up" data-section="portfolio-overview">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                {portfolioDataLoading && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Updating prices...</span>
                  </div>
                )}
              </div>
              <PortfolioOverview portfolio={realTimePortfolio} />
            </div>
          )}

          {/* Holdings */}
          <div className="animate-slide-up">
            {portfolios && portfolios.length > 0 ? (
              <RealHoldingsList portfolioId={portfolios[0].id} />
            ) : (
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">
                  No portfolio found. Please add some holdings to get started.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <ReportsCenter />
        </TabsContent>

        <TabsContent value="investors">
          <SuperInvestorTracker />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsManager />
        </TabsContent>

        <TabsContent value="research">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold mb-2">Research Center</h3>
            <p className="text-muted-foreground">Coming soon - AI-powered research and analysis tools</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
