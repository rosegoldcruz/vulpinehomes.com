"use client";

import Script from "next/script";
import { useEffect, useRef, useState, useCallback } from "react";
import { Room } from "livekit-client";


declare global {
  interface Window {
    __FOX_AUDIO_AMPLITUDE?: number;
    __FOX_IS_SPEAKING?: boolean;
    __FOX_ANIMATION_STATE?: 'idle' | 'talking' | 'listening' | 'thinking';
  }
}

// Audio recording utilities
class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;

  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;
    } catch (error) {
      console.error('[AudioRecorder] Failed to start:', error);
      throw error;
    }
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Not recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  isActive(): boolean {
    return this.isRecording;
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
  }
}

// Voice Activity Detection (simple energy-based)
class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private silenceThreshold = 0.02;
  private silenceTimeout = 1500; // ms of silence before considering speech ended
  private lastSpeechTime = 0;
  private isSpeaking = false;
  private onSpeechStart: (() => void) | null = null;
  private onSpeechEnd: (() => void) | null = null;
  private rafId: number | null = null;

  async init(stream: MediaStream, onStart: () => void, onEnd: () => void) {
    this.onSpeechStart = onStart;
    this.onSpeechEnd = onEnd;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioCtx();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.source = this.audioContext.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    this.dataArray = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));

    this.checkVoiceActivity();
  }

  private checkVoiceActivity = () => {
    if (!this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Calculate RMS energy
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = this.dataArray[i] / 255;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / this.dataArray.length);

    const now = Date.now();
    
    if (rms > this.silenceThreshold) {
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.onSpeechStart?.();
      }
      this.lastSpeechTime = now;
    } else if (this.isSpeaking && (now - this.lastSpeechTime > this.silenceTimeout)) {
      this.isSpeaking = false;
      this.onSpeechEnd?.();
    }

    this.rafId = requestAnimationFrame(this.checkVoiceActivity);
  };

  cleanup() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.dataArray = null;
  }
}

