import type { Metadata } from "next";
import { CTAButton } from "../components/CTAButton";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Phoenix Kitchen Remodeling Services | Cabinet Refacing & Design",
  description:
    "Full-service kitchen remodeling and cabinet refacing in Phoenix. ROC-licensed partners. Fast, clean execution. Get a quote in 24 hours.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero Section with Video */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-white">
            Kitchen Transformations,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Without the Chaos
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl mb-10 text-white/80 font-light px-4">
            Our services focus on planning, design, and project oversight — so your kitchen transformation is clear, efficient, and stress-free.
          </p>

          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-10">
            <p className="text-lg text-white/90 leading-relaxed">
              Vulpine Homes designs, manages, and guarantees the project.<br/>
              <span className="text-emerald-400">Installation is completed by the experienced team at Freedom Kitchen & Bath.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl px-4">
            <Link
              href="/get-quote"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white transition-all w-full sm:w-auto hover:-translate-y-1 bg-gradient-to-r from-[#9333ea] via-[#db2777] to-[#FF8A3D] shadow-lg shadow-purple-500/30"
            >
              Plan My Kitchen Upgrade
            </Link>
            <Link
              href="/visualizer"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white/90 border border-white/20 transition-all w-full sm:w-auto hover:bg-white/10 hover:-translate-y-1"
            >
              Try Visualizer ⚡️
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Service 1: Cabinet Refacing */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg,#0a0a0f,#0f0f18)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-4">
              <span className="w-8 h-[2px] bg-emerald-400"></span>
              Our Specialty
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cabinet Refacing</h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Cabinet refacing is Vulpine's core specialty. We transform existing cabinets by replacing doors, drawer fronts, and applying precision-matched veneer to exposed frames—delivering a completely new kitchen appearance without demolition, delays, or unnecessary disruption.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-4">Why Arizona Homeowners Choose Refacing</h3>
            <ul className="space-y-3 mb-8">
              {[
                "Completed in 3–5 days",
                "40–70% less than full replacement",
                "No demolition dust or weeks without a kitchen",
                "Soft‑close hinges and modern hardware standard",
                "Finishes selected for Arizona heat, sun, and daily use"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/85">
                  <span className="text-emerald-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/60 italic mb-4">This is what we do best — fast, precise, and built to last.</p>
            <p className="text-sm text-emerald-400/80 mb-8 flex items-center gap-2">
              <span>✓</span> Installation completed by the experienced team at Freedom Kitchen & Bath.
            </p>
            <Link href="/kitchen-cabinet-refacing" className="text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-2 group">
              Explore Cabinet Refacing <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-900/20">
            <Image src="/marketing/recab.png" alt="Cabinet Refacing" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Service 2: Kitchen & Bath Remodeling */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg,#0f0f18,#12121c)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] order-last lg:order-first rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/20">
            <Image src="/marketing/kitchens-baths.png" alt="Kitchen & Bath Remodeling" fill className="object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold mb-4">
              <span className="w-8 h-[2px] bg-violet-400"></span>
              Full-Service Remodeling
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Kitchen & Bath Remodeling</h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Full kitchen remodels managed end-to-end by Vulpine. Ideal for layout changes, plumbing or electrical upgrades, and complete design overhauls—executed with controlled timelines and accountable trades.
            </p>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Every project is executed by ROC-certified professionals working to Vulpine standards. You get expert execution, clear communication, and a remodel that actually finishes on schedule.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-4">Ideal For:</h3>
            <ul className="space-y-3 mb-8">
              {[
                "Full kitchen remodels",
                "Bathroom renovations",
                "Structural or layout changes",
                "Homeowners who want one coordinated experience"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/85">
                  <span className="text-violet-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-violet-400/80 mb-8 flex items-center gap-2">
              <span>✓</span> Installation completed by the experienced team at Freedom Kitchen & Bath.
            </p>
            <Link href="/get-quote" className="text-violet-400 font-semibold hover:text-violet-300 flex items-center gap-2 group">
              Discuss a Full Remodel <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Service 3: Architectural Wall Panels */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg,#12121c,#0a0a0f)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold mb-4">
              <span className="w-8 h-[2px] bg-amber-400"></span>
              Interior Accents
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Architectural Wall Panels & Interior Accents</h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              For homeowners who want more character, we offer architectural wall panels and interior accent upgrades. These are design‑driven enhancements — not trends — used to add warmth, depth, and visual structure to living spaces.
            </p>
            <p className="text-lg text-white/80 mb-4 leading-relaxed">
              From slat walls to full feature panels, installations are clean, precise, and finished quickly.
            </p>
            <p className="text-sm text-amber-400/80 mb-8 flex items-center gap-2">
              <span>✓</span> Installation completed by the experienced team at Freedom Kitchen & Bath.
            </p>
            <Link href="/get-quote" className="text-amber-400 font-semibold hover:text-amber-300 flex items-center gap-2 group">
              View Wall Panel Options <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-amber-900/20">
            <Image src="/marketing/montage.png" alt="Architectural Wall Panels" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #0f0f18 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Why Arizona Homeowners Choose Vulpine</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">A higher standard of execution, communication, and accountability</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💰", title: "Save Big Money", desc: "Get a brand new kitchen look for 50-70% less than full replacement." },
              { icon: "⚡", title: "Lightning Fast", desc: "Most projects completed in 3-5 days. No months of construction chaos." },
              { icon: "✨", title: "Premium Quality", desc: "High-end materials, expert craftsmanship, and attention to detail." },
              { icon: "😌", title: "Zero Stress", desc: "No demolition, no dust everywhere, no living in a construction zone." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all hover:bg-white/10 hover:border-[#FF8A3D]/30">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF8A3D]/20 to-[#FF6B35]/20 flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/GG.jpg" alt="Beautiful Kitchen" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/90" />
        </div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8A3D]/20 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready for Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Dream Kitchen?</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Get your free, no-obligation quote today. See exactly what your transformation will cost—no surprises, no pressure.
          </p>
          <CTAButton className="text-xl" />
          <p className="text-white/60 text-lg mt-6">⚡ Most quotes delivered within 24 hours</p>
        </div>
      </section>
    </main>
  );
}
