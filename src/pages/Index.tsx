
import React, { useState } from 'react';
import { mockPortfolio, mockMarketSummary } from '../data/mockData';
import { Holding } from '../types/portfolio';
import MarketSummary from '../components/MarketSummary';
import PortfolioOverview from '../components/PortfolioOverview';
import HoldingsList from '../components/HoldingsList';
import Navigation from '../components/Navigation';
import HoldingDetailModal from '../components/HoldingDetailModal';

const Index = () => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHoldingClick = (holding: Holding) => {
    setSelectedHolding(holding);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHolding(null);
  };

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
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
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

            {/* Holdings */}
            <div className="animate-slide-up">
              <HoldingsList 
                holdings={mockPortfolio.holdings} 
                onHoldingClick={handleHoldingClick}
              />
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
