
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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { type = 'technical' } = await req.json()

    // Mock AI-generated trade ideas (will be enhanced with real AI)
    const ideas = [
      {
        ticker: 'AAPL',
        idea_type: type,
        title: 'Apple Showing Strong Technical Breakout',
        rationale: 'AAPL has broken above key resistance at $180 with strong volume. RSI showing bullish momentum with room to run. Price target $200.',
        target_price: 200.00,
        ai_generated: true
      },
      {
        ticker: 'TSLA',
        idea_type: type,
        title: 'Tesla Oversold Bounce Opportunity',
        rationale: 'TSLA has retraced 30% from highs and is now testing major support. Strong fundamental outlook for Q4 deliveries suggests this is a buying opportunity.',
        target_price: 280.00,
        ai_generated: true
      },
      {
        ticker: 'NVDA',
        idea_type: type,
        title: 'NVIDIA AI Growth Story Intact',
        rationale: 'Despite recent volatility, NVDA remains the leader in AI chips. Strong earnings growth expected to continue as AI adoption accelerates.',
        target_price: 500.00,
        ai_generated: true
      },
      {
        ticker: 'GOOGL',
        idea_type: type,
        title: 'Ownership of entire AI supply chain from silicon to applications',
        rationale: 'Google is the only company in the world that owns the entire AI supply chain from silicon to applications. This gives it a unique advantage over competitors.',
        target_price: 400.00,
        ai_generated: true
      }
    ]

    // Insert ideas into database
    const { data, error } = await supabaseClient
      .from('trade_ideas')
      .insert(
        ideas.map(idea => ({
          ...idea,
          user_id: user.user.id
        }))
      )
      .select()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ ideas: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in ai-trade-ideas function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
