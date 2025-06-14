
import React from 'react';
import { TrendingUp } from 'lucide-react';

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <TrendingUp className="h-12 w-12 text-primary mx-auto animate-pulse" />
        <div className="text-lg">Loading your investment dashboard...</div>
      </div>
    </div>
  );
};

export default DashboardLoading;
