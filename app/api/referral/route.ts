import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { isValidEmail, normalizePhone } from "@/lib/phoneNormalizer";
import { normalizeReferralCode } from "@/lib/referralProgram";
import { checkRateLimit, getRequestIp } from "@/lib/requestRateLimit";
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

type FailureReason =
  | "validation"
  | "rate_limit"
  | "missing_env"
  | "schema_missing"
  | "supabase_insert_failed"
  | "unexpected";

type ErrorDetails = {
  message: string;
  code?: string;
  details?: string;
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const REFERRAL_BUILD_TAG = "referral-diagnostics-v1";
const SUPABASE_SERVER_ENV_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

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

function buildRequestId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function redirectToRefer(params: {
  req: NextRequest;
  hash: "referral-success" | "referral-error";
  requestId: string;
  reason?: string;
}): NextResponse {
  const { req, hash, requestId, reason } = params;
  const url = new URL("/refer", req.url);
  url.searchParams.set("rid", requestId);
  if (reason) {
    url.searchParams.set("reason", reason);
  }
  url.hash = hash;
  return NextResponse.redirect(url, 303);
}

function getMissingSupabaseServerEnvNames(): string[] {
  const missing: string[] = [];
  for (const envKey of SUPABASE_SERVER_ENV_KEYS) {
    if (!process.env[envKey]) {
      missing.push(envKey);
    }
  }
  return missing;
}

function withDiagnosticsHeaders(params: {
  response: NextResponse;
  requestId: string;
  reason: string;
  missingEnvNames?: string[];
  telegramStatus?: string;
  telegramReason?: string;
  formType?: string;
}): NextResponse {
  const { response, requestId, reason, missingEnvNames, telegramStatus, telegramReason, formType } = params;
  response.headers.set("x-vh-rid", requestId);
  response.headers.set("x-vh-reason", reason);
  response.headers.set("x-vh-build", REFERRAL_BUILD_TAG);

  if (missingEnvNames && missingEnvNames.length > 0) {
    response.headers.set("x-vh-missing-env", missingEnvNames.join(","));
  }
  
  if (telegramStatus) {
    response.headers.set("x-vh-telegram", telegramStatus);
  }
  
  if (telegramReason) {
    response.headers.set("x-vh-telegram-reason", telegramReason);
  }

  if (formType) {
    response.headers.set("x-vh-form-type", formType);
  }
  
  const intakeStatus = reason === "ok" ? "ok" : "fail";
  response.headers.set("x-vh-intake", intakeStatus);
  
  console.info("[vh:intake]", {
    rid: requestId,
    endpoint: "/api/referral",
    intake: intakeStatus,
    reason: reason,
    telegram: telegramStatus || "skipped",
    telegramReason: telegramReason || "unknown"
  });

  return response;
}

function toErrorDetails(error: unknown): ErrorDetails | null {
  if (!error || typeof error !== "object") return null;
  const raw = error as { message?: unknown; code?: unknown; details?: unknown };
  if (typeof raw.message !== "string" || !raw.message.trim()) return null;
  return {
    message: raw.message,
    code: typeof raw.code === "string" ? raw.code : undefined,
    details: typeof raw.details === "string" ? raw.details : undefined,
  };
}

function detectRelationName(details: ErrorDetails): string | null {
  const relationMatch =
    details.message.match(/relation\s+"([^"]+)"/i) ||
    details.details?.match(/relation\s+"([^"]+)"/i);
  return relationMatch?.[1] || null;
}

function mapFailureReason(defaultReason: FailureReason, error?: ErrorDetails | null): FailureReason {
  if (!error) return defaultReason;
  if (error.code === "42P01" || /relation\s+"[^"]+"\s+does not exist/i.test(error.message)) {
    return "schema_missing";
  }
  return defaultReason;
}

function isMissingRelationError(error?: ErrorDetails | null): boolean {
  if (!error) return false;
  if (error.code === "42P01") return true;
  if (/relation\s+"[^"]+"\s+does not exist/i.test(error.message)) return true;
  if (error.details && /relation\s+"[^"]+"\s+does not exist/i.test(error.details)) return true;
  return false;
}

