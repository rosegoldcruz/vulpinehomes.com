import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { ClusterLinking } from "../components/linking/InternalLinking";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing North Scottsdale AZ | Premium Service | Free Quote",
  description: "Premium cabinet refacing for North Scottsdale luxury homes. High-end materials, expert installation, sophisticated designs. Free quote for discerning homeowners.",
  keywords: "cabinet refacing north scottsdale, north scottsdale cabinet refacing, luxury kitchen remodel, high-end cabinet doors scottsdale az",
};

export default function CabinetRefacingNorthScottsdalePage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing North Scottsdale AZ"
        description="Premium cabinet refacing services in North Scottsdale, Arizona. Luxury materials and expert installation for sophisticated North Scottsdale homes."
        url="https://vulpinehomes.com/cabinet-refacing-north-scottsdale"
        areaServed="North Scottsdale AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing North Scottsdale AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">North Scottsdale AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Premium Luxury Kitchen Transformations • Sophisticated Design
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ Luxury Materials ✓ Expert Craftsmanship ✓ White-Glove Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose North Scottsdale */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Why North Scottsdale Homeowners Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Luxury Refacing</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">Premium Materials</h3>
                <p className="text-white/70">High-end woods, custom finishes, and luxury hardware that match North Scottsdale's sophisticated aesthetic standards.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-3">Custom Design</h3>
                <p className="text-white/70">Bespoke cabinet solutions tailored to your North Scottsdale home's unique architectural style and luxury requirements.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Expert Craftsmanship</h3>
                <p className="text-white/70">Master craftsmen with experience in North Scottsdale's luxury homes and high-end kitchen renovations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* North Scottsdale Communities */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Serving North </span>
              <span className="text-white">Scottsdale's Finest</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">DC Ranch Area</h3>
                <p className="text-white/70">Luxury cabinet refacing for DC Ranch's prestigious custom homes and estate properties.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Silverleaf</h3>
                <p className="text-white/70">Premium cabinet solutions for Silverleaf's ultra-luxury residences and custom estates.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Desert Mountain</h3>
                <p className="text-white/70">Expert cabinet refacing for Desert Mountain's exclusive golf community homes.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Troon North</h3>
                <p className="text-white/70">High-end cabinet transformations for Troon North's luxury desert homes.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Pinnacle Peak</h3>
                <p className="text-white/70">Sophisticated cabinet solutions for Pinnacle Peak's upscale residential communities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Luxury Features */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">North Scottsdale </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Luxury Features</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Custom Wood Species", "High-End Hardware", "Soft-Close Systems", 
                "Custom Finishes", "Integrated Lighting", "Premium Countertops",
                "Smart Storage", "Designer Consultation"
              ].map((feature) => (
                <div key={feature} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Internal Linking */}
        <ClusterLinking currentNodeId="north-scottsdale" />

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Elevate Your North Scottsdale Kitchen
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Experience luxury cabinet refacing designed for North Scottsdale's most discerning homeowners.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
