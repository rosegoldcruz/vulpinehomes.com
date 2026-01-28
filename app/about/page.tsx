// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\about\page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Vulpine Homes | Luxury Kitchens. Real Contractors. Zero Headaches.",
  description:
    "Vulpine Homes combines 15+ years of expertise with modern technology to deliver stunning cabinet refacing in days, not weeks.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/milli.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/70 to-[#050505]" />
        </div>

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase italic tracking-tighter mb-6 text-white">
            Luxury Kitchens <br/>
            Real Contractors <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Zero Headaches
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-4xl leading-relaxed">
            Vulpine Homes combines <span className="text-white font-bold">15+ years of expertise</span> with modern technology to deliver stunning cabinet refacing in <span className="text-white font-bold">days, not weeks</span>.
          </p>
        </div>
      </section>

      {/* Social Proof Ticker */}
      <section className="bg-[#111] border-y border-white/5 py-4 overflow-hidden">
        <div className="flex gap-8 animate-scroll">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-8 shrink-0">
              {["Phoenix", "Scottsdale", "Gilbert", "Mesa", "Chandler", "Tempe", "Peoria", "Glendale"].map((city) => (
                <div key={`${setIndex}-${city}`} className="flex items-center gap-3 text-gray-400 whitespace-nowrap">
                  <span className="text-orange-500">✓</span>
                  <span className="text-sm font-medium">Recently Refaced in {city}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition - Split Layout */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-6">
                Why rip out perfectly <br/>
                <span className="text-orange-600">good cabinet boxes?</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Refacing gives you a stunning, brand-new look at a 
                <span className="text-white font-bold"> fraction of the cost and time </span> 
                of a full remodel. Same layout. New doors. New hardware. New life.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-[#111] border border-white/5 rounded-2xl text-center hover:border-orange-500/30 transition-all">
                <span className="text-4xl block mb-2">⏱️</span>
                <h4 className="font-bold text-white text-lg">50% Faster</h4>
                <p className="text-xs text-gray-500 mt-1">Than traditional gutting</p>
              </div>
              <div className="p-8 bg-[#111] border border-white/5 rounded-2xl text-center hover:border-orange-500/30 transition-all">
                <span className="text-4xl block mb-2">💰</span>
                <h4 className="font-bold text-white text-lg">60% Savings</h4>
                <p className="text-xs text-gray-500 mt-1">Average vs. full remodel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Truth Table */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-sm uppercase tracking-[0.3em] text-orange-500 font-bold mb-4">The Vulpine Way</h3>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Why Refacing Wins</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-gray-400 font-black">Feature</th>
                  <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-gray-400 font-black">Full Remodel</th>
                  <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-orange-500 font-black">Vulpine Refacing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 text-white font-semibold">Duration</td>
                  <td className="py-6 px-6 text-center text-gray-400">4-8 Weeks</td>
                  <td className="py-6 px-6 text-center text-orange-500 font-bold">3-5 Days</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 text-white font-semibold">Kitchen Use</td>
                  <td className="py-6 px-6 text-center text-gray-400">No (Total Gut)</td>
                  <td className="py-6 px-6 text-center text-orange-500 font-bold">Yes (Fully Functional)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 text-white font-semibold">Cost</td>
                  <td className="py-6 px-6 text-center text-gray-400">$$$$$</td>
                  <td className="py-6 px-6 text-center text-orange-500 font-bold">$$</td>
                </tr>
                <tr>
                  <td className="py-6 px-6 text-white font-semibold">Waste</td>
                  <td className="py-6 px-6 text-center text-gray-400">Landfill bound</td>
                  <td className="py-6 px-6 text-center text-orange-500 font-bold">Sustainable / Eco-friendly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Process Timeline - Trust Block */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-sm uppercase tracking-[0.3em] text-orange-500 font-bold mb-4">How It Works</h3>
            <h2 className="text-4xl sm:text-5xl font-black text-white">From Vision to Reality in 5 Days</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Phase 1 */}
            <div className="relative">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-orange-500/30 transition-all">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] rounded-full flex items-center justify-center font-black text-white text-xl">
                  1
                </div>
                <div className="text-sm uppercase tracking-wider text-orange-500 font-bold mb-2">Day 1</div>
                <h4 className="text-2xl font-black text-white mb-4">Configure</h4>
                <p className="text-gray-400 leading-relaxed">
                  Use our V3 tool to lock in your style. Choose door profiles, colors, and hardware in minutes.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-orange-500/30 transition-all">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] rounded-full flex items-center justify-center font-black text-white text-xl">
                  2
                </div>
                <div className="text-sm uppercase tracking-wider text-orange-500 font-bold mb-2">Day 2</div>
                <h4 className="text-2xl font-black text-white mb-4">Measure</h4>
                <p className="text-gray-400 leading-relaxed">
                  Precision laser scanning of your current boxes. We measure every angle to ensure a perfect fit.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-orange-500/30 transition-all">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] rounded-full flex items-center justify-center font-black text-white text-xl">
                  3
                </div>
                <div className="text-sm uppercase tracking-wider text-orange-500 font-bold mb-2">Day 5</div>
                <h4 className="text-2xl font-black text-white mb-4">Install</h4>
                <p className="text-gray-400 leading-relaxed">
                  Your brand new doors and hardware are installed in 48 hours. Kitchen stays functional the whole time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Google Reviews */}
      <section className="py-20 px-6 bg-[#0a0a0f] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-2xl">★★★★★</span>
              <span className="text-white font-bold text-lg">5.0 on Google</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">What Neighbors Are Saying</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "The best contractor experience I've ever had. Mike was on top of everything from start to finish.", author: "Sarah M.", location: "Scottsdale" },
              { text: "Kitchen looks amazing and they actually finished in 4 days. Unbelievable speed and quality.", author: "Mark T.", location: "Gilbert" },
              { text: "Finally a company that communicates. No ghosting, no surprises. 10/10 would recommend.", author: "Jessica R.", location: "Phoenix" }
            ].map((review, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-8 border border-white/10 relative">
                <div className="text-4xl text-white/10 absolute top-4 left-4">"</div>
                <p className="text-white/80 mb-6 relative z-10 leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] flex items-center justify-center text-white font-bold">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold">{review.author}</div>
                    <div className="text-white/40 text-sm">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0f0f18] to-[#050505]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Ready to Visualize Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              New Kitchen?
            </span>
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
            Use our configurator to see your transformation before we start. Lock in your style in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/visualizer"
              className="inline-flex items-center justify-center px-12 py-6 text-xl font-black uppercase tracking-wider rounded-full text-white transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] shadow-2xl shadow-orange-500/50"
            >
              ✨ Use the Configurator
            </Link>
            <div className="flex gap-3">
              <a
                href="tel:4803648205"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-semibold rounded-full text-white/90 border border-white/20 transition-all hover:bg-white/10 hover:-translate-y-1"
              >
                📞 Call Us
              </a>
              <a
                href="sms:4803648205"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-semibold rounded-full text-white/90 border border-white/20 transition-all hover:bg-white/10 hover:-translate-y-1"
              >
                💬 Text Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
