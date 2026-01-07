import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { ClusterLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing East Valley AZ | Free Quote",
  description: "Professional cabinet refacing serving East Valley communities in Mesa, Chandler, Tempe. Comprehensive coverage. Fast installation. Quality service.",
  keywords: "cabinet refacing east valley, east valley cabinet refacing, mesa chandler tempe cabinet refacing, kitchen remodel east valley az",
};

export default function CabinetRefacingEastValleyPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing East Valley AZ"
        description="Professional cabinet refacing services in East Valley, Arizona. Serving Mesa, Chandler, Tempe and surrounding communities with comprehensive coverage and fast installation."
        url="https://vulpinehomes.com/cabinet-refacing-east-valley"
        areaServed="East Valley AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing East Valley AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">East Valley AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Complete East Valley Coverage • Mesa • Chandler • Tempe • Gilbert
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All East Valley Cities ✓ Comprehensive Service ✓ 2-5 Day Installation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose East Valley */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why East Valley Residents Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Regional Service</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Comprehensive Coverage</h3>
                <p className="text-white/70">One trusted partner serving all East Valley communities with consistent quality across Mesa, Chandler, Tempe, and beyond.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Knowledge</h3>
                <p className="text-white/70">We understand East Valley home styles from historic Mesa to modern Chandler developments and Tempe's diverse neighborhoods.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Regional Efficiency</h3>
                <p className="text-white/70">Our East Valley presence means faster service, better availability, and competitive pricing across the entire region.</p>
              </div>
            </div>
          </div>
        </section>

        {/* East Valley Service Areas */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Complete East Valley </span>
              <span className="text-white">Service Network</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Mesa Communities</h3>
                <p className="text-white/70">Full service across all Mesa neighborhoods from Red Mountain to Eastmark, with specialized expertise in diverse home styles.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Chandler Coverage</h3>
                <p className="text-white/70">Complete cabinet refacing service from Ocotillo to downtown Chandler, serving all residential and family communities.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Tempe Service</h3>
                <p className="text-white/70">Expert cabinet solutions for Tempe's diverse housing, from historic districts to modern developments near ASU.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Gilbert Areas</h3>
                <p className="text-white/70">Professional cabinet refacing for Gilbert's master-planned communities and growing residential areas.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Queen Creek</h3>
                <p className="text-white/70">Quality cabinet solutions for Queen Creek's expanding neighborhoods and family-oriented communities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* East Valley Features */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">East Valley </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Service Excellence</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Regional Pricing Advantage", "Multi-City Scheduling", "Consistent Quality Standards", 
                "Local Material Sourcing", "East Valley Warranty Service", "Community Reputation",
                "Flexible Appointment Times", "Complete Area Coverage"
              ].map((feature) => (
                <div key={feature} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Internal Linking */}
        <ClusterLinking currentNodeId="east-valley" />

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your East Valley Kitchen
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get comprehensive cabinet refacing service across all East Valley communities with one trusted regional partner.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
