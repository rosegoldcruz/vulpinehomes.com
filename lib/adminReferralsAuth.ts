import { createHash } from "crypto";
import type { NextResponse } from "next/server";

export const ADMIN_REFERRALS_COOKIE = "vh_admin_referrals";

export function getAdminReferralsPassword(): string {
  return process.env.ADMIN_REFERRALS_PASSWORD?.trim() || "";
}

export function getAdminReferralsToken(): string {
  const password = getAdminReferralsPassword();
  if (!password) return "";
  return createHash("sha256").update(`v1:${password}`).digest("hex");
}

export function isAdminReferralsAuthenticated(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const expected = getAdminReferralsToken();
  if (!expected) return false;
  return cookieValue === expected;
}

export function setAdminReferralsCookie(res: NextResponse): void {
  const token = getAdminReferralsToken();
  if (!token) return;
  res.cookies.set({
    name: ADMIN_REFERRALS_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearAdminReferralsCookie(res: NextResponse): void {
  res.cookies.set({
    name: ADMIN_REFERRALS_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export function sanitizeReturnTo(value: string | null | undefined): string {
  if (!value) return "/admin/referrals";
  if (!value.startsWith("/admin/referrals")) return "/admin/referrals";
  return value;
}
