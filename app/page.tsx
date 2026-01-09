"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FadeIn, SlideUp, StaggerContainer, ScaleOnHover } from "@/app/components/ui/Motion";
import { HomepageLinking } from "./components/linking/InternalLinking";
import { CTAButton } from "./components/CTAButton";
import CountUp from "./components/CountUp";

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

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/ascend.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Hero Content */}
        <FadeIn className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <SlideUp className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
            Smarter Kitchen Transformations —<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Without the Remodel Chaos
            </span>
          </SlideUp>

          <FadeIn delay={0.2} className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl mb-10 text-white/80 font-light px-4 leading-relaxed">
            Design, coordination, and oversight by Vulpine Homes.<br/>
            Installation by the experienced team at Freedom Kitchen & Bath.
          </FadeIn>

          <FadeIn delay={0.4} className="flex justify-center items-center w-full px-4">
            <Link
              href="/fox-live"
              className="group inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] shadow-lg shadow-orange-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D]/70"
            >
              Meet the Fox in Your Kitchen
            </Link>
          </FadeIn>
        </FadeIn>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative py-8 border-y border-white/10" style={{ background: 'linear-gradient(180deg, #0f0f18 0%, #12121c 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
            {[
              "One point of contact from design to install",
              "Installed by the team at Freedom Kitchen & Bath (5.0★ on Google)",
              "No demo · No mess · No guessing",
              "Personally overseen by your Vulpine Project Advisors"
            ].map((text, i) => (
              <FadeIn key={i} className="flex items-center justify-center lg:justify-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">✓</span>
                <span className="text-sm font-medium text-white/80">{text}</span>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-b border-white/10" style={{ background: '#0f0f18' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FF8A3D] mb-2">
                <CountUp to={10} duration={2} />+
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/60">Years Experience</div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FF8A3D] mb-2">
                <CountUp to={500} duration={2} />+
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/60">Kitchens Transformed</div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FF8A3D] mb-2">
                <CountUp to={3} duration={1.5} />-<CountUp to={5} duration={2} />
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/60">Days Average</div>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FF8A3D] mb-2">
                <CountUp to={100} duration={2} />%
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/60">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET YOUR PROJECT ADVISORS */}
      <section id="advisors" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Meet Your Project Advisors
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Vulpine Homes isn’t a contractor — and that’s intentional.<br/>
              We manage your project, guide decisions, and make sure the work gets done right — without the stress that usually comes with remodels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Daniel Cruz */}
            <SlideUp className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 flex flex-col items-center text-center group hover:border-[#FF8A3D]/30 transition-all">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/10 group-hover:border-[#FF8A3D]/50 transition-colors">
                <Image src="/daniel-cruz.png" alt="Daniel Cruz" width={128} height={128} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Daniel Cruz</h3>
              <div className="text-[#FF8A3D] text-sm font-semibold uppercase tracking-wider mb-4">Project Advisor</div>
              <div className="text-white/40 text-xs uppercase tracking-widest mb-6">Design · Coordination · Oversight</div>
              <p className="text-white/70 mb-8 leading-relaxed">
                Daniel is your primary point of contact from the first design preview to final walkthrough. 
                If something needs attention, Daniel is the one you call — no runaround, no disappearing contractors.
              </p>
              <div className="mt-auto">
                <a href="tel:4803648205" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <span>📞</span> Direct Line: 480-364-8205
                </a>
              </div>
            </SlideUp>

            {/* Mike Musonda */}
            <SlideUp delay={0.1} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 flex flex-col items-center text-center group hover:border-[#FF8A3D]/30 transition-all">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/10 group-hover:border-[#FF8A3D]/50 transition-colors">
                <Image src="/mike-musonda.jpeg" alt="Mike Musonda" width={128} height={128} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Mike Musonda</h3>
              <div className="text-[#FF8A3D] text-sm font-semibold uppercase tracking-wider mb-4">Project Advisor</div>
              <div className="text-white/40 text-xs uppercase tracking-widest mb-6">Planning · Client Experience · Oversight</div>
              <p className="text-white/70 mb-8 leading-relaxed">
                Mike works alongside Daniel to guide homeowners through layout decisions, timelines, and expectations — making sure every project stays smooth, clear, and on track.
              </p>
              <div className="mt-auto">
                <a href="tel:6026223828" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <span>📞</span> Direct Line: 602-622-3828
                </a>
              </div>
            </SlideUp>
          </div>

          <FadeIn className="text-center border-t border-white/10 pt-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Two advisors. One standard. One accountable team.
            </h3>
          </FadeIn>
        </div>
      </section>

      {/* INSTALLATION SECTION */}
      <section className="py-24 bg-[#08080c] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SlideUp>
              <h2 className="text-4xl font-bold text-white mb-6">Who Installs the Work?</h2>
              <p className="text-xl text-white/80 leading-relaxed mb-6">
                All installations are completed by the experienced team at <strong className="text-emerald-400">Freedom Kitchen & Bath</strong>, a Phoenix-based kitchen remodeler with a 5.0-star rating on Google.
              </p>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Vulpine Homes handles the planning, coordination, and homeowner experience.<br/>
                Freedom Kitchen & Bath handles the craftsmanship.
              </p>
              
              <a 
                href="https://www.google.com/search?sca_esv=f1a6d5ece4c2b634&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E6lMeqOEQT7yQghNF2TUsvKBJCQY0uI-lN2tu3wcEuLFh56a2W2ou8GQVwXMr9CNk1s4M7cXGEry7JR79GV9unEJQNq_Zsq6_D6djV-YbH0QeVKQEQ%3D%3D&q=Freedom+Kitchen+and+Bath+Reviews&sa=X&ved=2ahUKEwig24ib6vaRAxX3HEQIHRqwJF8Q0bkNegQIHxAD&biw=2024&bih=987&dpr=1.89"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all group"
              >
                <div className="text-4xl">⭐</div>
                <div>
                  <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Freedom Kitchen & Bath</div>
                  <div className="text-sm text-white/60">39 verified Google reviews (5.0★)</div>
                </div>
              </a>
            </SlideUp>

            <FadeIn delay={0.2} className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image src="/marketing/installer.jpg" alt="Freedom Kitchen & Bath Installation Team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-white font-bold text-lg">Expert Installation</div>
                <div className="text-emerald-400 text-sm">Clean, Efficient, Professional</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* THE GUARANTEE */}
      <section className="py-20 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScaleOnHover className="bg-gradient-to-br from-[#FF8A3D]/20 to-[#FF6B35]/20 p-[1px] rounded-3xl">
            <div className="bg-[#0a0a0f] rounded-[23px] p-10 md:p-14 border border-[#FF8A3D]/20">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] rounded-full flex items-center justify-center text-3xl mb-6 shadow-lg shadow-orange-500/30">
                🛡️
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Vulpine Project Guarantee</h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                If something feels off, we make it right.<br/>
                No finger-pointing. No disappearing contractors.<br/>
                <span className="text-white font-semibold">You call us — we handle it.</span>
              </p>
            </div>
          </ScaleOnHover>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f18 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h2>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { 
                num: "1", 
                title: "Visualize Your Kitchen", 
                desc: "Preview your transformation before any work begins.", 
                image: "/marketing/love-your-kitchen.jpeg", 
                gradient: "from-[#FF8A3D] to-[#FF6B35]" 
              },
              { 
                num: "2", 
                title: "Talk to a Project Advisor", 
                desc: "Daniel or Mike walks you through options, timelines, and expectations.", 
                image: "/marketing/free-consultation.jpeg", 
                gradient: "from-purple-600 to-purple-500" 
              },
              { 
                num: "3", 
                title: "Installation by Freedom Kitchen & Bath", 
                desc: "Experienced crews complete the work — clean, efficient, and coordinated. We stay involved until you're satisfied.", 
                image: "/marketing/expert-installation.jpeg", 
                gradient: "from-emerald-600 to-emerald-500" 
              },
            ].map((step, i) => (
              <ScaleOnHover key={i} className="relative group">
                <div className={`absolute -top-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-xl z-10`}>
                  {step.num}
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 pt-12 border border-white/10 h-full transition-all group-hover:bg-white/10 group-hover:border-white/20">
                  <div className="w-full aspect-[4/3] mx-auto mb-6 rounded-2xl overflow-hidden relative">
                    <Image src={step.image} alt={step.title} fill className="object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </ScaleOnHover>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Strategic Internal Linking - Service Areas */}
      <HomepageLinking />

      {/* Arizona Homeowners Gallery (Retained as requested) */}
      <section id="gallery" className="py-16 relative" style={{ background: 'linear-gradient(180deg, #0f0f18 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Arizona <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Homeowners</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Real kitchens from real Arizona families we've transformed.
            </p>
          </FadeIn>
        </div>

        {/* Arizona Homeowner Photos - Row 1 (scrolling left) */}
        <div className="overflow-hidden py-4">
          <div className="flex animate-marquee-fast md:animate-marquee">
            {[
              "/data_set/h-owners/b.jpg",
              "/data_set/h-owners/c.jpg",
              "/data_set/h-owners/e.jpg",
              "/data_set/h-owners/f.png",
              "/data_set/h-owners/h.jpg",
              "/data_set/h-owners/i.jpg",
              "/data_set/h-owners/j.jpg",
              "/data_set/h-owners/k.jpg",
              "/data_set/h-owners/b.jpg",
              "/data_set/h-owners/c.jpg",
              "/data_set/h-owners/e.jpg",
              "/data_set/h-owners/f.png",
              "/data_set/h-owners/h.jpg",
              "/data_set/h-owners/i.jpg",
              "/data_set/h-owners/j.jpg",
              "/data_set/h-owners/k.jpg",
            ].map((src, i) => (
              <div key={`az-row1-${i}`} className="flex-shrink-0 w-40 h-28 sm:w-56 sm:h-40 md:w-72 md:h-48 mx-1 sm:mx-2 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 relative group">
                <Image src={src} alt={`Arizona homeowner project ${i + 1}`} width={600} height={400} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Arizona Homeowner Photos - Row 2 (scrolling right) */}
        <div className="overflow-hidden py-4">
          <div className="flex animate-marquee-reverse-fast md:animate-marquee-reverse">
            {[
              "/data_set/h-owners/l.jpg",
              "/data_set/h-owners/m.jpg",
              "/data_set/h-owners/n.jpg",
              "/data_set/h-owners/o.jpg",
              "/data_set/h-owners/p.jpg",
              "/data_set/h-owners/q.jpg",
              "/data_set/h-owners/r.jpg",
              "/data_set/h-owners/l.jpg",
              "/data_set/h-owners/m.jpg",
              "/data_set/h-owners/n.jpg",
              "/data_set/h-owners/o.jpg",
              "/data_set/h-owners/p.jpg",
              "/data_set/h-owners/q.jpg",
              "/data_set/h-owners/r.jpg",
            ].map((src, i) => (
              <div key={`az-row2-${i}`} className="flex-shrink-0 w-40 h-28 sm:w-56 sm:h-40 md:w-72 md:h-48 mx-1 sm:mx-2 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 relative group">
                <Image src={src} alt={`Arizona homeowner project ${i + 9}`} width={600} height={400} className="w-full h-full object-cover" />
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

      {/* Footer */}
      <footer className="bg-[#08080c] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logos/vulpines-official-logo.png" alt="Vulpine" width={40} height={40} className="w-10 h-10 object-contain" />
                <span className="text-white font-bold text-lg tracking-tight">VULPINE HOMES</span>
              </div>
              <p className="text-white/50">Arizona's premier kitchen design & coordination service. Overseeing excellence from start to finish.</p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/get-quote" className="text-white/50 hover:text-[#FF8A3D] transition-colors">Get A Quote</Link></li>
                <li><Link href="/gallery" className="text-white/50 hover:text-[#FF8A3D] transition-colors">Before & After</Link></li>
                <li><a href="#how-it-works" className="text-white/50 hover:text-[#FF8A3D] transition-colors">How It Works</a></li>
                <li><Link href="/visualizer" className="text-white/50 hover:text-[#FF8A3D] transition-colors">AI Visualizer</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Get In Touch</h3>
              <p className="text-white/60 mb-4">
                Call or Text: <a href="tel:4803648205" className="text-[#FF8A3D] hover:underline">480-364-8205</a>
              </p>
              <form action="https://formsubmit.co/cruz@vulpinehomes.com" method="POST" className="space-y-3">
                <input type="hidden" name="_subject" value="New Contact from Vulpine Footer" />
                <input type="text" name="name" placeholder="Your Name" required className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm" />
                <input type="tel" name="phone" placeholder="Phone Number" required className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm" />
                 <input type="text" name="zip" placeholder="ZIP Code" required className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm" />
                <button type="submit" className="w-full py-2 rounded-lg bg-[#FF8A3D] text-white font-semibold text-sm hover:bg-[#FF6B35] transition-colors">Get Started</button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Vulpine Homes. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
