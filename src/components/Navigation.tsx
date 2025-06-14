
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Bell, 
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  PieChart
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'investors', label: 'Investors', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'research', label: 'Research', icon: Search },
  ];

  const quickActions = [
    { 
      label: 'Add Holding', 
      icon: Plus, 
      action: () => {
        // Find and click the existing Add Holding button
        const addButton = document.querySelector('[data-testid="add-holding-button"]') as HTMLButtonElement;
        if (addButton) {
          addButton.click();
        } else {
          // Fallback: scroll to holdings section
          const holdingsSection = document.querySelector('[data-section="holdings"]');
          if (holdingsSection) {
            holdingsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    },
    { 
      label: 'View Performance', 
      icon: TrendingUp, 
      action: () => onTabChange('reports')
    },
    { 
      label: 'Market Analysis', 
      icon: PieChart, 
      action: () => onTabChange('research')
    },
    { 
      label: 'Portfolio Value', 
      icon: DollarSign, 
      action: () => {
        // Scroll to portfolio overview
        const portfolioSection = document.querySelector('[data-section="portfolio-overview"]');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Menu */}
      <Card className="financial-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="financial-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={action.action}
                  className="flex items-center space-x-3 w-full justify-start px-3 py-2 h-auto"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Market Status */}
      <Card className="financial-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Market Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-profit">Open</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next Close</span>
              <span className="text-sm">4:00 PM EST</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Navigation;
