export default function VisionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f1e4] text-[#3b2416]">

      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#d4a95f]/20 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#c58b45]/20 blur-3xl" />

      <section className="relative mx-auto max-w-5xl px-6 py-24">

        <p className="mb-5 text-sm font-bold uppercase tracking-[0.45em] text-[#9a6a2f]">
          Our Vision
        </p>

        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Heritage Should Never Be Compromised.
        </h1>

        <div className="mt-16 rounded-[40px] border border-[#d4a95f]/20 bg-white/55 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:p-14">

          <div className="space-y-8 text-lg leading-9 text-[#5b4636]">

            <p>
              At Virsa Flour Mills, our vision is to bring the authentic taste of traditional Desi Ghraat Style Atta to every home while preserving the rich heritage of our culture.
            </p>

            <p>
              We believe flour is more than just an ingredient - it is the foundation of family meals, traditions, and memories passed from one generation to the next.
            </p>

            <p>
              Our goal is to produce high-quality stone-ground atta made from carefully selected Canadian wheat, delivering the natural taste, nutrition, and softness that families expect in every roti, paratha, and naan.
            </p>

            <p>
              By combining traditional milling values with modern quality standards, we aim to become a trusted household name across Canada and beyond.
            </p>

            <div className="rounded-3xl border border-[#d4a95f]/20 bg-[#fffaf3] p-8 shadow-inner">
              <p className="mb-5 text-xl font-black text-[#3b2416]">
                Our Commitments
              </p>

              <ul className="space-y-4 font-semibold text-[#5b4636]">
                <li>• Preserving the authentic Desi Ghraat milling tradition</li>
                <li>• Delivering pure, nutritious, and high-quality atta</li>
                <li>• Supporting our community with products they can trust</li>
                <li>• Bringing the taste of home to every kitchen</li>
              </ul>
            </div>

            <p>
              Because for us, Virsa means heritage - and heritage should never be compromised.
            </p>

            <div className="rounded-3xl bg-[#3b2416] px-8 py-7 text-center shadow-2xl">
              <p className="text-2xl font-black tracking-wide text-[#f5e6c8]">
                Honoring Tradition. Milling Purity. Serving Families.
              </p>
            </div>

          </div>

          <a
            href="/"
            className="mt-12 inline-flex items-center rounded-full bg-[#3b2416] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:scale-[1.03] hover:bg-[#5b351f]"
          >
            Back to Home
          </a>

        </div>
      </section>
    </main>
  );
}
