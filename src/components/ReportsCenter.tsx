
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { useReportPersistence } from '@/hooks/useReportPersistence';
import { Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SavedReportsHistory from './SavedReportsHistory';
import ReportGenerationCards from './ReportGenerationCards';
import ReportDisplay from './ReportDisplay';

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
  const [activeTab, setActiveTab] = useState('generate');
  const { loading, generateReport } = useReports();
  const { saveReport, loading: saveLoading } = useReportPersistence();

  const handleGenerateReport = async (type: 'morning' | 'evening' | 'weekly') => {
    try {
      const response = await generateReport(type);
      console.log('Generated report response:', response);
      if (response && response.report) {
        setActiveReport(response.report);
        setActiveTab('current');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleSaveReport = async () => {
    if (!activeReport) return;
    
    try {
      await saveReport(activeReport);
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleSelectSavedReport = (report: Report) => {
    setActiveReport(report);
    setActiveTab('current');
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="current">Current Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <ReportGenerationCards 
            loading={loading}
            onGenerateReport={handleGenerateReport}
          />
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          <ReportDisplay
            activeReport={activeReport}
            saveLoading={saveLoading}
            onSaveReport={handleSaveReport}
            onGenerateNew={() => setActiveTab('generate')}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <SavedReportsHistory onSelectReport={handleSelectSavedReport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsCenter;
