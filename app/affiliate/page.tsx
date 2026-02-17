import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AffiliateCodeCard from "./AffiliateCodeCard";
import { readAffiliateSessionFromCookies } from "@/lib/affiliateAuth";
import { buildShareUrl } from "@/lib/referralProgram";
import { derivePortalStatus, normalizeJobStatus } from "@/lib/referralStatus";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Dashboard | Vulpine Homes",
  description: "Private referral partner dashboard for Vulpine Homes.",
  robots: {
    index: false,
    follow: false,
  },
};

type DashboardSearchParams = {
  range?: string;
};

type RangeKey = "today" | "7d" | "30d" | "all";

type CodeRow = {
  code: string;
  active: boolean;
  created_at: string;
};

type ClickRow = {
  id: string;
  code: string;
  created_at: string;
};

type LeadRow = {
  id: string;
  city: string | null;
  status: string | null;
  referral_code: string | null;
  created_at: string;
};

type JobRow = {
  id: string;
  lead_id: string;
  status: string | null;
  contract_value: number | null;
  created_at: string;
};

type PayoutRow = {
  id: string;
  job_id: string;
  amount: number | null;
  status: string | null;
  paid_at: string | null;
  created_at: string;
};

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "all", label: "All" },
];

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseRange(input: string | undefined): RangeKey {
  if (input === "today" || input === "7d" || input === "30d" || input === "all") {
    return input;
  }
  return "30d";
}

