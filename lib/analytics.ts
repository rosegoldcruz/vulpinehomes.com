// lib/analytics.ts
// Simple analytics tracking for page views

import { supabaseServer } from "./supabaseServer";

export interface PageView {
  path: string;
  referrer?: string;
  userAgent?: string;
  ipHash?: string;
  country?: string;
  city?: string;
  device?: string;
}

// Hash IP for privacy (we don't store raw IPs)
function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Detect device type from user agent
function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "mobile";
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "tablet";
  }
  return "desktop";
}

export async function trackPageView(view: PageView) {
  try {
    const { error } = await supabaseServer.from("page_views").insert({
      path: view.path,
      referrer: view.referrer || null,
      user_agent: view.userAgent || null,
      ip_hash: view.ipHash ? hashIP(view.ipHash) : null,
      country: view.country || null,
      city: view.city || null,
      device: view.userAgent ? detectDevice(view.userAgent) : null,
    });

    if (error) {
      console.error("❌ Analytics tracking error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("❌ Analytics exception:", err);
    return false;
  }
}

export interface TrafficStats {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  devices: { device: string; count: number }[];
  landingPageViews: number;
  visualizerViews: number;
  periodHours: number;
}

export async function getTrafficStats(hours: number = 24): Promise<TrafficStats | null> {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    // Total views
    const { count: totalViews } = await supabaseServer
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);

    // Unique visitors (by ip_hash)
    const { data: uniqueData } = await supabaseServer
      .from("page_views")
      .select("ip_hash")
      .gte("created_at", since)
      .not("ip_hash", "is", null);

    const uniqueVisitors = new Set(uniqueData?.map(r => r.ip_hash)).size;

    // Top pages
    const { data: pageData } = await supabaseServer
      .from("page_views")
      .select("path")
      .gte("created_at", since);

    const pageCounts: Record<string, number> = {};
    pageData?.forEach(r => {
      pageCounts[r.path] = (pageCounts[r.path] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device breakdown
    const { data: deviceData } = await supabaseServer
      .from("page_views")
      .select("device")
      .gte("created_at", since)
      .not("device", "is", null);

    const deviceCounts: Record<string, number> = {};
    deviceData?.forEach(r => {
      if (r.device) {
        deviceCounts[r.device] = (deviceCounts[r.device] || 0) + 1;
      }
    });

    const devices = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Landing page views
    const landingPageViews = pageCounts["/vulpine/kitchen-quote"] || 0;
    const visualizerViews = pageCounts["/visualizer"] || 0;

    return {
      totalViews: totalViews || 0,
      uniqueVisitors,
      topPages,
      devices,
      landingPageViews,
      visualizerViews,
      periodHours: hours,
    };
  } catch (err) {
    console.error("❌ Error getting traffic stats:", err);
    return null;
  }
}

export async function getLeadStats(hours: number = 24) {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    // Quote requests
    const { count: quoteCount } = await supabaseServer
      .from("kitchen_quotes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);

    // Visualizer leads
    const { count: visualizerCount } = await supabaseServer
      .from("kitchen_leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);

    return {
      quoteRequests: quoteCount || 0,
      visualizerLeads: visualizerCount || 0,
      totalLeads: (quoteCount || 0) + (visualizerCount || 0),
      periodHours: hours,
    };
  } catch (err) {
    console.error("❌ Error getting lead stats:", err);
    return null;
  }
}
