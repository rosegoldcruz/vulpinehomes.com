# Vulpine AI Kitchen Visualizer (v2)

Production-grade, multi-stage AI kitchen visualizer for Vulpine Homes, built on Next.js, Supabase, Replicate, OpenAI, and Twilio.

This README documents **only the v2 multi-stage pipeline** that powers `/visualizer`.
For the legacy single-stage implementation, see `VISUALIZER_SETUP.md`.

---

## 1. Architecture Overview

**Frontend**
- `app/visualizer/page.tsx`
  - Multi-step flow: **Upload → Style & Settings → AI Pipeline → Results**
  - Style chosen via **door photos**, colors via **chip swatches**
  - Sends photos + options to `/api/vulpine-visualizer`
  - Shows pipeline progress (segmentation → prompt → redesign → LoRA → composite)
  - Renders multi-photo **before/after slider** with multiple design variations

**API Route (orchestration)**
- `app/api/vulpine-visualizer/route.ts`
  - Accepts `roomType`, `style`, `color`, `designCount`, `intervention`, `instructions`
  - Accepts multiple `photo_*` files
  - Calls into `lib/visualizer/engine.ts` for each stage
  - Persists a row into `kitchen_leads`
  - Sends Twilio SMS to **you** (`sendKitchenSMS`) and **customer** (`sendVisualizerCustomerSMS`)

**Multi-stage engine**
- `lib/visualizer/engine.ts`
  1. **Segmentation** – Replicate Grounded SAM → cabinet mask only
  2. **Prompt enhancement** – OpenAI → `positivePrompt` / `negativePrompt`
  3. **Cabinet-only redesign** – Flux fill/img2img, masked to cabinets
  4. **Style LoRA enforcement** – SDXL + ControlNet + per-style LoRA
  5. **Compositing** – Node `canvas` overlays redesigned cabinets onto original
  6. **Supabase upload** – Saves PNGs into `visualizations` bucket and returns public URLs
  7. **Caching (optional)** – In-process caches for segmentation + prompt enhancement

**Lead storage + notifications**
- `kitchen_leads` table in Supabase stores:
  - Contact info, `room_type`, `selected_style`, `selected_color`
  - `design_count`, `intervention_strength`, `custom_instructions`
  - `original_images[]`, `design_images[]`, `source = 'vulpine_visualizer_v2'`
- `lib/twilio.ts` handles:
  - `sendKitchenSMS` → text to your business number with lead + image URLs
  - `sendVisualizerCustomerSMS` → friendly confirmation to the customer

---

## 2. Environment Variables

Copy `.env.example` to `.env.local` (for local dev) and mirror the same keys in Vercel.

**Supabase**
- `NEXT_PUBLIC_SUPABASE_URL` – from Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` – service role key (server only)

**Twilio**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` – Twilio phone that sends texts
- `TWILIO_TO_PHONE_NUMBER` – your business cell to receive leads

**Replicate**
- `REPLICATE_API_TOKEN` – core token for all models
- `REPLICATE_GROUNDED_SAM_MODEL` – Grounded SAM segmentation model slug
- `REPLICATE_FLUX_FILL_MODEL` – Flux fill / img2img model slug
- `REPLICATE_SDXL_CONTROLNET_MODEL` – SDXL + ControlNet + LoRA model slug

**OpenAI (prompt enhancement layer)**
- `OPENAI_API_KEY`
- `OPENAI_PROMPT_MODEL` (optional, defaults to `gpt-4.1-mini`)

See `.env.example` for comments and sample values.

---

## 3. Supabase Schema & Storage

### 3.1. Kitchen leads table + visualizations bucket (v2)

Run `create_visualizer_v2.sql` in the Supabase SQL editor:

1. Go to **Supabase Dashboard → SQL → New query**
2. Paste the contents of `create_visualizer_v2.sql`
3. Click **Run**

This will:
- Create `public.kitchen_leads` (if it does not exist) with all v2 columns
- Add helpful indexes on `created_at` and `phone`
- Enable RLS + simple anon-insert / auth-read policies
- Create a **`visualizations`** storage bucket (public)
- Add a `public_read_visualizations` policy so image URLs work without auth

### 3.2. Legacy kitchen_quotes + v1 visualizer (optional)

If you still use the old quote form / v1 visualizer, also run:
- `supabase-fixes.sql` (full kitchen_quotes setup)
- `create_visualizer_buckets.sql` (v1 `visualizer-inputs` / `visualizer-renders` buckets)

v2 does **not** depend on these, but other parts of the app might.

---

## 4. Running Locally

1. Install dependencies:
   - `npm install`
2. Create `.env.local` from `.env.example` and fill in all values
3. Start dev server:
   - `npm run dev`
4. Open `http://localhost:3000/visualizer`
5. Upload 1–3 kitchen photos, choose door + color, fill in contact info
6. Click **Generate My Makeover →** and watch the pipeline progress text update

---

## 5. Deploying on Vercel

1. Push all changes to GitHub (this repo)
2. In Vercel dashboard for this project:
   - Go to **Settings → Environment Variables**
   - Add everything from `.env.example` (Supabase, Twilio, Replicate, OpenAI)
   - Scope to **Production + Preview + Development**
3. Ensure the project uses the **Node.js runtime** for `/api/vulpine-visualizer`
   - Already set via `export const runtime = "nodejs";`
4. Trigger a deploy:
   - Push to `main`, or
   - Click **Redeploy** on the latest deployment
5. Once live, hit `https://your-domain/visualizer`

---

## 6. Stress Testing the Pipeline

Goal: verify the pipeline can process **3–5 images** within ~60 seconds.

### Manual stress test (no extra tools)
1. Prepare a folder of 5 real kitchen photos (good lighting, straight-on views)
2. Open `/visualizer` in an incognito window
3. Upload all 5 photos at once
4. Choose a demanding combo:
   - Room type: Kitchen
   - Style: Fusion or Shaker
   - Color: dark wood or high-contrast color
   - Designs: set slider to **4**
   - Intervention: **0.3–0.35**
5. Start a timer when you click **Generate My Makeover**
6. Confirm:
   - Progress text walks through all stages
   - At least 4 designs per photo are returned
   - Cabinets change style/color strongly; floors, counters, appliances stay fixed
   - Total time stays under ~60 seconds (network + model latency dependent)

### Programmatic stress test (optional)
- Use a tool like Postman, k6, or a small Node script to POST to
  `/api/vulpine-visualizer` with pre-recorded images.
- Keep concurrent runs modest (e.g. 2–3 at a time) to avoid hitting
  Replicate / OpenAI rate limits.

---

## 7. Caching & Performance Notes

The engine includes **simple in-process caches**:
- Segmentation results keyed by `originalUrl`
- Prompt enhancement keyed by `(style, color, userPrompt)`

These reduce duplicate calls when:
- The same image is re-run, or
- The same style/color/instructions are requested repeatedly on a warm lambda.

For heavier scale you can extend this to Redis or a Supabase table, but
the current setup keeps things fast and simple while meeting the 3–5 image
/ ~60 second target under normal load.

