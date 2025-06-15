
import { corsHeaders } from './utils.ts'

export const buildEmptyPortfolioResponse = (reportType: string) => {
  return new Response(
    JSON.stringify({ 
      report: {
        type: reportType,
        title: 'Portfolio Report',
        generated_at: new Date().toISOString(),
        sections: {
          setup_required: {
            title: 'Portfolio Setup Required',
            content: 'No portfolio found. Please create a portfolio and add some holdings to generate meaningful reports.',
          }
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
}

export const buildNoHoldingsResponse = (reportType: string) => {
  return new Response(
    JSON.stringify({ 
      report: {
        type: reportType,
        title: 'Portfolio Report',
        generated_at: new Date().toISOString(),
        sections: {
          setup_required: {
            title: 'Add Holdings to Generate Reports',
            content: 'Your portfolio is set up but has no holdings. Please add some stock positions to generate meaningful market analysis and reports.',
          }
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
}

export const buildSuccessResponse = (report: any) => {
  return new Response(
    JSON.stringify({ report }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
}

export const buildErrorResponse = (error: any) => {
  return new Response(
    JSON.stringify({ error: error.message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
  )
}
