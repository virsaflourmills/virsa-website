import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe/client";
import { supabaseAdmin } from "../../../lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    if (session.payment_status === "paid") {
      await supabaseAdmin.from("virsa_orders").upsert(
        {
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          customer_name: session.customer_details?.name || null,
          customer_email: session.customer_details?.email || null,
          shipping_name: session.shipping_details?.name || null,
          shipping_address: session.shipping_details?.address || null,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          product_id: session.metadata?.product_id || null,
          product_name: session.metadata?.product_name || null,
          quantity: Number(session.metadata?.quantity || 1),
        },
        { onConflict: "stripe_session_id" }
      );
    }
  }

  return NextResponse.json({ received: true });
}
