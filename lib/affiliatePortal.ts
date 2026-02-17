import { supabaseServer } from "@/lib/supabaseServer";
import { generateReferralCode } from "@/lib/referralProgram";

type ReferrerRecord = {
  id: string;
  email: string | null;
  name: string;
};

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] || "Affiliate";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Affiliate Partner";
  return cleaned
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function ensureReferrerForEmail(email: string): Promise<ReferrerRecord> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabaseServer
    .from("referrers")
    .select("id, email, name")
    .eq("email", normalizedEmail)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return existing as ReferrerRecord;
  }

  const { data: inserted, error } = await supabaseServer
    .from("referrers")
    .insert({
      name: nameFromEmail(normalizedEmail),
      email: normalizedEmail,
      phone: null,
    })
    .select("id, email, name")
    .single();

  if (error || !inserted?.id) {
    throw error || new Error("Unable to create referrer");
  }

  return inserted as ReferrerRecord;
}

export async function ensureActiveCodeForReferrer(referrerId: string): Promise<void> {
  const { data: existingCode } = await supabaseServer
    .from("referral_codes")
    .select("code")
    .eq("referrer_id", referrerId)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingCode?.code) return;

  for (let i = 0; i < 20; i += 1) {
    const code = generateReferralCode(9);
    const { error } = await supabaseServer.from("referral_codes").insert({
      code,
      referrer_id: referrerId,
      campaign: "500_referral",
      active: true,
    });
    if (!error) return;
    if ((error as { code?: string }).code !== "23505") throw error;
  }

  throw new Error("Unable to create active referral code");
}

