import { NextRequest, NextResponse } from "next/server";
import { clearAdminReferralsCookie, sanitizeReturnTo } from "@/lib/adminReferralsAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const url = new URL(returnTo, req.url);
  const res = NextResponse.redirect(url, 303);
  clearAdminReferralsCookie(res);
  return res;
}
