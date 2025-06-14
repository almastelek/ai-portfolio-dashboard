
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

    // Get user's portfolio data with holdings
    const { data: portfolios } = await supabaseClient
      .from('portfolios')
      .select(`
        *,
        holdings (*)
      `)
      .eq('user_id', user.user.id)

    const portfolio = portfolios?.[0]
    const holdings = portfolio?.holdings || []

    // Get recent market news
    const { data: news } = await supabaseClient
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(10)

    // Calculate portfolio metrics
    const totalHoldings = holdings.length
    const tickers = holdings.map(h => h.ticker).join(', ')
    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.avg_cost), 0)
    const avgHoldingValue = totalHoldings > 0 ? totalValue / totalHoldings : 0

    // Get top sectors
    const sectorCounts = holdings.reduce((acc, h) => {
      acc[h.sector] = (acc[h.sector] || 0) + 1
      return acc
    }, {})
    const topSectors = Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sector]) => sector)

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
            content: 'Pre-market futures are showing mixed signals. Key levels to watch as markets open...'
          },
          portfolio_highlights: {
            title: 'Your Portfolio Today',
            content: totalHoldings > 0 
              ? `You have ${totalHoldings} holdings with a total invested value of $${totalValue.toLocaleString()}.`
              : 'No holdings found. Consider adding some positions to start tracking.',
            holdings_count: totalHoldings,
            tickers: tickers || 'None',
            top_sectors: topSectors,
            avg_position_size: `$${avgHoldingValue.toLocaleString()}`
          },
          watchlist_alerts: {
            title: 'Market Movers to Watch',
            content: holdings.length > 0 
              ? `Monitor your holdings: ${tickers}. Check for any pre-market movement.`
              : 'Add holdings to get personalized watchlist alerts.',
            companies: holdings.slice(0, 5).map(h => h.ticker)
          },
          top_news: {
            title: 'Key Headlines',
            articles: news?.slice(0, 5).map(article => ({
              headline: article.headline,
              source: article.source,
              url: article.url
            })) || []
          }
        }
      }
    } else if (reportType === 'evening') {
      // Calculate simple day performance (mock calculation)
      const mockDayChange = (Math.random() - 0.5) * 1000 // Random between -500 and +500
      const mockPercentChange = totalValue > 0 ? (mockDayChange / totalValue) * 100 : 0

      report = {
        type: 'evening_recap',
        title: 'Market Close Recap',
        generated_at: new Date().toISOString(),
        sections: {
          market_performance: {
            title: 'Market Performance',
            content: 'Markets closed mixed today with varying sector performance. Tech showed resilience while energy faced headwinds.'
          },
          portfolio_performance: {
            title: 'Your Portfolio Performance',
            content: totalHoldings > 0 
              ? `Your portfolio of ${totalHoldings} holdings closed the day.`
              : 'No portfolio data available.',
            daily_change: `${mockDayChange >= 0 ? '+' : ''}$${Math.abs(mockDayChange).toFixed(2)}`,
            percent_change: `${mockPercentChange >= 0 ? '+' : ''}${mockPercentChange.toFixed(2)}%`,
            holdings_count: totalHoldings
          },
          sector_highlights: {
            title: 'Sector Highlights',
            content: topSectors.length > 0 
              ? `Your top sectors: ${topSectors.join(', ')}`
              : 'Diversify across sectors for better risk management.',
            winners: ['Technology', 'Healthcare'],
            losers: ['Energy', 'Utilities'],
            your_sectors: topSectors
          },
          holdings_summary: {
            title: 'Holdings Breakdown',
            content: holdings.length > 0 
              ? `${holdings.length} positions across ${Object.keys(sectorCounts).length} sectors`
              : 'No holdings to analyze',
            tickers: tickers
          }
        }
      }
    } else if (reportType === 'weekly') {
      report = {
        type: 'weekly_digest',
        title: 'Weekly Market Digest',
        generated_at: new Date().toISOString(),
        sections: {
          weekly_overview: {
            title: 'Week in Review',
            content: 'This week saw significant market movements driven by economic data and earnings reports.'
          },
          portfolio_analysis: {
            title: 'Portfolio Performance Analysis',
            content: totalHoldings > 0 
              ? `Your ${totalHoldings} holdings performed across various market conditions this week.`
              : 'Build your portfolio to start receiving weekly analysis.',
            holdings_count: totalHoldings,
            total_value: `$${totalValue.toLocaleString()}`,
            sectors: Object.keys(sectorCounts).length
          },
          market_trends: {
            title: 'Key Market Trends',
            content: 'Weekly analysis shows continued volatility in growth stocks while value names found support.',
            trending_sectors: topSectors.length > 0 ? topSectors : ['Technology', 'Healthcare', 'Finance']
          },
          upcoming_events: {
            title: 'Week Ahead',
            content: 'Key events to watch: Fed meeting minutes, major earnings releases, economic indicators.',
            events: [
              'Fed Meeting Minutes - Wednesday',
              'Key Earnings Releases',
              'Economic Data: CPI, Employment'
            ]
          }
        }
      }
    }

    console.log(`Generated ${reportType} report for user ${user.user.id} with ${totalHoldings} holdings`)

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
