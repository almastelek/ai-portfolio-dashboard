
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { ticker } = await req.json()

    // Mock news articles with sentiment analysis
    const articles = [
      {
        ticker: ticker?.toUpperCase() || null,
        source: 'MarketWatch',
        headline: `${ticker || 'Market'} Shows Strong Performance Amid Economic Uncertainty`,
        summary: 'Latest earnings report exceeded expectations with strong revenue growth and positive guidance for next quarter.',
        url: 'https://example.com/article1',
        published_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        sentiment_score: 0.75 // Positive sentiment
      },
      {
        ticker: ticker?.toUpperCase() || null,
        source: 'Reuters',
        headline: `Analysts Upgrade ${ticker || 'Stock'} Following Strong Q3 Results`,
        summary: 'Multiple analysts have raised their price targets following better than expected quarterly results and improved outlook.',
        url: 'https://example.com/article2',
        published_at: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
        sentiment_score: 0.85 // Very positive sentiment
      },
      {
        ticker: ticker?.toUpperCase() || null,
        source: 'Bloomberg',
        headline: `${ticker || 'Market'} Faces Headwinds from Regulatory Changes`,
        summary: 'New regulatory proposals could impact future growth prospects, though long-term fundamentals remain strong.',
        url: 'https://example.com/article3',
        published_at: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        sentiment_score: -0.25 // Slightly negative sentiment
      }
    ]

    // Insert articles into database
    const { data, error } = await supabaseClient
      .from('news_articles')
      .insert(articles)
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ articles: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
