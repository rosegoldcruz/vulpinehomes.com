"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navigation from "../components/Navigation";

// =============== TYPES ===============
type DoorStyle = "shaker" | "shaker-slide" | "slab" | "fusion-shaker" | "fusion-slide";

interface FinishOption {
  id: string;
  name: string;
  hex: string;
  isWoodGrain: boolean;
  doorImage: string; // Path to full kitchen image for this finish
  doorDetailImage: string; // Path to close-up door PNG
  availableFor: DoorStyle[];
}

interface HardwareOption {
  id: string;
  name: string;
  finish: string;
  finishId: string;
  thumbnail: string; // Main hardware image
  withKnob: string; // Hardware with knob combo
}

interface UserSelections {
  doorStyle: DoorStyle;
  finish: FinishOption;
  hardware: HardwareOption;
}

interface VisualizerState {
  originalImages: string[];
  modifiedImages: Record<number, string>;
  currentImageIndex: number;
  isLoading: boolean;
  error: string | null;
}

// =============== DOOR STYLES WITH IMAGES ===============
const DOOR_STYLES: { id: DoorStyle; name: string; desc: string; heroImage: string }[] = [
  { 
    id: "shaker", 
    name: "Shaker Classic", 
    desc: "Timeless 5-piece door with clean lines",
    heroImage: "/cabs_clean/doors/shaker_classic/Storm-Shaker_Kitchen.jpg"
  },
  { 
    id: "shaker-slide", 
    name: "Shaker Slide", 
    desc: "Modern Shaker with streamlined profile",
    heroImage: "/cabs_clean/doors/shaker_slide/Storm-Slide_Kitchen-800x421.jpg"
  },
  { 
    id: "fusion-shaker", 
    name: "Fusion Shaker", 
    desc: "Shaker doors with slab drawer fronts",
    heroImage: "/cabs_clean/doors/fusion_shaker/Storm-Fusion-Shaker_Kitchen-800x421.jpg"
  },
  { 
    id: "fusion-slide", 
    name: "Fusion Slide", 
    desc: "Slide doors with modern slab drawers",
    heroImage: "/cabs_clean/doors/fusion_slide/Storm-Fusion-Slide_Kitchen-800x421.jpg"
  },
  { 
    id: "slab", 
    name: "Slab", 
    desc: "Minimalist flat panel, modern aesthetic",
    heroImage: "/cabs_clean/doors/slab/Storm-Slab_Kitchen-800x421.jpg"
  },
];

