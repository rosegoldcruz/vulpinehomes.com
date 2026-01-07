"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

type VisualizationResult = {
  original: string;
  transformed: string;
  styleApplied: string;
  colorApplied: string;
};

type DoorStyle = {
  id: string;
  name: string;
  category: string;
  image: string;
};

type DoorColor = {
  id: string;
  name: string;
  hex: string;
  texture?: string;
};

const DOOR_STYLES: DoorStyle[] = [
  { id: "shaker", name: "Shaker Classic", category: "Traditional", image: "/styles/shaker.jpg" },
  { id: "fusion", name: "Fusion", category: "Modern", image: "/styles/fusion.jpg" },
  { id: "slab", name: "Slab", category: "Contemporary", image: "/styles/slab.jpg" },
  { id: "slide", name: "Slide", category: "Enhanced", image: "/styles/slide.jpg" }
];

const DOOR_COLORS: DoorColor[] = [
  { id: "graphite", name: "Graphite", hex: "#3a3a3c" },
  { id: "slate", name: "Slate", hex: "#5a6c7d" },
  { id: "storm", name: "Storm", hex: "#6b7280" },
  { id: "mist", name: "Mist", hex: "#e5e7eb" },
  { id: "espresso", name: "Espresso Walnut", hex: "#3c2415", texture: "wood" },
  { id: "flour", name: "Flour", hex: "#faf9f6" },
  { id: "nimbus", name: "Nimbus Oak", hex: "#8b7355", texture: "wood" },
  { id: "paint-ready", name: "Paint Ready", hex: "#ffffff" },
  { id: "latte-walnut", name: "Latte Walnut", hex: "#a0826d", texture: "wood" },
  { id: "urban-teak", name: "Urban Teak", hex: "#7a5c47", texture: "wood" },
  { id: "platinum-teak", name: "Platinum Teak", hex: "#9ca3af", texture: "wood" }
];