function logFailure(params: {
  requestId: string;
  reason: FailureReason;
  error?: ErrorDetails | null;
  meta?: Record<string, string | number | boolean | null>;
}) {
  const relation = params.error ? detectRelationName(params.error) : null;
  console.error("[referral] submission_failed", {
    requestId: params.requestId,
    reason: params.reason,
    relation,
    error: params.error
      ? {
          code: params.error.code || null,
          message: params.error.message,
          details: params.error.details || null,
        }
      : null,
    meta: params.meta || null,
  });
}

function failureResponse(params: {
  req: NextRequest;
  requestId: string;
  reason: FailureReason;
  status?: number;
  error?: ErrorDetails | null;
  retryAfterSeconds?: number;
  missingEnvNames?: string[];
  telegramStatus?: string;
  telegramReason?: string;
}): NextResponse {
  const status = params.status || 400;
  const reasonHeader = params.reason;

  if (!IS_PRODUCTION) {
    const response = NextResponse.json(
      {
        ok: false,
        requestId: params.requestId,
        reason: params.reason,
        error: params.error
          ? {
              message: params.error.message,
              code: params.error.code || null,
            }
          : null,
      },
      { status }
    );
    if (params.retryAfterSeconds && params.retryAfterSeconds > 0) {
      response.headers.set("Retry-After", String(params.retryAfterSeconds));
    }
    return withDiagnosticsHeaders({
      response,
      requestId: params.requestId,
      reason: reasonHeader,
      missingEnvNames: params.missingEnvNames,
      telegramStatus: params.telegramStatus,
      telegramReason: params.telegramReason,
      formType: "referral"
    });
  }

  if (status === 429) {
    const response = NextResponse.json(
      {
        ok: false,
        reason: params.reason,
        requestId: params.requestId,
      },
      { status }
    );
    if (params.retryAfterSeconds) {
      response.headers.set("Retry-After", String(params.retryAfterSeconds));
    }
    return withDiagnosticsHeaders({
      response,
      requestId: params.requestId,
      reason: reasonHeader,
      missingEnvNames: params.missingEnvNames,
      telegramStatus: params.telegramStatus,
      telegramReason: params.telegramReason,
      formType: "referral"
    });
  }

  const redirect = redirectToRefer({
    req: params.req,
    hash: "referral-error",
    requestId: params.requestId,
    reason: params.reason,
  });
  return withDiagnosticsHeaders({
    response: redirect,
    requestId: params.requestId,
    reason: reasonHeader,
    missingEnvNames: params.missingEnvNames,
    telegramStatus: params.telegramStatus,
    telegramReason: params.telegramReason,
    formType: "referral"
  });
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

  const { data, error } = await supabaseServer
    .from("referral_codes")
    .select("code")
    .eq("code", normalized)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.code || null;
}

