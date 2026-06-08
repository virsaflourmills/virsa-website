"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Wheat,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "./components/Navbar";
import StoreLocator from "./components/stores/StoreLocator";
import { FaWhatsapp } from "react-icons/fa";

const stores = [
  "Sun Farm - 8882 120 St, Surrey",
  "Sun Farm - 11968 80 Ave, Delta",
  "A&M Supermart - 7500 120 St #115, Surrey",
  "Day To Day Grocery - 7843 128 St, Surrey",
  "Day To Day Grocery - 11961 82 Ave, Delta",
  "Sabzi Mandi Supermarket - 20150 Langley Bypass #50, Langley",
  "Sun Farm - 3670 Townline Rd #108, Abbotsford",
  "Sabzi Mandi - 31831 South Fraser Way, Abbotsford",
  "A&G Supermarket - 3057 Lefeuvre Rd, Abbotsford",
  "A&G Supermarket - 32346 South Fraser Way, Abbotsford",
];

function FloatingGrains() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[
        "left-[8%] top-[18%]",
        "left-[18%] top-[72%]",
        "left-[42%] top-[14%]",
        "right-[16%] top-[18%]",
        "right-[8%] top-[68%]",
        "left-[55%] bottom-[12%]",
      ].map((pos, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -24, 0],
            rotate: [0, 18, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
          className={`absolute ${pos} h-16 w-7 rounded-full bg-gradient-to-b from-[#e7b85e] to-[#8b4b14] opacity-60 shadow-2xl`}
          style={{
            transform: "rotate(28deg)",
            borderRadius: "70% 30% 70% 30%",
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#fff8ea] text-[#241104] [background-image:radial-gradient(#b1742230_1px,transparent_1px)] [background-size:32px_32px]">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-[#fff3dc] px-6 pb-20 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,#d89b3860,transparent_34%),radial-gradient(circle_at_18%_78%,#7a3f1320,transparent_30%)]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[13rem] font-black uppercase tracking-[0.28em] text-[#241104]/[0.035] blur-[1px] md:text-[22rem]">
          VIRSA
        </div>

        <div className="pointer-events-none absolute right-0 top-10 h-[520px] w-[520px] rounded-full bg-[#d4a24c]/25 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(90deg,#b1742218_1px,transparent_1px),linear-gradient(#b1742218_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="pointer-events-none absolute left-[-12%] top-[18%] h-[380px] w-[380px] rounded-full bg-[#d89b38]/20 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-8%] top-[14%] h-[520px] w-[520px] rounded-full bg-[#8b4b14]/15 blur-[110px]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-[1550px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#c27c22]/35 bg-white/75 px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#7a3f13] shadow-[0_25px_80px_rgba(42,22,8,0.14)] backdrop-blur-2xl md:text-base"
            >
              <Sparkles size={18} />
              CANADA'S 1ST & ONLY COLD-PRESSED FLOUR MILL
            </motion.div>

            <h1 className="max-w-4xl text-6xl font-black leading-[0.86] tracking-[-0.06em] text-[#241104] md:text-8xl">
              Cold-Pressed
              <span className="block text-[#c27c22]">
                Premium Atta.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-[#5c4634]">
              Fresh cold-pressed whole wheat atta crafted for soft rotis,
              authentic taste, and everyday Punjabi homes across BC.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#stores"
                className="rounded-full bg-[#241104] px-9 py-5 text-sm font-black text-white shadow-[0_25px_80px_rgba(36,17,4,0.32)] transition hover:scale-105"
              >
                Find Stores
              </a>

              <a
                href="#contact"
                className="rounded-full border border-[#241104]/20 bg-white/75 px-9 py-5 text-sm font-black text-[#241104] shadow-xl backdrop-blur-xl transition hover:scale-105"
              >
                Contact Virsa
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
              {["Cold-Pressed", "Freshly Milled", "Made in BC"].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -8, rotateX: 8, scale: 1.03 }}
                  className="rounded-3xl border border-white/70 bg-white/70 p-5 text-center shadow-xl backdrop-blur-xl"
                >
                  <p className="text-sm font-black text-[#241104]">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative flex min-h-[720px] items-center justify-center [perspective:1800px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
              className="absolute h-[720px] w-[720px] rounded-full border border-dashed border-[#c27c22]/20"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute h-[510px] w-[510px] rounded-full border border-white/70 shadow-[0_0_100px_rgba(216,155,56,0.28)]"
            />

            <motion.div
              animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-2 top-24 z-20 rounded-[2rem] border border-white/70 bg-white/65 px-7 py-5 shadow-[0_35px_100px_rgba(42,22,8,0.18)] backdrop-blur-2xl"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">
                Cold Pressed
              </p>
              <p className="mt-2 text-3xl font-black text-[#241104]">
                Fresh Grind
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 16, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-56 z-20 rounded-[2rem] border border-white/70 bg-white/65 px-7 py-5 shadow-[0_35px_100px_rgba(42,22,8,0.18)] backdrop-blur-2xl"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b17422]">
                Soft Rotis
              </p>
              <p className="mt-2 text-3xl font-black text-[#241104]">
                Family Pack
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-[590px] w-[590px] rounded-full bg-[#d89b38]/25 blur-[85px]"
            />

            <motion.div
              initial={{ opacity: 0, rotateY: -22, rotateX: 8, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: -8, rotateX: 4, scale: 1 }}
              whileHover={{ rotateY: 0, rotateX: 0, scale: 1.04 }}
              transition={{ duration: 0.85 }}
              className="relative z-10 rounded-[4rem] border border-white/35 bg-white/20 p-6 shadow-[0_45px_140px_rgba(42,22,8,0.28)] backdrop-blur-xl [transform:perspective(1200px)_rotateY(-8deg)_rotateX(2deg)] [transform-style:preserve-3d] transition-all duration-700 hover:scale-105 hover:rotate-1"
            >
              <Image
                src="/hero.png"
                alt="Virsa Atta"
                width={900}
                height={900}
                priority
                className="max-h-[840px] w-auto object-contain drop-shadow-[0_110px_110px_rgba(42,22,8,0.58)]"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 left-10 z-20 rounded-[2rem] bg-[#241104] px-8 py-6 text-white shadow-2xl"
            >
              <p className="text-5xl font-black">20 LB</p>
              <p className="mt-1 text-sm font-bold text-white/60">Family Pack</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden border-y border-black/5 bg-[#241104] py-6 text-white">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="flex w-[200%] gap-16 whitespace-nowrap text-2xl font-black uppercase tracking-[0.25em]"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-16"
            >
              <span className="text-[#d89b38]">
                Cold-Pressed
              </span>

              <span>
                Freshly Milled
              </span>

              <span className="text-[#d89b38]">
                Made In Canada
              </span>

              <span>
                Real Punjabi Taste
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="products" className="relative bg-white px-6 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d89b3822,transparent_30%),radial-gradient(circle_at_80%_80%,#7a3f1320,transparent_30%)]" />

        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-7xl"
        >
          <div className="text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b17422]">
              Our Product
            </p>

            <h2 className="text-5xl font-black md:text-6xl">
              Crafted For Real Homes
            </h2>
          </div>

          <motion.div
            whileHover={{ rotateX: 3, rotateY: -3, scale: 1.015 }}
            transition={{ duration: 0.4 }}
            className="mt-16 overflow-hidden rounded-[3.5rem] border border-white/70 bg-gradient-to-br from-[#fff7e8] via-[#f3dfb8] to-[#fffaf0] p-10 shadow-[0_55px_150px_rgba(42,22,8,0.24)] [perspective:1400px]"
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Image
                src="/package.png"
                alt="Cold-Pressed Whole Wheat Atta"
                width={480}
                height={480}
                className="mx-auto drop-shadow-2xl"
              />

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#b17422]">
                  20 LB
                </p>

                <h3 className="mt-3 text-5xl font-black">
                  Cold-Pressed Whole Wheat Atta
                </h3>

                <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c4634]">
                  Freshly milled traditional-style atta crafted for soft rotis,
                  authentic taste, and daily family use.
                </p>

                <a
                  href="#stores"
                  className="mt-8 inline-block rounded-full bg-[#2a1608] px-8 py-4 text-sm font-bold text-white transition hover:scale-105"
                >
                  Available In Stores
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="about" className="bg-[#fff8ea] px-6 py-28">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              className="overflow-hidden rounded-[3rem] shadow-2xl"
            >
              <Image
                src="/vision.png"
                alt="Virsa Vision"
                width={700}
                height={700}
                className="w-full rounded-[3rem] object-cover"
              />
            </motion.div>

            <div className="mt-8 max-w-3xl rounded-[2rem] bg-white/70 p-8 shadow-xl">
              <p className="text-lg leading-8 text-[#5b4636]">
                At Virsa Flour Mills, our vision is to bring the authentic taste of traditional Desi Ghraat Style Atta to every home while preserving the rich heritage of our culture.
              </p>

              <a
                href="/vision"
                className="mt-6 inline-flex rounded-full bg-[#3b2416] px-6 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-[#5b351f]"
              >
                Click to read more
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b17422]">
              Why Virsa
            </p>

            <h2 className="text-5xl font-black leading-tight">
              Traditional Quality. Modern Freshness.
            </h2>

            <div className="mt-10 space-y-6">
              {[
                [
                  Wheat,
                  "Premium Wheat",
                  "Carefully selected grains for authentic taste and texture.",
                ],
                [
                  Leaf,
                  "Cold-Pressed Milling",
                  "Lower heat grinding designed to preserve freshness.",
                ],
                [
                  ShieldCheck,
                  "Crafted in Canada",
                  "Built to bring authentic household taste across BC.",
                ],
              ].map(([Icon, title, text]: any) => (
                <motion.div
                  whileHover={{ x: 10, scale: 1.02 }}
                  key={title}
                  className="flex gap-4 rounded-3xl bg-white p-6 shadow-xl"
                >
                  <Icon className="mt-1 text-[#c27c22]" />

                  <div>
                    <h3 className="text-xl font-black">{title}</h3>
                    <p className="mt-2 text-[#5c4634]">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="stores" className="bg-[#241104] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-[#d89b38]">
            Available Across BC
          </p>

          <h2 className="text-5xl font-black md:text-6xl">
            Find Virsa Near You
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            See all Virsa Flour Mills retail locations with Google Maps directions.
          </p>

          <a
            href="/where-to-buy"
            className="mt-10 inline-flex rounded-full bg-[#d89b38] px-9 py-5 text-sm font-black text-[#241104] shadow-[0_25px_80px_rgba(216,155,56,0.28)] transition hover:scale-105"
          >
            View Store Locations
          </a>
        </div>
      </section>

      <section id="community" className="bg-[#f8f1e4] px-6 py-28">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b17422]">
              Our Story
            </p>

            <h2 className="text-5xl font-black leading-tight">
              More Than Flour.
              <span className="block text-[#c27c22]">
                It's Family Heritage.
              </span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-[#5c4634]">
              Virsa was built to bring back authentic household taste through
              fresh cold-pressed atta crafted with care, tradition, and quality.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.03, rotate: 1 }}>
            <Image
              src="/community.png"
              alt="Virsa Community"
              width={800}
              height={900}
              className="rounded-[3rem] object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      

      <section className="relative overflow-hidden bg-white px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-[#b17422]">
                Follow The Journey
              </p>

              <h2 className="text-5xl font-black leading-tight text-[#241104] md:text-6xl">
                See Virsa On Instagram
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c4634]">
                Follow product updates, store launches, fresh stock announcements, and community moments.
              </p>

              <a
                href="https://www.instagram.com/virsa_flour_mills"
                target="_blank"
                className="mt-9 inline-flex rounded-full bg-[#241104] px-8 py-5 text-sm font-black text-white shadow-xl transition hover:scale-105"
              >
                @virsa_flour_mills
              </a>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {["Fresh Stock", "Store Launches", "Real Families"].map((item, i) => (
                <motion.a
                  key={item}
                  href="https://www.instagram.com/virsa_flour_mills"
                  target="_blank"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12, rotate: i === 1 ? 0 : i === 0 ? -2 : 2, scale: 1.03 }}
                  className="min-h-[280px] rounded-[2.5rem] border border-black/5 bg-[#fff8ea] p-7 shadow-[0_35px_100px_rgba(42,22,8,0.14)]"
                >
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b17422]">
                    Instagram
                  </p>

                  <h3 className="mt-20 text-3xl font-black text-[#241104]">
                    {item}
                  </h3>

                  <p className="mt-4 text-sm font-bold text-[#5c4634]">
                    Tap to follow Virsa
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b17422]">
              Customer Love
            </p>

            <h2 className="text-5xl font-black text-[#241104] md:text-6xl">
              Loved By Local Families
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Surrey Customer",
                text: "Rotis come out soft and fresh. You can actually taste the difference.",
              },
              {
                name: "Delta Family",
                text: "This feels like real home-style atta. Fresh, clean, and perfect for daily use.",
              },
              {
                name: "Abbotsford Customer",
                text: "Finally found atta that feels premium and authentic. Virsa is our regular now.",
              },
            ].map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateX: 4, scale: 1.02 }}
                className="rounded-[2rem] border border-black/5 bg-[#fff8ea] p-8 shadow-xl"
              >
                <div className="mb-6 text-2xl font-black tracking-[0.2em] text-[#c27c22]">
                  {"*****"}
                </div>

                <p className="text-lg leading-8 text-[#5c4634]">
                  "{review.text}"
                </p>

                <p className="mt-8 font-black text-[#241104]">
                  {review.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="relative overflow-hidden bg-[#130902] px-6 py-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,#d89b3840,transparent_30%),radial-gradient(circle_at_85%_80%,#ffffff18,transparent_25%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d89b38] to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-[#d89b38]">
              Contact Virsa
            </p>

            <h2 className="text-5xl font-black leading-tight md:text-7xl">
              Bring Premium Atta
              <span className="block text-[#d89b38]">
                To Your Store.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70">
              For wholesale supply, retail availability, store partnerships, and customer questions, contact Virsa Flour Mills directly.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            {[
              {
                label: "Phone / WhatsApp",
                value: "778-556-1998",
                href: "https://wa.me/17785561998",
              },

              {
                label: "Email",
                value: "virsaflourmills@gmail.com",
                href: "mailto:virsaflourmills@gmail.com",
              },
              {
                label: "Website",
                value: "virsaflourmills.com",
                href: "https://www.virsaflourmills.com",
              },
              {
                label: "Instagram",
                value: "@virsa_flour_mills",
                href: "https://www.instagram.com/virsa_flour_mills",
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateX: 6, scale: 1.03 }}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:border-[#d89b38]/60 hover:bg-white/[0.09]"
              >
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d89b38]">
                  {item.label}
                </p>

                <p className="mt-5 break-words text-2xl font-black text-white">
                  {item.value}
                </p>

                <p className="mt-6 text-sm font-bold text-white/45 transition group-hover:text-white/70">
                  Tap to connect
                </p>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.015 }}
            className="mt-14 overflow-hidden rounded-[3rem] border border-[#d89b38]/25 bg-gradient-to-br from-[#d89b38]/25 via-white/[0.08] to-transparent p-1 shadow-[0_55px_160px_rgba(216,155,56,0.18)]"
          >
            <div className="grid gap-10 rounded-[2.8rem] bg-[#1b0f05]/90 p-8 backdrop-blur-2xl lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d89b38]">
                  Wholesale & Retail Supply
                </p>

                <h3 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                  Grocery store owners, add Virsa to your shelves.
                </h3>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                  Premium cold-pressed atta with strong cultural positioning, clean packaging, and growing local demand across BC.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <a
                  href="https://wa.me/17785561998"
                  target="_blank"
                  className="rounded-full bg-green-500 px-8 py-5 text-center text-sm font-black text-white shadow-[0_25px_70px_rgba(34,197,94,0.35)] transition hover:scale-105"
                >
                  Message On WhatsApp
                </a>

                <a
                  href="mailto:virsaflourmills@gmail.com"
                  className="rounded-full border border-white/15 bg-white/10 px-8 py-5 text-center text-sm font-black text-white transition hover:scale-105 hover:bg-white/15"
                >
                  Email Virsa
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
<footer className="relative overflow-hidden bg-[#120801] px-6 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d89b3815,transparent_30%),radial-gradient(circle_at_80%_80%,#ffffff08,transparent_20%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.45em] text-[#d89b38]">
                VIRSA
              </p>

              <h3 className="mt-3 text-6xl font-black tracking-[-0.05em]">
                FLOUR MILLS
              </h3>

              <div className="mt-6 h-px w-36 bg-gradient-to-r from-[#d89b38] to-transparent" />

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65">
                Canada's 1st and Only Cold-Pressed Flour Mill bringing authentic taste, freshness, and premium atta to Punjabi homes across British Columbia.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/17785561998"
                  target="_blank"
                  className="rounded-full bg-green-500 px-7 py-4 text-sm font-black text-white shadow-[0_20px_70px_rgba(34,197,94,0.3)] transition hover:scale-105"
                >
                  WhatsApp
                </a>

                <a
                  href="https://www.instagram.com/virsa_flour_mills"
                  target="_blank"
                  className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-black text-white transition hover:scale-105 hover:bg-white/15"
                >
                  Instagram
                </a>

                <a
                  href="#contact"
                  className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-black text-white transition hover:scale-105 hover:bg-white/15"
                >
                  Contact Us
                </a>

                
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                "Freshly Milled",
                "Cold-Pressed",
                "Premium Wheat",
                "Soft Rotis",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl"
                >
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d89b38]">
                    Virsa Quality
                  </p>

                  <h4 className="mt-4 text-3xl font-black">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm font-medium text-white/45 md:flex-row md:items-center md:justify-between">
            <p>Copyright 2026 Virsa Flour Mills. All rights reserved.</p>

            <div className="flex flex-wrap gap-6">
              <a href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </a>

              <a href="/terms-of-use" className="transition hover:text-white">
                Terms of Use
              </a>

              <a href="/admin" className="text-white/20 transition hover:text-white/50">
                Admin
              </a>

              <p>
                Crafted for families across British Columbia.
              </p>
            </div>
          </div>
        </div>
      </footer>
    
      <a
        href="https://wa.me/17785561998"
        target="_blank"
        className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-[0_20px_60px_rgba(34,197,94,0.45)] transition hover:scale-110"
      >
        <FaWhatsapp size={24} />
        WhatsApp Us
      </a>
</main>
  );
}
















