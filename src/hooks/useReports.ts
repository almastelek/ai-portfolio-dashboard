
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReport = async (reportType: 'morning' | 'evening' | 'weekly') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { reportType }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSuperInvestorData = async (investor?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('super-investor-data', {
        body: { investor }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching super investor data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch super investor data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alertData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('alerts-engine', {
        body: { action: 'create', alertData }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Alert created successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateReport,
    getSuperInvestorData,
    createAlert,
  };
};
