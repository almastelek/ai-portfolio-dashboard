
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

const Navigation = () => {
  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '#dashboard',
      active: true
    },
    {
      icon: TrendingUp,
      label: 'Portfolio',
      href: '#portfolio'
    },
    {
      icon: Eye,
      label: 'Watchlist',
      href: '#watchlist'
    },
    {
      icon: FileText,
      label: 'Reports',
      href: '#reports',
      badge: 'New'
    },
    {
      icon: Users,
      label: 'Super Investors',
      href: '#super-investors',
      badge: 'New'
    },
    {
      icon: Brain,
      label: 'AI Ideas',
      href: '#ai-ideas'
    },
    {
      icon: Bell,
      label: 'Alerts',
      href: '#alerts',
      badge: 'New'
    },
    {
      icon: BarChart3,
      label: 'Research',
      href: '#research'
    },
    {
      icon: Calculator,
      label: 'Valuation',
      href: '#valuation'
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
          return (
            <Button
              key={index}
              variant={item.active ? 'default' : 'ghost'}
              className="w-full justify-start relative"
              size="sm"
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
