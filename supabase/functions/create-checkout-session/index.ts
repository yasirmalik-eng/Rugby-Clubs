// Supabase Edge Function — create-checkout-session
// Deployed via: supabase functions deploy create-checkout-session
// Environment variables required (set in Supabase Dashboard → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY
//   SUPABASE_URL (auto-set)
//   SUPABASE_SERVICE_ROLE_KEY (auto-set)

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
    const { lineItems, fixtureId, userId, successUrl, cancelUrl } = await req.json();

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error("No line items provided");
    }

    // Fetch ticket details from Supabase
    const ticketIds = lineItems.map((item: { ticketId: string }) => item.ticketId);
    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("id, fixture_id, type, label, price_gbp, availability, sold_count, max_per_order, description")
      .in("id", ticketIds);

    if (ticketsError || !tickets) throw new Error("Failed to fetch ticket data");

    // Build Stripe line items
    const stripeLineItems = lineItems.map((item: { ticketId: string; quantity: number }) => {
      const ticket = tickets.find((t) => t.id === item.ticketId);
      if (!ticket) throw new Error(`Ticket ${item.ticketId} not found`);
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for ${ticket.label}`);
      }
      if (item.quantity > ticket.max_per_order) {
        throw new Error(`${ticket.label} exceeds the maximum per order`);
      }

      if (fixtureId && ticket.fixture_id !== null && ticket.fixture_id !== fixtureId) {
        throw new Error(`${ticket.label} does not belong to this fixture`);
      }
      if (ticket.availability - ticket.sold_count < item.quantity) {
        throw new Error(`Not enough tickets available for ${ticket.label}`);
      }
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: ticket.label,
            description: ticket.description || undefined,
          },
          unit_amount: ticket.price_gbp,
        },
        quantity: item.quantity,
      };
    });

    // Total for our records
    const totalPence = stripeLineItems.reduce(
      (sum: number, item: { price_data: { unit_amount: number }; quantity: number }) =>
        sum + item.price_data.unit_amount * item.quantity,
      0
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        fixture_id: fixtureId ?? "",
        user_id: userId ?? "",
        ticket_ids: JSON.stringify(ticketIds),
        quantities: JSON.stringify(lineItems.map((i: { quantity: number }) => i.quantity)),
      },
      customer_creation: "always",
      billing_address_collection: "auto",
    });

    // Pre-create order as pending
    const { error: orderError } = await supabase.from("orders").insert([{
      stripe_session_id: session.id,
      buyer_email: "pending",
      total_amount_gbp: totalPence,
      status: "pending",
      user_id: userId ?? null,
    }]);

    if (orderError) {
      throw new Error(orderError.message);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("Checkout Error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
