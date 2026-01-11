import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Verrado AZ | Master Planned Community Service",
  description: "Professional cabinet refacing in Verrado, AZ. Custom doors, premium finishes, 2-5 day installation. Serving all Verrado neighborhoods. Free quote!",
  keywords: "cabinet refacing verrado, verrado cabinet refacing, kitchen remodel verrado, cabinet doors verrado az",
};

export default function CabinetRefacingVerradoPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Verrado AZ"
        description="Professional cabinet refacing services in Verrado, Arizona. Premium custom doors and expert installation for Verrado homes."
        url="https://vulpinehomes.com/cabinet-refacing-verrado"
        areaServed="Verrado AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Verrado AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Verrado AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Premium Kitchen Transformations for Verrado Homes
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ Master Planned Community Expert ✓ Premium Quality ✓ 2-5 Days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Trusted by </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Verrado Homeowners</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏘️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Community Focused</h3>
                <p className="text-white/70">We understand Verrado's unique community standards and aesthetics.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">Premium Service</h3>
                <p className="text-white/70">High-end materials that match Verrado's quality standards.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Fast Completion</h3>
                <p className="text-white/70">Quick 2-5 day installation with minimal disruption.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Verrado Villages
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Victory at Verrado", "Founders Village", "Highlands", "Canyon Trails",
                "The Vineyards", "Sycamore Farms", "Verrado Main Street", "All Verrado Areas"
              ].map((area) => (
                <div key={area} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/90 font-medium">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
              We Also Serve Nearby Areas
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { city: "Buckeye", link: "/cabinet-refacing-buckeye" },
                { city: "Avondale", link: "/cabinet-refacing-avondale" },
                { city: "Goodyear", link: "/cabinet-refacing-goodyear" },
                { city: "Surprise", link: "/cabinet-refacing-surprise" },
                { city: "Phoenix", link: "/cabinet-refacing-phoenix-az" }
              ].map((area) => (
                <Link
                  key={area.city}
                  href={area.link}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 text-center hover:border-[#FF8A3D] transition-all"
                >
                  <p className="text-white font-semibold">{area.city}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
          <div className="absolute inset-0 bg-[#0a0a0f]/90" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Elevate Your Verrado Kitchen
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation with options designed for Verrado homes.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
