import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Anthem AZ | Premium Service | Free Quote",
  description: "Professional cabinet refacing in Anthem, AZ. Custom doors, premium finishes, 2-5 day installation. Serving Anthem Country Club, Parkside, Meridian, Tramonto, Desert Hills and more. Free quote!",
  keywords: "cabinet refacing anthem, anthem cabinet refacing, kitchen remodel anthem, cabinet doors anthem az",
};

export default function CabinetRefacingAnthemPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Anthem AZ"
        description="Professional cabinet refacing services in Anthem, Arizona. Premium custom doors and expert installation for your kitchen."
        url="https://vulpinehomes.com/cabinet-refacing-anthem"
        areaServed="Anthem AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Anthem AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Anthem AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Premium Kitchen Transformations • Anthem Quality Service
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Anthem Communities ✓ Premium Finishes ✓ 2-5 Day Installation</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Premium Service for </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Anthem Homes</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Country Club & Parkside Ready</h3>
                <p className="text-white/70">HOA‑friendly, premium finishes and raised‑panel door styles ideal for Anthem Country Club and Parkside homes.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🛣️</div>
                <h3 className="text-2xl font-bold text-white mb-3">I‑17 Corridor Scheduling</h3>
                <p className="text-white/70">Optimized 2–5 day installs planned around Anthem/I‑17 traffic to minimize disruption.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⛰️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Daisy Mountain Durable</h3>
                <p className="text-white/70">UV‑resistant, high‑elevation friendly materials that stand up to North Valley sun and wind.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Anthem Communities
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Anthem Country Club", "Parkside", "Meridian", "Persimmon",
                "Tramonto", "Anthem Highlands", "Desert Hills", "Gavilan Peak",
                "All Anthem Areas"
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
              We Also Serve Nearby Cities
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { city: "Phoenix", link: "/cabinet-refacing-phoenix-az" },
                { city: "Scottsdale", link: "/cabinet-refacing-scottsdale" },
                { city: "Glendale", link: "/cabinet-refacing-glendale" },
                { city: "Surprise", link: "/cabinet-refacing-surprise" }
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
              Elevate Your Anthem Kitchen
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation with premium options tailored to your home.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
