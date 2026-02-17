import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { isValidEmail, normalizePhone } from "@/lib/phoneNormalizer";
import { normalizeReferralCode } from "@/lib/referralProgram";
import { sendReferralTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";

interface ReferralPayload {
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  referredName: string;
  referredPhone: string;
  referredEmail: string | null;
  city: string;
  notes: string | null;
}

function sanitizeText(value: FormDataEntryValue | null, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function normalizeUsPhone(value: string): string | null {
  const digitsOnly = normalizePhone(value);
  if (!digitsOnly) return null;
  if (digitsOnly.length === 10) return digitsOnly;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) return digitsOnly.slice(1);
  return null;
}

function hashLower(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function redirectToRefer(req: NextRequest, hash: string): NextResponse {
  const url = new URL("/refer", req.url);
  url.hash = hash;
  return NextResponse.redirect(url, 303);
}

async function trackGa4Lead(city: string) {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_ID ||
    "";
  const apiSecret = process.env.GA4_API_SECRET || process.env.GA_API_SECRET || "";

  if (!measurementId || !apiSecret) return;

  const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
    measurementId
  )}&api_secret=${encodeURIComponent(apiSecret)}`;

  const body = {
    client_id: `server.${Date.now()}.${Math.floor(Math.random() * 1_000_000)}`,
    events: [
      {
        name: "generate_lead",
        params: {
          lead_source: "referral_program",
          lead_type: "cabinet_refacing_referral",
          city,
          value: 500,
          currency: "USD",
          engagement_time_msec: 1,
        },
      },
    ],
  };

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function trackMetaLead(params: {
  req: NextRequest;
  referrerEmail: string;
  referrerPhone: string;
  referrerName: string;
  city: string;
}) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || process.env.META_PIXEL_ID || "";
  const accessToken =
    process.env.META_CONVERSIONS_API_TOKEN || process.env.FB_CONVERSIONS_API_TOKEN || "";

  if (!pixelId || !accessToken) return;

  const [firstName = "", ...rest] = params.referrerName.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const forwardedFor = params.req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;
  const userAgent = params.req.headers.get("user-agent") || undefined;

  const event = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: `referral_${randomUUID()}`,
    action_source: "website",
    event_source_url: "https://vulpinehomes.com/refer",
    user_data: {
      em: [hashLower(params.referrerEmail)],
      ph: [hashLower(`1${params.referrerPhone}`)],
      fn: firstName ? [hashLower(firstName)] : undefined,
      ln: lastName ? [hashLower(lastName)] : undefined,
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    },
    custom_data: {
      value: 500,
      currency: "USD",
      lead_source: "referral_program",
      city: params.city,
    },
  };

  const body: Record<string, unknown> = { data: [event] };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  const endpoint = `https://graph.facebook.com/v19.0/${encodeURIComponent(
    pixelId
  )}/events?access_token=${encodeURIComponent(accessToken)}`;

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function resolveActiveReferralCode(rawCode: string | null): Promise<string | null> {
  const normalized = normalizeReferralCode(rawCode);
  if (!normalized) return null;

  const { data } = await supabaseServer
    .from("referral_codes")
    .select("code")
    .eq("code", normalized)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  return data?.code || null;
}

async function persistReferral(payload: ReferralPayload, referralCode: string | null) {
  const { error: leadsError } = await supabaseServer.from("leads").insert({
    name: payload.referredName,
    phone: payload.referredPhone,
    email: payload.referredEmail,
    city: payload.city,
    notes: payload.notes,
    source: "referral_program",
    referral_code: referralCode,
    status: "new",
  });

  if (leadsError) {
    throw leadsError;
  }

  const summary = [
    "Referral Program Submission",
    `Referrer Name: ${payload.referrerName}`,
    `Referrer Email: ${payload.referrerEmail}`,
    `Referrer Phone: ${payload.referrerPhone}`,
    `Referred Name: ${payload.referredName}`,
    `Referred Phone: ${payload.referredPhone}`,
    `Referred Email: ${payload.referredEmail || "N/A"}`,
    `City: ${payload.city}`,
    `Consent Confirmed: Yes`,
    payload.notes ? `Notes: ${payload.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabaseServer.from("kitchen_quotes").insert({
    full_name: payload.referrerName,
    phone: payload.referrerPhone,
    email: payload.referrerEmail,
    city: payload.city,
    notes: referralCode ? `${summary}\nReferral Code: ${referralCode}` : summary,
    status: "new",
    source: "referral_program",
  });

  if (error) {
    console.warn("Referral mirror insert into kitchen_quotes failed:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const payload: ReferralPayload = {
      referrerName: sanitizeText(formData.get("referrerName"), 120),
      referrerEmail: sanitizeText(formData.get("referrerEmail"), 160).toLowerCase(),
      referrerPhone: sanitizeText(formData.get("referrerPhone"), 30),
      referredName: sanitizeText(formData.get("referredName"), 120),
      referredPhone: sanitizeText(formData.get("referredPhone"), 30),
      referredEmail: sanitizeText(formData.get("referredEmail"), 160).toLowerCase() || null,
      city: sanitizeText(formData.get("city"), 100),
      notes: sanitizeText(formData.get("notes"), 2000) || null,
    };

    const explicitReferralCode = sanitizeText(formData.get("referralCode"), 32);
    const cookieReferralCode = req.cookies.get("vh_referral_code")?.value || null;
    const referralCode = await resolveActiveReferralCode(explicitReferralCode || cookieReferralCode);

    const consent = formData.get("consentAware");

    if (
      !payload.referrerName ||
      !payload.referrerEmail ||
      !payload.referrerPhone ||
      !payload.referredName ||
      !payload.referredPhone ||
      !payload.city
    ) {
      return redirectToRefer(req, "referral-error");
    }

    if (consent !== "yes") {
      return redirectToRefer(req, "referral-error");
    }

    if (!isValidEmail(payload.referrerEmail)) {
      return redirectToRefer(req, "referral-error");
    }

    if (payload.referredEmail && !isValidEmail(payload.referredEmail)) {
      return redirectToRefer(req, "referral-error");
    }

    const normalizedReferrerPhone = normalizeUsPhone(payload.referrerPhone);
    const normalizedReferredPhone = normalizeUsPhone(payload.referredPhone);

    if (!normalizedReferrerPhone || !normalizedReferredPhone) {
      return redirectToRefer(req, "referral-error");
    }

    payload.referrerPhone = normalizedReferrerPhone;
    payload.referredPhone = normalizedReferredPhone;

    await persistReferral(payload, referralCode);

    await Promise.allSettled([
      sendReferralTelegramMessage({
        referrerName: payload.referrerName,
        referrerEmail: payload.referrerEmail,
        referrerPhone: payload.referrerPhone,
        referredName: payload.referredName,
        referredPhone: payload.referredPhone,
        referredEmail: payload.referredEmail,
        city: payload.city,
        notes: payload.notes,
      }),
      trackGa4Lead(payload.city),
      trackMetaLead({
        req,
        referrerEmail: payload.referrerEmail,
        referrerPhone: payload.referrerPhone,
        referrerName: payload.referrerName,
        city: payload.city,
      }),
    ]);

    return redirectToRefer(req, "referral-success");
  } catch (error) {
    console.error("Referral submission failed:", error);
    return redirectToRefer(req, "referral-error");
  }
}
