# Vulpine Legacy Features — Migration Package

> **Purpose**: Portable extraction of five legacy feature groups from `rosegoldcruz/vulpinehomes.com` for migration into the new Vulpine Homes Next.js site.
> **Generated**: 2026-06-14
> **Repo audited**: `rosegoldcruz/vulpinehomes.com` (default branch: `main`)
> **Architecture**: App Router Next.js 14, TypeScript 5, Tailwind 3, Supabase 2

No production routes were modified. No files were invented. All paths are relative to the repository root.

---

## Feature Inventory

| # | Feature | Status | Pages | API Routes | Key Components |
|---|---------|--------|-------|-----------|----------------|
| 1 | Cabinet Refacing / City Landing Pages | ✅ Included | 12 city pages + 1 hub | — | CityLandingPage, BeforeAfterSlider |
| 2 | Product Configurator | ✅ Included | `/products` | — | ColorSelector, PullsSelector |
| 3 | AI Visualizer | ✅ Included | `/visualizer` | `/api/vulpine-visualizer` | KitchenVisualizer, VisualizerProvider |
| 4 | Referral Program | ✅ Included | `/refer`, `/referral`, `/r/[code]` | `/api/referral`, `/api/referrals/create-link` | ReferralLinkGenerator |
| 5 | Kitchen Quote / Contact Form | ✅ Included | `/vulpine/kitchen-quote` | `/api/vulpine-kitchen-quote` | Testimonials |

---

## Exact Source Files Included

### 1. Cabinet Refacing

**Data layer**
- `app/cabinet-refacing-city-data.ts` — City keys, metadata generator, `CITY_LANDING_DATA` map; imports `./city-landing-content.json`
- `app/city-landing-content.json` — City-level content (hero text, FAQs, projects, before/after arrays) for all 12 cities

**Components**
- `app/components/city/CityLandingPage.tsx` — Main city landing template; imports `BeforeAfterSlider`, `CITY_LANDING_DATA`
- `app/components/city/BeforeAfterSlider.tsx` — Interactive slider; uses `public/before-after/` images

**City pages** (each imports `getCityMetadata` and `CityLandingPage`)
- `app/cabinet-refacing-anthem/page.tsx`
- `app/cabinet-refacing-buckeye/page.tsx`
- `app/cabinet-refacing-chandler/page.tsx`
- `app/cabinet-refacing-gilbert/page.tsx`
- `app/cabinet-refacing-glendale/page.tsx`
- `app/cabinet-refacing-goodyear/page.tsx`
- `app/cabinet-refacing-mesa/page.tsx`
- `app/cabinet-refacing-peoria/page.tsx`
- `app/cabinet-refacing-phoenix-az/page.tsx`
- `app/cabinet-refacing-scottsdale/page.tsx`
- `app/cabinet-refacing-surprise/page.tsx`
- `app/cabinet-refacing-tempe/page.tsx`

**Hub page** (full service overview)
- `app/kitchen-cabinet-refacing/page.tsx` — imports `Navigation`, `CTAButton`, `ServiceSchema`, `CITY_LANDING_DATA`

**Assets**
- `public/before-after/` — before/after JPEG pairs (12 sets; included in this package)

---

### 2. Product Configurator

**Pages**
- `app/products/page.tsx` — Main configurator page (client component); imports `ColorSelector`, `PullsSelector`, `CTAButton`, `ProductListSchema`, `visualizerStore`
- `app/products/layout.tsx` — Layout wrapper with metadata

**Components**
- `app/components/ColorSelector.tsx` — Door style + color picker; reads `public/cabs_clean/dataset.json` and `public/cabs_clean/doors/**`
- `app/components/PullsSelector.tsx` — Hardware/pulls picker; reads `public/cabs_clean/hardware/**`
- `app/components/CTAButton.tsx` — Shared CTA button (no external deps)
- `app/components/schemas/ProductListSchema.tsx` — JSON-LD product schema

**State**
- `app/lib/visualizerStore.ts` — `localStorage`-based config/lead persistence; no external deps

