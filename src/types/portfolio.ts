
export interface Holding {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sector: string;
  weight: number;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: Holding[];
}

export interface MarketSummary {
  sp500: {
    value: number;
    change: number;
    changePercent: number;
  };
  nasdaq: {
    value: number;
    change: number;
    changePercent: number;
  };
  dow: {
    value: number;
    change: number;
    changePercent: number;
  };
  vix: {
    value: number;
    change: number;
    changePercent: number;
  };
}
