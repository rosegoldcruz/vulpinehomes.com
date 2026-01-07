'use client';

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, alt }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Prevent page scroll on mobile while interacting with slider
    e.preventDefault();
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
      // Prevent page scroll while dragging slider
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleClick = (e: MouseEvent<HTMLDivElement>) => updateSliderPosition(e.clientX);

  // Lock body scroll when dragging on mobile
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none group"
      style={{ 
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        touchAction: 'pan-x' // Allow horizontal pan only, prevent vertical scroll
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={`${alt} - After`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          unoptimized
        />
        <div 
          className="absolute bottom-4 right-4 px-4 py-2 rounded-full font-semibold text-sm text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)' }}
        >
          After
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={`${alt} - Before`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          unoptimized
        />
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
          Before
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
        style={{ 
          left: `${sliderPosition}%`,
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-xl"
          style={{ 
            background: 'linear-gradient(135deg, #FF8A3D 0%, #FF6B35 100%)',
            boxShadow: '0 4px 20px rgba(255, 107, 53, 0.5)'
          }}
        >
          ↔
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ← Drag to compare →
      </div>
    </div>
  );
}
