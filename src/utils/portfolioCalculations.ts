
import { EnrichedHolding, RealTimePortfolio } from '../types/realTimePortfolio';

export const calculateEnrichedHolding = (
  holding: any,
  marketData: Map<string, any>
): EnrichedHolding => {
  const marketInfo = marketData.get(holding.ticker);
  const currentPrice = marketInfo?.currentPrice || Number(holding.avg_cost);
  const dayChangePercent = marketInfo?.changePercent || 0;
  
  const shares = Number(holding.shares);
  const avgCost = Number(holding.avg_cost);
  const marketValue = shares * currentPrice;
  const costBasis = shares * avgCost;
  const unrealizedPnL = marketValue - costBasis;
  const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;
  const dayChange = marketValue * (dayChangePercent / 100);

  return {
    id: holding.id,
    ticker: holding.ticker,
    companyName: holding.company_name,
    shares,
    avgCost,
    currentPrice,
    marketValue,
    unrealizedPnL,
    unrealizedPnLPercent,
    dayChange,
    dayChangePercent,
    sector: holding.sector || 'Unknown',
    weight: 0 // Will be calculated after we have totalValue
  };
};

export const calculatePortfolioTotals = (
  holdings: any[],
  marketData: Map<string, any>,
  portfolios: any[],
  portfolioId?: string
): RealTimePortfolio | null => {
  if (!holdings || holdings.length === 0 || !portfolios || portfolios.length === 0) {
    return null;
  }

  const currentPortfolio = portfolios.find(p => p.id === portfolioId) || portfolios[0];
  
  let totalValue = 0;
  let totalCost = 0;
  let totalDayChange = 0;

  const enrichedHoldings: EnrichedHolding[] = holdings.map(holding => {
    const enriched = calculateEnrichedHolding(holding, marketData);
    
    totalValue += enriched.marketValue;
    totalCost += enriched.shares * enriched.avgCost;
    totalDayChange += enriched.dayChange;

    return enriched;
  });

  // Calculate weights
  enrichedHoldings.forEach(holding => {
    holding.weight = totalValue > 0 ? (holding.marketValue / totalValue) * 100 : 0;
  });

  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
  const dayChangePercent = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0;

  return {
    id: currentPortfolio.id,
    name: currentPortfolio.name,
    totalValue,
    totalCost,
    totalPnL,
    totalPnLPercent,
    dayChange: totalDayChange,
    dayChangePercent,
    holdings: enrichedHoldings,
    lastUpdated: new Date()
  };
};
