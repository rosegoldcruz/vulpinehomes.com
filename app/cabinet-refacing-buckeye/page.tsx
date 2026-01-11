import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { CityAnchorLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing Buckeye AZ | Local Experts | Free Quote | Vulpine Homes",
  description: "Professional cabinet refacing in Buckeye, AZ. Custom doors, 2-5 day installation, 40-60% savings. Serving all Buckeye neighborhoods. Free quote!",
  keywords: "cabinet refacing buckeye, buckeye cabinet refacing, kitchen remodel buckeye, cabinet doors buckeye az",
};

export default function CabinetRefacingBuckeyePage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Buckeye AZ"
        description="Professional cabinet refacing services in Buckeye, Arizona. Transform your kitchen with custom cabinet doors and expert installation."
        url="https://vulpinehomes.com/cabinet-refacing-buckeye"
        areaServed="Buckeye AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Buckeye AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Buckeye AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Transform Your Buckeye Kitchen • 40-60% Less Than Replacement
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Buckeye Zip Codes ✓ 2-5 Day Installation ✓ Licensed & Insured</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Buckeye Homeowners Trust </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Best Value</h3>
                <p className="text-white/70">Save thousands on your Buckeye kitchen remodel with professional cabinet refacing.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Fast Service</h3>
                <p className="text-white/70">Most Buckeye projects complete in 2-5 days. Minimal disruption to your routine.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Experts</h3>
                <p className="text-white/70">We know Buckeye homes and provide personalized service to your neighborhood.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Buckeye Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Verrado", "Sundance", "Tartesso", "Blue Horizons",
                "Festival Foothills", "Windmill Village", "Sun City Festival", "Parkside at Buckeye",
                "Westpark", "Riata West", "Buckeye Hills", "All Buckeye Zip Codes"
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <CityAnchorLinking currentNodeId="buckeye" />

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Buckeye Kitchen?
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
