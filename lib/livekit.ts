import { Room } from "livekit-client";

type LiveKitTokenResponse = {
  token: string;
  room?: string;
  url: string;
  error?: string;
};

const LiveKitClient = {
  room: null as Room | null,

  async connect() {
    // Always fetch a fresh token per session; avoid Safari caching.
    const res = await fetch("/api/livekit-token", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store",
      },
    });
    const data = (await res.json()) as LiveKitTokenResponse;

    if (!res.ok) {
      throw new Error(data?.error || "Failed to fetch LiveKit token");
    }

    if (!data?.token || !data?.url) {
      throw new Error("LiveKit token response missing token/url");
    }

    // Defensive: if a previous room exists, disconnect before establishing a new session.
    try {
      this.room?.disconnect();
    } catch {
      // ignore
    }

    const room = new Room();
    await room.connect(data.url, data.token);

    this.room = room;
    return room;
  },
};

export default LiveKitClient;
