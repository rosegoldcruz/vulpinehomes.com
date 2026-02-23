// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\lib\telegram.ts
// lib/telegram.ts

import type { NextRequest } from "next/server";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  process.env.TELEGRAM_API_TOKEN ||
  process.env.TELEGRAM_BOT_API_KEY ||
  "";

const CHAT_ID =
  process.env.TELEGRAM_CHAT_ID ||
  process.env.TELEGRAM_TO_CHAT_ID ||
  "";

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn(
    "Telegram environment variables not fully configured (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID). Lead alerts will be skipped.",
  );
}

export interface TelegramLeadParams {
  name: string | null;
  phone: string | null;
  city: string | null;
  doors: number | null;
  drawers: number | null;
  hasIsland: boolean;
  photoCount: number;
  photoUrls?: string[];
  originalUrls?: string[];
  afterUrls?: string[];
  style?: string | null;
  color?: string | null;
  hardware?: string | null;
  source?: string | null;
}

export type TelegramResult = {
  status: "sent" | "skipped" | "failed";
  reason: "ok" | "missing_env" | "http_401" | "http_403" | "http_429" | "exception" | string;
};

export async function sendLeadTelegramMessage(params: TelegramLeadParams): Promise<TelegramResult> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram not configured, skipping lead alert");
    return { status: "skipped", reason: "missing_env" };
  }

  const {
    name,
    phone,
    city,
    doors,
    drawers,
    hasIsland,
    photoCount,
    photoUrls,
    originalUrls,
    afterUrls,
    style,
    color,
    hardware,
    source,
  } = params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const formatUrls = (urls: string[] | undefined, defaultBucket = "visualizations") => {
    if (!urls || urls.length === 0) return null;
    return urls
      .map((p) => {
        // If already a full URL, use as-is
        const isAbsolute = /^https?:\/\//i.test(p);
        if (isAbsolute) return p;
        // Otherwise construct URL with default bucket
        if (supabaseUrl) {
          return `${supabaseUrl}/storage/v1/object/public/${defaultBucket}/${p}`;
        }
        return p;
      })
      .join("\n");
  };

  const originalLinks = formatUrls(originalUrls);
  const afterLinks = formatUrls(afterUrls);
  const photoLinks = formatUrls(photoUrls);

  // Determine header based on source
  const isQuoteLead = source?.includes("kitchen_quote") || source?.includes("landing");
  const header = isQuoteLead 
    ? "💰 NEW QUOTE REQUEST" 
    : "🏠 NEW VISUALIZER LEAD";

  const lines = [
    header,
    "",
    `Source: ${source || "N/A"}`,
    "",
    `Name: ${name || "N/A"}`,
    `Phone: ${phone || "N/A"}`,
    `City/Zip: ${city || "N/A"}`,
  ];

  // Only show style/color/hardware for visualizer leads
  if (!isQuoteLead) {
    lines.push(
      "",
      `Style: ${style || "N/A"}`,
      `Color: ${color || "N/A"}`,
      `Hardware: ${hardware || "N/A"}`
    );
  }

  lines.push(
    "",
    `Doors: ${doors ?? "N/A"}`,
    `Drawers: ${drawers ?? "N/A"}`,
    `Island: ${hasIsland ? "Yes" : "No"}`,
    `Photos: ${photoCount}`
  );

  if (originalLinks) {
    lines.push("", "📷 BEFORE (Original):", originalLinks);
  }

  if (afterLinks) {
    lines.push("", "✨ AFTER (Transformed):", afterLinks);
  }

  if (photoLinks && !originalLinks && !afterLinks) {
    lines.push("", "Photos:", photoLinks);
  }

  const text = lines.join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Failed to send Telegram lead message", res.status, body);
      return { status: "failed", reason: `http_${res.status}` };
    } else {
      console.log("Telegram lead message sent");
      return { status: "sent", reason: "ok" };
    }
  } catch (err) {
    console.error("Error sending Telegram lead message:", err);
    return { status: "failed", reason: "exception" };
  }
}

export interface TelegramReferralParams {
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  referredName: string;
  referredPhone: string;
  referredEmail?: string | null;
  city: string;
  notes?: string | null;
}

export async function sendReferralTelegramMessage(params: TelegramReferralParams): Promise<TelegramResult> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram not configured, skipping referral alert");
    return { status: "skipped", reason: "missing_env" };
  }

  const {
    referrerName,
    referrerEmail,
    referrerPhone,
    referredName,
    referredPhone,
    referredEmail,
    city,
    notes,
  } = params;

  const lines = [
    "🤝 NEW REFERRAL SUBMISSION",
    "",
    "Program: $500 Cabinet Refacing Referral",
    "",
    `Referrer: ${referrerName}`,
    `Referrer Email: ${referrerEmail}`,
    `Referrer Phone: ${referrerPhone}`,
    "",
    `Referred Person: ${referredName}`,
    `Referred Phone: ${referredPhone}`,
    `Referred Email: ${referredEmail || "N/A"}`,
    `City: ${city}`,
  ];

  if (notes) {
    lines.push("", `Notes: ${notes}`);
  }

  const text = lines.join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Failed to send Telegram referral message", res.status, body);
      return { status: "failed", reason: `http_${res.status}` };
    } else {
      console.log("Telegram referral message sent");
      return { status: "sent", reason: "ok" };
    }
  } catch (err) {
    console.error("Error sending Telegram referral message:", err);
    return { status: "failed", reason: "exception" };
  }
}
