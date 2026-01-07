import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CityAnchorLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Glendale AZ | Trusted Local Service | Free Quote",
  description: "Professional cabinet refacing in Glendale, AZ. Custom doors, fast 2-5 day installation, 40-60% savings. Serving all Glendale neighborhoods. Free quote!",
  keywords: "cabinet refacing glendale, glendale cabinet refacing, kitchen remodel glendale, cabinet doors glendale az",
};

export default function CabinetRefacingGlendalePage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Glendale AZ"
        description="Professional cabinet refacing services in Glendale, Arizona. Custom cabinet doors and expert installation for your kitchen transformation."
        url="https://vulpinehomes.com/cabinet-refacing-glendale"
        areaServed="Glendale AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Glendale AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Glendale AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Transform Your Glendale Kitchen • Save 40-60% vs Replacement
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Glendale Zip Codes ✓ 2-5 Day Install ✓ Licensed & Insured</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Serving Glendale with </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Excellence</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quality Work</h3>
                <p className="text-white/70">Premium materials and expert craftsmanship for every Glendale home.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quick Installation</h3>
                <p className="text-white/70">Complete your Glendale kitchen transformation in just 2-5 days.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Great Value</h3>
                <p className="text-white/70">Save thousands compared to full cabinet replacement.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Glendale Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Arrowhead Ranch", "Deer Valley", "Westgate", "Happy Valley",
                "North Glendale", "South Glendale", "Thunderbird Estates", "Glendale Gardens",
                "Sahuaro Ranch", "Manistee Ranch", "Paradise Valley Estates", "All Glendale Areas"
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
                { city: "Phoenix", link: "/cabinet-refacing-phoenix-az" },
                { city: "Peoria", link: "/cabinet-refacing-peoria" },
                { city: "Avondale", link: "/cabinet-refacing-avondale" },
                { city: "Anthem", link: "/cabinet-refacing-anthem" },
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

        <CityAnchorLinking currentNodeId="glendale" />

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Glendale Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and see how much you can save with cabinet refacing.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
