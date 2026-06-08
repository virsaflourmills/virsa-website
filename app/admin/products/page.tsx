"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_cents: number;
  weight: string;
  is_active: boolean;
  stripe_price_id: string;
};

export default function AdminProductsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weight, setWeight] = useState("20 LB");
  const [price, setPrice] = useState("14.99");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("");

    const { data: auth } = await supabase.auth.getUser();
    const email = auth.user?.email || "";
    setUserEmail(email);

    if (email !== "virsaflourmills@gmail.com") {
      setMessage("Access denied.");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("virsa_products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        image_url: imageUrl,
        weight,
        price,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Product could not be created.");
      setSaving(false);
      return;
    }

    setName("");
    setDescription("");
    setImageUrl("");
    setWeight("20 LB");
    setPrice("14.99");
    setSaving(false);
    load();
  }

  async function updatePrice(product: Product) {
    const nextPrice = window.prompt(
      `New price for ${product.name}`,
      (product.price_cents / 100).toFixed(2)
    );

    if (!nextPrice) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch("/api/admin/products/update-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: product.id,
        price: nextPrice,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Price could not be updated.");
      return;
    }

    load();
  }

  async function toggleProduct(product: Product) {
    await supabase
      .from("virsa_products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-20 text-[#241104]">
        Loading products...
      </main>
    );
  }

  if (message === "Access denied.") {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-20 text-[#241104]">
        <h1 className="text-4xl font-black">Access denied</h1>
        <p className="mt-4">Logged in as: {userEmail || "Not logged in"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8ea] px-6 py-20 text-[#241104]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#b17422]">
              Virsa Admin
            </p>
            <h1 className="mt-3 text-5xl font-black">Manage Products</h1>
            <p className="mt-3 text-[#5c4634]">
              Add products, images, prices, and Stripe checkout links.
            </p>
          </div>

          <a
            href="/admin/stores"
            className="rounded-full bg-[#241104] px-6 py-4 text-sm font-black text-white"
          >
            Manage Stores
          </a>
        </div>

        {message && message !== "Access denied." && (
          <p className="mt-8 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            {message}
          </p>
        )}

        <form
          onSubmit={addProduct}
          className="mt-10 grid gap-4 rounded-[2rem] border border-[#d8b56d]/30 bg-white p-6 shadow-xl md:grid-cols-2"
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name e.g. Desi Ghraat Style Atta"
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
          />

          <input
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price e.g. 14.99"
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
          />

          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight e.g. 20 LB"
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image path e.g. /package.png or full image URL"
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short product description"
            className="min-h-32 rounded-2xl border border-black/10 px-5 py-4 outline-none md:col-span-2"
          />

          <button
            disabled={saving}
            className="rounded-2xl bg-[#241104] px-5 py-4 font-black text-white disabled:opacity-50 md:col-span-2"
          >
            {saving ? "Creating Product..." : "Create Product + Stripe Price"}
          </button>
        </form>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-[2rem] border border-[#d8b56d]/30 bg-white p-6 shadow-xl"
            >
              <div className="flex gap-5">
                {product.image_url && (
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#fff8ea]">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">
                    {product.is_active ? "Active" : "Hidden"}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">{product.name}</h2>

                  <p className="mt-2 text-[#5c4634]">{product.weight}</p>

                  <p className="mt-3 text-3xl font-black text-[#b17422]">
                    ${(product.price_cents / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <p className="mt-5 leading-7 text-[#5c4634]">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => updatePrice(product)}
                  className="rounded-full bg-[#241104] px-5 py-3 text-sm font-black text-white"
                >
                  Change Price
                </button>

                <button
                  onClick={() => toggleProduct(product)}
                  className="rounded-full bg-[#fff8ea] px-5 py-3 text-sm font-black"
                >
                  {product.is_active ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
