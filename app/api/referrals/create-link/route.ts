import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateReferralCode, buildShareUrl } from "@/lib/referralProgram";
import { isValidEmail, normalizePhone } from "@/lib/phoneNormalizer";

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

async function findExistingReferrer(phone: string | null, email: string | null) {
  if (phone) {
    const { data } = await supabaseServer
      .from("referrers")
      .select("id")
      .eq("phone", phone)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  if (email) {
    const { data } = await supabaseServer
      .from("referrers")
      .select("id")
      .eq("email", email)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  return null;
}

async function createOrUpdateReferrer(input: {
  name: string;
  email: string | null;
  phone: string | null;
}) {
  const existingId = await findExistingReferrer(input.phone, input.email);

  if (!existingId) {
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

  await supabaseServer
    .from("referrers")
    .update({
      name: input.name,
      email: input.email,
      phone: input.phone,
    })
    .eq("id", existingId);

  return existingId;
}

async function createCode(referrerId: string): Promise<string> {
  for (let i = 0; i < 10; i += 1) {
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
