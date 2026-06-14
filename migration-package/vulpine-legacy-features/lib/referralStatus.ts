export const LEAD_STATUS_VALUES = [
  "new",
  "contacted",
  "scheduled",
  "in_progress",
  "completed",
  "paid",
] as const;

export const JOB_STATUS_VALUES = [
  "won",
  "in_progress",
  "completed",
  "paid",
] as const;

export type LeadStatus = (typeof LEAD_STATUS_VALUES)[number];
export type JobStatus = (typeof JOB_STATUS_VALUES)[number];

const leadStatusSet = new Set<string>(LEAD_STATUS_VALUES);
const jobStatusSet = new Set<string>(JOB_STATUS_VALUES);

export function normalizeLeadStatus(value: string | null | undefined): LeadStatus {
  if (!value) return "new";
  if (leadStatusSet.has(value)) return value as LeadStatus;
  return "new";
}

export function normalizeJobStatus(value: string | null | undefined): JobStatus {
  if (!value) return "won";
  if (jobStatusSet.has(value)) return value as JobStatus;
  return "won";
}

export function derivePortalStatus(params: {
  leadStatus: string | null | undefined;
  jobStatus?: string | null | undefined;
  payoutStatus?: string | null | undefined;
}): LeadStatus {
  const leadStatus = normalizeLeadStatus(params.leadStatus);
  const jobStatus = params.jobStatus ? normalizeJobStatus(params.jobStatus) : null;
  const payoutStatus = params.payoutStatus || null;

  if (payoutStatus === "paid" || leadStatus === "paid" || jobStatus === "paid") {
    return "paid";
  }
  if (leadStatus === "completed" || jobStatus === "completed") {
    return "completed";
  }
  if (
    leadStatus === "in_progress" ||
    jobStatus === "in_progress" ||
    jobStatus === "won"
  ) {
    return "in_progress";
  }
  if (leadStatus === "scheduled") return "scheduled";
  if (leadStatus === "contacted") return "contacted";
  return "new";
}

