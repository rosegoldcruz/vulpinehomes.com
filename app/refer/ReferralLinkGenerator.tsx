"use client";

import { useMemo, useState } from "react";

interface GeneratorResponse {
  code: string;
  shareUrl: string;
}

function buildSmsHref(url: string): string {
  const body = encodeURIComponent(
    `Vulpine Homes referral link: ${url}\nIf your cabinet refacing project is completed, I receive a $500 referral payout.`
  );
  return `sms:?&body=${body}`;
}

export default function ReferralLinkGenerator() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratorResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const qrUrl = useMemo(() => {
    if (!result?.shareUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      result.shareUrl
    )}`;
  }, [result?.shareUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCopied(false);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setError("Add a phone number or email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/referrals/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not create your referral link.");
        return;
      }

      setResult({
        code: data.code,
        shareUrl: data.shareUrl,
      });
    } catch (err) {
      console.error("Referral link creation failed", err);
      setError("Could not create your referral link.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!result?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(result.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy failed. Please copy the URL manually.");
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white">Create Your Referral Link</h2>
      <p className="mt-3 text-white/70">
        Generate your personal referral URL and share it by text, QR, or direct link.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/80" htmlFor="generator-name">
            Name *
          </label>
          <input
            id="generator-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/80" htmlFor="generator-phone">
            Phone
          </label>
          <input
            id="generator-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(480) 555-0123"
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/80" htmlFor="generator-email">
            Email
          </label>
          <input
            id="generator-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Link..." : "Create Referral Link"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-sm uppercase tracking-wide text-white/60">Referral Code</p>
            <p className="text-xl font-semibold text-white">{result.code}</p>
            <p className="text-sm uppercase tracking-wide text-white/60">Share URL</p>
            <p className="break-all text-sm text-white/90">{result.shareUrl}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:border-[#FF8A3D]"
              >
                {copied ? "Copied" : "Copy Link"}
              </button>
              <a
                href={buildSmsHref(result.shareUrl)}
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:border-[#FF8A3D]"
              >
                Share by SMS
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <img
              src={qrUrl}
              alt="Referral link QR code"
              width={220}
              height={220}
              className="h-[220px] w-[220px] rounded-lg bg-white p-2"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
