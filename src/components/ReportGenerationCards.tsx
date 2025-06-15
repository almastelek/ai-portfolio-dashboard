
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, BarChart3 } from 'lucide-react';

interface ReportGenerationCardsProps {
  loading: boolean;
  onGenerateReport: (type: 'morning' | 'evening' | 'weekly') => void;
}

const ReportGenerationCards: React.FC<ReportGenerationCardsProps> = ({ 
  loading, 
  onGenerateReport 
}) => {
  return (
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
          onClick={() => onGenerateReport('morning')}
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
          onClick={() => onGenerateReport('evening')}
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
          onClick={() => onGenerateReport('weekly')}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Weekly Report'}
        </Button>
      </Card>
    </div>
  );
};

export default ReportGenerationCards;
