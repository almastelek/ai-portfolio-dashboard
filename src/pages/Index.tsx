
import React from 'react';
import { useDashboardState } from '../hooks/useDashboardState';
import DashboardHeader from '../components/DashboardHeader';
import DashboardContent from '../components/DashboardContent';
import DashboardLoading from '../components/DashboardLoading';
import Navigation from '../components/Navigation';
import HoldingDetailModal from '../components/HoldingDetailModal';

const Index = () => {
  const {
    selectedHolding,
    isModalOpen,
    activeTab,
    setActiveTab,
    user,
    authLoading,
    portfolioLoading,
    portfolios,
    portfolioId,
    realTimePortfolio,
    portfolioDataLoading,
    refreshData,
    lastUpdated,
    aiLoading,
    handleHoldingClick,
    handleCloseModal,
    handleGenerateIdeas
  } = useDashboardState();

  // Show loading state while checking authentication
  if (authLoading || portfolioLoading) {
    return <DashboardLoading />;
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onGenerateIdeas={handleGenerateIdeas}
        onRefresh={refreshData}
        aiLoading={aiLoading}
        portfolioDataLoading={portfolioDataLoading}
        lastUpdated={lastUpdated}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Navigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                portfolioId={portfolioId || undefined}
              />
            </div>
          </div>

          <DashboardContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            realTimePortfolio={realTimePortfolio}
            portfolioDataLoading={portfolioDataLoading}
            portfolios={portfolios}
            portfolioId={portfolioId || undefined}
          />
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
