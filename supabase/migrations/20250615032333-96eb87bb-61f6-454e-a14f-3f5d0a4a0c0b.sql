
-- Create a table to store generated reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('morning', 'evening', 'weekly')),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own reports
CREATE POLICY "Users can view their own reports" 
  ON public.reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own reports
CREATE POLICY "Users can create their own reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own reports
CREATE POLICY "Users can update their own reports" 
  ON public.reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own reports
CREATE POLICY "Users can delete their own reports" 
  ON public.reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for faster querying by user and report type
CREATE INDEX idx_reports_user_type_date ON public.reports (user_id, report_type, generated_at DESC);

-- Add trigger to automatically update the updated_at column
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
