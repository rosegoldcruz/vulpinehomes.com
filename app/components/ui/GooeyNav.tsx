"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

export const GooeyNav = ({ items }: { items: NavItem[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 border border-white/10 backdrop-blur-md">
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative px-5 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === index && (
            <motion.div
              layoutId="gooey-pill"
              className="absolute inset-0 rounded-full bg-[#FF8A3D]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: -1 }}
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
