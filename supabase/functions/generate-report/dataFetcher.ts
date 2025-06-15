
export const fetchUserPortfolios = async (supabaseClient: any, userId: string) => {
  const { data: portfolios, error: portfolioError } = await supabaseClient
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (portfolioError) {
    console.error('Error fetching portfolios:', portfolioError)
    throw portfolioError
  }

  console.log(`Found ${portfolios?.length || 0} portfolios for user`)
  return portfolios || []
}

export const fetchHoldings = async (supabaseClient: any, portfolios: any[]) => {
  const { data: holdings, error: holdingsError } = await supabaseClient
    .from('holdings')
    .select('*')
    .in('portfolio_id', portfolios.map(p => p.id))
    .order('ticker', { ascending: true })

  if (holdingsError) {
    console.error('Error fetching holdings:', holdingsError)
    throw holdingsError
  }

  console.log(`Found ${holdings?.length || 0} total holdings across all portfolios`)
  return holdings || []
}

export const fetchNews = async (supabaseClient: any, tickers: string[]) => {
  let relevantNews = []
  if (tickers.length > 0) {
    const { data: news } = await supabaseClient
      .from('news_articles')
      .select('*')
      .in('ticker', tickers)
      .order('published_at', { ascending: false })
      .limit(20)
    
    relevantNews = news || []
    console.log(`Found ${relevantNews.length} relevant news articles`)
  }

  const { data: generalNews } = await supabaseClient
    .from('news_articles')
    .select('*')
    .is('ticker', null)
    .order('published_at', { ascending: false })
    .limit(15)

  console.log(`Found ${generalNews?.length || 0} general market news articles`)

  return [...relevantNews, ...(generalNews || [])]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}
