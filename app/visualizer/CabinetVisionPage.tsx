"use client";

import React, { useState, useRef } from "react";
import Navigation from "../components/Navigation";

// =============== TYPES ===============
type DoorStyle = "shaker" | "shaker-slide" | "slab" | "fusion-shaker" | "fusion-slide";
type DrawerFront = "matching" | "slab";

interface FinishOption {
  id: string;
  name: string;
  hex: string;
  isWoodGrain: boolean;
  availableFor: DoorStyle[];
}

interface HardwareStyle {
  id: string;
  name: string;
  finishes: string[];
}

interface UserSelections {
  doorStyle: DoorStyle;
  drawerFront: DrawerFront;
  finish: FinishOption;
  hardwareStyle: string;
  hardwareFinish: string;
}

interface VisualizerState {
  originalImages: string[];
  modifiedImages: Record<number, string>;
  currentImageIndex: number;
  isLoading: boolean;
  error: string | null;
}

// =============== CONSTANTS ===============
const DOOR_STYLES = [
  { id: "shaker" as DoorStyle, name: "Shaker Classic", desc: "The timeless 5-piece door style with a wide color palette.", src: "/marketing/Storm-Shaker_Kitchen.jpg" },
  { id: "shaker-slide" as DoorStyle, name: "Shaker Slide", desc: "A modern take on Shaker with a streamlined profile.", src: "/marketing/Storm-Slide_Kitchen-800x421.jpg" },
  { id: "fusion-shaker" as DoorStyle, name: "Fusion Shaker", desc: "Combines Shaker doors with slab drawer fronts for a transitional look.", src: "/marketing/Storm-Fusion-Shaker_Kitchen.jpg" },
  { id: "fusion-slide" as DoorStyle, name: "Fusion Slide", desc: "Slide profile doors mixed with modern slab drawers.", src: "/marketing/Storm-Fusion-Slide_Kitchen.jpg" },
  { id: "slab" as DoorStyle, name: "Slab", desc: "Minimalist flat doors available in our largest variety of finishes.", src: "/marketing/Storm-Slab_Kitchen-800x421.jpg" },
];

