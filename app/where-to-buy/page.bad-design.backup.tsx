"use client";

import { useState } from "react";

const storeGroups = [
  {
    name: "Sun Farm Fresh Produce & Groceries",
    stores: [
      { address: "8882 120 St, Surrey, BC", lat: 49.1625, lng: -122.8897 },
      { address: "11968 80 Ave, Delta, BC", lat: 49.1486, lng: -122.8926 },
      { address: "3670 Townline Rd #108, Abbotsford, BC", lat: 49.0669, lng: -122.3601 },
      { address: "15299 68 Ave, Surrey, BC", lat: 49.1269, lng: -122.7981 },
    ],
  },
  {
    name: "Sabzi Mandi Supermarket",
    stores: [
      { address: "20150 Langley Bypass #50, Langley, BC", lat: 49.1135, lng: -122.6653 },
      { address: "31831 South Fraser Way, Abbotsford, BC", lat: 49.0502, lng: -122.3417 },
      { address: "15299 68 Ave, Surrey, BC", lat: 49.1269, lng: -122.7981 },
    ],
  },
  {
    name: "Day To Day Grocery & Produce",
    stores: [
      { address: "7843 128 St, Surrey, BC", lat: 49.1450, lng: -122.8665 },
      { address: "11961 82 Ave, Delta, BC", lat: 49.1518, lng: -122.8918 },
    ],
  },
  {
    name: "Surrey Supermarket",
    stores: [
      { address: "13853 104 Ave, Surrey, BC", lat: 49.1913, lng: -122.8373 },
      { address: "8158 128 St, Surrey, BC", lat: 49.1506, lng: -122.8668 },
    ],
  },
  {
    name: "A&G Supermarket",
    stores: [
      { address: "3057 Lefevre Rd, Abbotsford, BC", lat: 49.0571, lng: -122.2684 },
      { address: "32346 South Fraser Way, Abbotsford, BC", lat: 49.0508, lng: -122.3282 },
    ],
  },
  {
    name: "A&M Supermart",
    stores: [
      { address: "7500 120 St #115, Surrey, BC", lat: 49.1399, lng: -122.8907 },
    ],
  },
  {
    name: "Indo Fiji Supermarket",
    stores: [
      { address: "8334 128 St Unit #115, Surrey, BC", lat: 49.1554, lng: -122.8668 },
    ],
  },
  {
    name: "Abbotsford Supermarket",
    stores: [
      { address: "31970 South Fraser Way #102, Abbotsford, BC", lat: 49.0504, lng: -122.3380 },
    ],
  },
];

const allStores = storeGroups.flatMap((group) =>
  group.stores.map((store) => ({
    name: group.name,
    address: store.address,
    lat: store.lat,
    lng: store.lng,
  }))
);

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapLink(store: { name: string; address: string }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${store.name}, ${store.address}`
  )}`;
}

export default function WhereToBuyPage() {
  const [nearest, setNearest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function findNearestStore() {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const closest = allStores
          .map((store) => ({
            ...store,
            distance: distanceKm(userLat, userLng, store.lat, store.lng),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        setNearest(closest);
        setLoading(false);
      },
      () => {
        alert("Location permission denied. Please allow location access.");
        setLoading(false);
      }
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f1e4] px-6 py-28 text-[#241104]">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#241104] px-8 py-16 text-center text-white shadow-2xl">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#d89b38]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d89b38]">
              Available Across BC
            </p>

            <h1 className="mt-5 text-5xl font-black md:text-7xl">
              Find Virsa Near You
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
              Use your current location to find the closest Virsa Atta retail partner.
            </p>

            <button
              onClick={findNearestStore}
              className="mt-8 rounded-full bg-[#d89b38] px-9 py-4 text-sm font-black text-[#241104] shadow-xl transition hover:scale-105"
            >
              {loading ? "Finding nearest store..." : "Use My Current Location"}
            </button>

            {nearest && (
              <div className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d89b38]">
                  Nearest Location
                </p>

                <h2 className="mt-3 text-2xl font-black">{nearest.name}</h2>
                <p className="mt-2 text-white/75">{nearest.address}</p>
                <p className="mt-2 text-sm font-bold text-[#f3d18a]">
                  Approx. {nearest.distance.toFixed(1)} km away
                </p>

                <a
                  href={mapLink(nearest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex rounded-full bg-white px-7 py-3 text-sm font-black text-[#241104]"
                >
                  Get Directions
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {storeGroups.map((group) => (
            <div
              key={group.name}
              className="overflow-hidden rounded-[2.5rem] bg-[#241104] shadow-2xl"
            >
              <div className="border-b border-white/10 bg-white/[0.04] px-7 py-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-white">
                    {group.name}
                  </h2>

                  <span className="rounded-full bg-[#d89b38] px-4 py-2 text-xs font-black text-[#241104]">
                    {group.stores.length} Location{group.stores.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {group.stores.map((store, index) => {
                  const fullStore = {
                    name: group.name,
                    address: store.address,
                  };

                  return (
                    <a
                      key={`${group.name}-${store.address}`}
                      href={mapLink(fullStore)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 transition hover:border-[#d89b38]/70 hover:bg-white/[0.1]"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d89b38]">
                            Store {index + 1}
                          </p>

                          <p className="mt-2 leading-7 text-white/78">
                            {store.address}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-black text-white/80">
                          Directions →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
