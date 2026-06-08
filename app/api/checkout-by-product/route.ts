import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { stripe } from "../../../lib/stripe/client";

export async function POST(req: Request) {
  try {
    const { productName, quantity } = await req.json();

    const safeQuantity = Math.max(1, Math.min(Number(quantity || 1), 20));

    let query = supabaseAdmin
      .from("virsa_products")
      .select("*")
      .eq("is_active", true);

    if (productName) {
      query = query.ilike("name", `%${productName}%`);
    }

    const { data: products, error } = await query
      .order("sort_order", { ascending: true })
      .limit(1);

    const product = products?.[0];

    if (error || !product?.stripe_price_id) {
      return NextResponse.json({ error: "Product unavailable." }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: product.stripe_price_id,
          quantity: safeQuantity,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      metadata: {
        product_id: product.id,
        product_name: product.name,
        quantity: String(safeQuantity),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Checkout could not be started." },
      { status: 500 }
    );
  }
}