function sinceForRange(range: RangeKey): Date | null {
  const now = new Date();
  if (range === "all") return null;
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

function isWithinRange(value: string, since: Date | null): boolean {
  if (!since) return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date >= since;
}

async function loadAffiliateData(referrerId: string) {
  const { data: codesRaw } = await supabaseServer
    .from("referral_codes")
    .select("code,active,created_at")
    .eq("referrer_id", referrerId)
    .order("created_at", { ascending: false });
  const codes = (codesRaw || []) as CodeRow[];
  const codeValues = codes.map((code) => code.code);

  let clicks: ClickRow[] = [];
  let leads: LeadRow[] = [];
  let jobs: JobRow[] = [];
  let payouts: PayoutRow[] = [];

  if (codeValues.length > 0) {
    const [clickRes, leadRes] = await Promise.all([
      supabaseServer
        .from("referral_clicks")
        .select("id,code,created_at")
        .in("code", codeValues)
        .order("created_at", { ascending: false })
        .limit(5000),
      supabaseServer
        .from("leads")
        .select("id,city,status,referral_code,created_at")
        .in("referral_code", codeValues)
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);

    clicks = (clickRes.data || []) as ClickRow[];
    leads = (leadRes.data || []) as LeadRow[];
  }

  const leadIds = leads.map((lead) => lead.id);
  if (leadIds.length > 0) {
    const { data: jobsRaw } = await supabaseServer
      .from("jobs")
      .select("id,lead_id,status,contract_value,created_at")
      .in("lead_id", leadIds)
      .order("created_at", { ascending: false });
    jobs = (jobsRaw || []) as JobRow[];
  }

  const { data: payoutsRaw } = await supabaseServer
    .from("payouts")
    .select("id,job_id,amount,status,paid_at,created_at")
    .eq("referrer_id", referrerId)
    .order("created_at", { ascending: false });
  payouts = (payoutsRaw || []) as PayoutRow[];

  return { codes, clicks, leads, jobs, payouts };
}

export default async function AffiliateDashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  const cookieStore = cookies();
  const session = readAffiliateSessionFromCookies(cookieStore);

  if (!session) {
    redirect("/affiliate/login?next=/affiliate");
  }

  const { data: referrer } = await supabaseServer
    .from("referrers")
    .select("id,name,email")
    .eq("id", session.referrerId)
    .eq("email", session.email)
    .limit(1)
    .maybeSingle();

  if (!referrer?.id) {
    redirect("/affiliate/login?error=link&next=/affiliate");
  }

  const range = parseRange(searchParams.range);
  const since = sinceForRange(range);
  const data = await loadAffiliateData(referrer.id);

  const activeCodes = data.codes.filter((code) => code.active);
  const jobsByLeadId = new Map(data.jobs.map((job) => [job.lead_id, job]));
  const payoutsByJobId = new Map(data.payouts.map((payout) => [payout.job_id, payout]));

  const filteredClicks = data.clicks.filter((row) => isWithinRange(row.created_at, since));
  const filteredLeads = data.leads.filter((row) => isWithinRange(row.created_at, since));
  const filteredJobs = data.jobs.filter((row) => isWithinRange(row.created_at, since));
  const filteredPayouts = data.payouts.filter((row) => isWithinRange(row.created_at, since));

  const statusRows = filteredLeads
    .map((lead) => {
      const job = jobsByLeadId.get(lead.id);
      const payout = job ? payoutsByJobId.get(job.id) : undefined;
      const status = derivePortalStatus({
        leadStatus: lead.status,
        jobStatus: job?.status,
        payoutStatus: payout?.status,
      });
      return {
        id: lead.id,
        createdAt: lead.created_at,
        city: lead.city || "Unknown",
        status,
        jobId: job?.id || null,
        jobValue: job?.contract_value ?? null,
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const jobsInProgressCount = filteredJobs.filter((job) => {
    const status = normalizeJobStatus(job.status);
    return status === "won" || status === "in_progress";
  }).length;

  const completedCount = statusRows.filter((row) => row.status === "completed").length;
  const paidCount = statusRows.filter((row) => row.status === "paid").length;

  const pendingPayoutJobIds = new Set(
    filteredPayouts
      .filter((payout) => payout.status === "pending")
      .map((payout) => payout.job_id)
  );
  const completedUnpaidJobIds = new Set(
    filteredJobs
      .filter((job) => normalizeJobStatus(job.status) === "completed")
      .map((job) => job.id)
  );
  const unpaidJobIds = new Set<string>([
    ...Array.from(pendingPayoutJobIds),
    ...Array.from(completedUnpaidJobIds),
  ]);
  const completedWithoutJob = statusRows.filter(
    (row) => row.status === "completed" && !row.jobId
  ).length;
  const unpaidEarnings = (unpaidJobIds.size + completedWithoutJob) * 500;

  const paidEarnings = filteredPayouts
    .filter((payout) => payout.status === "paid")
    .reduce((sum, payout) => sum + (Number(payout.amount) || 0), 0);

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 text-white">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Affiliate Dashboard</h1>
              <p className="mt-3 text-white/70">
                $500 per completed cabinet refacing project (paid after completion and full payment).
              </p>
            </div>
            <form action="/api/affiliate/logout" method="post">
              <input type="hidden" name="returnTo" value="/affiliate/login" />
              <button
                type="submit"
                className="rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:border-[#FF8A3D]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold">Reward Status</h2>
          <p className="mt-2 text-white/75">Commission: $500 per completed cabinet refacing project.</p>
          <p className="mt-1 text-white/75">
            Active referral code(s): {activeCodes.length > 0 ? activeCodes.length : 0}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {activeCodes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/70">
              No active referral code is available yet. Contact support if this persists.
            </div>
          ) : null}
          {activeCodes.map((code) => (
            <AffiliateCodeCard
              key={code.code}
              code={code.code}
              shareUrl={buildShareUrl(code.code)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Stats</h2>
            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map((option) => {
                const active = option.key === range;
                return (
                  <a
                    key={option.key}
                    href={`/affiliate?range=${option.key}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      active
                        ? "bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
                        : "border border-white/20 text-white/80 hover:border-[#FF8A3D]"
                    }`}
                  >
                    {option.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Clicks</p>
              <p className="mt-1 text-2xl font-bold">{filteredClicks.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Leads</p>
              <p className="mt-1 text-2xl font-bold">{filteredLeads.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Jobs In Progress</p>
              <p className="mt-1 text-2xl font-bold">{jobsInProgressCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Completed</p>
              <p className="mt-1 text-2xl font-bold">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Paid</p>
              <p className="mt-1 text-2xl font-bold">{paidCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Unpaid Earnings</p>
              <p className="mt-1 text-2xl font-bold">{formatCurrency(unpaidEarnings)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-white/50">Total Paid Earnings</p>
              <p className="mt-1 text-2xl font-bold">{formatCurrency(paidEarnings)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold">Referrals / Jobs Status</h2>
          <p className="mt-2 text-sm text-white/60">
            Customer identity is masked for privacy. This portal does not display names, phone numbers, or emails.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Job Value</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                {statusRows.length === 0 ? (
                  <tr>
                    <td className="py-3 text-white/60" colSpan={4}>
                      No attributed referrals in this range.
                    </td>
                  </tr>
                ) : null}
                {statusRows.slice(0, 200).map((row) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="py-2 pr-4">{formatDate(row.createdAt)}</td>
                    <td className="py-2 pr-4">{row.city}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs uppercase tracking-wide">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {row.jobValue != null ? formatCurrency(Number(row.jobValue)) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold">Payments</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td className="py-3 text-white/60" colSpan={3}>
                      No payouts in this range.
                    </td>
                  </tr>
                ) : null}
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="border-t border-white/10">
                    <td className="py-2 pr-4">{formatDate(payout.paid_at || payout.created_at)}</td>
                    <td className="py-2 pr-4">
                      {formatCurrency(Number(payout.amount || 0))}
                    </td>
                    <td className="py-2">
                      <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs uppercase tracking-wide">
                        {payout.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
