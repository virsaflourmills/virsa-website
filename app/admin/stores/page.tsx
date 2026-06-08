"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase/client";

type Store = {
  id: string;
  name: string;
  city: string;
  address: string;
  is_active: boolean;
  sort_order: number;
};

const confirmedStores = [
  { name: "Sun Farm Fresh Produce & Groceries", city: "Surrey", address: "8882 120 St, Surrey, BC" },
  { name: "Sun Farm Fresh Produce & Groceries", city: "Delta", address: "11968 80 Ave, Delta, BC" },
  { name: "Sun Farm Fresh Produce & Groceries", city: "Abbotsford", address: "3670 Townline Rd #108, Abbotsford, BC" },
  { name: "Sun Farm Fresh Produce & Groceries", city: "Surrey", address: "15299 68 Ave, Surrey, BC" },

  { name: "Sabzi Mandi Supermarket", city: "Langley", address: "20150 Langley Bypass #50, Langley, BC" },
  { name: "Sabzi Mandi Supermarket", city: "Abbotsford", address: "31831 South Fraser Way, Abbotsford, BC" },
  { name: "Sabzi Mandi Supermarket", city: "Surrey", address: "15299 68 Ave, Surrey, BC" },

  { name: "Day To Day Grocery & Produce", city: "Surrey", address: "7843 128 St, Surrey, BC" },
  { name: "Day To Day Grocery & Produce", city: "Delta", address: "11961 82 Ave, Delta, BC" },

  { name: "Surrey Supermarket", city: "Surrey", address: "13853 104 Ave, Surrey, BC" },
  { name: "Surrey Supermarket", city: "Surrey", address: "8158 128 St, Surrey, BC" },

  { name: "A&M Supermart", city: "Surrey", address: "7500 120 St #115, Surrey, BC" },

  { name: "A&G Supermarket", city: "Abbotsford", address: "3057 Lefevre Rd, Abbotsford, BC" },
  { name: "A&G Supermarket", city: "Abbotsford", address: "32346 South Fraser Way, Abbotsford, BC" },

  { name: "Indo Fiji Supermarket", city: "Surrey", address: "8334 128 St Unit #115, Surrey, BC" },
  { name: "Abbotsford Supermarket", city: "Abbotsford", address: "31970 South Fraser Way #102, Abbotsford, BC" },
];

