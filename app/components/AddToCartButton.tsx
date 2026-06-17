"use client";

import { useState } from "react";

export default function AddToCartButton({
  productName,
}: {
  productName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function checkout() {
    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName,
        quantity,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    alert("Checkout is unavailable right now. Please try again.");
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 sm:items-end">
      <div className="flex items-center justify-between gap-4 rounded-full bg-[#fff8ea] px-4 py-3 shadow-inner">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6a43]">
          Qty
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-black text-[#241104] shadow"
          >
            -
          </button>

          <span className="w-8 text-center text-lg font-black text-[#241104]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-black text-[#241104] shadow"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={checkout}
        disabled={loading}
        className="inline-flex justify-center rounded-full bg-[#2a1608] px-8 py-4 text-sm font-black text-white transition hover:scale-105 disabled:opacity-60"
      >
        {loading ? "Opening Checkout..." : "Add To Cart"}
      </button>
    </div>
  );
}
