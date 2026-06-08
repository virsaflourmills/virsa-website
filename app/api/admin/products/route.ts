import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../../lib/supabase/admin";
import { stripe } from "../../../../lib/stripe/client";

const ADMIN_EMAIL = "virsaflourmills@gmail.com";

async function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return false;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  return data.user?.email === ADMIN_EMAIL;
}

export async function POST(req: Request) {
  try {
    const isAdmin = await requireAdmin(req);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const image_url = String(body.image_url || "").trim();
    const weight = String(body.weight || "").trim();
    const price_cents = Math.round(Number(body.price) * 100);

    if (!name || !price_cents || price_cents < 50) {
      return NextResponse.json(
        { error: "Valid product name and price are required." },
        { status: 400 }
      );
    }

    const stripeProduct = await stripe.products.create({
      name,
      description: description || undefined,
      images: image_url && image_url.startsWith("http") ? [image_url] : undefined,
      metadata: {
        brand: "Virsa Flour Mills",
      },
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price_cents,
      currency: "cad",
    });

    const { data, error } = await supabaseAdmin
      .from("virsa_products")
      .insert({
        name,
        description,
        image_url,
        weight,
        price_cents,
        currency: "cad",
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
        is_active: true,
        sort_order: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json(
      { error: "Product could not be created." },
      { status: 500 }
    );
  }
}
