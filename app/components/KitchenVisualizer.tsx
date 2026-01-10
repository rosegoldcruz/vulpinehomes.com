"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

// ============ TYPES ============
export type DoorStyle = "slab" | "shaker" | "shaker-slide" | "fusion-shaker" | "fusion-slide";
export type HardwareStyle = "loft" | "bar" | "arch" | "artisan" | "cottage" | "square";
export type HardwareFinish = "rose_gold" | "chrome" | "black" | "nickel" | "satinnickel" | "gold" | "bronze";

export interface VisualizerConfig {
  doorStyle: DoorStyle;
  colorHex: string;
  colorName: string;
  hardwareStyle: HardwareStyle;
  hardwareFinish: HardwareFinish;
  name: string;
  phone: string;
}

export interface VisualizerResult {
  originalUrl: string;
  finalUrl: string;
  promptUsed?: string;
}

interface KitchenVisualizerProps {
  onComplete?: (result: VisualizerResult) => void;
  onError?: (error: string) => void;
  apiEndpoint?: string;
  className?: string;
}

// ============ DOOR STYLE OPTIONS ============
const DOOR_STYLES: { id: DoorStyle; label: string; description: string }[] = [
  { id: "shaker", label: "Shaker Classic", description: "Timeless recessed panel design" },
  { id: "shaker-slide", label: "Shaker Slide", description: "Modern horizontal lines" },
  { id: "slab", label: "Slab", description: "Clean flat contemporary look" },
  { id: "fusion-shaker", label: "Fusion Shaker", description: "Modern take on classic shaker" },
  { id: "fusion-slide", label: "Fusion Slide", description: "Sleek modern panels" },
];

// ============ COLOR OPTIONS ============
const COLOR_OPTIONS: { id: string; name: string; hex: string }[] = [
  { id: "flour", name: "Flour", hex: "#f5f5f0" },
  { id: "storm", name: "Storm", hex: "#5a6670" },
  { id: "graphite", name: "Graphite", hex: "#3d3d3d" },
  { id: "espresso-walnut", name: "Espresso Walnut", hex: "#3c2415" },
  { id: "slate", name: "Slate", hex: "#708090" },
  { id: "mist", name: "Mist", hex: "#c8c8c8" },
  { id: "latte-walnut", name: "Latte Walnut", hex: "#a67b5b" },
  { id: "nimbus-oak", name: "Nimbus Oak", hex: "#9e8b7d" },
  { id: "sable-oak", name: "Sable Oak", hex: "#5c4033" },
  { id: "urban-teak", name: "Urban Teak", hex: "#8b7355" },
  { id: "platinum-teak", name: "Platinum Teak", hex: "#b8a88a" },
  { id: "snow-gloss", name: "Snow Gloss", hex: "#fffafa" },
  { id: "wheat-oak", name: "Wheat Oak", hex: "#d4a574" },
];

// ============ HARDWARE OPTIONS ============
const HARDWARE_STYLES: { id: HardwareStyle; label: string }[] = [
  { id: "loft", label: "Loft" },
  { id: "bar", label: "Bar" },
  { id: "arch", label: "Arch" },
  { id: "artisan", label: "Artisan" },
  { id: "cottage", label: "Cottage" },
  { id: "square", label: "Square" },
];

const HARDWARE_FINISHES: { id: HardwareFinish; label: string }[] = [
  { id: "satinnickel", label: "Satin Nickel" },
  { id: "chrome", label: "Chrome" },
  { id: "black", label: "Matte Black" },
  { id: "rose_gold", label: "Rose Gold" },
  { id: "gold", label: "Gold" },
  { id: "bronze", label: "Bronze" },
];

