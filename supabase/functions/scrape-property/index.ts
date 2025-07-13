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
    const { url, userId } = await req.json()

    if (!url || !userId) {
      return new Response(
        JSON.stringify({ error: 'URL and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Mock property scraping (replace with actual scraping logic)
    const mockProperty = {
      url,
      title: "Luxurious 3BHK Apartment in Gachibowli",
      developer: "Prestige Group",
      price: 12500000, // 1.25 Cr
      price_per_sqft: 6250,
      super_area: 2000,
      transaction_type: "New",
      furnishing_status: "Semi-Furnished",
      bathrooms: 3,
      possession_date: "March 2025",
      description: "Experience luxury living in this beautifully designed 3BHK apartment located in the heart of Gachibowli. This premium property offers modern amenities, spacious rooms, and excellent connectivity to IT hubs. Perfect for families looking for a comfortable and convenient lifestyle.",
      location: "Gachibowli, Hyderabad",
      latitude: 17.4435,
      longitude: 78.3487,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
      ],
      amenities: [
        "Swimming Pool",
        "Gym",
        "Children's Play Area",
        "24/7 Security",
        "Power Backup",
        "Parking",
        "Garden",
        "Club House"
      ],
      sentiment_score: 4.2,
      investment_rating: "Good",
      user_id: userId
    }

    // Save to database
    const { data: property, error: dbError } = await supabase
      .from('scraped_properties')
      .insert([mockProperty])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save property data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        property,
        message: 'Property scraped and saved successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})