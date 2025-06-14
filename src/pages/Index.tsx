
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPortfolio, mockMarketSummary } from '../data/mockData';
import { Holding } from '../types/portfolio';
import { useAuth } from '../hooks/useAuth';
import { usePortfolio } from '../hooks/usePortfolio';
import { useEdgeFunctions } from '../hooks/useEdgeFunctions';
import MarketSummary from '../components/MarketSummary';
import PortfolioOverview from '../components/PortfolioOverview';
import HoldingsList from '../components/HoldingsList';
import RealHoldingsList from '../components/RealHoldingsList';
import Navigation from '../components/Navigation';
import HoldingDetailModal from '../components/HoldingDetailModal';
import UserProfile from '../components/UserProfile';
import { Button } from '../components/ui/button';
import { Sparkles, TrendingUp } from 'lucide-react';

const Index = () => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { portfolios, loading: portfolioLoading } = usePortfolio();
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

  const defaultPortfolio = portfolios?.[0];

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
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
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
              <Navigation />
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-3 space-y-8">
            {/* Market Summary */}
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <MarketSummary data={mockMarketSummary} />
            </div>

            {/* Portfolio Overview */}
            <div className="animate-slide-up">
              <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
              <PortfolioOverview portfolio={mockPortfolio} />
            </div>

            {/* Holdings - Show real holdings if user has them, otherwise show demo */}
            <div className="animate-slide-up">
              {defaultPortfolio ? (
                <RealHoldingsList portfolioId={defaultPortfolio.id} />
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">
                      No portfolio found. A default portfolio should have been created automatically.
                    </p>
                  </div>
                  <HoldingsList 
                    holdings={mockPortfolio.holdings} 
                    onHoldingClick={handleHoldingClick}
                  />
                </div>
              )}
            </div>
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
