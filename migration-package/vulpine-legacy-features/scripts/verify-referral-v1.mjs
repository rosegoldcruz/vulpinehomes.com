#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

function fail(message) {
  console.error(`\n[FAIL] ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`[OK] ${message}`);
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) fail(`Missing required env var: ${name}`);
  return value;
}

function pickSiteUrl() {
  const raw = process.env.VERIFY_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

function randomPhone() {
  const suffix = String(Math.floor(Math.random() * 9000000) + 1000000);
  return `480${suffix}`;
}

function shouldRequireSecureCookie(siteUrl) {
  if (process.env.VERIFY_EXPECT_SECURE_COOKIE === "0") return false;
  if (process.env.VERIFY_EXPECT_SECURE_COOKIE === "1") return true;
  return siteUrl.startsWith("https://");
}

async function getClickCount(supabase, code) {
  const { count, error } = await supabase
    .from("referral_clicks")
    .select("*", { count: "exact", head: true })
    .eq("code", code);

  if (error) {
    fail(`Supabase click query failed: ${error.message}`);
  }

  return Number(count || 0);
}

async function main() {
  const siteUrl = pickSiteUrl();
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const runId = Date.now();
  const testEmail = `referral.verify.${runId}@example.com`;
  const testPhone = randomPhone();

  console.log(`\nReferral v1 verification against: ${siteUrl}`);
  console.log(`Test email: ${testEmail}`);
  console.log(`Test phone: ${testPhone}`);

  const createRes = await fetch(`${siteUrl}/api/referrals/create-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Referral Verify Referrer",
      email: testEmail,
      phone: testPhone,
    }),
  });

  const createBody = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    fail(`create-link failed (${createRes.status}): ${JSON.stringify(createBody)}`);
  }

  const code = createBody?.code;
  if (!code || typeof code !== "string") {
    fail("create-link did not return a referral code");
  }
  pass(`create-link returned code ${code}`);

  const clicksBefore = await getClickCount(supabase, code);

  const redirectRes = await fetch(
    `${siteUrl}/r/${encodeURIComponent(code)}?utm_source=referral&utm_medium=link&utm_campaign=500_referral&utm_term=verify`,
    {
      method: "GET",
      redirect: "manual",
    }
  );

  const location = redirectRes.headers.get("location") || "";
  const setCookie = redirectRes.headers.get("set-cookie") || "";

  if (redirectRes.status < 300 || redirectRes.status >= 400) {
    fail(`/r/[code] did not redirect. Status: ${redirectRes.status}`);
  }

  if (!location.includes("/vulpine/kitchen-quote")) {
    fail(`/r/[code] redirect location missing destination route: ${location}`);
  }

  if (!location.includes("utm_source=referral") || !location.includes("utm_campaign=500_referral")) {
    fail(`/r/[code] redirect did not preserve UTM params: ${location}`);
  }
  pass(`/r/[code] redirected with preserved UTMs -> ${location}`);

  if (!setCookie.includes(`vh_referral_code=${code}`)) {
    fail(`/r/[code] response missing referral cookie. set-cookie: ${setCookie || "<empty>"}`);
  }

  if (!/\bPath=\//i.test(setCookie) || !/\bSameSite=Lax\b/i.test(setCookie) || !/\bMax-Age=2592000\b/i.test(setCookie)) {
    fail(`/r/[code] cookie missing expected attributes. set-cookie: ${setCookie}`);
  }

  if (shouldRequireSecureCookie(siteUrl) && !/\bSecure\b/i.test(setCookie)) {
    fail(`/r/[code] cookie missing Secure attribute under production/https verification. set-cookie: ${setCookie}`);
  }
  pass("/r/[code] set cookie with path=/, SameSite=Lax, Max-Age=30 days");

  const clicksAfter = await getClickCount(supabase, code);
  if (clicksAfter < clicksBefore + 1) {
    fail(`Expected referral_clicks to increment. Before=${clicksBefore}, After=${clicksAfter}`);
  }
  pass(`/r/[code] click tracking incremented (${clicksBefore} -> ${clicksAfter})`);

  const leadPhone = randomPhone();
  const quoteForm = new FormData();
  quoteForm.set("name", "Referral Verify Lead");
  quoteForm.set("email", `lead.verify.${runId}@example.com`);
  quoteForm.set("phone", leadPhone);
  quoteForm.set("city", "Phoenix");
  quoteForm.set("referralCode", code);
  quoteForm.set("notes", "Referral verification run");

  const quoteRes = await fetch(`${siteUrl}/api/vulpine-kitchen-quote`, {
    method: "POST",
    headers: {
      Cookie: "vh_referral_code=INVALIDCOOKIECODE",
    },
    body: quoteForm,
  });

  const quoteBody = await quoteRes.json().catch(() => ({}));
  if (!quoteRes.ok || !quoteBody?.success) {
    fail(`quote submit failed (${quoteRes.status}): ${JSON.stringify(quoteBody)}`);
  }
  pass("Quote submission succeeded with typed referral code (overriding invalid cookie)");

  const { data: leadRow, error: leadError } = await supabase
    .from("leads")
    .select("id, referral_code, source, phone, created_at")
    .eq("phone", leadPhone)
    .eq("source", "kitchen_quote")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (leadError) {
    fail(`Supabase lead query failed: ${leadError.message}`);
  }

  if (!leadRow?.id) {
    fail("No mirrored lead row found in leads table for test quote submission");
  }

  if (leadRow.referral_code !== code) {
    fail(`Expected leads.referral_code=${code}, got ${leadRow.referral_code || "null"}`);
  }

  pass(`Supabase lead row is attributed correctly (referral_code=${code})`);

  console.log("\nVerification Pass: Complete");
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
