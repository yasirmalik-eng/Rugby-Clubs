// Supabase Edge Function — create-donation-session
// Deployed via: supabase functions deploy create-donation-session --no-verify-jwt

import Stripe from "npm:stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amountPence, userId, successUrl, cancelUrl } = await req.json();

    if (!amountPence || amountPence < 100) {
      throw new Error("Invalid donation amount");
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Club Donation",
              description: "Support for North Wales Crusaders",
            },
            unit_amount: amountPence,
          },
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        type: "donation",
        user_id: userId ?? "",
      },
      customer_creation: "always",
      submit_type: "donate", // Changes Stripe button from "Pay" to "Donate"
    });

    // Pre-create donation record as pending
    await supabase.from("donations").insert([{
      stripe_session_id: session.id,
      donor_email: session.customer_details?.email ?? "pending",
      amount_gbp: amountPence,
      status: "pending",
      user_id: userId ?? null,
    }]);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("Donation Error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
