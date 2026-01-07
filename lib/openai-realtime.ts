class OpenAIRealtimeClient {
  socket: WebSocket | null = null;

  init(): WebSocket {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return this.socket;
    }

    this.socket = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      } as any
    );

    return this.socket;
  }

  sendJSON(obj: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(obj));
  }
}

const OpenAIClient = new OpenAIRealtimeClient();
export default OpenAIClient;
