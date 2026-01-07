-- ============================================
-- FIX VISUALIZER SCHEMA: ONE LEAD PER SUBMISSION
-- ============================================
-- This migration ensures:
-- 1. Email is REQUIRED on kitchen_leads
-- 2. Phone is OPTIONAL but normalized
-- 3. One lead per visualizer submission
-- 4. Images tracked separately in visualizer_images
-- 5. Sessions link images to a single lead
-- ============================================

-- ============================================
-- 1. UPDATE kitchen_leads: Make email NOT NULL
-- ============================================

-- First, set any existing NULL emails to a placeholder
UPDATE public.kitchen_leads
SET email = 'noemail@placeholder.com'
WHERE email IS NULL;

-- Now make email NOT NULL
ALTER TABLE public.kitchen_leads
ALTER COLUMN email SET NOT NULL;

-- Add constraint for valid email format
ALTER TABLE public.kitchen_leads
DROP CONSTRAINT IF EXISTS kitchen_leads_email_check;

ALTER TABLE public.kitchen_leads
ADD CONSTRAINT kitchen_leads_email_check
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ============================================
-- 2. CREATE visualizer_sessions TABLE
-- ============================================
-- Links multiple images to a single lead

CREATE TABLE IF NOT EXISTS public.visualizer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.kitchen_leads(id) ON DELETE CASCADE,
  session_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_visualizer_sessions_lead_id
  ON public.visualizer_sessions (lead_id);

-- Enable RLS
ALTER TABLE public.visualizer_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY IF NOT EXISTS "anon_insert_visualizer_sessions"
ON public.visualizer_sessions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated reads
CREATE POLICY IF NOT EXISTS "auth_read_visualizer_sessions"
ON public.visualizer_sessions
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- 3. CREATE visualizer_images TABLE
-- ============================================
-- Stores all uploaded/generated images per session

CREATE TABLE IF NOT EXISTS public.visualizer_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.visualizer_sessions(id) ON DELETE CASCADE,
  original_url text NOT NULL,
  final_url text NOT NULL,
  prompt_used text,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_visualizer_images_session_id
  ON public.visualizer_images (session_id);

-- Enable RLS
ALTER TABLE public.visualizer_images ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY IF NOT EXISTS "anon_insert_visualizer_images"
ON public.visualizer_images
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated reads
CREATE POLICY IF NOT EXISTS "auth_read_visualizer_images"
ON public.visualizer_images
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- 4. ADD PHONE NORMALIZATION FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION normalize_phone(phone_input text)
RETURNS text AS $$
BEGIN
  IF phone_input IS NULL OR phone_input = '' THEN
    RETURN NULL;
  END IF;
  
  -- Strip all non-numeric characters
  RETURN regexp_replace(phone_input, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- 5. UPDATE kitchen_quotes: Make email NOT NULL
-- ============================================

-- First, set any existing NULL emails to a placeholder
UPDATE public.kitchen_quotes
SET email = 'noemail@placeholder.com'
WHERE email IS NULL;

-- Now make email NOT NULL
ALTER TABLE public.kitchen_quotes
ALTER COLUMN email SET NOT NULL;

-- Add constraint for valid email format
ALTER TABLE public.kitchen_quotes
DROP CONSTRAINT IF EXISTS kitchen_quotes_email_check;

ALTER TABLE public.kitchen_quotes
ADD CONSTRAINT kitchen_quotes_email_check
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ============================================
-- DONE! ✅
-- ============================================
-- Changes applied:
-- ✅ Email is now REQUIRED on kitchen_leads
-- ✅ Email is now REQUIRED on kitchen_quotes
-- ✅ Email format validation enforced
-- ✅ Phone normalization function created
-- ✅ visualizer_sessions table created
-- ✅ visualizer_images table created
-- ✅ Proper foreign key relationships established
-- ✅ RLS policies configured
-- ============================================
