// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\lib\supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use placeholder values during build if env vars are not set
// This allows the build to complete - runtime will still fail if not configured
const supabaseUrl = url || "https://placeholder.supabase.co";
const supabaseKey = serviceKey || "placeholder-key";

if ((!url || !serviceKey) && process.env.NODE_ENV !== "production") {
  console.warn("Supabase env vars not fully configured. Using placeholder values for build.");
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey);
