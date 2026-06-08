"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "About", href: "#about" },
    { label: "Stores", href: "#stores" },
    { label: "Products", href: "/products" },
    { label: "Community", href: "#community" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/5 bg-[#f8f1e4]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-24 sm:px-8">
        <a href="#" className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Image
            src="/logo.png"
            alt="Virsa"
            width={72}
            height={72}
            className="h-14 w-14 shrink-0 object-contain sm:h-[88px] sm:w-[88px]"
            priority
          />

          <div className="min-w-0">
            <h1 className="truncate text-[1.35rem] font-black leading-none tracking-[-0.04em] text-[#2a1608] sm:text-[2rem]">
              Virsa Flour Mills
            </h1>

            <p className="mt-1 max-w-[220px] truncate text-[9px] font-bold uppercase tracking-[0.14em] text-[#b17422] sm:mt-2 sm:max-w-none sm:text-[11px] sm:tracking-[0.18em]">
              Desi Ghraat Style Atta • Durum Atta • Canada
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-black text-[#2a1608] transition hover:text-[#c27c22]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#stores"
          className="hidden rounded-full bg-[#2a1608] px-8 py-3 text-base font-semibold text-white transition hover:scale-105 md:block"
        >
          Find Virsa
        </a>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2a1608] text-white shadow-lg md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-[#f8f1e4] shadow-2xl md:hidden">
          <div className="flex flex-col px-5 py-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-black/5 py-4 text-base font-black text-[#2a1608]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/where-to-buy"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full bg-[#2a1608] px-6 py-4 text-center text-sm font-black text-white"
            >
              Find Virsa Near You
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