export default function FoxLivePage() {
  const roomRef = useRef<Room | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const responseAudioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const sessionIdRef = useRef<string>(`fox-session-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [foxState, setFoxState] = useState<'idle' | 'greeting' | 'listening' | 'thinking' | 'talking'>('idle');
  const [micEnabled, setMicEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [foxResponse, setFoxResponse] = useState<string>("");

  // Play audio from base64
  const playAudioFromBase64 = useCallback(async (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audioData = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }
        
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        
        const audio = responseAudioRef.current || new Audio();
        responseAudioRef.current = audio;
        
        audio.src = url;
        
        audio.onended = () => {
          URL.revokeObjectURL(url);
          window.__FOX_IS_SPEAKING = false;
          window.__FOX_ANIMATION_STATE = 'listening';
          setFoxState('listening');
          resolve();
        };
        
        audio.onerror = (e) => {
          URL.revokeObjectURL(url);
          window.__FOX_IS_SPEAKING = false;
          reject(e);
        };

        // Set up analyser for mouth animation
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }

        window.__FOX_IS_SPEAKING = true;
        window.__FOX_ANIMATION_STATE = 'talking';
        setFoxState('talking');
        
        audio.play().catch(reject);
        
        // Update amplitude for mouth animation
        const updateAmplitude = () => {
          if (audio.paused || audio.ended) return;
          
          // Simple volume-based amplitude
          const volume = audio.volume || 0.5;
          const time = audio.currentTime * 10;
          window.__FOX_AUDIO_AMPLITUDE = Math.abs(Math.sin(time)) * volume * 0.8;
          
          requestAnimationFrame(updateAmplitude);
        };
        updateAmplitude();
        
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  // Process a conversation turn
  const processConversationTurn = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    setFoxState('thinking');
    window.__FOX_ANIMATION_STATE = 'thinking';
    setStatusMessage("Foxy is thinking...");

    try {
      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1] || result;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      const audioBase64 = await base64Promise;

      // Call the conversation API
      const response = await fetch('/api/fox-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full-turn',
          sessionId: sessionIdRef.current,
          audio: audioBase64,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Conversation failed');
      }

      // Show transcript and response
      if (data.transcript) {
        setTranscript(data.transcript);
      }
      if (data.response) {
        setFoxResponse(data.response);
      }

      // Play the response audio
      if (data.audio) {
        setStatusMessage("Foxy is speaking...");
        await playAudioFromBase64(data.audio);
      }

    } catch (error) {
      console.error('[FoxLive] Conversation error:', error);
      setError(error instanceof Error ? error.message : 'Conversation failed');
    } finally {
      setIsProcessing(false);
      setFoxState('listening');
      setStatusMessage("Listening...");
    }
  }, [playAudioFromBase64]);

  // Start the Fox session
  const startSession = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setError(null);
    setIsConnecting(true);
    setStatusMessage("Starting session...");

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize recorder
      recorderRef.current = new AudioRecorder();
      
      // Initialize voice activity detector
      vadRef.current = new VoiceActivityDetector();
      await vadRef.current.init(
        stream,
        // On speech start
        () => {
          if (isProcessing || foxState === 'talking') return;
          console.log('[FoxLive] Speech started');
          setIsListening(true);
          setFoxState('listening');
          setStatusMessage("Listening...");
          recorderRef.current?.start().catch(console.error);
        },
        // On speech end
        async () => {
          if (isProcessing) return;
          console.log('[FoxLive] Speech ended');
          setIsListening(false);
          
          if (recorderRef.current?.isActive()) {
            try {
              const audioBlob = await recorderRef.current.stop();
              if (audioBlob.size > 1000) { // Only process if there's actual audio
                await processConversationTurn(audioBlob);
              }
            } catch (e) {
              console.error('[FoxLive] Recording error:', e);
            }
          }
        }
      );

      setIsConnected(true);
      setFoxState('greeting');
      setStatusMessage("Connecting...");

      // Fetch and play greeting
      const greetingResponse = await fetch('/api/fox-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'greeting',
          sessionId: sessionIdRef.current,
        }),
      });

      const greetingData = await greetingResponse.json();
      
      if (greetingData.success && greetingData.audio) {
        setFoxResponse(greetingData.response || "");
        setStatusMessage("Foxy is speaking...");
        await playAudioFromBase64(greetingData.audio);
        setStatusMessage("Listening...");
      }

    } catch (error) {
      console.error('[FoxLive] Session start error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start session');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, isProcessing, foxState, processConversationTurn, playAudioFromBase64]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      analyserRef.current = null;

      try {
        audioCtxRef.current?.close();
      } catch { /* ignore */ }
      audioCtxRef.current = null;

      recorderRef.current?.cleanup();
      vadRef.current?.cleanup();

      try {
        roomRef.current?.disconnect();
      } catch { /* ignore */ }
      roomRef.current = null;

      // End session
      fetch('/api/fox-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end',
          sessionId: sessionIdRef.current,
        }),
      }).catch(console.error);
    };
  }, []);

  // Handle click on start button
  useEffect(() => {
    const startBtn = document.getElementById("startBtn");
    if (!startBtn) return;

    const handleClick = () => startSession();
    startBtn.addEventListener("click", handleClick);
    return () => startBtn.removeEventListener("click", handleClick);
  }, [startSession]);

  return (
    <main className="relative w-full h-[100svh] bg-black overflow-hidden">
      {/* Three.js Fox (top layer) */}
      <canvas id="fox-canvas" className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

      {/* User camera (bottom layer) */}
      <video id="camera-feed" className="absolute inset-0 w-full h-full object-cover z-10" playsInline muted />

      {/* Audio elements (hidden) */}
      <audio ref={audioRef} className="hidden" />
      <audio ref={responseAudioRef} className="hidden" />

      {/* Status bar (when connected) */}
      {isConnected && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                foxState === 'talking' ? 'bg-orange-500' :
                foxState === 'listening' ? 'bg-green-500' :
                foxState === 'thinking' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              <span className="text-white text-sm font-medium">
                {statusMessage || (
                  foxState === 'talking' ? 'Foxy is speaking...' :
                  foxState === 'listening' ? 'Listening...' :
                  foxState === 'thinking' ? 'Thinking...' :
                  'Ready'
                )}
              </span>
            </div>
            
            {/* Mute button */}
            <button
              type="button"
              onClick={() => setMicEnabled(prev => !prev)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                micEnabled 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'bg-red-500/80 text-white'
              }`}
            >
              {micEnabled ? '🎤 Mic On' : '🔇 Muted'}
            </button>
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
            id="startBtn"
            type="button"
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

      {/* Three.js Fox script */}
      <Script type="module" src="/fox-live.v2.js" strategy="afterInteractive" />
    </main>
  );
}
