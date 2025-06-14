
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
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFetchRef = useRef<string>('');

  const calculatePortfolio = useCallback((): RealTimePortfolio | null => {
    return calculatePortfolioTotals(holdings, marketData, portfolios, portfolioId);
  }, [holdings, marketData, portfolios, portfolioId]);

  // Debounced fetch holdings to prevent multiple rapid calls
  const debouncedFetchHoldings = useCallback((id: string) => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Only fetch if it's a different portfolio or enough time has passed
    if (lastFetchRef.current === id) {
      return;
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      console.log('Fetching holdings for portfolio:', id);
      lastFetchRef.current = id;
      fetchHoldings(id);
    }, 100);
  }, [fetchHoldings]);

  // Fetch holdings when portfolio is available (but only once per portfolio)
  useEffect(() => {
    if (portfolioId && portfolioId !== lastFetchRef.current) {
      debouncedFetchHoldings(portfolioId);
    }
  }, [portfolioId, debouncedFetchHoldings]);

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
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
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