// =============== FINISHES WITH REAL IMAGES ===============
const FINISH_OPTIONS: FinishOption[] = [
  // Shaker Classic finishes
  { id: "flour", name: "Flour", hex: "#f5f5f0", isWoodGrain: false, doorImage: "/cabs_clean/doors/shaker_classic/Flour-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-flour.png", availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "storm", name: "Storm", hex: "#5a6670", isWoodGrain: false, doorImage: "/cabs_clean/doors/shaker_classic/Storm-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-storm.png", availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "graphite", name: "Graphite", hex: "#3d3d3d", isWoodGrain: false, doorImage: "/cabs_clean/doors/shaker_classic/Graphite-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-graphite.png", availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "espresso-walnut", name: "Espresso Walnut", hex: "#3c2415", isWoodGrain: true, doorImage: "/cabs_clean/doors/shaker_classic/Espresso-Walnut-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-espresso-walnut.png", availableFor: ["shaker", "shaker-slide", "fusion-shaker", "fusion-slide", "slab"] },
  { id: "slate", name: "Slate", hex: "#708090", isWoodGrain: false, doorImage: "/cabs_clean/doors/shaker_classic/Slate-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-slate.png", availableFor: ["shaker", "fusion-shaker", "slab"] },
  { id: "mist", name: "Mist", hex: "#c8c8c8", isWoodGrain: false, doorImage: "/cabs_clean/doors/shaker_classic/Mist-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-mist.png", availableFor: ["shaker", "fusion-shaker", "slab"] },
  { id: "latte-walnut", name: "Latte Walnut", hex: "#a67b5b", isWoodGrain: true, doorImage: "/cabs_clean/doors/shaker_classic/Latte-Walnut-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-claassic-latte-walnut.png", availableFor: ["shaker", "fusion-shaker", "slab"] },
  { id: "nimbus-oak", name: "Nimbus Oak", hex: "#9e8b7d", isWoodGrain: true, doorImage: "/cabs_clean/doors/shaker_classic/Nimbus-Oak-Shaker_Kitchen.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-nimbus-oak.png", availableFor: ["shaker", "slab"] },
  { id: "sable-oak", name: "Sable Oak", hex: "#5c4033", isWoodGrain: true, doorImage: "/cabs_clean/doors/shaker_classic/Sable-Oak-Shaker.jpg", doorDetailImage: "/cabs_clean/doors/shaker_classic/shaker-classic-sable-oak.png", availableFor: ["shaker", "slab"] },
  // Slab exclusives
  { id: "snow-gloss", name: "Snow Gloss", hex: "#fffafa", isWoodGrain: false, doorImage: "/cabs_clean/doors/slab/Snow-Gloss-Slab_Kitchen-800x421.jpg", doorDetailImage: "/cabs_clean/doors/slab/slab-snow-gloss-white.png", availableFor: ["slab"] },
  { id: "urban-teak", name: "Urban Teak", hex: "#8b7355", isWoodGrain: true, doorImage: "/cabs_clean/doors/slab/Urban-Teak-Slab_Kitchen-800x421.jpg", doorDetailImage: "/cabs_clean/doors/slab/slab-urban-teak.png", availableFor: ["slab"] },
  { id: "platinum-teak", name: "Platinum Teak", hex: "#b8a88a", isWoodGrain: true, doorImage: "/cabs_clean/doors/slab/Platinum-Teak-Slab_Kitchen-800x421.jpg", doorDetailImage: "/cabs_clean/doors/slab/slab-platnum-teak.png", availableFor: ["slab"] },
  { id: "wheat-oak", name: "Wheat Oak", hex: "#d4a574", isWoodGrain: true, doorImage: "/cabs_clean/doors/slab/Wheat-Oak-Slab-800x421.jpg", doorDetailImage: "/cabs_clean/doors/slab/slab-wheat-oak.png", availableFor: ["slab"] },
];

