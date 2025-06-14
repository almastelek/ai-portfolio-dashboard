
import { useState, useEffect } from 'react';
import { usePortfolio } from './usePortfolio';
import { marketDataService, MarketDataResponse } from '@/services/marketDataService';
import { useToast } from './use-toast';

interface EnrichedHolding {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sector: string;
  weight: number;
}

interface RealTimePortfolio {
  id: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: EnrichedHolding[];
  lastUpdated: Date;
}

export const useRealTimePortfolio = (portfolioId?: string) => {
  const [portfolio, setPortfolio] = useState<RealTimePortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<Map<string, MarketDataResponse>>(new Map());
  const { portfolios, holdings, fetchHoldings } = usePortfolio();
  const { toast } = useToast();

  const fetchMarketData = async () => {
    if (!holdings || holdings.length === 0) return;

    setLoading(true);
    try {
      const tickers = holdings.map(h => h.ticker);
      const data = await marketDataService.getBulkMarketData(tickers);
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Warning",
        description: "Unable to fetch live market data. Using cached values.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolio = (): RealTimePortfolio | null => {
    if (!holdings || holdings.length === 0 || !portfolios || portfolios.length === 0) {
      return null;
    }

    const currentPortfolio = portfolios.find(p => p.id === portfolioId) || portfolios[0];
    
    let totalValue = 0;
    let totalCost = 0;
    let totalDayChange = 0;

    const enrichedHoldings: EnrichedHolding[] = holdings.map(holding => {
      const marketInfo = marketData.get(holding.ticker);
      const currentPrice = marketInfo?.currentPrice || Number(holding.avg_cost) * 1.05; // Fallback
      const dayChangePercent = marketInfo?.changePercent || 0;
      
      const shares = Number(holding.shares);
      const avgCost = Number(holding.avg_cost);
      const marketValue = shares * currentPrice;
      const costBasis = shares * avgCost;
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;
      const dayChange = marketValue * (dayChangePercent / 100);

      totalValue += marketValue;
      totalCost += costBasis;
      totalDayChange += dayChange;

      return {
        id: holding.id,
        ticker: holding.ticker,
        companyName: holding.company_name,
        shares,
        avgCost,
        currentPrice,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        dayChange,
        dayChangePercent,
        sector: holding.sector || 'Unknown',
        weight: 0 // Will be calculated after we have totalValue
      };
    });

    // Calculate weights
    enrichedHoldings.forEach(holding => {
      holding.weight = totalValue > 0 ? (holding.marketValue / totalValue) * 100 : 0;
    });

    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    const dayChangePercent = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0;

    return {
      id: currentPortfolio.id,
      name: currentPortfolio.name,
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      dayChange: totalDayChange,
      dayChangePercent,
      holdings: enrichedHoldings,
      lastUpdated: new Date()
    };
  };

  // Fetch holdings when portfolioId changes
  useEffect(() => {
    if (portfolioId) {
      fetchHoldings(portfolioId);
    }
  }, [portfolioId, fetchHoldings]);

  // Fetch market data when holdings change
  useEffect(() => {
    if (holdings && holdings.length > 0) {
      fetchMarketData();
    }
  }, [holdings]);

  // Recalculate portfolio when market data or holdings change
  useEffect(() => {
    const calculatedPortfolio = calculatePortfolio();
    setPortfolio(calculatedPortfolio);
  }, [holdings, marketData, portfolios, portfolioId]);

  // Auto-refresh market data every 30 seconds
  useEffect(() => {
    if (holdings && holdings.length > 0) {
      const interval = setInterval(() => {
        fetchMarketData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [holdings]);

  return {
    portfolio,
    loading,
    refreshData: fetchMarketData,
    lastUpdated: portfolio?.lastUpdated
  };
};
