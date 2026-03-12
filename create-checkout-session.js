const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { quantity } = req.body || {};

    const safeQuantity = Math.max(1, Math.min(20, parseInt(quantity, 10) || 1));

    const origin =
      req.headers.origin ||
      `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Desi Style Durum Atta",
            },
            unit_amount: 1999,
          },
          quantity: safeQuantity,
        },
      ],
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ error: "Unable to create checkout session." });
  }
};