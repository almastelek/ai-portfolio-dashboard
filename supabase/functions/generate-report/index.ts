
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
    const { data: portfolios, error: portfolioError } = await supabaseClient
      .from('portfolios')
      .select(`
        *,
        holdings (*)
      `)
      .eq('user_id', user.user.id)

    if (portfolioError) {
      console.error('Error fetching portfolios:', portfolioError)
    }

    const portfolio = portfolios?.[0]
    const holdings = portfolio?.holdings || []

    console.log(`Found ${holdings.length} holdings for user ${user.user.id}`)

    // Get recent market news
    const { data: news } = await supabaseClient
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20)

    // Calculate detailed portfolio metrics
    const totalHoldings = holdings.length
    const tickers = holdings.map(h => h.ticker).join(', ')
    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.avg_cost), 0)
    const avgHoldingValue = totalHoldings > 0 ? totalValue / totalHoldings : 0

    // Get sector analysis
    const sectorAnalysis = holdings.reduce((acc, h) => {
      const sector = h.sector || 'Unknown'
      if (!acc[sector]) {
        acc[sector] = { count: 0, value: 0, tickers: [] }
      }
      acc[sector].count += 1
      acc[sector].value += h.shares * h.avg_cost
      acc[sector].tickers.push(h.ticker)
      return acc
    }, {})

    const topSectors = Object.entries(sectorAnalysis)
      .sort(([,a], [,b]) => b.value - a.value)
      .slice(0, 5)

    // Get largest positions
    const largestPositions = holdings
      .map(h => ({
        ticker: h.ticker,
        company: h.company_name,
        value: h.shares * h.avg_cost,
        shares: h.shares,
        sector: h.sector
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Market events and news analysis
    const marketEvents = [
      'Federal Reserve Interest Rate Decision - Watch for monetary policy shifts',
      'Quarterly GDP Report - Economic growth indicators',
      'Monthly Jobs Report - Employment and wage growth data',
      'Inflation Data (CPI/PPI) - Price stability measures',
      'Corporate Earnings Season - Q4 2024 results rolling in'
    ]

    const sectorNews = {
      'Technology': 'AI adoption continues accelerating across enterprise software. Semiconductor demand remains strong despite supply chain concerns.',
      'Healthcare': 'Biotech sector showing renewed investor interest. Drug approval timelines remain a key catalyst for individual stocks.',
      'Finance': 'Banking sector benefiting from higher interest rate environment. Credit quality metrics remain stable.',
      'Consumer Discretionary': 'Retail earnings showing mixed results. E-commerce growth moderating but remains above pre-pandemic levels.',
      'Energy': 'Oil prices stabilizing around current levels. Renewable energy investments continue growing.'
    }

    // Generate report based on type
    let report = {};
    
    if (reportType === 'morning') {
      report = {
        type: 'morning_report',
        title: 'Morning Market Brief & Portfolio Analysis',
        generated_at: new Date().toISOString(),
        sections: {
          market_overview: {
            title: 'Pre-Market Analysis',
            content: `Futures are showing mixed signals ahead of today's session. Key economic data releases include jobless claims and manufacturing PMI. Major indices are positioned near key technical levels with increased volatility expected.`,
            key_levels: [
              'S&P 500: Watch 4,800 support and 4,900 resistance',
              'NASDAQ: 15,000 psychological level remains crucial',
              'VIX: Elevated above 20, indicating market uncertainty'
            ]
          },
          portfolio_status: {
            title: 'Your Portfolio Overview',
            content: totalHoldings > 0 
              ? `Your portfolio consists of ${totalHoldings} positions with a total invested capital of $${totalValue.toLocaleString()}. Your largest position represents ${largestPositions[0] ? ((largestPositions[0].value / totalValue) * 100).toFixed(1) : 0}% of your portfolio.`
              : 'Your portfolio is currently empty. Consider establishing positions in diversified sectors to begin building wealth.',
            total_value: `$${totalValue.toLocaleString()}`,
            holdings_count: totalHoldings,
            avg_position_size: `$${avgHoldingValue.toLocaleString()}`,
            largest_positions: largestPositions.map(p => ({
              ticker: p.ticker,
              company: p.company,
              value: `$${p.value.toLocaleString()}`,
              weight: `${((p.value / totalValue) * 100).toFixed(1)}%`
            }))
          },
          sector_exposure: {
            title: 'Sector Allocation Analysis',
            content: topSectors.length > 0 
              ? `Your portfolio shows concentration in ${topSectors[0][0]} (${((topSectors[0][1].value / totalValue) * 100).toFixed(1)}% allocation). Consider rebalancing if any single sector exceeds 25% of your portfolio.`
              : 'No sector data available. Diversification across sectors helps manage risk.',
            sectors: topSectors.map(([sector, data]) => ({
              name: sector,
              allocation: `${((data.value / totalValue) * 100).toFixed(1)}%`,
              value: `$${data.value.toLocaleString()}`,
              holdings: data.count,
              tickers: data.tickers.join(', ')
            }))
          },
          watchlist_alerts: {
            title: 'Positions to Monitor Today',
            content: holdings.length > 0 
              ? `Key tickers in your portfolio: ${tickers}. Monitor pre-market activity and any earnings announcements or analyst updates.`
              : 'Add holdings to receive personalized monitoring alerts.',
            priority_watches: largestPositions.slice(0, 3).map(p => ({
              ticker: p.ticker,
              reason: `Largest position (${((p.value / totalValue) * 100).toFixed(1)}% of portfolio)`,
              sector: p.sector
            }))
          },
          market_news: {
            title: 'Key Market Headlines',
            content: 'Top stories impacting markets today and your portfolio sectors.',
            articles: news?.slice(0, 6).map(article => ({
              headline: article.headline,
              source: article.source,
              relevance: article.ticker && holdings.some(h => h.ticker === article.ticker) ? 'Direct Impact' : 'Market Context',
              sentiment: article.sentiment_score > 0.3 ? 'Positive' : article.sentiment_score < -0.3 ? 'Negative' : 'Neutral'
            })) || []
          }
        }
      }
    } else if (reportType === 'evening') {
      // Calculate mock day performance with more realistic metrics
      const mockDayChanges = holdings.map(h => ({
        ticker: h.ticker,
        change: (Math.random() - 0.5) * h.avg_cost * 0.05, // +/- 2.5% max
        value: h.shares * h.avg_cost
      }))
      
      const totalDayChange = mockDayChanges.reduce((sum, h) => sum + (h.change * (h.value / totalValue)), 0)
      const mockPercentChange = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0

      report = {
        type: 'evening_recap',
        title: 'Market Close Analysis & Portfolio Performance',
        generated_at: new Date().toISOString(),
        sections: {
          market_summary: {
            title: 'Market Close Summary',
            content: `Markets closed with mixed performance today. Technology led gains while energy faced headwinds. Volume was ${Math.random() > 0.5 ? 'above' : 'below'} average, indicating ${Math.random() > 0.5 ? 'strong conviction' : 'cautious sentiment'} among institutional investors.`,
            indices_performance: [
              { name: 'S&P 500', change: '+0.34%', close: '4,847.23' },
              { name: 'NASDAQ', change: '+0.67%', close: '15,234.18' },
              { name: 'DOW', change: '-0.12%', close: '38,956.42' }
            ]
          },
          portfolio_performance: {
            title: 'Your Portfolio Performance Today',
            content: totalHoldings > 0 
              ? `Your portfolio ${mockPercentChange >= 0 ? 'gained' : 'declined'} ${Math.abs(mockPercentChange).toFixed(2)}% today, ${mockPercentChange > 0.5 ? 'outperforming' : mockPercentChange < -0.5 ? 'underperforming' : 'roughly matching'} the broader market.`
              : 'No portfolio performance data available.',
            daily_pnl: `${mockPercentChange >= 0 ? '+' : ''}$${Math.abs(totalDayChange).toFixed(2)}`,
            daily_return: `${mockPercentChange >= 0 ? '+' : ''}${mockPercentChange.toFixed(2)}%`,
            best_performer: largestPositions[0] ? {
              ticker: largestPositions[0].ticker,
              change: '+2.34%',
              impact: `+$${(largestPositions[0].value * 0.0234).toFixed(2)}`
            } : null,
            worst_performer: largestPositions[1] ? {
              ticker: largestPositions[1].ticker,
              change: '-1.12%',
              impact: `-$${(largestPositions[1].value * 0.0112).toFixed(2)}`
            } : null
          },
          sector_performance: {
            title: 'Sector Performance Impact',
            content: 'How today\'s sector movements affected your portfolio allocation.',
            sector_moves: topSectors.map(([sector, data]) => ({
              sector,
              performance: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 2).toFixed(2)}%`,
              your_exposure: `${((data.value / totalValue) * 100).toFixed(1)}%`,
              impact: sectorNews[sector] || 'Sector-specific news and trends to monitor.'
            }))
          },
          earnings_calendar: {
            title: 'Upcoming Earnings & Events',
            content: 'Companies in your portfolio or watchlist reporting soon.',
            upcoming_events: [
              ...holdings.slice(0, 3).map(h => `${h.ticker} - Expected next week`),
              'Federal Reserve Minutes - Wednesday 2:00 PM ET',
              'Key Economic Data: Weekly jobless claims Thursday'
            ]
          },
          after_hours_activity: {
            title: 'After-Hours Market Activity',
            content: 'Notable price movements and news after market close.',
            highlights: [
              'Futures pointing to mixed open tomorrow',
              'Several tech earnings beats driving after-hours gains',
              'Commodity prices stabilizing after recent volatility'
            ]
          }
        }
      }
    } else if (reportType === 'weekly') {
      const weeklyReturn = (Math.random() - 0.5) * 0.06 // +/- 3% for the week
      
      report = {
        type: 'weekly_digest',
        title: 'Weekly Market Digest & Portfolio Review',
        generated_at: new Date().toISOString(),
        sections: {
          weekly_market_review: {
            title: 'Week in Review',
            content: `This week saw ${weeklyReturn > 0 ? 'gains' : 'declines'} across major indices driven by ${Math.random() > 0.5 ? 'strong earnings results and positive economic data' : 'mixed economic signals and geopolitical concerns'}. Volatility ${Math.random() > 0.5 ? 'declined' : 'increased'} as investors digested corporate earnings and economic indicators.`,
            weekly_themes: [
              'Earnings season showing mixed but generally positive results',
              'Interest rate expectations continue to evolve',
              'Sector rotation from growth to value continuing',
              'International markets showing divergent trends'
            ]
          },
          portfolio_weekly_analysis: {
            title: 'Your Portfolio Weekly Performance',
            content: totalHoldings > 0 
              ? `Your ${totalHoldings}-position portfolio ${weeklyReturn >= 0 ? 'gained' : 'declined'} ${Math.abs(weeklyReturn * 100).toFixed(2)}% this week. Your sector allocation continues to serve you well with ${topSectors[0] ? topSectors[0][0] : 'diversified'} exposure providing ${weeklyReturn > 0 ? 'positive momentum' : 'defensive characteristics'}.`
              : 'Build your portfolio to start receiving detailed weekly performance analysis.',
            weekly_return: `${weeklyReturn >= 0 ? '+' : ''}${(weeklyReturn * 100).toFixed(2)}%`,
            weekly_pnl: `${weeklyReturn >= 0 ? '+' : ''}$${(totalValue * weeklyReturn).toFixed(2)}`,
            total_value: `$${totalValue.toLocaleString()}`,
            position_changes: 'No position changes this week',
            risk_metrics: {
              portfolio_beta: '1.12',
              sharpe_ratio: '0.87',
              max_drawdown: '3.4%'
            }
          },
          sector_spotlight: {
            title: 'Sector Analysis & Outlook',
            content: 'Deep dive into sector performance and your exposure.',
            detailed_analysis: topSectors.map(([sector, data]) => ({
              sector,
              your_allocation: `${((data.value / totalValue) * 100).toFixed(1)}%`,
              weekly_performance: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 4).toFixed(2)}%`,
              outlook: sectorNews[sector] || 'Monitor for sector-specific developments.',
              holdings: data.tickers
            }))
          },
          market_events_calendar: {
            title: 'Week Ahead: Key Events & Catalysts',
            content: 'Important events and data releases that could impact your portfolio.',
            major_events: marketEvents,
            earnings_calendar: holdings.slice(0, 5).map(h => ({
              ticker: h.ticker,
              company: h.company_name,
              date: 'TBD',
              impact: 'Monitor for guidance updates'
            })),
            economic_calendar: [
              'Federal Reserve Policy Meeting Minutes - Wednesday',
              'Monthly Employment Report - Friday',
              'Consumer Price Index - Next Tuesday',
              'Retail Sales Data - Mid-week'
            ]
          },
          portfolio_recommendations: {
            title: 'Strategic Recommendations',
            content: 'Actionable insights for portfolio optimization.',
            suggestions: [
              totalValue > 50000 ? 'Consider international diversification for large portfolio' : 'Focus on building core positions in quality companies',
              topSectors.length > 3 ? 'Well-diversified across sectors' : 'Consider adding exposure to defensive sectors',
              'Monitor position sizing - largest holding should not exceed 10% of portfolio',
              'Regular rebalancing helps maintain target allocation'
            ],
            risk_assessment: totalValue > 100000 ? 'Large portfolio - consider professional review' : 'Building phase - focus on diversification'
          }
        }
      }
    }

    console.log(`Generated comprehensive ${reportType} report for user ${user.user.id} with ${totalHoldings} holdings totaling $${totalValue.toLocaleString()}`)

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
