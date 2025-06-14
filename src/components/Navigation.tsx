import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Plus,
  DollarSign,
  Settings,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddHoldingForm from './AddHoldingForm';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  portfolioId?: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, portfolioId }) => {
  const navigate = useNavigate();
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [nextMarketClose, setNextMarketClose] = useState<string>('');
  const [showAddHolding, setShowAddHolding] = useState(false);

  useEffect(() => {
    const checkMarketHours = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const estHour = (hour + 24 - 5) % 24; // Convert to EST (UTC-5)

      // Check if it's a weekday (1-5)
      const isWeekday = day >= 1 && day <= 5;
      
      // Market hours: 9:30 AM - 4:00 PM EST
      const isOpen = isWeekday && 
        ((estHour > 9) || (estHour === 9 && minute >= 30)) && 
        (estHour < 16);

      setIsMarketOpen(isOpen);

      // Calculate next market close
      if (isOpen) {
        setNextMarketClose('4:00 PM EST');
      } else if (isWeekday && estHour < 9) {
        setNextMarketClose('9:30 AM EST');
      } else {
        // Find next weekday
        const daysUntilNextWeekday = day === 0 ? 1 : day === 6 ? 2 : 0;
        setNextMarketClose(`Monday 9:30 AM EST`);
      }
    };

    checkMarketHours();
    const interval = setInterval(checkMarketHours, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'investors', label: 'Investors', icon: PieChart },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'research', label: 'Research', icon: PieChart },
  ];

  const handleAddHolding = () => {
    setShowAddHolding(true);
  };

  const handlePortfolioValue = () => {
    if (portfolioId) {
      navigate(`/portfolio/${portfolioId}`);
    }
  };

  return (
    <div className="space-y-6">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Card className="financial-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleAddHolding}
              disabled={!portfolioId}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Holding
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handlePortfolioValue}
              disabled={!portfolioId}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Portfolio Value
            </Button>
          </div>
        </div>
      </Card>

      <Card className="financial-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Market Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`text-sm font-medium ${isMarketOpen ? 'text-profit' : 'text-loss'}`}>
                {isMarketOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next {isMarketOpen ? 'Close' : 'Open'}</span>
              <span className="text-sm">{nextMarketClose}</span>
            </div>
          </div>
        </div>
      </Card>

      {showAddHolding && portfolioId && (
        <Dialog open={showAddHolding} onOpenChange={setShowAddHolding}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Holding</DialogTitle>
            </DialogHeader>
            <AddHoldingForm
              portfolioId={portfolioId}
              onSuccess={() => {
                setShowAddHolding(false);
                window.location.reload();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Navigation;
