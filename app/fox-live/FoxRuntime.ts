declare global {
  interface Window {
    __FOX_AUDIO_AMPLITUDE?: number;
    __FOX_IS_SPEAKING?: boolean;
    __FOX_ANIMATION_STATE?: 'idle' | 'talking' | 'listening' | 'thinking';
    __FOX_FACE_POSITION?: { x: number; y: number };
  }
}

interface FoxRuntimeConfig {
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
  onStateChange?: (state: 'idle' | 'listening' | 'thinking' | 'talking') => void;
  onError?: (error: Error) => void;
  onFallbackMode?: (enabled: boolean) => void;
}

export class FoxRuntime {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private isSpeaking = false;
  private sessionId: string;
  private config: FoxRuntimeConfig;
  private animationFrameId: number | null = null;
  private silenceTimer: number | null = null;
  private silenceThreshold = 0.02;
  private silenceDuration = 1500;
  private lastSpeechTime = 0;
  private faceDetectionWorker: Worker | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private fallbackMode = false;

  constructor(config: FoxRuntimeConfig = {}) {
    this.config = config;
    this.sessionId = `fox-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    window.__FOX_AUDIO_AMPLITUDE = 0;
    window.__FOX_IS_SPEAKING = false;
    window.__FOX_ANIMATION_STATE = 'idle';
    window.__FOX_FACE_POSITION = { x: 0, y: 0 };
  }

  async initialize(): Promise<void> {
    try {
      await this.initMicrophone();
    } catch (micError) {
      console.warn('[FoxRuntime] Microphone unavailable, enabling text fallback');
      this.fallbackMode = true;
      this.config.onFallbackMode?.(true);
    }

    try {
      await this.initWebcam();
    } catch (camError) {
      console.warn('[FoxRuntime] Webcam unavailable, continuing without face tracking');
    }

    await this.playGreeting();
  }

  private async initMicrophone(): Promise<void> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.8;

      const source = this.audioContext.createMediaStreamSource(this.micStream);
      source.connect(this.analyserNode);

      this.startAmplitudeMonitoring();
      this.startVoiceActivityDetection();
    } catch (error) {
      throw new Error(`Microphone initialization failed: ${(error as Error).message}`);
    }
  }

  private async initWebcam(): Promise<void> {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      this.videoElement = document.getElementById('camera-feed') as HTMLVideoElement;
      if (this.videoElement) {
        this.videoElement.srcObject = this.videoStream;
        await this.videoElement.play();
        this.startFaceTracking();
      }
    } catch (error) {
      console.warn('[FoxRuntime] Webcam unavailable, continuing without face tracking');
    }
  }

  private startAmplitudeMonitoring(): void {
    if (!this.analyserNode) return;

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    
    const updateAmplitude = () => {
      if (!this.analyserNode) return;

      this.analyserNode.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = dataArray[i] / 255;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      
      window.__FOX_AUDIO_AMPLITUDE = Math.min(1, rms * 2);
      
      this.animationFrameId = requestAnimationFrame(updateAmplitude);
    };

    updateAmplitude();
  }

  private startVoiceActivityDetection(): void {
    if (!this.analyserNode) return;

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    
    const checkVoiceActivity = () => {
      if (!this.analyserNode || this.isSpeaking) {
        this.animationFrameId = requestAnimationFrame(checkVoiceActivity);
        return;
      }

      this.analyserNode.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = dataArray[i] / 255;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      
      const now = Date.now();
      
      if (rms > this.silenceThreshold) {
        if (!this.isRecording) {
          this.startRecording();
        }
        this.lastSpeechTime = now;
        
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      } else if (this.isRecording && (now - this.lastSpeechTime > this.silenceDuration)) {
        this.stopRecording();
      }

      this.animationFrameId = requestAnimationFrame(checkVoiceActivity);
    };

    checkVoiceActivity();
  }

  private startFaceTracking(): void {
    if (!this.videoElement || typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 120;

    const detectFace = () => {
      if (!this.videoElement || this.videoElement.paused || this.videoElement.ended) {
        requestAnimationFrame(detectFace);
        return;
      }

      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      let brightestX = 0;
      let brightestY = 0;
      let maxBrightness = 0;
      
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const i = (y * canvas.width + x) * 4;
          const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
          
          if (brightness > maxBrightness) {
            maxBrightness = brightness;
            brightestX = x;
            brightestY = y;
          }
        }
      }
      
      const normalizedX = (brightestX / canvas.width - 0.5) * 2;
      const normalizedY = (brightestY / canvas.height - 0.5) * 2;
      
      const current = window.__FOX_FACE_POSITION || { x: 0, y: 0 };
      window.__FOX_FACE_POSITION = {
        x: current.x + (normalizedX - current.x) * 0.1,
        y: current.y + (normalizedY - current.y) * 0.1
      };

      setTimeout(() => requestAnimationFrame(detectFace), 100);
    };

    detectFace();
  }

  private startRecording(): void {
    if (!this.micStream || this.isRecording) return;

    try {
      this.mediaRecorder = new MediaRecorder(this.micStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      window.__FOX_ANIMATION_STATE = 'listening';
      this.config.onStateChange?.('listening');
    } catch (error) {
      console.error('[FoxRuntime] Recording start failed:', error);
    }
  }

  private async stopRecording(): Promise<void> {
    if (!this.mediaRecorder || !this.isRecording) return;

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        this.isRecording = false;
        
        if (audioBlob.size > 1000) {
          await this.processAudio(audioBlob);
        }
        
        resolve();
      };

      this.mediaRecorder!.stop();
    });
  }

  private async processAudio(audioBlob: Blob): Promise<void> {
    window.__FOX_ANIMATION_STATE = 'thinking';
    this.config.onStateChange?.('thinking');

    try {
      const base64Audio = await this.blobToBase64(audioBlob);

      const response = await fetch('/api/fox-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full-turn',
          sessionId: this.sessionId,
          audio: base64Audio,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Conversation failed');
      }

      if (data.transcript) {
        this.config.onTranscript?.(data.transcript);
      }

      if (data.response) {
        this.config.onResponse?.(data.response);
      }

      if (data.audio) {
        await this.playAudio(data.audio);
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private async playGreeting(): Promise<void> {
    try {
      const response = await fetch('/api/fox-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'greeting',
          sessionId: this.sessionId,
        }),
      });

      const data = await response.json();

      if (data.success && data.audio) {
        if (data.response) {
          this.config.onResponse?.(data.response);
        }
        await this.playAudio(data.audio);
      }
    } catch (error) {
      console.error('[FoxRuntime] Greeting failed:', error);
    }
  }

  private async playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio = null;
        }

        const audioData = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        this.currentAudio = audio;

        if (this.audioContext && this.analyserNode) {
          const source = this.audioContext.createMediaElementSource(audio);
          source.connect(this.analyserNode);
          this.analyserNode.connect(this.audioContext.destination);
        }

        audio.onended = () => {
          URL.revokeObjectURL(url);
          this.isSpeaking = false;
          window.__FOX_IS_SPEAKING = false;
          window.__FOX_ANIMATION_STATE = 'listening';
          this.config.onStateChange?.('listening');
          this.currentAudio = null;
          resolve();
        };

        audio.onerror = (e) => {
          URL.revokeObjectURL(url);
          this.isSpeaking = false;
          window.__FOX_IS_SPEAKING = false;
          this.currentAudio = null;
          reject(e);
        };

        this.isSpeaking = true;
        window.__FOX_IS_SPEAKING = true;
        window.__FOX_ANIMATION_STATE = 'talking';
        this.config.onStateChange?.('talking');

        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private handleError(error: Error): void {
    console.error('[FoxRuntime] Error:', error);
    this.config.onError?.(error);
    window.__FOX_ANIMATION_STATE = 'idle';
  }

  async sendTextMessage(text: string): Promise<void> {
    if (!text.trim()) return;

    window.__FOX_ANIMATION_STATE = 'thinking';
    this.config.onStateChange?.('thinking');
    this.config.onTranscript?.(text);

    try {
      const response = await fetch('/api/fox-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          sessionId: this.sessionId,
          text: text,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Conversation failed');
      }

      if (data.response) {
        this.config.onResponse?.(data.response);
      }

      if (data.audio) {
        await this.playAudio(data.audio);
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  async destroy(): Promise<void> {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }

    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    if (this.faceDetectionWorker) {
      this.faceDetectionWorker.terminate();
      this.faceDetectionWorker = null;
    }

    await fetch('/api/fox-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'end',
        sessionId: this.sessionId,
      }),
    }).catch(console.error);

    window.__FOX_AUDIO_AMPLITUDE = 0;
    window.__FOX_IS_SPEAKING = false;
    window.__FOX_ANIMATION_STATE = 'idle';
  }
}
