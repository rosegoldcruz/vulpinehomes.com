import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const CAMPAIGN_ID = "C4L_TEMPE_21D";
const HEAR_OPTIONS = new Set(["Vulpine Homes Ad", "Facebook", "Google", "Walk-in"]);

type LeadPayload = {
  first_name?: unknown;
  last_name?: unknown;
  phone?: unknown;
  email?: unknown;
  preferred_day?: unknown;
  preferred_time?: unknown;
  notes?: unknown;
  how_did_you_hear_about_us?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  campaign_id?: unknown;
};

function asTrimmedString(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Lead capture is temporarily unavailable. Please call the showroom directly or try again shortly.",
      },
      { status: 500 }
    );
  }

  let body: LeadPayload;

  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const firstName = asTrimmedString(body.first_name, 80);
  const lastName = asTrimmedString(body.last_name, 80);
  const phone = asTrimmedString(body.phone, 40);
  const email = asTrimmedString(body.email, 160).toLowerCase();
  const preferredDay = asTrimmedString(body.preferred_day, 80);
  const preferredTime = asTrimmedString(body.preferred_time, 80);
  const notes = asTrimmedString(body.notes, 2000);
  const heardFrom = asTrimmedString(body.how_did_you_hear_about_us, 80);

  if (!firstName || !lastName || !phone || !email || !preferredDay || !preferredTime || !notes) {
    return NextResponse.json(
      { success: false, error: "Please complete all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!HEAR_OPTIONS.has(heardFrom as any)) {
    return NextResponse.json(
      { success: false, error: "Please select how you heard about us." },
      { status: 400 }
    );
  }

  const campaignId = asTrimmedString(body.campaign_id, 80) || CAMPAIGN_ID;
  const host = (req.headers.get("host") || "").toLowerCase();

  const metadata = {
    campaign_id: campaignId,
    host,
    preferred_day: preferredDay,
    preferred_time: preferredTime,
    how_did_you_hear_about_us: heardFrom,
    utm_source: asTrimmedString(body.utm_source, 120),
    utm_medium: asTrimmedString(body.utm_medium, 120),
    utm_campaign: asTrimmedString(body.utm_campaign, 160),
    utm_content: asTrimmedString(body.utm_content, 160),
    utm_term: asTrimmedString(body.utm_term, 160),
    raw_notes: notes,
    user_agent: req.headers.get("user-agent") || "",
  };

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const fullName = `${firstName} ${lastName}`.trim();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: fullName,
      phone,
      email,
      source: "c4l_tempe_vulpine",
      status: "new",
      notes: [
        `Campaign: ${campaignId}`,
        `Preferred Day: ${preferredDay}`,
        `Preferred Time: ${preferredTime}`,
        `Heard From: ${heardFrom}`,
        notes ? `Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      metadata,
    })
    .select("id")
    .single();

  if (error) {
    console.error("c4l lead insert error", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "We couldn’t save your appointment request right now. Please try again in a few minutes.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    lead_id: data?.id ?? null,
  });
}
