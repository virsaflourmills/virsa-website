import Image from "next/image";
import { getStripe } from "../../lib/stripe/client";

export const dynamic = "force-dynamic";

function money(amount?: number | null, currency?: string | null) {
  if (!amount) return "Not available";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency || "cad").toUpperCase(),
  }).format(amount / 100);
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let paid = false;
  let orderNumber = "";
  let customerEmail = "";
  let customerName = "";
  let amount = "";
  let quantity = "1";
  let productName = "Virsa Desi Style Durum Atta - 20 LB";
  let address = "";

  if (sessionId) {
    try {
      const session: any = await getStripe().checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });

      paid = session.payment_status === "paid";
      orderNumber = session.id;
      customerEmail = session.customer_details?.email || "Not provided";
      customerName = session.customer_details?.name || "Not provided";
      amount = money(session.amount_total, session.currency);

      const item = session.line_items?.data?.[0];
      productName = item?.description || productName;
      quantity = String(item?.quantity || session.metadata?.quantity || 1);

      const shipping = session.customer_details?.address || session.shipping_details?.address;
      address = shipping
        ? [shipping.line1, shipping.line2, shipping.city, shipping.state, shipping.postal_code, shipping.country]
            .filter(Boolean)
            .join(", ")
        : "Not provided";
    } catch {
      paid = false;
    }
  }

  if (!paid) {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-28 text-[#241104]">
        <section className="mx-auto max-w-3xl rounded-[3rem] border border-red-200 bg-white p-10 text-center shadow-2xl">
          <Image src="/logo.png" alt="Virsa" width={110} height={110} className="mx-auto" />
          <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-red-600">
            Payment Not Verified
          </p>
          <h1 className="mt-5 text-4xl font-black md:text-5xl">
            We could not confirm your payment.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5c4634]">
            If money was deducted, contact Virsa Flour Mills with your payment details. Do not place another order until confirmed.
          </p>
          <a href="https://wa.me/17785561998" className="mt-8 inline-flex rounded-full bg-[#241104] px-8 py-4 text-sm font-black text-white">
            Contact Virsa
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8ea] px-6 py-24 text-[#241104]">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[3.5rem] border border-[#d8b56d]/40 bg-white shadow-[0_45px_140px_rgba(42,22,8,0.18)]">
        <div className="bg-gradient-to-br from-[#241104] via-[#3b2416] to-[#b17422] px-8 py-12 text-center text-white">
          <Image src="/logo.png" alt="Virsa" width={120} height={120} className="mx-auto rounded-full bg-white/90 p-2" />
          <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-[#f3d69a]">
            Payment Confirmed
          </p>
          <h1 className="mt-5 text-5xl font-black md:text-6xl">
            Thank you for your order.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Your payment was received. Virsa Flour Mills has your order details and will contact you for fulfillment if needed.
          </p>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-2">
          {[
            ["Order Number", orderNumber],
            ["Customer Name", customerName],
            ["Email", customerEmail],
            ["Product", productName],
            ["Quantity", quantity],
            ["Amount Paid", amount],
            ["Delivery Address", address],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[2rem] bg-[#fff8ea] p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">{label}</p>
              <p className="mt-3 break-words text-xl font-black text-[#241104]">{value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#d8b56d]/30 p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b17422]">
            Need Help?
          </p>
          <a href="https://wa.me/17785561998" className="mt-3 block text-3xl font-black">
            778-556-1998
          </a>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="/" className="rounded-full bg-[#241104] px-8 py-4 text-sm font-black text-white">
              Back Home
            </a>
            <a href="/where-to-buy" className="rounded-full border border-[#241104] px-8 py-4 text-sm font-black">
              Store Locations
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
