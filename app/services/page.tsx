// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\services\page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cabinet Installation Services Phoenix | Door Installation & Refinishing",
  description:
    "Our team installs cabinet doors, drawer fronts, and refinishes cabinet boxes in Phoenix. 3-5 day installation. Get your installation quote today.",
  openGraph: {
    title: "Cabinet Installation Services Phoenix | Door Installation & Refinishing",
    description:
      "Our team installs cabinet doors, drawer fronts, and refinishes cabinet boxes in Phoenix. 3-5 day installation. Get your installation quote today.",
    url: "https://www.vulpinehomes.com/services",
    type: "website",
    images: [
      {
        url: "https://www.vulpinehomes.com/marketing/recab.png",
        width: 1200,
        height: 900,
        alt: "Finished kitchen cabinets installed by Vulpine Homes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabinet Installation Services Phoenix | Door Installation & Refinishing",
    description:
      "Our team installs cabinet doors, drawer fronts, and refinishes cabinet boxes in Phoenix. 3-5 day installation. Get your installation quote today.",
    images: ["https://www.vulpinehomes.com/marketing/recab.png"],
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <section className="relative py-24 border-b border-white/10" style={{ background: "linear-gradient(135deg, #0f0f18 0%, #0a0a0f 100%)" }}>
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[130px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">Cabinet Installation Services</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Cabinet Door Installation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]"> & Refinishing</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Our team installs premium cabinet doors, drawer fronts, and refinishes cabinet boxes. Every installation is performed by our in-house team—no subcontractors, no third parties.
          </p>
        </div>
      </section>

      {/* Service 1: Cabinet Door Installation */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg,#0a0a0f,#0f0f18)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-4">
              <span className="w-8 h-[2px] bg-emerald-400"></span>
              Our Specialty
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cabinet Door Installation</h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              We install premium replacement cabinet doors and drawer fronts. Our team handles all measuring, fitting, and hardware installation—delivering a completely new kitchen appearance without demolition or unnecessary disruption.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-4">What Our Team Installs</h3>
            <ul className="space-y-3 mb-8">
              {[
                "Precision measurement and door fitting",
                "Soft-close hinge installation",
                "Hardware mounting and alignment",
                "Door and drawer front installation",
                "Final adjustments and quality check"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/85">
                  <span className="text-emerald-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/60 italic mb-4">Our team installs every door with craftsman-level precision.</p>
            <p className="text-sm text-emerald-400/80 mb-8 flex items-center gap-2">
              <span>✓</span> All installation work performed by Vulpine team members.
            </p>
            <Link href="/kitchen-cabinet-refacing" className="text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-2 group">
              Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-900/20">
            <Image src="/marketing/recab.png" alt="Cabinet Door Installation" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Service 2: Cabinet Box Refinishing */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg,#0f0f18,#12121c)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] order-last lg:order-first rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-amber-900/20">
            <Image src="/marketing/1200 x 900.png" alt="Cabinet box refinishing" fill className="object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold mb-4">
              <span className="w-8 h-[2px] bg-amber-400"></span>
              Professional Refinishing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cabinet Box Refinishing</h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Our installers refinish existing cabinet boxes to match your new doors. We handle all surface preparation, professional painting, and durable finish application.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Surface preparation and cleaning",
                "Professional painting and staining",
                "Durable finish application",
                "Color matching to new doors"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <span className="text-amber-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-amber-400/80 flex items-center gap-2">
              <span>✓</span> All refinishing work performed by our team.
            </p>
          </div>
        </div>
      </section>

      {/* Service 3: Hardware Installation */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg,#12121c,#0a0a0f)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold mb-4">
              <span className="w-8 h-[2px] bg-amber-400"></span>
              Precision Hardware
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Hardware Installation</h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              We install all cabinet hardware including pulls, knobs, and soft-close mechanisms. Our team ensures precision placement and perfect alignment on every piece.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Handle and pull installation",
                "Soft-close hinge systems",
                "Drawer glide installation",
                "Alignment and final adjustments"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <span className="text-amber-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-amber-400/80 flex items-center gap-2">
              <span>✓</span> All hardware installed by our team.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-amber-900/20">
            <Image src="/marketing/panels decor.jpeg" alt="Hardware installation" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #0f0f18 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Why Choose Our Installation Team</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Every installation performed by our experienced in-house team</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚪", title: "800+ Doors Installed", desc: "Our team has installed over 800 cabinet doors across Phoenix." },
              { icon: "⚡", title: "3-5 Day Installation", desc: "Most installations completed in 3-5 days by our team." },
              { icon: "✨", title: "100% In-House", desc: "No subcontractors. Our team handles every installation." },
              { icon: "🛡️", title: "Installation Guarantee", desc: "Every installation backed by our workmanship warranty." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all hover:bg-white/10 hover:border-[#FF8A3D]/30">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF8A3D]/20 to-[#FF6B35]/20 flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
