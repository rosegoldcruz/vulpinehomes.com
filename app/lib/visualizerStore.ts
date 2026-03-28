/**
 * visualizerStore.ts
 *
 * Three separate localStorage buckets:
 *  1. vph_active_config  — latest product selection from /products (always overwritten when user clicks "Visualize Now")
 *  2. vph_lead_session   — persisted contact info (name, phone, email)
 *
 * Photos are NOT in localStorage — they are held as File objects in VisualizerProvider (React context)
 * because File objects cannot be serialised and kitchen photos are too large for localStorage.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface ActiveConfig {
  /** Normalised API id: "shaker" | "shaker-slide" | "slab" | "fusion-shaker" | "fusion-slide" */
  doorStyleId: string;
  doorStyleLabel: string;
  /** Path used as thumbnail on the visualizer page */
  doorStyleImage: string;
  /** Display name, e.g. "Flour" */
  colorName: string;
  colorHex: string;
  /** e.g. "artisan" */
  hardwareStyleId: string;
  hardwareStyleLabel: string;
  /** Best available image for this style */
  hardwareStyleImage: string;
  /** Normalised API finish: "satinnickel" | "chrome" | "black" | "rose_gold" | "gold" | "bronze" */
  hardwareFinishId: string;
  hardwareFinishLabel: string;
  hardwareFinishHex: string;
  updatedAt: string;
}

export interface LeadSession {
  name: string;
  phone: string;
  email: string;
}

// ── ID normalisers ─────────────────────────────────────────────────────────

/**
 * /products uses "shaker-classic"; the API expects "shaker".
 */
export function normalizeApiDoorStyleId(id: string): string {
  const map: Record<string, string> = {
    "shaker-classic": "shaker",
    "shaker-slide": "shaker-slide",
    "fusion-shaker": "fusion-shaker",
    "fusion-slide": "fusion-slide",
    slab: "slab",
  };
  return map[id] ?? id;
}

/**
 * PullsSelector uses inconsistent finish keys (rosegold vs rose_gold, matteblack vs matte_black).
 * The API expects: satinnickel | chrome | black | rose_gold | gold | bronze
 */
export function normalizeApiFinishId(id: string): string {
  const map: Record<string, string> = {
    rosegold: "rose_gold",
    rose_gold: "rose_gold",
    satinnickel: "satinnickel",
    satin_nickel: "satinnickel",
    matteblack: "black",
    matte_black: "black",
    chrome: "chrome",
    gold: "gold",
    bronze: "bronze",
  };
  return map[id] ?? id;
}

// ── Active config ──────────────────────────────────────────────────────────

const KEY_CONFIG = "vph_active_config";

export function saveActiveConfig(config: Omit<ActiveConfig, "updatedAt">): void {
  try {
    localStorage.setItem(
      KEY_CONFIG,
      JSON.stringify({ ...config, updatedAt: new Date().toISOString() })
    );
  } catch {
    // localStorage unavailable (SSR, private mode quota exceeded) — fail silently
  }
}

export function loadActiveConfig(): ActiveConfig | null {
  try {
    const raw = localStorage.getItem(KEY_CONFIG);
    return raw ? (JSON.parse(raw) as ActiveConfig) : null;
  } catch {
    return null;
  }
}

// ── Lead session ───────────────────────────────────────────────────────────

const KEY_LEAD = "vph_lead_session";

export function saveLeadSession(lead: LeadSession): void {
  try {
    localStorage.setItem(KEY_LEAD, JSON.stringify(lead));
  } catch {}
}

export function loadLeadSession(): LeadSession | null {
  try {
    const raw = localStorage.getItem(KEY_LEAD);
    return raw ? (JSON.parse(raw) as LeadSession) : null;
  } catch {
    return null;
  }
}
