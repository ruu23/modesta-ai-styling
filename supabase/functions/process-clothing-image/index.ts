import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing clothing image for e-commerce...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: `Transform this clothing item into a professional e-commerce product photo:
- Use a pure white background (#FFFFFF)
- Center the item perfectly with correct proportions
- Smooth the fabric, remove wrinkles, shadows, and noise
- Keep the item well-structured, neat, and polished like premium fashion websites
- Natural lighting, soft shadow only if needed
- No distortion, no filters, no props, no model
- High-quality, professional, minimalist clothing catalog style
- The output should look like a product photo from a luxury fashion e-commerce site`
              },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image processing response received');

    // Extract the processed image from the response
    const processedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!processedImage) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No processed image returned from AI');
    }

    return new Response(JSON.stringify({ processedImage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in process-clothing-image:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
