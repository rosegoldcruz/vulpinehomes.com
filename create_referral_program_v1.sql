-- ============================================
-- VULPINE REFERRAL PROGRAM V1
-- ============================================

CREATE TABLE IF NOT EXISTS public.referrers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  payout_method text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referral_codes (
  code text PRIMARY KEY,
  referrer_id uuid NOT NULL REFERENCES public.referrers(id) ON DELETE CASCADE,
  campaign text DEFAULT '500_referral',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text,
  notes text,
  source text NOT NULL,
  referral_code text REFERENCES public.referral_codes(code),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status text DEFAULT 'won',
  contract_value numeric,
  completed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.referrers(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  amount numeric DEFAULT 500,
  status text DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_referral_code ON public.leads(referral_code);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_referral_codes_referrer_id ON public.referral_codes(referrer_id);

-- Supports idempotent upsert by job_id from admin payout endpoint
CREATE UNIQUE INDEX IF NOT EXISTS idx_payouts_job_id_unique ON public.payouts(job_id);
