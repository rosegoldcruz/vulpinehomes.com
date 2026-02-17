import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_REFERRALS_COOKIE,
  isAdminReferralsAuthenticated,
  sanitizeReturnTo,
} from "@/lib/adminReferralsAuth";
import {
  JOB_STATUS_VALUES,
  LEAD_STATUS_VALUES,
  normalizeJobStatus,
  normalizeLeadStatus,
} from "@/lib/referralStatus";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const leadStatusSet = new Set<string>(LEAD_STATUS_VALUES);
const jobStatusSet = new Set<string>(JOB_STATUS_VALUES);

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_REFERRALS_COOKIE)?.value;
  if (!isAdminReferralsAuthenticated(token)) {
    return NextResponse.redirect(new URL("/admin/referrals?auth=error", req.url), 303);
  }

  const formData = await req.formData();
  const entity = String(formData.get("entity") || "");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const url = new URL(returnTo, req.url);

  if (!id || !status) {
    url.searchParams.set("error", "missing-status");
    return NextResponse.redirect(url, 303);
  }

  if (entity === "lead") {
    if (!leadStatusSet.has(status)) {
      url.searchParams.set("error", "invalid-status");
      return NextResponse.redirect(url, 303);
    }

    const normalized = normalizeLeadStatus(status);
    const { error: leadError } = await supabaseServer
      .from("leads")
      .update({ status: normalized })
      .eq("id", id);
    if (leadError) {
      console.error("Failed to update lead status:", leadError);
      url.searchParams.set("error", "update-lead");
      return NextResponse.redirect(url, 303);
    }

    const { data: existingJob } = await supabaseServer
      .from("jobs")
      .select("id,status")
      .eq("lead_id", id)
      .limit(1)
      .maybeSingle();

    if (existingJob?.id) {
      let targetJobStatus: string | null = null;
      if (normalized === "in_progress") targetJobStatus = "in_progress";
      if (normalized === "completed") targetJobStatus = "completed";
      if (normalized === "paid") targetJobStatus = "paid";

      if (targetJobStatus && targetJobStatus !== normalizeJobStatus(existingJob.status)) {
        const now = new Date().toISOString();
        await supabaseServer
          .from("jobs")
          .update({
            status: targetJobStatus,
            completed_at: targetJobStatus === "completed" || targetJobStatus === "paid" ? now : null,
            paid_at: targetJobStatus === "paid" ? now : null,
          })
          .eq("id", existingJob.id);
      }
    }

    url.searchParams.set("ok", "lead-status");
    return NextResponse.redirect(url, 303);
  }

  if (entity === "job") {
    if (!jobStatusSet.has(status)) {
      url.searchParams.set("error", "invalid-status");
      return NextResponse.redirect(url, 303);
    }

    const normalized = normalizeJobStatus(status);
    const { data: jobRow, error: jobError } = await supabaseServer
      .from("jobs")
      .select("id,lead_id")
      .eq("id", id)
      .limit(1)
      .maybeSingle();

    if (jobError || !jobRow?.lead_id) {
      url.searchParams.set("error", "job-not-found");
      return NextResponse.redirect(url, 303);
    }

    const now = new Date().toISOString();
    const { error: updateJobError } = await supabaseServer
      .from("jobs")
      .update({
        status: normalized,
        completed_at: normalized === "completed" || normalized === "paid" ? now : null,
        paid_at: normalized === "paid" ? now : null,
      })
      .eq("id", id);

    if (updateJobError) {
      console.error("Failed to update job status:", updateJobError);
      url.searchParams.set("error", "update-job");
      return NextResponse.redirect(url, 303);
    }

    const leadStatus =
      normalized === "paid"
        ? "paid"
        : normalized === "completed"
          ? "completed"
          : "in_progress";

    await supabaseServer
      .from("leads")
      .update({ status: leadStatus })
      .eq("id", jobRow.lead_id);

    if (normalized === "paid") {
      const { data: leadRow } = await supabaseServer
        .from("leads")
        .select("referral_code")
        .eq("id", jobRow.lead_id)
        .limit(1)
        .maybeSingle();

      if (leadRow?.referral_code) {
        const { data: codeRow } = await supabaseServer
          .from("referral_codes")
          .select("referrer_id")
          .eq("code", leadRow.referral_code)
          .limit(1)
          .maybeSingle();

        if (codeRow?.referrer_id) {
          await supabaseServer.from("payouts").upsert(
            {
              referrer_id: codeRow.referrer_id,
              job_id: jobRow.id,
              amount: 500,
              status: "paid",
              paid_at: now,
            },
            { onConflict: "job_id" }
          );
        }
      }
    }

    url.searchParams.set("ok", "job-status");
    return NextResponse.redirect(url, 303);
  }

  url.searchParams.set("error", "invalid-entity");
  return NextResponse.redirect(url, 303);
}
