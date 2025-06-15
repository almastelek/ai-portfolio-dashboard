
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, calculatePortfolioMetrics, analyzeSectors, getLargestPositions } from './utils.ts'
import { fetchUserPortfolios, fetchHoldings, fetchNews } from './dataFetcher.ts'
import { generateMorningReport, generateEveningReport, generateWeeklyReport } from './reportGenerators.ts'
import { buildEmptyPortfolioResponse, buildNoHoldingsResponse, buildSuccessResponse, buildErrorResponse } from './responseBuilder.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { reportType = 'morning' } = await req.json()

    console.log(`Generating ${reportType} report for user ${user.user.id}`)

    // Fetch user's portfolios
    const portfolios = await fetchUserPortfolios(supabaseClient, user.user.id)

    if (!portfolios || portfolios.length === 0) {
      console.log('No portfolios found for user')
      return buildEmptyPortfolioResponse(reportType)
    }

    const portfolio = portfolios[0]
    console.log(`Using portfolio: ${portfolio.id} - ${portfolio.name}`)

    // Fetch holdings
    const holdings = await fetchHoldings(supabaseClient, portfolios)

    if (!holdings || holdings.length === 0) {
      console.log('No holdings found for user portfolios')
      return buildNoHoldingsResponse(reportType)
    }

    // Get news for the user's holdings
    const tickers = holdings.map(h => h.ticker)
    console.log(`Fetching news for tickers: ${tickers.join(', ')}`)
    
    const allNews = await fetchNews(supabaseClient, tickers)

    // Calculate portfolio metrics
    const { totalValue, totalHoldings, avgHoldingValue } = calculatePortfolioMetrics(holdings)
    console.log(`Portfolio metrics: ${totalHoldings} holdings, $${totalValue.toLocaleString()} total value`)

    // Analyze sectors and positions
    const sectorAnalysis = analyzeSectors(holdings)
    const largestPositions = getLargestPositions(holdings)

    // Generate report based on type
    let report = {}
    
    if (reportType === 'morning') {
      report = generateMorningReport(totalHoldings, totalValue, sectorAnalysis, largestPositions, allNews, tickers)
    } else if (reportType === 'evening') {
      report = generateEveningReport(totalHoldings, totalValue, largestPositions, allNews)
    } else if (reportType === 'weekly') {
      report = generateWeeklyReport(totalHoldings, totalValue, sectorAnalysis, largestPositions, allNews)
    }

    console.log(`Generated comprehensive ${reportType} report for user ${user.user.id} with ${totalHoldings} holdings totaling $${totalValue.toLocaleString()}`)

    return buildSuccessResponse(report)
  } catch (error) {
    console.error('Error generating report:', error)
    return buildErrorResponse(error)
  }
})
