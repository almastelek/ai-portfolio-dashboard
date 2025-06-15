
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Target, Calendar, Clock, AlertCircle } from 'lucide-react';

interface ReportSection {
  title: string;
  content?: string;
  articles?: Array<{
    headline: string;
    source: string;
    url?: string;
  }>;
  holdings_count?: number;
  tickers?: string;
  top_sectors?: string[];
  avg_position_size?: string;
  companies?: string[];
  daily_change?: string;
  percent_change?: string;
  winners?: string[];
  losers?: string[];
  your_sectors?: string[];
  total_value?: string;
  sectors?: number;
  trending_sectors?: string[];
  events?: string[];
  performance_metrics?: Record<string, string | number>;
  daily_metrics?: {
    total_pnl?: string;
    percent_change?: string;
  };
  holdings_breakdown?: Array<{
    ticker: string;
    company: string;
    shares: string;
    avg_cost: string;
    current_value: string;
    sector: string;
    weight: string;
  }>;
  position_analysis?: Array<{
    ticker: string;
    company: string;
    day_change?: string;
    portfolio_impact: string;
  }>;
  sector_exposure?: Array<{
    sector: string;
    holdings: number;
    allocation: string;
  }>;
  specific_news?: Array<{
    ticker: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    published: string;
    headline: string;
    source: string;
    summary?: string;
  }>;
  general_news?: Array<{
    headline: string;
    source: string;
    impact_level: string;
  }>;
  key_themes?: string[];
  weekly_themes?: string[];
  economic_calendar?: string[];
  priorities?: string[];
  watch_items?: string[];
  risk_factors?: string[];
  market_performance?: Array<{
    index: string;
    weekly_return: string;
    driver: string;
  }>;
}

interface ReportSectionRendererProps {
  section: ReportSection;
}

