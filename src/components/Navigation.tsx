
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  TrendingUp, 
  Eye, 
  FileText, 
  Bell, 
  Users,
  Brain,
  BarChart3,
  Calculator
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      value: 'dashboard',
      badge: null
    },
    {
      icon: TrendingUp,
      label: 'Portfolio',
      value: 'dashboard', // For now, portfolio is part of dashboard
      badge: null
    },
    {
      icon: Eye,
      label: 'Watchlist',
      value: 'dashboard', // For now, watchlist is part of dashboard
      badge: null
    },
    {
      icon: FileText,
      label: 'Reports',
      value: 'reports',
      badge: 'New'
    },
    {
      icon: Users,
      label: 'Super Investors',
      value: 'investors',
      badge: 'New'
    },
    {
      icon: Brain,
      label: 'AI Ideas',
      value: 'dashboard', // For now, AI ideas is part of dashboard
      badge: null
    },
    {
      icon: Bell,
      label: 'Alerts',
      value: 'alerts',
      badge: 'New'
    },
    {
      icon: BarChart3,
      label: 'Research',
      value: 'research',
      badge: null
    },
    {
      icon: Calculator,
      label: 'Valuation',
      value: 'research', // For now, valuation is part of research
      badge: null
    }
  ];

  return (
    <Card className="financial-card">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Navigation
        </h3>
        
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.value;
          return (
            <Button
              key={index}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start relative"
              size="sm"
              onClick={() => onTabChange(item.value)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-border/50">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Add Holding
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Eye className="h-4 w-4 mr-2" />
            Add to Watchlist
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Bell className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;
