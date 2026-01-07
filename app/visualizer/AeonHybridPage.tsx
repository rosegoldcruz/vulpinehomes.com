"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { FadeIn, SlideUp, StaggerContainer, ScaleOnHover, ScaleOnHoverButton } from "@/app/components/ui/Motion";
import Image from "next/image";


type VisualizerResult = {
  originalUrl: string;
  maskUrl?: string;
  fluxResultUrl?: string;
  styleResultUrl?: string;
  finalUrl: string;
};

type HardwareStyleId = "arch" | "artisan" | "cottage" | "loft" | "square" | "bar";

type HardwareColorConfig = {
  id: string;
  label: string;
  imageSrc: string;
};

type HardwareConfig = Record<
  HardwareStyleId,
  { label: string; colors: HardwareColorConfig[] }
>;

const HARDWARE_STYLE_ORDER: HardwareStyleId[] = [
  "arch",
  "artisan",
  "cottage",
  "loft",
  "square",
  "bar",
];

type DoorStyle = "shaker" | "shaker-slide" | "slab" | "fusion-shaker" | "fusion-slide";

const DOOR_STYLES = [
  { id: "shaker" as DoorStyle, label: "Shaker Classic", src: "/marketing/Storm-Shaker_Kitchen.jpg" },
  { id: "shaker-slide" as DoorStyle, label: "Shaker Slide", src: "/marketing/Storm-Slide_Kitchen-800x421.jpg" },
  { id: "slab" as DoorStyle, label: "Slab", src: "/marketing/Storm-Slab_Kitchen-800x421.jpg" },
  { id: "fusion-shaker" as DoorStyle, label: "Fusion (Shaker)", src: "/marketing/Storm-Fusion-Shaker_Kitchen.jpg" },
  { id: "fusion-slide" as DoorStyle, label: "Fusion (Slide)", src: "/marketing/Storm-Fusion-Slide_Kitchen.jpg" },
];

type ColorOption = {
  id: string;
  name: string;
  hex: string;
  isWoodGrain?: boolean;
};

// All 13 Vulpine colors
const ALL_COLORS: ColorOption[] = [
  { id: "flour", name: "Flour", hex: "#f5f5f0" },
  { id: "storm", name: "Storm", hex: "#5a6670" },
  { id: "graphite", name: "Graphite", hex: "#3d3d3d" },
  { id: "espresso-walnut", name: "Espresso Walnut", hex: "#3c2415", isWoodGrain: true },
  { id: "slate", name: "Slate", hex: "#708090" },
  { id: "mist", name: "Mist", hex: "#c8c8c8" },
  { id: "latte-walnut", name: "Latte Walnut", hex: "#a67b5b", isWoodGrain: true },
  { id: "nimbus-oak", name: "Nimbus Oak", hex: "#9e8b7d", isWoodGrain: true },
  { id: "sable-oak", name: "Sable Oak", hex: "#5c4033", isWoodGrain: true },
  { id: "urban-teak", name: "Urban Teak", hex: "#8b7355", isWoodGrain: true },
  { id: "platinum-teak", name: "Platinum Teak", hex: "#b8a88a", isWoodGrain: true },
  { id: "snow-gloss", name: "Snow Gloss", hex: "#fffafa" },
  { id: "wheat-oak", name: "Wheat Oak", hex: "#d4a574", isWoodGrain: true },
];

