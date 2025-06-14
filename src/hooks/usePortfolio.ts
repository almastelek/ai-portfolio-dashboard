
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Portfolio {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Holding {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost: number;
  purchase_date: string;
  sector: string;
  portfolio_id: string;
}

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPortfolios = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error: any) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolios",
        variant: "destructive",
      });
    }
  };

  const fetchHoldings = async (portfolioId: string) => {
    try {
      const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('ticker', { ascending: true });

      if (error) throw error;
      setHoldings(data || []);
    } catch (error: any) {
      console.error('Error fetching holdings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch holdings",
        variant: "destructive",
      });
    }
  };

  const addHolding = async (portfolioId: string, holding: Omit<Holding, 'id' | 'portfolio_id'>) => {
    try {
      const { data, error } = await supabase
        .from('holdings')
        .insert([{ ...holding, portfolio_id: portfolioId }])
        .select()
        .single();

      if (error) throw error;

      setHoldings(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Holding added successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding holding:', error);
      toast({
        title: "Error",
        description: "Failed to add holding",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateHolding = async (holdingId: string, updates: Partial<Holding>) => {
    try {
      const { data, error } = await supabase
        .from('holdings')
        .update(updates)
        .eq('id', holdingId)
        .select()
        .single();

      if (error) throw error;

      setHoldings(prev => prev.map(h => h.id === holdingId ? data : h));
      toast({
        title: "Success",
        description: "Holding updated successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating holding:', error);
      toast({
        title: "Error",
        description: "Failed to update holding",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteHolding = async (holdingId: string) => {
    try {
      const { error } = await supabase
        .from('holdings')
        .delete()
        .eq('id', holdingId);

      if (error) throw error;

      setHoldings(prev => prev.filter(h => h.id !== holdingId));
      toast({
        title: "Success",
        description: "Holding deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting holding:', error);
      toast({
        title: "Error",
        description: "Failed to delete holding",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPortfolios();
      setLoading(false);
    } else {
      setPortfolios([]);
      setHoldings([]);
      setLoading(false);
    }
  }, [user]);

  return {
    portfolios,
    holdings,
    loading,
    fetchHoldings,
    addHolding,
    updateHolding,
    deleteHolding,
    refetchPortfolios: fetchPortfolios,
  };
};
