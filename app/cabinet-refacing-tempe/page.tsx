import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CityAnchorLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Tempe AZ | Affordable Kitchen Updates | Free Quote",
  description: "Professional cabinet refacing in Tempe, AZ. Fast 2-5 day installation, custom doors, 40-60% savings. Serving ASU area, downtown Tempe, and all neighborhoods. Free quote!",
  keywords: "cabinet refacing tempe, tempe cabinet refacing, kitchen remodel tempe, cabinet doors tempe az",
};

export default function CabinetRefacingTempePage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Tempe AZ"
        description="Professional cabinet refacing services in Tempe, Arizona. Custom cabinet doors, fast installation, and expert craftsmanship."
        url="https://vulpinehomes.com/cabinet-refacing-tempe"
        areaServed="Tempe AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Slide_Kitchen.jpg"
              alt="Cabinet Refacing Tempe AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Tempe AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Affordable Kitchen Upgrades • Fast Tempe Service • Save 40-60%
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ Serving All Tempe Areas ✓ ASU Friendly Scheduling ✓ Fast 2-5 Day Completion</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Tempe Residents Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Best Value</h3>
                <p className="text-white/70">Premium quality at prices that work for Tempe budgets. Save thousands vs full replacement.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-white mb-3">Flexible Scheduling</h3>
                <p className="text-white/70">We work around your schedule—perfect for busy Tempe families and ASU community.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Team</h3>
                <p className="text-white/70">We live and work in the area. Fast response times and personal service.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Tempe Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Downtown Tempe", "ASU Campus Area", "South Tempe", "Warner Ranch",
                "Optimist Park", "Tempe Royal Palms", "College Park", "McClintock Manor",
                "Jen Tilly Terrace", "Cavalier Village", "Hudson Manor", "All Tempe Zip Codes"
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <CityAnchorLinking currentNodeId="tempe" />

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Tempe Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free in-home consultation with detailed pricing. Fast, affordable, professional.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
