
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, DollarSign } from 'lucide-react';
import ReportSectionRenderer from './ReportSectionRenderer';

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

interface ReportDisplayProps {
  activeReport: Report | null;
  saveLoading: boolean;
  onSaveReport: () => void;
  onGenerateNew: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ 
  activeReport, 
  saveLoading, 
  onSaveReport, 
  onGenerateNew 
}) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!activeReport) {
    return (
      <Card className="financial-card">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Report Selected</h3>
          <p className="text-muted-foreground mb-4">
            Generate a new report or select one from your saved reports.
          </p>
          <Button onClick={onGenerateNew}>
            Generate New Report
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="financial-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-xl font-bold">{activeReport.title}</h3>
            <p className="text-sm text-muted-foreground">
              Generated on {formatTimestamp(activeReport.generated_at)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{activeReport.type.replace('_', ' ').toUpperCase()}</Badge>
            <Button
              onClick={onSaveReport}
              disabled={saveLoading}
              variant="outline"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveLoading ? 'Saving...' : 'Save Report'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          {activeReport.sections && Object.entries(activeReport.sections).map(([key, section]) => (
            <div key={key} className="border-l-4 border-primary pl-6 py-2">
              <h4 className="font-semibold mb-4 text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                {section.title}
              </h4>
              <ReportSectionRenderer section={section} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ReportDisplay;
