"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const CAMPAIGN_ID = "C4L_TEMPE_21D";
const C4L_FOOTER_BANNER = "/c4l/HighQual-C4L-Cab4Less-Horiz-8-1200x373.png";

export default function C4LThankYouClient() {
  useEffect(() => {
    const fbq = (window as any)?.fbq as undefined | ((...args: any[]) => void);
    if (typeof fbq !== "function") return;

    fbq("track", "Lead");
    fbq("trackCustom", "Showroom_Tempe_Booked", {
      campaign_id: CAMPAIGN_ID,
    });
  }, []);

  return (
    <main className="min-h-[70vh] bg-[#0a0a0f] px-4 py-16 text-white sm:px-6 lg:px-8">
      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-xl font-bold text-[#0a0a0f]">
            ✓
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">You’re Booked.</h1>
          <p className="mt-3 text-lg text-white/80">We’ll reach out to confirm your time.</p>
          <p className="mt-5 text-white/75">
            When you arrive, tell the front desk you’re here for your Vulpine Homes design session.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to Landing Page
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <Image
            src={C4L_FOOTER_BANNER}
            alt="Cabinets4Less x Vulpine Homes"
            width={1200}
            height={373}
            className="h-auto w-full"
          />
        </div>
      </div>
    </main>
  );
}
