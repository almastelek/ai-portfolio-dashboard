
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Settings,
  BookOpen,
  Users,
  Target
} from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = [
    { name: 'Portfolio', icon: PieChart, active: true, description: 'Main dashboard' },
    { name: 'Analytics', icon: BarChart3, active: false, description: 'Performance insights' },
    { name: 'Valuations', icon: Target, active: false, description: 'DCF & Comps' },
    { name: 'Reports', icon: Calendar, active: false, description: 'Daily & weekly reports' },
    { name: 'Trade Ideas', icon: TrendingUp, active: false, description: 'AI suggestions' },
    { name: 'Super Investors', icon: Users, active: false, description: 'Follow the smart money' },
    { name: 'Research', icon: BookOpen, active: false, description: 'News & analysis' },
    { name: 'Alerts', icon: Bell, active: false, description: 'Price & event alerts' },
    { name: 'Settings', icon: Settings, active: false, description: 'Preferences' }
  ];

  return (
    <Card className="financial-card p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-4">Investment Dashboard</h3>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                item.active 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.active ? 'text-primary' : ''}`} />
              <div className="flex-1">
                <p className={`font-medium ${item.active ? 'text-primary' : ''}`}>
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                  {item.description}
                </p>
              </div>
              {!item.active && (
                <div className="text-xs bg-muted/50 px-2 py-1 rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Coming Soon
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default Navigation;
