
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

    const { action, alertData } = await req.json()

    if (action === 'create') {
      // Create new alert
      const { data, error } = await supabaseClient
        .from('alerts')
        .insert([{
          user_id: user.user.id,
          ticker: alertData.ticker,
          alert_type: alertData.type, // 'price_above', 'price_below', 'volume_spike', 'news_mention'
          condition_value: alertData.value,
          condition_operator: alertData.operator,
          is_active: true,
          message: alertData.message
        }])
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ alert: data[0] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    } else if (action === 'check') {
      // Check alerts for triggers (this would be called by a cron job)
      const { data: alerts } = await supabaseClient
        .from('alerts')
        .select('*')
        .eq('is_active', true)

      const triggeredAlerts = []

      // Mock alert checking logic
      for (const alert of alerts || []) {
        // In production, check real market data against alert conditions
        const mockPrice = Math.random() * 200 + 50
        
        if (alert.alert_type === 'price_above' && mockPrice > alert.condition_value) {
          triggeredAlerts.push({
            ...alert,
            triggered_at: new Date().toISOString(),
            triggered_value: mockPrice
          })
        }
      }

      return new Response(
        JSON.stringify({ triggered_alerts: triggeredAlerts }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  } catch (error) {
    console.error('Error in alerts engine:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
