
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
  error?: string;
}

export class MarketDataService {
  private cache = new Map<string, { data: MarketDataResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 900000; // 15 minutes cache (to respect API limits)
  private readonly REQUEST_DELAY = 13000; // 13 seconds between requests (to stay under 5/minute limit)
  private lastRequestTime = 0;

  private async rateLimitedRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      const waitTime = this.REQUEST_DELAY - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async getMarketData(ticker: string): Promise<MarketDataResponse> {
    // Check cache first
    const cached = this.cache.get(ticker);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached data for ${ticker}`);
      return cached.data;
    }

    try {
      // Apply rate limiting
      await this.rateLimitedRequest();
      
      console.log(`Fetching fresh data for ${ticker}`);
      
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { ticker }
      });

      if (error) throw error;

      const marketData = data as MarketDataResponse;
      
      // Don't cache data with errors
      if (!marketData.error && marketData.currentPrice > 0) {
        this.cache.set(ticker, {
          data: marketData,
          timestamp: Date.now()
        });
        console.log(`Cached fresh data for ${ticker}: $${marketData.currentPrice}`);
      }

      return marketData;
    } catch (error) {
      console.error(`Error fetching market data for ${ticker}:`, error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(ticker);
      if (cached) {
        console.log(`Using expired cached data for ${ticker} due to error`);
        return { ...cached.data, error: 'Using cached data due to API error' };
      }
      
      // Final fallback
      const fallbackData: MarketDataResponse = {
        ticker: ticker.toUpperCase(),
        currentPrice: 0,
        change: 0.00,
        changePercent: 0.00,
        volume: 0,
        marketCap: 0,
        pe: 0,
        high52Week: 0,
        low52Week: 0,
        timestamp: new Date().toISOString(),
        error: `Failed to fetch data: ${error.message}`
      };
      
      return fallbackData;
    }
  }

  async getBulkMarketData(tickers: string[]): Promise<Map<string, MarketDataResponse>> {
    const results = new Map<string, MarketDataResponse>();
    
    // Process one by one to respect API rate limits (5 requests per minute)
    for (const ticker of tickers) {
      try {
        console.log(`Processing ${ticker}...`);
        const data = await this.getMarketData(ticker);
        results.set(ticker, data);
        
        // Log successful fetch
        if (!data.error && data.currentPrice > 0) {
          console.log(`✓ ${ticker}: $${data.currentPrice} (${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`);
        } else {
          console.warn(`⚠ ${ticker}: ${data.error || 'No data'}`);
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${ticker}:`, error);
      }
    }
    
    console.log(`Completed bulk fetch for ${tickers.length} tickers`);
    return results;
  }

  clearCache() {
    this.cache.clear();
    console.log('Market data cache cleared');
  }

  getCacheStatus(): { ticker: string; age: number; price: number }[] {
    const status: { ticker: string; age: number; price: number }[] = [];
    const now = Date.now();
    
    this.cache.forEach((value, ticker) => {
      status.push({
        ticker,
        age: Math.round((now - value.timestamp) / 1000 / 60), // age in minutes
        price: value.data.currentPrice
      });
    });
    
    return status;
  }
}

export const marketDataService = new MarketDataService();