const COLOR_OPTIONS: Record<DoorStyle, ColorOption[]> = {
  "shaker": [
    ALL_COLORS.find(c => c.id === "flour")!,
    ALL_COLORS.find(c => c.id === "storm")!,
    ALL_COLORS.find(c => c.id === "graphite")!,
    ALL_COLORS.find(c => c.id === "espresso-walnut")!,
    ALL_COLORS.find(c => c.id === "slate")!,
    ALL_COLORS.find(c => c.id === "mist")!,
    ALL_COLORS.find(c => c.id === "latte-walnut")!,
    ALL_COLORS.find(c => c.id === "nimbus-oak")!,
    ALL_COLORS.find(c => c.id === "sable-oak")!,
  ],
  "shaker-slide": [
    ALL_COLORS.find(c => c.id === "flour")!,
    ALL_COLORS.find(c => c.id === "storm")!,
    ALL_COLORS.find(c => c.id === "graphite")!,
    ALL_COLORS.find(c => c.id === "espresso-walnut")!,
  ],
  "fusion-shaker": [
    ALL_COLORS.find(c => c.id === "flour")!,
    ALL_COLORS.find(c => c.id === "storm")!,
    ALL_COLORS.find(c => c.id === "graphite")!,
    ALL_COLORS.find(c => c.id === "espresso-walnut")!,
    ALL_COLORS.find(c => c.id === "slate")!,
    ALL_COLORS.find(c => c.id === "mist")!,
    ALL_COLORS.find(c => c.id === "latte-walnut")!,
  ],
  "fusion-slide": [
    ALL_COLORS.find(c => c.id === "flour")!,
    ALL_COLORS.find(c => c.id === "storm")!,
    ALL_COLORS.find(c => c.id === "graphite")!,
    ALL_COLORS.find(c => c.id === "espresso-walnut")!,
  ],
  "slab": [
    ALL_COLORS.find(c => c.id === "flour")!,
    ALL_COLORS.find(c => c.id === "storm")!,
    ALL_COLORS.find(c => c.id === "graphite")!,
    ALL_COLORS.find(c => c.id === "espresso-walnut")!,
    ALL_COLORS.find(c => c.id === "slate")!,
    ALL_COLORS.find(c => c.id === "mist")!,
    ALL_COLORS.find(c => c.id === "latte-walnut")!,
    ALL_COLORS.find(c => c.id === "snow-gloss")!,
    ALL_COLORS.find(c => c.id === "urban-teak")!,
    ALL_COLORS.find(c => c.id === "platinum-teak")!,
    ALL_COLORS.find(c => c.id === "wheat-oak")!,
  ],
};

const LOADING_STEPS = [
  { icon: "📸", title: "Analyzing your kitchen", subtitle: "Detecting cabinets and layout..." },
  { icon: "🎨", title: "Applying your selections", subtitle: "Preparing your style choices..." },
  { icon: "✨", title: "Rendering your transformation", subtitle: "Creating photorealistic preview..." },
  { icon: "🏠", title: "Finalizing your design", subtitle: "Almost ready to see your new kitchen!" },
];

