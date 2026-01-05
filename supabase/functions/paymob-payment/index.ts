import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PaymentRequest {
  amount_cents: number;
  currency: string;
  billing_data: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    apartment?: string;
    floor?: string;
    street?: string;
    building?: string;
    city?: string;
    country?: string;
    state?: string;
    postal_code?: string;
  };
  plan_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const PAYMOB_API_KEY = Deno.env.get('PAYMOB_API_KEY');
    const PAYMOB_CARD_INTEGRATION_ID = Deno.env.get('PAYMOB_CARD_INTEGRATION_ID');
    const PAYMOB_IFRAME_ID = Deno.env.get('PAYMOB_IFRAME_ID');

    if (!PAYMOB_API_KEY || !PAYMOB_CARD_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
      console.error('Missing Paymob configuration');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount_cents, currency, billing_data, plan_id }: PaymentRequest = await req.json();

    console.log('Processing payment request:', { amount_cents, currency, plan_id });

    // Step 1: Authentication Request
    console.log('Step 1: Authenticating with Paymob...');
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Auth failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authData = await authResponse.json();
    const authToken = authData.token;
    console.log('Authentication successful');

    // Step 2: Order Registration
    console.log('Step 2: Registering order...');
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents,
        currency,
        items: [
          {
            name: plan_id || 'Subscription',
            amount_cents,
            quantity: 1,
          },
        ],
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Order registration failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Order registration failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderData = await orderResponse.json();
    const orderId = orderData.id;
    console.log('Order registered:', orderId);

    // Step 3: Payment Key Request
    console.log('Step 3: Getting payment key...');
    const paymentKeyResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: billing_data.apartment || 'NA',
          email: billing_data.email,
          floor: billing_data.floor || 'NA',
          first_name: billing_data.first_name,
          street: billing_data.street || 'NA',
          building: billing_data.building || 'NA',
          phone_number: billing_data.phone_number,
          shipping_method: 'NA',
          postal_code: billing_data.postal_code || 'NA',
          city: billing_data.city || 'NA',
          country: billing_data.country || 'EG',
          last_name: billing_data.last_name,
          state: billing_data.state || 'NA',
        },
        currency,
        integration_id: parseInt(PAYMOB_CARD_INTEGRATION_ID),
      }),
    });

    if (!paymentKeyResponse.ok) {
      const errorText = await paymentKeyResponse.text();
      console.error('Payment key request failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Payment key generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentKeyData = await paymentKeyResponse.json();
    const paymentKey = paymentKeyData.token;
    console.log('Payment key generated successfully');

    // Generate iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    return new Response(
      JSON.stringify({
        success: true,
        iframe_url: iframeUrl,
        payment_key: paymentKey,
        order_id: orderId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Payment processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Payment processing failed', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
