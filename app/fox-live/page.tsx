"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { FoxRuntime } from "./FoxRuntime";
import { TextFallback } from "./TextFallback";

export default function FoxLivePage() {
  const runtimeRef = useRef<FoxRuntime | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [foxState, setFoxState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [foxResponse, setFoxResponse] = useState<string>("");
  const [fallbackMode, setFallbackMode] = useState(false);

  const startSession = async () => {
    if (isConnecting || isConnected) return;

    setError(null);
    setIsConnecting(true);

    try {
      runtimeRef.current = new FoxRuntime({
        onTranscript: (text) => setTranscript(text),
        onResponse: (text) => setFoxResponse(text),
        onStateChange: (state) => setFoxState(state),
        onError: (err) => setError(err.message),
        onFallbackMode: (enabled) => setFallbackMode(enabled),
      });

      await runtimeRef.current.initialize();
      setIsConnected(true);
    } catch (err) {
      console.error('[FoxLive] Session start error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
    };
  }, []);

  const handleTextMessage = async (text: string) => {
    if (runtimeRef.current) {
      await runtimeRef.current.sendTextMessage(text);
    }
  };

  return (
    <main className="relative w-full h-[100svh] bg-black overflow-hidden">
      {/* Three.js Fox (top layer) */}
      <canvas id="fox-canvas" className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

      {/* User camera (bottom layer) */}
      <video id="camera-feed" className="absolute inset-0 w-full h-full object-cover z-10" playsInline muted />


      {/* Status bar (when connected) */}
      {isConnected && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                foxState === 'talking' ? 'bg-orange-500' :
                foxState === 'listening' ? 'bg-green-500' :
                foxState === 'thinking' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              <span className="text-white text-sm font-medium">
                {foxState === 'talking' ? 'Foxy is speaking...' :
                 foxState === 'listening' ? 'Listening...' :
                 foxState === 'thinking' ? 'Thinking...' :
                 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Transcript/Response display */}
      {isConnected && (foxResponse || transcript) && (
        <div className="absolute bottom-24 left-4 right-4 z-30 space-y-2">
          {transcript && (
            <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 text-white/80 text-sm">
              <span className="text-white/50">You: </span>{transcript}
            </div>
          )}
          {foxResponse && (
            <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm border border-orange-500/30">
              <span className="text-orange-400 font-medium">Foxy: </span>{foxResponse}
            </div>
          )}
        </div>
      )}

      {/* Start overlay (initial state) */}
      {!isConnected && (
        <div
          id="start"
          className="absolute inset-0 z-40 flex flex-col items-center justify-center text-white text-center p-6 bg-gradient-to-b from-gray-950 via-gray-900 to-black"
        >
          {/* Fox preview image/animation could go here */}
          <div className="mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
              <span className="text-6xl">🦊</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Meet Foxy</h1>
          <p className="text-white/60 max-w-sm mb-8">
            Your AI kitchen design assistant. Ask about cabinet styles, finishes, and get expert advice.
          </p>
          
          <button
            type="button"
            onClick={startSession}
            disabled={isConnecting}
            className={`appearance-none border-0 rounded-full px-8 py-5 text-lg font-bold shadow-lg shadow-orange-500/25 transition-all ${
              isConnecting 
                ? 'bg-gray-600 text-white/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40'
            }`}
          >
            {isConnecting ? "Connecting..." : "Tap to Start Conversation"}
          </button>
          
          <div className="mt-4 text-xs text-white/50">
            {isConnecting ? "Setting up audio..." : "Requires microphone access"}
          </div>
          
          {error && (
            <div id="error" className="mt-4 text-sm text-red-400 max-w-sm bg-red-500/10 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Text input fallback (when mic is unavailable) */}
      {isConnected && fallbackMode && (
        <TextFallback 
          onSendMessage={handleTextMessage}
          isProcessing={foxState === 'thinking' || foxState === 'talking'}
        />
      )}

      {/* Three.js Fox script */}
      <Script type="module" src="/fox-live.v2.js" strategy="afterInteractive" />
    </main>
  );
}
