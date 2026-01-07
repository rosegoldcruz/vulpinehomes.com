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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const { identity, roomName } = await request.json();
    
    // Input validation
    if (!identity || typeof identity !== "string" || identity.length > 100) {
      return NextResponse.json(
        { error: "Valid identity is required" },
        { status: 400 }
      );
    }
    
    if (!roomName || typeof roomName !== "string" || roomName.length > 100) {
      return NextResponse.json(
        { error: "Valid room name is required" },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    
    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
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
    });
  } catch (error) {
    console.error("LiveKit token error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
