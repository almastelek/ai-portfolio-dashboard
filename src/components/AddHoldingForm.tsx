
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';

interface AddHoldingFormProps {
  portfolioId: string;
  onSuccess?: () => void;
}

const AddHoldingForm: React.FC<AddHoldingFormProps> = ({ portfolioId, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticker: '',
    company_name: '',
    shares: '',
    avg_cost: '',
    purchase_date: '',
    sector: ''
  });
  const [loading, setLoading] = useState(false);
  const { addHolding } = usePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addHolding(portfolioId, {
        ticker: formData.ticker.toUpperCase(),
        company_name: formData.company_name,
        shares: parseFloat(formData.shares),
        avg_cost: parseFloat(formData.avg_cost),
        purchase_date: formData.purchase_date,
        sector: formData.sector
      });

      setFormData({
        ticker: '',
        company_name: '',
        shares: '',
        avg_cost: '',
        purchase_date: '',
        sector: ''
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding holding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Holding</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Holding</DialogTitle>
        </DialogHeader>
        <Card className="financial-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker Symbol *</Label>
                <Input
                  id="ticker"
                  value={formData.ticker}
                  onChange={(e) => handleInputChange('ticker', e.target.value)}
                  placeholder="AAPL"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shares">Shares *</Label>
                <Input
                  id="shares"
                  type="number"
                  step="0.000001"
                  value={formData.shares}
                  onChange={(e) => handleInputChange('shares', e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Apple Inc."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avg_cost">Average Cost *</Label>
                <Input
                  id="avg_cost"
                  type="number"
                  step="0.01"
                  value={formData.avg_cost}
                  onChange={(e) => handleInputChange('avg_cost', e.target.value)}
                  placeholder="150.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date *</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                placeholder="Technology"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Holding'}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AddHoldingForm;
