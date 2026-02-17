import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateReferralCode, buildShareUrl } from "@/lib/referralProgram";
import { isValidEmail, normalizePhone } from "@/lib/phoneNormalizer";
import { checkRateLimit, getRequestIp } from "@/lib/requestRateLimit";

export const runtime = "nodejs";

function sanitizeText(value: unknown, max = 120): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function normalizeReferrerPhone(phone: string): string | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  if (normalized.length === 10) return normalized;
  if (normalized.length === 11 && normalized.startsWith("1")) return normalized.slice(1);
  return null;
}

type ReferrerLookup = {
  id: string;
  email: string | null;
  phone: string | null;
};

async function findExistingReferrer(
  phone: string | null,
  email: string | null
): Promise<ReferrerLookup | null> {
  if (email) {
    const { data } = await supabaseServer
      .from("referrers")
      .select("id, email, phone")
      .eq("email", email)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data?.id) return data as ReferrerLookup;
  }

  if (phone) {
    const { data } = await supabaseServer
      .from("referrers")
      .select("id, email, phone")
      .eq("phone", phone)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data?.id) return data as ReferrerLookup;
  }

  return null;
}

async function createOrUpdateReferrer(input: {
  name: string;
  email: string | null;
  phone: string | null;
}) {
  const existing = await findExistingReferrer(input.phone, input.email);

  if (!existing) {
    const { data, error } = await supabaseServer
      .from("referrers")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw error || new Error("Failed to create referrer");
    }

    return data.id as string;
  }

  const { error: updateError } = await supabaseServer
    .from("referrers")
    .update({
      name: input.name,
      email: input.email || existing.email,
      phone: input.phone || existing.phone,
    })
    .eq("id", existing.id);

  if (updateError) {
    throw updateError;
  }

  return existing.id;
}

async function createCode(referrerId: string): Promise<string> {
  for (let i = 0; i < 20; i += 1) {
    const code = generateReferralCode(9);
    const { error } = await supabaseServer.from("referral_codes").insert({
      code,
      referrer_id: referrerId,
      campaign: "500_referral",
      active: true,
    });

    if (!error) return code;
    if ((error as { code?: string }).code !== "23505") throw error;
  }

  throw new Error("Could not generate a unique code");
}

export async function POST(req: NextRequest) {
  try {
    const ip = getRequestIp(req);
    const rate = checkRateLimit({
      scope: "referrals-create-link",
      key: ip,
      windowMs: 10 * 60 * 1000,
      maxRequests: 10,
      blockMs: 30 * 60 * 1000,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const name = sanitizeText(body?.name, 120);
    const emailRaw = sanitizeText(body?.email, 180).toLowerCase();
    const phoneRaw = sanitizeText(body?.phone, 30);
    const email = emailRaw || null;
    const phone = phoneRaw ? normalizeReferrerPhone(phoneRaw) : null;

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ error: "Phone or email is required." }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Email is invalid." }, { status: 400 });
    }

    if (phoneRaw && !phone) {
      return NextResponse.json({ error: "Phone number is invalid." }, { status: 400 });
    }

    const referrerId = await createOrUpdateReferrer({ name, email, phone });
    const code = await createCode(referrerId);
    const shareUrl = buildShareUrl(code);

    return NextResponse.json({
      success: true,
      code,
      shareUrl,
    });
  } catch (error) {
    console.error("Failed to create referral link:", error);
    return NextResponse.json(
      { error: "We could not create your referral link right now." },
      { status: 500 }
    );
  }
}
