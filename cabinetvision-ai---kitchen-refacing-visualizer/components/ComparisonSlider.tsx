
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ComparisonSliderProps {
  original: string;
  modified: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ original, modified }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl cursor-col-resize select-none border-4 border-white"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* Modified Image (Top Layer) */}
      <div 
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={modified} alt="Modified" className="w-full h-full object-cover" />
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
};

export default ComparisonSlider;
