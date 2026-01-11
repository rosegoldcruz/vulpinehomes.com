import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import Image from "next/image";
import ServiceSchema from "../components/schemas/ServiceSchema";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Kitchen Cabinet Refacing | Custom Doors & Drawers | Vulpine Homes",
  description: "Transform your kitchen with professional cabinet refacing. Custom doors, drawer fronts, and hardware. Fast 2-5 day installation. Save thousands vs replacement. Free quote!",
  keywords: "kitchen cabinet refacing, cabinet refacing, refacing kitchen cabinets, cabinet door replacement, kitchen remodel",
};

export default function KitchenCabinetRefacingPage() {
  return (
    <>
      <ServiceSchema 
        serviceName="Kitchen Cabinet Refacing"
        description="Complete kitchen cabinet refacing services including custom doors, drawer fronts, veneer, and hardware installation."
        url="https://vulpinehomes.com/kitchen-cabinet-refacing"
      />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/marketing/Storm-Fusion-Shaker_Kitchen.jpg"
              alt="Kitchen Cabinet Refacing"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-black/60 to-[#0a0a0f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Kitchen Cabinet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Refacing</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  New Kitchen Look • Half the Cost • One Week or Less
                </p>
                <CTAButton className="text-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* What Is Cabinet Refacing */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                <span className="text-white">What Is </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Kitchen Cabinet Refacing?</span>
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Kitchen cabinet refacing is a cost-effective alternative to full cabinet replacement. Instead of tearing out your entire kitchen, we replace only the visible parts—doors, drawer fronts, and hardware—while keeping your existing cabinet boxes.
              </p>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                We also apply matching veneer to the cabinet frames, giving you a completely refreshed kitchen at 40-60% less than the cost of new cabinets.
              </p>
              <div className="bg-gradient-to-r from-[#FF8A3D]/10 to-[#FF6B35]/10 border border-[#FF8A3D]/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Perfect For Kitchens Where:</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8A3D] text-xl">✓</span>
                    <span>Cabinet boxes are structurally sound</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8A3D] text-xl">✓</span>
                    <span>Current layout works well</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8A3D] text-xl">✓</span>
                    <span>You want to update the style and finish</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF8A3D] text-xl">✓</span>
                    <span>Budget is important but quality matters</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Benefits of </span>
              <span className="text-white">Kitchen Cabinet Refacing</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "💰", title: "Cost-Effective", desc: "Save 40-60% compared to full cabinet replacement while getting a like-new kitchen." },
                { icon: "⚡", title: "Fast Installation", desc: "Most refacing projects complete in 2-5 days with minimal disruption to your daily life." },
                { icon: "🎨", title: "Unlimited Styles", desc: "Choose from modern slab, classic shaker, or unique fusion styles in 13+ colors." },
                { icon: "🌱", title: "Eco-Friendly", desc: "Reuse existing cabinet boxes and keep construction waste out of landfills." },
                { icon: "🏡", title: "Stay Home", desc: "No need to move out or set up a temporary kitchen during the project." },
                { icon: "✨", title: "Like-New Results", desc: "Professional finish that looks and feels like brand new custom cabinets." }
              ].map((benefit, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Gallery Teaser */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Real Kitchen </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Transformations</span>
            </h2>

            <div className="text-center mb-8">
              <p className="text-xl text-white/80 mb-6">
                See how we've transformed kitchens across Phoenix with professional cabinet refacing
              </p>
              <Link
                href="/gallery"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#FF8A3D]/30 transition-all"
              >
                View Before & After Gallery
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
              Learn More About Cabinet Refacing
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Cabinet Refacing Phoenix AZ", link: "/cabinet-refacing-phoenix-az" },
                { title: "Cabinet Refacing vs Replacement", link: "/cabinet-refacing-vs-replacement" },
                { title: "Replace Cabinet Doors", link: "/replace-cabinet-doors" },
                { title: "Custom Cabinet Doors", link: "/custom-cabinet-doors" }
              ].map((page) => (
                <Link
                  key={page.link}
                  href={page.link}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FF8A3D] transition-all group"
                >
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A3D] transition-colors">
                    {page.title} →
                  </h3>
                </Link>
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
              Ready for Your Kitchen Transformation?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get a free consultation and see exactly how much you can save with cabinet refacing.
            </p>
            <CTAButton className="text-lg" />
          </div>
        </section>
      </main>
    </>
  );
}
