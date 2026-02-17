import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isAffiliateSessionConfigured,
  readAffiliateSessionFromCookies,
  sanitizeAffiliateReturnTo,
} from "@/lib/affiliateAuth";
import { hasSupabaseAuthConfig } from "@/lib/supabaseAuthClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Login | Vulpine Homes",
  description: "Affiliate portal magic link login for Vulpine Homes referral partners.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginSearchParams = {
  sent?: string;
  error?: string;
  email?: string;
  next?: string;
};

function errorMessage(code: string | undefined): string | null {
  if (!code) return null;
  if (code === "email") return "Enter a valid email address.";
  if (code === "send") return "We could not send your magic link. Please try again.";
  if (code === "rate") return "Too many attempts. Please wait and try again.";
  if (code === "link") return "Your magic link is invalid or expired. Request a new link.";
  if (code === "config") return "Affiliate login is not configured yet. Contact support.";
  if (code === "session") return "Affiliate session configuration is missing. Contact support.";
  if (code === "server") return "We could not complete sign in. Please retry.";
  return "Unable to sign in right now. Please try again.";
}

export default function AffiliateLoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  const cookieStore = cookies();
  const session = readAffiliateSessionFromCookies(cookieStore);
  const next = sanitizeAffiliateReturnTo(searchParams.next);
  const isConfigured = hasSupabaseAuthConfig() && isAffiliateSessionConfigured();

  if (session) {
    redirect(next || "/affiliate");
  }

  const error = errorMessage(searchParams.error);
  const sent = searchParams.sent === "1";

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20 text-white">
      <section className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF8A3D]">
            Affiliate Portal
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Magic Link Sign In</h1>
          <p className="mt-3 text-white/70">
            Enter your email to receive a secure sign-in link for your affiliate dashboard.
          </p>

          {!isConfigured ? (
            <p className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Affiliate auth is not configured. Set Supabase auth vars and `AFFILIATE_SESSION_SECRET`.
            </p>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {sent ? (
            <p className="mt-5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Magic link sent to {searchParams.email || "your inbox"}. Open that email to continue.
            </p>
          ) : null}

          <form action="/api/affiliate/login/request" method="post" className="mt-6 space-y-4">
            <input type="hidden" name="returnTo" value={next} />
            <div className="space-y-2">
              <label htmlFor="affiliate-email" className="text-sm font-semibold text-white/80">
                Email
              </label>
              <input
                id="affiliate-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
              />
            </div>
            <button
              type="submit"
              disabled={!isConfigured}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Email My Magic Link
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

