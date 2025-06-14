
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

const SuperInvestorTracker = () => {
  const [investorData, setInvestorData] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState('warren_buffett');
  const { loading, getSuperInvestorData } = useReports();

  useEffect(() => {
    loadInvestorData();
  }, [selectedInvestor]);

  const loadInvestorData = async () => {
    try {
      const data = await getSuperInvestorData(selectedInvestor);
      setInvestorData(data.data);
    } catch (error) {
      console.error('Error loading investor data:', error);
    }
  };

  const investors = [
    { id: 'warren_buffett', name: 'Warren Buffett' },
    { id: 'cathie_wood', name: 'Cathie Wood' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Super Investor Tracker</h2>
        <div className="flex space-x-2">
          {investors.map((investor) => (
            <Button
              key={investor.id}
              variant={selectedInvestor === investor.id ? 'default' : 'outline'}
              onClick={() => setSelectedInvestor(investor.id)}
              size="sm"
            >
              {investor.name}
            </Button>
          ))}
        </div>
      </div>

      {investorData && (
        <div className="space-y-6">
          <Card className="financial-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">{investorData.name}</h3>
                  <p className="text-muted-foreground">Portfolio Performance</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-profit">
                  {investorData.performance?.ytd_return}
                </div>
                <div className="text-sm text-muted-foreground">YTD Return</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-lg font-semibold">{investorData.performance?.five_year_cagr}</div>
                <div className="text-sm text-muted-foreground">5-Year CAGR</div>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-lg font-semibold">{investorData.recent_moves?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Recent Moves</div>
              </div>
            </div>
          </Card>

          <Card className="financial-card">
            <h4 className="text-lg font-semibold mb-4">Recent Portfolio Changes</h4>
            <div className="space-y-4">
              {investorData.recent_moves?.map((move, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {move.action === 'increased' ? (
                        <TrendingUp className="h-5 w-5 text-profit" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-loss" />
                      )}
                      <span className="font-bold">{move.ticker}</span>
                    </div>
                    <Badge variant={move.action === 'increased' ? 'default' : 'secondary'}>
                      {move.action}
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">
                      {move.shares_change > 0 ? '+' : ''}{move.shares_change.toLocaleString()} shares
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {move.portfolio_weight} of portfolio
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SuperInvestorTracker;
