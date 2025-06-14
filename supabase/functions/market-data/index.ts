
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock data for common stocks to make it more realistic
const stockData: Record<string, any> = {
  'GOOGL': { basePrice: 138.50, name: 'Alphabet Inc.' },
  'AAPL': { basePrice: 195.50, name: 'Apple Inc.' },
  'MSFT': { basePrice: 415.25, name: 'Microsoft Corporation' },
  'AMZN': { basePrice: 155.75, name: 'Amazon.com Inc.' },
  'TSLA': { basePrice: 248.50, name: 'Tesla Inc.' },
  'NVDA': { basePrice: 875.25, name: 'NVIDIA Corporation' },
  'META': { basePrice: 485.75, name: 'Meta Platforms Inc.' },
  'NFLX': { basePrice: 485.25, name: 'Netflix Inc.' }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ticker } = await req.json()

    if (!ticker) {
      throw new Error('Ticker symbol is required')
    }

    const upperTicker = ticker.toUpperCase();
    const stockInfo = stockData[upperTicker];
    const basePrice = stockInfo?.basePrice || 150.00; // Default for unknown stocks
    
    // Generate realistic but stable price movements
    const priceVariation = (Math.sin(Date.now() / 1000000) * 0.02); // Small variation based on time
    const currentPrice = basePrice * (1 + priceVariation);
    const yesterdayPrice = basePrice * (1 + (Math.sin((Date.now() - 86400000) / 1000000) * 0.02));
    const change = currentPrice - yesterdayPrice;
    const changePercent = (change / yesterdayPrice) * 100;

    const mockData = {
      ticker: upperTicker,
      currentPrice: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 5000000) + 1000000,
      marketCap: Math.floor(basePrice * 1000000000),
      pe: Math.round((15 + Math.random() * 20) * 100) / 100,
      high52Week: Math.round(basePrice * 1.3 * 100) / 100,
      low52Week: Math.round(basePrice * 0.7 * 100) / 100,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(mockData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
