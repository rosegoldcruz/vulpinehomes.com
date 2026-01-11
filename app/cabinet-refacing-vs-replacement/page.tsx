import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import { CTAButton } from "../components/CTAButton";

export const metadata: Metadata = {
  title: "Cabinet Refacing vs Replacement | Cost Comparison Guide 2024",
  description: "Cabinet refacing vs replacement: Compare costs, timeline, and results. Learn which option saves you more money and time. Expert comparison guide with real pricing.",
  keywords: "cabinet refacing vs replacement, cabinet refacing cost, cabinet replacement cost, refacing or replacing cabinets",
};

export default function RefacingVsReplacementPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-16">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-16 pb-20 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="text-white">Cabinet Refacing </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">vs</span>
            <span className="text-white"> Replacement</span>
          </h1>
          <p className="text-xl text-white/80 text-center max-w-3xl mx-auto">
            The ultimate cost and value comparison to help you make the best decision for your kitchen remodel.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#FF8A3D]">
                  <th className="text-left p-6 text-white text-xl font-bold">Factor</th>
                  <th className="text-center p-6 text-[#FF8A3D] text-xl font-bold">Cabinet Refacing ✓</th>
                  <th className="text-center p-6 text-white/60 text-xl font-bold">Cabinet Replacement</th>
                </tr>
              </thead>
              <tbody className="bg-white/5">
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">Average Cost</td>
                  <td className="p-6 text-center text-green-400 font-bold">$4,000 - $10,000</td>
                  <td className="p-6 text-center text-red-400 font-bold">$12,000 - $30,000+</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">Timeline</td>
                  <td className="p-6 text-center text-green-400 font-bold">2-5 days</td>
                  <td className="p-6 text-center text-red-400 font-bold">3-8 weeks</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">Disruption</td>
                  <td className="p-6 text-center text-green-400 font-bold">Minimal</td>
                  <td className="p-6 text-center text-red-400 font-bold">Extensive</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">Kitchen Usability</td>
                  <td className="p-6 text-center text-green-400 font-bold">Mostly usable</td>
                  <td className="p-6 text-center text-red-400 font-bold">Unusable for weeks</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">Waste Generated</td>
                  <td className="p-6 text-center text-green-400 font-bold">Minimal</td>
                  <td className="p-6 text-center text-red-400 font-bold">Significant</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">Layout Changes</td>
                  <td className="p-6 text-center text-white/70">Not included</td>
                  <td className="p-6 text-center text-green-400 font-bold">Possible</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white font-semibold">ROI</td>
                  <td className="p-6 text-center text-green-400 font-bold">High</td>
                  <td className="p-6 text-center text-white/70">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* When to Choose Refacing */}
      <section className="py-20 bg-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#FF8A3D]/10 to-[#FF6B35]/10 border-2 border-[#FF8A3D] rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Choose Cabinet Refacing If:</h2>
              <ul className="space-y-4">
                {[
                  "Cabinet boxes are structurally sound",
                  "You like your current kitchen layout",
                  "Budget is a priority (save 40-60%)",
                  "You want fast results (2-5 days)",
                  "Minimizing disruption is important",
                  "You want an eco-friendly option",
                  "Just updating style and color"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/90">
                    <span className="text-[#FF8A3D] text-2xl flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <CTAButton className="mt-8" />
            </div>

            <div className="bg-white/5 border border-white/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Choose Replacement If:</h2>
              <ul className="space-y-4">
                {[
                  "Cabinet boxes are damaged or warped",
                  "You want to change the kitchen layout",
                  "You need different cabinet sizes",
                  "Structural issues need addressing",
                  "Budget is not a primary concern",
                  "You can wait several weeks",
                  "Major renovation is already planned"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70">
                    <span className="text-white/40 text-2xl flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-white">Detailed </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Cost Breakdown</span>
          </h2>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-[#FF8A3D] mb-4">Cabinet Refacing Costs:</h3>
              <ul className="space-y-3 text-white/80">
                <li>• New doors and drawer fronts</li>
                <li>• Veneer for cabinet frames</li>
                <li>• New hardware (pulls and hinges)</li>
                <li>• Professional installation</li>
                <li>• Cleanup and disposal</li>
              </ul>
              <p className="mt-6 text-lg font-semibold text-white">
                <span className="text-[#FF8A3D]">Total:</span> $4,000 - $10,000 for average kitchen
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Cabinet Replacement Costs:</h3>
              <ul className="space-y-3 text-white/80">
                <li>• Complete cabinet removal and disposal</li>
                <li>• New cabinet boxes and installation</li>
                <li>• New doors, drawer fronts, and hardware</li>
                <li>• Potential plumbing/electrical adjustments</li>
                <li>• Wall repair and painting</li>
                <li>• Countertop removal/reinstallation</li>
              </ul>
              <p className="mt-6 text-lg font-semibold text-white">
                Total: $12,000 - $30,000+ for average kitchen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f0f18]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Thousands on Your Kitchen Remodel?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Get a free consultation and detailed quote. We'll help you determine if refacing is right for your kitchen.
          </p>
          <CTAButton className="text-lg" />
        </div>
      </section>
    </main>
  );
}
