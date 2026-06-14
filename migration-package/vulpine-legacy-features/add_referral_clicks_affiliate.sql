-- ============================================
-- Affiliate Portal Incremental Migration
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL REFERENCES public.referral_codes(code) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_code_created_at
  ON public.referral_clicks(code, created_at);

UPDATE public.leads
SET status = 'new'
WHERE status IS NULL
   OR status NOT IN ('new', 'contacted', 'scheduled', 'in_progress', 'completed', 'paid');

UPDATE public.jobs
SET status = 'won'
WHERE status IS NULL
   OR status NOT IN ('won', 'in_progress', 'completed', 'paid');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_status_valid'
  ) THEN
    ALTER TABLE public.leads
      ADD CONSTRAINT leads_status_valid
      CHECK (status IN ('new', 'contacted', 'scheduled', 'in_progress', 'completed', 'paid'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'jobs_status_valid'
  ) THEN
    ALTER TABLE public.jobs
      ADD CONSTRAINT jobs_status_valid
      CHECK (status IN ('won', 'in_progress', 'completed', 'paid'));
  END IF;
END
$$;
