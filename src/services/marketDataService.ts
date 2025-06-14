
import { supabase } from '@/integrations/supabase/client';

export interface MarketDataResponse {
  ticker: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  high52Week: number;
  low52Week: number;
  timestamp: string;
}

export class MarketDataService {
  private cache = new Map<string, { data: MarketDataResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  async getMarketData(ticker: string): Promise<MarketDataResponse> {
    // Check cache first
    const cached = this.cache.get(ticker);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { ticker }
      });

      if (error) throw error;

      // Cache the result
      this.cache.set(ticker, {
        data: data as MarketDataResponse,
        timestamp: Date.now()
      });

      return data as MarketDataResponse;
    } catch (error) {
      console.error(`Error fetching market data for ${ticker}:`, error);
      throw error;
    }
  }

  async getBulkMarketData(tickers: string[]): Promise<Map<string, MarketDataResponse>> {
    const results = new Map<string, MarketDataResponse>();
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      const promises = batch.map(ticker => 
        this.getMarketData(ticker).catch(error => {
          console.error(`Failed to fetch data for ${ticker}:`, error);
          return null;
        })
      );
      
      const batchResults = await Promise.all(promises);
      
      batchResults.forEach((data, index) => {
        if (data) {
          results.set(batch[index], data);
        }
      });
    }
    
    return results;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const marketDataService = new MarketDataService();
