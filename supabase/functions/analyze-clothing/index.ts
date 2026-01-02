import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing clothing image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a fashion AI assistant specialized in analyzing clothing images. Analyze the clothing item and return a JSON object with these exact fields:
- category: one of "hijabs", "abayas", "tops", "bottoms", "dresses", "outerwear", "accessories", "shoes"
- color: the primary color as one of "black", "white", "beige", "navy", "rose", "burgundy", "olive", "brown", "gray", "blue", "green", "pink"
- brand: detected brand name or "Unknown" if not visible
- name: a descriptive name for the item (e.g. "Navy Blue Cotton Hijab")
- pattern: one of "solid", "striped", "floral", "geometric", "abstract", "plaid", "printed"
- style: one of "casual", "formal", "sporty", "bohemian", "minimalist", "streetwear", "elegant"
- season: array of applicable seasons from "spring", "summer", "fall", "winter"
- occasion: array from "casual", "formal", "work", "weekend", "evening", "special"
- styling_tips: array of 2-3 short styling tips

Return ONLY valid JSON, no other text.`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this clothing item and return the JSON analysis.' },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI Response:', content);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    console.log('Parsed analysis:', analysis);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in analyze-clothing:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
