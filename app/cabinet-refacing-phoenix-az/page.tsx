import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";
import { CityAnchorLinking } from "../components/linking/InternalLinking";

export const metadata: Metadata = {
  title: "Cabinet Refacing Phoenix AZ | #1 Rated | Free Quote | Vulpine Homes",
  description: "Top-rated cabinet refacing in Phoenix, AZ. Custom doors, professional installation, 2-5 day turnaround. Save 40-60% vs replacement. 500+ happy customers. Free quote today!",
  keywords: "cabinet refacing phoenix az, kitchen cabinet refacing phoenix, cabinet refacing near me, phoenix cabinet refacing",
};

export default function CabinetRefacingPhoenixPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Phoenix AZ"
        description="Professional cabinet refacing services in Phoenix, Arizona. Transform your kitchen with custom cabinet doors, drawer fronts, and hardware installation."
        url="https://vulpinehomes.com/cabinet-refacing-phoenix-az"
        areaServed="Phoenix AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src="/marketing/Textvulpine.png"
              alt="Cabinet Refacing Phoenix AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Phoenix AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-md font-medium">
                  Transform Your Kitchen in Days, Not Weeks • Save 40-60% vs Full Replacement
                </p>
                <CTAButton className="text-lg shadow-xl" />
                <p className="text-white/90 mt-4 text-sm drop-shadow-md font-medium">✓ Free In-Home Consultation ✓ 2-5 Day Installation ✓ 500+ Happy Phoenix Homeowners</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Cabinet Refacing */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why Phoenix Homeowners Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Cabinet Refacing</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Save 40-60%</h3>
                <p className="text-white/70">Cabinet refacing costs significantly less than full replacement while delivering stunning results.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Fast Installation</h3>
                <p className="text-white/70">Most Phoenix cabinet refacing projects complete in 2-5 days vs weeks of full replacement disruption.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Eco-Friendly</h3>
                <p className="text-white/70">Keep your existing cabinet boxes out of Arizona landfills while getting a brand new kitchen look.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Our Phoenix Cabinet Refacing </span>
              <span className="text-white">Process</span>
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Free Consultation", desc: "We visit your Phoenix home to assess your cabinets and discuss your vision." },
                { step: "2", title: "Choose Your Style", desc: "Select from our premium door styles, colors, and hardware finishes." },
                { step: "3", title: "Professional Installation", desc: "Our expert team completes your cabinet refacing in just 2-5 days." },
                { step: "4", title: "Enjoy Your New Kitchen", desc: "Love your transformed kitchen at a fraction of replacement cost." }
              ].map((item) => (
                <div key={item.step} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <CityAnchorLinking currentNodeId="phoenix" />

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Phoenix Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free, no-obligation quote and see how we can help you save thousands on your kitchen remodel.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
