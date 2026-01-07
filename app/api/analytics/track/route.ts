// app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics";

export const runtime = "nodejs";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// Pages that trigger immediate Telegram notification
const HOT_PAGES = ["/vulpine/kitchen-quote"];

async function notifyHotPageVisit(path: string, referrer: string | null, device: string, city?: string) {
  if (!BOT_TOKEN || !CHAT_ID) return;

  const message = `👀 LANDING PAGE VISITOR

📍 Page: ${path}
📱 Device: ${device}
🌐 From: ${referrer || "Direct"}
📌 Location: ${city || "Unknown"}
⏰ ${new Date().toLocaleString("en-US", { timeZone: "America/Phoenix" })}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
  } catch (err) {
    console.error("Hot page notification failed:", err);
  }
}

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "📱 Mobile";
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "📱 Tablet";
  }
  return "💻 Desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer } = body;

    if (!path) {
      return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    // Get info from headers
    const userAgent = req.headers.get("user-agent") || "";
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIP = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || undefined;

    // Geo info from Vercel headers (if deployed on Vercel)
    const country = req.headers.get("x-vercel-ip-country") || undefined;
    const city = req.headers.get("x-vercel-ip-city") || undefined;

    // Track the page view
    await trackPageView({
      path,
      referrer,
      userAgent,
      ipHash: ip,
      country,
      city,
    });

    // Send immediate notification for hot pages (landing page)
    if (HOT_PAGES.includes(path)) {
      const device = detectDevice(userAgent);
      notifyHotPageVisit(path, referrer, device, city);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Analytics track error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
