import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe/client";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { sendOrderEmail } from "../../../lib/email/mailer";

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

      const address = session.shipping_details?.address;
      const formattedAddress = address
        ? [address.line1, address.line2, address.city, address.state, address.postal_code, address.country]
            .filter(Boolean)
            .join(", ")
        : "No address found";

      await sendOrderEmail({
        subject: `New Virsa Order - ${session.metadata?.product_name || "Product"} x${session.metadata?.quantity || 1}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Paid Virsa Order</h2>
            <p><strong>Product:</strong> ${session.metadata?.product_name || "Virsa Product"}</p>
            <p><strong>Quantity:</strong> ${session.metadata?.quantity || 1}</p>
            <p><strong>Total:</strong> ${((session.amount_total || 0) / 100).toFixed(2)} ${String(session.currency || "cad").toUpperCase()}</p>
            <hr />
            <p><strong>Customer Name:</strong> ${session.customer_details?.name || session.shipping_details?.name || "Not provided"}</p>
            <p><strong>Email:</strong> ${session.customer_details?.email || "Not provided"}</p>
            <p><strong>Delivery Address:</strong> ${formattedAddress}</p>
            <hr />
            <p><strong>Stripe Session:</strong> ${session.id}</p>
            <p><strong>Payment Intent:</strong> ${session.payment_intent || "Not found"}</p>
          </div>
        `,
      });
}
  }

  return NextResponse.json({ received: true });
}


