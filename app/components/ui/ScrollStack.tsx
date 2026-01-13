"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemOffset?: number;
}

export const ScrollStack = ({ 
  children, 
  className = "",
  itemOffset = 0 
}: ScrollStackProps) => {
  
  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);

  const items = React.Children.toArray(children);

  return (
    <div className={`relative w-full ${className}`}>
      {items.map((child, index) => (
        <StickyCard 
          key={index} 
          index={index} 
          total={items.length} 
          offset={itemOffset}
        >
          {child}
        </StickyCard>
      ))}
    </div>
  );
};

const StickyCard = ({ 
  children, 
  index, 
  total, 
  offset 
}: { 
  children: React.ReactNode; 
  index: number; 
  total: number;
  offset: number;
}) => {
  return (
    <div 
      className="sticky top-0 w-full h-screen bg-[#0a0a0f] flex flex-col overflow-hidden"
      style={{ 
        top: index * offset, 
        zIndex: index + 1,
      }}
    >
        {/* Inner container to handle scrolling for content taller than screen */}
        <div className="w-full h-full overflow-y-auto no-scrollbar relative">
            {children}
        </div>
    </div>
  );
};
