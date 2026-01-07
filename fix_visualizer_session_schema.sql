-- ============================================
-- FIX VISUALIZER SESSION CREATION FAILURE
-- ============================================
-- Root cause: 
-- 1. visualizer_sessions.session_status column is missing
-- 2. Foreign key points to wrong table (leads vs kitchen_leads)
-- ============================================

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE public.visualizer_sessions
DROP CONSTRAINT IF EXISTS visualizer_sessions_lead_id_fkey;

-- Step 2: Add session_status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'visualizer_sessions' 
    AND column_name = 'session_status'
  ) THEN
    ALTER TABLE public.visualizer_sessions
    ADD COLUMN session_status text DEFAULT 'active';
  END IF;
END $$;

-- Step 3: Re-create foreign key pointing to kitchen_leads instead of leads
ALTER TABLE public.visualizer_sessions
ADD CONSTRAINT visualizer_sessions_lead_id_fkey
FOREIGN KEY (lead_id) REFERENCES public.kitchen_leads(id) ON DELETE CASCADE;

-- Step 4: Ensure RLS policies allow anonymous inserts
DROP POLICY IF EXISTS "anon_insert_visualizer_sessions" ON public.visualizer_sessions;
CREATE POLICY "anon_insert_visualizer_sessions"
ON public.visualizer_sessions
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 5: Ensure visualizer_images can be inserted anonymously
DROP POLICY IF EXISTS "anon_insert_visualizer_images" ON public.visualizer_images;
CREATE POLICY "anon_insert_visualizer_images"
ON public.visualizer_images
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================
-- DONE! ✅
-- ============================================
-- Fixed:
-- ✅ Added session_status column to visualizer_sessions
-- ✅ Fixed foreign key to point to kitchen_leads table
-- ✅ Ensured RLS policies allow anonymous inserts
-- ============================================
