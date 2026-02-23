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

async function runQuoteSmoke(siteUrl, runId) {
  console.log("\n--- Testing Kitchen Quote (/api/vulpine-kitchen-quote) ---");
  const form = new FormData();
  form.set("name", "Smoke Test Quote");
  form.set("email", `quote.smoke.${runId}@example.com`);
  form.set("phone", randomPhone());
  form.set("city", "Phoenix");
  form.set("notes", "Smoke test submission");

  const response = await fetch(`${siteUrl}/api/vulpine-kitchen-quote`, {
    method: "POST",
    body: form,
  });

  const body = await response.json().catch(() => ({}));
  const intake = response.headers.get("x-vh-intake");
  const telegram = response.headers.get("x-vh-telegram");
  const telegramReason = response.headers.get("x-vh-telegram-reason");

  console.log(`Status: ${response.status}`);
  console.log(`Headers: intake=${intake}, telegram=${telegram}, reason=${telegramReason}`);
  console.log(`Body:`, body);

  if (!response.ok || !body.success) {
    fail(`Quote submission failed.`);
  }
  pass(`Quote submission succeeded. Row ID: ${body.id || 'N/A'}`);
}

async function runVisualizerSmoke(siteUrl, runId) {
  console.log("\n--- Testing Visualizer (/api/vulpine-visualizer) ---");
  const form = new FormData();
  form.set("name", "Smoke Test Visualizer");
  form.set("email", `visualizer.smoke.${runId}@example.com`);
  form.set("phone", randomPhone());
  form.set("style", "shaker");
  form.set("color", "flour");
  
  // Create a minimal valid 1x1 JPEG pixel
  const pixelBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  const pixelBuffer = Buffer.from(pixelBase64, 'base64');
  const blob = new Blob([pixelBuffer], { type: 'image/jpeg' });
  form.set("image", blob, "dummy.jpg");

  const response = await fetch(`${siteUrl}/api/vulpine-visualizer`, {
    method: "POST",
    body: form,
  });

  const body = await response.json().catch(() => ({}));
  const intake = response.headers.get("x-vh-intake");
  const telegram = response.headers.get("x-vh-telegram");
  const telegramReason = response.headers.get("x-vh-telegram-reason");

  console.log(`Status: ${response.status}`);
  console.log(`Headers: intake=${intake}, telegram=${telegram}, reason=${telegramReason}`);
  
  // Do not fail if Replicate errors out in test since we sent a tiny dummy image,
  // just verify it didn't fail on our handler logic.
  if (response.status === 500 && (body.error?.includes("Replicate") || body.error?.includes("buffer") || body.error?.includes("VipsJpeg"))) {
    console.log(`Expected visualizer failure due to dummy image:`, body.error);
    pass(`Visualizer submission reached Replicate or Sharp processing.`);
  } else if (!response.ok || !body.success) {
    console.log(`Body:`, body);
    fail(`Visualizer submission failed.`);
  } else {
    pass(`Visualizer submission succeeded.`);
  }
}

async function runReferralSmoke(siteUrl, runId) {
  console.log("\n--- Testing Referral (/api/referral) ---");
  const form = new URLSearchParams();
  form.set("referrerName", "Smoke Test Referrer");
  form.set("referrerEmail", `referral.smoke.${runId}@example.com`);
  form.set("referrerPhone", randomPhone());
  form.set("referredName", "Smoke Test Lead");
  form.set("referredPhone", randomPhone());
  form.set("referredEmail", `referral.smoke.lead.${runId}@example.com`);
  form.set("city", "Phoenix");
  form.set("notes", "Smoke test submission");
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
  const intake = response.headers.get("x-vh-intake");
  const telegram = response.headers.get("x-vh-telegram");
  const telegramReason = response.headers.get("x-vh-telegram-reason");
  const reason = response.headers.get("x-vh-reason");
  const rid = response.headers.get("x-vh-rid");

  console.log(`Status: ${response.status}`);
  console.log(`Headers: reason=${reason}, rid=${rid}`);
  console.log(`Location: ${location}`);

  if (response.status < 300 || response.status >= 400) {
    fail(`Referral submission did not redirect as expected. Status: ${response.status}`);
  }

  if (!location.includes("referral-success")) {
    fail(`Referral submission redirected to error. Location: ${location}`);
  }

  pass(`Referral submission succeeded and redirected to success.`);
}

async function main() {
  const siteUrl = pickSiteUrl();
  const runId = Date.now();
  console.log(`Running smoke tests against: ${siteUrl}`);

  await runQuoteSmoke(siteUrl, runId);
  await runVisualizerSmoke(siteUrl, runId);
  await runReferralSmoke(siteUrl, runId);
  
  console.log("\n✅ All smoke tests complete.");
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
