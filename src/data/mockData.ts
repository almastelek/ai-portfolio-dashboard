
import { Portfolio, MarketSummary } from '../types/portfolio';

export const mockPortfolio: Portfolio = {
  id: '1',
  name: 'Main Portfolio',
  totalValue: 847592.34,
  totalCost: 752000.00,
  totalPnL: 95592.34,
  totalPnLPercent: 12.71,
  dayChange: 3247.82,
  dayChangePercent: 0.38,
  holdings: [
    {
      id: '1',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      shares: 250,
      avgCost: 172.50,
      currentPrice: 189.42,
      marketValue: 47355.00,
      unrealizedPnL: 4230.00,
      unrealizedPnLPercent: 9.81,
      dayChange: 512.50,
      dayChangePercent: 1.09,
      sector: 'Technology',
      weight: 5.59
    },
    {
      id: '2',
      ticker: 'MSFT',
      companyName: 'Microsoft Corporation',
      shares: 150,
      avgCost: 285.20,
      currentPrice: 312.78,
      marketValue: 46917.00,
      unrealizedPnL: 4137.00,
      unrealizedPnLPercent: 9.69,
      dayChange: 375.00,
      dayChangePercent: 0.81,
      sector: 'Technology',
      weight: 5.54
    },
    {
      id: '3',
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      shares: 85,
      avgCost: 420.15,
      currentPrice: 478.23,
      marketValue: 40649.55,
      unrealizedPnL: 4936.80,
      unrealizedPnLPercent: 13.84,
      dayChange: 680.00,
      dayChangePercent: 1.70,
      sector: 'Technology',
      weight: 4.80
    },
    {
      id: '4',
      ticker: 'TSLA',
      companyName: 'Tesla, Inc.',
      shares: 120,
      avgCost: 201.80,
      currentPrice: 218.75,
      marketValue: 26250.00,
      unrealizedPnL: 2034.00,
      unrealizedPnLPercent: 8.40,
      dayChange: -360.00,
      dayChangePercent: -1.36,
      sector: 'Consumer Discretionary',
      weight: 3.10
    },
    {
      id: '5',
      ticker: 'AMZN',
      companyName: 'Amazon.com, Inc.',
      shares: 180,
      avgCost: 138.90,
      currentPrice: 151.23,
      marketValue: 27221.40,
      unrealizedPnL: 2219.40,
      unrealizedPnLPercent: 8.88,
      dayChange: 270.00,
      dayChangePercent: 1.01,
      sector: 'Consumer Discretionary',
      weight: 3.21
    },
    {
      id: '6',
      ticker: 'GOOGL',
      companyName: 'Alphabet Inc.',
      shares: 220,
      avgCost: 124.75,
      currentPrice: 139.82,
      marketValue: 30760.40,
      unrealizedPnL: 3315.40,
      unrealizedPnLPercent: 12.08,
      dayChange: 440.00,
      dayChangePercent: 1.45,
      sector: 'Communication Services',
      weight: 3.63
    },
    {
      id: '7',
      ticker: 'META',
      companyName: 'Meta Platforms, Inc.',
      shares: 95,
      avgCost: 285.60,
      currentPrice: 321.45,
      marketValue: 30537.75,
      unrealizedPnL: 3405.75,
      unrealizedPnLPercent: 12.57,
      dayChange: 285.00,
      dayChangePercent: 0.94,
      sector: 'Communication Services',
      weight: 3.60
    },
    {
      id: '8',
      ticker: 'JPM',
      companyName: 'JPMorgan Chase & Co.',
      shares: 175,
      avgCost: 142.30,
      currentPrice: 158.92,
      marketValue: 27811.00,
      unrealizedPnL: 2908.50,
      unrealizedPnLPercent: 11.67,
      dayChange: 175.00,
      dayChangePercent: 0.63,
      sector: 'Financials',
      weight: 3.28
    },
    {
      id: '9',
      ticker: 'JNJ',
      companyName: 'Johnson & Johnson',
      shares: 200,
      avgCost: 165.20,
      currentPrice: 172.85,
      marketValue: 34570.00,
      unrealizedPnL: 1530.00,
      unrealizedPnLPercent: 4.63,
      dayChange: 200.00,
      dayChangePercent: 0.58,
      sector: 'Healthcare',
      weight: 4.08
    },
    {
      id: '10',
      ticker: 'SPY',
      companyName: 'SPDR S&P 500 ETF Trust',
      shares: 500,
      avgCost: 412.80,
      currentPrice: 445.67,
      marketValue: 222835.00,
      unrealizedPnL: 16435.00,
      unrealizedPnLPercent: 7.97,
      dayChange: 1000.00,
      dayChangePercent: 0.45,
      sector: 'ETF',
      weight: 26.29
    }
  ]
};

export const mockMarketSummary: MarketSummary = {
  sp500: {
    value: 4456.24,
    change: 18.67,
    changePercent: 0.42
  },
  nasdaq: {
    value: 13845.22,
    change: 72.15,
    changePercent: 0.52
  },
  dow: {
    value: 34890.85,
    change: 145.82,
    changePercent: 0.42
  },
  vix: {
    value: 16.85,
    change: -0.72,
    changePercent: -4.10
  }
};
