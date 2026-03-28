"use client";

/**
 * KitchenVisualizer
 *
 * This component is intentionally NOT a product configurator.
 * Product selection lives on /products.
 *
 * Responsibilities:
 *  - Read the active design config saved from /products (localStorage)
 *  - Manage uploaded photos (React context — persists across client-side nav)
 *  - Pre-fill and persist lead info (localStorage)
 *  - Submit the generation request and show the before/after result
 *
 * The user can go back to /products at any time to change the design,
 * then return here. Their photos and lead info are waiting for them.
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "./GoogleAnalytics";
import {
  loadActiveConfig,
  loadLeadSession,
  saveLeadSession,
  type ActiveConfig,
} from "@/app/lib/visualizerStore";
import {
  useVisualizerSession,
  type PersistedPhoto,
} from "./VisualizerProvider";

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

// ── Sub-component: design config not found ──────────────────────────────────
function NoConfigState() {
  return (
    <div className="bg-slate-950 rounded-3xl p-12 text-center">
      <div className="text-5xl mb-6">🎨</div>
      <h2 className="text-2xl font-bold text-white mb-3">No Design Selected Yet</h2>
      <p className="text-slate-300 mb-8 max-w-sm mx-auto">
        Head to Door Styles to choose your door style, color, and hardware — then come back here to see it in your kitchen.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
      >
        Browse Door Styles →
      </Link>
    </div>
  );
}

// ── Sub-component: design summary card ─────────────────────────────────────
function DesignSummary({ config }: { config: ActiveConfig }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400 uppercase tracking-widest">Current Selected Design</p>
        <Link
          href="/products"
          className="text-xs text-[#FF8A3D] hover:underline font-medium"
        >
          Change Design →
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* Door style */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
            <Image
              src={config.doorStyleImage}
              alt={config.doorStyleLabel}
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500">Door Style</p>
            <p className="text-sm font-semibold text-white">{config.doorStyleLabel}</p>
          </div>
        </div>
        {/* Color */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border border-white/20 flex-shrink-0"
            style={{ backgroundColor: config.colorHex }}
          />
          <div>
            <p className="text-xs text-slate-500">Color</p>
            <p className="text-sm font-semibold text-white">{config.colorName}</p>
          </div>
        </div>
        {/* Hardware */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
            <Image
              src={config.hardwareStyleImage}
              alt={config.hardwareStyleLabel}
              width={48}
              height={48}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500">Hardware</p>
            <p className="text-sm font-semibold text-white">
              {config.hardwareStyleLabel} · {config.hardwareFinishLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: photo grid ───────────────────────────────────────────────
function PhotoGrid({
  photos,
  selectedId,
  onSelect,
  onRemove,
  onAdd,
}: {
  photos: PersistedPhoto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (files: FileList) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-white font-medium text-sm">Your Kitchen Photos</label>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs text-[#FF8A3D] hover:underline font-medium"
        >
          + Add photo
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/*"
        multiple
        onChange={(e) => e.target.files && onAdd(e.target.files)}
        className="hidden"
      />

      {photos.length === 0 ? (
        /* Empty state — upload prompt */
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-700 rounded-2xl p-10 hover:border-[#FF8A3D] transition-colors text-center"
        >
          <div className="text-4xl mb-3">📸</div>
          <p className="text-white font-medium mb-1">Click to upload your kitchen photo</p>
          <p className="text-slate-400 text-xs">JPG, PNG, HEIC • Up to 10 MB</p>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => {
            const isSelected = photo.id === selectedId;
            return (
              <div key={photo.id} className="relative group">
                <button
                  onClick={() => onSelect(photo.id)}
                  className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected ? "border-[#FF8A3D]" : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <img
                    src={photo.previewUrl}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#FF8A3D]/20 flex items-end justify-center pb-1">
                      <span className="text-xs font-semibold text-white bg-[#FF8A3D] rounded-full px-2 py-0.5">
                        Selected
                      </span>
                    </div>
                  )}
                </button>
                {/* Remove button */}
                <button
                  onClick={() => onRemove(photo.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
          {/* Add more tile */}
          <button
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-[#FF8A3D] transition-colors flex items-center justify-center text-slate-500 hover:text-[#FF8A3D]"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function KitchenVisualizer({
  onComplete,
  onError,
  apiEndpoint = "/api/vulpine-visualizer",
  className = "",
}: KitchenVisualizerProps) {
  const { photos, addPhotos, removePhoto } = useVisualizerSession();

  const [stage, setStage] = useState<"setup" | "loading" | "result">("setup");
  const [activeConfig, setActiveConfig] = useState<ActiveConfig | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [result, setResult] = useState<VisualizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your kitchen...");

  // Lead info — pre-filled from localStorage
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Slider for result stage
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // ── Bootstrap from localStorage on mount ─────────────────────────────────
  useEffect(() => {
    setActiveConfig(loadActiveConfig());
    const lead = loadLeadSession();
    if (lead) {
      setName(lead.name);
      setPhone(lead.phone);
      setEmail(lead.email);
    }
    trackEvent("view_item", { item_name: "Kitchen Visualizer", item_category: "Tool" });
  }, []);

  // Auto-select first photo whenever the photos array changes
  useEffect(() => {
    if (photos.length > 0 && !selectedPhotoId) {
      setSelectedPhotoId(photos[0].id);
    }
    if (photos.length === 0) setSelectedPhotoId(null);
  }, [photos, selectedPhotoId]);

  // Reload active config when user navigates back from /products
  useEffect(() => {
    const onFocus = () => setActiveConfig(loadActiveConfig());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Slider drag handlers
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current || !isDragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  useEffect(() => {
    const up = () => { isDragging.current = false; };
    const move = (e: MouseEvent) => handleSliderMove(e.clientX);
    document.addEventListener("mouseup", up);
    document.addEventListener("mousemove", move);
    return () => { document.removeEventListener("mouseup", up); document.removeEventListener("mousemove", move); };
  }, [handleSliderMove]);

  // ── Handle photo additions ────────────────────────────────────────────────
  const handleAddPhotos = useCallback((files: FileList) => {
    const arr = Array.from(files);
    addPhotos(arr);
    setError(null);
  }, [addPhotos]);

  // ── Submit generation ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

    if (!selectedPhoto) {
      setError("Please upload and select a kitchen photo first.");
      return;
    }
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Please enter your name, phone, and email.");
      return;
    }
    if (!activeConfig) {
      setError("No design selected. Please go to Door Styles and pick a configuration.");
      return;
    }

    // Persist lead info for next cycle
    saveLeadSession({ name: name.trim(), phone: phone.trim(), email: email.trim() });

    setStage("loading");
    setLoadingProgress(0);
    setError(null);

    trackEvent("add_to_cart", {
      currency: "USD",
      value: 0,
      items: [{ item_name: "Kitchen Visualization", item_category: "Lead" }],
    });

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 15));
    }, 1500);

    const messages = [
      "Analyzing your kitchen...",
      "Detecting cabinets and layout...",
      `Applying ${activeConfig.colorName} ${activeConfig.doorStyleLabel} style...`,
      "Adding hardware details...",
      "Rendering photorealistic preview...",
      "Finalizing your transformation...",
    ];
    let msgIdx = 0;
    const messageInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2000);

    try {
      const formData = new FormData();
      formData.append("image", selectedPhoto.file);
      formData.append("style", activeConfig.doorStyleId);
      formData.append("color", activeConfig.colorName.toLowerCase().replace(/\s+/g, "-"));
      formData.append("hardwareStyle", activeConfig.hardwareStyleId);
      formData.append("hardwareColor", activeConfig.hardwareFinishId);
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("email", email.trim());
      formData.append(
        "prompt",
        `${activeConfig.colorName} ${activeConfig.doorStyleLabel} cabinets with ${activeConfig.hardwareFinishLabel} ${activeConfig.hardwareStyleLabel} hardware`
      );

      const response = await fetch(apiEndpoint, { method: "POST", body: formData });

      clearInterval(progressInterval);
      clearInterval(messageInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Visualization failed");
      }

      const data = await response.json();
      const vizResult: VisualizerResult = {
        originalUrl: data.result?.originalUrl || selectedPhoto.previewUrl,
        finalUrl: data.result?.finalUrl,
        promptUsed: data.result?.promptUsed,
      };

      setResult(vizResult);
      setLoadingProgress(100);
      setStage("result");

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead");
      }
      onComplete?.(vizResult);
    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      const msg = err instanceof Error ? err.message : "Visualization failed";
      setError(msg);
      setStage("setup");
      onError?.(msg);
    }
  };

  const handleTryAgain = () => {
    // Reload latest config in case the user changed it while on /products
    setActiveConfig(loadActiveConfig());
    setStage("setup");
    setResult(null);
    setSliderPosition(50);
  };

  // ── Render: no config yet ─────────────────────────────────────────────────
  if (!activeConfig && stage === "setup") {
    return (
      <div className={className}>
        <NoConfigState />
      </div>
    );
  }

  // ── Render: loading ───────────────────────────────────────────────────────
  if (stage === "loading") {
    return (
      <div className={`bg-slate-950 rounded-3xl p-12 text-center ${className}`}>
        <div
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl animate-pulse"
          style={{ background: "linear-gradient(135deg,rgba(255,138,61,0.25),rgba(255,107,53,0.15))" }}
        >
          🏠
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{loadingMessage}</h2>
        <p className="text-slate-300 mb-8">This usually takes 15-30 seconds</p>
        <div className="max-w-md mx-auto bg-slate-900 rounded-full h-2 overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${loadingProgress}%`, background: "linear-gradient(90deg,#FF8A3D,#FF6B35)" }}
          />
        </div>
        <p className="text-slate-400 text-sm">{Math.round(loadingProgress)}% complete</p>
      </div>
    );
  }

  // ── Render: result ────────────────────────────────────────────────────────
  if (stage === "result" && result) {
    return (
      <div className={`bg-slate-950 rounded-3xl p-6 ${className}`}>
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ background: "linear-gradient(135deg,#FF8A3D,#FF6B35)" }}
          >
            ✨ Your Transformation is Ready!
          </div>
          <h2 className="text-3xl font-bold text-white">Before & After</h2>
        </div>

        {/* Before/After slider */}
        <div
          ref={sliderRef}
          onMouseDown={() => { isDragging.current = true; }}
          onTouchStart={() => { isDragging.current = true; }}
          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
          onTouchEnd={() => { isDragging.current = false; }}
          className="relative rounded-2xl overflow-hidden cursor-ew-resize select-none mb-6"
          style={{ aspectRatio: "16/10" }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${result.finalUrl})` }} />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${result.originalUrl})`, clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          />
          <div className="absolute top-0 bottom-0 w-1 bg-white z-10" style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}>
            <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-slate-800" style={{ transform: "translate(-50%,-50%)" }}>
              ↔
            </div>
          </div>
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white bg-black/60">Before</div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#FF8A3D,#FF6B35)" }}>After</div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            ← Try Different Options
          </button>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl border border-[#FF8A3D]/40 text-[#FF8A3D] font-medium hover:bg-[#FF8A3D]/10 transition-colors"
          >
            Change Design on Door Styles →
          </Link>
          <button
            className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#FF8A3D,#FF6B35)", boxShadow: "0 8px 30px rgba(255,107,53,0.4)" }}
            onClick={() => alert(`Thanks ${name}! We'll text you at ${phone} within 24 hours.`)}
          >
            Get My Free Quote →
          </button>
        </div>
      </div>
    );
  }

  // ── Render: setup ─────────────────────────────────────────────────────────
  return (
    <div className={`bg-slate-950 rounded-3xl p-6 ${className}`}>
      <div className="space-y-6">

        {/* Design summary */}
        {activeConfig && <DesignSummary config={activeConfig} />}

        {/* Photos */}
        <PhotoGrid
          photos={photos}
          selectedId={selectedPhotoId}
          onSelect={setSelectedPhotoId}
          onRemove={removePhoto}
          onAdd={handleAddPhotos}
        />

        {/* Lead info */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white font-medium text-sm mb-1 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-white font-medium text-sm mb-1 block">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="text-white font-medium text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Generate */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#FF8A3D 0%,#FF6B35 100%)", boxShadow: "0 8px 30px rgba(255,107,53,0.4)" }}
        >
          ✨ Generate My Kitchen Preview
        </button>

        <p className="text-center text-slate-500 text-xs">
          Your photos stay on this page — go back to{" "}
          <Link href="/products" className="text-[#FF8A3D] hover:underline">
            Door Styles
          </Link>{" "}
          to pick a different design and generate again without re-uploading.
        </p>
      </div>
    </div>
  );
}
