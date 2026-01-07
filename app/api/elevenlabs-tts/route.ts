import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (production should use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
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

    const { text } = await request.json();
    
    // Input validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Valid text is required" },
        { status: 400 }
      );
    }
    
    // Limit text length to prevent abuse
    if (text.length > 1000) {
      return NextResponse.json(
        { error: "Text too long (max 1000 characters)" },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;
    
    if (!apiKey || !voiceId) {
      return NextResponse.json(
        { error: "ElevenLabs credentials not configured" },
        { status: 500 }
      );
    }
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `ElevenLabs API error: ${error}` },
        { status: response.status }
      );
    }
    
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
