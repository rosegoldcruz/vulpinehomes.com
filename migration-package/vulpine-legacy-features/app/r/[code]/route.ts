import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { normalizeReferralCode } from "@/lib/referralProgram";

const REFERRAL_COOKIE = "vh_referral_code";
const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function GET(
  req: NextRequest,
  context: { params: { code: string } }
) {
  const rawCode = context.params?.code;
  const code = normalizeReferralCode(rawCode);

  const destination = new URL("/vulpine/kitchen-quote", req.url);
  req.nextUrl.searchParams.forEach((value, key) => {
    destination.searchParams.set(key, value);
  });

  if (!code) {
    destination.searchParams.set("ref", "invalid");
    return NextResponse.redirect(destination, 307);
  }

  const { data } = await supabaseServer
    .from("referral_codes")
    .select("code, active")
    .eq("code", code)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (!data?.code) {
    destination.searchParams.set("ref", "invalid");
    return NextResponse.redirect(destination, 307);
  }

  const { error: clickError } = await supabaseServer.from("referral_clicks").insert({
    code: data.code,
  });
  if (clickError) {
    console.warn("Failed to persist referral click:", clickError);
  }

  const res = NextResponse.redirect(destination, 307);
  res.cookies.set({
    name: REFERRAL_COOKIE,
    value: data.code,
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return res;
}
