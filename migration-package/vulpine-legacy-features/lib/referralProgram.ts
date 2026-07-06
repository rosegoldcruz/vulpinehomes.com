import { randomBytes } from "crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envUrl) return "https://www.vulpinehomes.com";
  return envUrl.replace(/\/+$/, "");
}

export function normalizeReferralCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim();
  if (!normalized) return null;
  if (!/^[A-Za-z0-9_-]{6,32}$/.test(normalized)) return null;
  return normalized;
}

export function generateReferralCode(length = 9): string {
  const bytes = randomBytes(length);
  let output = "";

  for (let i = 0; i < length; i += 1) {
    output += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }

  return output;
}

export function buildShareUrl(code: string): string {
  const base = getSiteUrl();
  const encoded = encodeURIComponent(code);
  return `${base}/r/${encoded}?utm_source=referral&utm_medium=link&utm_campaign=500_referral`;
}
