"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabase/client";

type Store = {
  id: string;
  name: string;
  city: string;
  address: string;
  sort_order: number;
};

export default function StoreLocator() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    async function loadStores() {
      const { data } = await supabase
        .from("virsa_stores")
        .select("id,name,city,address,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      setStores(data || []);
    }

    loadStores();
  }, []);

  return (
    <section id="stores" className="relative overflow-hidden bg-[#241104] px-6 py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d89b3820,transparent_30%),radial-gradient(circle_at_80%_80%,#ffffff10,transparent_20%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-[#d89b38]">
            Available Across BC
          </p>

          <h2 className="text-5xl font-black md:text-6xl">
            Find Virsa Near You
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Premium cold-pressed atta now available across Surrey, Delta, Langley, and Abbotsford.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {stores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, rotateX: 4, scale: 1.02 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d89b38]">
                    {store.city}
                  </p>

                  <h3 className="mt-3 text-3xl font-black">
                    {store.name}
                  </h3>

                  <p className="mt-4 max-w-md leading-7 text-white/65">
                    {store.address}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#d89b38]/15 p-4 text-[#d89b38]">
                  <MapPin />
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                className="mt-8 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:scale-105 hover:bg-white/15"
              >
                Get Directions
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

