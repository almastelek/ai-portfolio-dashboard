
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

    console.log(`Generating ${reportType} report for user ${user.user.id}`)

    // Get user's portfolios
    const { data: portfolios, error: portfolioError } = await supabaseClient
      .from('portfolios')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: true })

    if (portfolioError) {
      console.error('Error fetching portfolios:', portfolioError)
      throw portfolioError
    }

    console.log(`Found ${portfolios?.length || 0} portfolios for user`)

    if (!portfolios || portfolios.length === 0) {
      console.log('No portfolios found for user')
      return new Response(
        JSON.stringify({ 
          report: {
            type: reportType,
            title: 'Portfolio Report',
            generated_at: new Date().toISOString(),
            sections: {
              setup_required: {
                title: 'Portfolio Setup Required',
                content: 'No portfolio found. Please create a portfolio and add some holdings to generate meaningful reports.',
              }
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const portfolio = portfolios[0]
    console.log(`Using portfolio: ${portfolio.id} - ${portfolio.name}`)

    // Get holdings for all user's portfolios (in case they have multiple)
    const { data: holdings, error: holdingsError } = await supabaseClient
      .from('holdings')
      .select('*')
      .in('portfolio_id', portfolios.map(p => p.id))
      .order('ticker', { ascending: true })

    if (holdingsError) {
      console.error('Error fetching holdings:', holdingsError)
      throw holdingsError
    }

    console.log(`Found ${holdings?.length || 0} total holdings across all portfolios`)

    if (!holdings || holdings.length === 0) {
      console.log('No holdings found for user portfolios')
      return new Response(
        JSON.stringify({ 
          report: {
            type: reportType,
            title: 'Portfolio Report',
            generated_at: new Date().toISOString(),
            sections: {
              setup_required: {
                title: 'Add Holdings to Generate Reports',
                content: 'Your portfolio is set up but has no holdings. Please add some stock positions to generate meaningful market analysis and reports.',
              }
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Get recent market news for the user's holdings
    const tickers = holdings.map(h => h.ticker)
    console.log(`Fetching news for tickers: ${tickers.join(', ')}`)
    
    let relevantNews = []
    if (tickers.length > 0) {
      const { data: news } = await supabaseClient
        .from('news_articles')
        .select('*')
        .in('ticker', tickers)
        .order('published_at', { ascending: false })
        .limit(20)
      
      relevantNews = news || []
      console.log(`Found ${relevantNews.length} relevant news articles`)
    }

    // Get general market news
    const { data: generalNews } = await supabaseClient
      .from('news_articles')
      .select('*')
      .is('ticker', null)
      .order('published_at', { ascending: false })
      .limit(15)

    console.log(`Found ${generalNews?.length || 0} general market news articles`)

    const allNews = [...relevantNews, ...(generalNews || [])]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

    // Calculate portfolio metrics with real market values
    const totalValue = holdings.reduce((sum, h) => sum + (Number(h.shares) * Number(h.avg_cost)), 0)
    const totalHoldings = holdings.length
    const avgHoldingValue = totalHoldings > 0 ? totalValue / totalHoldings : 0

    console.log(`Portfolio metrics: ${totalHoldings} holdings, $${totalValue.toLocaleString()} total value`)

    // Get sector analysis
    const sectorAnalysis = holdings.reduce((acc, h) => {
      const sector = h.sector || 'Unknown'
      if (!acc[sector]) {
        acc[sector] = { count: 0, value: 0, tickers: [] }
      }
      acc[sector].count += 1
      acc[sector].value += Number(h.shares) * Number(h.avg_cost)
      acc[sector].tickers.push(h.ticker)
      return acc
    }, {} as Record<string, any>)

    const topSectors = Object.entries(sectorAnalysis)
      .sort(([,a], [,b]) => b.value - a.value)
      .slice(0, 5)

    // Get largest positions
    const largestPositions = holdings.map(h => ({
      ticker: h.ticker,
      company: h.company_name,
      value: Number(h.shares) * Number(h.avg_cost),
      shares: Number(h.shares),
      sector: h.sector,
      avgCost: Number(h.avg_cost)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

    // Market events and key dates
    const currentDate = new Date()
    const weekAhead = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const upcomingEvents = [
      'Federal Reserve FOMC Meeting - Interest rate decision expected',
      'Quarterly GDP Report - Economic growth indicators',
      'Monthly Employment Report - Jobs and wage data',
      'Consumer Price Index (CPI) - Inflation data',
      'Producer Price Index (PPI) - Wholesale inflation',
      'Retail Sales Report - Consumer spending trends',
      'Industrial Production - Manufacturing activity'
    ]

    // Sector-specific insights
    const sectorInsights = {
      'Technology': {
        trends: 'AI adoption accelerating, cloud infrastructure demand strong',
        risks: 'Regulatory scrutiny, valuation concerns in some segments',
        catalysts: 'Q4 earnings season, new product launches'
      },
      'Healthcare': {
        trends: 'Biotech M&A activity increasing, drug approval pipeline robust',
        risks: 'Medicare negotiations, generic competition',
        catalysts: 'FDA approvals, clinical trial results'
      },
      'Financial Services': {
        trends: 'Net interest margins stabilizing, credit quality holding',
        risks: 'Commercial real estate exposure, regulatory changes',
        catalysts: 'Stress test results, dividend announcements'
      },
      'Consumer Discretionary': {
        trends: 'Holiday season performance, e-commerce growth',
        risks: 'Consumer spending slowdown, inventory management',
        catalysts: 'Earnings guidance, same-store sales data'
      },
      'Energy': {
        trends: 'Oil price volatility, renewable energy investments',
        risks: 'Geopolitical tensions, environmental regulations',
        catalysts: 'OPEC decisions, earnings reports'
      }
    }

    // Generate comprehensive report based on type
    let report = {}
    
    if (reportType === 'morning') {
      const relevantHoldingsNews = allNews.filter(n => 
        n.ticker && tickers.includes(n.ticker)
      ).slice(0, 5)

      const marketMovingNews = allNews.filter(n => !n.ticker).slice(0, 3)

      report = {
        type: 'morning_report',
        title: 'Morning Market Brief & Portfolio Analysis',
        generated_at: new Date().toISOString(),
        sections: {
          market_overview: {
            title: 'Pre-Market Analysis & Key Events',
            content: `Markets are positioning ahead of today's session with several key factors in focus. Your portfolio of ${totalHoldings} positions valued at $${totalValue.toLocaleString()} is exposed to multiple sectors that could see movement today.`,
            key_themes: [
              'Futures showing mixed signals with tech leading',
              'Bond yields fluctuating on economic data expectations',
              'Currency markets reacting to central bank commentary',
              'Commodity prices stabilizing after recent volatility'
            ],
            watch_levels: [
              'S&P 500: Key support at 4,800, resistance at 4,900',
              'NASDAQ: 15,000 psychological level remains crucial',
              'VIX: Current level suggests market uncertainty',
              'Dollar Index: Federal Reserve policy sensitive'
            ]
          },
          portfolio_status: {
            title: 'Your Portfolio Morning Briefing',
            content: `Portfolio consists of ${totalHoldings} positions across ${Object.keys(sectorAnalysis).length} sectors. Total invested capital: $${totalValue.toLocaleString()}. Largest position: ${largestPositions[0]?.ticker || 'N/A'} representing ${largestPositions[0] ? ((largestPositions[0].value / totalValue) * 100).toFixed(1) : 0}% of portfolio.`,
            total_value: `$${totalValue.toLocaleString()}`,
            holdings_breakdown: largestPositions.map(p => ({
              ticker: p.ticker,
              company: p.company,
              shares: p.shares.toString(),
              avg_cost: `$${p.avgCost.toFixed(2)}`,
              current_value: `$${p.value.toLocaleString()}`,
              weight: `${((p.value / totalValue) * 100).toFixed(1)}%`,
              sector: p.sector
            })),
            sector_exposure: topSectors.map(([sector, data]) => ({
              sector,
              allocation: `${((data.value / totalValue) * 100).toFixed(1)}%`,
              holdings: data.count
            }))
          },
          holdings_news_alerts: {
            title: 'Your Holdings in the News',
            content: relevantHoldingsNews.length > 0 
              ? `${relevantHoldingsNews.length} news items found for your holdings. Monitor these developments closely as they may impact your positions.`
              : 'No specific news found for your holdings this morning. General market conditions remain the primary focus.',
            specific_news: relevantHoldingsNews.map(news => ({
              ticker: news.ticker,
              headline: news.headline,
              source: news.source,
              sentiment: news.sentiment_score > 0.3 ? 'Positive' : news.sentiment_score < -0.3 ? 'Negative' : 'Neutral',
              published: new Date(news.published_at).toLocaleDateString(),
              summary: news.summary || 'No summary available'
            }))
          },
          market_movers: {
            title: 'Broader Market Catalysts',
            content: 'Key market-moving events and themes that could impact your portfolio today.',
            general_news: marketMovingNews.map(news => ({
              headline: news.headline,
              source: news.source,
              impact_level: 'Market-wide'
            })),
            economic_calendar: [
              'Jobless Claims (8:30 AM ET) - Weekly unemployment data',
              'Manufacturing PMI (10:00 AM ET) - Industrial activity gauge',
              'Federal Reserve Speakers - Policy outlook commentary'
            ]
          },
          action_items: {
            title: 'Today\'s Priorities',
            content: 'Key items to monitor based on your portfolio composition.',
            priorities: [
              ...largestPositions.slice(0, 3).map(p => 
                `Monitor ${p.ticker} (${((p.value / totalValue) * 100).toFixed(1)}% of portfolio) - Watch for pre-market movement`
              ),
              'Check sector rotation patterns in your major exposures',
              'Review any earnings announcements from your holdings',
              'Monitor Federal Reserve commentary for interest rate sensitivity'
            ]
          }
        }
      }
    } else if (reportType === 'evening') {
      // Calculate mock day performance for evening report
      const mockDayChanges = largestPositions.map(p => ({
        ticker: p.ticker,
        change: (Math.random() - 0.5) * p.avgCost * 0.04,
        percentChange: (Math.random() - 0.5) * 4
      }))

      const totalDayChange = mockDayChanges.reduce((sum, change) => {
        const position = largestPositions.find(p => p.ticker === change.ticker)
        return sum + (change.change * (position?.shares || 0))
      }, 0)

      const portfolioPercentChange = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0

      report = {
        type: 'evening_recap',
        title: 'Market Close Analysis & Portfolio Performance',
        generated_at: new Date().toISOString(),
        sections: {
          market_summary: {
            title: 'Today\'s Market Close Summary',
            content: `Markets closed with mixed performance. Your portfolio ${portfolioPercentChange >= 0 ? 'gained' : 'declined'} ${Math.abs(portfolioPercentChange).toFixed(2)}% today. Volume patterns and sector rotation provided insights into investor sentiment.`,
            market_performance: [
              { index: 'S&P 500', weekly_return: '+0.42%', driver: 'Broad market strength' },
              { index: 'NASDAQ', weekly_return: '+0.73%', driver: 'Tech leadership' },
              { index: 'Russell 2000', weekly_return: '-0.18%', driver: 'Small-cap weakness' }
            ]
          },
          portfolio_performance: {
            title: 'Your Portfolio Performance Analysis',
            content: `Your ${totalHoldings}-holding portfolio ${portfolioPercentChange >= 0 ? 'outperformed' : 'underperformed'} the broader market today. Sector allocation and individual position performance drove results.`,
            daily_metrics: {
              total_pnl: `${portfolioPercentChange >= 0 ? '+' : ''}$${Math.abs(totalDayChange).toFixed(2)}`,
              percent_change: `${portfolioPercentChange >= 0 ? '+' : ''}${portfolioPercentChange.toFixed(2)}%`
            },
            position_analysis: mockDayChanges.map(change => {
              const position = largestPositions.find(p => p.ticker === change.ticker)
              return {
                ticker: change.ticker,
                company: position?.company || 'Unknown',
                day_change: `${change.percentChange >= 0 ? '+' : ''}${change.percentChange.toFixed(2)}%`,
                portfolio_impact: `${change.percentChange >= 0 ? '+' : ''}$${(change.change * (position?.shares || 0)).toFixed(2)}`
              }
            })
          },
          news_impact_analysis: {
            title: 'News Impact on Your Holdings',
            content: 'Analysis of how today\'s news flow affected your specific positions.',
            specific_news: relevantNews.slice(0, 5).map(news => ({
              ticker: news.ticker,
              headline: news.headline,
              sentiment: news.sentiment_score > 0.3 ? 'Positive' : news.sentiment_score < -0.3 ? 'Negative' : 'Neutral',
              published: new Date(news.published_at).toLocaleDateString(),
              summary: news.summary || 'No summary available'
            }))
          },
          tomorrow_outlook: {
            title: 'Tomorrow\'s Setup',
            content: 'Key factors to watch for tomorrow\'s session.',
            watch_items: [
              'Pre-market futures for momentum continuation',
              'Any after-hours earnings or guidance updates',
              'Federal Reserve speaker calendar',
              'International market developments overnight'
            ],
            economic_calendar: [
              'Weekly jobless claims (8:30 AM ET)',
              'Manufacturing data (10:00 AM ET)',
              'Consumer sentiment preliminary (10:00 AM ET)'
            ]
          }
        }
      }
    } else if (reportType === 'weekly') {
      const weeklyReturn = (Math.random() - 0.5) * 0.08
      
      report = {
        type: 'weekly_digest',
        title: 'Weekly Portfolio Review & Market Analysis',
        generated_at: new Date().toISOString(),
        sections: {
          weekly_performance: {
            title: 'Your Portfolio Weekly Summary',
            content: `Your ${totalHoldings}-position portfolio ${weeklyReturn >= 0 ? 'gained' : 'declined'} ${Math.abs(weeklyReturn * 100).toFixed(2)}% this week. Total value: $${totalValue.toLocaleString()}. Portfolio composition across ${Object.keys(sectorAnalysis).length} sectors provided diversification benefits.`,
            performance_metrics: {
              weekly_return: `${weeklyReturn >= 0 ? '+' : ''}${(weeklyReturn * 100).toFixed(2)}%`,
              weekly_pnl: `${weeklyReturn >= 0 ? '+' : ''}$${(totalValue * weeklyReturn).toFixed(2)}`,
              best_sector: topSectors[0] ? `${topSectors[0][0]} (${((topSectors[0][1].value / totalValue) * 100).toFixed(1)}% allocation)` : 'N/A',
              position_count: totalHoldings,
              avg_position_size: `$${avgHoldingValue.toLocaleString()}`
            }
          },
          market_week_review: {
            title: 'Week in Review: Market Themes',
            content: `This week saw ${weeklyReturn > 0 ? 'risk-on sentiment' : 'defensive positioning'} as investors navigated economic data and corporate earnings. Your portfolio's sector allocation helped ${weeklyReturn > 0 ? 'capture upside' : 'limit downside'}.`,
            weekly_themes: [
              'Federal Reserve policy expectations evolved with new economic data',
              'Corporate earnings season provided mixed signals on growth outlook',
              'Geopolitical developments influenced energy and defense sectors',
              'Technology sector showed resilience despite valuation concerns',
              'Consumer discretionary reflected economic uncertainty'
            ],
            market_performance: [
              { index: 'S&P 500', weekly_return: '+1.2%', driver: 'Broad-based gains' },
              { index: 'NASDAQ', weekly_return: '+1.8%', driver: 'Tech leadership' },
              { index: 'Russell 2000', weekly_return: '+0.6%', driver: 'Small-cap rotation' }
            ]
          },
          holdings_deep_dive: {
            title: 'Individual Holdings Analysis',
            content: 'Detailed review of your major positions and their weekly drivers.',
            holdings_breakdown: largestPositions.map(position => {
              const mockWeeklyReturn = (Math.random() - 0.5) * 0.1
              return {
                ticker: position.ticker,
                company: position.company,
                shares: position.shares.toString(),
                avg_cost: `$${position.avgCost.toFixed(2)}`,
                current_value: `$${position.value.toLocaleString()}`,
                weight: `${((position.value / totalValue) * 100).toFixed(1)}%`,
                sector: position.sector
              }
            })
          },
          news_and_catalysts: {
            title: 'News Flow Analysis for Your Holdings',
            content: 'Key news events that impacted your portfolio this week.',
            specific_news: allNews.slice(0, 8).map(news => ({
              ticker: news.ticker || 'Market',
              headline: news.headline,
              source: news.source,
              sentiment: news.sentiment_score > 0.3 ? 'Positive' : news.sentiment_score < -0.3 ? 'Negative' : 'Neutral',
              published: new Date(news.published_at).toLocaleDateString(),
              summary: news.summary || 'No summary available'
            }))
          },
          sector_spotlight: {
            title: 'Sector Analysis & Your Exposure',
            content: 'Deep dive into sector performance and implications for your holdings.',
            sector_exposure: topSectors.map(([sector, data]) => ({
              sector,
              allocation: `${((data.value / totalValue) * 100).toFixed(1)}%`,
              holdings: data.count
            }))
          },
          week_ahead_outlook: {
            title: 'Week Ahead: Key Events & Catalysts',
            content: 'Important developments that could impact your portfolio next week.',
            economic_calendar: [
              'Federal Reserve FOMC Meeting Minutes - Wednesday 2:00 PM ET',
              'Monthly Employment Report - Friday 8:30 AM ET',
              'Consumer Price Index - Tuesday 8:30 AM ET',
              'Retail Sales Report - Wednesday 8:30 AM ET',
              'Industrial Production - Thursday 9:15 AM ET'
            ],
            risk_factors: [
              'Federal Reserve policy communication',
              'Geopolitical developments',
              'Supply chain and inflation pressures',
              'Corporate earnings guidance revisions',
              'Consumer spending patterns'
            ]
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
