"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  title: string;
  imageSrc: string;
  description: string;
  socials?: {
    icon: React.ReactNode;
    label: string;
    href: string;
    type: "call" | "text" | "link";
  }[];
  className?: string;
}

export const ProfileCard = ({
  name,
  title,
  imageSrc,
  description,
  socials,
  className = "",
}: ProfileCardProps) => {
  return (
    <div className={`group relative w-full max-w-[350px] overflow-hidden rounded-[2rem] bg-[#1a1a2e]/50 border border-white/10 p-6 transition-all hover:border-[#FF8A3D]/50 hover:shadow-2xl hover:shadow-[#FF8A3D]/20 ${className}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image Container */}
      <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white/10 shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:border-[#FF8A3D]/50">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 className="mb-1 text-2xl font-bold text-white transition-colors group-hover:text-[#FF8A3D]">
          {name}
        </h3>
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
          {title}
        </p>
        <p className="mb-6 text-sm leading-relaxed text-white/70">
          {description}
        </p>

        {/* Socials / Actions */}
        {socials && (
          <div className="flex flex-col gap-3">
            {socials.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#FF8A3D] hover:shadow-lg active:scale-95"
              >
                {social.icon}
                {social.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
