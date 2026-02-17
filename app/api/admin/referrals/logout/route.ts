import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_REFERRALS_COOKIE,
  clearAdminReferralsCookie,
  isAdminReferralsAuthenticated,
  sanitizeReturnTo,
} from "@/lib/adminReferralsAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_REFERRALS_COOKIE)?.value;
  if (!isAdminReferralsAuthenticated(token)) {
    return NextResponse.redirect(new URL("/admin/referrals?auth=error", req.url), 303);
  }

  const formData = await req.formData();
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const url = new URL(returnTo, req.url);
  const res = NextResponse.redirect(url, 303);
  clearAdminReferralsCookie(res);
  return res;
}
