
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReports } from '@/hooks/useReports';
import { Bell, Plus, AlertTriangle } from 'lucide-react';

const AlertsManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [alertForm, setAlertForm] = useState({
    ticker: '',
    type: 'price_above',
    value: '',
    message: ''
  });
  const { loading, createAlert } = useReports();

  const handleCreateAlert = async () => {
    try {
      await createAlert(alertForm);
      setAlertForm({ ticker: '', type: 'price_above', value: '', message: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const alertTypes = [
    { value: 'price_above', label: 'Price Above' },
    { value: 'price_below', label: 'Price Below' },
    { value: 'volume_spike', label: 'Volume Spike' },
    { value: 'news_mention', label: 'News Mention' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Alerts & Monitoring</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {showCreateForm && (
        <Card className="financial-card">
          <h3 className="text-lg font-semibold mb-4">Create New Alert</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ticker">Ticker Symbol</Label>
                <Input
                  id="ticker"
                  value={alertForm.ticker}
                  onChange={(e) => setAlertForm({ ...alertForm, ticker: e.target.value })}
                  placeholder="e.g., AAPL"
                />
              </div>
              <div>
                <Label htmlFor="type">Alert Type</Label>
                <Select value={alertForm.type} onValueChange={(value) => setAlertForm({ ...alertForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alertTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="value">Trigger Value</Label>
              <Input
                id="value"
                type="number"
                value={alertForm.value}
                onChange={(e) => setAlertForm({ ...alertForm, value: e.target.value })}
                placeholder="e.g., 150.00"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Custom Message</Label>
              <Input
                id="message"
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                placeholder="Optional custom alert message"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleCreateAlert} disabled={loading}>
                Create Alert
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">Price Alerts</h3>
              <p className="text-sm text-muted-foreground">Monitor price movements</p>
            </div>
          </div>
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-muted-foreground">Active alerts</div>
        </Card>

        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <h3 className="font-semibold">Volume Alerts</h3>
              <p className="text-sm text-muted-foreground">Unusual volume activity</p>
            </div>
          </div>
          <div className="text-2xl font-bold">1</div>
          <div className="text-sm text-muted-foreground">Triggered today</div>
        </Card>

        <Card className="financial-card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">News Alerts</h3>
              <p className="text-sm text-muted-foreground">Breaking news mentions</p>
            </div>
          </div>
          <div className="text-2xl font-bold">7</div>
          <div className="text-sm text-muted-foreground">This week</div>
        </Card>
      </div>
    </div>
  );
};

export default AlertsManager;
