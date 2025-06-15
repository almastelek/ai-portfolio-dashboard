
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReportPersistence } from '@/hooks/useReportPersistence';
import { FileText, Trash2, Calendar, Clock } from 'lucide-react';

interface SavedReportsHistoryProps {
  onSelectReport: (report: any) => void;
  currentReportType?: 'morning' | 'evening' | 'weekly';
}

const SavedReportsHistory: React.FC<SavedReportsHistoryProps> = ({ 
  onSelectReport, 
  currentReportType 
}) => {
  const { savedReports, loading, deleteReport } = useReportPersistence();

  const filteredReports = currentReportType 
    ? savedReports.filter(report => report.report_type === currentReportType)
    : savedReports;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-100 text-blue-800';
      case 'evening': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading saved reports...</span>
        </div>
      </Card>
    );
  }

  if (filteredReports.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Reports</h3>
          <p className="text-muted-foreground">
            {currentReportType 
              ? `You haven't saved any ${currentReportType} reports yet.`
              : "You haven't saved any reports yet."
            }
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        Saved Reports {currentReportType && `(${currentReportType})`}
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 cursor-pointer" onClick={() => onSelectReport(report.content)}>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getReportTypeColor(report.report_type)}>
                    {report.report_type}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(report.generated_at)}
                  </span>
                </div>
                
                <h4 className="font-medium text-sm mb-1 hover:text-primary transition-colors">
                  {report.title}
                </h4>
                
                <div className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Saved {formatDate(report.created_at)}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReport(report.id);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedReportsHistory;
