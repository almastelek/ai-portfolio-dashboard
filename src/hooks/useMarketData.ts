
import { useState, useCallback, useRef } from 'react';
import { marketDataService, MarketDataResponse } from '@/services/marketDataService';
import { useToast } from './use-toast';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<Map<string, MarketDataResponse>>(new Map());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isUpdatingRef = useRef(false);
  const lastUpdateRef = useRef<number>(0);

  const fetchMarketData = useCallback(async (tickers: string[]) => {
    if (!tickers || tickers.length === 0 || isUpdatingRef.current) return;

    // Prevent updates more frequently than every 30 seconds
    const now = Date.now();
    if (now - lastUpdateRef.current < 30000) {
      console.log('Skipping update - too soon since last update');
      return;
    }

    isUpdatingRef.current = true;
    setLoading(true);
    
    try {
      const data = await marketDataService.getBulkMarketData(tickers);
      setMarketData(data);
      lastUpdateRef.current = now;
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Warning",
        description: "Unable to fetch live market data. Using cached values.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      isUpdatingRef.current = false;
    }
  }, [toast]);

  return {
    marketData,
    loading,
    fetchMarketData
  };
};
