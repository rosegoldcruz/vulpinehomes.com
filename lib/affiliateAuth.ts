import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

export const AFFILIATE_SESSION_COOKIE = "vh_affiliate_session";

export type AffiliateSession = {
  email: string;
  referrerId: string;
  exp: number;
};

function getAffiliateSessionSecret(): string {
  return process.env.AFFILIATE_SESSION_SECRET?.trim() || "";
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function sign(payloadBase64: string): string {
  const secret = getAffiliateSessionSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

export function isAffiliateSessionConfigured(): boolean {
  return Boolean(getAffiliateSessionSecret());
}

export function createAffiliateSessionToken(params: {
  email: string;
  referrerId: string;
  ttlSeconds?: number;
}): string {
  const ttlSeconds = params.ttlSeconds || 60 * 60 * 24 * 14;
  const payload: AffiliateSession = {
    email: params.email.toLowerCase().trim(),
    referrerId: params.referrerId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));
  const signature = sign(payloadBase64);
  if (!signature) return "";
  return `${payloadBase64}.${signature}`;
}

export function readAffiliateSessionFromToken(
  token: string | undefined
): AffiliateSession | null {
  const secret = getAffiliateSessionSecret();
  if (!secret || !token) return null;

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) return null;

  const expected = sign(payloadBase64);
  if (!expected) return null;

  try {
    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const raw = decodeBase64Url(payloadBase64);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AffiliateSession;
    if (!parsed?.email || !parsed?.referrerId || !parsed?.exp) return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      email: parsed.email.toLowerCase(),
      referrerId: parsed.referrerId,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function readAffiliateSessionFromCookies(
  cookieStore: CookieStore
): AffiliateSession | null {
  const token = cookieStore.get(AFFILIATE_SESSION_COOKIE)?.value;
  return readAffiliateSessionFromToken(token);
}

export function setAffiliateSessionCookie(res: NextResponse, token: string): void {
  if (!token) return;
  res.cookies.set({
    name: AFFILIATE_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearAffiliateSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: AFFILIATE_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export function sanitizeAffiliateReturnTo(value: string | null | undefined): string {
  if (!value) return "/affiliate";
  if (!value.startsWith("/affiliate")) return "/affiliate";
  return value;
}
type CookieStore = {
  get(name: string): { value: string } | undefined;
};

