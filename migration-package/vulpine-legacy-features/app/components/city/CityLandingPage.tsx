import Link from "next/link";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { CITY_LANDING_DATA, FINAL_CITY_KEYS, type CityKey } from "@/app/cabinet-refacing-city-data";

interface CityLandingPageProps {
  cityKey: CityKey;
}

export default function CityLandingPage({ cityKey }: CityLandingPageProps) {
  const city = CITY_LANDING_DATA[cityKey];
  const otherCities = FINAL_CITY_KEYS.filter((k) => k !== cityKey).map((k) => CITY_LANDING_DATA[k]);

  return (
    <main className="min-h-screen bg-[#07080d] text-white pt-20">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,138,61,0.28),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.09),transparent_38%),linear-gradient(180deg,#0c1017_0%,#08090f_60%,#07080d_100%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/45 mb-8">
            <Link href="/kitchen-cabinet-refacing" className="hover:text-[#FF8A3D] transition-colors">
              Cabinet Refacing
            </Link>
            <span>/</span>
            <span className="text-white/70">{city.city}</span>
          </nav>

          <p className="text-[#FF8A3D] text-xs tracking-[0.24em] uppercase mb-4">{city.heroKicker}</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">{city.heroHeadline}</h1>
          <p className="text-lg md:text-2xl text-white/80 max-w-3xl mb-6">{city.heroSubheadline}</p>
          <p className="text-white/50 mb-10 text-sm">Cabinet Refacing · {city.city}, AZ</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
            >
              Get Free Quote
            </Link>
            <Link
              href="/visualizer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-white/20 text-white/90 hover:text-white hover:border-white/40 transition-colors"
            >
              See It With Our Visualizer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Before & After ──────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Before &amp; After Cabinet Refacing in {city.city}
          </h2>
          <p className="text-white/60 mb-8 text-sm">
            Project examples from {city.city}-area homes.
          </p>
          <BeforeAfterSlider city={city.city} projects={city.projects} />
        </div>
      </section>

      {/* ── Why [City] ──────────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Why Homeowners in {city.city} Choose Refacing
          </h2>
          <p className="text-white/75 leading-8">{city.uniqueStory}</p>

          <div className="mt-8 p-5 rounded-xl border border-[#FF8A3D]/20 bg-[#FF8A3D]/5">
            <p className="text-white/60 text-sm mb-2">Want the full picture on how cabinet refacing works?</p>
            <Link href="/kitchen-cabinet-refacing" className="text-[#FF8A3D] font-semibold hover:underline text-sm">
              Read our complete Cabinet Refacing guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Serving [City] ──────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-start">
          <article>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Serving homeowners across {city.city}
            </h2>
            <p className="text-white/70 mb-6">
              Our teams regularly schedule cabinet refacing projects throughout {city.city}, with install plans tailored to neighborhood access and homeowner routines.
            </p>

            <div className="space-y-2 mb-6">
              {city.localProof.map((line) => (
                <p key={line} className="text-white/70">• {line}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {city.neighborhoods.map((neighborhood) => (
                <span
                  key={neighborhood}
                  className="px-3 py-1.5 rounded-full border border-white/15 text-white/75 text-sm"
                >
                  {neighborhood}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/kitchen-cabinet-refacing"
                className="rounded-xl border border-[#FF8A3D]/30 bg-[#FF8A3D]/5 px-4 py-3 hover:border-[#FF8A3D] transition-colors font-medium text-[#FF8A3D] text-sm"
              >
                ← Cabinet Refacing Overview
              </Link>
              <Link
                href="/get-quote"
                className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D] transition-colors text-sm"
              >
                Request a Quote
              </Link>
              <Link
                href="/visualizer"
                className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D] transition-colors text-sm"
              >
                Kitchen Visualizer
              </Link>
              <Link
                href="/products"
                className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D] transition-colors text-sm"
              >
                Door Style Catalog
              </Link>
            </div>
          </article>

          <div className="rounded-2xl overflow-hidden border border-white/10">
            <iframe
              title={`${city.city} AZ service area map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(city.city + ", AZ")}&output=embed`}
              className="w-full h-[360px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{city.city} Cabinet Refacing FAQs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {city.faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other cities we serve ───────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">Other Areas We Serve</h2>
          <p className="text-white/55 text-sm mb-6">
            Cabinet refacing across Greater Phoenix.{" "}
            <Link href="/areas-served" className="text-[#FF8A3D] hover:underline">
              View full service map →
            </Link>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherCities.map((c) => (
              <Link
                key={c.route}
                href={c.route}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 hover:border-[#FF8A3D] transition-colors group"
              >
                <p className="font-medium text-white/85 group-hover:text-white text-sm transition-colors">
                  {c.city}
                </p>
                <p className="text-white/40 text-xs mt-0.5">{c.heroKicker}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Ready to Upgrade Your Kitchen in {city.city}?
          </h2>
          <p className="text-white/70 mb-8">
            Get a clear quote, personalized style guidance, and a timeline built for a 3-5 day transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
            >
              Get Free Quote
            </Link>
            <Link
              href="/kitchen-cabinet-refacing"
              className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors text-sm"
            >
              Learn about cabinet refacing
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