// =============== HARDWARE WITH REAL IMAGES ===============
const HARDWARE_OPTIONS: HardwareOption[] = [
  // Arch
  { id: "arch-satin", name: "Arch", finish: "Satin Nickel", finishId: "satin_nickel", thumbnail: "/cabs_clean/hardware/arch/Arch_SatinNickel.png", withKnob: "/cabs_clean/hardware/arch/Arch_SatinNickel_with_tpull.png" },
  { id: "arch-chrome", name: "Arch", finish: "Chrome", finishId: "chrome", thumbnail: "/cabs_clean/hardware/arch/arch_chrome.png", withKnob: "/cabs_clean/hardware/arch/arch_chrome_with_tpull.png" },
  { id: "arch-matte", name: "Arch", finish: "Matte Black", finishId: "matte_black", thumbnail: "/cabs_clean/hardware/arch/Arch_MatteBlack.png", withKnob: "/cabs_clean/hardware/arch/Arch_MatteBlack_with _tpull.png" },
  { id: "arch-rose", name: "Arch", finish: "Rose Gold", finishId: "rose_gold", thumbnail: "/cabs_clean/hardware/arch/Arch_RoseGold.png", withKnob: "/cabs_clean/hardware/arch/Arch_RoseGold_with_tpull.png" },
  // Bar
  { id: "bar-matte", name: "Bar Pull", finish: "Matte Black", finishId: "matte_black", thumbnail: "/cabs_clean/hardware/bar/Bar-pulls-black .png", withKnob: "/cabs_clean/hardware/bar/Bar-matte-black-tpull.png" },
  { id: "bar-satin", name: "Bar Pull", finish: "Satin Nickel", finishId: "satin_nickel", thumbnail: "/cabs_clean/hardware/bar/BarPull_SatinNickel.png", withKnob: "/cabs_clean/hardware/bar/BarPull_SatinNickel_with_tpull.png" },
  // Cottage
  { id: "cottage-chrome", name: "Cottage", finish: "Chrome", finishId: "chrome", thumbnail: "/cabs_clean/hardware/cottage/Cottage__Chrome.png", withKnob: "/cabs_clean/hardware/cottage/Cottage__Chrome_with_knob.png" },
  { id: "cottage-satin", name: "Cottage", finish: "Satin Nickel", finishId: "satin_nickel", thumbnail: "/cabs_clean/hardware/cottage/Cottage__SatinNickel.png", withKnob: "/cabs_clean/hardware/cottage/Cottage__SatinNickel_with_knob.png" },
  { id: "cottage-rose", name: "Cottage", finish: "Rose Gold", finishId: "rose_gold", thumbnail: "/cabs_clean/hardware/cottage/Cottage_RoseGold_.png.png", withKnob: "/cabs_clean/hardware/cottage/Cottage_RoseGold_with_knob.png" },
  // Loft
  { id: "loft-satin", name: "Loft", finish: "Satin Nickel", finishId: "satin_nickel", thumbnail: "/cabs_clean/hardware/loft/Loft_SatinNickel.png", withKnob: "/cabs_clean/hardware/loft/Loft_SatinNickel_with_knob.png" },
  { id: "loft-chrome", name: "Loft", finish: "Chrome", finishId: "chrome", thumbnail: "/cabs_clean/hardware/loft/Loft_Chrome_1.png.png", withKnob: "/cabs_clean/hardware/loft/Loft_Chrome_with_knob.png" },
  { id: "loft-matte", name: "Loft", finish: "Matte Black", finishId: "matte_black", thumbnail: "/cabs_clean/hardware/loft/Loft_MatteBlack.png", withKnob: "/cabs_clean/hardware/loft/Loft_MatteBlack__with_knob.png" },
  { id: "loft-rose", name: "Loft", finish: "Rose Gold", finishId: "rose_gold", thumbnail: "/cabs_clean/hardware/loft/Loft_RoseGold.png", withKnob: "/cabs_clean/hardware/loft/Loft_RoseGold_with_knob.png" },
  // Square
  { id: "square-satin", name: "Square", finish: "Satin Nickel", finishId: "satin_nickel", thumbnail: "/cabs_clean/hardware/square/Square_SatinNickel.png", withKnob: "/cabs_clean/hardware/square/Square_SatinNickel__with_knob.png" },
  { id: "square-chrome", name: "Square", finish: "Chrome", finishId: "chrome", thumbnail: "/cabs_clean/hardware/square/Square_chrome.png", withKnob: "/cabs_clean/hardware/square/Square_chrome__with_knob.png" },
  { id: "square-matte", name: "Square", finish: "Matte Black", finishId: "matte_black", thumbnail: "/cabs_clean/hardware/square/Square_MatteBlack.png", withKnob: "/cabs_clean/hardware/square/Square_MatteBlack__with_knob.png" },
  { id: "square-rose", name: "Square", finish: "Rose Gold", finishId: "rose_gold", thumbnail: "/cabs_clean/hardware/square/Square_RoseGold.png", withKnob: "/cabs_clean/hardware/square/Square_RoseGold_with_knob.png" },
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
      className="relative overflow-hidden border border-white/10 rounded-3xl bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-[#FF8A3D]/50 transition-all cursor-pointer group"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF8A3D]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple
        onChange={handleFileChange} 
      />
      <div className="relative flex flex-col items-center gap-8 p-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] flex items-center justify-center shadow-2xl shadow-orange-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-bold text-white">Upload Your Kitchen</h3>
          <p className="text-white/60 text-lg max-w-md">Drag and drop or click to select photos of your current kitchen from multiple angles.</p>
        </div>
        <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors shadow-lg">
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
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-col-resize select-none ring-1 ring-white/10"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* Modified Image (Top Layer) */}
      <div 
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={modified} alt="Refaced" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          ✨ After
        </div>
      </div>

      {/* Original Image (Bottom Layer) */}
      <div className="absolute inset-0 z-0">
        <img src={original} alt="Original" className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
          Before
        </div>
      </div>

      {/* Slider Bar */}
      <div 
        className="absolute inset-y-0 z-20 w-1 bg-white shadow-xl"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-4 4m0 0l4 4m-4-4h18m-4-11l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// =============== PREMIUM PRODUCT CARD ===============
