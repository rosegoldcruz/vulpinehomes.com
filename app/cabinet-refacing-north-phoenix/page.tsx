import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { ClusterLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing North Phoenix AZ | Free Quote",
  description: "Professional cabinet refacing serving North Phoenix ZIPs 85051, 85053, 85083, 85085, 85086. Fast installation. Premium materials. Family neighborhoods.",
  keywords: "cabinet refacing north phoenix, north phoenix cabinet refacing, kitchen remodel 85051, cabinet doors 85053, 85083, 85085, 85086",
};

export default function CabinetRefacingNorthPhoenixPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing North Phoenix AZ"
        description="Professional cabinet refacing services in North Phoenix, Arizona. Serving ZIP codes 85051, 85053, 85083, 85085, 85086 with premium materials and fast installation."
        url="https://vulpinehomes.com/cabinet-refacing-north-phoenix"
        areaServed="North Phoenix AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing North Phoenix AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">North Phoenix AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Family-Friendly Kitchen Transformations • Serving 85051, 85053, 85083, 85085, 85086
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All North Phoenix ZIPs ✓ Family Community Focus ✓ 2-5 Day Installation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose North Phoenix */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why North Phoenix Families Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Cabinet Refacing</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🏘️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Family Community Focus</h3>
                <p className="text-white/70">We understand North Phoenix family neighborhoods and create kid-friendly, durable kitchen spaces.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Minimal Disruption</h3>
                <p className="text-white/70">2-5 day installation means your family routine gets back to normal quickly in ZIPs 85051-85086.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Budget-Friendly</h3>
                <p className="text-white/70">Save 40-60% vs full replacement while getting the premium kitchen your family deserves.</p>
              </div>
            </div>
          </div>
        </section>

        {/* North Phoenix Service Areas */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Complete Coverage </span>
              <span className="text-white">North Phoenix ZIPs</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85051 - Central North Phoenix</h3>
                <p className="text-white/70">Full service cabinet refacing for homes near North Mountain and surrounding areas.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85053 - North Phoenix Heights</h3>
                <p className="text-white/70">Professional cabinet transformations for hillside community homes.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85083 - Deer Valley Area</h3>
                <p className="text-white/70">Serving Deer Valley neighborhoods with fast, reliable cabinet refacing.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85085 - Norterra Region</h3>
                <p className="text-white/70">Modern cabinet solutions for Norterra and surrounding master-planned communities.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85086 - Tramonto Area</h3>
                <p className="text-white/70">Expert cabinet refacing for Tramonto and northern Phoenix neighborhoods.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Internal Linking */}
        <ClusterLinking currentNodeId="north-phoenix" />

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your North Phoenix Kitchen Today
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Serving all North Phoenix ZIP codes with professional cabinet refacing that fits your family's needs and budget.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
