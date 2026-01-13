import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export const dynamic = "force-dynamic";

function normalizeLiveKitUrlForClient(url: string) {
  if (url.startsWith("ws://")) return url.replace(/^ws:\/\//, "wss://");
  if (url.startsWith("http://")) return url.replace(/^http:\/\//, "https://");
  return url;
}

export async function GET() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !url) {
    return NextResponse.json(
      {
        error:
          "LiveKit not configured. Required env vars: LIVEKIT_URL (or NEXT_PUBLIC_LIVEKIT_URL), LIVEKIT_API_KEY, LIVEKIT_API_SECRET",
      },
      { status: 500 }
    );
  }

  const room = "vulpine-fox";
  const participant = `fox_user_${crypto.randomUUID()}`;

  const at = new AccessToken(apiKey, apiSecret, { identity: participant });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return NextResponse.json({ token: at.toJwt(), room, url: normalizeLiveKitUrlForClient(url) });
}
