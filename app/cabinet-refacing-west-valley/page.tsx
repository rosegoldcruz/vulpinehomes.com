import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { ClusterLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing West Valley AZ | Free Quote",
  description: "Professional cabinet refacing serving West Valley ZIPs 85301-85310. Affordable solutions. Fast installation. Quality service for Avondale, Goodyear, Buckeye areas.",
  keywords: "cabinet refacing west valley, west valley cabinet refacing, kitchen remodel 85301, cabinet doors 85302, 85303, 85304, 85305, 85306, 85307, 85308, 85309, 85310",
};

export default function CabinetRefacingWestValleyPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing West Valley AZ"
        description="Professional cabinet refacing services in West Valley, Arizona. Serving ZIP codes 85301-85310 including Avondale, Goodyear, Buckeye with affordable solutions and fast installation."
        url="https://vulpinehomes.com/cabinet-refacing-west-valley"
        areaServed="West Valley AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing West Valley AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">West Valley AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Affordable Kitchen Solutions • Serving ZIPs 85301-85310
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ Complete West Valley Coverage ✓ Budget-Friendly ✓ 2-5 Day Installation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose West Valley */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why West Valley Homeowners Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Affordable Refacing</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Best Value Pricing</h3>
                <p className="text-white/70">West Valley's most competitive cabinet refacing prices without sacrificing quality in ZIPs 85301-85310.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Expertise</h3>
                <p className="text-white/70">We know West Valley neighborhoods from Avondale to Buckeye and understand local home styles.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Quick Turnaround</h3>
                <p className="text-white/70">Fast 2-5 day installation means your West Valley kitchen transformation happens quickly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* West Valley Service Areas */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Complete West Valley </span>
              <span className="text-white">ZIP Coverage</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85301-85303 - Central Avondale</h3>
                <p className="text-white/70">Full cabinet refacing service throughout central Avondale neighborhoods.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85304-85306 - Goodyear Areas</h3>
                <p className="text-white/70">Professional cabinet solutions for Goodyear and surrounding communities.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85307-85308 - Buckeye Region</h3>
                <p className="text-white/70">Expert cabinet refacing for Buckeye's growing residential areas.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">85309-85310 - Tolleson & Surrounding</h3>
                <p className="text-white/70">Complete service coverage for Tolleson and adjacent West Valley areas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* West Valley Communities */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Serving All </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">West Valley Cities</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Avondale", "Goodyear", "Buckeye", "Tolleson",
                "Litchfield Park", "Surprise", "El Mirage", "Youngtown"
              ].map((city) => (
                <div key={city} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Internal Linking */}
        <ClusterLinking currentNodeId="west-valley" />

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Affordable West Valley Kitchen Transformation
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get professional cabinet refacing across all West Valley ZIP codes with pricing that fits your budget.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
