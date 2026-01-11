import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CityAnchorLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Surprise AZ | Trusted Local Service | Free Quote",
  description:
    "Professional cabinet refacing in Surprise, AZ. Fast 2-5 day installs, custom doors, and big savings vs replacement. Serving Sun City Grand, Marley Park, Asante, Rancho Gabriela, Sierra Montana and more. Free quote!",
  keywords:
    "cabinet refacing surprise, surprise cabinet refacing, kitchen remodel surprise, cabinet doors surprise az",
};

export default function CabinetRefacingSurprisePage() {
  return (
    <>
      <ServiceSchema
        serviceName="Cabinet Refacing Surprise AZ"
        description="Professional cabinet refacing services in Surprise, Arizona. Transform your kitchen with custom doors and expert installation."
        url="https://vulpinehomes.com/cabinet-refacing-surprise"
        areaServed="Surprise AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Surprise AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Surprise AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Transform Your Surprise Kitchen • Save 40-60% vs Replacement
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Surprise Areas ✓ 2-5 Day Install ✓ Licensed & Insured</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Surprise Homeowners Trust </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Sun City Grand & Marley Park Ready</h3>
                <p className="text-white/70">HOA‑friendly styles and soft‑close upgrades tailored for Surprise’s active adult and family communities.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🛣️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Loop 303 & Bell Rd Timing</h3>
                <p className="text-white/70">2–5 day installs planned around 303/Bell traffic and spring‑training season for minimal disruption.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">☀️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Built for Surprise Sun</h3>
                <p className="text-white/70">UV‑resistant, heat‑tolerant materials that perform in West Valley summers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Surprise Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Sun City Grand",
                "Asante",
                "Marley Park",
                "Rancho Gabriela",
                "Copper Canyon Ranch",
                "Greer Ranch",
                "Royal Ranch",
                "Sun Village",
                "Mountain Vista Ranch",
                "Sierra Montana",
                "Surprise Farms",
                "All Surprise Areas",
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
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
              Ready to Transform Your Surprise Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and see how affordable a kitchen upgrade can be.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>

        <CityAnchorLinking currentNodeId="surprise" />
      </main>
    </>
  );
}
