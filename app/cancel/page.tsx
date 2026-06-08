import Image from "next/image";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#fff8ea] px-6 py-28 text-[#241104]">
      <section className="mx-auto max-w-3xl rounded-[3rem] border border-[#d8b56d]/30 bg-white p-10 text-center shadow-2xl">
        <Image src="/logo.png" alt="Virsa" width={120} height={120} className="mx-auto" />

        <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-[#b17422]">
          Checkout Cancelled
        </p>

        <h1 className="mt-5 text-5xl font-black">
          No payment was taken.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5c4634]">
          Your checkout was cancelled before completion. You can return anytime to continue your order.
        </p>

        <div className="mt-10 rounded-[2rem] bg-[#fff8ea] p-6">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b17422]">
            Need Help Ordering?
          </p>

          <a href="https://wa.me/17785561998" className="mt-3 block text-3xl font-black">
            778-556-1998
          </a>

          <p className="mt-2 text-[#5c4634]">
            Call or WhatsApp us and we will help you place your order.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="/products" className="rounded-full bg-[#241104] px-8 py-4 text-sm font-black text-white">
            Back To Products
          </a>

          <a href="/" className="rounded-full border border-[#241104] px-8 py-4 text-sm font-black">
            Back Home
          </a>
        </div>
      </section>
    </main>
  );
}
