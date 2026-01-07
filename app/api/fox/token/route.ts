import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export const dynamic = "force-dynamic";

export async function GET() {
  const room = "vulpine_fox_room";
  const participant = "fox_user_" + Math.random().toString(36).slice(2);

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_SECRET!,
    { identity: participant }
  );

  at.addGrant({ room, roomJoin: true });

  return NextResponse.json({ token: at.toJwt(), room });
}
