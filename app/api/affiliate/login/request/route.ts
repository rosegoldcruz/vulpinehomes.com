import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/phoneNormalizer";
import { getSiteUrl } from "@/lib/referralProgram";
import { checkRateLimit, getRequestIp } from "@/lib/requestRateLimit";
import { sanitizeAffiliateReturnTo } from "@/lib/affiliateAuth";
import { createSupabaseAuthClient, hasSupabaseAuthConfig } from "@/lib/supabaseAuthClient";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const rate = checkRateLimit({
    scope: "affiliate-login-request",
    key: ip,
    windowMs: 15 * 60 * 1000,
    maxRequests: 8,
    blockMs: 30 * 60 * 1000,
  });

  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const returnTo = sanitizeAffiliateReturnTo(
    String(formData.get("returnTo") || "/affiliate")
  );

  const failUrl = new URL("/affiliate/login", req.url);
  failUrl.searchParams.set("next", returnTo);

  if (!rate.allowed) {
    failUrl.searchParams.set("error", "rate");
    return NextResponse.redirect(failUrl, 303);
  }

  if (!isValidEmail(email)) {
    failUrl.searchParams.set("error", "email");
    return NextResponse.redirect(failUrl, 303);
  }

  if (!hasSupabaseAuthConfig()) {
    failUrl.searchParams.set("error", "config");
    return NextResponse.redirect(failUrl, 303);
  }

  const callbackUrl = `${getSiteUrl()}/affiliate/login/callback?next=${encodeURIComponent(
    returnTo
  )}`;

  const supabaseAuth = createSupabaseAuthClient();
  const { error } = await supabaseAuth.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    console.error("Affiliate magic link request failed:", error);
    failUrl.searchParams.set("error", "send");
    return NextResponse.redirect(failUrl, 303);
  }

  const successUrl = new URL("/affiliate/login", req.url);
  successUrl.searchParams.set("sent", "1");
  successUrl.searchParams.set("email", email);
  successUrl.searchParams.set("next", returnTo);
  return NextResponse.redirect(successUrl, 303);
}

