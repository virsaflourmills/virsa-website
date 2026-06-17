import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../../../lib/supabase/admin";
import { getStripe } from "../../../../../lib/stripe/client";

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
    const id = String(body.id || "");
    const newPriceCents = Math.round(Number(body.price) * 100);

    if (!id || !newPriceCents || newPriceCents < 50) {
      return NextResponse.json(
        { error: "Valid product and price are required." },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("virsa_products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError || !product?.stripe_product_id) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const stripePrice = await getStripe().prices.create({
      product: product.stripe_product_id,
      unit_amount: newPriceCents,
      currency: "cad",
    });

    if (product.stripe_price_id) {
      await getStripe().prices.update(product.stripe_price_id, {
        active: false,
      });
    }

    const { error } = await supabaseAdmin
      .from("virsa_products")
      .update({
        price_cents: newPriceCents,
        stripe_price_id: stripePrice.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Price could not be updated." },
      { status: 500 }
    );
  }
}
