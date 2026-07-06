// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\api\analytics\track\route.ts
// app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics";

export const runtime = "nodejs";

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Analytics track error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
