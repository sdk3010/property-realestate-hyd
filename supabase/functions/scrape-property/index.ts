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

    // Check if it's a search results page or single property page
    const isSearchPage = url.includes('?') && (url.includes('bedroom=') || url.includes('proptype=') || url.includes('cityName='))
    
    let properties = []
    
    if (isSearchPage) {
      // Mock multiple properties for search results (replace with actual scraping logic)
      const mockProperties = [
        {
          url: url + "#property1",
          title: "Luxurious 3BHK Apartment in Gachibowli",
          developer: "Prestige Group",
          price: 12500000,
          price_per_sqft: 6250,
          super_area: 2000,
          transaction_type: "New",
          furnishing_status: "Semi-Furnished",
          bathrooms: 3,
          possession_date: "March 2025",
          description: "Experience luxury living in this beautifully designed 3BHK apartment.",
          location: "Gachibowli, Hyderabad",
          latitude: 17.4435,
          longitude: 78.3487,
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
          amenities: ["Swimming Pool", "Gym", "24/7 Security", "Parking"],
          sentiment_score: 4.2,
          investment_rating: "Good",
          user_id: userId
        },
        {
          url: url + "#property2",
          title: "Modern 2BHK Flat in HITEC City",
          developer: "Aparna Constructions",
          price: 8500000,
          price_per_sqft: 5667,
          super_area: 1500,
          transaction_type: "Resale",
          furnishing_status: "Fully-Furnished",
          bathrooms: 2,
          possession_date: "Ready to Move",
          description: "Well-designed 2BHK apartment with modern amenities in HITEC City.",
          location: "HITEC City, Hyderabad",
          latitude: 17.4239,
          longitude: 78.3809,
          images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600"],
          amenities: ["Gym", "Power Backup", "Parking", "Garden"],
          sentiment_score: 3.8,
          investment_rating: "Average",
          user_id: userId
        },
        {
          url: url + "#property3",
          title: "Spacious 4BHK Villa in Jubilee Hills",
          developer: "My Home Constructions",
          price: 25000000,
          price_per_sqft: 8333,
          super_area: 3000,
          transaction_type: "New",
          furnishing_status: "Unfurnished",
          bathrooms: 4,
          possession_date: "Dec 2024",
          description: "Premium villa with spacious rooms and luxury amenities in Jubilee Hills.",
          location: "Jubilee Hills, Hyderabad",
          latitude: 17.4126,
          longitude: 78.4071,
          images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600"],
          amenities: ["Swimming Pool", "Club House", "24/7 Security", "Garden", "Gym"],
          sentiment_score: 4.5,
          investment_rating: "Excellent",
          user_id: userId
        },
        {
          url: url + "#property4",
          title: "Affordable 2BHK in Kondapur",
          developer: "Shriram Properties",
          price: 6000000,
          price_per_sqft: 4000,
          super_area: 1500,
          transaction_type: "New",
          furnishing_status: "Semi-Furnished",
          bathrooms: 2,
          possession_date: "June 2025",
          description: "Budget-friendly apartment with good connectivity in Kondapur.",
          location: "Kondapur, Hyderabad",
          latitude: 17.4647,
          longitude: 78.3639,
          images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"],
          amenities: ["Power Backup", "Parking", "24/7 Security"],
          sentiment_score: 3.5,
          investment_rating: "Average",
          user_id: userId
        },
        {
          url: url + "#property5",
          title: "Premium 3BHK in Banjara Hills",
          developer: "Sobha Limited",
          price: 18000000,
          price_per_sqft: 9000,
          super_area: 2000,
          transaction_type: "New",
          furnishing_status: "Fully-Furnished",
          bathrooms: 3,
          possession_date: "Ready to Move",
          description: "Luxurious apartment in the heart of Banjara Hills with premium amenities.",
          location: "Banjara Hills, Hyderabad",
          latitude: 17.4065,
          longitude: 78.4691,
          images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
          amenities: ["Swimming Pool", "Gym", "Club House", "24/7 Security", "Parking", "Garden"],
          sentiment_score: 4.7,
          investment_rating: "Excellent",
          user_id: userId
        }
      ]
      
      properties = mockProperties
    } else {
      // Single property scraping
      const mockProperty = {
        url,
        title: "Luxurious 3BHK Apartment in Gachibowli",
        developer: "Prestige Group",
        price: 12500000,
        price_per_sqft: 6250,
        super_area: 2000,
        transaction_type: "New",
        furnishing_status: "Semi-Furnished",
        bathrooms: 3,
        possession_date: "March 2025",
        description: "Experience luxury living in this beautifully designed 3BHK apartment located in the heart of Gachibowli.",
        location: "Gachibowli, Hyderabad",
        latitude: 17.4435,
        longitude: 78.3487,
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600"
        ],
        amenities: ["Swimming Pool", "Gym", "24/7 Security", "Parking"],
        sentiment_score: 4.2,
        investment_rating: "Good",
        user_id: userId
      }
      
      properties = [mockProperty]
    }

    // Save to database
    const { data: savedProperties, error: dbError } = await supabase
      .from('scraped_properties')
      .insert(properties)
      .select()

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
        properties: savedProperties,
        count: savedProperties.length,
        isMultiple: isSearchPage,
        message: `${savedProperties.length} ${savedProperties.length > 1 ? 'properties' : 'property'} scraped and saved successfully` 
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