"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_cents: number;
  weight: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProduct, setLoadingProduct] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  async function loadProducts() {
    const { data } = await supabase
      .from("virsa_products")
      .select("id,name,description,image_url,price_cents,weight")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    setProducts(data || []);
  }

  async function checkout(productId: string) {
    setLoadingProduct(productId);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity: quantities[productId] || 1 }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    alert("Checkout is unavailable right now. Please try again.");
    setLoadingProduct("");
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fff8ea] px-6 py-28 text-[#241104]">
      <section className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b17422]">
            Virsa Products
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Premium Cold-Pressed Atta
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5c4634]">
            Order Virsa Flour Mills products directly online.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-[2.5rem] border border-[#d8b56d]/30 bg-white p-7 shadow-2xl"
            >
              {product.image_url && (
                <div className="relative h-80 overflow-hidden rounded-[2rem] bg-[#fff8ea]">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
              )}

              <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-[#b17422]">
                {product.weight}
              </p>

              <h2 className="mt-3 text-3xl font-black">{product.name}</h2>

              <p className="mt-4 leading-8 text-[#5c4634]">
                {product.description}
              </p>

              <p className="mt-6 text-4xl font-black text-[#b17422]">
                ${(product.price_cents / 100).toFixed(2)}
              </p>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#fff8ea] px-5 py-4">
                <span className="text-sm font-black text-[#5c4634]">Quantity</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, (prev[product.id] || 1) - 1),
                      }))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-black shadow"
                  >
                    -
                  </button>

                  <span className="w-8 text-center font-black">
                    {quantities[product.id] || 1}
                  </span>

                  <button
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.min(20, (prev[product.id] || 1) + 1),
                      }))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-black shadow"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => checkout(product.id)}
                disabled={loadingProduct === product.id}
                className="mt-7 w-full rounded-full bg-[#241104] px-8 py-4 text-sm font-black text-white transition hover:scale-105 disabled:opacity-60"
              >
                {loadingProduct === product.id ? "Opening Checkout..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-16 text-center text-lg font-bold text-[#5c4634]">
            Products will be available soon.
          </p>
        )}
      </section>
    </main>
  );
}


