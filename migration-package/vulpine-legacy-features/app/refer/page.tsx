import type { Metadata } from "next";
import ReferralLinkGenerator from "./ReferralLinkGenerator";
import { getSiteUrl } from "@/lib/referralProgram";

export const dynamic = "force-static";

const siteUrl = getSiteUrl();
const referUrl = `${siteUrl}/refer`;

const referralRoles = [
  "Friends",
  "Family",
  "Realtors",
  "Property managers",
  "Contractors",
  "Anyone",
];

const referralSteps = [
  "You submit a referral.",
  "We contact them and schedule a consultation.",
  "They complete a cabinet refacing project.",
  "You receive $500.",
];

const terms = [
  "Referral must be for cabinet refacing only.",
  "Referral must be a new customer to Vulpine Homes.",
  "Payout is issued only after project completion and full payment.",
  "Referrer is responsible for accurate contact details.",
  "Vulpine Homes may decline ineligible referrals.",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "$500 Cabinet Referral Program | Vulpine Homes",
  description:
    "Earn $500 for every completed cabinet refacing project you refer in Arizona. Simple. Transparent. Paid after completion.",
  alternates: {
    canonical: referUrl,
  },
  openGraph: {
    title: "$500 Cabinet Referral Program | Vulpine Homes",
    description:
      "Earn $500 for every completed cabinet refacing project you refer in Arizona. Simple. Transparent. Paid after completion.",
    url: referUrl,
    siteName: "Vulpine Homes",
    type: "website",
  },
};

function FormInput({
  id,
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-white/80">
        {label}
        {required ? <span className="text-[#FF8A3D]"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
      />
    </div>
  );
}

export default function ReferPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-24 text-white">
      <style>{`
        #referral-success:target,
        #referral-error:target {
          display: block;
        }
      `}</style>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.16),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF8A3D]">Referral Program</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Earn $500 For Every Cabinet Refacing Project You Refer.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75 md:text-xl">
            Know someone upgrading their kitchen? Refer them to Vulpine Homes. If they complete a cabinet refacing project, you get paid.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#referral-form"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] px-6 py-3 text-base font-semibold text-white"
            >
              Submit a Referral
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-base font-semibold text-white/90 hover:border-white/40 hover:text-white"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {referralSteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#FF8A3D]">Step {index + 1}</p>
                <p className="mt-2 text-lg font-medium text-white">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-xl border border-[#FF8A3D]/40 bg-[#FF8A3D]/10 px-4 py-3 text-sm font-medium text-white">
            Payout occurs only after the referred cabinet refacing project is completed and paid in full.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <h2 className="text-3xl font-bold md:text-4xl">Who Can Refer?</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {referralRoles.map((role) => (
              <span key={role} className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-semibold text-white/85">
                {role}
              </span>
            ))}
          </div>
          <p className="mt-6 text-lg text-white/80">
            No limit on referrals. Each completed cabinet refacing project = <span className="font-bold text-white">$500</span>.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <ReferralLinkGenerator />
      </section>

      <section id="referral-form" className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <h2 className="text-3xl font-bold md:text-4xl">Referral Submission</h2>
          <p className="mt-3 text-white/70">Share the details below and our team will follow up.</p>

          <div
            id="referral-success"
            className="mt-6 hidden rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200"
          >
            Referral Received. We&apos;ll contact them shortly.
          </div>

          <div
            id="referral-error"
            className="mt-6 hidden rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200"
          >
            We couldn&apos;t process your referral. Please check your details and submit again.
          </div>

          <form action="/api/referral" method="post" className="mt-6 space-y-6">
            <input type="hidden" name="referralCode" value="" />
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                id="referrerName"
                name="referrerName"
                label="Your Full Name"
                required
                placeholder="Jane Doe"
                autoComplete="name"
              />
              <FormInput
                id="referrerEmail"
                name="referrerEmail"
                label="Your Email"
                type="email"
                required
                placeholder="jane@example.com"
                autoComplete="email"
              />
              <FormInput
                id="referrerPhone"
                name="referrerPhone"
                label="Your Phone"
                type="tel"
                required
                placeholder="(480) 555-0123"
                autoComplete="tel"
              />
              <FormInput
                id="city"
                name="city"
                label="City"
                required
                placeholder="Phoenix"
                autoComplete="address-level2"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                id="referredName"
                name="referredName"
                label="Referred Person Name"
                required
                placeholder="John Smith"
                autoComplete="name"
              />
              <FormInput
                id="referredPhone"
                name="referredPhone"
                label="Referred Person Phone"
                type="tel"
                required
                placeholder="(602) 555-0101"
                autoComplete="tel"
              />
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="referredEmail" className="text-sm font-semibold text-white/80">
                  Referred Person Email <span className="text-white/40">(optional)</span>
                </label>
                <input
                  id="referredEmail"
                  name="referredEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-semibold text-white/80">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Anything we should know before we contact them?"
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-white/15 bg-black/20 px-4 py-3">
              <input
                type="checkbox"
                name="consentAware"
                value="yes"
                required
                className="mt-1 h-4 w-4 rounded border-white/30 bg-black/20 text-[#FF8A3D] focus:ring-[#FF8A3D]"
              />
              <span className="text-sm text-white/75">
                I confirm the referred person is aware I am submitting their information.
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] px-6 py-3 text-base font-semibold text-white md:w-auto"
            >
              Submit a Referral
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <h2 className="text-3xl font-bold md:text-4xl">Terms &amp; Conditions</h2>
          <ul className="mt-6 space-y-3 text-white/80">
            {terms.map((term) => (
              <li key={term} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF8A3D]" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
