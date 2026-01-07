import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing Laveen AZ | South Phoenix Expert | Free Quote",
  description: "Professional cabinet refacing in Laveen, AZ. Custom doors, fast 2-5 day installation, 40-60% savings. Serving all Laveen neighborhoods. Free quote!",
  keywords: "cabinet refacing laveen, laveen cabinet refacing, kitchen remodel laveen, cabinet doors laveen az, south phoenix cabinet refacing",
};

export default function CabinetRefacingLaveenPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Cabinet Refacing Laveen AZ"
        description="Professional cabinet refacing services in Laveen, Arizona. Custom cabinet doors and expert installation for South Phoenix homes."
        url="https://vulpinehomes.com/cabinet-refacing-laveen"
        areaServed="Laveen AZ"
      />
      <main className="min-h-screen bg-[#0a0a0f]">
        <Navigation />

        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Cabinet Refacing Laveen AZ"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Cabinet Refacing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Laveen AZ</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  South Phoenix's Trusted Kitchen Transformation Experts
                </p>
                <CTAButton className="text-lg" />
                <p className="text-white/70 mt-4 text-sm">✓ All Laveen Areas ✓ South Phoenix Service ✓ 2-5 Day Install</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Serving Laveen with </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Excellence</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Local Experts</h3>
                <p className="text-white/70">We know Laveen homes and provide personalized local service.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Great Value</h3>
                <p className="text-white/70">Affordable cabinet refacing that saves thousands for Laveen families.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Fast Service</h3>
                <p className="text-white/70">Complete your Laveen kitchen makeover in just 2-5 days.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Serving All Laveen Neighborhoods
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "Laveen Village", "South Mountain Village", "Estrella", "Mountain Park Ranch",
                "Rogers Ranch", "Laveen Meadows", "Laveen Farms", "Southpark Village",
                "All Laveen Areas"
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
                { city: "Phoenix", link: "/cabinet-refacing-phoenix-az" },
                { city: "Tolleson", link: "/cabinet-refacing-tolleson" },
                { city: "Avondale", link: "/cabinet-refacing-avondale" },
                { city: "Goodyear", link: "/cabinet-refacing-goodyear" },
                { city: "Glendale", link: "/cabinet-refacing-glendale" }
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
              Ready to Transform Your Laveen Kitchen?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and see how much you can save with cabinet refacing.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
