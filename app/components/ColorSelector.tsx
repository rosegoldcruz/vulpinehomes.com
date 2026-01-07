"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Define color swatches with their hex values
const colorSwatches: Record<string, { hex: string; name: string }> = {
  "Flour": { hex: "#f5f5f0", name: "Flour" },
  "Storm": { hex: "#5a6670", name: "Storm" },
  "Graphite": { hex: "#3d3d3d", name: "Graphite" },
  "Espresso-Walnut": { hex: "#3c2415", name: "Espresso Walnut" },
  "Slate": { hex: "#708090", name: "Slate" },
  "Mist": { hex: "#c8c8c8", name: "Mist" },
  "Latte-Walnut": { hex: "#a67b5b", name: "Latte Walnut" },
  "Snow-Gloss": { hex: "#fffafa", name: "Snow Gloss" },
  "Urban-Teak": { hex: "#8b7355", name: "Urban Teak" },
  "Platinum-Teak": { hex: "#b8a88a", name: "Platinum Teak" },
  "Wheat-Oak": { hex: "#d4a574", name: "Wheat Oak" },
  "Nimbus-Oak": { hex: "#9e8b7d", name: "Nimbus Oak" },
  "Sable-Oak": { hex: "#5c4033", name: "Sable Oak" },
};

// Organized by door style with available colors
const doorStyleColors: Record<string, { color: string; image: string }[]> = {
  "SHAKER CLASSIC": [
    { color: "Flour", image: "/cabs_clean/kitchens/Flour-Shaker_Kitchen.jpg" },
    { color: "Storm", image: "/cabs_clean/kitchens/Storm-Shaker_Kitchen (1).jpg" },
    { color: "Graphite", image: "/cabs_clean/kitchens/Graphite-Shaker_Kitchen.jpg" },
    { color: "Espresso-Walnut", image: "/cabs_clean/kitchens/Espresso-Walnut-Shaker_Kitchen.jpg" },
    { color: "Slate", image: "/cabs_clean/kitchens/Slate-Shaker_Kitchen.jpg" },
    { color: "Mist", image: "/cabs_clean/kitchens/Mist-Shaker_Kitchen.jpg" },
    { color: "Latte-Walnut", image: "/cabs_clean/kitchens/Latte-Walnut-Shaker_Kitchen.jpg" },
    { color: "Nimbus-Oak", image: "/cabs_clean/kitchens/Nimbus-Oak-Shaker_Kitchen.jpg" },
    { color: "Sable-Oak", image: "/cabs_clean/kitchens/Sable-Oak-Shaker.jpg" },
  ],
  "SHAKER SLIDE": [
    { color: "Flour", image: "/cabs_clean/kitchens/Flour-Slide_Kitchen.jpg" },
    { color: "Storm", image: "/cabs_clean/kitchens/Storm-Slide_Kitchen.jpg" },
    { color: "Graphite", image: "/cabs_clean/kitchens/Graphite-Slide_Kitchen.jpg" },
    { color: "Espresso-Walnut", image: "/cabs_clean/kitchens/Espresso-Walnut-Slide_Kitchen.jpg" },
  ],
  "FUSION SHAKER": [
    { color: "Flour", image: "/cabs_clean/kitchens/Flour-Fusion-Shaker_Kitchen.jpg" },
    { color: "Storm", image: "/cabs_clean/kitchens/Storm-Fusion-Shaker_Kitchen (1).jpg" },
    { color: "Graphite", image: "/cabs_clean/kitchens/Graphite-Fusion-Shaker_Kitchen.jpg" },
    { color: "Espresso-Walnut", image: "/cabs_clean/kitchens/Espresso-Walnut-Fusion-Shaker.jpg" },
    { color: "Slate", image: "/cabs_clean/kitchens/Slate-Fusion-Shaker_Kitchen.jpg" },
    { color: "Mist", image: "/cabs_clean/kitchens/Mist-Fusion-Shaker_Kitchen.jpg" },
    { color: "Latte-Walnut", image: "/cabs_clean/kitchens/Latte-Walnut-Fusion-Shaker_Kitchen.jpg" },
  ],
  "FUSION SLIDE": [
    { color: "Flour", image: "/cabs_clean/kitchens/Flour-Fusion-Slide_Kitchen.jpg" },
    { color: "Storm", image: "/cabs_clean/kitchens/Storm-Fusion-Slide_Kitchen (1).jpg" },
    { color: "Graphite", image: "/cabs_clean/kitchens/Graphite-Fusion-Slide_Kitchen.jpg" },
    { color: "Espresso-Walnut", image: "/cabs_clean/kitchens/Espresso-Walnut-Fusion-Slide.jpg" },
  ],
  "SLAB": [
    { color: "Flour", image: "/cabs_clean/kitchens/Flour-Slab_Kitchen.jpg" },
    { color: "Storm", image: "/cabs_clean/kitchens/Storm-Slab_Kitchen.jpg" },
    { color: "Graphite", image: "/cabs_clean/kitchens/Graphite-Slab_Kitchen.jpg" },
    { color: "Espresso-Walnut", image: "/cabs_clean/kitchens/Espresso-Walnut-Slab.jpg" },
    { color: "Slate", image: "/cabs_clean/kitchens/Slate-Slab_Kitchen.jpg" },
    { color: "Mist", image: "/cabs_clean/kitchens/Mist-Slab_Kitchen.jpg" },
    { color: "Latte-Walnut", image: "/cabs_clean/kitchens/Latte-Walnut-Slab_Kitchen.jpg" },
    { color: "Snow-Gloss", image: "/cabs_clean/kitchens/Snow-Gloss-Slab_Kitchen.jpg" },
    { color: "Urban-Teak", image: "/cabs_clean/kitchens/Urban-Teak-Slab_Kitchen.jpg" },
    { color: "Platinum-Teak", image: "/cabs_clean/kitchens/Platinum-Teak-Slab_Kitchen.jpg" },
    { color: "Wheat-Oak", image: "/cabs_clean/kitchens/Wheat-Oak-Slab.jpg" },
  ],
};

