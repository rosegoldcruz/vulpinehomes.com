import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { LINKING_ARCHITECTURE, type LinkingNode } from "../config/internal-linking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Areas Served | Serving Greater Phoenix, Intentionally",
  description:
    "From historic Phoenix neighborhoods to luxury desert estates and fast‑growing master‑planned communities, Vulpine Homes tailors every project to the homes and lifestyles of the Valley.",
};

export default function AreasServedPage() {
  const nodes = Object.values(LINKING_ARCHITECTURE);
  
  const getUrlForCity = (cityName: string) => {
    const node = nodes.find(n => n.name.toLowerCase() === cityName.toLowerCase() && n.type === 'city');
    return node ? node.url : '#';
  };

  const regions = [
    {
      title: "Central & North Phoenix",
      description: "Urban, historic, and high‑end homes where thoughtful upgrades matter.",
      cities: ["Phoenix", "Scottsdale", "Tempe"]
    },
    {
      title: "East Valley",
      description: "Family‑focused communities with modern builds and long‑term homeowners.",
      cities: ["Mesa", "Chandler", "Gilbert"]
    },
    {
      title: "West Valley",
      description: "Expanding neighborhoods, new construction, and value‑driven upgrades.",
      cities: ["Glendale", "Peoria", "Buckeye", "Goodyear", "Surprise"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navigation />

      {/* Hero Section with Video */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/fox-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-white">
            Serving Greater Phoenix,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Intentionally
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl mb-6 text-white/80 font-light px-4">
            Vulpine Homes provides kitchen design and project coordination across the Phoenix metro area. Installations are completed by the team at Freedom Kitchen & Bath.
          </p>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 px-4">
            From historic Phoenix neighborhoods to luxury desert estates and fast‑growing master‑planned communities — we tailor every project to the homes and lifestyles of the Valley.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl px-4">
            <Link
              href="/get-quote"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white transition-all w-full sm:w-auto hover:-translate-y-1 bg-gradient-to-r from-[#9333ea] via-[#db2777] to-[#FF8A3D] shadow-lg shadow-purple-500/30"
            >
              Get Your Free Quote
            </Link>
            <Link
              href="/gallery"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white/90 border border-white/20 transition-all w-full sm:w-auto hover:bg-white/10 hover:-translate-y-1"
            >
              View Our Work
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

      {/* Trust Bar */}
      <section className="relative py-8 border-y border-white/10" style={{ background: 'linear-gradient(180deg, #0f0f18 0%, #12121c 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "Cities Served" },
              { value: "500+", label: "Kitchens Transformed" },
              { value: "3-5", label: "Days Average" },
              { value: "100%", label: "AZ Focused" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">{stat.value}</div>
                <div className="text-sm uppercase tracking-wider text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }} />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#FF8A3D] bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 mb-6">
              <span>📍</span> Service Areas
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Proudly serving Greater Phoenix—<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">quotes in 24 hours.</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto mb-12">
              Localized expertise across the Valley, with materials and scheduling optimized for Arizona living.
            </p>

            {/* Google Map Embed */}
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px] md:h-[500px] relative grayscale invert">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d425290.2373724777!2d-112.4052358046875!3d33.60509909999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b12ed50a179cb%3A0x8c69c7f8354a1bac!2sPhoenix%2C%20AZ!5e0!3m2!1sen!2sus!4v1709670000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 hover:opacity-100 transition-opacity duration-500"
              />
              {/* Overlay content if needed */}
              <div className="absolute bottom-6 left-6 bg-[#0a0a0f]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
                <div className="text-white font-bold">Greater Phoenix Metro</div>
                <div className="text-[#FF8A3D] text-sm">Covering 15+ Cities</div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {regions.map((region) => (
              <div key={region.title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-3">{region.title}</h3>
                  <p className="text-lg text-white/70 max-w-xl">{region.description}</p>
                </div>
                
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {region.cities.map((city) => (
                    <Link
                      key={city}
                      href={getUrlForCity(city)}
                      className="group flex items-center justify-between bg-[#0a0a0f] border border-white/10 rounded-xl p-4 hover:border-[#FF8A3D] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF8A3D]/20"
                    >
                      <span className="text-white font-semibold group-hover:text-[#FF8A3D] transition-colors">{city}</span>
                      <span className="text-white/20 group-hover:text-[#FF8A3D] transition-all group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
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
            Don't See Your City?<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">We Likely Serve You Too</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Reach out to confirm coverage and start your kitchen transformation today.
          </p>
          <CTAButton className="text-xl" />
          <p className="text-white/60 text-lg mt-6">⚡ Serving the entire Greater Phoenix metro</p>
        </div>
      </section>
    </main>
  );
}