**Assets**
- `public/cabs_clean/dataset.json` — Product catalog (door styles, colors, hardware) — **included**
- `public/cabs_clean/doors/**` — Door style preview images (69 MB total) — **NOT included** (see [Binary Assets](#binary-assets))
- `public/cabs_clean/hardware/**` — Hardware preview images — **NOT included** (see [Binary Assets](#binary-assets))
- `public/product-menu-vulpine/1.png` through `4.png` — Product category menu thumbnails — **included**

---

### 3. AI Visualizer

**Pages**
- `app/visualizer/page.tsx` — Entry page; wraps `KitchenVisualizer` in a server component
- `app/visualizer/CabinetVisionPage.tsx` — Alternate static vision page (client component); imports only `Navigation`

**Components**
- `app/components/KitchenVisualizer.tsx` — Core upload + generation UI; imports `visualizerStore`, `VisualizerProvider`, `GoogleAnalytics.trackEvent`
- `app/components/VisualizerProvider.tsx` — React context that holds photo `File` objects across navigation

**API route**
- `app/api/vulpine-visualizer/route.ts` — `POST` handler: normalises image, uploads to Supabase `visualizations` bucket, calls Replicate, saves lead to `kitchen_leads` table, sends Telegram alert. `GET` returns health-check JSON.

**Lib**
- `lib/visualizer/engine.ts` — Image normalisation + Supabase upload helpers; type definitions for door/hardware IDs; imports `supabaseServer`, `sharp`
- `lib/visualizer/geminiService.ts` — Vertex AI cabinet-parameter extraction service; uses ADC or `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
- `lib/supabaseServer.ts` — Supabase anon/service client (shared)
- `lib/telegram.ts` — Telegram lead notification helpers (shared)

---

### 4. Referral Program

**Pages**
- `app/refer/page.tsx` — Public referral landing (`force-static`); imports `ReferralLinkGenerator`, `getSiteUrl`
- `app/refer/ReferralLinkGenerator.tsx` — Client component; generates shareable links from user input

**Redirect routes**
- `app/referral/route.ts` — Legacy redirect (`/referral` → `/refer`)
- `app/r/[code]/route.ts` — Referral link tracker; increments click count in `referral_codes` table then redirects

**API routes**
- `app/api/referral/route.ts` — `POST`: validates phone/email, deduplicates, inserts `referral_submissions`, sends Telegram alert, tracks analytics
- `app/api/referrals/create-link/route.ts` — `POST`: validates inputs, generates code, inserts into `referral_codes`, returns share URL

**Lib**
- `lib/referralProgram.ts` — Code generation, URL building, normalisation helpers
- `lib/referralStatus.ts` — Lead/job status enums and derivation logic
- `lib/phoneNormalizer.ts` — Phone normalisation + email validation
- `lib/requestRateLimit.ts` — IP-based rate limiting (in-memory, resets on cold start)
- `lib/supabaseServer.ts` — Shared (see Visualizer)
- `lib/telegram.ts` — Shared (see Visualizer)

**Database / SQL**
- `create_referral_program_v1.sql` — Creates `referral_codes` and `referral_submissions` tables, policies, indexes
- `add_referral_clicks_affiliate.sql` — Adds click-tracking columns to `referral_codes`
- `supabase-fixes.sql` — RLS policy patches

**Verification scripts**
- `scripts/verify-referral-v1.mjs` — End-to-end referral API smoke test
- `scripts/smoke-referral-submit.mjs` — Submission smoke test
- `scripts/smoke-test-all.mjs` — Full smoke test suite

---

### 5. Kitchen Quote / Contact Form

**Pages**
- `app/vulpine/kitchen-quote/page.tsx` — Multi-step quote form (client component); imports `Testimonials`, `Motion` animations, `cn`, `trackEvent`
- `app/vulpine/kitchen-quote/Testimonials.tsx` — Testimonial cards component

**API route**
- `app/api/vulpine-kitchen-quote/route.ts` — `POST`: validates inputs, deduplicates by phone window, optionally uploads photos to Supabase storage with bucket fallback (`visualizations`, `kitchen-photos`, `visualizer-inputs`), inserts into `kitchen_leads` + `leads` tables, sends Telegram alert, normalises referral code

**Lib**
- `lib/supabaseServer.ts` — Shared
- `lib/telegram.ts` — Shared
- `lib/phoneNormalizer.ts` — Shared
- `lib/referralProgram.ts` — Shared

---

### Shared Components / Utilities

| File | Used By |
|------|---------|
| `app/components/Navigation.tsx` | kitchen-cabinet-refacing, CabinetVisionPage |
| `app/components/ui/Motion.tsx` | kitchen-quote page, Testimonials |
| `app/components/GoogleAnalytics.tsx` | KitchenVisualizer (trackEvent), layout |
| `app/components/schemas/ServiceSchema.tsx` | kitchen-cabinet-refacing |
| `app/components/schemas/FAQSchema.tsx` | city pages (via CityLandingPage) |
| `app/components/schemas/EntitySchema.tsx` | available for SEO |
| `app/components/linking/InternalLinking.tsx` | city pages, refacing hub |
| `app/config/internal-linking.ts` | InternalLinking |
| `app/components/CountUp.tsx` | various feature pages |
| `lib/utils.ts` | Motion.tsx (cn helper) |
| `lib/analytics.ts` | API routes (page-view tracking) |
| `lib/navigation.ts` | Navigation.tsx (NAV_ITEMS) |
| `lib/supabaseAdmin.ts` | admin referrals, affiliate (not extracted but included) |
| `app/globals.css` | global styles |
| `tailwind.config.ts` | Tailwind config |
| `tsconfig.json` | TypeScript path aliases |
| `next.config.js` | Next.js image patterns |
| `package.json` | npm dependency reference |

---

## Import Graph / Dependency Notes

```
Cabinet Refacing:
  app/cabinet-refacing-*/page.tsx
    → app/cabinet-refacing-city-data.ts
        → app/city-landing-content.json
    → app/components/city/CityLandingPage.tsx
        → app/components/city/BeforeAfterSlider.tsx
            → public/before-after/*.jpg

  app/kitchen-cabinet-refacing/page.tsx
    → app/components/Navigation.tsx → lib/navigation.ts
    → app/components/CTAButton.tsx
    → app/components/schemas/ServiceSchema.tsx
    → app/cabinet-refacing-city-data.ts

Product Configurator:
  app/products/page.tsx
    → app/components/ColorSelector.tsx → public/cabs_clean/**
    → app/components/PullsSelector.tsx → public/cabs_clean/**
    → app/components/CTAButton.tsx
    → app/components/schemas/ProductListSchema.tsx
    → app/lib/visualizerStore.ts   (localStorage only)

Visualizer:
  app/visualizer/page.tsx
    → app/components/KitchenVisualizer.tsx
        → app/components/GoogleAnalytics.tsx (trackEvent)
        → app/lib/visualizerStore.ts
        → app/components/VisualizerProvider.tsx

  app/api/vulpine-visualizer/route.ts
    → lib/supabaseServer.ts → @supabase/supabase-js
    → lib/telegram.ts
    → replicate (npm)
    → sharp (npm)

  lib/visualizer/engine.ts
    → lib/supabaseServer.ts
    → sharp

  lib/visualizer/geminiService.ts
    → @google-cloud/vertexai

Referral:
  app/refer/page.tsx
    → app/refer/ReferralLinkGenerator.tsx
    → lib/referralProgram.ts

  app/r/[code]/route.ts
    → lib/supabaseServer.ts
    → lib/referralProgram.ts

  app/api/referral/route.ts
    → lib/supabaseServer.ts
    → lib/phoneNormalizer.ts
    → lib/referralProgram.ts
    → lib/requestRateLimit.ts
    → lib/telegram.ts

  app/api/referrals/create-link/route.ts
    → lib/supabaseServer.ts
    → lib/referralProgram.ts
    → lib/phoneNormalizer.ts
    → lib/requestRateLimit.ts

Kitchen Quote:
  app/vulpine/kitchen-quote/page.tsx
    → app/vulpine/kitchen-quote/Testimonials.tsx
    → app/components/ui/Motion.tsx → lib/utils.ts → clsx, tailwind-merge
    → app/components/GoogleAnalytics.tsx (trackEvent)

  app/api/vulpine-kitchen-quote/route.ts
    → lib/supabaseServer.ts
    → lib/telegram.ts
    → lib/phoneNormalizer.ts
    → lib/referralProgram.ts
```

---

## Required npm Packages

All are already present in `package.json`. The subset critical for these features:

| Package | Version | Used By |
|---------|---------|---------|
| `next` | `^14.2.35` | All |
| `react` / `react-dom` | `^18.3.0` | All |
| `typescript` | `^5` | All |
| `tailwindcss` | `^3.4.0` | All |
| `@supabase/supabase-js` | `^2.39.0` | Visualizer, Referral, Quote |
| `replicate` | `^0.31.0` | Visualizer API |
| `sharp` | `^0.34.5` | Visualizer API, engine.ts |
| `@google-cloud/vertexai` | `^1.10.0` | lib/visualizer/geminiService.ts |
| `framer-motion` | `^12.23.25` | Motion.tsx, CountUp.tsx |
| `clsx` | `^2.1.1` | lib/utils.ts |
| `tailwind-merge` | `^3.4.0` | lib/utils.ts |
| `twilio` | `^5.0.0` | lib/twilio.ts (included but not directly wired to these 5 features) |
| `lucide-react` | `^0.562.0` | Navigation, various UI |
| `@vercel/analytics` | `^1.6.1` | Analytics.tsx |
| `@vercel/speed-insights` | `^1.3.1` | Analytics.tsx |

---

## Required Environment Variables

> **Important**: All values are intentionally left empty. Never commit real secrets.

```env
# ── Supabase ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# ── Replicate (AI image generation) ──────────────────────────────────────────
REPLICATE_API_TOKEN=
REPLICATE_MODEL=
REPLICATE_STEPS=
REPLICATE_GUIDANCE=

# ── Telegram lead alerts ──────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# (Aliases accepted by lib/telegram.ts:)
TELEGRAM_API_TOKEN=
TELEGRAM_BOT_API_KEY=
TELEGRAM_TO_CHAT_ID=

# ── Google Cloud / Vertex AI (geminiService.ts) ───────────────────────────────
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=
# (Fallback — set automatically from above on Vercel:)
GOOGLE_APPLICATION_CREDENTIALS=

# ── Site URL (referral links) ─────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=

# ── Analytics (optional for these features) ──────────────────────────────────
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
GA_API_SECRET=
NEXT_PUBLIC_FB_PIXEL_ID=
FB_CONVERSIONS_API_TOKEN=
META_PIXEL_ID=
META_CONVERSIONS_API_TOKEN=
META_TEST_EVENT_CODE=
```

---

## Asset Paths Needed

### Included in this package
| Path | Size | Used By |
|------|------|---------|
| `public/before-after/*.jpg` | ~2.7 MB | BeforeAfterSlider (city pages) |
| `public/product-menu-vulpine/1-4.png` | ~6.5 MB | Products page |
| `public/cabs_clean/dataset.json` | tiny | ColorSelector, PullsSelector |
| `public/doors.png` | small | Various pages |

### NOT included — transfer separately
| Path | Size | Used By |
|------|------|---------|
| `public/cabs_clean/doors/**` | ~69 MB total | ColorSelector — door preview images |
| `public/cabs_clean/hardware/**` | part of 69 MB | PullsSelector — hardware preview images |
| `public/cabs_clean/kitchens/**` | part of 69 MB | Kitchen style previews |
| `public/vids/*.mp4` | ~56 MB | Hero video, gallery (NOT part of these 5 features) |

> Transfer the full `public/cabs_clean/` directory from the source repo to the new site. The product configurator will not render properly without the image assets.

---

## API / Form Submission Behaviour

### `POST /api/vulpine-visualizer`
- Accepts `multipart/form-data`: `image` (File), `name`, `phone`, `email`, `style`, `color`, `hardwareStyle`, `hardwareColor`, `prompt`
- Normalises EXIF orientation via `sharp`
- Uploads original to Supabase `visualizations` bucket
- Calls Replicate with `REPLICATE_MODEL` (defaults to SDXL)
- Saves result to `kitchen_leads` table
- Sends Telegram alert
- Returns `{ success, result: { originalUrl, finalUrl, promptUsed } }`

### `POST /api/vulpine-kitchen-quote`
- Accepts `multipart/form-data`: contact info + optional photo files + referral code
- Deduplicates by phone (10-minute window) against `leads` table
- Uploads photos to first available bucket: `visualizations`, `kitchen-photos`, `visualizer-inputs`
- Inserts into `kitchen_leads` and `leads` tables
- Normalises referral code and links to `referral_codes` table
- Sends Telegram alert

### `POST /api/referral`
- Accepts JSON: `{ name, phone, email, referralCode?, city? }`
- Rate-limited (IP-based, in-memory)
- Validates phone/email, deduplicates
- Inserts into `referral_submissions`
- Sends Telegram alert

### `POST /api/referrals/create-link`
- Accepts JSON: `{ name, email, phone? }`
- Rate-limited
- Generates 9-char alphanumeric code, inserts into `referral_codes`
- Returns `{ code, shareUrl }`

### `GET /r/[code]`
- Increments click counter in `referral_codes`
- Redirects to homepage with UTM params

---

## Known Broken / Stale Code

1. **`lib/visualizer/geminiService.ts`** — Vertex AI parameter extraction is defined but not wired into `/api/vulpine-visualizer/route.ts`. The route uses Replicate directly. `geminiService` is dead code unless manually integrated.
2. **`lib/visualizer/engine.ts`** — Contains a more complete pipeline (image normalisation, Supabase upload helpers, VULPINE_COLORS map) that partially duplicates logic inside `route.ts`. Engine.ts is not imported by the route — it was likely a refactoring work-in-progress.
3. **`app/visualizer/CabinetVisionPage.tsx`** — Exists alongside `KitchenVisualizer` but `page.tsx` uses `KitchenVisualizer`. `CabinetVisionPage` appears to be an alternate/draft version.
4. **`lib/requestRateLimit.ts`** — In-memory rate limiting resets on serverless cold starts; not suitable for high-traffic production without switching to a Redis-backed store.
5. **`app/api/vulpine-kitchen-quote/route.ts`** — References storage bucket `kitchen-photos` which may not exist in the new Supabase project (uses fallback list).
6. **`scripts/smoke-test-all.mjs`** — Hardcoded base URL (`https://www.vulpinehomes.com`); update before running against new deployment.
7. **Windows-style path comments** (`// File: C:\Users\cruz\...`) appear in several files — these are cosmetic and harmless.

---

## Database Tables Required

These features expect the following Supabase tables (SQL provided in this package):

| Table | Created By | Used By |
|-------|-----------|---------|
| `referral_codes` | `create_referral_program_v1.sql` | Referral program |
| `referral_submissions` | `create_referral_program_v1.sql` | Referral API |
| `kitchen_leads` | `create_visualizer_v2.sql` | Visualizer, Kitchen Quote |
| `leads` | `supabase-fixes.sql` (see SQL) | Kitchen Quote (mirror table) |
| `page_views` | `lib/analytics.ts` (runtime) | Analytics |

Storage buckets:
- `visualizations` — required for Visualizer and Kitchen Quote photo uploads
- `kitchen-photos` — optional fallback for Kitchen Quote
- `visualizer-inputs` — optional fallback

---

## Recommended Migration Order

### Phase 1 — Foundations (no external deps)
1. **Apply SQL schemas** (`create_referral_program_v1.sql`, `create_visualizer_v2.sql`, `supabase-fixes.sql`, `add_referral_clicks_affiliate.sql`, `create_visualizer_buckets.sql`) against the new Supabase project
2. Set all required environment variables in the new project
3. Configure Supabase storage buckets (`visualizations`, `kitchen-photos`)

### Phase 2 — Referral program (lowest risk, no AI deps)
4. Port `lib/referralProgram.ts`, `lib/referralStatus.ts`, `lib/phoneNormalizer.ts`, `lib/requestRateLimit.ts`, `lib/supabaseServer.ts`, `lib/telegram.ts`
5. Port `app/refer/page.tsx` + `ReferralLinkGenerator.tsx`
6. Port `app/r/[code]/route.ts` and `app/referral/route.ts`
7. Port `app/api/referral/route.ts` and `app/api/referrals/create-link/route.ts`
8. Run `scripts/verify-referral-v1.mjs` against staging

### Phase 3 — Cabinet refacing / city pages (no API needed)
9. Port `app/cabinet-refacing-city-data.ts` + `app/city-landing-content.json`
10. Port `app/components/city/CityLandingPage.tsx` + `BeforeAfterSlider.tsx`
11. Copy `public/before-after/` assets
12. Port each city `page.tsx` (12 pages + hub)

### Phase 4 — Product configurator (no API needed)
13. Transfer `public/cabs_clean/` assets (all ~69 MB)
14. Port `app/lib/visualizerStore.ts`
15. Port `app/components/ColorSelector.tsx` + `PullsSelector.tsx`
16. Port `app/products/page.tsx` + `layout.tsx`

### Phase 5 — Visualizer (requires Replicate + Supabase storage)
17. Ensure `REPLICATE_API_TOKEN` and storage are configured
18. Port `app/components/VisualizerProvider.tsx` + `KitchenVisualizer.tsx`
19. Port `app/api/vulpine-visualizer/route.ts`
20. Port `app/visualizer/page.tsx`

### Phase 6 — Kitchen quote form
21. Port `app/vulpine/kitchen-quote/page.tsx` + `Testimonials.tsx`
22. Port `app/api/vulpine-kitchen-quote/route.ts`
23. End-to-end test with `scripts/smoke-test-all.mjs`

---

## What to Bring Into the New Repo First

1. `lib/supabaseServer.ts` — foundation; everything else depends on it
2. `lib/telegram.ts` — lead alert pipeline used by all API routes
3. `lib/phoneNormalizer.ts` + `lib/requestRateLimit.ts` — input safety layer
4. `lib/referralProgram.ts` — URL/code helpers; used by multiple API routes
5. SQL schemas — must exist before any runtime code that writes to DB

---

## missing_or_unresolved_dependencies

The following items are referenced by the extracted files but are either absent from the repo or intentionally excluded from this package:

| Item | Referenced In | Status |
|------|--------------|--------|
| `public/cabs_clean/doors/**` images | `ColorSelector.tsx`, `PullsSelector.tsx` | Present in source repo — **not copied** (69 MB binary assets; transfer manually) |
| `public/cabs_clean/hardware/**` images | `PullsSelector.tsx` | Present in source repo — **not copied** (part of 69 MB; transfer manually) |
| `public/cabs_clean/kitchens/**` images | `ColorSelector.tsx` kitchen previews | Present in source repo — **not copied** |
| `public/cabs_clean/hardware.zip` | Not directly imported, but exists in source | Not copied |
| `public/vids/*.mp4` | Hero/gallery video (not part of these 5 features) | Not copied |
| Supabase `kitchen_leads` table schema | `app/api/vulpine-visualizer/route.ts` | Schema partially in `create_visualizer_v2.sql` — verify columns match |
| Supabase `leads` table schema | `app/api/vulpine-kitchen-quote/route.ts` | Partial in `supabase-fixes.sql` — verify the full schema |
| Supabase `visualizations` storage bucket | Visualizer + Kitchen Quote | Must be created manually in new project; SQL in `create_visualizer_buckets.sql` |
| `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` contents | `lib/visualizer/geminiService.ts` | Secret — must be obtained from Google Cloud Console |
| `REPLICATE_MODEL` value | Visualizer API | Default: `stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b` |
| `lib/twilio.ts` (included) but no Twilio-wired feature | — | Included for completeness; no active feature in these 5 groups uses Twilio directly |
| `app/components/Navigation.tsx` refs `lib/navigation.ts` and `app/components/ui/tabs.tsx` | Navigation | Both included |
| `app/components/ui/tabs.tsx` | Navigation.tsx | Present in source but **not copied** (not a feature file) — add to new project's UI library or copy from `app/components/ui/tabs.tsx` |

---

*This package was assembled by auditing source imports and verified against the actual file tree. No files were invented. All missing items are documented above.*
