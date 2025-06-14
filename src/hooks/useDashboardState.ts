
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Holding } from '../types/portfolio';
import { useAuth } from './useAuth';
import { usePortfolio } from './usePortfolio';
import { useRealTimePortfolio } from './useRealTimePortfolio';
import { useEdgeFunctions } from './useEdgeFunctions';

export const useDashboardState = () => {
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

  return {
    selectedHolding,
    isModalOpen,
    activeTab,
    setActiveTab,
    user,
    authLoading,
    portfolioLoading,
    portfolios,
    realTimePortfolio,
    portfolioDataLoading,
    refreshData,
    lastUpdated,
    aiLoading,
    handleHoldingClick,
    handleCloseModal,
    handleGenerateIdeas
  };
};
