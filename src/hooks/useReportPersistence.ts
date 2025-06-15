
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface SavedReport {
  id: string;
  report_type: 'morning' | 'evening' | 'weekly';
  title: string;
  content: any;
  generated_at: string;
  created_at: string;
}

export const useReportPersistence = () => {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedReports = async (reportType?: 'morning' | 'evening' | 'weekly') => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      if (reportType) {
        query = query.eq('report_type', reportType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSavedReports(data || []);
    } catch (error: any) {
      console.error('Error fetching saved reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async (report: any) => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          user_id: user.id,
          report_type: report.type.replace('_report', '').replace('_recap', '').replace('_digest', ''),
          title: report.title,
          content: report,
          generated_at: report.generated_at
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report saved successfully",
      });

      // Refresh the saved reports list
      await fetchSavedReports();
      
      return data;
    } catch (error: any) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: "Failed to save report",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report deleted successfully",
      });

      // Refresh the saved reports list
      await fetchSavedReports();
    } catch (error: any) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedReports();
    }
  }, [user]);

  return {
    savedReports,
    loading,
    saveReport,
    deleteReport,
    fetchSavedReports,
  };
};
