import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Avondale AZ | Affordable Kitchen Updates | Free Quote",
  description: "Professional cabinet refacing in Avondale, AZ. Custom doors, 2-5 day installation, 40-60% savings vs replacement. Serving all Avondale areas. Free quote!",
  keywords: "cabinet refacing avondale, avondale cabinet refacing, kitchen remodel avondale, cabinet doors avondale az",
};

export default function CabinetRefacingAvondalePage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Avondale AZ"
        description="Professional cabinet refacing services in Avondale, Arizona. Transform your kitchen with custom doors and expert installation."
        url="https://vulpinehomes.com/cabinet-refacing-avondale"
        areaServed="Avondale AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Slide_Kitchen.jpg"
              alt="Cabinet Refacing Avondale AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Avondale AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Affordable Kitchen Transformations • Fast Avondale Service
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Avondale Areas ✓ 2-5 Days ✓ Save 40-60%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Avondale Chooses </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Affordable Quality</h3>
                <p className="text-white/70">Premium refacing at prices that work for Avondale families.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Service</h3>
                <p className="text-white/70">Fast, friendly service throughout the Avondale community.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quick Results</h3>
                <p className="text-white/70">New kitchen look in 2-5 days. Minimal disruption.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Avondale Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Brookfield", "Palm Valley", "Corte Sierra", "Rio Crossing",
                "Coldwater Ranch", "Westpark", "Garden Lakes", "Rancho Santa Fe",
                "Waterstone", "Canterbury", "All Avondale Areas"
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
              We Also Serve Nearby Cities
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { city: "Glendale", link: "/cabinet-refacing-glendale" },
                { city: "Goodyear", link: "/cabinet-refacing-goodyear" },
                { city: "Verrado", link: "/cabinet-refacing-verrado" },
                { city: "Phoenix", link: "/cabinet-refacing-phoenix-az" },
                { city: "Surprise", link: "/cabinet-refacing-surprise" }
              ].map((area) => (
                <Link
                  key={area.city}
                  href={area.link}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 text-center hover:border-[#FF8A3D] transition-all"
                >
                  <p className="text-white font-semibold">{area.city}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your Avondale Kitchen Today
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free quote and discover how affordable a kitchen transformation can be.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
