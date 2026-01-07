-- ============================================
-- 1. CREATE VISUALIZER STORAGE BUCKETS
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
-- 2. DROP EXISTING POLICIES TO PREVENT ERRORS
-- ============================================

DO $$
BEGIN
    -- Drop policies for visualizer-inputs
    DROP POLICY IF EXISTS "public_read_visualizer_inputs" ON storage.objects;
    DROP POLICY IF EXISTS "anon_upload_visualizer_inputs" ON storage.objects;
    
    -- Drop policies for visualizer-renders
    DROP POLICY IF EXISTS "public_read_visualizer_renders" ON storage.objects;
    DROP POLICY IF EXISTS "anon_upload_visualizer_renders" ON storage.objects;
END $$;

-- ============================================
-- 3. CREATE VISUALIZER STORAGE POLICIES
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
