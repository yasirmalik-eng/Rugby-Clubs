// Supabase Edge Function — stripe-webhook
// Receives Stripe events and fulfils orders + sends Resend confirmation emails
// Environment variables required:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   RESEND_API_KEY
//   EMAIL_FROM           e.g. noreply@northwalesrugby.com
//   ADMIN_EMAIL          e.g. admin@northwalesrugby.com
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import Stripe from "npm:stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "noreply@northwalesrugby.com";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "admin@northwalesrugby.com";

async function sendEmail(to: string, subject: string, html: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });
}

function buildConfirmationEmail(session: Stripe.Checkout.Session, items: Array<{ label: string; quantity: number; unitPricePence: number; fixtureDetails?: string }>) {
  const total = items.reduce((s, i) => s + i.unitPricePence * i.quantity, 0);
  const rows = items.map(i =>
    `<tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 15px;">
        <span style="font-weight: 600; color: #111827;">${i.label}</span><br/>
        ${i.fixtureDetails ? `<span style="color: #dc2626; font-size: 13px; font-weight: 500;">${i.fixtureDetails}</span><br/>` : ''}
        <span style="color: #6b7280; font-size: 13px;">Quantity: ${i.quantity}</span>
      </td>
      <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: 600; font-size: 15px;">
        £${((i.unitPricePence * i.quantity) / 100).toFixed(2)}
      </td>
    </tr>`
  ).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    
    <!-- Header -->
    <div style="background-color: #dc2626; padding: 40px 32px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">North Wales Crusaders</h1>
      <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Official Ticket Confirmation</p>
    </div>

    <!-- Body -->
    <div style="padding: 40px 32px;">
      <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin: 0 0 16px 0;">Hello ${session.customer_details?.name?.split(' ')[0] ?? "there"},</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 32px 0;">
        Thank you for your purchase! Your tickets are confirmed. Please bring this email with you on matchday to Eirias Stadium.
      </p>

      <!-- Order Summary -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <h3 style="color: #111827; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0; border-bottom: 2px solid #dc2626; padding-bottom: 8px; display: inline-block;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${rows}
          <tr>
            <td style="padding: 24px 0 8px 0; color: #111827; font-weight: 700; font-size: 18px;">Total Paid</td>
            <td style="padding: 24px 0 8px 0; text-align: right; color: #dc2626; font-weight: 800; font-size: 20px;">£${(total / 100).toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <!-- Order Details -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
          <strong>Order Reference:</strong> <span style="font-family: ui-monospace, monospace; color: #111827;">${session.id.slice(0, 16).toUpperCase()}</span>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          <strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 32px; text-align: center;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px 0;">
        North Wales Crusaders Rugby League Club<br/>
        Eirias Stadium, Abergele Road, Colwyn Bay, LL29 7SP
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} North Wales Crusaders. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildDonationEmail(session: Stripe.Checkout.Session) {
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    
    <!-- Header -->
    <div style="background-color: #dc2626; padding: 40px 32px; text-align: center;">
      <div style="background-color: #ffffff; width: 64px; height: 64px; border-radius: 32px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 32px; line-height: 1;">❤️</span>
      </div>
      <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Thank You!</h1>
      <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">North Wales Crusaders</p>
    </div>

    <!-- Body -->
    <div style="padding: 40px 32px; text-align: center;">
      <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin: 0 0 16px 0;">Hello ${session.customer_details?.name?.split(' ')[0] ?? "there"},</h2>
      
      <p style="color: #4b5563; font-size: 18px; line-height: 28px; margin: 0 0 32px 0;">
        We are incredibly grateful for your generous donation of 
        <span style="color: #dc2626; font-weight: 800; font-size: 20px;">£${amount}</span>.
      </p>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 32px; text-align: left;">
        <p style="color: #4b5563; font-size: 15px; line-height: 24px; margin: 0; font-style: italic;">
          "Your support directly helps us maintain North Wales Crusaders and keep professional rugby thriving in North Wales. We couldn't do it without passionate supporters like you."
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        <strong>Reference:</strong> <span style="font-family: ui-monospace, monospace;">${session.id.slice(0, 16).toUpperCase()}</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 32px; text-align: center;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px 0;">
        North Wales Crusaders Rugby League Club<br/>
        Eirias Stadium, Abergele Road, Colwyn Bay, LL29 7SP
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} North Wales Crusaders. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { metadata } = session;

    try {
      if (metadata?.type === "donation") {
        const { data: existingDonation } = await supabase
          .from("donations")
          .select("id, status")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (!existingDonation) throw new Error("Donation not found for session: " + session.id);
        if (existingDonation.status === "completed") {
          return new Response(JSON.stringify({ received: true, duplicate: true }), { headers: { "Content-Type": "application/json" } });
        }

        await supabase.from("donations").update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent as string,
          donor_email: session.customer_details?.email ?? "unknown",
          donor_name: session.customer_details?.name ?? null,
          updated_at: new Date().toISOString(),
        }).eq("stripe_session_id", session.id);

        const buyerEmail = session.customer_details?.email;
        if (buyerEmail) {
          await sendEmail(
            buyerEmail,
            "Thank you for your donation! ❤️",
            buildDonationEmail(session)
          );
        }

        await sendEmail(
          ADMIN_EMAIL,
          `New Donation — £${((session.amount_total ?? 0) / 100).toFixed(2)}`,
          `<p>New donation from <strong>${buyerEmail}</strong> for £${((session.amount_total ?? 0) / 100).toFixed(2)}</p>`
        );

        return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
      }

      // Parse metadata
      const ticketIds: string[] = JSON.parse(metadata?.ticket_ids ?? "[]");
      const quantities: number[] = JSON.parse(metadata?.quantities ?? "[]");
      const userId = metadata?.user_id || null;

      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id, status")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (!existingOrder) {
        throw new Error("Order not found for session: " + session.id);
      }

      if (existingOrder.status === "completed") {
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Fetch ticket details including fixture details if applicable
      const { data: tickets } = await supabase.from("tickets").select("id, label, price_gbp, type, fixtures(opponent, match_date)").in("id", ticketIds);
      const ticketMap = Object.fromEntries((tickets ?? []).map((t) => [t.id, t]));

      // Update order status + buyer details
      const { data: order } = await supabase
        .from("orders")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent as string,
          buyer_email: session.customer_details?.email ?? "unknown",
          buyer_name: session.customer_details?.name ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id)
        .select("id")
        .single();

      if (!order) throw new Error("Order update failed for session: " + session.id);

      // Insert order items + update sold_count
      const itemsForEmail: Array<{ label: string; quantity: number; unitPricePence: number; fixtureDetails?: string }> = [];

      for (let i = 0; i < ticketIds.length; i++) {
        const ticket = ticketMap[ticketIds[i]];
        if (!ticket) continue;
        const qty = quantities[i];

        await supabase.from("order_items").insert([{
          order_id: order.id,
          ticket_id: ticket.id,
          quantity: qty,
          unit_price_gbp: ticket.price_gbp,
        }]);

        // Increment sold_count
        await supabase.rpc("increment_sold_count", { ticket_id: ticket.id, amount: qty });

        // Season pass — create record for user
        if (ticket.type === "season_pass" && userId) {
          await supabase.from("season_passes").insert([{
            user_id: userId,
            order_id: order.id,
            ticket_id: ticket.id,
            is_active: true,
          }]);
        }

        // Format fixture details for email if present
        let fixtureDetails;
        if (ticket.fixtures && !Array.isArray(ticket.fixtures)) {
          const dateStr = new Date(ticket.fixtures.match_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          fixtureDetails = `vs ${ticket.fixtures.opponent} (${dateStr})`;
        }

        itemsForEmail.push({ label: ticket.label, quantity: qty, unitPricePence: ticket.price_gbp, fixtureDetails });
      }

      // Send confirmation email to buyer
      const buyerEmail = session.customer_details?.email;
      if (buyerEmail) {
        await sendEmail(
          buyerEmail,
          "Your North Wales Crusaders Tickets — Booking Confirmed 🏉",
          buildConfirmationEmail(session, itemsForEmail)
        );
      }

      // Notify admin
      await sendEmail(
        ADMIN_EMAIL,
        `New Ticket Order — £${((session.amount_total ?? 0) / 100).toFixed(2)}`,
        `<p>New order from <strong>${buyerEmail}</strong> for £${((session.amount_total ?? 0) / 100).toFixed(2)}</p><p>Order ID: ${order.id}</p>`
      );
    } catch (err) {
      console.error("Webhook processing error:", err);
      return new Response("Webhook handler error", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
