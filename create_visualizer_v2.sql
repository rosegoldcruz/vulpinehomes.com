-- ============================================
-- V2 VISUALIZER: KITCHEN_LEADS TABLE + STORAGE
-- ============================================

-- 1. Create kitchen_leads table (if it does not exist)
CREATE TABLE IF NOT EXISTS public.kitchen_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  phone text,
  email text,
  city text,
  room_type text,
  selected_style text,
  selected_color text,
  design_count int,
  intervention_strength numeric,
  custom_instructions text,
  original_images text[] DEFAULT '{}'::text[],
  design_images text[] DEFAULT '{}'::text[],
  source text DEFAULT 'vulpine_visualizer_v2',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_kitchen_leads_created_at
  ON public.kitchen_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kitchen_leads_phone
  ON public.kitchen_leads (phone);

-- 2. Enable RLS and basic policies
ALTER TABLE public.kitchen_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (forms without auth)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'kitchen_leads'
      AND policyname = 'anon_insert_kitchen_leads'
  ) THEN
    CREATE POLICY "anon_insert_kitchen_leads"
    ON public.kitchen_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);
  END IF;
END $$;

-- Allow authenticated reads (e.g. dashboard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'kitchen_leads'
      AND policyname = 'auth_read_kitchen_leads'
  ) THEN
    CREATE POLICY "auth_read_kitchen_leads"
    ON public.kitchen_leads
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- 3. Create visualizations storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('visualizations', 'visualizations', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies for visualizations bucket
DO $$
BEGIN
  -- Drop existing policies to prevent duplicate-name errors
  PERFORM 1
  FROM pg_policies
  WHERE policyname = 'public_read_visualizations';
  IF FOUND THEN
    DROP POLICY "public_read_visualizations" ON storage.objects;
  END IF;
END $$;

-- Public read access for visualizations
CREATE POLICY "public_read_visualizations"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'visualizations');

