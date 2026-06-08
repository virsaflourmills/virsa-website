"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/client";

type Order = {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent: string;
  customer_name: string;
  customer_email: string;
  shipping_name: string;
  shipping_address: any;
  amount_total: number;
  currency: string;
  payment_status: string;
  product_name: string;
  quantity: number;
  created_at: string;
};

function formatAddress(address: any) {
  if (!address) return "No address found";

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const email = auth.user?.email || "";
    setUserEmail(email);

    if (email !== "virsaflourmills@gmail.com") {
      setMessage("Access denied.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("virsa_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setMessage("Could not load orders.");
    else setOrders(data || []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-20 text-[#241104]">
        Loading orders...
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
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#b17422]">
              Virsa Admin
            </p>
            <h1 className="mt-3 text-5xl font-black">Orders</h1>
            <p className="mt-3 text-[#5c4634]">
              Paid Stripe orders will appear here automatically.
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-full bg-[#241104] px-6 py-4 text-sm font-black text-white"
          >
            Refresh Orders
          </button>
        </div>

        {message && message !== "Access denied." && (
          <p className="mt-8 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            {message}
          </p>
        )}

        <div className="mt-10 grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[2rem] border border-[#d8b56d]/30 bg-white p-7 shadow-xl"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">
                    {order.payment_status}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    {order.product_name || "Virsa Product"} × {order.quantity || 1}
                  </h2>

                  <p className="mt-2 text-3xl font-black text-[#b17422]">
                    ${((order.amount_total || 0) / 100).toFixed(2)} {order.currency?.toUpperCase()}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="font-black">
                    {order.customer_name || order.shipping_name || "No name"}
                  </p>

                  <p className="mt-1 text-[#5c4634]">
                    {order.customer_email || "No email"}
                  </p>

                  <p className="mt-2 text-sm text-[#5c4634]">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#fff8ea] p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">
                  Delivery Address
                </p>

                <p className="mt-2 leading-7 text-[#5c4634]">
                  {formatAddress(order.shipping_address)}
                </p>
              </div>

              <a
                href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent}`}
                target="_blank"
                className="mt-5 inline-block text-sm font-black text-[#b17422]"
              >
                Open in Stripe →
              </a>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="rounded-[2rem] bg-white p-8 text-center font-bold text-[#5c4634] shadow-xl">
              No paid orders yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

