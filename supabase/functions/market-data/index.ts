
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    const { ticker } = requestBody;

    if (!ticker) {
      throw new Error('Ticker symbol is required')
    }



    const upperTicker = ticker.toUpperCase();

    console.log(`Fetching data for ${upperTicker} from Yahoo Finance`);

    // Use Yahoo Finance API (unofficial but reliable for personal projects)
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${upperTicker}`;

    const response = await fetch(yahooUrl);

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.statusText}`);
    }

    const data = await response.json();
    const quote = data.quoteResponse?.result?.[0];

    if (!quote) {
      throw new Error(`No data available for ticker: ${upperTicker}`);
    }

    console.log('Yahoo Finance response:', quote);

    const marketData = {
      ticker: upperTicker,
      currentPrice: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      pe: quote.trailingPE || 0,
      high52Week: quote.fiftyTwoWeekHigh || 0,
      low52Week: quote.fiftyTwoWeekLow || 0,
      timestamp: new Date().toISOString()
    };

    console.log('Processed market data:', marketData);

    return new Response(
      JSON.stringify(marketData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in market-data function:', error);

    // Return fallback data with error indication
    const fallbackData = {
      ticker: requestBody?.ticker?.toUpperCase() || 'UNKNOWN',
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0,
      pe: 0,
      high52Week: 0,
      low52Week: 0,
      timestamp: new Date().toISOString(),
      error: error.message
    };

    return new Response(
      JSON.stringify(fallbackData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
