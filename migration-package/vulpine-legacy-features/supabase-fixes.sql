-- ============================================
-- COMPLETE KITCHEN QUOTES SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE kitchen_quotes TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public.kitchen_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  zipcode text,
  cabinet_style text,
  cabinet_color text,
  countertop text,
  num_doors int,
  num_drawers int,
  notes text,
  status text DEFAULT 'new',
  source text DEFAULT 'web',
  photo_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. DROP ALL EXISTING POLICIES
-- ============================================

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'kitchen_quotes'
    AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.kitchen_quotes', pol.policyname);
  END LOOP;
END $$;

-- ============================================
-- 3. ENABLE RLS
-- ============================================

ALTER TABLE public.kitchen_quotes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE CORRECT RLS POLICIES
-- ============================================

-- Policy 1: Allow anonymous INSERTs
CREATE POLICY "anon_insert_quotes"
ON public.kitchen_quotes
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow authenticated SELECTs
CREATE POLICY "auth_read_quotes"
ON public.kitchen_quotes
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- 5. CREATE kitchen-photos STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('kitchen-photos', 'kitchen-photos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. DROP ALL EXISTING STORAGE POLICIES FOR kitchen-photos
-- ============================================

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname LIKE '%kitchen%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- ============================================
-- 7. CREATE STORAGE RLS POLICIES
-- ============================================

-- Public read access
CREATE POLICY "public_read_photos"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'kitchen-photos');

-- Anonymous upload access
CREATE POLICY "anon_upload_photos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'kitchen-photos');

-- ============================================
-- 8. ADD AUTO-UPDATING TIMESTAMP TRIGGER
-- ============================================

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_kitchen_quotes_updated_at
ON public.kitchen_quotes;

-- Create the trigger
CREATE TRIGGER update_kitchen_quotes_updated_at
BEFORE UPDATE ON public.kitchen_quotes
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 9. ADD AI VISUALIZER COLUMNS
-- ============================================

ALTER TABLE public.kitchen_quotes
ADD COLUMN IF NOT EXISTS visualizer_images text[],
ADD COLUMN IF NOT EXISTS selected_style text,
ADD COLUMN IF NOT EXISTS selected_color text,
ADD COLUMN IF NOT EXISTS original_images text[];

-- ============================================
-- 10. CREATE VISUALIZER STORAGE BUCKETS
-- ============================================

-- Bucket for original uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('visualizer-inputs', 'visualizer-inputs', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for AI-generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('visualizer-renders', 'visualizer-renders', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. CREATE VISUALIZER STORAGE POLICIES
-- ============================================

-- Public read for inputs
CREATE POLICY "public_read_visualizer_inputs"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'visualizer-inputs');

-- Anonymous upload for inputs
CREATE POLICY "anon_upload_visualizer_inputs"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'visualizer-inputs');

-- Public read for renders
CREATE POLICY "public_read_visualizer_renders"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'visualizer-renders');

-- Anonymous upload for renders
CREATE POLICY "anon_upload_visualizer_renders"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'visualizer-renders');

-- ============================================
-- DONE! ✅
-- ============================================
--
-- Your kitchen_quotes table is ready with:
-- ✅ Correct schema with all columns
-- ✅ RLS enabled
-- ✅ Anonymous INSERT policy
-- ✅ Authenticated SELECT policy
-- ✅ kitchen-photos bucket created
-- ✅ visualizer-inputs bucket created
-- ✅ visualizer-renders bucket created
-- ✅ Public read + anon upload for all storage
-- ✅ Auto-updating updated_at timestamp
-- ✅ AI visualizer columns added
--
-- Next: Test the form at /vulpine/kitchen-quote
-- Next: Test the AI visualizer at /visualizer
-- ============================================