async function persistReferral(payload: ReferralPayload, referralCode: string | null) {
  const [firstName = "", ...rest] = payload.referredName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  const { error: leadsError } = await supabaseServer.from("leads").insert({
    first_name: firstName || payload.referredName,
    last_name: lastName || null,
    phone: payload.referredPhone,
    email: payload.referredEmail,
    city: payload.city,
    source: "referral_program",
    status: "new",
  });

  if (leadsError) {
    const leadInsertErrorDetails = toErrorDetails(leadsError);
    if (isMissingRelationError(leadInsertErrorDetails)) {
      console.warn("Referral lead insert skipped; leads table missing.", leadInsertErrorDetails);
    } else {
      console.warn("Referral lead insert failed; continuing without CRM lead.", leadInsertErrorDetails);
    }
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

  const { data: quoteData, error } = await supabaseServer.from("kitchen_quotes").insert({
    full_name: payload.referrerName,
    phone: payload.referrerPhone,
    email: payload.referrerEmail,
    city: payload.city,
    notes: referralCode ? `${summary}\nReferral Code: ${referralCode}` : summary,
    status: "new",
    source: "referral_program",
  }).select("id").single();

  if (error) {
    throw error;
  }
  
  return quoteData?.id || null;
}

export async function POST(req: NextRequest) {
  const requestId = buildRequestId();

  try {
    const ip = getRequestIp(req);
    const rateCheck = checkRateLimit({
      scope: "api_referral_submit",
      key: ip,
      windowMs: 5 * 60 * 1000,
      maxRequests: 8,
      blockMs: 2 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      const retryAfterSeconds = Math.max(1, Math.ceil(rateCheck.retryAfterMs / 1000));
      logFailure({
        requestId,
        reason: "rate_limit",
        meta: { retryAfterSeconds, ip },
      });
      return failureResponse({
        req,
        requestId,
        reason: "rate_limit",
        status: 429,
        retryAfterSeconds,
      });
    }

    const missingSupabaseEnvNames = getMissingSupabaseServerEnvNames();
    if (missingSupabaseEnvNames.length > 0) {
      logFailure({
        requestId,
        reason: "missing_env",
        meta: { missing: missingSupabaseEnvNames.join(",") },
      });
      return failureResponse({
        req,
        requestId,
        reason: "missing_env",
        status: 500,
        missingEnvNames: missingSupabaseEnvNames,
      });
    }

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
      logFailure({
        requestId,
        reason: "validation",
        meta: {
          hasReferrerName: Boolean(payload.referrerName),
          hasReferrerEmail: Boolean(payload.referrerEmail),
          hasReferrerPhone: Boolean(payload.referrerPhone),
          hasReferredName: Boolean(payload.referredName),
          hasReferredPhone: Boolean(payload.referredPhone),
          hasCity: Boolean(payload.city),
        },
      });
      return failureResponse({
        req,
        requestId,
        reason: "validation",
        status: 400,
      });
    }

    if (consent !== "yes") {
      logFailure({
        requestId,
        reason: "validation",
        meta: { consentValue: typeof consent === "string" ? consent : null },
      });
      return failureResponse({
        req,
        requestId,
        reason: "validation",
        status: 400,
      });
    }

    if (!isValidEmail(payload.referrerEmail)) {
      logFailure({
        requestId,
        reason: "validation",
        meta: { field: "referrerEmail" },
      });
      return failureResponse({
        req,
        requestId,
        reason: "validation",
        status: 400,
      });
    }

    if (payload.referredEmail && !isValidEmail(payload.referredEmail)) {
      logFailure({
        requestId,
        reason: "validation",
        meta: { field: "referredEmail" },
      });
      return failureResponse({
        req,
        requestId,
        reason: "validation",
        status: 400,
      });
    }

    const normalizedReferrerPhone = normalizeUsPhone(payload.referrerPhone);
    const normalizedReferredPhone = normalizeUsPhone(payload.referredPhone);

    if (!normalizedReferrerPhone || !normalizedReferredPhone) {
      logFailure({
        requestId,
        reason: "validation",
        meta: { field: "phone" },
      });
      return failureResponse({
        req,
        requestId,
        reason: "validation",
        status: 400,
      });
    }

    payload.referrerPhone = normalizedReferrerPhone;
    payload.referredPhone = normalizedReferredPhone;

    await persistReferral(payload, referralCode);

    const [telegramResult] = await Promise.all([
      sendReferralTelegramMessage({
        referrerName: payload.referrerName,
        referrerEmail: payload.referrerEmail,
        referrerPhone: payload.referrerPhone,
        referredName: payload.referredName,
        referredPhone: payload.referredPhone,
        city: payload.city,
      }),
      trackGa4Lead(payload.city).catch((err) => {
        console.warn("GA4 measurement failed:", err);
      }),
      trackMetaLead({
        req,
        referrerEmail: payload.referrerEmail,
        referrerPhone: payload.referrerPhone,
        referrerName: payload.referrerName,
        city: payload.city,
      }),
    ]);

    const success = redirectToRefer({
      req,
      hash: "referral-success",
      requestId,
    });
    
    return withDiagnosticsHeaders({
      response: success,
      requestId,
      reason: "ok",
      telegramStatus: telegramResult.status,
      telegramReason: telegramResult.reason,
      formType: "referral"
    });
  } catch (error) {
    const errorDetails = toErrorDetails(error);
    const reason = mapFailureReason("supabase_insert_failed", errorDetails);

    logFailure({
      requestId,
      reason,
      error: errorDetails,
    });

    return failureResponse({
      req,
      requestId,
      reason,
      status: reason === "schema_missing" ? 500 : 502,
      error: errorDetails,
    });
  }
}
