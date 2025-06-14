
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useEdgeFunctions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getMarketData = async (ticker: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { ticker }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateTradeIdeas = async (type = 'technical') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trade-ideas', {
        body: { type }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "AI trade ideas generated successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error generating trade ideas:', error);
      toast({
        title: "Error",
        description: "Failed to generate trade ideas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsSentiment = async (ticker?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('news-sentiment', {
        body: { ticker }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching news sentiment:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news sentiment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getMarketData,
    generateTradeIdeas,
    fetchNewsSentiment,
  };
};