export default function AeonHybridPage() {
  const [stage, setStage] = useState<"input" | "loading" | "results">("input");
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingSubtitle, setLoadingSubtitle] = useState(LOADING_STEPS[0].subtitle);

  const [files, setFiles] = useState<File[]>([]);
  const [doorStyle, setDoorStyle] = useState<DoorStyle>("shaker");
  const [color, setColor] = useState<string>("flour");
  const [hardwareConfig, setHardwareConfig] = useState<HardwareConfig | null>(null);
  const [hardwareStyle, setHardwareStyle] = useState<HardwareStyleId>("arch");
  const [hardwareColor, setHardwareColor] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [results, setResults] = useState<VisualizerResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getColorName = () => {
    const found = COLOR_OPTIONS[doorStyle].find(c => c.id === color);
    return found?.name || color;
  };

  const getDoorStyleName = () => {
    const found = DOOR_STYLES.find(d => d.id === doorStyle);
    return found?.label || doorStyle;
  };

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
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length) {
      setError("Upload at least one kitchen photo.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Enter your name, email, and phone so we can follow up with your design.");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setStage("loading");
    setLoadingStep(0);
    setLoadingProgress(0);
    setCurrentImageIndex(0);
    setError(null);
    setResults([]);

    const newResults: VisualizerResult[] = [];
    const totalImages = files.length;
    const progressPerImage = 100 / totalImages;
    let sessionId: string | null = null; // Track session across multiple images

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentImageIndex(i + 1);

        const stepInterval = setInterval(() => {
          setLoadingStep(prev => {
            const next = prev < LOADING_STEPS.length - 1 ? prev + 1 : prev;
            if (next === 1) {
              setLoadingSubtitle(`${getColorName()} ${getDoorStyleName()} with ${hardwareColor} hardware...`);
            } else {
              setLoadingSubtitle(LOADING_STEPS[next].subtitle);
            }
            return next;
          });
        }, 2500);

        const fd = new FormData();
        fd.append("image", file);
        fd.append("prompt", prompt);
        fd.append("style", doorStyle);
        fd.append("color", color);
        fd.append("hardwareStyle", hardwareStyle);
        fd.append("hardwareColor", hardwareColor);
        fd.append("hardware", `${hardwareStyle} ${hardwareColor}`);
        fd.append("name", fullName.trim());
        fd.append("phone", phone.trim());
        fd.append("email", email.trim());
        fd.append("skipTelegram", "true"); // Skip per-image Telegram, send batch at end
        
        // Reuse session for subsequent images to ensure ONE lead per submission
        if (sessionId) {
          fd.append("sessionId", sessionId);
        }

        try {
          const res = await fetch("/api/vulpine-visualizer", {
            method: "POST",
            body: fd,
          });

          clearInterval(stepInterval);

          const data = await res.json();
          if (!res.ok) {
            console.error("Visualizer failed for image", i, data);
            setError(data.error || "Visualizer failed for one of the photos.");
            continue;
          }

          // Capture sessionId from first response for subsequent images
          if (i === 0 && data.result?.sessionId) {
            sessionId = data.result.sessionId;
            console.log(`✅ Session created: ${sessionId}`);
          }

          newResults.push(data.result as VisualizerResult);
          setLoadingProgress(Math.round((i + 1) * progressPerImage));
        } catch (err) {
          clearInterval(stepInterval);
          console.error("Network error for image", i, err);
          setError("Network error while processing one of the photos.");
        }
      }

      if (newResults.length === 0) {
        setError((prev: string | null) => prev || "Visualizer failed for all photos.");
        setStage("input");
        return;
      }

      // Send ONE combined Telegram notification with all images
      try {
        await fetch("/api/send-lead-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName.trim(),
            phone: phone.trim(),
            style: doorStyle,
            color: getColorName(),
            hardware: `${hardwareStyle} ${hardwareColor}`,
            originalUrls: newResults.map(r => r.originalUrl),
            afterUrls: newResults.map(r => r.finalUrl),
            source: "vulpine_visualizer_batch",
          }),
        });
      } catch (telegramErr) {
        console.error("Failed to send batch Telegram notification:", telegramErr);
      }

      setResults(newResults);
      setActiveIndex(0);
      setSliderPosition(50);

      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("results");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
      setStage("input");
    }
  }


  useEffect(() => {
    async function loadHardwareWithRetry(retries = 3, delay = 1000) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`Loading hardware dataset (attempt ${attempt}/${retries})`);
          const res = await fetch("/cabs_clean/dataset.json", {
            cache: "no-cache",
            headers: { "Cache-Control": "no-cache" }
          });
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          const data = (await res.json()) as { hardware?: Record<string, Record<string, string[]>> };
          const raw = data.hardware || {};
          
          if (Object.keys(raw).length === 0) {
            throw new Error("Hardware data is empty");
          }
          
          const cfg: Partial<HardwareConfig> = {};

          HARDWARE_STYLE_ORDER.forEach((styleKey) => {
            const finishes = raw[styleKey];
            if (!finishes) {
              console.warn(`No finishes found for style: ${styleKey}`);
              return;
            }
            
            const colors: HardwareColorConfig[] = Object.entries(finishes)
              .map(([finishKey, paths]) => {
                if (!paths || paths.length === 0) {
                  console.warn(`No paths for ${styleKey}/${finishKey}`);
                  return null;
                }
                
                // Find the best preview image with multiple fallbacks
                const pngFiles = paths.filter((p) => p.toLowerCase().endsWith(".png"));
                const jpgFiles = paths.filter((p) => /\.(jpg|jpeg)$/i.test(p));
                
                let previewPath = pngFiles.find((p) => {
                  const lower = p.toLowerCase();
                  return !lower.includes('size') && !lower.includes('inch') && !lower.includes('knob') && !lower.includes('tpull');
                }) || pngFiles[0] || jpgFiles[0] || paths[0];
                
                if (!previewPath) {
                  console.error(`No valid image path for ${styleKey}/${finishKey}`);
                  return null;
                }
                
                // Normalize path slashes and remove duplicates
                previewPath = previewPath.replace(/\\/g, '/').replace(/\/+/g, '/');
                
                // Normalize label formatting
                let label = finishKey.split(/[_-]/g).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                if (finishKey === "satinnickel" || finishKey === "satin_nickel") label = "Satin Nickel";
                if (finishKey === "rosegold" || finishKey === "rose_gold") label = "Rose Gold";
                if (finishKey === "matteblack" || finishKey === "matte_black") label = "Matte Black";
                if (finishKey === "chrome") label = "Chrome";
                
                const imageSrc = `/cabs_clean/${previewPath}`;
                console.log(`✓ Loaded: ${styleKey}/${finishKey} -> ${imageSrc}`);
                
                return { id: finishKey, label, imageSrc };
              })
              .filter(Boolean) as HardwareColorConfig[];
              
            if (colors.length === 0) {
              console.warn(`No valid colors for style: ${styleKey}`);
              return;
            }
            
            const label = styleKey.charAt(0).toUpperCase() + styleKey.slice(1);
            (cfg as any)[styleKey] = { label, colors };
          });

          if (Object.keys(cfg).length === 0) {
            throw new Error("No valid hardware configurations loaded");
          }
          
          const finalCfg = cfg as HardwareConfig;
          setHardwareConfig(finalCfg);
          
          const firstStyle = HARDWARE_STYLE_ORDER.find((id) => finalCfg[id]);
          if (firstStyle) {
            setHardwareStyle(firstStyle);
            setHardwareColor(finalCfg[firstStyle].colors[0].label);
          }
          
          console.log("✅ Hardware dataset loaded successfully");
          return; // Success, exit retry loop
          
        } catch (err) {
          console.error(`❌ Attempt ${attempt} failed:`, err);
          
          if (attempt === retries) {
            console.error("🚨 All retry attempts exhausted. Hardware images will not load.");
            // Set empty config to prevent crashes
            setHardwareConfig(null);
          } else {
            // Wait before retrying with exponential backoff
            const waitTime = delay * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
    }
    
    loadHardwareWithRetry();
  }, []);

  // ============ LOADING SCREEN ============
  if (stage === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}>
        <div className="absolute inset-0 opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 138, 61, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)' }} />

        <FadeIn className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl p-10 md:p-16 max-w-xl w-full text-center border border-white/10 shadow-2xl">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(255, 138, 61, 0.25) 0%, rgba(255, 107, 53, 0.15) 100%)', boxShadow: '0 0 60px rgba(255, 138, 61, 0.4)' }}>
            <div className="w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)' }} />
          </div>

          <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">
            {LOADING_STEPS[loadingStep].title}
          </h2>

          <p className="text-white/60 text-base mb-10">
            {loadingSubtitle}
          </p>

          <div className="bg-white/10 rounded-full h-2 overflow-hidden mb-4">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${loadingProgress}%`, background: 'linear-gradient(90deg, #FF8A3D 0%, #FF6B35 100%)', boxShadow: '0 0 20px rgba(255, 138, 61, 0.5)' }} />
          </div>

          <p className="text-white/50 text-sm">
            {files.length > 1 ? `Photo ${currentImageIndex} of ${files.length} • ` : ""}{loadingProgress}% complete
          </p>

          <div className="flex justify-center gap-3 mt-10">
            {LOADING_STEPS.map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-300" style={{ background: i <= loadingStep ? 'linear-gradient(135deg, #FF8A3D, #FF6B35)' : 'rgba(255, 255, 255, 0.2)', boxShadow: i <= loadingStep ? '0 0 10px rgba(255, 138, 61, 0.5)' : 'none' }} />
            ))}
          </div>
        </FadeIn>
      </main>
    );
  }

  // ============ RESULTS SCREEN ============
  if (stage === "results" && results.length > 0) {
    const currentResult = results[activeIndex];

    return (
      <main className="min-h-screen p-6 md:p-10" style={{ background: 'linear-gradient(180deg, #FEFCFA 0%, #FFF8F3 100%)' }}>
        <FadeIn className="max-w-5xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white mb-5" style={{ background: 'linear-gradient(135deg, #FF8A3D, #FF6B35)', boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)' }}>
            <span>✨</span> Your Transformation is Ready!
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3" style={{ letterSpacing: '-1px' }}>
            Your Dream Kitchen Awaits
          </h1>

          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Drag the slider to see your kitchen transformation
          </p>
        </FadeIn>

        <SlideUp className="max-w-4xl mx-auto mb-8">
          <div
            ref={sliderRef}
            onMouseDown={() => { isDragging.current = true; }}
            onTouchStart={() => { isDragging.current = true; }}
            onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
            onTouchEnd={() => { isDragging.current = false; }}
            className="relative rounded-3xl overflow-hidden cursor-ew-resize select-none"
            style={{ aspectRatio: '16/10', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)' }}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentResult.finalUrl})` }} />
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentResult.originalUrl})`, clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} />

            <div className="absolute top-0 bottom-0 w-1 bg-white z-10" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}>
              <div className="absolute top-1/2 left-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center text-xl font-semibold text-slate-800 select-none" style={{ transform: 'translate(-50%, -50%)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                ↔
              </div>
            </div>

            <div className="absolute top-5 left-5 px-4 py-2 rounded-full text-sm font-semibold text-white z-5 bg-black/60 backdrop-blur-sm">Before</div>
            <div className="absolute top-5 right-5 px-4 py-2 rounded-full text-sm font-semibold text-white z-5" style={{ background: 'linear-gradient(135deg, #FF8A3D, #FF6B35)' }}>After</div>
          </div>

          {results.length > 1 && (
            <div className="flex justify-center gap-3 mt-5">
              {results.map((result, i) => (
                <button key={i} onClick={() => { setActiveIndex(i); setSliderPosition(50); }} className="w-20 h-14 rounded-xl bg-cover bg-center transition-all" style={{ backgroundImage: `url(${result.finalUrl})`, border: activeIndex === i ? '3px solid #FF6B35' : '3px solid transparent', boxShadow: activeIndex === i ? '0 4px 15px rgba(255, 107, 53, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.1)' }} />
              ))}
            </div>
          )}
        </SlideUp>

        <FadeIn delay={0.2} className="max-w-xl mx-auto bg-white rounded-2xl p-6 mb-10 flex justify-around flex-wrap gap-5" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)' }}>
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Style</div>
            <div className="text-base text-slate-900 font-semibold">{getDoorStyleName()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Color</div>
            <div className="text-base text-slate-900 font-semibold">{getColorName()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Hardware</div>
            <div className="text-base text-slate-900 font-semibold capitalize">{hardwareStyle} {hardwareColor}</div>
          </div>
        </FadeIn>

        <SlideUp delay={0.3} className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">Love what you see?</h3>
          <p className="text-base text-slate-600 mb-6">Get a free in-home consultation with exact pricing — no pressure, no spam.</p>

          <button className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-white rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)', boxShadow: '0 8px 30px rgba(255, 107, 53, 0.4)' }} onClick={() => alert(`Thanks ${fullName}! We'll text you at ${phone} within 24 hours.`)}>
            Get My Free Quote <span>→</span>
          </button>

          <p className="text-sm text-slate-400 mt-4">🔒 Your info is secure. We'll text you within 24 hours.</p>
        </SlideUp>

        <StaggerContainer className="max-w-lg mx-auto flex justify-center gap-8 flex-wrap mt-12">
          {[{ icon: "⭐", text: "500+ Happy Homeowners" }, { icon: "🏆", text: "10+ Years Experience" }, { icon: "✓", text: "100% Satisfaction" }].map((badge, i) => (
            <FadeIn key={i} className="flex items-center gap-2 text-slate-600 text-sm">
              <span className="text-lg">{badge.icon}</span>{badge.text}
            </FadeIn>
          ))}
        </StaggerContainer>

        <div className="max-w-lg mx-auto text-center mt-10">
          <button onClick={() => setStage("input")} className="text-slate-500 hover:text-slate-700 text-sm underline">← Try different options</button>
        </div>
      </main>
    );
  }

  // ============ INPUT FORM SCREEN ============
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      
      {/* Hero Section with Video */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden bg-[#0a0a0f]">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backgroundColor: '#0f172a' }}
        >
          <source src="/vids/visualizer-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />

        {/* Ambient glow effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Hero content */}
        <FadeIn className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Vulpine</span> Visualizer
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-2 font-light">
            Your Kitchen Reimagined in Seconds
          </p>
          <p className="text-sm text-white/60 max-w-xl">
            Upload your photos and explore new cabinet styles, colors, and finishes with fast, accurate AI previews.
          </p>
        </FadeIn>
      </section>

      {/* Form Section - full width, no side margins */}
      <div className="flex-1 px-4 md:px-8 py-4 md:py-6">
        <SlideUp className="w-full space-y-6">

          <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.2fr,1.8fr] gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/10">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose your door style</label>
                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {DOOR_STYLES.map((door) => (
                    <ScaleOnHoverButton key={door.id} type="button" onClick={() => { setDoorStyle(door.id); setColor(COLOR_OPTIONS[door.id][0].id); }} className={"bg-[#0a0a0f] rounded-xl overflow-hidden text-center transition-all " + (doorStyle === door.id ? "ring-2 ring-[#FF8A3D] shadow-lg shadow-[#FF8A3D]/50" : "border border-white/10 hover:border-[#FF8A3D]/50")}>
                      <div className="w-full aspect-[3/4] bg-black/50 p-3">
                        <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/5">
                          <Image src={door.src} alt={door.label} width={320} height={430} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 px-1 py-3 font-medium tracking-wide uppercase">{door.label}</p>
                    </ScaleOnHoverButton>
                  ))}
                </StaggerContainer>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Choose your color</label>
                <div className="bg-[#0a0a0f]/60 rounded-xl border border-white/10 p-4">
                  <StaggerContainer className={doorStyle === "shaker" ? "grid grid-cols-4 gap-3" : "flex flex-wrap gap-3"}>
                    {COLOR_OPTIONS[doorStyle].map((colorOption: ColorOption) => (
                      <ScaleOnHoverButton key={colorOption.id} type="button" onClick={() => setColor(colorOption.id)} className={"relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all " + (color === colorOption.id ? "ring-2 ring-[#FF8A3D] bg-white/5" : "hover:bg-white/5")} title={colorOption.name}>
                        <div className={"w-10 h-10 rounded-full border-2 " + (color === colorOption.id ? "border-[#FF8A3D]" : "border-white/20")} style={{ backgroundColor: colorOption.hex, backgroundImage: colorOption.isWoodGrain ? `repeating-linear-gradient(90deg, ${colorOption.hex}, ${colorOption.hex} 2px, transparent 2px, transparent 4px)` : undefined }} />
                        <span className="text-[9px] text-white/60 text-center max-w-[60px] leading-tight">{colorOption.name}</span>
                      </ScaleOnHoverButton>
                    ))}
                  </StaggerContainer>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hardware style</label>
                <StaggerContainer className="flex flex-wrap gap-2">
                  {hardwareConfig && HARDWARE_STYLE_ORDER.filter((styleKey) => hardwareConfig[styleKey]).map((styleKey) => (
                    <ScaleOnHoverButton key={styleKey} type="button" onClick={() => { setHardwareStyle(styleKey); setHardwareColor(hardwareConfig[styleKey].colors[0].label); }} className={"px-3 py-1.5 rounded-full text-xs border transition-all " + (hardwareStyle === styleKey ? "bg-[#FF8A3D] border-[#FF8A3D] text-white shadow-lg shadow-[#FF8A3D]/30" : "bg-[#0a0a0f] border-white/10 text-white/80 hover:border-[#FF8A3D]/50")}>
                      {hardwareConfig[styleKey].label}
                    </ScaleOnHoverButton>
                  ))}
                </StaggerContainer>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hardware finish</label>
                <div className="bg-[#0a0a0f]/60 rounded-xl border border-white/10 p-4">
                  {hardwareConfig && hardwareConfig[hardwareStyle] ? (
                    <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {hardwareConfig[hardwareStyle].colors.map((colorOption: HardwareColorConfig) => (
                        <ScaleOnHoverButton key={colorOption.id} type="button" onClick={() => setHardwareColor(colorOption.label)} className={"relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all " + (hardwareColor === colorOption.label ? "ring-2 ring-[#FF8A3D] bg-white/5" : "hover:bg-white/5")} title={`${hardwareStyle} ${colorOption.label}`}>
                          <div className={"w-20 h-20 rounded-xl border-2 overflow-hidden flex items-center justify-center " + (hardwareColor === colorOption.label ? "border-[#FF8A3D]" : "border-white/20") + (imageErrors.has(colorOption.imageSrc) ? " bg-[#0a0a0f]" : "")}>
                            {imageErrors.has(colorOption.imageSrc) ? (
                              <div className="text-slate-600 text-xs text-center px-1">{colorOption.label}</div>
                            ) : (
                              <Image 
                                src={colorOption.imageSrc} 
                                alt={`${hardwareStyle} ${colorOption.label}`} 
                                width={80} 
                                height={80} 
                                className="w-full h-full object-contain"
                                onError={() => {
                                  setImageErrors(prev => new Set(prev).add(colorOption.imageSrc));
                                }}
                              />
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 text-center max-w-[70px] leading-tight">{colorOption.label}</span>
                        </ScaleOnHoverButton>
                      ))}
                    </StaggerContainer>
                  ) : (
                    <p className="text-xs text-slate-500">Hardware options loading…</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name <span className="text-[#FF8A3D]">*</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D]/50 focus:ring-1 focus:ring-[#FF8A3D]/50 transition-all" placeholder="John Doe" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone <span className="text-[#FF8A3D]">*</span></label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D]/50 focus:ring-1 focus:ring-[#FF8A3D]/50 transition-all" placeholder="(555) 123-4567" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-[#FF8A3D]">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D]/50 focus:ring-1 focus:ring-[#FF8A3D]/50 transition-all" placeholder="your@email.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kitchen photos (up to 5)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => { const list = e.target.files; if (!list) { setFiles([]); return; } setFiles(Array.from(list).slice(0, 5)); }} className="w-full text-sm text-white/80 file:bg-gradient-to-r file:from-[#FF8A3D] file:to-[#FF6B35] file:text-white file:px-4 file:py-2 file:rounded-full file:border-0 file:cursor-pointer file:font-semibold file:shadow-lg file:shadow-[#FF8A3D]/30 hover:file:opacity-90 file:transition-all" />
                {files.length > 0 && <p className="text-xs text-slate-400 mt-1">{files.length} photo(s) selected</p>}
              </div>

              <button type="submit" className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold transition-all hover:-translate-y-1 bg-gradient-to-r from-[#9333ea] via-[#db2777] to-[#FF8A3D] shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:hover:translate-y-0">
                Run Visualizer ⚡
              </button>

              {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
            </div>

            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-3 md:p-4 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-slate-200">Before / After</h2>
              <p className="text-xs text-slate-400">After you upload kitchen photos and run the visualizer, your before/after results will show up here.</p>
              <div className="flex-1 flex items-center justify-center min-h-[300px] rounded-lg border border-dashed border-slate-700">
                <div className="text-center text-slate-500">
                  <div className="text-4xl mb-2">🏠</div>
                  <p className="text-sm">Your transformation preview will appear here</p>
                </div>
              </div>
            </div>
          </form>
        </SlideUp>
      </div>

    </main>
  );
}
