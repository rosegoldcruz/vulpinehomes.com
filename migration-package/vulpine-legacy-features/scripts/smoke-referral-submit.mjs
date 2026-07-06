#!/usr/bin/env node

function fail(message) {
  console.error(`\n[FAIL] ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`[OK] ${message}`);
}

function pickSiteUrl() {
  const raw = process.env.SMOKE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

function randomPhone() {
  const suffix = String(Math.floor(Math.random() * 9000000) + 1000000);
  return `480${suffix}`;
}

async function main() {
  const siteUrl = pickSiteUrl();
  const runId = Date.now();

  const form = new URLSearchParams();
  form.set("referrerName", "Referral Smoke Referrer");
  form.set("referrerEmail", `referral.smoke.${runId}@example.com`);
  form.set("referrerPhone", randomPhone());
  form.set("referredName", "Referral Smoke Lead");
  form.set("referredPhone", randomPhone());
  form.set("referredEmail", `referral.smoke.lead.${runId}@example.com`);
  form.set("city", "Phoenix");
  form.set("notes", "Referral smoke test submission");
  form.set("consentAware", "yes");

  const response = await fetch(`${siteUrl}/api/referral`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
    redirect: "manual",
  });

  const location = response.headers.get("location") || "";
  const requestId = response.headers.get("x-vh-rid") || "";
  const reason = response.headers.get("x-vh-reason") || "";
  const buildTag = response.headers.get("x-vh-build") || "";
  const missingEnv = response.headers.get("x-vh-missing-env") || "";

  if (response.status < 300 || response.status >= 400) {
    const rawBody = await response.text().catch(() => "");
    fail(
      `Expected redirect, got ${response.status}. rid=${requestId || "n/a"}, reason=${reason || "n/a"}, build=${buildTag || "n/a"}, missing_env=${missingEnv || "n/a"}, body=${rawBody.slice(0, 300)}`
    );
  }

  if (buildTag !== "referral-diagnostics-v1") {
    fail(`Expected x-vh-build=referral-diagnostics-v1, got ${buildTag || "n/a"}`);
  }

  if (!location.includes("#referral-success")) {
    fail(
      `Expected success redirect, got location=${location}. rid=${requestId || "n/a"}, reason=${reason || "n/a"}, build=${buildTag || "n/a"}, missing_env=${missingEnv || "n/a"}`
    );
  }

  if (!requestId) {
    fail("Missing x-vh-rid response header");
  }

  pass(`Referral submit redirected to success. rid=${requestId} build=${buildTag}`);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
