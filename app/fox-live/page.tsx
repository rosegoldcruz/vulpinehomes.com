"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import type { RemoteTrackPublication, RemoteParticipant, Track } from "livekit-client";

declare global {
  interface Window {
    __FOX_AUDIO_AMPLITUDE?: number;
  }
}

export default function FoxLivePage() {
  const roomRef = useRef<Room | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startBtn = document.getElementById("startBtn");
    if (!startBtn) return;

    const onStart = async () => {
      if (isConnecting || isConnected) return;

      setError(null);
      setIsConnecting(true);

      try {
        const res = await fetch("/api/livekit-token", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
          },
        });

        const data = (await res.json()) as { token?: unknown; url?: unknown; error?: string };
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch LiveKit token");
        }

        const token = data?.token;
        const url = data?.url;
        console.log("LiveKit token type:", typeof token);

        if (typeof token !== "string" || !token) {
          throw new Error("LiveKit token must be a string");
        }
        if (typeof url !== "string" || !url) {
          throw new Error("LiveKit URL missing or invalid");
        }

        // Disconnect any previous room before establishing a new session.
        try {
          roomRef.current?.disconnect();
        } catch {
          // ignore
        }

        const room = new Room();
        await room.connect(url, token);
        roomRef.current = room;

        // Mic input (LiveKit only)
        await room.localParticipant.setMicrophoneEnabled(true);

        // Listen for assistant/agent audio
        room.on(
          "trackSubscribed" as any,
          (track: Track, _pub: RemoteTrackPublication, _participant: RemoteParticipant) => {
            if (track.kind !== "audio") return;
            const audioEl = audioRef.current;
            if (!audioEl) return;

            try {
              track.attach(audioEl);
              audioEl.autoplay = true;
              audioEl.play().catch(() => {
                // Playback may be blocked until a user gesture; startBtn is that gesture.
              });
              setupAnalyser(audioEl);
            } catch (e) {
              console.error("[fox-live] Failed to attach audio track", e);
            }
          }
        );

        setIsConnected(true);
      } catch (e: any) {
        console.error("[fox-live] LiveKit connect failed", e);
        setError(e?.message || "LiveKit failed to connect");
      } finally {
        setIsConnecting(false);
      }
    };

    startBtn.addEventListener("click", onStart);
    return () => startBtn.removeEventListener("click", onStart);
  }, [isConnecting, isConnected]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      analyserRef.current = null;

      try {
        audioCtxRef.current?.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;

      try {
        roomRef.current?.disconnect();
      } catch {
        // ignore
      }
      roomRef.current = null;
    };
  }, []);

  async function toggleMic() {
    const room = roomRef.current;
    if (!room) {
      setMicEnabled((v) => !v);
      return;
    }

    const next = !micEnabled;
    setMicEnabled(next);
    try {
      await room.localParticipant.setMicrophoneEnabled(next);
    } catch (e) {
      console.error("[fox-live] Failed to toggle mic", e);
    }
  }

  function interrupt() {
    const audioEl = audioRef.current;
    if (audioEl) {
      try {
        audioEl.pause();
        audioEl.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }

  function setupAnalyser(audioEl: HTMLAudioElement) {
    if (analyserRef.current) return;

    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const source = ctx.createMediaElementSource(audioEl);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.fftSize);

    const tick = () => {
      const a = analyserRef.current;
      if (!a) return;

      a.getByteTimeDomainData(data);

      // RMS amplitude in [0..1]
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      // Slightly compress so it feels more alive
      window.__FOX_AUDIO_AMPLITUDE = Math.min(1, rms * 4.0);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <main className="relative w-full h-[100svh] bg-black overflow-hidden">
      {/* Three.js Fox (top) */}
      <canvas id="fox-canvas" className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

      {/* User camera (bottom) */}
      <video id="camera-feed" className="absolute inset-0 w-full h-full object-cover z-10" playsInline muted />

      {/* LiveKit audio output (hidden) */}
      <audio ref={audioRef} className="hidden" />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button
          type="button"
          onClick={toggleMic}
          className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm"
        >
          {micEnabled ? "Mute" : "Unmute"}
        </button>
        <button
          type="button"
          onClick={interrupt}
          className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm"
        >
          Interrupt
        </button>
      </div>

      {/* Start overlay (also used by /public/fox-live.js) */}
      <div
        id="start"
        className="absolute inset-0 z-40 flex flex-col items-center justify-center text-white text-center p-6 bg-gradient-to-b from-gray-950 via-gray-900 to-black"
      >
        <button
          id="startBtn"
          type="button"
          className="appearance-none border-0 rounded-full px-8 py-5 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
        >
          Tap to Meet the Fox
        </button>
        <div className="mt-3 text-xs text-white/70">
          {isConnecting ? "Connecting audio..." : isConnected ? "Audio connected" : ""}
        </div>
        <div id="error" className="mt-4 text-sm text-red-400 max-w-sm">
          {error}
        </div>
      </div>

        <Script type="module" src="/fox-live.v2.js" strategy="afterInteractive" />
    </main>
  );
}
