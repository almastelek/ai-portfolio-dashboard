
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMarketSummary } from '../data/mockData';
import { Holding } from '../types/portfolio';
import { useAuth } from '../hooks/useAuth';
import { usePortfolio } from '../hooks/usePortfolio';
import { useRealTimePortfolio } from '../hooks/useRealTimePortfolio';
import { useEdgeFunctions } from '../hooks/useEdgeFunctions';
import MarketSummary from '../components/MarketSummary';
import PortfolioOverview from '../components/PortfolioOverview';
import HoldingsList from '../components/HoldingsList';
import RealHoldingsList from '../components/RealHoldingsList';
import Navigation from '../components/Navigation';
import HoldingDetailModal from '../components/HoldingDetailModal';
import UserProfile from '../components/UserProfile';
import ReportsCenter from '../components/ReportsCenter';
import SuperInvestorTracker from '../components/SuperInvestorTracker';
import AlertsManager from '../components/AlertsManager';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sparkles, TrendingUp, RefreshCw } from 'lucide-react';

const Index = () => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading: authLoading } = useAuth();
  const { portfolios, loading: portfolioLoading } = usePortfolio();
  const { portfolio: realTimePortfolio, loading: portfolioDataLoading, refreshData, lastUpdated } = useRealTimePortfolio(portfolios?.[0]?.id);
  const { generateTradeIdeas, loading: aiLoading } = useEdgeFunctions();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleHoldingClick = (holding: Holding) => {
    setSelectedHolding(holding);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHolding(null);
  };

  const handleGenerateIdeas = async () => {
    try {
      await generateTradeIdeas('technical');
    } catch (error) {
      console.error('Error generating trade ideas:', error);
    }
  };

  // Show loading state while checking authentication
  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <TrendingUp className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <div className="text-lg">Loading your investment dashboard...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                onClick={handleGenerateIdeas}
                disabled={aiLoading}
                className="flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{aiLoading ? 'Generating...' : 'AI Trade Ideas'}</span>
              </Button>
              <Button
                onClick={refreshData}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
        </div>
      </div>

      {/* Holding Detail Modal */}
      <HoldingDetailModal
        holding={selectedHolding}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
