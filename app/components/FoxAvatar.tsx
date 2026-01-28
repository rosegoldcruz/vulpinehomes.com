"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FoxAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
};

export default function FoxAvatar({ size = "md", animated = false, className = "" }: FoxAvatarProps) {
  const sizeClass = sizeClasses[size];
  
  const AvatarContent = (
    <div className={`relative ${sizeClass} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-full blur-md" />
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-orange-500/50 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
        <Image
          src="/logos/vulpines-official-logo.png"
          alt="Foxy - Vulpine Installation Expert"
          fill
          className="object-contain p-1"
        />
      </div>
      {/* Online indicator */}
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]" />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {AvatarContent}
      </motion.div>
    );
  }

  return AvatarContent;
}
