
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
import ReportsCenter from '../components/ReportsCenter';
import SuperInvestorTracker from '../components/SuperInvestorTracker';
import AlertsManager from '../components/AlertsManager';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sparkles, TrendingUp } from 'lucide-react';

const Index = () => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading: authLoading } = useAuth();
  const { portfolios, holdings, loading: portfolioLoading, fetchHoldings } = usePortfolio();
  const { generateTradeIdeas, loading: aiLoading } = useEdgeFunctions();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch holdings for the first portfolio
  useEffect(() => {
    if (portfolios && portfolios.length > 0) {
      fetchHoldings(portfolios[0].id);
    }
  }, [portfolios, fetchHoldings]);

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

  // Calculate real portfolio metrics from holdings
  const calculatePortfolioMetrics = () => {
    if (!holdings || holdings.length === 0) {
      return mockPortfolio; // Fallback to mock data if no holdings
    }

    // For now, we'll use mock prices since we don't have real-time data
    // In a real app, you'd fetch current prices from an API
    const mockPrices = {
      'AAPL': 150.00,
      'GOOGL': 2800.00,
      'MSFT': 300.00,
      'TSLA': 800.00,
      'NVDA': 900.00
    };

    let totalValue = 0;
    let totalCost = 0;
    let totalDayChange = 0;

    const enrichedHoldings = holdings.map(holding => {
      const currentPrice = mockPrices[holding.ticker as keyof typeof mockPrices] || holding.avg_cost * 1.05;
      const marketValue = Number(holding.shares) * currentPrice;
      const costBasis = Number(holding.shares) * Number(holding.avg_cost);
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent = (unrealizedPnL / costBasis) * 100;
      const dayChange = marketValue * 0.012; // Mock 1.2% daily change
      const dayChangePercent = 1.2;

      totalValue += marketValue;
      totalCost += costBasis;
      totalDayChange += dayChange;

      return {
        id: holding.id,
        ticker: holding.ticker,
        companyName: holding.company_name,
        shares: Number(holding.shares),
        avgCost: Number(holding.avg_cost),
        currentPrice,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        dayChange,
        dayChangePercent,
        sector: holding.sector || 'Technology',
        weight: 0 // Will be calculated after we have totalValue
      };
    });

    // Calculate weights
    enrichedHoldings.forEach(holding => {
      holding.weight = (holding.marketValue / totalValue) * 100;
    });

    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    const dayChangePercent = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0;

    return {
      id: portfolios?.[0]?.id || 'default',
      name: portfolios?.[0]?.name || 'My Portfolio',
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      dayChange: totalDayChange,
      dayChangePercent,
      holdings: enrichedHoldings
    };
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

  const portfolioData = calculatePortfolioMetrics();

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
                <div className="animate-slide-up">
                  <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
                  <PortfolioOverview portfolio={portfolioData} />
                </div>

                {/* Holdings */}
                <div className="animate-slide-up">
                  {portfolios && portfolios.length > 0 ? (
                    <RealHoldingsList portfolioId={portfolios[0].id} />
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
