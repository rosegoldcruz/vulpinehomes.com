import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlareCard } from "../components/ui/GlareCard";
import { ProfileCard } from "../components/ui/ProfileCard";

export const metadata: Metadata = {
  title: "About Vulpine Homes | Kitchen Design & Project Management Platform",
  description:
    "Vulpine Homes is a kitchen design and project management platform built to remove chaos from home improvement. Installations by Freedom Kitchen & Bath.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/milli.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-white">
            About<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Vulpine Homes
            </span>
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            <GlareCard className="flex flex-col justify-center p-8 lg:p-10">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl mb-6 text-[#FF8A3D]">🦊</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What Vulpine Is</h2>
              <p className="text-xl text-white/80 leading-relaxed border-l-4 border-[#FF8A3D] pl-6">
                Founded by Daniel Cruz and Mike Musonda, Vulpine Homes brings 10+ years of AZ expertise. We're your one-stop for stress-free upgrades.
              </p>
            </GlareCard>
            
            <GlareCard className="flex flex-col justify-center p-8 lg:p-10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-6 text-purple-400">⚡</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why This Exists</h2>
              <p className="text-xl text-white/80 leading-relaxed border-l-4 border-purple-500 pl-6">
                Most homeowners don't hate renovations — they hate the uncertainty. Vulpine exists to give you clarity before work begins and accountability until it's done.
              </p>
            </GlareCard>
          </div>
        </div>
      </section>

      {/* Section 3 — Meet the Project Advisors */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}>
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
              Vulpine Homes isn't a contractor — and that's intentional.<br/>
              We manage your project, guide decisions, and make sure the work gets done right — without the stress that usually comes with remodels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16 justify-items-center">
            {/* Daniel Cruz */}
            <ProfileCard
              name="Daniel Cruz"
              title="Project Advisor"
              imageSrc="/daniel-cruz.png"
              description="Daniel is your primary point of contact from the first design preview to final walkthrough. He coordinates timelines, manages expectations, and ensures every detail is handled before, during, and after installation."
              socials={[
                { icon: <span>📞</span>, label: "Call: 480-364-8205", href: "tel:4803648205", type: "call" },
                { icon: <span>💬</span>, label: "Text: 480-364-8205", href: "sms:4803648205", type: "text" }
              ]}
            />

            {/* Mike Musonda */}
            <ProfileCard
              name="Mike Musonda"
              title="Project Advisor"
              imageSrc="/mike-musonda.jpeg"
              description="Mike works alongside Daniel to guide homeowners through layout decisions, timelines, and expectations — making sure every project stays smooth, clear, and on track."
              socials={[
                { icon: <span>📞</span>, label: "Call: 602-622-3828", href: "tel:6026223828", type: "call" },
                { icon: <span>💬</span>, label: "Text: 602-622-3828", href: "sms:6026223828", type: "text" }
              ]}
            />
          </div>

          <div className="text-center border-t border-white/10 pt-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Two advisors. One standard. One accountable team.
            </h3>
          </div>
        </div>
      </section>

      {/* Section 4 — Who Installs the Work */}
      <section className="py-24 bg-[#08080c] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
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
            </div>

            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image src="/marketing/installer.jpg" alt="Freedom Kitchen & Bath Installation Team" fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-white font-bold text-lg">Expert Installation</div>
                <div className="text-emerald-400 text-sm">Clean, Efficient, Professional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-20 bg-[#0a0a0f] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start?</h2>
          <p className="text-xl text-white/70 mb-10">
            Talk to Daniel or Mike about your kitchen project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/visualizer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white transition-all hover:-translate-y-1 bg-gradient-to-r from-[#9333ea] via-[#db2777] to-[#FF8A3D] shadow-lg shadow-purple-500/30"
            >
              Try the Visualizer
            </Link>
            <a
              href="tel:4803648205"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white/90 border border-white/20 transition-all hover:bg-white/10 hover:-translate-y-1"
            >
              📞 Call 480-364-8205
            </a>
            <a
              href="sms:4803648205"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white/90 border border-white/20 transition-all hover:bg-white/10 hover:-translate-y-1"
            >
              💬 Text Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