const FINISH_OPTIONS: FinishOption[] = [
  // Core colors available on ALL styles
  { id: "flour", name: "Flour", hex: "#f5f5f0", isWoodGrain: false, availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "storm", name: "Storm", hex: "#5a6670", isWoodGrain: false, availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "graphite", name: "Graphite", hex: "#3d3d3d", isWoodGrain: false, availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "espresso-walnut", name: "Espresso Walnut", hex: "#3c2415", isWoodGrain: true, availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  // Expanded palette for specific styles
  { id: "slate", name: "Slate", hex: "#708090", isWoodGrain: false, availableFor: ["shaker", "fusion-shaker", "slab"] },
  { id: "mist", name: "Mist", hex: "#c8c8c8", isWoodGrain: false, availableFor: ["shaker", "fusion-shaker", "slab"] },
  { id: "latte-walnut", name: "Latte Walnut", hex: "#a67b5b", isWoodGrain: true, availableFor: ["shaker", "fusion-shaker", "slab"] },
  { id: "nimbus-oak", name: "Nimbus Oak", hex: "#9e8b7d", isWoodGrain: true, availableFor: ["shaker", "slab"] },
  { id: "sable-oak", name: "Sable Oak", hex: "#5c4033", isWoodGrain: true, availableFor: ["shaker", "slab"] },
  // Slab exclusives
  { id: "snow-gloss", name: "Snow Gloss", hex: "#fffafa", isWoodGrain: false, availableFor: ["slab"] },
  { id: "urban-teak", name: "Urban Teak", hex: "#8b7355", isWoodGrain: true, availableFor: ["slab"] },
  { id: "platinum-teak", name: "Platinum Teak", hex: "#b8a88a", isWoodGrain: true, availableFor: ["slab"] },
  { id: "wheat-oak", name: "Wheat Oak", hex: "#d4a574", isWoodGrain: true, availableFor: ["slab"] },
];

const HARDWARE_CATALOG: HardwareStyle[] = [
  { id: "arch", name: "Arch", finishes: ["Satin Nickel", "Chrome", "Matte Black", "Rose Gold"] },
  { id: "artisan", name: "Artisan", finishes: ["Satin Nickel", "Chrome", "Matte Black", "Rose Gold"] },
  { id: "cottage", name: "Cottage", finishes: ["Satin Nickel", "Chrome", "Matte Black", "Rose Gold"] },
  { id: "bar", name: "Bar Pull", finishes: ["Satin Nickel", "Matte Black"] },
  { id: "loft", name: "Loft", finishes: ["Satin Nickel", "Chrome", "Matte Black", "Rose Gold"] },
  { id: "square", name: "Square", finishes: ["Satin Nickel", "Chrome", "Matte Black", "Rose Gold"] },
];

// =============== UPLOADER COMPONENT ===============
function Uploader({ onUpload }: { onUpload: (base64s: string[], files: File[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const promises: Promise<string>[] = [];
    
    filesArray.forEach((file: File) => {
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      promises.push(promise);
    });

    Promise.all(promises).then(base64s => {
      onUpload(base64s, filesArray);
    });
  };

  return (
    <div 
      className="border-2 border-dashed border-slate-700 rounded-[3rem] p-16 text-center bg-slate-900 hover:border-[#f07c3c] hover:bg-slate-800 transition-all cursor-pointer group"
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple
        onChange={handleFileChange} 
      />
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#f07c3c] group-hover:text-white transition-all duration-300">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Upload Your Kitchen Photos</h3>
          <p className="text-slate-300 font-medium">Select multiple angles to visualize the full transformation.</p>
        </div>
        <button className="bg-[#f07c3c] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#d96a2e] transition-colors shadow-lg">
          Select Photos
        </button>
      </div>
    </div>
  );
}

// =============== COMPARISON SLIDER COMPONENT ===============
function ComparisonSlider({ original, modified }: { original: string; modified: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl cursor-col-resize select-none border-4 border-slate-800"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* Modified Image (Top Layer) */}
      <div 
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={modified} alt="Refaced" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
          Refaced
        </div>
      </div>

      {/* Original Image (Bottom Layer) */}
      <div className="absolute inset-0 z-0">
        <img src={original} alt="Original" className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
          Original
        </div>
      </div>

      {/* Slider Bar */}
      <div 
        className="absolute inset-y-0 z-20 w-1 bg-white shadow-xl"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-slate-100">
          <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-4 4m0 0l4 4m-4-4h18m-4-11l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// =============== SELECTION PANEL COMPONENT ===============
function SelectionPanel({ 
  selections, 
  onChange, 
  onVisualize, 
  isLoading 
}: { 
  selections: UserSelections; 
  onChange: (updates: Partial<UserSelections>) => void; 
  onVisualize: () => void; 
  isLoading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"door" | "finish" | "hardware">("door");

  const availableFinishes = FINISH_OPTIONS.filter(f => f.availableFor.includes(selections.doorStyle));
  const selectedHardware = HARDWARE_CATALOG.find(h => h.name === selections.hardwareStyle) || HARDWARE_CATALOG[0];

  const handleDoorChange = (style: DoorStyle) => {
    const finishesForStyle = FINISH_OPTIONS.filter(f => f.availableFor.includes(style));
    const currentFinishValid = finishesForStyle.find(f => f.id === selections.finish.id);
    onChange({ doorStyle: style, finish: currentFinishValid || finishesForStyle[0] });
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 flex-shrink-0">
        {[
          { id: "door", label: "1. Style" },
          { id: "finish", label: "2. Color" },
          { id: "hardware", label: "3. Hardware" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "door" | "finish" | "hardware")}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${
              activeTab === tab.id 
                ? "bg-[#f07c3c] text-white" 
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* DOOR SELECTION */}
        {activeTab === "door" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Select Door Profile</h3>
            <div className="grid grid-cols-1 gap-4">
              {DOOR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleDoorChange(style.id)}
                  className={`relative group overflow-hidden rounded-2xl border-4 transition-all text-left h-32 ${
                    selections.doorStyle === style.id
                      ? "border-[#f07c3c] shadow-lg scale-[1.02]" 
                      : "border-slate-800 shadow-md hover:border-slate-700"
                  }`}
                >
                  <img src={style.src} alt={style.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-center">
                    <div className="font-black text-white text-lg uppercase leading-none mb-1">{style.name}</div>
                    <div className="text-[10px] text-white/80 font-medium max-w-[70%] leading-tight">{style.desc}</div>
                    {selections.doorStyle === style.id && (
                      <div className="absolute top-4 right-4 bg-[#f07c3c] text-white p-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setActiveTab("finish")} className="w-full py-4 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 mt-4">
              Next: Finish →
            </button>
          </div>
        )}

        {/* FINISH SELECTION */}
        {activeTab === "finish" && (
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Select Finish</h3>
              <span className="text-[10px] font-bold text-slate-500">{selections.doorStyle}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {availableFinishes.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => onChange({ finish })}
                  className={`flex items-center gap-3 p-2 rounded-xl border-2 transition-all text-left ${
                    selections.finish.id === finish.id 
                      ? "border-[#f07c3c] bg-orange-500/10" 
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex-shrink-0 shadow-sm border border-slate-700"
                    style={{ 
                      backgroundColor: finish.hex,
                      backgroundImage: finish.isWoodGrain ? `repeating-linear-gradient(90deg, ${finish.hex}, ${finish.hex} 2px, transparent 2px, transparent 4px)` : undefined
                    }}
                  />
                  <div>
                    <div className={`text-xs font-black uppercase leading-none mb-1 ${selections.finish.id === finish.id ? "text-[#f07c3c]" : "text-white"}`}>
                      {finish.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium leading-none">{finish.isWoodGrain ? "Wood Grain" : "Solid"}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setActiveTab("hardware")} className="w-full py-4 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 mt-4">
              Next: Hardware →
            </button>
          </div>
        )}

        {/* HARDWARE SELECTION */}
        {activeTab === "hardware" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Hardware</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {HARDWARE_CATALOG.map(h => (
                    <button
                      key={h.id}
                      onClick={() => onChange({ hardwareStyle: h.name, hardwareFinish: h.finishes[0] })}
                      className={`py-3 px-2 rounded-xl text-center border-2 transition-all ${
                        selections.hardwareStyle === h.name 
                          ? "border-[#f07c3c] bg-orange-500/10" 
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase text-white">{h.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Finish</label>
                <div className="flex flex-wrap gap-2">
                  {selectedHardware.finishes.map(f => (
                    <button
                      key={f}
                      onClick={() => onChange({ hardwareFinish: f })}
                      className={`px-4 py-3 rounded-lg text-[9px] font-black uppercase border-2 transition-all ${
                        selections.hardwareFinish === f 
                          ? "border-[#f07c3c] bg-[#f07c3c] text-white shadow-lg" 
                          : "border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={onVisualize}
              disabled={isLoading}
              className={`w-full py-5 mt-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all ${
                isLoading 
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed" 
                  : "bg-[#f07c3c] text-white hover:bg-[#d96a2e] active:scale-[0.98]"
              }`}
            >
              {isLoading ? "Processing..." : "Apply Updates"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =============== LEAD CAPTURE MODAL ===============
function LeadCaptureModal({ 
  isOpen, 
  onSubmit, 
  isLoading 
}: { 
  isOpen: boolean; 
  onSubmit: (name: string, phone: string, email: string) => void; 
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("All fields are required");
      return;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    onSubmit(name.trim(), phone.trim(), email.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-800">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Before We Visualize</h2>
        <p className="text-slate-300 mb-6">Enter your info so we can send you your transformation results.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-800 bg-slate-950 text-white focus:border-[#f07c3c] outline-none transition-colors"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-800 bg-slate-950 text-white focus:border-[#f07c3c] outline-none transition-colors"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-800 bg-slate-950 text-white focus:border-[#f07c3c] outline-none transition-colors"
              placeholder="john@email.com"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
              isLoading 
                ? "bg-slate-800 text-slate-600" 
                : "bg-[#f07c3c] text-white hover:bg-[#d96a2e]"
            }`}
          >
            {isLoading ? "Visualizing..." : "Visualize My Kitchen"}
          </button>
        </form>
      </div>
    </div>
  );
}

// =============== MAIN PAGE COMPONENT ===============
export default function CabinetVisionPage() {
  const [selections, setSelections] = useState<UserSelections>({
    doorStyle: "shaker",
    drawerFront: "matching",
    finish: FINISH_OPTIONS[0],
    hardwareStyle: HARDWARE_CATALOG[0].name,
    hardwareFinish: HARDWARE_CATALOG[0].finishes[0],
  });

  const [vizState, setVizState] = useState<VisualizerState>({
    originalImages: [],
    modifiedImages: {},
    currentImageIndex: 0,
    isLoading: false,
    error: null,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: "", phone: "", email: "" });

  const handleUpload = (base64s: string[], uploadedFiles: File[]) => {
    setVizState({
      originalImages: base64s,
      modifiedImages: {},
      currentImageIndex: 0,
      isLoading: false,
      error: null,
    });
    setFiles(uploadedFiles);
  };

  const handleVisualize = () => {
    if (vizState.originalImages.length === 0) return;
    
    // If we don't have lead info yet, show the modal
    if (!leadInfo.email) {
      setShowLeadCapture(true);
      return;
    }
    
    runVisualization();
  };

  const handleLeadSubmit = (name: string, phone: string, email: string) => {
    setLeadInfo({ name, phone, email });
    setShowLeadCapture(false);
    runVisualizationWithLead(name, phone, email);
  };

  const runVisualization = async () => {
    runVisualizationWithLead(leadInfo.name, leadInfo.phone, leadInfo.email);
  };

  const runVisualizationWithLead = async (name: string, phone: string, email: string) => {
    if (vizState.originalImages.length === 0) return;
    
    setVizState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const currentIndex = vizState.currentImageIndex;
      const currentFile = files[currentIndex];
      
      const fd = new FormData();
      fd.append("image", currentFile);
      fd.append("style", selections.doorStyle);
      fd.append("color", selections.finish.id);
      fd.append("hardwareStyle", selections.hardwareStyle);
      fd.append("hardwareColor", selections.hardwareFinish);
      fd.append("hardware", `${selections.hardwareStyle} ${selections.hardwareFinish}`);
      fd.append("name", name);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("prompt", "");

      const res = await fetch("/api/vulpine-visualizer", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Visualization failed");
      }

      setVizState(prev => ({
        ...prev,
        modifiedImages: {
          ...prev.modifiedImages,
          [currentIndex]: data.result.finalUrl
        },
        isLoading: false
      }));
    } catch (err) {
      setVizState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err instanceof Error ? err.message : "Visualization failed. Please try again." 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-['Inter']">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content - add top padding to account for fixed nav */}
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8 pt-24">
        <div className="max-w-[1400px] mx-auto">
          {vizState.originalImages.length === 0 ? (
            <div className="max-w-3xl mx-auto py-16 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Visualizer</h2>
                <p className="text-xl text-slate-300 font-medium">Upload photos of your existing kitchen to start.</p>
              </div>
              <Uploader onUpload={handleUpload} />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visualizer Window */}
              <div className="xl:col-span-8 space-y-6">
                <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden border-[12px] border-slate-800 ring-1 ring-slate-700">
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black">
                    {vizState.modifiedImages[vizState.currentImageIndex] ? (
                      <ComparisonSlider 
                        original={vizState.originalImages[vizState.currentImageIndex]} 
                        modified={vizState.modifiedImages[vizState.currentImageIndex]} 
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img 
                          src={vizState.originalImages[vizState.currentImageIndex]} 
                          alt="Current View" 
                          className={`w-full h-full object-cover transition-all ${vizState.isLoading ? "opacity-50 blur-sm scale-105" : "opacity-80"}`} 
                        />
                        {vizState.isLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white px-6">
                              <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-[#f07c3c]/30 rounded-full" />
                                <div className="absolute inset-0 border-4 border-[#f07c3c] border-t-transparent rounded-full animate-spin" />
                              </div>
                              <p className="font-black text-2xl tracking-tighter uppercase animate-pulse">Designing...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <button onClick={handleVisualize} className="bg-[#f07c3c] text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-orange-500/50">
                                Visualize This View
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                  {vizState.originalImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVizState(prev => ({ ...prev, currentImageIndex: idx }))}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${
                        vizState.currentImageIndex === idx 
                          ? "border-[#f07c3c] shadow-lg scale-105" 
                          : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {vizState.modifiedImages[idx] && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                      )}
                    </button>
                  ))}
                  <button 
                    onClick={() => setVizState({ originalImages: [], modifiedImages: {}, currentImageIndex: 0, isLoading: false, error: null })}
                    className="w-24 h-24 flex-shrink-0 rounded-2xl border-4 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-[#f07c3c] hover:text-[#f07c3c] bg-slate-900 transition-colors"
                  >
                    <span className="text-2xl font-black">+</span>
                    <span className="text-[9px] font-black uppercase">New</span>
                  </button>
                </div>

                {vizState.error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                    {vizState.error}
                  </div>
                )}
              </div>

              {/* Right Column: Configurator */}
              <div className="xl:col-span-4 sticky top-28 space-y-6">
                <SelectionPanel 
                  selections={selections} 
                  onChange={(u) => setSelections(prev => ({ ...prev, ...u }))} 
                  onVisualize={handleVisualize}
                  isLoading={vizState.isLoading}
                />
                
                <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Current Specification</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-400">Door</span>
                      <span className="text-xs font-black text-white uppercase">{selections.doorStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-400">Color</span>
                      <span className="text-xs font-black text-white uppercase">{selections.finish.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-400">Hardware</span>
                      <span className="text-xs font-black text-white uppercase">{selections.hardwareStyle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <LeadCaptureModal 
        isOpen={showLeadCapture} 
        onSubmit={handleLeadSubmit} 
        isLoading={vizState.isLoading} 
      />
    </div>
  );
}
