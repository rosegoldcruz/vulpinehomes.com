"use client";

import Image from "next/image";
import Link from "next/link";
import ColorSelector from "../components/ColorSelector";
import PullsSelector from "../components/PullsSelector";
import { useState } from "react";
import { CTAButton } from "../components/CTAButton";
import { ProductListSchema } from "../components/schemas/ProductListSchema";

const doorStyles = [
  {
    id: "shaker-classic",
    name: "Shaker Classic",
    description: "A timeless classic",
    detailedDescription: "The classic Shaker style features clean lines and a recessed center panel. Perfect for traditional to transitional kitchens.",
    circleImage: "/marketing/Storm-Shaker-Drawer-10.png",
  },
  {
    id: "shaker-slide",
    name: "Shaker Slide",
    description: "Enhanced Shaker with soft lines",
    detailedDescription: "The Slide combines Shaker simplicity with subtle rounded edges for a softer, more refined appearance.",
    circleImage: "/marketing/Storm-Slide-Door-Drawer-5.png",
  },
  {
    id: "fusion-shaker",
    name: "Fusion Shaker",
    description: "Slab drawers with Shaker doors",
    detailedDescription: "The best of both worlds - combining slab drawer fronts with 5-piece Shaker door construction for unique visual interest.",
    circleImage: "/marketing/Shaker-Storm-Fusion_vert-1.png",
  },
  {
    id: "fusion-slide",
    name: "Fusion Slide",
    description: "Slab drawers with Slide doors",
    detailedDescription: "Modern elegance - slab drawer fronts paired with the soft rounded edges of Slide door construction.",
    circleImage: "/marketing/Storm-Slide-Door-Drawer-5.png",
  },
  {
    id: "slab",
    name: "Slab",
    description: "A clean, modern look",
    detailedDescription: "Sleek and contemporary, the Slab door offers a flat, seamless surface for a minimalist aesthetic.",
    circleImage: "/marketing/Storm-Slab-Door-Drawer-3.png",
  },
];

