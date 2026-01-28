"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FadeIn, SlideUp, StaggerContainer, ScaleOnHover } from "@/app/components/ui/Motion";
import { HomepageLinking } from "./components/linking/InternalLinking";
import Footer from "./components/Footer";

function SuccessToast() {
  const searchParams = useSearchParams();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (searchParams.get("quote") === "success") {
      setShowSuccessToast(true);
      window.history.replaceState({}, "", "/");
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  }, [searchParams]);

  if (!showSuccessToast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md backdrop-blur-sm border border-white/20">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Quote Submitted! 🎉</p>
          <p className="text-sm text-white/90">We'll text you with your free quote soon!</p>
        </div>
        <button onClick={() => setShowSuccessToast(false)} className="ml-auto text-white/80 hover:text-white p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>

      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/ascend.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <FadeIn className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <div className="text-sm uppercase tracking-[0.3em] text-[#FF8A3D] font-semibold mb-6">
            Expert Cabinet Door Installation
          </div>
          <SlideUp className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 text-white leading-tight">
            Modern Luxury.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Smartly Renovated.
            </span>
          </SlideUp>

          <FadeIn delay={0.2} className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl mb-10 text-white/70 font-light px-4 leading-relaxed">
            The fast, affordable, high-ROI way to transform your kitchen and bath — without full cabinet replacement.
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] shadow-lg shadow-orange-500/30"
            >
              Get Installation Quote
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1 bg-white/10 border border-white/20 hover:bg-white/20"
            >
              Explore Door Styles
            </Link>
          </FadeIn>
        </FadeIn>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* DEFINE YOUR AESTHETIC */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Define Your Aesthetic
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-4">
              From timeless warmth to sleek modernism, choose the palette that fits your life.
            </p>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Shaker or Slab. Woodgrain or Matte. Light or Dark.<br />
              We help you build a look that feels intentional — not builder-grade.
            </p>
          </FadeIn>
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] shadow-lg shadow-orange-500/30"
            >
              View Door Styles
            </Link>
          </div>
        </div>
      </section>

      {/* THE SHAKER COLLECTION */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Text Column - 40% width on desktop */}
            <div className="lg:col-span-2 space-y-6">
              <SlideUp>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                  THE SHAKER COLLECTION
                </h2>
                
                <p className="text-2xl sm:text-3xl font-light text-white/90">
                  Timeless. Elegant. Built to Last Generations.
                </p>
                
                <p className="text-xl text-white/80">
                  Clean lines. Understated beauty. The kind of design that never goes out of style.
                </p>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  Our Shaker doors bring that perfect balance of simplicity and sophistication to your kitchen, beautifully adapting to your vision.
                </p>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-8 mb-4">
                  Engineered for Life, Not Just Years
                </h3>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  This isn't the cheap stuff that peels, fades, or warps after a few seasons. Our doors are built with premium European-engineered materials that laugh at heat, moisture, scratches, and time itself.
                </p>
                
                <div className="space-y-3">
                  <p className="text-base text-white/70">
                    <strong className="text-white">The surface:</strong> Scratch-resistant. Heat-proof to 212°F. UV-stable so it never fades or yellows. Water beads right off. Chemical-resistant so your everyday cleaners won't destroy what we've built together.
                  </p>
                  <p className="text-base text-white/70">
                    <strong className="text-white">The core:</strong> Solid. Substantial. You'll feel the quality the moment you touch them. High-grade particleboard and fiberboard crafted from sustainably sourced, 100% recycled fibers. CARB Phase II compliant. Eco-certified. Built to contribute to LEED and Green Building standards.
                  </p>
                </div>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed mt-4">
                  This is craftsmanship you can see, feel, and trust.
                </p>
                
                <p className="text-lg sm:text-xl font-semibold text-[#FF8A3D] mt-8">
                  Available in Multiple Finishes + Primed-for-Paint
                </p>
                
                <p className="text-xl font-light text-white/90">
                  Your kitchen. Your style. Your legacy.
                </p>
                
                <p className="text-xl font-light text-white/90">
                  Let's build something beautiful.
                </p>
              </SlideUp>
            </div>
            
            {/* Image Column - 60% width on desktop */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.2}>
                <div className="relative w-full">
                  <Image
                    src="/everything-visualized/The%20Shaker%20Collection.png"
                    alt="The Shaker Collection - Full Kitchen Display with Door Samples"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-2xl"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* THE SLAB COLLECTION */}
      <section className="py-24 bg-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Image Column - 60% width on desktop */}
            <div className="lg:col-span-3 order-1 lg:order-1">
              <FadeIn delay={0.2}>
                <div className="relative w-full">
                  <Image
                    src="/everything-visualized/The%20Slab%20Edition.png"
                    alt="The Slab Collection - Full Kitchen Display"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-2xl"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </FadeIn>
            </div>
            
            {/* Text Column - 40% width on desktop */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-2">
              <SlideUp>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                  THE SLAB COLLECTION
                </h2>
                
                <p className="text-2xl sm:text-3xl font-light text-white/90">
                  Modern. Sleek. Effortlessly Sophisticated.
                </p>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  The Slab Collection is pure minimalism—no molding, no details, just clean, uninterrupted surfaces that let your space breathe. This is the choice for kitchens that embrace contemporary design without compromise.
                </p>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-8 mb-4">
                  Engineered to Endure
                </h3>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  Beneath the sleek surface lies the same premium European-engineered materials we use across every collection. Built to resist scratches, heat, moisture, and time.
                </p>
                
                <div className="space-y-3">
                  <p className="text-base text-white/70">
                    <strong className="text-white">The surface:</strong> Scratch-resistant. Heat-proof to 212°F. UV-stable so it never fades or yellows. Water beads right off. Chemical-resistant so your everyday cleaners won't destroy what we've built together.
                  </p>
                  <p className="text-base text-white/70">
                    <strong className="text-white">The core:</strong> Solid. Substantial. You'll feel the quality the moment you touch them. High-grade particleboard and fiberboard crafted from sustainably sourced, 100% recycled fibers. CARB Phase II compliant. Eco-certified.
                  </p>
                </div>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed mt-4">
                  Built for beauty. Engineered for life.
                </p>
                
                <p className="text-lg sm:text-xl font-semibold text-[#FF8A3D] mt-8">
                  Available in 11 Colors + Primed-for-Paint
                </p>
                
                <p className="text-xl font-light text-white/90">
                  From high-gloss whites to rich wood grains—find the finish that defines your style.
                </p>
                
                <p className="text-xl font-light text-white/90">
                  Let's build something extraordinary.
                </p>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* THE FUSION SERIES */}
      <section className="py-24 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Text Column - 40% width on desktop */}
            <div className="lg:col-span-2 space-y-6">
              <SlideUp>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                  THE FUSION SERIES
                </h2>
                
                <p className="text-2xl sm:text-3xl font-light text-white/90">
                  Dynamic Depth. Deliberate Design.
                </p>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  The Fusion Series brings dimension and texture to your kitchen with a bold, modern edge. Clean lines meet visual interest—this is the collection for spaces that demand attention.
                </p>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-8 mb-4">
                  Engineered to Perform, Designed to Impress
                </h3>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  Like every door we build, the Fusion Series uses premium European-engineered surfaces that resist scratches, heat, moisture, and fading. The cores are solid, sustainable, and CARB Phase II compliant.
                </p>
                
                <div className="space-y-3">
                  <p className="text-base text-white/70">
                    <strong className="text-white">The surface:</strong> Scratch-resistant. Heat-proof to 212°F. UV-stable so it never fades or yellows. Water beads right off. Chemical-resistant so your everyday cleaners won't destroy what we've built together.
                  </p>
                  <p className="text-base text-white/70">
                    <strong className="text-white">The core:</strong> Solid. Substantial. You'll feel the quality the moment you touch them. High-grade particleboard and fiberboard crafted from sustainably sourced, 100% recycled fibers. CARB Phase II compliant. Eco-certified.
                  </p>
                </div>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed mt-4">
                  This isn't just about looking good. It's about staying that way.
                </p>
                
                <p className="text-lg sm:text-xl font-semibold text-[#FF8A3D] mt-8">
                  Available in Multiple Finish Combinations
                </p>
                
                <p className="text-xl font-light text-white/90">
                  Mix finishes. Create contrast. Make it yours.
                </p>
                
                <p className="text-xl font-light text-white/90">
                  Let's build something unforgettable.
                </p>
              </SlideUp>
            </div>
            
            {/* Image Column - 60% width on desktop */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.2}>
                <div className="relative w-full">
                  <Image
                    src="/everything-visualized/The%20Fusion%20Series.png"
                    alt="The Fusion Series - Full Kitchen Display"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-2xl"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* THE FINISHING TOUCHES */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              The Finishing Touches
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
              Hardware defines the final personality of your space.<br />
              Choose from our curated selection of handles, pulls, and knobs in:
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["Satin Nickel", "Chrome", "Matte Black", "Rose Gold"].map((finish) => (
                <span key={finish} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/80">
                  {finish}
                </span>
              ))}
            </div>
            <p className="text-lg text-[#FF8A3D] font-medium">
              Small details. Massive visual impact.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* THE RENOVATION HIERARCHY */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              The Renovation Hierarchy
            </h2>
            <p className="text-xl text-white/60">Why Refacing Wins</p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {/* Refacing */}
            <ScaleOnHover className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-3xl p-8 border border-emerald-500/30 relative">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                The Smart Choice
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 mt-4">Refacing</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Up to 70% cost savings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>2–3 day install</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Fastest lead time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Minimal disruption</span>
                </li>
              </ul>
            </ScaleOnHover>

            {/* Resurfacing */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Resurfacing</h3>
              <ul className="space-y-3 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Low upfront cost</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Lower perceived value</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Older cabinets remain worn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Likely to need ongoing touch-ups</span>
                </li>
              </ul>
            </div>

            {/* Replacement */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Replacement</h3>
              <ul className="space-y-3 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>$$$ Highest cost option</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>6+ weeks to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Major demolition and construction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Maximum disruption to occupants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Overkill for most flips and rentals</span>
                </li>
              </ul>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* MAXIMIZING HOME VALUE */}
      <section className="py-24 bg-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Maximizing Home Value Where It Counts
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Kitchens */}
            <SlideUp className="bg-gradient-to-br from-[#FF8A3D]/10 to-[#FF6B35]/5 rounded-3xl p-8 border border-[#FF8A3D]/20">
              <h3 className="text-2xl font-bold text-white mb-2">Kitchens: The Heart of Home Value</h3>
              <ul className="space-y-2 text-white/70 mb-6">
                <li>• Modernize outdated kitchens</li>
                <li>• Update doors & drawers with clean, modern profiles</li>
                <li>• Remove visible wear without demolition</li>
              </ul>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">100%+</div>
                  <div className="text-sm text-white/50">ROI</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">$6,500 – $11,000</div>
                  <div className="text-sm text-white/50">Typical Cost</div>
                </div>
              </div>
            </SlideUp>

            {/* Bathrooms */}
            <SlideUp delay={0.1} className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-3xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-2">Bathrooms: ROI in a Small Footprint</h3>
              <ul className="space-y-2 text-white/70 mb-6">
                <li>• High-impact visual upgrade in compact spaces</li>
                <li>• Moisture-resistant materials built for durability</li>
                <li>• Strong ROI with minimal scope and downtime</li>
              </ul>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">70%+</div>
                  <div className="text-sm text-white/50">ROI</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">$2,500 – $6,000</div>
                  <div className="text-sm text-white/50">Typical Cost</div>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* TRUST THE FOX */}
      <section className="py-24 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              Trust the Fox
            </h2>
            <p className="text-xl text-[#FF8A3D]">The Vulpine Promise</p>
          </FadeIn>

          <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: "⚡", text: "10 Days or Less — Rapid turnaround" },
                { icon: "🏠", text: "No Demolition — Cabinet boxes stay" },
                { icon: "🎯", text: "Custom Doors — Built specifically for your cabinets" },
                { icon: "✨", text: "Modern Look — High-end aesthetics without high-end pricing" },
                { icon: "📋", text: "Simple Process — Easy ordering & installation" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] shadow-lg shadow-orange-500/30"
            >
              Get Installation Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic Internal Linking - Service Areas */}
      <HomepageLinking />

      {/* Arizona Homeowners Gallery (Retained as requested) */}
      <section id="gallery" className="py-16 relative" style={{ background: 'linear-gradient(180deg, #0f0f18 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Installations</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Cabinet refacing completed across Greater Phoenix.
            </p>
          </FadeIn>
        </div>

        {/* Installation Photos - Row 1 (scrolling left) */}
        <div className="overflow-hidden py-4">
          <div className="flex animate-marquee-fast md:animate-marquee">
            {[
              { src: "/data_set/h-owners/b.jpg", caption: "Cabinet refacing projects — Paradise Valley" },
              { src: "/data_set/h-owners/c.jpg", caption: "Cabinet refacing projects — Scottsdale" },
              { src: "/data_set/h-owners/e.jpg", caption: "Cabinet refacing projects — Phoenix" },
              { src: "/data_set/h-owners/f.png", caption: "Cabinet refacing projects — Arcadia" },
              { src: "/data_set/h-owners/h.jpg", caption: "Cabinet refacing projects — Gilbert" },
              { src: "/data_set/h-owners/i.jpg", caption: "Cabinet refacing projects — Chandler" },
              { src: "/data_set/h-owners/j.jpg", caption: "Cabinet refacing projects — Paradise Valley" },
              { src: "/data_set/h-owners/k.jpg", caption: "Cabinet refacing projects — Scottsdale" },
              { src: "/data_set/h-owners/b.jpg", caption: "Cabinet refacing projects — Phoenix" },
              { src: "/data_set/h-owners/c.jpg", caption: "Cabinet refacing projects — Arcadia" },
              { src: "/data_set/h-owners/e.jpg", caption: "Cabinet refacing projects — Gilbert" },
              { src: "/data_set/h-owners/f.png", caption: "Cabinet refacing projects — Chandler" },
              { src: "/data_set/h-owners/h.jpg", caption: "Cabinet refacing projects — Paradise Valley" },
              { src: "/data_set/h-owners/i.jpg", caption: "Cabinet refacing projects — Scottsdale" },
              { src: "/data_set/h-owners/j.jpg", caption: "Cabinet refacing projects — Phoenix" },
              { src: "/data_set/h-owners/k.jpg", caption: "Cabinet refacing projects — Arcadia" },
            ].map((item, i) => (
              <div key={`az-row1-${i}`} className="flex-shrink-0 w-40 h-28 sm:w-56 sm:h-40 md:w-72 md:h-48 mx-1 sm:mx-2 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 relative group">
                <Image src={item.src} alt={item.caption} width={600} height={400} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-[10px] sm:text-xs text-white/90">
                  {item.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Photos - Row 2 (scrolling right) */}
        <div className="overflow-hidden py-4">
          <div className="flex animate-marquee-reverse-fast md:animate-marquee-reverse">
            {[
              { src: "/data_set/h-owners/l.jpg", caption: "Cabinet refacing projects — Paradise Valley" },
              { src: "/data_set/h-owners/m.jpg", caption: "Cabinet refacing projects — Scottsdale" },
              { src: "/data_set/h-owners/n.jpg", caption: "Cabinet refacing projects — Phoenix" },
              { src: "/data_set/h-owners/o.jpg", caption: "Cabinet refacing projects — Arcadia" },
              { src: "/data_set/h-owners/p.jpg", caption: "Cabinet refacing projects — Gilbert" },
              { src: "/data_set/h-owners/q.jpg", caption: "Cabinet refacing projects — Chandler" },
              { src: "/data_set/h-owners/r.jpg", caption: "Cabinet refacing projects — Paradise Valley" },
              { src: "/data_set/h-owners/l.jpg", caption: "Cabinet refacing projects — Scottsdale" },
              { src: "/data_set/h-owners/m.jpg", caption: "Cabinet refacing projects — Phoenix" },
              { src: "/data_set/h-owners/n.jpg", caption: "Cabinet refacing projects — Arcadia" },
              { src: "/data_set/h-owners/o.jpg", caption: "Cabinet refacing projects — Gilbert" },
              { src: "/data_set/h-owners/p.jpg", caption: "Cabinet refacing projects — Chandler" },
              { src: "/data_set/h-owners/q.jpg", caption: "Cabinet refacing projects — Paradise Valley" },
              { src: "/data_set/h-owners/r.jpg", caption: "Cabinet refacing projects — Scottsdale" },
            ].map((item, i) => (
              <div key={`az-row2-${i}`} className="flex-shrink-0 w-40 h-28 sm:w-56 sm:h-40 md:w-72 md:h-48 mx-1 sm:mx-2 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 relative group">
                <Image src={item.src} alt={item.caption} width={600} height={400} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-[10px] sm:text-xs text-white/90">
                  {item.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/gallery" className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)', boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)' }}>
            View Before & Afters
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CREDIBILITY STRIP */}
      <section className="py-8 bg-[#08080c] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center text-sm text-white/50">
            <span>15+ Years Experience</span>
            <span className="hidden sm:inline">•</span>
            <span>800+ Doors Installed</span>
            <span className="hidden sm:inline">•</span>
            <span>Phoenix-Based Team</span>
            <span className="hidden sm:inline">•</span>
            <span>3–5 Day Installation</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
