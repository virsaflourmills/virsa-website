import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = {
  "desi-style-durum-atta-20lb": {
    name: "Virsa Desi Style Durum Atta - 20 LB",
    price: 1499,
    image: "https://www.virsaflourmills.com/package.png",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body || {};

if (typeof body === "string") {
  try {
    body = JSON.parse(body);
  } catch {
    body = {};
  }
}

let cartItems = body.cartItems;

if (!cartItems) {
  cartItems = [
    {
      id: "desi-style-durum-atta-20lb",
      quantity: body.quantity || 1,
    },
  ];
}

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const line_items = cartItems.map((item) => {
      const product = products[item.id];

      if (!product) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }

      const quantity = Math.max(1, Math.min(Number(item.quantity || 1), 20));

      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price,
        },
        quantity,
      };
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.BASE_URL ||
      req.headers.origin ||
      "https://www.virsaflourmills.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      customer_creation: "always",
      metadata: {
        order_source: "Virsa Flour Mills Website",
        product_name: line_items.length === 1 ? products[cartItems[0].id].name : "Multiple Products",
        quantity: String(cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0)),
      },
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return res.status(500).json({
      error: "Checkout could not be started.",
    });
  }
}