export default function VulpineVisualizerPage() {
  const [step, setStep] = useState<"upload" | "style" | "visualize" | "contact">("upload");
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("shaker");
  const [selectedColor, setSelectedColor] = useState<string>("graphite");
  const [visualizations, setVisualizations] = useState<VisualizationResult[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [comparisonMode, setComparisonMode] = useState<"slider" | "side-by-side">("slider");
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    doors: "",
    drawers: "",
    notes: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    
    setUploadedImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0 && uploadedImages.length === 0) {
      setStep("style");
    }
  };

  const processVisualization = async () => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      uploadedImages.forEach((image, idx) => {
        formData.append(`image_${idx}`, image);
      });
      formData.append("style", selectedStyle);
      formData.append("color", selectedColor);

      const response = await fetch("/api/vulpine-ai-visualizer", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Visualization failed");

      const results = await response.json();
      setVisualizations(results.visualizations);
      setStep("visualize");
    } catch (error) {
      console.error("Error processing visualization:", error);
      // Fallback to demo mode for now
      const demoResults = uploadedImages.map(img => ({
        original: img,
        transformed: img, // In production, this would be the AI-transformed image
        styleApplied: selectedStyle,
        colorApplied: selectedColor
      }));
      setVisualizations(demoResults);
      setStep("visualize");
    } finally {
      setLoading(false);
    }
  };

  const handleSliderMove = (e: MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleContactSubmit = async () => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      Object.entries(contactForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Include visualization results
      formData.append("selectedStyle", selectedStyle);
      formData.append("selectedColor", selectedColor);
      visualizations.forEach((viz, idx) => {
        formData.append(`visualization_${idx}`, viz.transformed);
      });

      const response = await fetch("/api/vulpine-lead-capture", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Submission failed");

      // Success - show confirmation
      alert("Perfect! We'll text you within 24 hours with your custom quote and to schedule your free consultation.");
      
      // Reset form
      setStep("upload");
      setUploadedImages([]);
      setVisualizations([]);
      setContactForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        doors: "",
        drawers: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again or call us directly at (480) 555-0123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🦊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Vulpine AI Kitchen Visualizer</h1>
              <p className="text-xs text-slate-400">Powered by RefaceKit</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = "tel:+16232670852"}
            className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
          >
            Call Now
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-900 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={step === "upload" ? "text-emerald-400" : "text-slate-500"}>Upload Photos</span>
            <span className={step === "style" ? "text-emerald-400" : "text-slate-500"}>Choose Style</span>
            <span className={step === "visualize" ? "text-emerald-400" : "text-slate-500"}>See Results</span>
            <span className={step === "contact" ? "text-emerald-400" : "text-slate-500"}>Get Quote</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${step === "upload" ? 25 : step === "style" ? 50 : step === "visualize" ? 75 : 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Step */}
        {step === "upload" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Transform Your Kitchen in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                  60 Seconds
                </span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Take 3-5 photos of your kitchen. Our AI will instantly show you how amazing it'll look with new RefaceKit cabinet doors.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">📸</span>
                  Photo Tips for Best Results
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Stand back to capture full cabinet walls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Include corners to show L-shaped layouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Good lighting helps (open blinds/turn on lights)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Don't worry about clutter - AI removes it</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="text-6xl mb-4">📷</div>
                  <p className="font-semibold mb-2">Click to Upload Kitchen Photos</p>
                  <p className="text-sm text-slate-400">or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-4">Supports JPG, PNG, HEIC</p>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedImages.length > 0 && (
                  <button
                    onClick={() => setStep("style")}
                    className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    Next: Choose Your Style →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Style Selection Step */}
        {step === "style" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Choose Your Dream Kitchen Style</h2>
              <p className="text-slate-400">Select a door style and color that matches your vision</p>
            </div>

            <div className="space-y-6">
              {/* Door Styles */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Door Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {DOOR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        selectedStyle === style.id 
                          ? "border-emerald-400 shadow-lg shadow-emerald-400/20" 
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 p-4">
                        <div className="w-full h-full bg-slate-700 rounded-lg" />
                      </div>
                      <div className="p-3 bg-slate-900">
                        <p className="font-semibold text-sm">{style.name}</p>
                        <p className="text-xs text-slate-400">{style.category}</p>
                      </div>
                      {selectedStyle === style.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Door Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cabinet Color</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {DOOR_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedColor === color.id 
                          ? "border-emerald-400 shadow-lg" 
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div 
                        className="aspect-square"
                        style={{ 
                          backgroundColor: color.hex,
                          backgroundImage: color.texture === "wood" 
                            ? `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`
                            : undefined
                        }}
                      />
                      <div className="p-2 bg-slate-900">
                        <p className="text-xs font-medium truncate">{color.name}</p>
                      </div>
                      {selectedColor === color.id && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 bg-slate-800 text-white font-semibold py-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={processVisualization}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "See Your New Kitchen →"}
              </button>
            </div>
          </div>
        )}

        {/* Visualization Step */}
        {step === "visualize" && visualizations.length > 0 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Your Kitchen Transformation</h2>
              <p className="text-slate-400">Swipe the slider to see before & after</p>
            </div>

            {/* Image Thumbnails */}
            {visualizations.length > 1 && (
              <div className="flex gap-2 justify-center">
                {visualizations.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-emerald-400" : "border-slate-700"
                    }`}
                  >
                    <img 
                      src={visualizations[idx].original} 
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Comparison View */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden">
              <div className="flex gap-2 p-4 bg-slate-950">
                <button
                  onClick={() => setComparisonMode("slider")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    comparisonMode === "slider" 
                      ? "bg-emerald-500 text-black" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Slider View
                </button>
                <button
                  onClick={() => setComparisonMode("side-by-side")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    comparisonMode === "side-by-side" 
                      ? "bg-emerald-500 text-black" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Side by Side
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                {comparisonMode === "slider" ? (
                  <div 
                    ref={sliderRef}
                    className="relative w-full h-full overflow-hidden cursor-col-resize"
                    onMouseDown={(e) => {
                      const handleMove = (e: MouseEvent) => handleSliderMove(e);
                      const handleUp = () => {
                        document.removeEventListener("mousemove", handleMove);
                        document.removeEventListener("mouseup", handleUp);
                      };
                      document.addEventListener("mousemove", handleMove);
                      document.addEventListener("mouseup", handleUp);
                      handleSliderMove(e.nativeEvent);
                    }}
                    onTouchStart={(e) => {
                      const handleMove = (e: TouchEvent) => handleSliderMove(e);
                      const handleUp = () => {
                        document.removeEventListener("touchmove", handleMove);
                        document.removeEventListener("touchend", handleUp);
                      };
                      document.addEventListener("touchmove", handleMove);
                      document.addEventListener("touchend", handleUp);
                      handleSliderMove(e.nativeEvent);
                    }}
                  >
                    {/* Before Image */}
                    <img 
                      src={visualizations[activeImageIndex].original}
                      alt="Before"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    
                    {/* After Image with Clip */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    >
                      <img 
                        src={visualizations[activeImageIndex].transformed}
                        alt="After"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Slider Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur">
                      <p className="text-sm font-semibold">Before</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-500/80 text-black px-3 py-1 rounded-lg backdrop-blur">
                      <p className="text-sm font-semibold">After</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 h-full">
                    <div className="relative">
                      <img 
                        src={visualizations[activeImageIndex].original}
                        alt="Before"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur">
                        <p className="text-sm font-semibold">Before</p>
                      </div>
                    </div>
                    <div className="relative">
                      <img 
                        src={visualizations[activeImageIndex].transformed}
                        alt="After"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-4 left-4 bg-emerald-500/80 text-black px-3 py-1 rounded-lg backdrop-blur">
                        <p className="text-sm font-semibold">After</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Estimate */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Estimated Investment</h3>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                  Save 40-60% vs Full Remodel
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-emerald-400">$3,500</p>
                  <p className="text-sm text-slate-400">Small Kitchen (10-15 doors)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">$5,500</p>
                  <p className="text-sm text-slate-400">Average Kitchen (16-25 doors)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">$8,500+</p>
                  <p className="text-sm text-slate-400">Large Kitchen (26+ doors)</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center mt-4">
                *Final pricing after in-home measurement. Includes doors, installation, and hardware.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setStep("contact")}
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold py-4 rounded-xl hover:shadow-lg transition-all text-lg"
              >
                Get My Free Quote →
              </button>
              <button
                onClick={() => window.location.href = "tel:+16232670852"}
                className="bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all text-lg"
              >
                📞 Call Now: +16232670852
              </button>
            </div>
          </div>
        )}

        {/* Contact Step */}
        {step === "contact" && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Get Your Free Quote</h2>
              <p className="text-slate-400">We'll text you within 24 hours to schedule your free consultation</p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">City/Area *</label>
                  <input
                    type="text"
                    value={contactForm.city}
                    onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
                    className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Approx # of Doors</label>
                  <input
                    type="text"
                    value={contactForm.doors}
                    onChange={(e) => setContactForm({...contactForm, doors: e.target.value})}
                    className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="e.g., 15-20"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Approx # of Drawers</label>
                  <input
                    type="text"
                    value={contactForm.drawers}
                    onChange={(e) => setContactForm({...contactForm, drawers: e.target.value})}
                    className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="e.g., 8-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">Special Requests / Notes</label>
                <textarea
                  value={contactForm.notes}
                  onChange={(e) => setContactForm({...contactForm, notes: e.target.value})}
                  className="w-full bg-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-400 h-24 resize-none"
                  placeholder="Island cabinets, bathroom vanities, special timeline needs..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("visualize")}
                  className="flex-1 bg-slate-800 text-white font-semibold py-3 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleContactSubmit}
                  disabled={loading || !contactForm.name || !contactForm.phone || !contactForm.city}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Get My Free Quote"}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  By submitting, you agree to receive text messages about your quote.
                  <br />
                  No spam, ever. Reply STOP to opt out.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <footer className="border-t border-slate-800 mt-16 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-semibold">500+ Kitchens</p>
              <p className="text-xs text-slate-400">Transformed in Phoenix</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-semibold">4.9 Stars</p>
              <p className="text-xs text-slate-400">200+ Reviews</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-semibold">3-Day Install</p>
              <p className="text-xs text-slate-400">Average Project Time</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm font-semibold">Save 60%</p>
              <p className="text-xs text-slate-400">vs Full Remodel</p>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-slate-500">
            © 2024 Vulpine Homes / RefaceKit LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}