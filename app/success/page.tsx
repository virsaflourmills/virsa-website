import Image from "next/image";
import { getStripe } from "../../lib/stripe/client";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let paid = false;

  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
    } catch {
      paid = false;
    }
  }

  if (!paid) {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-28 text-[#241104]">
        <section className="mx-auto max-w-3xl rounded-[3rem] border border-[#d8b56d]/30 bg-white p-10 text-center shadow-2xl">
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

          <a
            href="https://wa.me/17785561998"
            className="mt-8 inline-flex rounded-full bg-[#241104] px-8 py-4 text-sm font-black text-white"
          >
            Contact Virsa
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8ea] px-6 py-28 text-[#241104]">
      <section className="mx-auto max-w-3xl rounded-[3rem] border border-[#d8b56d]/30 bg-white p-10 text-center shadow-2xl">
        <Image src="/logo.png" alt="Virsa" width={120} height={120} className="mx-auto" />

        <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-[#b17422]">
          Payment Confirmed
        </p>

        <h1 className="mt-5 text-5xl font-black">
          Thank you for your order.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5c4634]">
          Your payment was successfully processed and Virsa Flour Mills has received your order.
        </p>

        <div className="mt-10 rounded-[2rem] bg-[#fff8ea] p-6">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b17422]">
            Need Help?
          </p>

          <a href="https://wa.me/17785561998" className="mt-3 block text-3xl font-black">
            778-556-1998
          </a>
        </div>

        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#241104] px-8 py-4 text-sm font-black text-white"
        >
          Back Home
        </a>
      </section>
    </main>
  );
}
