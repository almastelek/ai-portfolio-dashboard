import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { FileText, TrendingUp, Clock, Users, ExternalLink, BarChart3, AlertCircle, Target, Calendar, DollarSign } from 'lucide-react';

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

interface Report {
  type: string;
  title: string;
  generated_at: string;
  sections: Record<string, ReportSection>;
}

const ReportsCenter = () => {
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const { loading, generateReport } = useReports();

  const handleGenerateReport = async (type: 'morning' | 'evening' | 'weekly') => {
    try {
      const response = await generateReport(type);
      console.log('Generated report response:', response);
      if (response && response.report) {
        setActiveReport(response.report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderSectionContent = (section: ReportSection) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports Center</h2>
        <Badge variant="secondary">
          <Clock className="h-4 w-4 mr-1" />
          Real-time analysis
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">Morning Brief</h3>
              <p className="text-sm text-muted-foreground">Pre-market analysis with portfolio focus</p>
            </div>
          </div>
          <Button 
            onClick={() => handleGenerateReport('morning')}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Morning Report'}
          </Button>
        </Card>

        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">Evening Recap</h3>
              <p className="text-sm text-muted-foreground">Daily performance & news impact</p>
            </div>
          </div>
          <Button 
            onClick={() => handleGenerateReport('evening')}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Evening Report'}
          </Button>
        </Card>

        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold">Weekly Digest</h3>
              <p className="text-sm text-muted-foreground">Comprehensive weekly analysis</p>
            </div>
          </div>
          <Button 
            onClick={() => handleGenerateReport('weekly')}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Weekly Report'}
          </Button>
        </Card>
      </div>

      {activeReport && (
        <Card className="financial-card">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold">{activeReport.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Generated on {formatTimestamp(activeReport.generated_at)}
                </p>
              </div>
              <Badge variant="outline">{activeReport.type.replace('_', ' ').toUpperCase()}</Badge>
            </div>
            
            <div className="space-y-8">
              {activeReport.sections && Object.entries(activeReport.sections).map(([key, section]) => (
                <div key={key} className="border-l-4 border-primary pl-6 py-2">
                  <h4 className="font-semibold mb-4 text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    {section.title}
                  </h4>
                  {renderSectionContent(section)}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {!activeReport && (
        <Card className="financial-card">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Generated Yet</h3>
            <p className="text-muted-foreground">
              Generate your first report to get AI-powered analysis of your portfolio with real market data and news insights.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsCenter;
