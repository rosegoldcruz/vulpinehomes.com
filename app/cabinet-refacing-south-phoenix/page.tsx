import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { ClusterLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing South Phoenix AZ | Free Quote",
  description: "Professional cabinet refacing serving South Phoenix communities. Affordable solutions, fast installation, quality service for diverse neighborhoods. Free quote!",
  keywords: "cabinet refacing south phoenix, south phoenix cabinet refacing, kitchen remodel south phoenix, affordable cabinet doors phoenix az",
};

export default function CabinetRefacingSouthPhoenixPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing South Phoenix AZ"
        description="Professional cabinet refacing services in South Phoenix, Arizona. Serving diverse communities with affordable solutions and fast installation."
        url="https://vulpinehomes.com/cabinet-refacing-south-phoenix"
        areaServed="South Phoenix AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing South Phoenix AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">South Phoenix AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Affordable Kitchen Solutions • Serving All South Phoenix Communities
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All South Phoenix Areas ✓ Affordable Pricing ✓ 2-5 Day Installation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose South Phoenix */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why South Phoenix Residents Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Local Service</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Best Local Value</h3>
                <p className="text-white/70">Affordable cabinet refacing solutions designed for South Phoenix budgets without compromising on quality.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🌆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Community Focus</h3>
                <p className="text-white/70">We understand South Phoenix's diverse neighborhoods and serve every community with respect and quality.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quick Service</h3>
                <p className="text-white/70">Fast 2-5 day installation means your South Phoenix kitchen transformation happens with minimal disruption.</p>
              </div>
            </div>
          </div>
        </section>

        {/* South Phoenix Communities */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Serving All </span>
              <span className="text-white">South Phoenix Areas</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Central South Phoenix</h3>
                <p className="text-white/70">Complete cabinet refacing service for central South Phoenix neighborhoods and established communities.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Ahwatukee Area</h3>
                <p className="text-white/70">Professional cabinet solutions for Ahwatukee's family-oriented communities.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Laveen Communities</h3>
                <p className="text-white/70">Expert cabinet refacing for Laveen's growing residential areas and new developments.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">South Mountain Area</h3>
                <p className="text-white/70">Quality cabinet transformations for South Mountain neighborhood homes.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Estrella Village</h3>
                <p className="text-white/70">Fast, reliable cabinet refacing for Estrella Village and surrounding areas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* South Phoenix Features */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">South Phoenix </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Service Benefits</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Community-Focused Pricing", "Bilingual Service Available", "Flexible Scheduling",
                "Local Material Sourcing", "Neighborhood Expertise", "Quick Response Times",
                "Family-Friendly Solutions", "Complete Area Coverage"
              ].map((feature) => (
                <div key={feature} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Internal Linking */}
        <ClusterLinking currentNodeId="south-phoenix" />

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your South Phoenix Kitchen
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get affordable, professional cabinet refacing across all South Phoenix communities with service you can trust.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
