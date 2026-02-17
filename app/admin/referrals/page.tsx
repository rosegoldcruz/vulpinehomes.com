import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";
import {
  ADMIN_REFERRALS_COOKIE,
  getAdminReferralsPassword,
  isAdminReferralsAuthenticated,
} from "@/lib/adminReferralsAuth";
import {
  JOB_STATUS_VALUES,
  LEAD_STATUS_VALUES,
  normalizeJobStatus,
  normalizeLeadStatus,
} from "@/lib/referralStatus";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  auth?: string;
  ok?: string;
  error?: string;
};

type ReferrerRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  payout_method: string | null;
  created_at: string;
};

type ReferralCodeRow = {
  code: string;
  referrer_id: string;
  active: boolean;
  campaign: string | null;
  created_at: string;
};

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  source: string;
  status: string | null;
  referral_code: string | null;
  created_at: string;
};

type JobRow = {
  id: string;
  lead_id: string;
  status: string | null;
  contract_value: number | null;
  completed_at: string | null;
  paid_at: string | null;
  created_at: string;
};

type PayoutRow = {
  id: string;
  referrer_id: string;
  job_id: string;
  amount: number | null;
  status: string | null;
  paid_at: string | null;
  created_at: string;
};

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function sanitizeSearch(input: string): string {
  return input.replace(/[,%]/g, "").slice(0, 80);
}

