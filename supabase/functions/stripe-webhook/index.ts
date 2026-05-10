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

function buildConfirmationEmail(session: Stripe.Checkout.Session, items: Array<{ label: string; quantity: number; unitPricePence: number }>) {
  const total = items.reduce((s, i) => s + i.unitPricePence * i.quantity, 0);
  const rows = items.map(i =>
    `<tr>
      <td style="padding:8px 0;color:#e5e7eb;">${i.label} × ${i.quantity}</td>
      <td style="padding:8px 0;color:#e5e7eb;text-align:right;font-weight:bold;">£${((i.unitPricePence * i.quantity) / 100).toFixed(2)}</td>
    </tr>`
  ).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0a0a0a;font-family:system-ui,sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;background:#111;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#7f1d1d,#450a0a);padding:32px;text-align:center;">
      <img src="https://northwalesrugby.com/logo.png" alt="NWC" width="64" style="border-radius:50%;border:2px solid #dc2626;"/>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:16px 0 4px;">Booking Confirmed! 🏉</h1>
      <p style="color:#fca5a5;margin:0;">North Wales Crusaders</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#d1d5db;margin:0 0 8px;">Hi ${session.customer_details?.name ?? "there"},</p>
      <p style="color:#9ca3af;margin:0 0 24px;font-size:14px;">Your tickets have been confirmed. See you at Eirias Stadium!</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #27272a;">
        ${rows}
        <tr style="border-top:1px solid #27272a;">
          <td style="padding:12px 0;color:#fff;font-weight:900;font-size:18px;">Total Paid</td>
          <td style="padding:12px 0;color:#4ade80;font-weight:900;font-size:18px;text-align:right;">£${(total / 100).toFixed(2)}</td>
        </tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#1a1a1a;border-radius:12px;border:1px solid #27272a;">
        <p style="color:#6b7280;font-size:12px;margin:0;">Order reference: <span style="color:#9ca3af;font-family:monospace;">${session.id.slice(0, 16).toUpperCase()}</span></p>
      </div>
      <p style="color:#6b7280;font-size:12px;margin-top:24px;">Please bring this email or your payment confirmation as proof of purchase on matchday.</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1f1f1f;text-align:center;">
      <p style="color:#4b5563;font-size:12px;margin:0;">© 2026 North Wales Crusaders · Eirias Stadium, Colwyn Bay</p>
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
<head><meta charset="utf-8"/></head>
<body style="background:#0a0a0a;font-family:system-ui,sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;background:#111;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#7f1d1d,#450a0a);padding:32px;text-align:center;">
      <img src="https://northwalesrugby.com/logo.png" alt="NWC" width="64" style="border-radius:50%;border:2px solid #dc2626;"/>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:16px 0 4px;">Thank you! ❤️</h1>
      <p style="color:#fca5a5;margin:0;">North Wales Crusaders</p>
    </div>
    <div style="padding:32px;text-align:center;">
      <p style="color:#d1d5db;margin:0 0 16px;">Hi ${session.customer_details?.name ?? "there"},</p>
      <p style="color:#9ca3af;margin:0 0 24px;font-size:16px;line-height:1.5;">
        Thank you so much for your generous donation of <strong style="color:#fff;">£${amount}</strong>. 
        Your support helps us keep professional rugby thriving in North Wales.
      </p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1f1f1f;text-align:center;">
      <p style="color:#4b5563;font-size:12px;margin:0;">© 2026 North Wales Crusaders · Eirias Stadium, Colwyn Bay</p>
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

      // Fetch ticket details
      const { data: tickets } = await supabase.from("tickets").select("id, label, price_gbp, type").in("id", ticketIds);
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
      const itemsForEmail: Array<{ label: string; quantity: number; unitPricePence: number }> = [];

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

        itemsForEmail.push({ label: ticket.label, quantity: qty, unitPricePence: ticket.price_gbp });
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
