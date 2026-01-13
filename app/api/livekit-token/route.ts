import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
} as const;

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
}

function getLiveKitConfig() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;

  return { apiKey, apiSecret, url };
}

function normalizeLiveKitUrlForClient(url: string) {
  // Avoid mixed-content on mobile Safari when site is https.
  // LiveKit Room.connect accepts https/wss URLs.
  if (url.startsWith("ws://")) return url.replace(/^ws:\/\//, "wss://");
  if (url.startsWith("http://")) return url.replace(/^http:\/\//, "https://");
  return url;
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: noStoreHeaders }
      );
    }

    const { apiKey, apiSecret, url } = getLiveKitConfig();
    if (!apiKey || !apiSecret || !url) {
      return NextResponse.json(
        {
          error:
            "LiveKit not configured. Required env vars: LIVEKIT_URL (or NEXT_PUBLIC_LIVEKIT_URL), LIVEKIT_API_KEY, LIVEKIT_API_SECRET",
        },
        { status: 500, headers: noStoreHeaders }
      );
    }

    const room = "vulpine-fox";
    const identity = `user-${crypto.randomUUID()}`;

    const token = new AccessToken(apiKey, apiSecret, { identity });
    token.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({
      token: token.toJwt(),
      room,
      url: normalizeLiveKitUrlForClient(url),
    }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("LiveKit token error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500, headers: noStoreHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: noStoreHeaders }
      );
    }

    const { identity, roomName } = await request.json();
    
    // Input validation
    if (!identity || typeof identity !== "string" || identity.length > 100) {
      return NextResponse.json(
        { error: "Valid identity is required" },
        { status: 400, headers: noStoreHeaders }
      );
    }
    
    if (!roomName || typeof roomName !== "string" || roomName.length > 100) {
      return NextResponse.json(
        { error: "Valid room name is required" },
        { status: 400, headers: noStoreHeaders }
      );
    }
    
    const { apiKey, apiSecret, url: wsUrlRaw } = getLiveKitConfig();
    const wsUrl = wsUrlRaw ? normalizeLiveKitUrlForClient(wsUrlRaw) : undefined;
    
    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        {
          error:
            "LiveKit not configured. Required env vars: LIVEKIT_URL (or NEXT_PUBLIC_LIVEKIT_URL), LIVEKIT_API_KEY, LIVEKIT_API_SECRET",
        },
        { status: 500, headers: noStoreHeaders }
      );
    }
    
    // Create access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: "10m",
    });
    
    // Grant permissions
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    
    const token = await at.toJwt();
    
    return NextResponse.json({
      token,
      url: wsUrl,
    }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("LiveKit token error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
