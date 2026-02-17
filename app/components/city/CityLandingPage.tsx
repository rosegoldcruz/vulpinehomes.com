import Link from "next/link";
import Image from "next/image";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { CITY_LANDING_DATA, type CityKey } from "@/app/cabinet-refacing-city-data";

interface CityLandingPageProps {
  cityKey: CityKey;
}

const STYLE_TEASERS = [
  {
    name: "Shaker Classic",
    image: "/everything-visualized/shaker-door.png",
    detail: "Timeless profile for transitional kitchens",
  },
  {
    name: "Fusion Shaker",
    image: "/everything-visualized/shaker-fusion-door.png",
    detail: "Crisp lines with layered texture",
  },
  {
    name: "Slide",
    image: "/everything-visualized/slide-door.png",
    detail: "Modern frame for clean layouts",
  },
  {
    name: "Slab",
    image: "/everything-visualized/slab-door.png",
    detail: "Minimalist flat-front aesthetic",
  },
];

const PROCESS_STEPS = [
  "Measure",
  "Choose Door Style",
  "Professional Installation",
  "Finished Kitchen in Days",
];

export default function CityLandingPage({ cityKey }: CityLandingPageProps) {
  const city = CITY_LANDING_DATA[cityKey];

  return (
    <main className="min-h-screen bg-[#07080d] text-white pt-20">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,138,61,0.28),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.09),transparent_38%),linear-gradient(180deg,#0c1017_0%,#08090f_60%,#07080d_100%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
          <p className="text-[#FF8A3D] text-xs tracking-[0.24em] uppercase mb-4">{city.heroKicker}</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">{city.heroHeadline}</h1>
          <p className="text-lg md:text-2xl text-white/80 max-w-3xl mb-6">{city.heroSubheadline}</p>
          <p className="text-white/60 mb-10">Cabinet Refacing in {city.city}, AZ</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
            >
              Get Free Quote
            </Link>
            <Link
              href="/visualizer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-white/20 text-white/90 hover:text-white hover:border-white/40"
            >
              See It With Our Visualizer
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
            <span className="text-[#FF8A3D]">Primary Hook:</span>
            <span>{city.primaryHook}</span>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-5">
          <article className="rounded-2xl p-6 border border-white/10 bg-white/[0.03]">
            <h2 className="text-lg font-semibold mb-2">Save 40-60% vs Full Replacement</h2>
            <p className="text-white/70">Refresh the look of your kitchen without paying for full demolition and rebuild costs.</p>
          </article>
          <article className="rounded-2xl p-6 border border-white/10 bg-white/[0.03]">
            <h2 className="text-lg font-semibold mb-2">3-5 Day Installation</h2>
            <p className="text-white/70">Most projects move from install start to final walkthrough in less than a week.</p>
          </article>
          <article className="rounded-2xl p-6 border border-white/10 bg-white/[0.03]">
            <h2 className="text-lg font-semibold mb-2">Keep Existing Cabinet Boxes</h2>
            <p className="text-white/70">Retain your current layout and structure while upgrading visible surfaces end-to-end.</p>
          </article>
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Before &amp; After Cabinet Refacing in {city.city}</h2>
          <p className="text-white/70 mb-8">Three curated project selections tied to local-style homes and layouts.</p>
          <BeforeAfterSlider city={city.city} projects={city.projects} />
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Why Homeowners in {city.city} Choose Refacing</h2>
          <p className="text-white/75 leading-8">{city.uniqueStory}</p>
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step} className="rounded-2xl p-5 border border-white/10 bg-white/[0.03]">
                <p className="text-[#FF8A3D] text-sm font-semibold mb-2">Step {index + 1}</p>
                <h3 className="text-lg font-semibold">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Door Styles</h2>
              <p className="text-white/70 mt-2">Preview popular profiles before your in-home measurement.</p>
            </div>
            <Link href="/products" className="text-[#FF8A3D] font-semibold hover:underline">
              Browse all door styles
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STYLE_TEASERS.map((style) => (
              <Link
                key={style.name}
                href="/products"
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-[#FF8A3D]/60"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-black/40">
                  <Image
                    src={style.image}
                    alt={`${style.name} cabinet door style for ${city.city} cabinet refacing projects`}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-3"
                  />
                </div>
                <h3 className="font-semibold text-white mb-1">{style.name}</h3>
                <p className="text-white/65 text-sm">{style.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-start">
          <article>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Serving homeowners across {city.city}</h2>
            <p className="text-white/75 mb-6">
              Our teams regularly schedule cabinet refacing projects throughout {city.city}, with install plans tailored to neighborhood access and homeowner routines.
            </p>

            <div className="space-y-2 mb-6">
              {city.localProof.map((line) => (
                <p key={line} className="text-white/75">• {line}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {city.neighborhoods.map((neighborhood) => (
                <span key={neighborhood} className="px-3 py-1.5 rounded-full border border-white/15 text-white/80 text-sm">
                  {neighborhood}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/kitchen-cabinet-refacing" className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D]">
                Cabinet Refacing Overview
              </Link>
              <Link href="/visualizer" className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D]">
                Kitchen Visualizer
              </Link>
              <Link href="/products" className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D]">
                Door Style Catalog
              </Link>
              <Link href="/get-quote" className="rounded-xl border border-white/15 px-4 py-3 hover:border-[#FF8A3D]">
                Request a Quote
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

      <section className="py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{city.city} Cabinet Refacing FAQs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {city.faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-white/75">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-5">Ready to Upgrade Your Kitchen in {city.city}?</h2>
          <p className="text-white/75 mb-8">Get a clear quote, personalized style guidance, and a timeline built for a 3-5 day transformation.</p>
          <Link
            href="/get-quote"
            className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
          >
            Get Free Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
