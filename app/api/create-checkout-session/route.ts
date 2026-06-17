import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    let body: any = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const quantity = Math.max(1, Math.min(Number(body.quantity || 1), 20));

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.virsaflourmills.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Virsa Desi Style Durum Atta - 20 LB",
              images: ["https://www.virsaflourmills.com/package.png"],
            },
            unit_amount: 1499,
          },
          quantity,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      customer_creation: "always",
      metadata: {
        order_source: "Virsa Flour Mills Website",
        product_name: "Virsa Desi Style Durum Atta - 20 LB",
        quantity: String(quantity),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: "Checkout could not be started." },
      { status: 500 }
    );
  }
}
