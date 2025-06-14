
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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { reportType = 'morning' } = await req.json()

    // Get user's portfolio data
    const { data: portfolios } = await supabaseClient
      .from('portfolios')
      .select(`
        *,
        holdings (*)
      `)
      .eq('user_id', user.user.id)

    // Get recent market news
    const { data: news } = await supabaseClient
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(10)

    // Generate report based on type
    let report = {};
    
    if (reportType === 'morning') {
      report = {
        type: 'morning_report',
        title: 'Morning Market Brief',
        generated_at: new Date().toISOString(),
        sections: {
          market_summary: {
            title: 'Market Overview',
            content: 'Pre-market futures are showing mixed signals with S&P 500 futures up 0.2%...'
          },
          portfolio_highlights: {
            title: 'Your Portfolio Today',
            holdings_count: portfolios?.[0]?.holdings?.length || 0,
            watchlist_alerts: []
          },
          top_news: {
            title: 'Key Headlines',
            articles: news?.slice(0, 5) || []
          },
          earnings_today: {
            title: 'Earnings Today',
            companies: ['AAPL', 'GOOGL', 'MSFT'] // Mock data
          }
        }
      }
    } else if (reportType === 'evening') {
      report = {
        type: 'evening_recap',
        title: 'Market Close Recap',
        generated_at: new Date().toISOString(),
        sections: {
          market_performance: {
            title: 'Market Performance',
            content: 'Markets closed mixed today with the Dow up 0.3% while Nasdaq declined 0.1%...'
          },
          portfolio_performance: {
            title: 'Your Portfolio Performance',
            daily_change: '+$1,234.56',
            percent_change: '+1.2%'
          },
          sector_highlights: {
            title: 'Sector Highlights',
            winners: ['Technology', 'Healthcare'],
            losers: ['Energy', 'Utilities']
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error generating report:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
