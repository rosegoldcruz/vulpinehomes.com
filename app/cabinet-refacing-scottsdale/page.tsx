import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { CityAnchorLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing Scottsdale AZ | Local Experts | Free Quote",
  description: "Professional cabinet refacing in Scottsdale, AZ. Custom doors, fast 2-5 day installation, 40-60% savings vs replacement. Serving all Scottsdale zip codes. Free quote!",
  keywords: "cabinet refacing scottsdale, scottsdale cabinet refacing, kitchen remodel scottsdale, cabinet doors scottsdale az",
};

export default function CabinetRefacingScottsdalePage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Scottsdale AZ"
        description="Professional cabinet refacing services in Scottsdale, Arizona. Transform your kitchen with custom cabinet doors and expert installation."
        url="https://vulpinehomes.com/cabinet-refacing-scottsdale"
        areaServed="Scottsdale AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Scottsdale AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Scottsdale AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Transform Your Scottsdale Kitchen • 40-60% Less Than Replacement
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ Serving All Scottsdale Zip Codes ✓ 2-5 Day Installation ✓ Licensed & Insured</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Scottsdale Trusts Us */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Scottsdale Homeowners Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Experts</h3>
                <p className="text-white/70">We understand Scottsdale homes and styles. Fast, reliable service throughout the entire area.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">Premium Quality</h3>
                <p className="text-white/70">High-end materials and finishes that match Scottsdale's luxury standards.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quick Turnaround</h3>
                <p className="text-white/70">Most Scottsdale projects complete in 2-5 days. Minimal disruption to your lifestyle.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Scottsdale Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Old Town Scottsdale", "North Scottsdale", "South Scottsdale", "DC Ranch",
                "Gainey Ranch", "McDowell Mountain Ranch", "Grayhawk", "Troon",
                "Desert Ridge", "Kierland", "Silverleaf", "Paradise Valley Adjacent"
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-white/70 mt-8">
              Don't see your area? We serve all Scottsdale zip codes. <Link href="/get-quote" className="text-[#FF8A3D] hover:underline">Contact us</Link> to confirm.
            </p>
          </div>
        </section>

        <CityAnchorLinking currentNodeId="scottsdale" />

        {/* Other Cities */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
              We Also Serve Nearby Cities
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { city: "Phoenix", link: "/cabinet-refacing-phoenix-az" },
                { city: "Tempe", link: "/cabinet-refacing-tempe" },
                { city: "Mesa", link: "/cabinet-refacing-mesa" },
                { city: "Glendale", link: "/cabinet-refacing-glendale" },
                { city: "Chandler", link: "/cabinet-refacing-chandler" }
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

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Scottsdale Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free in-home consultation and detailed quote. No pressure, just expert advice.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
