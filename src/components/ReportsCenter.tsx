
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { FileText, TrendingUp, Clock, Users, ExternalLink } from 'lucide-react';

interface ReportSection {
  title: string;
  content?: string;
  articles?: Array<{
    headline: string;
    source: string;
    url?: string;
  }>;
  holdings_count?: number;
  watchlist_alerts?: any[];
  companies?: string[];
  daily_change?: string;
  percent_change?: string;
  winners?: string[];
  losers?: string[];
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
      <div className="space-y-3">
        {section.content && (
          <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
        )}
        
        {section.holdings_count !== undefined && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Holdings:</span>
            <Badge variant="secondary">{section.holdings_count}</Badge>
          </div>
        )}

        {section.daily_change && section.percent_change && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Daily Change:</span>
              <span className={`text-sm font-semibold ${
                section.daily_change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {section.daily_change}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Percentage:</span>
              <span className={`text-sm font-semibold ${
                section.percent_change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {section.percent_change}
              </span>
            </div>
          </div>
        )}

        {section.companies && section.companies.length > 0 && (
          <div>
            <span className="text-sm font-medium mb-2 block">Companies:</span>
            <div className="flex flex-wrap gap-2">
              {section.companies.map((company, idx) => (
                <Badge key={idx} variant="outline">{company}</Badge>
              ))}
            </div>
          </div>
        )}

        {section.winners && section.winners.length > 0 && (
          <div>
            <span className="text-sm font-medium mb-2 block text-green-600">Winners:</span>
            <div className="flex flex-wrap gap-2">
              {section.winners.map((winner, idx) => (
                <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                  {winner}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {section.losers && section.losers.length > 0 && (
          <div>
            <span className="text-sm font-medium mb-2 block text-red-600">Losers:</span>
            <div className="flex flex-wrap gap-2">
              {section.losers.map((loser, idx) => (
                <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800">
                  {loser}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {section.articles && section.articles.length > 0 && (
          <div>
            <span className="text-sm font-medium mb-2 block">Top Headlines:</span>
            <div className="space-y-2">
              {section.articles.slice(0, 5).map((article, idx) => (
                <div key={idx} className="border-l-2 border-primary/20 pl-3 py-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium leading-snug">{article.headline}</h5>
                      <span className="text-xs text-muted-foreground">{article.source}</span>
                    </div>
                    {article.url && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground ml-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports Center</h2>
        <Badge variant="secondary">
          <Clock className="h-4 w-4 mr-1" />
          Auto-generated daily
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">Morning Brief</h3>
              <p className="text-sm text-muted-foreground">Pre-market overview</p>
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
              <p className="text-sm text-muted-foreground">Market close summary</p>
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
            <Users className="h-8 w-8 text-purple-500" />
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
            
            <div className="space-y-6">
              {activeReport.sections && Object.entries(activeReport.sections).map(([key, section]) => (
                <div key={key} className="border-l-4 border-primary pl-6 py-2">
                  <h4 className="font-semibold mb-3 text-lg">{section.title}</h4>
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
              Generate your first report using one of the buttons above to get started with AI-powered market analysis.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsCenter;
