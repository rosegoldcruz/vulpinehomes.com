"use client";

import Link from "next/link";
import { useEffect } from "react";

const CAMPAIGN_ID = "C4L_TEMPE_21D";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function C4LThankYouClient() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") {
      return;
    }

    window.fbq("track", "Lead");
    window.fbq("trackCustom", "Showroom_Tempe_Booked", {
      campaign_id: CAMPAIGN_ID,
    });
  }, []);

  return (
    <main className="min-h-[70vh] bg-[#0a0a0f] px-4 py-16 text-white sm:px-6 lg:px-8">
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
    </main>
  );
}

