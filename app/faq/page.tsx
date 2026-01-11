import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import { CTAButton } from "../components/CTAButton";
import FAQSchema from "../components/schemas/FAQSchema";

export const metadata: Metadata = {
  title: "Cabinet Refacing FAQ | Common Questions Answered | Vulpine Homes",
  description: "Get answers to common cabinet refacing questions. Learn about costs, timeline, process, and whether refacing is right for your kitchen. Free expert consultation.",
  keywords: "cabinet refacing faq, is cabinet refacing worth it, how long does cabinet refacing take, cabinet refacing cost",
};

const faqs = [
  {
    question: "Is cabinet refacing worth it?",
    answer: "Cabinet refacing is worth it when your cabinet boxes are structurally sound. It costs significantly less than full replacement (40-60% savings) while delivering a new look in a fraction of the time. You get professional results without the expense and disruption of a full kitchen renovation."
  },
  {
    question: "How long does cabinet refacing take?",
    answer: "Most cabinet refacing projects take 2–5 days depending on kitchen size and customization. This is dramatically faster than full cabinet replacement, which can take several weeks and requires extensive demolition and reconstruction."
  },
  {
    question: "What is the difference between cabinet refacing and cabinet replacement?",
    answer: "Refacing replaces doors, drawer fronts, and applies new veneer while keeping existing cabinet boxes. Replacement removes everything and installs completely new cabinets. Refacing is faster, cheaper, less disruptive, and more environmentally friendly while still delivering stunning results."
  },
  {
    question: "Is cabinet refacing cheaper than replacement?",
    answer: "Yes. Cabinet refacing typically costs 40–60% less than full cabinet replacement. You save money on materials, labor, and avoid costs associated with demolition, disposal, and potential plumbing/electrical work that comes with full replacement."
  },
  {
    question: "Can all cabinets be refaced?",
    answer: "Cabinets can be refaced if the cabinet boxes (frames) are structurally sound and in good condition. Cabinets with water damage, warping, or structural issues may need replacement. We provide free consultations to assess if your cabinets are good candidates for refacing."
  },
  {
    question: "What door styles are available for cabinet refacing?",
    answer: "We offer multiple door styles including Shaker Classic (timeless recessed panel), Slab (modern flat design), Shaker Slide (soft rounded edges), Fusion Shaker, and Fusion Slide. Each style is available in 13+ premium colors and finishes."
  },
  {
    question: "Do you change cabinet hardware during refacing?",
    answer: "Yes! New hardware is a key part of the refacing process. We offer premium pulls and handles in multiple styles (Arch, Artisan, Cottage, Loft, Square, Bar) and finishes (Satin Nickel, Chrome, Matte Black, Rose Gold, Bronze) to perfectly complement your new doors."
  },
  {
    question: "Will I be able to use my kitchen during refacing?",
    answer: "Yes, you can generally use your kitchen during most of the refacing process, though there may be brief periods where access is limited during installation. This is a major advantage over full replacement, which often requires setting up a temporary kitchen."
  },
  {
    question: "How do I maintain refaced cabinets?",
    answer: "Maintenance is simple—wipe down with a soft cloth and mild soap solution. Avoid harsh chemicals and abrasive cleaners. Our high-quality materials are designed to last for many years with minimal maintenance."
  },
  {
    question: "Does cabinet refacing include the inside of cabinets?",
    answer: "Standard refacing focuses on visible exterior surfaces—doors, drawer fronts, and cabinet face frames. Interior upgrades like shelving or organizers can be added as optional enhancements during your consultation."
  },
  {
    question: "What areas do you serve?",
    answer: "We serve the Greater Phoenix area including Phoenix, Scottsdale, Tempe, Mesa, Glendale, Chandler, Gilbert, and surrounding communities. Contact us for a free consultation to confirm service availability in your specific area."
  },
  {
    question: "How much does cabinet refacing cost?",
    answer: "Cabinet refacing costs vary based on kitchen size, door style, and finish selections. On average, refacing costs 40-60% less than full replacement. We provide free in-home consultations with detailed quotes so you know exactly what to expect—no hidden fees."
  },
  {
    question: "Is there a warranty on cabinet refacing work?",
    answer: "Yes, we stand behind our work with comprehensive warranties on both materials and installation. Specific warranty details are provided during your consultation and included in your contract."
  },
  {
    question: "Can I see examples of your work before deciding?",
    answer: "Absolutely! Check out our before/after gallery showcasing real kitchen transformations. We're also happy to provide references from satisfied Phoenix-area customers during your free consultation."
  }
];

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <main className="min-h-screen bg-[#0a0a0f] pt-16">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-16 pb-20 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Frequently Asked Questions</span>
              <br />
              <span className="text-white">About Cabinet Refacing</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Get expert answers to common questions about cabinet refacing, costs, timeline, and process.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-start gap-3">
                    <span className="text-[#FF8A3D] flex-shrink-0">Q:</span>
                    <span>{faq.question}</span>
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed pl-9">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#0f0f18]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get personalized answers and a free quote for your specific kitchen during an in-home consultation.
            </p>
            <CTAButton className="inline-flex items-center px-10 py-4 text-lg" />

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <Link href="/cabinet-refacing-phoenix-az" className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#FF8A3D] transition-all">
                <h3 className="text-white font-bold">Phoenix Cabinet Refacing</h3>
              </Link>
              <Link href="/kitchen-cabinet-refacing" className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#FF8A3D] transition-all">
                <h3 className="text-white font-bold">Kitchen Cabinet Refacing</h3>
              </Link>
              <Link href="/cabinet-refacing-vs-replacement" className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#FF8A3D] transition-all">
                <h3 className="text-white font-bold">Refacing vs Replacement</h3>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
