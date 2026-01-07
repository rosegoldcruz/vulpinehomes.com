import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { CityAnchorLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing Chandler AZ | Top Rated Service | Free Quote",
  description: "Professional cabinet refacing in Chandler, AZ. Custom doors, fast installation, 40-60% savings vs replacement. Serving all Chandler neighborhoods. Free quote!",
  keywords: "cabinet refacing chandler, chandler cabinet refacing, kitchen remodel chandler, cabinet doors chandler az",
};

export default function CabinetRefacingChandlerPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Chandler AZ"
        description="Professional cabinet refacing services in Chandler, Arizona. Transform your kitchen with custom cabinet doors and expert installation."
        url="https://vulpinehomes.com/cabinet-refacing-chandler"
        areaServed="Chandler AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Chandler AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Chandler AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Transform Your Chandler Kitchen • Save 40-60% vs Replacement
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Chandler Areas ✓ 2-5 Day Install ✓ Top Rated Service</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Chandler Residents Trust </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Top Rated</h3>
                <p className="text-white/70">Trusted by hundreds of Chandler homeowners for quality work.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Fast Installation</h3>
                <p className="text-white/70">Complete your Chandler kitchen makeover in just 2-5 days.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Great Savings</h3>
                <p className="text-white/70">Save thousands compared to full cabinet replacement.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Chandler Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Ocotillo", "Fulton Ranch", "Sun Groves", "Sun Lakes",
                "Pecos Ranch", "Carino Estates", "Markwood", "Clemente Ranch",
                "Cooper Commons", "Riggs Ranch", "Layton Lakes", "All Chandler Areas"
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Chandler Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and see how affordable a kitchen upgrade can be.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
