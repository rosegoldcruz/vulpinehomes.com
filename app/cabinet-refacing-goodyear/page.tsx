import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CityAnchorLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Goodyear AZ | Trusted Local Service | Free Quote",
  description:
    "Professional cabinet refacing in Goodyear, AZ. Fast 2-5 day installs, custom doors, and big savings vs replacement. Serving Estrella Mountain Ranch, Palm Valley, PebbleCreek, Canyon Trails and more. Free quote!",
  keywords:
    "cabinet refacing goodyear, goodyear cabinet refacing, kitchen remodel goodyear, cabinet doors goodyear az",
};

export default function CabinetRefacingGoodyearPage() {
  return (
    <>
      <ServiceSchema
        serviceName="Cabinet Refacing Goodyear AZ"
        description="Professional cabinet refacing services in Goodyear, Arizona. Transform your kitchen with custom doors and expert installation."
        url="https://vulpinehomes.com/cabinet-refacing-goodyear"
        areaServed="Goodyear AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Goodyear AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Goodyear AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Transform Your Goodyear Kitchen • Save 40-60% vs Replacement
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Goodyear Areas ✓ 2-5 Day Install ✓ Licensed & Insured</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Goodyear Homeowners Trust </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏞️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Estrella & Palm Valley Expertise</h3>
                <p className="text-white/70">HOA-friendly finishes and door styles tailored for Goodyear’s master-planned communities.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold text-white mb-3">I‑10 Corridor Scheduling</h3>
                <p className="text-white/70">Efficient 2–5 day installs planned around Goodyear traffic patterns for minimal disruption.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">☀️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Built for West Valley Sun</h3>
                <p className="text-white/70">Durable, heat-resistant materials and finishes that perform in Goodyear’s climate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Goodyear Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Palm Valley",
                "PebbleCreek",
                "Estrella Mountain Ranch",
                "Canyon Trails",
                "Wildflower Ranch",
                "Cottonflower",
                "Centerra",
                "Las Brisas",
                "Villagio",
                "Sarival Village",
                "Goodyear Lakes",
                "All Goodyear Areas",
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
              Ready to Transform Your Goodyear Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and see how affordable a kitchen upgrade can be.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>

        <CityAnchorLinking currentNodeId="goodyear" />
      </main>
    </>
  );
}
