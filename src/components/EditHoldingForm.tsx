
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';

const editHoldingSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required'),
  company_name: z.string().min(1, 'Company name is required'),
  shares: z.number().positive('Shares must be positive'),
  avg_cost: z.number().positive('Average cost must be positive'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  sector: z.string().min(1, 'Sector is required'),
});

type EditHoldingFormData = z.infer<typeof editHoldingSchema>;

interface Holding {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost: number;
  purchase_date: string;
  sector: string;
}

interface EditHoldingFormProps {
  holding: Holding | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const sectors = [
  'Technology',
  'Healthcare',
  'Finance',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Materials',
  'Industrials',
  'Utilities',
  'Real Estate',
  'Communication Services',
];

const EditHoldingForm: React.FC<EditHoldingFormProps> = ({
  holding,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateHolding } = usePortfolio();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditHoldingFormData>({
    resolver: zodResolver(editHoldingSchema),
  });

  React.useEffect(() => {
    if (holding && isOpen) {
      setValue('ticker', holding.ticker);
      setValue('company_name', holding.company_name);
      setValue('shares', holding.shares);
      setValue('avg_cost', holding.avg_cost);
      setValue('purchase_date', holding.purchase_date);
      setValue('sector', holding.sector);
    }
  }, [holding, isOpen, setValue]);

  const selectedSector = watch('sector');

  const onSubmit = async (data: EditHoldingFormData) => {
    if (!holding) return;

    setIsSubmitting(true);
    try {
      await updateHolding(holding.id, data);
      toast({
        title: 'Success',
        description: 'Holding updated successfully',
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating holding:', error);
      toast({
        title: 'Error',
        description: 'Failed to update holding',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Holding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="ticker">Ticker Symbol</Label>
            <Input
              id="ticker"
              {...register('ticker')}
              placeholder="e.g., AAPL"
              className="uppercase"
            />
            {errors.ticker && (
              <p className="text-sm text-red-500">{errors.ticker.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              {...register('company_name')}
              placeholder="e.g., Apple Inc."
            />
            {errors.company_name && (
              <p className="text-sm text-red-500">{errors.company_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shares">Shares</Label>
              <Input
                id="shares"
                type="number"
                step="0.000001"
                {...register('shares', { valueAsNumber: true })}
                placeholder="100"
              />
              {errors.shares && (
                <p className="text-sm text-red-500">{errors.shares.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="avg_cost">Average Cost</Label>
              <Input
                id="avg_cost"
                type="number"
                step="0.01"
                {...register('avg_cost', { valueAsNumber: true })}
                placeholder="150.00"
              />
              {errors.avg_cost && (
                <p className="text-sm text-red-500">{errors.avg_cost.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              {...register('purchase_date')}
            />
            {errors.purchase_date && (
              <p className="text-sm text-red-500">{errors.purchase_date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sector">Sector</Label>
            <Select value={selectedSector} onValueChange={(value) => setValue('sector', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sector && (
              <p className="text-sm text-red-500">{errors.sector.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Holding'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHoldingForm;