// Get all unique images for preloading
const allImages = Object.values(doorStyleColors).flat().map(item => item.image);

export default function ColorSelector() {
  const [selectedStyle, setSelectedStyle] = useState("SHAKER CLASSIC");
  const [selectedColor, setSelectedColor] = useState("Flour");
  const [currentImage, setCurrentImage] = useState("/cabs_clean/kitchens/Flour-Shaker_Kitchen.jpg");
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload all images on mount for instant switching
  useEffect(() => {
    allImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
    setIsLoaded(true);
  }, []);

  // Handle color click - instant image switch
  const handleColorClick = (style: string, color: string, image: string) => {
    setSelectedStyle(style);
    setSelectedColor(color);
    setCurrentImage(image);
  };

  // Get current color info
  const currentColorInfo = colorSwatches[selectedColor] || { hex: "#888", name: selectedColor.replace("-", " ") };
  
  // Find current style and color details
  const currentStyleColors = doorStyleColors[selectedStyle] || [];
  const currentItem = currentStyleColors.find(item => item.color === selectedColor);

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">From Classic To Modern,</span>{" "}
          <span className="text-white">We've Got Your Color</span>
        </h2>
        <p className="text-lg text-white/60">
          Select the perfect style and color for your project.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left side - Color swatches by door style */}
        <div className="lg:w-[280px] flex-shrink-0 space-y-6">
          {Object.entries(doorStyleColors).map(([style, colors]) => (
            <div key={style}>
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
                {style}
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((item) => {
                  const swatch = colorSwatches[item.color];
                  const isSelected = selectedStyle === style && selectedColor === item.color;
                  return (
                    <button
                      key={`${style}-${item.color}`}
                      onClick={() => handleColorClick(style, item.color, item.image)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110 ${
                        isSelected
                          ? "border-[#FF8A3D] ring-2 ring-[#FF8A3D] ring-offset-2 ring-offset-[#0f0f18] scale-110"
                          : "border-white/30 hover:border-white/60"
                      }`}
                      style={{ backgroundColor: swatch?.hex || "#888" }}
                      title={swatch?.name || item.color}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Kitchen image display */}
        <div className="flex-1">
          <div className="relative bg-white/5 rounded-2xl overflow-hidden shadow-xl border border-white/10">
            {/* Main kitchen image */}
            <div className="relative aspect-[16/10]">
              <Image
                src={currentImage}
                alt={`${selectedStyle} - ${currentColorInfo.name}`}
                fill
                className="object-cover transition-opacity duration-200"
                priority
                sizes="(max-width: 768px) 100vw, 70vw"
              />
              
            </div>

            {/* Info bar at bottom */}
            <div className="bg-[#0a0a0f] text-white p-4 md:p-6 border-t border-white/10">
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                {selectedStyle.charAt(0) + selectedStyle.slice(1).toLowerCase()}
              </h3>
              <p className="text-white/80">
                <span className="text-[#FF8A3D] font-semibold">{currentColorInfo.name}:</span>{" "}
                {getColorDescription(selectedColor)}
              </p>
            </div>
          </div>

          {/* Quick style tabs for mobile */}
          <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
            {Object.keys(doorStyleColors).map((style) => (
              <button
                key={style}
                onClick={() => {
                  const firstColor = doorStyleColors[style][0];
                  handleColorClick(style, firstColor.color, firstColor.image);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStyle === style
                    ? "bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorDescription(color: string): string {
  const descriptions: Record<string, string> = {
    "Flour": "A warm, creamy white perfect for bright, airy kitchens. Available in all door styles.",
    "Storm": "A sophisticated medium gray with cool undertones. Available in all door styles.",
    "Graphite": "A deep charcoal gray for bold, modern statements. Available in all door styles.",
    "Espresso-Walnut": "The classic dark brown walnut with wood grain texture. Available in all door styles.",
    "Slate": "A blue-gray tone that adds depth and character. Available in select door styles.",
    "Mist": "A soft, light gray that's versatile and timeless. Available in select door styles.",
    "Latte-Walnut": "A warm medium brown with natural wood grain. Available in select door styles.",
    "Snow-Gloss": "A bright white with a glossy, reflective finish. Available in Slab style.",
    "Urban-Teak": "A rich teak with urban contemporary appeal. Available in Slab style.",
    "Platinum-Teak": "A lighter teak with platinum undertones. Available in Slab style.",
    "Wheat-Oak": "A warm wheat-toned oak with natural character. Available in Slab style.",
    "Nimbus-Oak": "A soft gray-brown oak with cloud-like tones. Available in Shaker style.",
    "Sable-Oak": "A deep, rich brown oak. Available in Shaker style.",
  };
  return descriptions[color] || "A beautiful color option for your kitchen.";
}
