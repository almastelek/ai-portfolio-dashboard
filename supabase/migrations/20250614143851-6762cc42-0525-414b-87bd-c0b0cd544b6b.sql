
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  report_cadence TEXT DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Portfolio',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create holdings table
CREATE TABLE public.holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  shares DECIMAL(15,6) NOT NULL,
  avg_cost DECIMAL(15,4) NOT NULL,
  purchase_date DATE NOT NULL,
  sector TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create watchlist table
CREATE TABLE public.watchlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  company_name TEXT,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ticker)
);

-- Create trade ideas table
CREATE TABLE public.trade_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  idea_type TEXT NOT NULL, -- 'technical', 'fundamental', 'macro', 'contrarian'
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  target_price DECIMAL(15,4),
  status TEXT DEFAULT 'active', -- 'active', 'reviewed', 'closed'
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news articles cache table
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT,
  source TEXT NOT NULL,
  headline TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create valuation models table
CREATE TABLE public.valuation_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  model_type TEXT NOT NULL, -- 'dcf', 'comps', 'ddm'
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  target_price DECIMAL(15,4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_models ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for portfolios
CREATE POLICY "Users can view their own portfolios" 
  ON public.portfolios FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios" 
  ON public.portfolios FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
  ON public.portfolios FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
  ON public.portfolios FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for holdings
CREATE POLICY "Users can view their own holdings" 
  ON public.holdings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create holdings in their portfolios" 
  ON public.holdings FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own holdings" 
  ON public.holdings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own holdings" 
  ON public.holdings FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = holdings.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Create RLS policies for watchlist
CREATE POLICY "Users can view their own watchlist" 
  ON public.watchlist_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlist items" 
  ON public.watchlist_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items" 
  ON public.watchlist_items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items" 
  ON public.watchlist_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for trade ideas
CREATE POLICY "Users can view their own trade ideas" 
  ON public.trade_ideas FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trade ideas" 
  ON public.trade_ideas FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trade ideas" 
  ON public.trade_ideas FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trade ideas" 
  ON public.trade_ideas FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for news articles (public read access)
CREATE POLICY "Anyone can view news articles" 
  ON public.news_articles FOR SELECT 
  TO authenticated
  USING (true);

-- Create RLS policies for valuation models
CREATE POLICY "Users can view their own valuation models" 
  ON public.valuation_models FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own valuation models" 
  ON public.valuation_models FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own valuation models" 
  ON public.valuation_models FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own valuation models" 
  ON public.valuation_models FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON public.holdings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlist_items_updated_at BEFORE UPDATE ON public.watchlist_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trade_ideas_updated_at BEFORE UPDATE ON public.trade_ideas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_valuation_models_updated_at BEFORE UPDATE ON public.valuation_models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Create a default portfolio for the new user
  INSERT INTO public.portfolios (user_id, name, description)
  VALUES (
    NEW.id,
    'My Portfolio',
    'Default portfolio'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_holdings_portfolio_id ON public.holdings(portfolio_id);
CREATE INDEX idx_holdings_ticker ON public.holdings(ticker);
CREATE INDEX idx_watchlist_user_id ON public.watchlist_items(user_id);
CREATE INDEX idx_trade_ideas_user_id ON public.trade_ideas(user_id);
CREATE INDEX idx_trade_ideas_status ON public.trade_ideas(status);
CREATE INDEX idx_news_articles_ticker ON public.news_articles(ticker);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at);
CREATE INDEX idx_valuation_models_user_id ON public.valuation_models(user_id);
CREATE INDEX idx_valuation_models_ticker ON public.valuation_models(ticker);
