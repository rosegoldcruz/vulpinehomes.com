import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_REFERRALS_COOKIE,
  isAdminReferralsAuthenticated,
  sanitizeReturnTo,
} from "@/lib/adminReferralsAuth";
import { normalizeLeadStatus } from "@/lib/referralStatus";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_REFERRALS_COOKIE)?.value;
  if (!isAdminReferralsAuthenticated(token)) {
    return NextResponse.redirect(new URL("/admin/referrals?auth=error", req.url), 303);
  }

  const formData = await req.formData();
  const leadId = String(formData.get("leadId") || "");
  const returnTo = sanitizeReturnTo(String(formData.get("returnTo") || "/admin/referrals"));
  const url = new URL(returnTo, req.url);

  if (!leadId) {
    url.searchParams.set("error", "missing-lead");
    return NextResponse.redirect(url, 303);
  }

  const { data: existingJob } = await supabaseServer
    .from("jobs")
    .select("id")
    .eq("lead_id", leadId)
    .limit(1)
    .maybeSingle();

  if (!existingJob?.id) {
    const { error } = await supabaseServer.from("jobs").insert({
      lead_id: leadId,
      status: "won",
    });

    if (error) {
      console.error("Failed to create job:", error);
      url.searchParams.set("error", "create-job");
      return NextResponse.redirect(url, 303);
    }
  }

  const { data: leadRow } = await supabaseServer
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .limit(1)
    .maybeSingle();

  const currentLeadStatus = normalizeLeadStatus(leadRow?.status);
  if (currentLeadStatus !== "paid" && currentLeadStatus !== "completed") {
    const { error: leadStatusError } = await supabaseServer
      .from("leads")
      .update({ status: "in_progress" })
      .eq("id", leadId);
    if (leadStatusError) {
      console.error("Failed to update lead status on conversion:", leadStatusError);
    }
  }

  url.searchParams.set("ok", "job-created");
  return NextResponse.redirect(url, 303);
}
