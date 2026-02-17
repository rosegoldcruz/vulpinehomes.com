import { NextRequest, NextResponse } from "next/server";
import {
  getAdminReferralsPassword,
  sanitizeReturnTo,
  setAdminReferralsCookie,
} from "@/lib/adminReferralsAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = String(formData.get("password") || "");
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const expected = getAdminReferralsPassword();

  if (!expected || password !== expected) {
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
