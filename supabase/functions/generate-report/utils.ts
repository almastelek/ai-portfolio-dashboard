
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const calculatePortfolioMetrics = (holdings: any[]) => {
  const totalValue = holdings.reduce((sum, h) => sum + (Number(h.shares) * Number(h.avg_cost)), 0)
  const totalHoldings = holdings.length
  const avgHoldingValue = totalHoldings > 0 ? totalValue / totalHoldings : 0

  return { totalValue, totalHoldings, avgHoldingValue }
}

export const analyzeSectors = (holdings: any[]) => {
  return holdings.reduce((acc, h) => {
    const sector = h.sector || 'Unknown'
    if (!acc[sector]) {
      acc[sector] = { count: 0, value: 0, tickers: [] }
    }
    acc[sector].count += 1
    acc[sector].value += Number(h.shares) * Number(h.avg_cost)
    acc[sector].tickers.push(h.ticker)
    return acc
  }, {} as Record<string, any>)
}

export const getLargestPositions = (holdings: any[]) => {
  return holdings.map(h => ({
    ticker: h.ticker,
    company: h.company_name,
    value: Number(h.shares) * Number(h.avg_cost),
    shares: Number(h.shares),
    sector: h.sector,
    avgCost: Number(h.avg_cost)
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5)
}
