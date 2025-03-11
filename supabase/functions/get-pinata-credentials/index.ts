
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // These values are stored in Supabase's edge function secrets
    // You need to set them using the Supabase CLI:
    // supabase secrets set PINATA_API_KEY=e8141c7ad25bbe26737a
    // supabase secrets set PINATA_API_SECRET=e0e8973e186c9eb3c70332357ddbf20da260b9374d390b76f1d9bd4b3e66eafc
    const PINATA_API_KEY = Deno.env.get('PINATA_API_KEY')
    const PINATA_API_SECRET = Deno.env.get('PINATA_API_SECRET')

    if (!PINATA_API_KEY || !PINATA_API_SECRET) {
      throw new Error('Pinata credentials not configured')
    }

    const data = {
      PINATA_API_KEY,
      PINATA_API_SECRET
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    )
  }
})
