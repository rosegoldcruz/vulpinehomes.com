import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_REFERRALS_COOKIE,
  isAdminReferralsAuthenticated,
  sanitizeReturnTo,
} from "@/lib/adminReferralsAuth";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_REFERRALS_COOKIE)?.value;
  if (!isAdminReferralsAuthenticated(token)) {
    return NextResponse.redirect(new URL("/admin/referrals?auth=error", req.url), 303);
  }

  const formData = await req.formData();
  const jobId = String(formData.get("jobId") || "");
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const url = new URL(returnTo, req.url);

  if (!jobId) {
    url.searchParams.set("error", "missing-job");
    return NextResponse.redirect(url, 303);
  }

  const { data: jobData, error: jobError } = await supabaseServer
    .from("jobs")
    .select("id, lead_id")
    .eq("id", jobId)
    .limit(1)
    .maybeSingle();

  if (jobError || !jobData?.lead_id) {
    url.searchParams.set("error", "job-not-found");
    return NextResponse.redirect(url, 303);
  }

  const { data: leadData } = await supabaseServer
    .from("leads")
    .select("referral_code")
    .eq("id", jobData.lead_id)
    .limit(1)
    .maybeSingle();

  if (!leadData?.referral_code) {
    url.searchParams.set("error", "no-referral-code");
    return NextResponse.redirect(url, 303);
  }

  const { data: referralCodeRow } = await supabaseServer
    .from("referral_codes")
    .select("referrer_id")
    .eq("code", leadData.referral_code)
    .limit(1)
    .maybeSingle();

  if (!referralCodeRow?.referrer_id) {
    url.searchParams.set("error", "no-referrer");
    return NextResponse.redirect(url, 303);
  }

  const now = new Date().toISOString();

  const { error: updateJobError } = await supabaseServer
    .from("jobs")
    .update({
      status: "paid",
      paid_at: now,
      completed_at: now,
    })
    .eq("id", jobId);

  if (updateJobError) {
    console.error("Failed to update job:", updateJobError);
    url.searchParams.set("error", "update-job");
    return NextResponse.redirect(url, 303);
  }

  const { error: updateLeadError } = await supabaseServer
    .from("leads")
    .update({
      status: "paid",
    })
    .eq("id", jobData.lead_id);

  if (updateLeadError) {
    console.error("Failed to update lead to paid:", updateLeadError);
    url.searchParams.set("error", "update-lead");
    return NextResponse.redirect(url, 303);
  }

  const { error: payoutError } = await supabaseServer.from("payouts").upsert(
    {
      referrer_id: referralCodeRow.referrer_id,
      job_id: jobId,
      amount: 500,
      status: "paid",
      paid_at: now,
    },
    {
      onConflict: "job_id",
    }
  );

  if (payoutError) {
    console.error("Failed to upsert payout:", payoutError);
    url.searchParams.set("error", "payout");
    return NextResponse.redirect(url, 303);
  }

  url.searchParams.set("ok", "paid");
  return NextResponse.redirect(url, 303);
}
