
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolio } from './usePortfolio';
import { useMarketData } from './useMarketData';
import { calculatePortfolioTotals } from '../utils/portfolioCalculations';
import { RealTimePortfolio } from '../types/realTimePortfolio';

export const useRealTimePortfolio = (portfolioId?: string) => {
  const [portfolio, setPortfolio] = useState<RealTimePortfolio | null>(null);
  const { portfolios, holdings, fetchHoldings } = usePortfolio();
  const { marketData, loading, fetchMarketData } = useMarketData();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const calculatePortfolio = useCallback((): RealTimePortfolio | null => {
    return calculatePortfolioTotals(holdings, marketData, portfolios, portfolioId);
  }, [holdings, marketData, portfolios, portfolioId]);

  // Fetch holdings when portfolio is available
  useEffect(() => {
    if (portfolioId) {
      fetchHoldings(portfolioId);
    }
  }, [portfolioId, fetchHoldings]);

  // Fetch market data when holdings change (but only once initially)
  useEffect(() => {
    if (holdings && holdings.length > 0) {
      const tickers = holdings.map(h => h.ticker);
      fetchMarketData(tickers);
    }
  }, [holdings, fetchMarketData]);

  // Recalculate portfolio when market data or holdings change
  useEffect(() => {
    // Clear any pending updates to prevent rapid recalculations
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce the portfolio calculation
    updateTimeoutRef.current = setTimeout(() => {
      const calculatedPortfolio = calculatePortfolio();
      setPortfolio(calculatedPortfolio);
    }, 300); // 300ms debounce

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [calculatePortfolio]);

  // Auto-refresh market data every 5 minutes
  useEffect(() => {
    if (holdings && holdings.length > 0) {
      const interval = setInterval(() => {
        const tickers = holdings.map(h => h.ticker);
        fetchMarketData(tickers);
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [holdings, fetchMarketData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const refreshData = useCallback(async () => {
    if (holdings && holdings.length > 0) {
      const tickers = holdings.map(h => h.ticker);
      await fetchMarketData(tickers);
    }
  }, [holdings, fetchMarketData]);

  return {
    portfolio,
    loading,
    refreshData,
    lastUpdated: portfolio?.lastUpdated
  };
};
