-- ============================================
-- ADD MISSING VISUALIZER COLUMNS
-- ============================================

ALTER TABLE public.kitchen_quotes
ADD COLUMN IF NOT EXISTS original_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS visualizer_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS selected_style text,
ADD COLUMN IF NOT EXISTS selected_color text;

-- Force schema cache reload (sometimes needed)
NOTIFY pgrst, 'reload config';
