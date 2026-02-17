import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import {
  createAffiliateSessionToken,
  isAffiliateSessionConfigured,
  sanitizeAffiliateReturnTo,
  setAffiliateSessionCookie,
} from "@/lib/affiliateAuth";
import { ensureActiveCodeForReferrer, ensureReferrerForEmail } from "@/lib/affiliatePortal";
import { createSupabaseAuthClient, hasSupabaseAuthConfig } from "@/lib/supabaseAuthClient";

export const runtime = "nodejs";

function toLoginError(req: NextRequest, code: string, next: string): NextResponse {
  const url = new URL("/affiliate/login", req.url);
  url.searchParams.set("error", code);
  url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

export async function GET(req: NextRequest) {
  const next = sanitizeAffiliateReturnTo(req.nextUrl.searchParams.get("next"));
  const code = req.nextUrl.searchParams.get("code");
  const tokenHash = req.nextUrl.searchParams.get("token_hash");
  const otpType = req.nextUrl.searchParams.get("type");

  if (!hasSupabaseAuthConfig()) {
    return toLoginError(req, "config", next);
  }

  if (!isAffiliateSessionConfigured()) {
    return toLoginError(req, "session", next);
  }

  const supabaseAuth = createSupabaseAuthClient();
  let authEmail: string | null = null;

  if (code) {
    const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Affiliate auth code exchange failed:", error);
      return toLoginError(req, "link", next);
    }
    authEmail = data?.user?.email || data?.session?.user?.email || null;
  } else if (tokenHash && otpType) {
    const { data, error } = await supabaseAuth.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType as EmailOtpType,
    });
    if (error) {
      console.error("Affiliate OTP verification failed:", error);
      return toLoginError(req, "link", next);
    }
    authEmail = data?.user?.email || data?.session?.user?.email || null;
  } else {
    return toLoginError(req, "link", next);
  }

  if (!authEmail) {
    return toLoginError(req, "link", next);
  }

  try {
    const normalizedEmail = authEmail.trim().toLowerCase();
    const referrer = await ensureReferrerForEmail(normalizedEmail);
    await ensureActiveCodeForReferrer(referrer.id);

    const sessionToken = createAffiliateSessionToken({
      email: normalizedEmail,
      referrerId: referrer.id,
    });

    if (!sessionToken) {
      return toLoginError(req, "session", next);
    }

    const destination = new URL(next, req.url);
    const res = NextResponse.redirect(destination, 303);
    setAffiliateSessionCookie(res, sessionToken);
    return res;
  } catch (error) {
    console.error("Affiliate callback failed:", error);
    return toLoginError(req, "server", next);
  }
}