async function loadDashboardData(query: string) {
  const normalizedQuery = sanitizeSearch(query.trim());

  let referrers: ReferrerRow[] = [];
  let codeMatches: ReferralCodeRow[] = [];

  if (normalizedQuery) {
    const like = `%${normalizedQuery}%`;
    const [refRes, codeRes] = await Promise.all([
      supabaseServer
        .from("referrers")
        .select("id,name,email,phone,payout_method,created_at")
        .or(`email.ilike.${like},phone.ilike.${like},name.ilike.${like}`)
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseServer
        .from("referral_codes")
        .select("code,referrer_id,active,campaign,created_at")
        .ilike("code", like)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    referrers = (refRes.data || []) as ReferrerRow[];
    codeMatches = (codeRes.data || []) as ReferralCodeRow[];

    const referrerIdsFromCodes = [...new Set(codeMatches.map((row) => row.referrer_id))];
    const missingIds = referrerIdsFromCodes.filter((id) => !referrers.some((r) => r.id === id));

    if (missingIds.length > 0) {
      const { data: additionalReferrers } = await supabaseServer
        .from("referrers")
        .select("id,name,email,phone,payout_method,created_at")
        .in("id", missingIds);
      referrers = [...referrers, ...(((additionalReferrers || []) as ReferrerRow[]))];
    }
  } else {
    const { data } = await supabaseServer
      .from("referrers")
      .select("id,name,email,phone,payout_method,created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    referrers = (data || []) as ReferrerRow[];
  }

  const referrerIds = [...new Set(referrers.map((row) => row.id))];
  if (referrerIds.length === 0) {
    return {
      referrers,
      codes: [] as ReferralCodeRow[],
      leads: [] as LeadRow[],
      jobs: [] as JobRow[],
      payouts: [] as PayoutRow[],
    };
  }

  const { data: allCodesRaw } = await supabaseServer
    .from("referral_codes")
    .select("code,referrer_id,active,campaign,created_at")
    .in("referrer_id", referrerIds)
    .order("created_at", { ascending: false });

  const allCodes = (allCodesRaw || []) as ReferralCodeRow[];
  const codeValues = [...new Set(allCodes.map((row) => row.code))];

  let leads: LeadRow[] = [];
  if (codeValues.length > 0) {
    const { data: leadsRaw } = await supabaseServer
      .from("leads")
      .select("id,name,phone,email,city,source,status,referral_code,created_at")
      .in("referral_code", codeValues)
      .order("created_at", { ascending: false })
      .limit(500);
    leads = (leadsRaw || []) as LeadRow[];
  }

  const leadIds = leads.map((row) => row.id);
  let jobs: JobRow[] = [];
  if (leadIds.length > 0) {
    const { data: jobsRaw } = await supabaseServer
      .from("jobs")
      .select("id,lead_id,status,contract_value,completed_at,paid_at,created_at")
      .in("lead_id", leadIds)
      .order("created_at", { ascending: false });
    jobs = (jobsRaw || []) as JobRow[];
  }

  const jobIds = jobs.map((row) => row.id);
  let payouts: PayoutRow[] = [];
  if (jobIds.length > 0) {
    const { data: payoutsRaw } = await supabaseServer
      .from("payouts")
      .select("id,referrer_id,job_id,amount,status,paid_at,created_at")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });
    payouts = (payoutsRaw || []) as PayoutRow[];
  }

  return {
    referrers,
    codes: allCodes.length ? allCodes : codeMatches,
    leads,
    jobs,
    payouts,
  };
}

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_REFERRALS_COOKIE)?.value;
  const authenticated = isAdminReferralsAuthenticated(token);
  const hasPassword = !!getAdminReferralsPassword();
  const query = searchParams.q || "";
  const returnTo = query ? `/admin/referrals?q=${encodeURIComponent(query)}` : "/admin/referrals";
  const data = authenticated ? await loadDashboardData(query) : null;

  const jobsByLeadId = new Map((data?.jobs || []).map((row) => [row.lead_id, row]));
  const payoutsByJobId = new Map((data?.payouts || []).map((row) => [row.job_id, row]));
  const codesByReferrer = new Map<string, ReferralCodeRow[]>();
  const leadsByCode = new Map<string, LeadRow[]>();

  for (const code of data?.codes || []) {
    const list = codesByReferrer.get(code.referrer_id) || [];
    list.push(code);
    codesByReferrer.set(code.referrer_id, list);
  }

  for (const lead of data?.leads || []) {
    if (!lead.referral_code) continue;
    const list = leadsByCode.get(lead.referral_code) || [];
    list.push(lead);
    leadsByCode.set(lead.referral_code, list);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h1 className="text-3xl font-bold md:text-4xl">Referral Admin</h1>
          <p className="mt-3 text-white/70">Track referral links, attributed leads, jobs, and payout status.</p>
        </div>
      </section>

      {!hasPassword ? (
        <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-red-200">
            `ADMIN_REFERRALS_PASSWORD` is not configured.
          </div>
        </section>
      ) : null}

      {hasPassword && !authenticated ? (
        <section className="mx-auto mt-6 max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">Sign in</h2>
            <p className="mt-2 text-white/70">Enter the admin referrals password.</p>
            {searchParams.auth === "error" ? (
              <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                Password is invalid.
              </p>
            ) : null}
            <form action="/api/admin/referrals/login" method="post" className="mt-4 space-y-4">
              <input type="hidden" name="returnTo" value={returnTo} />
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
                placeholder="Password"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Sign in
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {authenticated && data ? (
        <>
          <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <form method="get" className="flex w-full max-w-2xl gap-3">
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Search referral code, referrer email, or phone"
                    className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:border-[#FF8A3D] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/30"
                  />
                  <button
                    type="submit"
                    className="rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold text-white hover:border-[#FF8A3D]"
                  >
                    Search
                  </button>
                </form>
                <form action="/api/admin/referrals/logout" method="post">
                  <input type="hidden" name="returnTo" value="/admin/referrals" />
                  <button
                    type="submit"
                    className="rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:border-[#FF8A3D]"
                  >
                    Sign out
                  </button>
                </form>
              </div>

              {searchParams.ok ? (
                <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  Action completed.
                </p>
              ) : null}
              {searchParams.error ? (
                <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  Action failed. Please retry.
                </p>
              ) : null}
            </div>
          </section>

          <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            {data.referrers.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/70">
                No matching referrers found.
              </div>
            ) : null}

            {data.referrers.map((referrer) => {
              const codes = codesByReferrer.get(referrer.id) || [];
              return (
                <article key={referrer.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{referrer.name}</h2>
                      <p className="text-sm text-white/70">
                        {referrer.email || "No email"} · {referrer.phone || "No phone"}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      Referrer created {formatDate(referrer.created_at)}
                    </p>
                  </header>

                  <div className="mt-5 space-y-4">
                    {codes.length === 0 ? (
                      <p className="text-sm text-white/60">No referral codes found.</p>
                    ) : null}

                    {codes.map((code) => {
                      const leads = leadsByCode.get(code.code) || [];
                      return (
                        <div key={code.code} className="rounded-xl border border-white/10 bg-black/20 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-white">
                              Code: <span className="text-[#FF8A3D]">{code.code}</span>
                            </p>
                            <p className="text-xs text-white/60">
                              {code.active ? "Active" : "Inactive"} · {formatDate(code.created_at)}
                            </p>
                          </div>

                          <div className="mt-4 space-y-3">
                            {leads.length === 0 ? (
                              <p className="text-sm text-white/60">No leads attributed yet.</p>
                            ) : null}

                            {leads.map((lead) => {
                              const job = jobsByLeadId.get(lead.id);
                              const payout = job ? payoutsByJobId.get(job.id) : undefined;
                              const leadStatus = normalizeLeadStatus(lead.status);
                              const jobStatus = job ? normalizeJobStatus(job.status) : null;

                              return (
                                <div key={lead.id} className="rounded-lg border border-white/10 bg-[#0f1117] p-4">
                                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                      <p className="font-semibold text-white">{lead.name}</p>
                                      <p className="text-sm text-white/70">
                                        {lead.phone} · {lead.email || "No email"} · {lead.city || "No city"}
                                      </p>
                                      <p className="text-xs text-white/50">
                                        {lead.source} · {formatDate(lead.created_at)}
                                      </p>
                                    </div>
                                    <div className="text-sm text-white/70">
                                      <p>Lead status: {leadStatus}</p>
                                      <p>Job: {jobStatus || "none"}</p>
                                      <p>Payout: {payout?.status || "none"}</p>
                                    </div>
                                  </div>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {!job ? (
                                      <form action="/api/admin/referrals/job" method="post">
                                        <input type="hidden" name="leadId" value={lead.id} />
                                        <input type="hidden" name="returnTo" value={returnTo} />
                                        <button
                                          type="submit"
                                          className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FF8A3D]"
                                        >
                                          Convert Lead → Job
                                        </button>
                                      </form>
                                    ) : null}

                                    {job && payout?.status !== "paid" ? (
                                      <form action="/api/admin/referrals/payout" method="post">
                                        <input type="hidden" name="jobId" value={job.id} />
                                        <input type="hidden" name="returnTo" value={returnTo} />
                                        <button
                                          type="submit"
                                          className="rounded-lg bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] px-3 py-1.5 text-xs font-semibold text-white"
                                        >
                                          Mark Job Paid + Create $500 Payout
                                        </button>
                                      </form>
                                    ) : null}

                                    {payout?.status === "paid" ? (
                                      <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                                        Paid {formatDate(payout.paid_at)}
                                      </p>
                                    ) : null}
                                  </div>

                                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                                    <form action="/api/admin/referrals/status" method="post" className="flex gap-2">
                                      <input type="hidden" name="entity" value="lead" />
                                      <input type="hidden" name="id" value={lead.id} />
                                      <input type="hidden" name="returnTo" value={returnTo} />
                                      <select
                                        name="status"
                                        defaultValue={leadStatus}
                                        className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-white"
                                      >
                                        {LEAD_STATUS_VALUES.map((status) => (
                                          <option key={status} value={status}>
                                            Lead: {status}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        type="submit"
                                        className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FF8A3D]"
                                      >
                                        Update
                                      </button>
                                    </form>

                                    {job ? (
                                      <form action="/api/admin/referrals/status" method="post" className="flex gap-2">
                                        <input type="hidden" name="entity" value="job" />
                                        <input type="hidden" name="id" value={job.id} />
                                        <input type="hidden" name="returnTo" value={returnTo} />
                                        <select
                                          name="status"
                                          defaultValue={jobStatus || "won"}
                                          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-white"
                                        >
                                          {JOB_STATUS_VALUES.map((status) => (
                                            <option key={status} value={status}>
                                              Job: {status}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          type="submit"
                                          className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FF8A3D]"
                                        >
                                          Update
                                        </button>
                                      </form>
                                    ) : (
                                      <div />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </section>
        </>
      ) : null}
    </main>
  );
}
