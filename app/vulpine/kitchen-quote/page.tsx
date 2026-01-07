// app/vulpine/kitchen-quote/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Testimonials from "./Testimonials";
import { FadeIn, SlideUp, StaggerContainer, ScaleOnHover } from "@/app/components/ui/Motion";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

export default function VulpineKitchenQuotePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    doors: "",
    drawers: "",
    hasIsland: false,
    notes: "",
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "email") {
      const email = value.trim();
      if (!email) {
        setEmailError("Email is required");
      } else if (!email.includes("@")) {
        setEmailError("Please enter a valid email (must include @).");
      } else {
        setEmailError(null);
      }
    }

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(-10) : digits;
      if (normalized.length === 10) {
        setPhoneError(null);
      } else {
        setPhoneError("Please enter a 10-digit phone number.");
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const MAX_FILES = 5;
    const MAX_SINGLE = 10 * 1024 * 1024;
    const MAX_TOTAL = 40 * 1024 * 1024;
    const ALLOWED = new Set(["image/jpeg", "image/png", "image/heic", "image/heif"]);

    if (files.length > MAX_FILES) {
      setPhotoError("You can upload up to 5 photos.");
      setPhotos([]);
      e.target.value = "";
      return;
    }

    if (files.some((f) => !ALLOWED.has(f.type))) {
      setPhotoError("Only JPEG, PNG, HEIC, HEIF images are allowed.");
      setPhotos([]);
      e.target.value = "";
      return;
    }

    if (files.some((f) => f.size > MAX_SINGLE)) {
      setPhotoError("Each photo must be 10MB or smaller.");
      setPhotos([]);
      e.target.value = "";
      return;
    }

    const total = files.reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_TOTAL) {
      setPhotoError("Total photo size must be 40MB or less.");
      setPhotos([]);
      e.target.value = "";
      return;
    }

    setPhotos(files);
    setPhotoError(null);
  };

  const phoneDigitsForValid = form.phone.replace(/\D/g, "");
  const normalizedPhoneForValid =
    phoneDigitsForValid.length === 11 && phoneDigitsForValid.startsWith("1")
      ? phoneDigitsForValid.slice(-10)
      : phoneDigitsForValid;
  const isPhoneValid = normalizedPhoneForValid.length === 10;
  const isEmailValid = !!form.email.trim() && form.email.includes("@");
  const canSubmit = isPhoneValid && isEmailValid && !photoError && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!form.email || !form.email.trim()) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }
    if (!form.email.includes("@")) {
      setEmailError("Please enter a valid email (must include @).");
      setLoading(false);
      return;
    }

    if (!form.phone || !form.phone.trim()) {
      setPhoneError("Please enter a 10-digit phone number.");
      setLoading(false);
      return;
    }
    const phoneDigits = form.phone.replace(/\D/g, "");
    const normalizedPhone = phoneDigits.length === 11 && phoneDigits.startsWith("1") ? phoneDigits.slice(-10) : phoneDigits;
    if (normalizedPhone.length !== 10) {
      setPhoneError("Please enter a 10-digit phone number.");
      setLoading(false);
      return;
    }

    if (photoError) {
      setLoading(false);
      return;
    }

    try {
      console.log("🚀 Submitting kitchen quote...");

      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "phone") {
          fd.append(key, String(value));
        }
      });
      fd.append("phone", normalizedPhone);

      if (photos.length) {
        photos.forEach((file, idx) => {
          fd.append(`photos_${idx}`, file);
          console.log(`📸 Adding photo ${idx}: ${file.name}`);
        });
      }

      console.log("📤 Sending request to /api/vulpine-kitchen-quote");

      const res = await fetch("/api/vulpine-kitchen-quote", {
        method: "POST",
        body: fd,
      });

      console.log("📥 Response status:", res.status);

      const data = await res.json();
      console.log("📥 Response data:", data);

      if (!res.ok || !data.success) {
        console.error("❌ Request failed:", data);
        // Avoid surfacing backend schema/pattern errors to users
        setError("We couldn't submit your request right now. Please try again in a minute.");
        return;
      }

      console.log("✅ Quote submitted successfully! ID:", data.id);

      // Show success message briefly, then redirect to homepage
      const successMessage = photos.length > 0
        ? "Success! We'll review your info and photos, then text you with your free quote."
        : "Success! We'll review your info and text you with your free quote.";

      setSuccess(successMessage);

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push("/?quote=success");
      }, 2000);
    } catch (err) {
      console.error("❌ Form submission error:", err);
      setError("We couldn't submit your request right now. Please try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white selection:bg-orange-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Logo */}
        <FadeIn className="flex justify-center">
          <img
            src="/logos/vulpines-official-logo.png"
            alt="Vulpine Cabinet Refacing"
            className="h-20 md:h-24 w-auto drop-shadow-2xl"
          />
        </FadeIn>

        {/* Hero */}
        <SlideUp className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Get Your Free Kitchen Quote
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Transform your kitchen in 3-5 days. Save 50-70% vs full replacement.
            <br />
            <span className="text-orange-400 font-semibold glow-text">No demolition. No mess. Just results.</span>
          </p>
        </SlideUp>

        {/* Easy as 1-2-3 */}
        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          <FadeIn className="group relative rounded-3xl bg-white/5 p-8 space-y-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/20">
              1
            </div>
            <h2 className="relative text-2xl font-bold text-white">Free Consultation</h2>
            <p className="relative text-gray-400 leading-relaxed">
              Our licensed technician visits your home with premium samples. We discuss your vision, show you materials in your lighting, and provide an accurate written quote.
            </p>
            <p className="relative text-orange-400 font-semibold text-sm tracking-wide uppercase">
              Zero pressure. Zero obligation.
            </p>
          </FadeIn>

          <FadeIn className="group relative rounded-3xl bg-white/5 p-8 space-y-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-white/10">
              2
            </div>
            <h2 className="relative text-2xl font-bold text-white">Expert Installation</h2>
            <div className="relative space-y-3">
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <p className="text-white font-semibold text-sm">Day 1 – Remove & Prep</p>
                <p className="text-gray-400 text-xs mt-1">Old doors removed, frames cleaned and prepped</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <p className="text-white font-semibold text-sm">Day 2 – Veneer & Finish</p>
                <p className="text-gray-400 text-xs mt-1">Premium veneer applied, custom finish installed</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <p className="text-white font-semibold text-sm">Day 3 – Doors & Hardware</p>
                <p className="text-gray-400 text-xs mt-1">New doors, soft-close hinges, premium hardware</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="group relative rounded-3xl bg-white/5 p-8 space-y-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/20">
              3
            </div>
            <h2 className="relative text-2xl font-bold text-white">Final Walkthrough</h2>
            <p className="relative text-gray-400 leading-relaxed">
              Our professional technician walks through every detail with you, addresses any concerns on the spot, and shows you how to maintain your beautiful new finish.
            </p>
            <p className="relative text-orange-400 font-semibold text-sm tracking-wide uppercase">
              Stunning results. No chaos.
            </p>
          </FadeIn>
        </StaggerContainer>

        {/* Testimonials */}
        <Testimonials />

        {/* Step wizard */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[2fr,1.2fr]">
          <SlideUp className="relative rounded-3xl bg-white/5 p-8 md:p-10 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Get Your Free Quote
              </h2>
              <div className="flex gap-3">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s as Step)}
                    className={cn(
                      "h-10 w-10 rounded-full font-bold transition-all duration-300 flex items-center justify-center",
                      step === s
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-110"
                        : "bg-white/5 text-gray-500 hover:bg-white/10"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {step === 1 && (
              <FadeIn className="space-y-6">
                <p className="text-gray-400 text-lg">
                  Step 1 of 3 – <span className="text-white font-semibold">Your Contact Information</span>
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Phone <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      placeholder="(555) 123-4567"
                    />
                    {phoneError && (
                      <p className="text-sm text-red-400 mt-1 ml-1">{phoneError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      placeholder="you@example.com"
                    />
                    {emailError && (
                      <p className="text-sm text-red-400 mt-1 ml-1">{emailError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Zip code
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      placeholder="Your zip code"
                    />
                  </div>
                </div>
                <ScaleOnHover className="mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-10 py-4 text-lg font-bold text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                  >
                    Next: Kitchen Details →
                  </button>
                </ScaleOnHover>
              </FadeIn>
            )}

            {step === 2 && (
              <FadeIn className="space-y-6">
                <p className="text-gray-400 text-lg">
                  Step 2 of 3 – <span className="text-white font-semibold">Kitchen Details</span>
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Cabinet Doors
                    </label>
                    <input
                      name="doors"
                      value={form.doors}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      placeholder="e.g. 18"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Drawers
                    </label>
                    <input
                      name="drawers"
                      value={form.drawers}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      placeholder="e.g. 6"
                    />
                  </div>
                  <div className="flex items-center gap-3 h-full pt-8">
                    <input
                      id="hasIsland"
                      type="checkbox"
                      name="hasIsland"
                      checked={form.hasIsland}
                      onChange={handleChange}
                      className="h-6 w-6 rounded border-gray-600 bg-black/20 text-orange-500 focus:ring-2 focus:ring-orange-500"
                    />
                    <label htmlFor="hasIsland" className="text-lg font-medium text-gray-300">
                      Has island?
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    placeholder="Any special details? (e.g., pantry doors, glass uppers, bathroom vanities)"
                  />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-white font-medium transition-colors px-4 py-2"
                  >
                    ← Back
                  </button>
                  <ScaleOnHover>
                    <button
                      onClick={() => setStep(3)}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-10 py-4 text-lg font-bold text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                    >
                      Next: Upload Photos →
                    </button>
                  </ScaleOnHover>
                </div>
              </FadeIn>
            )}

            {step === 3 && (
              <FadeIn className="space-y-6">
                <p className="text-gray-400 text-lg">
                  Step 3 of 3 – <span className="text-white font-semibold">Upload Photos</span>
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">
                    Kitchen Photos (Optional but Recommended)
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Clear photos help us provide a more accurate quote and plan your consultation.
                  </p>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/heic,image/heif"
                      multiple
                      onChange={handlePhotoChange}
                      className="relative w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-red-600 file:px-6 file:py-3 file:text-sm file:font-bold file:text-white hover:file:opacity-90 file:transition-all file:cursor-pointer bg-black/20 rounded-xl p-2 border border-white/10"
                    />
                    {photoError && (
                      <p className="text-sm text-red-400 mt-2 ml-1">{photoError}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="text-gray-400 hover:text-white font-medium transition-colors px-4 py-2"
                  >
                    ← Back
                  </button>
                  <ScaleOnHover>
                    <button
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-10 py-4 text-lg font-bold text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending…" : "Get My Free Quote →"}
                    </button>
                  </ScaleOnHover>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure SSL Data</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Fast Response</span>
                  </div>
                </div>

                {success && (
                  <FadeIn className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 mt-4 backdrop-blur-md">
                    <p className="text-green-400 font-medium text-center">{success}</p>
                  </FadeIn>
                )}
                {error && (
                  <FadeIn className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mt-4 backdrop-blur-md">
                    <p className="text-red-400 font-medium text-center">{error}</p>
                  </FadeIn>
                )}
              </FadeIn>
            )}
          </SlideUp>

          <SlideUp delay={0.2} className="h-fit rounded-3xl bg-white/5 p-8 space-y-6 border border-white/10 backdrop-blur-xl shadow-2xl">
            <h3 className="font-bold text-2xl text-white">
              What Happens Next?
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Quick Review</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    We analyze your door count and photos to estimate materials and labor costs.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Schedule Your Consultation</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    You'll receive a text or call from Vulpine to book your{" "}
                    <span className="text-orange-400 font-semibold">free in-home consultation</span>.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                  3
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Professional Assessment</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    Our licensed technician arrives with premium samples, confirms exact measurements, and provides your final quote.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm italic">
                <span className="text-orange-400 font-semibold not-italic">Zero spam. Zero pressure.</span>
                <br />
                If the quote doesn't work for you, keep the design ideas—no hard feelings.
              </p>
            </div>
          </SlideUp>
        </section>
      </section>
    </main>
  );
}

