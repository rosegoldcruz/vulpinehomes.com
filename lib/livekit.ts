import { Room } from "livekit-client";

const LiveKitClient = {
  room: null as Room | null,

  async connect() {
    const res = await fetch("/api/fox/token");
    const { token } = await res.json();

    const room = new Room();
    await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);

    this.room = room;
    return room;
  },
};

export default LiveKitClient;
