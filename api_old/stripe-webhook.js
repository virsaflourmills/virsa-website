const Stripe = require("stripe");
const https = require("https");

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
}

function postJson(urlString, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const body = JSON.stringify(data);

    const options = {
      hostname: url.hostname,
      path: `${url.pathname}${url.search}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const request = https.request(options, (response) => {
      let raw = "";

      response.on("data", (chunk) => {
        raw += chunk;
      });

      response.on("end", () => {
        resolve({
          statusCode: response.statusCode,
          body: raw,
        });
      });
    });

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    if (!process.env.GOOGLE_SCRIPT_WEBAPP_URL) {
      throw new Error("Missing GOOGLE_SCRIPT_WEBAPP_URL");
    }

    if (!process.env.GOOGLE_SCRIPT_SECRET) {
      throw new Error("Missing GOOGLE_SCRIPT_SECRET");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];
    const rawBody = await buffer(req);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;

      const orderData = {
        secret: process.env.GOOGLE_SCRIPT_SECRET,
        event_type: event.type,
        order_date: new Date().toISOString(),
        session_id: session.id || "",
        payment_status: session.payment_status || "",
        customer_email: session.customer_details?.email || session.customer_email || "",
        customer_name: session.customer_details?.name || "",
        customer_phone: session.customer_details?.phone || "",
        amount_total: session.amount_total ? (session.amount_total / 100).toFixed(2) : "",
        currency: session.currency || "cad",
        quantity: session.metadata?.quantity || "",
        product_name: session.metadata?.product_name || "Desi Style Durum Atta",
        address_line1: session.customer_details?.address?.line1 || "",
        address_line2: session.customer_details?.address?.line2 || "",
        city: session.customer_details?.address?.city || "",
        province: session.customer_details?.address?.state || "",
        postal_code: session.customer_details?.address?.postal_code || "",
        country: session.customer_details?.address?.country || "",
      };

      const sheetResponse = await postJson(process.env.GOOGLE_SCRIPT_WEBAPP_URL, orderData);

      console.log("Google Sheets response:", sheetResponse.statusCode, sheetResponse.body);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};