function DoorStyleCircle({ door, isSelected, onClick }: { 
  door: typeof doorStyles[0]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center group transition-all ${isSelected ? 'scale-105' : ''}`}
    >
      {/* Circular door image */}
      <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 transition-all ${
        isSelected 
          ? 'border-[#FF8A3D] shadow-lg shadow-[#FF8A3D]/30' 
          : 'border-white/20 group-hover:border-[#FF8A3D]/50'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
          <Image
            src={door.circleImage}
            alt={door.name}
            width={120}
            height={120}
            className="object-contain max-h-[100px] md:max-h-[120px] drop-shadow-lg"
          />
        </div>
      </div>
      {/* Door name */}
      <h3 className={`mt-3 text-lg font-bold transition-colors ${
        isSelected ? 'text-[#FF8A3D]' : 'text-white group-hover:text-[#FF8A3D]'
      }`}>
        {door.name}
      </h3>
    </button>
  );
          { name: "Fusion Shaker", image: "/marketing/Shaker-Storm-Fusion_vert-1.png", url: "https://vulpinehomes.com/products#door-styles" },
          { name: "Fusion Slide", image: "/marketing/Storm-Slide-Door-Drawer-5.png", url: "https://vulpinehomes.com/products#door-styles" },
          { name: "Slab", image: "/marketing/Storm-Slab-Door-Drawer-3.png", url: "https://vulpinehomes.com/products#door-styles" },
          { name: "Drawer Organizers", image: "/marketing/Fusion_Drawer.webp", url: "https://vulpinehomes.com/products#accessories" },
          { name: "Decorative Panels", image: "/marketing/Fusion_Deco_Panel.webp", url: "https://vulpinehomes.com/products#accessories" }
        ]}
      />

      {/* Hero Section with Video */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/vids/gallery.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-white">
            Premium Cabinet<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
              Doors & Hardware
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl mb-10 text-white/80 font-light px-4">
            Premium quality cabinet doors, drawer fronts and hardware for your kitchen transformation.
          </p>

          <CTAButton className="text-xl" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Door Styles Section */}
      <section id="door-styles" className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Made To Order</span>{" "}
              <span className="text-white">Kitchen And</span>
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Bathroom Cabinet Doors In The Most Popular Styles
            </h2>
          </div>

          {/* Circular Door Style Selector */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
            {doorStyles.map((door) => (
              <DoorStyleCircle
                key={door.id}
                door={door}
                isSelected={selectedDoor.id === door.id}
                onClick={() => setSelectedDoor(door)}
              />
            ))}
          </div>

          {/* Selected Door Details */}
          <div className="max-w-2xl mx-auto text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#FF8A3D] mb-3">{selectedDoor.name}</h3>
            <p className="text-white/80 text-lg leading-relaxed mb-6">{selectedDoor.detailedDescription}</p>
            <Link
              href="#door-colors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-[#FF8A3D]/30"
            >
              View Color Options
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Color Options Section */}
      <section id="door-colors" className="py-20 bg-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ColorSelector />
        </div>
      </section>

      {/* Pulls Section */}
      <section id="pulls" className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PullsSelector />
        </div>
      </section>

      {/* Accessories Section */}
      <section id="accessories" className="py-20 bg-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Accessories</span> & Add-Ons
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Enhance your kitchen with our range of functional accessories and organizational solutions.
            </p>
          </div>

          {/* Accessories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Lazy Susan", desc: "Maximize corner cabinet storage", image: "/marketing/Lazy_Sue_H2C.webp" },
              { name: "Lazy Susan", desc: "Maximize corner cabinet storage", image: "/marketing/Lazy_Sue_H2D.webp" },
              { name: "Drawer Organizers", desc: "Keep everything in its place", image: "/marketing/Fusion_Drawer.webp" },
              { name: "Decorative Panels", desc: "Add custom finishing touches", image: "/marketing/Fusion_Deco_Panel.webp" },
              { name: "1/4 Panel", desc: "Quarter panel cabinet finishing", image: "/marketing/1_4_Panel.webp" },
              { name: "False Drawer Front", desc: "Seamless sink cabinet appearance", image: "/marketing/Fusion_False_Drawer.webp" },
              { name: "Hamper Cabinet", desc: "Built-in laundry organization", image: "/marketing/Fusion_Hamper.webp" },
              { name: "Slab Cabinet Front", desc: "Clean modern cabinet face", image: "/marketing/Slab_Cab_Front.webp" },
              { name: "Soft-Close Hinges", desc: "Premium quiet-close hardware", image: "/marketing/soft-close-hingee.png" },
            ].map((accessory, idx) => (
              <div
                key={`${accessory.name}-${idx}`}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF8A3D]/50 hover:shadow-xl hover:shadow-[#FF8A3D]/10 transition-all"
              >
                <div className="aspect-video relative bg-white/5 overflow-visible">
                  <div className="relative w-full h-full p-4 overflow-visible">
                    <Image
                      src={accessory.image}
                      alt={accessory.name}
                      fill
                      className="object-contain transition-all duration-300 group-hover:scale-[2.2] group-hover:z-50 group-hover:drop-shadow-2xl"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{accessory.name}</h3>
                  <p className="text-white/60">{accessory.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D]/20 to-[#FF6B35]/20" />
        <div className="absolute inset-0 bg-[#0a0a0f]/90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Get a free, no-obligation quote and see how we can help you create your dream kitchen.
          </p>
          <div className="flex justify-center">
            <CTAButton className="text-lg" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#08080c] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/vulpines-official-logo.png"
                alt="Vulpine"
                width={50}
                height={50}
                className="object-contain"
              />
              <span className="text-white font-bold text-xl">VULPINE LLC</span>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm">
                © {new Date().getFullYear()} Vulpine LLC. All rights reserved.
              </p>
              <p className="text-white/30 text-xs mt-1">
                Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] font-semibold">Aeon</span>: The Advanced Efficient Optimized Network
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
