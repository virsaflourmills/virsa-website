import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = {
  "desi-style-durum-atta-20lb": {
    name: "Desi Style Durum Atta - 20 lb",
    price: 1999,
    image: "https://yourdomain.com/package.png",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const line_items = cartItems.map((item) => {
      const product = products[item.id];

      if (!product) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        throw new Error(`Invalid quantity for: ${item.id}`);
      }

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
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["CA"],
      },

      phone_number_collection: {
        enabled: true,
      },

      customer_creation: "always",

      metadata: {
        order_source: "Virsa Flour Mills Website",
      },
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong while creating checkout session",
    });
  }
}