function ProductCard({ 
  image, 
  title, 
  subtitle, 
  isSelected, 
  onClick,
  size = "normal"
}: { 
  image: string; 
  title: string; 
  subtitle?: string; 
  isSelected: boolean; 
  onClick: () => void;
  size?: "small" | "normal" | "large";
}) {
  const sizeClasses = {
    small: "h-20",
    normal: "h-28",
    large: "h-36"
  };

  return (
    <button
      onClick={onClick}
      className={`group relative w-full ${sizeClasses[size]} rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected 
          ? "ring-2 ring-[#FF8A3D] ring-offset-2 ring-offset-[#0a0a0f] scale-[1.02] shadow-xl shadow-orange-500/20" 
          : "ring-1 ring-white/10 hover:ring-white/30"
      }`}
    >
      <Image 
        src={image} 
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
        <div className="font-bold text-white text-sm leading-tight">{title}</div>
        {subtitle && <div className="text-white/60 text-xs mt-0.5">{subtitle}</div>}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF8A3D] rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

// =============== HARDWARE THUMBNAIL ===============
function HardwareThumbnail({ 
  hardware, 
  isSelected, 
  onClick 
}: { 
  hardware: HardwareOption; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 p-3 transition-all duration-300 ${
        isSelected 
          ? "ring-2 ring-[#FF8A3D] ring-offset-2 ring-offset-[#0a0a0f] scale-[1.02]" 
          : "ring-1 ring-white/10 hover:ring-white/30"
      }`}
    >
      <div className="relative w-full h-full">
        <Image 
          src={hardware.thumbnail} 
          alt={`${hardware.name} ${hardware.finish}`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
        />
      </div>
      {isSelected && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-[#FF8A3D] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

// =============== LIVE PREVIEW PANEL ===============
function LivePreviewPanel({ selections }: { selections: UserSelections }) {
  return (
    <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h4 className="text-xs font-bold text-[#FF8A3D] uppercase tracking-widest">Live Preview</h4>
      </div>
      <div className="p-4 space-y-4">
        {/* Door Preview */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
          <Image 
            src={selections.finish.doorImage} 
            alt={`${selections.finish.name} Kitchen`}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
            <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <div className="text-xs text-white/60">Style</div>
              <div className="text-sm font-bold text-white">{DOOR_STYLES.find(d => d.id === selections.doorStyle)?.name}</div>
            </div>
            <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-right">
              <div className="text-xs text-white/60">Finish</div>
              <div className="text-sm font-bold text-white">{selections.finish.name}</div>
            </div>
          </div>
        </div>
        
        {/* Hardware Preview */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="w-16 h-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg flex items-center justify-center p-2">
            <Image 
              src={selections.hardware.thumbnail} 
              alt={selections.hardware.name}
              width={48}
              height={48}
              className="object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{selections.hardware.name}</div>
            <div className="text-xs text-white/60">{selections.hardware.finish}</div>
          </div>
        </div>
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
      <div className="bg-[#0a0a0f] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#FF6B35] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">See Your Transformation</h2>
        <p className="text-white/60 text-center mb-8">Enter your info and we'll generate your personalized kitchen visualization.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#FF8A3D] focus:ring-1 focus:ring-[#FF8A3D] outline-none transition-colors"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Phone</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#FF8A3D] focus:ring-1 focus:ring-[#FF8A3D] outline-none transition-colors"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#FF8A3D] focus:ring-1 focus:ring-[#FF8A3D] outline-none transition-colors"
              placeholder="john@email.com"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isLoading 
                ? "bg-white/10 text-white/40 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white hover:shadow-lg hover:shadow-orange-500/30"
            }`}
          >
            {isLoading ? "Generating..." : "Visualize My Kitchen →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// =============== MAIN PAGE COMPONENT ===============
export default function CabinetVisionPage() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<UserSelections>({
    doorStyle: "shaker",
    finish: FINISH_OPTIONS[0],
    hardware: HARDWARE_OPTIONS[0],
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

  // Get available finishes for selected door style
  const availableFinishes = FINISH_OPTIONS.filter(f => f.availableFor.includes(selections.doorStyle));

  // Group hardware by style
  const hardwareStyles = ["Arch", "Bar Pull", "Cottage", "Loft", "Square"];
  const [selectedHardwareStyle, setSelectedHardwareStyle] = useState("Arch");
  const filteredHardware = HARDWARE_OPTIONS.filter(h => h.name === selectedHardwareStyle);

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

  const handleDoorStyleChange = (style: DoorStyle) => {
    const finishesForStyle = FINISH_OPTIONS.filter(f => f.availableFor.includes(style));
    const currentFinishValid = finishesForStyle.find(f => f.id === selections.finish.id);
    setSelections(prev => ({ 
      ...prev, 
      doorStyle: style, 
      finish: currentFinishValid || finishesForStyle[0] 
    }));
  };

  const handleVisualize = () => {
    if (vizState.originalImages.length === 0) return;
    if (!leadInfo.email) {
      setShowLeadCapture(true);
      return;
    }
    runVisualizationWithLead(leadInfo.name, leadInfo.phone, leadInfo.email);
  };

  const handleLeadSubmit = (name: string, phone: string, email: string) => {
    setLeadInfo({ name, phone, email });
    setShowLeadCapture(false);
    runVisualizationWithLead(name, phone, email);
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
      fd.append("hardwareStyle", selections.hardware.name);
      fd.append("hardwareColor", selections.hardware.finish);
      fd.append("hardware", `${selections.hardware.name} ${selections.hardware.finish}`);
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
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8 pt-24">
        <div className="max-w-[1600px] mx-auto">
          {vizState.originalImages.length === 0 ? (
            /* ========== UPLOAD STATE ========== */
            <div className="max-w-4xl mx-auto py-12 space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white">
                  Kitchen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Visualizer</span>
                </h1>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  Upload photos of your kitchen and see it transformed with premium cabinet doors and hardware.
                </p>
              </div>
              <Uploader onUpload={handleUpload} />
              
              {/* Product Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8A3D]/20 to-transparent flex items-center justify-center mb-4">
                    <span className="text-2xl">🚪</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">5 Door Styles</h3>
                  <p className="text-white/60 text-sm">From classic Shaker to modern Slab profiles</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8A3D]/20 to-transparent flex items-center justify-center mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">13+ Finishes</h3>
                  <p className="text-white/60 text-sm">Premium colors and authentic wood grains</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8A3D]/20 to-transparent flex items-center justify-center mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Designer Hardware</h3>
                  <p className="text-white/60 text-sm">Curated pulls and knobs in 4 finishes</p>
                </div>
              </div>
            </div>
          ) : (
            /* ========== CONFIGURATOR STATE ========== */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left: Visualizer Preview */}
              <div className="xl:col-span-8 space-y-6">
                {/* Main Preview */}
                <div className="bg-black rounded-3xl p-2 shadow-2xl ring-1 ring-white/10">
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
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
                          className={`w-full h-full object-cover transition-all duration-500 ${vizState.isLoading ? "opacity-50 blur-sm scale-105" : ""}`} 
                        />
                        {vizState.isLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                              <div className="w-20 h-20 border-4 border-white/20 border-t-[#FF8A3D] rounded-full animate-spin mx-auto" />
                              <p className="text-white font-bold text-xl animate-pulse">Transforming your kitchen...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-end justify-center pb-8">
                            <button 
                              onClick={handleVisualize}
                              className="px-10 py-4 bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white font-bold rounded-full shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all hover:scale-105"
                            >
                              ✨ Generate Visualization
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {vizState.originalImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVizState(prev => ({ ...prev, currentImageIndex: idx }))}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all ${
                        vizState.currentImageIndex === idx 
                          ? "ring-2 ring-[#FF8A3D] scale-105" 
                          : "ring-1 ring-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {vizState.modifiedImages[idx] && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </button>
                  ))}
                  <button 
                    onClick={() => setVizState({ originalImages: [], modifiedImages: {}, currentImageIndex: 0, isLoading: false, error: null })}
                    className="w-24 h-24 flex-shrink-0 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:border-[#FF8A3D] hover:text-[#FF8A3D] transition-colors"
                  >
                    <span className="text-2xl">+</span>
                    <span className="text-xs">New</span>
                  </button>
                </div>

                {vizState.error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                    {vizState.error}
                  </div>
                )}
              </div>

              {/* Right: Configurator Panel */}
              <div className="xl:col-span-4 space-y-6">
                {/* Steps Tabs */}
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                  {[
                    { num: 1, label: "Style" },
                    { num: 2, label: "Finish" },
                    { num: 3, label: "Hardware" }
                  ].map((step) => (
                    <button
                      key={step.num}
                      onClick={() => setActiveStep(step.num as 1 | 2 | 3)}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                        activeStep === step.num
                          ? "bg-[#FF8A3D] text-white shadow-lg"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {step.num}. {step.label}
                    </button>
                  ))}
                </div>

                {/* Step Content */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-5 max-h-[60vh] overflow-y-auto">
                  {activeStep === 1 && (
                    <>
                      <h3 className="text-lg font-bold text-white">Select Door Style</h3>
                      <div className="space-y-3">
                        {DOOR_STYLES.map((style) => (
                          <ProductCard
                            key={style.id}
                            image={style.heroImage}
                            title={style.name}
                            subtitle={style.desc}
                            isSelected={selections.doorStyle === style.id}
                            onClick={() => handleDoorStyleChange(style.id)}
                            size="normal"
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setActiveStep(2)}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                      >
                        Next: Choose Finish →
                      </button>
                    </>
                  )}

                  {activeStep === 2 && (
                    <>
                      <h3 className="text-lg font-bold text-white">Select Finish</h3>
                      <p className="text-white/50 text-sm">Available for {DOOR_STYLES.find(d => d.id === selections.doorStyle)?.name}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {availableFinishes.map((finish) => (
                          <ProductCard
                            key={finish.id}
                            image={finish.doorImage}
                            title={finish.name}
                            subtitle={finish.isWoodGrain ? "Wood Grain" : "Solid"}
                            isSelected={selections.finish.id === finish.id}
                            onClick={() => setSelections(prev => ({ ...prev, finish }))}
                            size="small"
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setActiveStep(3)}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                      >
                        Next: Choose Hardware →
                      </button>
                    </>
                  )}

                  {activeStep === 3 && (
                    <>
                      <h3 className="text-lg font-bold text-white">Select Hardware</h3>
                      
                      {/* Hardware Style Tabs */}
                      <div className="flex flex-wrap gap-2">
                        {hardwareStyles.map((style) => (
                          <button
                            key={style}
                            onClick={() => setSelectedHardwareStyle(style)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedHardwareStyle === style
                                ? "bg-[#FF8A3D] text-white"
                                : "bg-white/10 text-white/60 hover:text-white"
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>

                      {/* Hardware Options */}
                      <div className="grid grid-cols-4 gap-3">
                        {filteredHardware.map((hw) => (
                          <HardwareThumbnail
                            key={hw.id}
                            hardware={hw}
                            isSelected={selections.hardware.id === hw.id}
                            onClick={() => setSelections(prev => ({ ...prev, hardware: hw }))}
                          />
                        ))}
                      </div>
                      
                      {/* Selected Hardware Info */}
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="w-16 h-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg flex items-center justify-center p-2">
                          <Image 
                            src={selections.hardware.withKnob} 
                            alt={selections.hardware.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white">{selections.hardware.name}</div>
                          <div className="text-sm text-white/60">{selections.hardware.finish}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Live Preview Panel */}
                <LivePreviewPanel selections={selections} />

                {/* Generate Button */}
                <button
                  onClick={handleVisualize}
                  disabled={vizState.isLoading}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                    vizState.isLoading
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
                  }`}
                >
                  {vizState.isLoading ? "Generating..." : "✨ Apply & Visualize"}
                </button>
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
