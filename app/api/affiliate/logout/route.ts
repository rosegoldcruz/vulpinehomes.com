import { NextRequest, NextResponse } from "next/server";
import { clearAffiliateSessionCookie, sanitizeAffiliateReturnTo } from "@/lib/affiliateAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const returnTo = sanitizeAffiliateReturnTo(
    String(formData.get("returnTo") || "/affiliate/login")
  );
  const url = new URL(returnTo, req.url);
  const res = NextResponse.redirect(url, 303);
  clearAffiliateSessionCookie(res);
  return res;
}

