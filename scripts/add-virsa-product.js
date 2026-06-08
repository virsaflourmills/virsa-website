const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const productName = "Desi Ghraat Style Atta";
  const priceCents = 1499;

  const stripeProduct = await stripe.products.create({
    name: productName,
    description:
      "Premium cold-pressed atta crafted for soft rotis, smooth dough, and authentic household taste.",
    images: [],
    metadata: {
      brand: "Virsa Flour Mills",
      weight: "20 LB",
    },
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: priceCents,
    currency: "cad",
  });

  const { error } = await supabase.from("virsa_products").insert({
    name: productName,
    description:
      "Premium cold-pressed atta crafted for soft rotis, smooth dough, and authentic household taste.",
    image_url: "/package.png",
    price_cents: priceCents,
    currency: "cad",
    weight: "20 LB",
    is_active: true,
    sort_order: 1,
    stripe_product_id: stripeProduct.id,
    stripe_price_id: stripePrice.id,
  });

  if (error) throw error;

  console.log("Product added successfully:");
  console.log("Stripe Product:", stripeProduct.id);
  console.log("Stripe Price:", stripePrice.id);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
