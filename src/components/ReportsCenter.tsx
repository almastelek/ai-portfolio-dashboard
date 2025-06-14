
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { FileText, TrendingUp, Clock, Users } from 'lucide-react';

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
      const report = await generateReport(type);
      setActiveReport(report.report);
    } catch (error) {
      console.error('Error generating report:', error);
    }
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
            Generate Morning Report
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
            Generate Evening Report
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
            Generate Weekly Report
          </Button>
        </Card>
      </div>

      {activeReport && (
        <Card className="financial-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{activeReport.title}</h3>
              <Badge>{activeReport.type}</Badge>
            </div>
            
            <div className="space-y-4">
              {Object.entries(activeReport.sections).map(([key, section]) => (
                <div key={key} className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">{section.title}</h4>
                  {section.content && (
                    <p className="text-muted-foreground">{section.content}</p>
                  )}
                  {section.articles && (
                    <div className="space-y-2">
                      {section.articles.slice(0, 3).map((article, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{article.headline}</span>
                          <span className="text-muted-foreground ml-2">{article.source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsCenter;
