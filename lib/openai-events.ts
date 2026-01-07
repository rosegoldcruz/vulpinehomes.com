export class OpenAIEventBridge {
  socket: WebSocket | null = null;
  callbacks: Record<string, (payload: any) => void> = {};

  connect(ws: WebSocket) {
    this.socket = ws;
    ws.onmessage = (msg: MessageEvent) => {
      let data: any;
      try {
        data = JSON.parse(msg.data as string);
      } catch {
        return;
      }
      if (!data || !data.event) return;
      const cb = this.callbacks[data.event as string];
      if (cb) cb(data);
    };
  }

  on(event: string, cb: (payload: any) => void) {
    this.callbacks[event] = cb;
  }
}
