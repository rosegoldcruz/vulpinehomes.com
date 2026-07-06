// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\lib\telegram.ts
// lib/telegram.ts

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
  void params;
  return { status: "skipped", reason: "disabled" };
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
  void params;
  return { status: "skipped", reason: "disabled" };
}
