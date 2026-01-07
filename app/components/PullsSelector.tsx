"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Pull styles with their main preview images and available finishes
const pullStyles = {
  arch: {
    name: "Arch",
    finishes: {
      rosegold: {
        name: "Rose Gold",
        hex: "#b76e79",
        mainImage: "/cabs_clean/hardware/arch/Arch_RoseGold.png",
        images: [
          "/cabs_clean/hardware/arch/Arch_RoseGold.png",
          "/cabs_clean/hardware/arch/Arch_RoseGoldSize 1in 7-16 - Edited.png",
          "/cabs_clean/hardware/arch/Arch_RoseGold_Size 6 Inches - Edited.png",
          "/cabs_clean/hardware/arch/Arch_RoseGold_-Size 7 1-8in - Edited.png",
          "/cabs_clean/hardware/arch/Arch_RoseGold_with_tpull.png",
        ],
      },
      satinnickel: {
        name: "Satin Nickel",
        hex: "#c0c0c0",
        mainImage: "/cabs_clean/hardware/arch/Arch_SatinNickel.png",
        images: [
          "/cabs_clean/hardware/arch/Arch_SatinNickel.png",
          "/cabs_clean/hardware/arch/Arch_SatinNickel-Size 1in 7-16 - Edited.png",
          "/cabs_clean/hardware/arch/Arch_SatinNickel_Size 6 Inches - Edited.png",
          "/cabs_clean/hardware/arch/Arch_SatinNickel-Size 7 1-8in - Edited.png",
          "/cabs_clean/hardware/arch/Arch_SatinNickel_with_tpull.png",
        ],
      },
      matteblack: {
        name: "Matte Black",
        hex: "#2d2d2d",
        mainImage: "/cabs_clean/hardware/arch/Arch_MatteBlack.png",
        images: [
          "/cabs_clean/hardware/arch/Arch_MatteBlack.png",
          "/cabs_clean/hardware/arch/Arch_MatteBlack_Size 1in 7-16 - Edited.png",
          "/cabs_clean/hardware/arch/Arch_MatteBlack_Size 6 Inches - Edited.png",
          "/cabs_clean/hardware/arch/Arch_MatteBlack_Size 7 1-8in - Edited.png",
          "/cabs_clean/hardware/arch/Arch_MatteBlack_with _tpull.png",
        ],
      },
      chrome: {
        name: "Chrome",
        hex: "#e8e8e8",
        mainImage: "/cabs_clean/hardware/arch/arch_chrome.png",
        images: [
          "/cabs_clean/hardware/arch/arch_chrome.png",
          "/cabs_clean/hardware/arch/arch_chrome_Size 1in 7-16.png",
          "/cabs_clean/hardware/arch/arch_chrome_6in.png",
          "/cabs_clean/hardware/arch/arch_chrome_7 1-8in.png",
          "/cabs_clean/hardware/arch/arch_chrome_with_tpull.png",
        ],
      },
    },
  },
  artisan: {
    name: "Artisan",
    finishes: {
      rose_gold: {
        name: "Rose Gold",
        hex: "#b76e79",
        mainImage: "/cabs_clean/hardware/artisan/Artisan_RoseGold.png",
        images: [
          "/cabs_clean/hardware/artisan/Artisan_RoseGold.png",
          "/cabs_clean/hardware/artisan/Artisan_RoseGold_Size1 7-32 Inch Knob - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_RoseGold_Size4 3-4 Inches - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_RoseGold_Size6 1-6 Inches - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_RoseGold_with_knob.png.png",
        ],
      },
      satin_nickel: {
        name: "Satin Nickel",
        hex: "#c0c0c0",
        mainImage: "/cabs_clean/hardware/artisan/Artisan_SatinNickel.png",
        images: [
          "/cabs_clean/hardware/artisan/Artisan_SatinNickel.png",
          "/cabs_clean/hardware/artisan/Artisan_SatinNickel_Size1 7-32 Inch Knob .png",
          "/cabs_clean/hardware/artisan/Artisan_SatinNickel_Size4 3-4 Inches .png",
          "/cabs_clean/hardware/artisan/Artisan_SatinNickel_Size6 1-6 Inches.png",
          "/cabs_clean/hardware/artisan/Artisan_SatinNickel_with_knob.png.png",
        ],
      },
      matte_black: {
        name: "Matte Black",
        hex: "#2d2d2d",
        mainImage: "/cabs_clean/hardware/artisan/Artisan_MatteBlack.png",
        images: [
          "/cabs_clean/hardware/artisan/Artisan_MatteBlack.png",
          "/cabs_clean/hardware/artisan/Artisan_MatteBlack_Size1 7-32 Inch Knob - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_MatteBlack_Size4 3-4 Inches - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_MatteBlack_Size6 1-6-16 Inches - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_MatteBlack_with_knob.png.png",
        ],
      },
      chrome: {
        name: "Chrome",
        hex: "#e8e8e8",
        mainImage: "/cabs_clean/hardware/artisan/Artisan_Chrome.png",
        images: [
          "/cabs_clean/hardware/artisan/Artisan_Chrome.png",
          "/cabs_clean/hardware/artisan/Artisan_Chrome_Size1 7-32 Inch.png",
          "/cabs_clean/hardware/artisan/Artisan_Chrome_Size4 3-4 Inches.png",
          "/cabs_clean/hardware/artisan/Artisan_Chrome_6 1-16 Inches - Edited.png",
          "/cabs_clean/hardware/artisan/Artisan_Chrome_with_tpull.png.png",
        ],
      },
    },
  },
  cottage: {
    name: "Cottage",
    finishes: {
      rose_gold: {
        name: "Rose Gold",
        hex: "#b76e79",
        mainImage: "/cabs_clean/hardware/cottage/Cottage_RoseGold_.png.png",
        images: [
          "/cabs_clean/hardware/cottage/Cottage_RoseGold_.png.png",
          "/cabs_clean/hardware/cottage/Cottage_RoseGold__K.png",
          "/cabs_clean/hardware/cottage/Cottage_RoseGold_96 .png",
          "/cabs_clean/hardware/cottage/Cottage_RoseGold_128-1.png",
          "/cabs_clean/hardware/cottage/Cottage_RoseGold_with_knob.png",
        ],
      },
      satin_nickel: {
        name: "Satin Nickel",
        hex: "#c0c0c0",
        mainImage: "/cabs_clean/hardware/cottage/Cottage__SatinNickel.png",
        images: [
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel.png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_Size1 7-32 Inch Knob .png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_Size4 3-4 Inches .png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_Size6 1-6 Inches .png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_with_knob.png",
        ],
      },
      matte_black: {
        name: "Matte Black",
        hex: "#2d2d2d",
        mainImage: "/cabs_clean/hardware/cottage/Cottage__SatinNickel.png",
        images: [
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel.png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_Size1 7-32 Inch Knob .png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_Size4 3-4 Inches .png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_Size6 1-6 Inches .png",
          "/cabs_clean/hardware/cottage/Cottage__SatinNickel_with_knob.png",
        ],
      },
      chrome: {
        name: "Chrome",
        hex: "#e8e8e8",
        mainImage: "/cabs_clean/hardware/cottage/Cottage__Chrome.png",
        images: [
          "/cabs_clean/hardware/cottage/Cottage__Chrome.png",
          "/cabs_clean/hardware/cottage/Cottage__Chrome_Size1 7-32 Inch Knob .png",
          "/cabs_clean/hardware/cottage/Cottage__Chrome_Size4 3-4 Inches.png",
          "/cabs_clean/hardware/cottage/Cottage__Chrome_Size6 1-6 Inches .png",
          "/cabs_clean/hardware/cottage/Cottage__Chrome_with_knob.png",
        ],
      },
    },
  },
  loft: {
    name: "Loft",
    finishes: {
      rose_gold: {
        name: "Rose Gold",
        hex: "#b76e79",
        mainImage: "/cabs_clean/hardware/loft/Loft_RoseGold.png",
        images: [
          "/cabs_clean/hardware/loft/Loft_RoseGold.png",
          "/cabs_clean/hardware/loft/Loft_RoseGold_size 15-16 inch knob .png",
          "/cabs_clean/hardware/loft/Loft_RoseGold_size 4 5-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_RoseGold_size 5 7-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_RoseGold_with_knob.png",
        ],
      },
      satin_nickel: {
        name: "Satin Nickel",
        hex: "#c0c0c0",
        mainImage: "/cabs_clean/hardware/loft/Loft_SatinNickel.png",
        images: [
          "/cabs_clean/hardware/loft/Loft_SatinNickel.png",
          "/cabs_clean/hardware/loft/Loft_SatinNickel_size 15-16 inch knob .png",
          "/cabs_clean/hardware/loft/Loft_SatinNickel_size 4 5-8 inch  .png",
          "/cabs_clean/hardware/loft/Loft_SatinNickel_size 5 7-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_SatinNickel_with_knob.png",
        ],
      },
      matte_black: {
        name: "Matte Black",
        hex: "#2d2d2d",
        mainImage: "/cabs_clean/hardware/loft/Loft_MatteBlack.png",
        images: [
          "/cabs_clean/hardware/loft/Loft_MatteBlack.png",
          "/cabs_clean/hardware/loft/Loft_MatteBlack_size 15-16 inch knob .png",
          "/cabs_clean/hardware/loft/Loft_MatteBlack_size 4 5-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_MatteBlack_size 5 7-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_MatteBlack__with_knob.png",
        ],
      },
      chrome: {
        name: "Chrome",
        hex: "#e8e8e8",
        mainImage: "/cabs_clean/hardware/loft/Loft_Chrome_1.png.png",
        images: [
          "/cabs_clean/hardware/loft/Loft_Chrome_1.png.png",
          "/cabs_clean/hardware/loft/Loft_Chrome_size 15-16 inch knob.png",
          "/cabs_clean/hardware/loft/Loft_Chrome_size 4 5-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_Chrome_size 5 7-8 inch .png",
          "/cabs_clean/hardware/loft/Loft_Chrome_with_knob.png",
        ],
      },
    },
  },
  square: {
    name: "Square",
    finishes: {
      rose_gold: {
        name: "Rose Gold",
        hex: "#b76e79",
        mainImage: "/cabs_clean/hardware/square/Square_RoseGold.png",
        images: [
          "/cabs_clean/hardware/square/Square_RoseGold.png",
          "/cabs_clean/hardware/square/Square_RoseGold_Size 15-16 Inch.png",
          "/cabs_clean/hardware/square/Square_RoseGold_Size 4 1-4 Inches .png",
          "/cabs_clean/hardware/square/Square_RoseGold_.png",
          "/cabs_clean/hardware/square/Square_RoseGold_with_knob.png",
        ],
      },
      satin_nickel: {
        name: "Satin Nickel",
        hex: "#c0c0c0",
        mainImage: "/cabs_clean/hardware/square/Square_SatinNickel.png",
        images: [
          "/cabs_clean/hardware/square/Square_SatinNickel.png",
          "/cabs_clean/hardware/square/Square_SatinNickel_Size 15-16 Inch .png",
          "/cabs_clean/hardware/square/Square_SatinNickel_Size 4 1-4 Inches .png",
          "/cabs_clean/hardware/square/Square_SatinNickel_Size 5 7-16 Inches.png",
          "/cabs_clean/hardware/square/Square_SatinNickel__with_knob.png",
        ],
      },
      matte_black: {
        name: "Matte Black",
        hex: "#2d2d2d",
        mainImage: "/cabs_clean/hardware/square/Square_MatteBlack.png",
        images: [
          "/cabs_clean/hardware/square/Square_MatteBlack.png",
          "/cabs_clean/hardware/square/Square_MatteBlack_Size 15-16 Inch .png",
          "/cabs_clean/hardware/square/Square_MatteBlack_Size 4 1-4 Inches .png",
          "/cabs_clean/hardware/square/Square_MatteBlack_Size 5 7-16 Inches .png",
          "/cabs_clean/hardware/square/Square_MatteBlack__with_knob.png",
        ],
      },
      chrome: {
        name: "Chrome",
        hex: "#e8e8e8",
        mainImage: "/cabs_clean/hardware/square/Square_chrome.png",
        images: [
          "/cabs_clean/hardware/square/Square_chrome.png",
          "/cabs_clean/hardware/square/Square_chrome_Size 15-16 Inch .png",
          "/cabs_clean/hardware/square/Square_chrome_Size 4 1-4 Inches .png",
          "/cabs_clean/hardware/square/Square_chrome_Size 5 7-16 Inches .png",
          "/cabs_clean/hardware/square/Square_chrome__with_knob.png",
        ],
      },
    },
  },
  bar: {
    name: "Bar",
    finishes: {
      matte_black: {
        name: "Matte Black",
        hex: "#2d2d2d",
        mainImage: "/cabs_clean/hardware/bar/Bar-pulls-black .png",
        images: [
          "/cabs_clean/hardware/bar/Bar-pulls-black .png",
          "/cabs_clean/hardware/bar/Bar-Black-Matte-Pull-4.5-on-Shaker - Edited.png",
          "/cabs_clean/hardware/bar/Bar-Black-Matte-Pull-6.0-on-Shaker.png",
          "/cabs_clean/hardware/bar/Bar-Black-Matte-Round-Knob-on-Shaker.png",
          "/cabs_clean/hardware/bar/Bar-matte-black-tpull.png",
        ],
      },
      satin_nickel: {
        name: "Satin Nickel",
        hex: "#c0c0c0",
        mainImage: "/cabs_clean/hardware/bar/BarPull_SatinNickel.png",
        images: [
          "/cabs_clean/hardware/bar/BarPull_SatinNickel.png",
          "/cabs_clean/hardware/bar/BarPull_t_SatinNickel.png",
          "/cabs_clean/hardware/bar/BarPull_SatinNickel_scale.png",
          "/cabs_clean/hardware/bar/Satin-Nickle-Round-Knob .png",
          "/cabs_clean/hardware/bar/BarPull_SatinNickel_with_tpull.png",
        ],
      },
    },
  },
};

