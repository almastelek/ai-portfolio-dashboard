
-- Create policies for holdings that might not exist yet
DO $$
BEGIN
    -- Try to create INSERT policy for holdings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'holdings' 
        AND policyname = 'Users can create their own holdings'
    ) THEN
        CREATE POLICY "Users can create their own holdings" 
          ON public.holdings 
          FOR INSERT 
          WITH CHECK (portfolio_id IN (
            SELECT id FROM public.portfolios WHERE user_id = auth.uid()
          ));
    END IF;
    
    -- Try to create UPDATE policy for holdings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'holdings' 
        AND policyname = 'Users can update their own holdings'
    ) THEN
        CREATE POLICY "Users can update their own holdings" 
          ON public.holdings 
          FOR UPDATE 
          USING (portfolio_id IN (
            SELECT id FROM public.portfolios WHERE user_id = auth.uid()
          ));
    END IF;
    
    -- Try to create DELETE policy for holdings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'holdings' 
        AND policyname = 'Users can delete their own holdings'
    ) THEN
        CREATE POLICY "Users can delete their own holdings" 
          ON public.holdings 
          FOR DELETE 
          USING (portfolio_id IN (
            SELECT id FROM public.portfolios WHERE user_id = auth.uid()
          ));
    END IF;
END $$;

-- Ensure RLS is enabled on portfolios table and create missing policies
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Try to create SELECT policy for portfolios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'portfolios' 
        AND policyname = 'Users can view their own portfolios'
    ) THEN
        CREATE POLICY "Users can view their own portfolios" 
          ON public.portfolios 
          FOR SELECT 
          USING (user_id = auth.uid());
    END IF;
    
    -- Try to create INSERT policy for portfolios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'portfolios' 
        AND policyname = 'Users can create their own portfolios'
    ) THEN
        CREATE POLICY "Users can create their own portfolios" 
          ON public.portfolios 
          FOR INSERT 
          WITH CHECK (user_id = auth.uid());
    END IF;
    
    -- Try to create UPDATE policy for portfolios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'portfolios' 
        AND policyname = 'Users can update their own portfolios'
    ) THEN
        CREATE POLICY "Users can update their own portfolios" 
          ON public.portfolios 
          FOR UPDATE 
          USING (user_id = auth.uid());
    END IF;
    
    -- Try to create DELETE policy for portfolios
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'portfolios' 
        AND policyname = 'Users can delete their own portfolios'
    ) THEN
        CREATE POLICY "Users can delete their own portfolios" 
          ON public.portfolios 
          FOR DELETE 
          USING (user_id = auth.uid());
    END IF;
END $$;
