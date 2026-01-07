// app/api/analytics/report/route.ts
// Sends traffic report to Telegram - can be called by cron

import { NextRequest, NextResponse } from "next/server";
import { getTrafficStats, getLeadStats } from "@/lib/analytics";

export const runtime = "nodejs";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

async function sendTelegramMessage(text: string) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram not configured");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      console.error("Telegram send failed:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram error:", err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  // Check for cron secret (optional security)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow without auth in dev, but check in prod
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Get hours from query param (default 24)
  const url = new URL(req.url);
  const hours = parseInt(url.searchParams.get("hours") || "24");

  const traffic = await getTrafficStats(hours);
  const leads = await getLeadStats(hours);

  if (!traffic || !leads) {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }

  // Format the report
  const topPagesText = traffic.topPages.length > 0
    ? traffic.topPages.map(p => `  • ${p.path}: ${p.count}`).join("\n")
    : "  No page views";

  const devicesText = traffic.devices.length > 0
    ? traffic.devices.map(d => `  • ${d.device}: ${d.count}`).join("\n")
    : "  No device data";

  const message = `📊 <b>TRAFFIC REPORT</b> (Last ${hours}h)

<b>📈 Page Views</b>
  Total: ${traffic.totalViews}
  Unique Visitors: ${traffic.uniqueVisitors}

<b>🎯 Key Pages</b>
  Landing Page: ${traffic.landingPageViews}
  Visualizer: ${traffic.visualizerViews}

<b>📱 Devices</b>
${devicesText}

<b>🔝 Top Pages</b>
${topPagesText}

<b>💰 LEADS</b>
  Quote Requests: ${leads.quoteRequests}
  Visualizer Leads: ${leads.visualizerLeads}
  <b>Total: ${leads.totalLeads}</b>

⏰ ${new Date().toLocaleString("en-US", { timeZone: "America/Phoenix" })}`;

  const sent = await sendTelegramMessage(message);

  return NextResponse.json({
    success: sent,
    traffic,
    leads,
  });
}

// Also support POST for flexibility
export async function POST(req: NextRequest) {
  return GET(req);
}
