import { NextResponse } from "next/server";
import { getStripe } from "../../../lib/stripe/client";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { sendOrderEmail } from "../../../lib/email/mailer";

function formatAddress(address: any) {
  if (!address) return "No address found";
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
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
      const customerName =
        session.customer_details?.name ||
        session.shipping_details?.name ||
        null;

      const customerEmail = session.customer_details?.email || null;

      const address =
        session.shipping_details?.address ||
        session.customer_details?.address ||
        null;

      const productName =
        session.metadata?.product_name ||
        "Virsa Desi Style Durum Atta - 20 LB";

      const quantity = Number(session.metadata?.quantity || 1);
      const formattedAddress = formatAddress(address);

      const { error: dbError } = await supabaseAdmin.from("virsa_orders").upsert(
        {
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          customer_name: customerName,
          customer_email: customerEmail,
          shipping_name: session.shipping_details?.name || customerName,
          shipping_address: address,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          product_id: session.metadata?.product_id || null,
          product_name: productName,
          quantity,
        },
        { onConflict: "stripe_session_id" }
      );

      if (dbError) {
        console.error("Virsa order DB save failed:", dbError);
      }

      try {
        await sendOrderEmail({
          subject: `New Virsa Order - ${productName} x${quantity}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New Paid Virsa Order</h2>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Total:</strong> ${((session.amount_total || 0) / 100).toFixed(2)} ${String(session.currency || "cad").toUpperCase()}</p>
              <hr />
              <p><strong>Customer Name:</strong> ${customerName || "Not provided"}</p>
              <p><strong>Email:</strong> ${customerEmail || "Not provided"}</p>
              <p><strong>Delivery Address:</strong> ${formattedAddress}</p>
              <hr />
              <p><strong>Stripe Session:</strong> ${session.id}</p>
              <p><strong>Payment Intent:</strong> ${session.payment_intent || "Not found"}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Virsa order email failed:", emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
