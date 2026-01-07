"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation, useMotionValue } from "framer-motion";

export const DomeGallery = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const isPaused = useRef(false);

  // Auto-rotation
  useEffect(() => {
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    let rotation = 0;
    let animationFrameId: number;

    const animate = () => {
      if (!isPaused.current) {
        rotation += 0.15; // Slightly slower, smoother
        cylinder.style.transform = `rotateY(${rotation}deg)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="relative h-[600px] w-full overflow-hidden flex items-center justify-center perspective-[1000px] bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f] z-10 pointer-events-none" 
      />
      
      <div 
        ref={containerRef}
        className="relative w-[300px] h-[450px] [transform-style:preserve-3d]"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={cylinderRef}
          className="absolute w-full h-full [transform-style:preserve-3d]"
          style={{ width: '100%', height: '100%' }}
        >
          {images.slice(0, 14).map((src, i) => {
            const count = Math.min(images.length, 14);
            const angle = (360 / count) * i;
            const radius = 550; // Larger radius for more items

            return (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black transition-transform duration-300 hover:scale-105 hover:border-[#FF8A3D]/50"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`Gallery Image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-10 z-20 text-center">
        <h3 className="text-2xl font-bold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">
          360° Kitchen Showcase
        </h3>
        <p className="text-white/60 text-sm">Experience our transformations from every angle</p>
      </div>
    </div>
  );
};