export default function AdminStoresPage() {
  const [userEmail, setUserEmail] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const storeNames = useMemo(() => {
    return Array.from(new Set(stores.map((store) => store.name).filter(Boolean))).sort();
  }, [stores]);

  const groupedStores = useMemo(() => {
    return stores.reduce<Record<string, Store[]>>((acc, store) => {
      if (!acc[store.name]) acc[store.name] = [];
      acc[store.name].push(store);
      return acc;
    }, {});
  }, [stores]);

  async function load() {
    setLoading(true);
    setError("");

    const { data: auth } = await supabase.auth.getUser();
    const email = auth.user?.email || "";

    setUserEmail(email);

    if (email !== "virsaflourmills@gmail.com") {
      setError("Access denied.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("virsa_stores")
      .select("*")
      .order("name", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) setError(error.message);
    else setStores(data || []);

    setLoading(false);
  }

  async function addStore(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const finalName = name === "__new__" ? customName.trim() : name.trim();

    if (!finalName || !city.trim() || !address.trim()) {
      setError("Store name, city, and address are required.");
      setSaving(false);
      return;
    }

    const nextOrder = stores.length + 1;

    const { error } = await supabase.from("virsa_stores").insert({
      name: finalName,
      city: city.trim(),
      address: address.trim(),
      sort_order: nextOrder,
      is_active: true,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setName("");
    setCustomName("");
    setCity("");
    setAddress("");
    setSaving(false);
    load();
  }

  async function seedConfirmedStores() {
    setSaving(true);
    setError("");

    const existingAddresses = new Set(stores.map((store) => store.address.toLowerCase().trim()));

    const storesToInsert = confirmedStores
      .filter((store) => !existingAddresses.has(store.address.toLowerCase().trim()))
      .map((store, index) => ({
        ...store,
        sort_order: stores.length + index + 1,
        is_active: true,
      }));

    if (storesToInsert.length === 0) {
      setError("All 16 confirmed stores already exist.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("virsa_stores").insert(storesToInsert);

    if (error) setError(error.message);

    setSaving(false);
    load();
  }

  async function toggleStore(store: Store) {
    await supabase
      .from("virsa_stores")
      .update({ is_active: !store.is_active })
      .eq("id", store.id);

    load();
  }

  async function deleteStore(id: string) {
    const confirmed = window.confirm("Delete this store location?");
    if (!confirmed) return;

    await supabase.from("virsa_stores").delete().eq("id", id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-20 text-[#241104]">
        Loading admin...
      </main>
    );
  }

  if (error === "Access denied.") {
    return (
      <main className="min-h-screen bg-[#fff8ea] px-6 py-20 text-[#241104]">
        <h1 className="text-4xl font-black">Access denied</h1>
        <p className="mt-4">Logged in as: {userEmail || "Not logged in"}</p>
        <a href="/admin" className="mt-8 inline-block rounded-full bg-[#241104] px-6 py-4 text-white">
          Login Again
        </a>
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
            <h1 className="mt-3 text-5xl font-black">Manage Store Locations</h1>
            <p className="mt-3 text-[#5c4634]">
              Logged in as {userEmail} · {stores.length} total locations
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={seedConfirmedStores}
              disabled={saving}
              className="rounded-full bg-[#d89b38] px-6 py-4 text-sm font-black text-[#241104] disabled:opacity-50"
            >
              Add Confirmed 16 Stores
            </button>

            <button
              onClick={() => supabase.auth.signOut().then(() => location.href = "/admin")}
              className="rounded-full bg-[#241104] px-6 py-4 text-sm font-black text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {error && error !== "Access denied." && (
          <p className="mt-8 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            "Something went wrong. Please try again."
          </p>
        )}

        <form
          onSubmit={addStore}
          className="mt-10 grid gap-4 rounded-[2rem] border border-[#d8b56d]/30 bg-white p-6 shadow-xl md:grid-cols-5"
        >
          <select
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
          >
            <option value="">Choose store name</option>
            {storeNames.map((storeName) => (
              <option key={storeName} value={storeName}>
                {storeName}
              </option>
            ))}
            <option value="__new__">+ Add new store name</option>
          </select>

          {name === "__new__" && (
            <input
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="New store name e.g. Fruiticana"
              className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
            />
          )}

          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none"
          />

          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full address"
            className="rounded-2xl border border-black/10 px-5 py-4 outline-none md:col-span-2"
          />

          <button
            disabled={saving}
            className="rounded-2xl bg-[#241104] px-5 py-4 font-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Location"}
          </button>
        </form>

        <div className="mt-10 grid gap-7">
          {Object.entries(groupedStores).map(([storeName, locations]) => (
            <section
              key={storeName}
              className="rounded-[2rem] border border-[#d8b56d]/30 bg-white p-6 shadow-xl"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-[#ead8b4] pb-5 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">
                    Store Category
                  </p>
                  <h2 className="mt-2 text-3xl font-black">{storeName}</h2>
                </div>

                <span className="rounded-full bg-[#fff2cf] px-5 py-3 text-sm font-black text-[#8a5a20]">
                  {locations.length} location{locations.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                {locations.map((store) => (
                  <div
                    key={store.id}
                    className={`rounded-2xl border p-5 ${
                      store.is_active
                        ? "border-[#ead8b4] bg-[#fff8ea]"
                        : "border-black/10 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b17422]">
                          {store.city} · {store.is_active ? "Visible" : "Hidden"}
                        </p>

                        <p className="mt-2 text-[#5c4634]">{store.address}</p>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            `${store.name}, ${store.address}`
                          )}`}
                          target="_blank"
                          className="mt-3 inline-block text-sm font-black text-[#b17422]"
                        >
                          Test Directions Link
                        </a>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => toggleStore(store)}
                          className="rounded-full bg-white px-5 py-3 text-sm font-black shadow"
                        >
                          {store.is_active ? "Hide" : "Show"}
                        </button>

                        <button
                          onClick={() => deleteStore(store.id)}
                          className="rounded-full bg-red-50 px-5 py-3 text-sm font-black text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}