const ReportSectionRenderer: React.FC<ReportSectionRendererProps> = ({ section }) => {
  return (
    <div className="space-y-4">
      {section.content && (
        <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
      )}
      
      {/* Performance Metrics */}
      {section.performance_metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          {Object.entries(section.performance_metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-sm text-muted-foreground capitalize">
                {key.replace('_', ' ')}
              </div>
              <div className="font-semibold">{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Daily Metrics */}
      {section.daily_metrics && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Daily P&L</div>
            <div className={`font-semibold ${section.daily_metrics.total_pnl?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {section.daily_metrics.total_pnl}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Percent Change</div>
            <div className={`font-semibold ${section.daily_metrics.percent_change?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {section.daily_metrics.percent_change}
            </div>
          </div>
        </div>
      )}

      {/* Holdings Breakdown */}
      {section.holdings_breakdown && section.holdings_breakdown.length > 0 && (
        <div>
          <h5 className="font-medium mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Top Holdings Breakdown
          </h5>
          <div className="space-y-2">
            {section.holdings_breakdown.map((holding, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{holding.ticker}</span>
                    <Badge variant="outline" className="text-xs">{holding.weight}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{holding.company}</div>
                  <div className="text-xs text-muted-foreground">
                    {holding.shares} shares @ ${holding.avg_cost}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{holding.current_value}</div>
                  <div className="text-xs text-muted-foreground">{holding.sector}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Position Analysis */}
      {section.position_analysis && section.position_analysis.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Daily Position Performance</h5>
          <div className="space-y-2">
            {section.position_analysis.map((position, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div>
                  <div className="font-medium">{position.ticker}</div>
                  <div className="text-sm text-muted-foreground">{position.company}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${position.day_change?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {position.day_change}
                  </div>
                  <div className="text-sm text-muted-foreground">{position.portfolio_impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sector Exposure */}
      {section.sector_exposure && section.sector_exposure.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Sector Allocation</h5>
          <div className="space-y-2">
            {section.sector_exposure.map((sector, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted/10 rounded">
                <div>
                  <span className="font-medium">{sector.sector}</span>
                  <span className="text-sm text-muted-foreground ml-2">({sector.holdings} holdings)</span>
                </div>
                <Badge variant="secondary">{sector.allocation}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specific News */}
      {section.specific_news && section.specific_news.length > 0 && (
        <div>
          <h5 className="font-medium mb-3 flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Holdings News
          </h5>
          <div className="space-y-3">
            {section.specific_news.map((news, idx) => (
              <div key={idx} className="border-l-4 border-primary/20 pl-4 py-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{news.ticker}</Badge>
                    <Badge 
                      variant={news.sentiment === 'Positive' ? 'default' : news.sentiment === 'Negative' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {news.sentiment}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{news.published}</span>
                </div>
                <h6 className="font-medium text-sm leading-snug mb-1">{news.headline}</h6>
                <p className="text-xs text-muted-foreground mb-1">{news.source}</p>
                {news.summary && (
                  <p className="text-xs text-muted-foreground italic">{news.summary}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General News */}
      {section.general_news && section.general_news.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Market Catalysts</h5>
          <div className="space-y-2">
            {section.general_news.map((news, idx) => (
              <div key={idx} className="p-3 bg-muted/10 rounded-lg">
                <h6 className="font-medium text-sm mb-1">{news.headline}</h6>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>{news.impact_level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Themes */}
      {section.key_themes && section.key_themes.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Key Market Themes</h5>
          <ul className="space-y-2">
            {section.key_themes.map((theme, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly Themes */}
      {section.weekly_themes && section.weekly_themes.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Week's Major Themes</h5>
          <ul className="space-y-2">
            {section.weekly_themes.map((theme, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Economic Calendar */}
      {section.economic_calendar && section.economic_calendar.length > 0 && (
        <div>
          <h5 className="font-medium mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Economic Calendar
          </h5>
          <div className="space-y-2">
            {section.economic_calendar.map((event, idx) => (
              <div key={idx} className="flex items-center p-2 bg-muted/10 rounded">
                <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                <span className="text-sm">{event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watch Items/Priorities */}
      {section.priorities && section.priorities.length > 0 && (
        <div>
          <h5 className="font-medium mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Action Items
          </h5>
          <ul className="space-y-2">
            {section.priorities.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Watch Items */}
      {section.watch_items && section.watch_items.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Tomorrow's Watch List</h5>
          <ul className="space-y-1">
            {section.watch_items.map((item, idx) => (
              <li key={idx} className="text-sm flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Factors */}
      {section.risk_factors && section.risk_factors.length > 0 && (
        <div>
          <h5 className="font-medium mb-3 text-orange-600">Risk Factors</h5>
          <ul className="space-y-1">
            {section.risk_factors.map((risk, idx) => (
              <li key={idx} className="text-sm flex items-center text-orange-700">
                <AlertCircle className="w-3 h-3 mr-2" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Market Performance */}
      {section.market_performance && section.market_performance.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Index Performance</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {section.market_performance.map((index, idx) => (
              <div key={idx} className="p-3 bg-muted/10 rounded-lg text-center">
                <div className="font-medium">{index.index}</div>
                <div className={`text-lg font-bold ${index.weekly_return.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {index.weekly_return}
                </div>
                <div className="text-xs text-muted-foreground">{index.driver}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for other arrays and content */}
      {Object.entries(section).map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || !value) return null;
        if (Array.isArray(value) && value.length > 0 && !key.includes('breakdown') && !key.includes('analysis') && !key.includes('news') && !key.includes('themes') && !key.includes('calendar') && !key.includes('priorities') && !key.includes('performance') && !key.includes('exposure')) {
          return (
            <div key={key}>
              <h5 className="font-medium mb-2 capitalize">{key.replace('_', ' ')}</h5>
              <ul className="space-y-1">
                {value.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-center">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2"></div>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        return null;
      })}
    </div>
  );
};

export default ReportSectionRenderer;
