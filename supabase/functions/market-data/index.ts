
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ticker } = await req.json()

    if (!ticker) {
      throw new Error('Ticker symbol is required')
    }

    // Mock market data (in production, you'd call a real API like Alpha Vantage, Yahoo Finance, etc.)
    const mockData = {
      ticker: ticker.toUpperCase(),
      currentPrice: Math.random() * 300 + 50, // Random price between 50-350
      change: Math.random() * 20 - 10, // Random change between -10 and +10
      changePercent: Math.random() * 10 - 5, // Random percent change
      volume: Math.floor(Math.random() * 10000000),
      marketCap: Math.floor(Math.random() * 1000000000000),
      pe: Math.random() * 50 + 5,
      high52Week: Math.random() * 400 + 100,
      low52Week: Math.random() * 100 + 20,
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