// Get all images for preloading
const getAllImages = () => {
  const images: string[] = [];
  Object.values(pullStyles).forEach((style) => {
    Object.values(style.finishes).forEach((finish) => {
      images.push(...finish.images);
    });
  });
  return images;
};

export default function PullsSelector() {
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof pullStyles>("arch");
  const [selectedFinish, setSelectedFinish] = useState("rosegold");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Preload all images on mount
  useEffect(() => {
    getAllImages().forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const currentStyle = pullStyles[selectedStyle];
  const finishes = currentStyle.finishes as Record<string, { name: string; hex: string; mainImage: string; images: string[] }>;
  const currentFinish = finishes[selectedFinish] || Object.values(finishes)[0];
  const currentImages = currentFinish?.images || [];

  // Reset to first finish when style changes
  const handleStyleChange = (style: keyof typeof pullStyles) => {
    setSelectedStyle(style);
    const firstFinish = Object.keys(pullStyles[style].finishes)[0];
    setSelectedFinish(firstFinish);
    setSelectedImageIndex(0);
  };

  // Handle finish change
  const handleFinishChange = (finish: string) => {
    setSelectedFinish(finish);
    setSelectedImageIndex(0);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Pull Options</span>{" "}
          <span className="text-white">From Classic To Modern</span>
        </h2>
        <p className="text-lg text-white/60">
          View the available pull options in a variety of colors.
        </p>
      </div>

      {/* Pull style selector with preview images */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {Object.entries(pullStyles).map(([key, style]) => {
          const firstFinish = Object.values(style.finishes)[0];
          return (
            <button
              key={key}
              onClick={() => handleStyleChange(key as keyof typeof pullStyles)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                selectedStyle === key
                  ? "bg-[#FF8A3D]/10 border-2 border-[#FF8A3D]"
                  : "bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="h-24 w-20 relative mb-2 flex items-center justify-center">
                <Image
                  src={firstFinish.mainImage}
                  alt={style.name}
                  width={80}
                  height={96}
                  className="object-contain max-h-24"
                />
              </div>
              <span className={`text-sm font-semibold ${selectedStyle === key ? 'text-[#FF8A3D]' : 'text-white'}`}>{style.name}</span>
              {/* Color swatches under each style */}
              <div className="flex gap-1 mt-2">
                {Object.entries(style.finishes).map(([finishKey, finish]) => (
                  <div
                    key={finishKey}
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: finish.hex }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected style details */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Main image and thumbnails */}
          <div className="lg:w-1/2">
            {/* Main display image */}
            <div className="bg-white/10 rounded-xl p-6 shadow-lg mb-4 border border-white/10">
              <div className="relative aspect-square flex items-center justify-center">
                <Image
                  src={currentImages[selectedImageIndex] || currentFinish.mainImage}
                  alt={`${currentStyle.name} ${currentFinish.name}`}
                  width={400}
                  height={400}
                  className="object-contain max-h-[350px] transition-opacity duration-150"
                  priority
                />
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-[#FF8A3D] ring-2 ring-[#FF8A3D]/30"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${currentStyle.name} view ${idx + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain bg-white/10 p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Info and color selector */}
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-white mb-2">
              {currentStyle.name} <span className="text-[#FF8A3D]">{currentFinish.name}</span>
            </h3>
            
            <p className="text-white/70 mb-6">
              {getStyleDescription(selectedStyle)}
            </p>

            {/* Color/Finish selector */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                Available Finishes
              </h4>
              <div className="flex flex-wrap gap-3">
                {Object.entries(finishes).map(([key, finish]) => (
                  <button
                    key={key}
                    onClick={() => handleFinishChange(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                      selectedFinish === key
                        ? "border-[#FF8A3D] bg-[#FF8A3D]/10"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-white/30"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <span className={`text-sm font-medium ${selectedFinish === key ? 'text-[#FF8A3D]' : 'text-white/80'}`}>{finish.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                Available Sizes
              </h4>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8A3D]" />
                  Knob: 1 7/16" or 15/16"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8A3D]" />
                  Pull: 4-6" lengths
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8A3D]" />
                  Pull: 6-7" lengths
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    arch: "The Arch pull features elegant curved lines that add a touch of sophistication to any cabinet. Perfect for transitional and traditional kitchens.",
    artisan: "Handcrafted-inspired Artisan pulls bring warmth and character to your cabinets. Ideal for rustic, farmhouse, or eclectic styles.",
    cottage: "Cottage pulls offer a charming, classic look with detailed craftsmanship. Great for country, coastal, or cottage-style kitchens.",
    loft: "Sleek and minimal, Loft pulls are perfect for modern and contemporary spaces. Clean lines that complement any minimalist design.",
    square: "Bold and geometric, Square pulls make a statement in modern kitchens. Perfect for those who love clean, angular aesthetics.",
    bar: "The classic Bar pull is versatile and timeless. Works beautifully in any kitchen style from traditional to ultra-modern.",
  };
  return descriptions[style] || "Premium quality cabinet hardware designed to complement your kitchen transformation.";
}
