
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { investor, ticker } = await req.json()

    // Mock super investor data (in production, integrate with SEC EDGAR API)
    const superInvestorData = {
      warren_buffett: {
        name: 'Warren Buffett (Berkshire Hathaway)',
        recent_moves: [
          {
            ticker: 'AAPL',
            action: 'reduced',
            shares_change: -10000000,
            quarter: 'Q3 2024',
            current_position: 400000000,
            portfolio_weight: '47.6%'
          },
          {
            ticker: 'BAC',
            action: 'increased',
            shares_change: 5000000,
            quarter: 'Q3 2024',
            current_position: 1033000000,
            portfolio_weight: '13.2%'
          }
        ],
        performance: {
          ytd_return: '12.4%',
          five_year_cagr: '9.8%'
        }
      },
      cathie_wood: {
        name: 'Cathie Wood (ARK Invest)',
        recent_moves: [
          {
            ticker: 'TSLA',
            action: 'increased',
            shares_change: 50000,
            quarter: 'Q3 2024',
            current_position: 2500000,
            portfolio_weight: '8.9%'
          }
        ],
        performance: {
          ytd_return: '-5.2%',
          five_year_cagr: '15.6%'
        }
      }
    }

    const result = investor ? 
      superInvestorData[investor] || { error: 'Investor not found' } :
      superInvestorData

    return new Response(
      JSON.stringify({ data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error fetching super investor data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