// ============ MAIN COMPONENT ============
export default function KitchenVisualizer({
  onComplete,
  onError,
  apiEndpoint = "/api/vulpine-visualizer",
  className = "",
}: KitchenVisualizerProps) {
  // State
  const [stage, setStage] = useState<"upload" | "configure" | "loading" | "result">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<VisualizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your kitchen...");

  // Configuration state
  const [config, setConfig] = useState<VisualizerConfig>({
    doorStyle: "shaker",
    colorHex: "#f5f5f0",
    colorName: "Flour",
    hardwareStyle: "loft",
    hardwareFinish: "satinnickel",
    name: "",
    phone: "",
  });

  // Slider state for before/after
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStage("configure");
      setError(null);
    }
  };

  // Handle color selection
  const handleColorSelect = (color: { name: string; hex: string }) => {
    setConfig((prev) => ({ ...prev, colorName: color.name, colorHex: color.hex }));
  };

  // Handle slider movement
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current || !isDragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: MouseEvent) => handleSliderMove(e.clientX);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Submit visualization
  const handleSubmit = async () => {
    if (!uploadedFile) {
      setError("Please upload a kitchen photo first");
      return;
    }
    if (!config.name.trim() || !config.phone.trim()) {
      setError("Please enter your name and phone number");
      return;
    }

    setStage("loading");
    setLoadingProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 1500);

    const messages = [
      "Analyzing your kitchen...",
      "Detecting cabinets and layout...",
      `Applying ${config.colorName} ${config.doorStyle} style...`,
      "Adding hardware details...",
      "Rendering photorealistic preview...",
      "Finalizing your transformation...",
    ];

    let msgIndex = 0;
    const messageInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2000);

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("style", config.doorStyle);
      formData.append("color", config.colorName.toLowerCase().replace(/\s+/g, "-"));
      formData.append("hardwareStyle", config.hardwareStyle);
      formData.append("hardwareColor", config.hardwareFinish);
      formData.append("name", config.name.trim());
      formData.append("phone", config.phone.trim());
      formData.append("prompt", `${config.colorName} ${config.doorStyle} cabinets with ${config.hardwareFinish} ${config.hardwareStyle} hardware`);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      clearInterval(messageInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Visualization failed");
      }

      const data = await response.json();
      
      const visualizerResult: VisualizerResult = {
        originalUrl: data.result?.originalUrl || previewUrl!,
        finalUrl: data.result?.finalUrl,
        promptUsed: data.result?.promptUsed,
      };

      setResult(visualizerResult);
      setLoadingProgress(100);
      setStage("result");
      onComplete?.(visualizerResult);

    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      const message = err instanceof Error ? err.message : "Visualization failed";
      setError(message);
      setStage("configure");
      onError?.(message);
    }
  };

  // Reset to start
  const handleReset = () => {
    setStage("upload");
    setUploadedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setSliderPosition(50);
  };

  // ============ RENDER: UPLOAD STAGE ============
  if (stage === "upload") {
    return (
      <div className={`bg-slate-950 rounded-3xl p-8 ${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">See Your New Kitchen</h2>
          <p className="text-slate-300">Upload a photo to get started</p>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 rounded-2xl p-12 cursor-pointer hover:border-orange-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-white font-medium mb-2">Click to upload your kitchen photo</p>
            <p className="text-slate-400 text-sm">JPG, PNG up to 10MB</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // ============ RENDER: CONFIGURE STAGE ============
  if (stage === "configure") {
    return (
      <div className={`bg-slate-950 rounded-3xl p-6 ${className}`}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <h3 className="text-white font-semibold mb-3">Your Kitchen</h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
              {previewUrl && (
                <img src={previewUrl} alt="Kitchen preview" className="w-full h-full object-cover" />
              )}
            </div>
            <button
              onClick={handleReset}
              className="mt-3 text-sm text-slate-300 hover:text-white transition-colors"
            >
              ← Upload different photo
            </button>
          </div>

          {/* Configuration */}
          <div className="space-y-5">
            {/* Door Style */}
            <div>
              <label className="text-white font-medium text-sm mb-2 block">Door Style</label>
              <div className="grid grid-cols-2 gap-2">
                {DOOR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setConfig((prev) => ({ ...prev, doorStyle: style.id }))}
                    className={`p-3 rounded-xl text-left transition-all ${
                      config.doorStyle === style.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-medium text-sm">{style.label}</div>
                    <div className="text-xs opacity-70">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-white font-medium text-sm mb-2 block">Cabinet Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      config.colorHex === color.hex
                        ? "border-orange-500 scale-110"
                        : "border-slate-700 hover:border-slate-500"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-slate-300 text-xs mt-1">{config.colorName}</p>
            </div>

            {/* Hardware Style */}
            <div>
              <label className="text-white font-medium text-sm mb-2 block">Hardware Style</label>
              <div className="flex flex-wrap gap-2">
                {HARDWARE_STYLES.map((hw) => (
                  <button
                    key={hw.id}
                    onClick={() => setConfig((prev) => ({ ...prev, hardwareStyle: hw.id }))}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      config.hardwareStyle === hw.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {hw.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Finish */}
            <div>
              <label className="text-white font-medium text-sm mb-2 block">Hardware Finish</label>
              <div className="flex flex-wrap gap-2">
                {HARDWARE_FINISHES.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setConfig((prev) => ({ ...prev, hardwareFinish: finish.id }))}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      config.hardwareFinish === finish.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {finish.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white font-medium text-sm mb-1 block">Your Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="text-white font-medium text-sm mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={config.phone}
                  onChange={(e) => setConfig((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)",
                boxShadow: "0 8px 30px rgba(255, 107, 53, 0.4)",
              }}
            >
              ✨ Generate My Kitchen Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ RENDER: LOADING STAGE ============
  if (stage === "loading") {
    return (
      <div className={`bg-slate-950 rounded-3xl p-12 text-center ${className}`}>
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl animate-pulse"
          style={{ background: "linear-gradient(135deg, rgba(255, 138, 61, 0.25) 0%, rgba(255, 107, 53, 0.15) 100%)" }}>
          🏠
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{loadingMessage}</h2>
        <p className="text-slate-300 mb-8">This usually takes 15-30 seconds</p>

        <div className="max-w-md mx-auto bg-slate-900 rounded-full h-2 overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${loadingProgress}%`,
              background: "linear-gradient(90deg, #FF8A3D 0%, #FF6B35 100%)",
            }}
          />
        </div>
        <p className="text-slate-400 text-sm">{Math.round(loadingProgress)}% complete</p>
      </div>
    );
  }

  // ============ RENDER: RESULT STAGE ============
  if (stage === "result" && result) {
    return (
      <div className={`bg-slate-950 rounded-3xl p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ background: "linear-gradient(135deg, #FF8A3D, #FF6B35)" }}>
            ✨ Your Transformation is Ready!
          </div>
          <h2 className="text-3xl font-bold text-white">Before & After</h2>
        </div>

        {/* Before/After Slider */}
        <div
          ref={sliderRef}
          onMouseDown={() => { isDragging.current = true; }}
          onTouchStart={() => { isDragging.current = true; }}
          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
          onTouchEnd={() => { isDragging.current = false; }}
          className="relative rounded-2xl overflow-hidden cursor-ew-resize select-none mb-6"
          style={{ aspectRatio: "16/10" }}
        >
          {/* After image (background) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${result.finalUrl})` }}
          />
          {/* Before image (clipped) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${result.originalUrl})`,
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          />

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white z-10"
            style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-slate-800"
              style={{ transform: "translate(-50%, -50%)" }}>
              ↔
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white bg-black/60">
            Before
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #FF8A3D, #FF6B35)" }}>
            After
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            ← Try Different Options
          </button>
          <button
            className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)",
              boxShadow: "0 8px 30px rgba(255, 107, 53, 0.4)",
            }}
            onClick={() => alert(`Thanks ${config.name}! We'll text you at ${config.phone} within 24 hours.`)}
          >
            Get My Free Quote →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
