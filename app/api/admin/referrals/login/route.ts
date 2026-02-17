import { NextRequest, NextResponse } from "next/server";
import {
  getAdminReferralsPassword,
  sanitizeReturnTo,
  setAdminReferralsCookie,
} from "@/lib/adminReferralsAuth";
import { checkRateLimit, getRequestIp } from "@/lib/requestRateLimit";

export const runtime = "nodejs";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const rate = checkRateLimit({
    scope: "admin-referrals-login",
    key: ip,
    windowMs: 15 * 60 * 1000,
    maxRequests: 6,
    blockMs: 30 * 60 * 1000,
  });

  if (!rate.allowed) {
    await wait(800);
    const url = new URL("/admin/referrals", req.url);
    url.searchParams.set("auth", "error");
    return NextResponse.redirect(url, 303);
  }

  const formData = await req.formData();
  const password = String(formData.get("password") || "");
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const expected = getAdminReferralsPassword();

  if (!expected || password !== expected) {
    await wait(800);
    const url = new URL(returnTo, req.url);
    url.searchParams.set("auth", "error");
    return NextResponse.redirect(url, 303);
  }

  const url = new URL(returnTo, req.url);
  url.searchParams.delete("auth");
  const res = NextResponse.redirect(url, 303);
  setAdminReferralsCookie(res);
  return res;
}
