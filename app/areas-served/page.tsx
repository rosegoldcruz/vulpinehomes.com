import type { Metadata } from "next";
import Link from "next/link";
import { CITY_LANDING_DATA, FINAL_CITY_KEYS } from "@/app/cabinet-refacing-city-data";

export const metadata: Metadata = {
  title: "Installation Areas | Cabinet Refacing Across Greater Phoenix",
  description:
    "Explore Vulpine Homes cabinet refacing service areas across Greater Phoenix. Get fast 3-5 day cabinet upgrades in 12 core cities.",
};

export default function AreasServedPage() {
  const cities = FINAL_CITY_KEYS.map((key) => CITY_LANDING_DATA[key]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#FF8A3D] uppercase tracking-[0.22em] text-xs mb-3">Installation Areas</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Cabinet Refacing Service Cities</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            We currently focus on 12 core markets across Greater Phoenix. Choose your city to view localized project examples, FAQs, and quote options.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {cities.map((city) => (
            <Link
              key={city.route}
              href={city.route}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 hover:border-[#FF8A3D] transition-colors"
            >
              <p className="text-white font-semibold text-xl mb-1">{city.city}</p>
              <p className="text-white/65 text-sm">{city.heroKicker} • {city.primaryHook}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10">
          <iframe
            title="Greater Phoenix service map"
            src="https://www.google.com/maps?q=Phoenix%20Metro%20Area%2C%20AZ&output=embed"
            className="w-full h-[420px]"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}
