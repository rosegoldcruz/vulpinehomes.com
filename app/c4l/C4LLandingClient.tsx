"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const CAMPAIGN_ID = "C4L_TEMPE_21D";
const ADDRESS_LINE = "ADDRESS_LINE";
const CITY_STATE_ZIP = "TEMPE, AZ, ZIP";
const STORE_HOURS = "Store Hours (placeholder)";
const PARKING_NOTE = "Parking Note (placeholder)";
const HEAR_OPTIONS = ["Vulpine Homes Ad", "Facebook", "Google", "Walk-in"] as const;

type Props = {
  socialProofImages: string[];
};

type FormState = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  preferred_day: string;
  preferred_time: string;
  notes: string;
  how_did_you_hear_about_us: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  campaign_id: string;
};

const INITIAL_FORM: FormState = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  preferred_day: "",
  preferred_time: "",
  notes: "",
  how_did_you_hear_about_us: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  campaign_id: CAMPAIGN_ID,
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function InputField(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, className, ...rest } = props;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/90">{label}</span>
      <input
        {...rest}
        className={[
          "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40",
          "outline-none ring-0 transition focus:border-[#FF8A3D]/70 focus:bg-white/10",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </label>
  );
}

export default function C4LLandingClient({ socialProofImages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      utm_source: searchParams.get("utm_source") || "",
      utm_medium: searchParams.get("utm_medium") || "",
      utm_campaign: searchParams.get("utm_campaign") || "",
      utm_content: searchParams.get("utm_content") || "",
      utm_term: searchParams.get("utm_term") || "",
      campaign_id: CAMPAIGN_ID,
    }));
  }, [searchParams]);

  const mapsUrl = useMemo(() => {
    const q = encodeURIComponent(`${ADDRESS_LINE}, ${CITY_STATE_ZIP}`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }, []);

  const onChange = (
    key: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/c4l-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unable to submit your appointment request.");
      }

      setSuccessMessage("Appointment request submitted. Redirecting...");
      router.push("/thank-you");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur">
        <p className="mx-auto max-w-7xl px-4 py-3 text-center text-xs font-semibold tracking-wide text-white/90 sm:text-sm">
          In partnership with Cabinets4Less – Tempe Showroom (Powered by Vulpine Homes)
        </p>
      </div>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,138,61,0.18),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(255,107,53,0.16),transparent_40%),linear-gradient(to_bottom,#0a0a0f,#0d0d14)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8">
          <div className="self-start">
            <div className="mb-4 inline-flex items-center rounded-full border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB347]">
              Tempe Showroom Promo
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Tempe Homeowners: Save on New Kitchen Cabinets
            </h1>
            <p className="mt-4 text-lg text-white/85 sm:text-xl">
              In-Store Design Appointments at Cabinets4Less – Powered by Vulpine Homes
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Meet with Daniel Cruz for a fast, in-showroom cabinet layout and same-day quote.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "30-minute design sessions",
                "High-volume pricing",
                "Transparent estimates",
                "Limited showroom promo",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-xs font-bold text-[#0a0a0f]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => scrollToId("booking-form")}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] px-5 py-3 text-sm font-semibold text-[#0a0a0f] shadow-lg shadow-orange-500/20 transition hover:brightness-110"
              >
                Book Your Showroom Appointment
              </button>
              <button
                type="button"
                onClick={() => scrollToId("location")}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get Showroom Address
              </button>
            </div>
          </div>

          <div
            id="booking-form"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Book Your Showroom Appointment</h2>
              <p className="mt-1 text-sm text-white/65">
                Fast form. We&apos;ll reach out to confirm your time.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="First Name"
                  value={form.first_name}
                  onChange={(e) => onChange("first_name", e.target.value)}
                  required
                  autoComplete="given-name"
                />
                <InputField
                  label="Last Name"
                  value={form.last_name}
                  onChange={(e) => onChange("last_name", e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  required
                  autoComplete="tel"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Preferred Day"
                  value={form.preferred_day}
                  onChange={(e) => onChange("preferred_day", e.target.value)}
                  required
                  placeholder="e.g. Tuesday"
                />
                <InputField
                  label="Preferred Time"
                  value={form.preferred_time}
                  onChange={(e) => onChange("preferred_time", e.target.value)}
                  required
                  placeholder="e.g. 2:00 PM"
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/90">
                  How did you hear about us?
                </span>
                <select
                  value={form.how_did_you_hear_about_us}
                  onChange={(e) => onChange("how_did_you_hear_about_us", e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/15 bg-[#12121a] px-4 py-3 text-white outline-none transition focus:border-[#FF8A3D]/70"
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {HEAR_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/90">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => onChange("notes", e.target.value)}
                  rows={4}
                  required
                  placeholder="Project goals, timing, or anything Daniel should know."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#FF8A3D]/70 focus:bg-white/10"
                />
              </label>

              <input type="hidden" name="utm_source" value={form.utm_source} readOnly />
              <input type="hidden" name="utm_medium" value={form.utm_medium} readOnly />
              <input type="hidden" name="utm_campaign" value={form.utm_campaign} readOnly />
              <input type="hidden" name="utm_content" value={form.utm_content} readOnly />
              <input type="hidden" name="utm_term" value={form.utm_term} readOnly />
              <input type="hidden" name="campaign_id" value={form.campaign_id} readOnly />

              {errorMessage ? (
                <p className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] px-5 py-3 text-sm font-semibold text-[#0a0a0f] shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Book Your Showroom Appointment"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0d14]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">What Is Vulpine Homes?</h2>
            <p className="mt-4 max-w-3xl text-white/75">
              Vulpine Homes partners with local showrooms to help homeowners move faster from idea to installed kitchen. For the next 3 weeks, I’m booking private design sessions inside the Cabinets4Less Tempe showroom. You’ll review real samples and walk out with numbers.
            </p>
            <button
              type="button"
              onClick={() => scrollToId("booking-form")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] px-5 py-3 text-sm font-semibold text-[#0a0a0f]"
            >
              Reserve Your Slot This Week
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a0a0f]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">What Happens When You Come In</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Bring rough measurements (or we’ll guide you).",
              "We design your layout live in-store.",
              "You get clear pricing before you leave.",
            ].map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF8A3D]/20 text-sm font-bold text-[#FFB347]">
                  {index + 1}
                </div>
                <p className="text-white/90">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-white/65">Most appointments take 30–45 minutes.</p>
        </div>
      </section>

      <section id="location" className="border-b border-white/10 bg-[#0d0d14]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Tempe Showroom Location</h2>
              <div className="mt-5 space-y-3 text-white/80">
                <p>{ADDRESS_LINE}</p>
                <p>{CITY_STATE_ZIP}</p>
                <p>{STORE_HOURS}</p>
                <p>{PARKING_NOTE}</p>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a0a0f]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Designed by Daniel Cruz – Vulpine Homes</h2>

          {socialProofImages.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {socialProofImages.map((src, index) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <Image
                    src={src}
                    alt={`Cabinet project example ${index + 1}`}
                    width={1200}
                    height={900}
                    className="h-40 w-full object-cover sm:h-52"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/60">Placeholder testimonial</p>
                <p className="mt-2 text-white/85">
                  “Placeholder: The showroom appointment made cabinet pricing simple and fast.”
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/60">Placeholder testimonial</p>
                <p className="mt-2 text-white/85">
                  “Placeholder: We saw samples in person, got a layout, and left with a clear quote.”
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#0d0d14]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-4xl">Spots Are Limited Before Transfer</h2>
          <p className="mt-4 text-white/75">
            I’m only in the Tempe showroom for a short window. If you’re considering new cabinets this year, now’s the time to lock in pricing.
          </p>
          <button
            type="button"
            onClick={() => scrollToId("booking-form")}
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#FFB347] px-6 py-3 text-sm font-semibold text-[#0a0a0f] shadow-lg shadow-orange-500/20"
          >
            Book Your Showroom Design Session
          </button>
        </div>
      </section>
    </main>
  );
}
