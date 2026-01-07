import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { CityAnchorLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing Gilbert AZ | Expert Service | Free Quote",
  description: "Professional cabinet refacing in Gilbert, AZ. Custom doors, fast 2-5 day installation, 40-60% savings. Serving all Gilbert neighborhoods. Free quote!",
  keywords: "cabinet refacing gilbert, gilbert cabinet refacing, kitchen remodel gilbert, cabinet doors gilbert az",
};

export default function CabinetRefacingGilbertPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Gilbert AZ"
        description="Professional cabinet refacing services in Gilbert, Arizona. Custom cabinet doors and expert installation for your kitchen transformation."
        url="https://vulpinehomes.com/cabinet-refacing-gilbert"
        areaServed="Gilbert AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src="/marketing/Textvulpine.png"
              alt="Cabinet Refacing Gilbert AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Gilbert AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-md font-medium">
                  Gilbert's Trusted Kitchen Transformation Experts
                </p>
                <CTAButton className="text-lg shadow-xl" />
                <p className="text-white/90 mt-4 text-sm drop-shadow-md font-medium">✓ All Gilbert Areas ✓ Family-Friendly Service ✓ Save 40-60%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Gilbert Families Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-white mb-3">Family Focused</h3>
                <p className="text-white/70">We understand Gilbert families and work around your busy schedule.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quality Work</h3>
                <p className="text-white/70">Premium materials and craftsmanship for Gilbert's growing community.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quick Completion</h3>
                <p className="text-white/70">2-5 day installation keeps disruption to a minimum.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Gilbert Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Val Vista Lakes", "Agritopia", "Adora Trails", "Morrison Ranch",
                "The Islands", "Power Ranch", "Seville", "Cooley Station",
                "Coronado", "Finley Farms", "Higley Groves", "All Gilbert Areas"
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
              Transform Your Gilbert Kitchen Today
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and discover the best options for your home.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
