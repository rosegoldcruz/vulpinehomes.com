"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/navigation";
import { CTAButton } from "./CTAButton";
import { Tabs } from "./ui/tabs";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Convert NAV_ITEMS to Tabs format
  const navTabs = NAV_ITEMS.map(item => ({
    title: item.label,
    value: item.href,
    href: item.href
  }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-10">
            <Image
              src="/marketing/Textvulpine.png"
              alt="Vulpine Homes"
              width={240}
              height={66}
              className="h-12 w-auto object-contain brightness-125"
              priority
            />
          </Link>

          {/* Desktop Navigation - Animated Tabs Style */}
          <div className="hidden md:flex items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-sm shadow-2xl">
                <Tabs tabs={navTabs} />
             </div>
          </div>

          {/* Desktop Call/CTA */}
          <div className="hidden md:flex items-center gap-4 relative z-10">
            {/* Call & Text Buttons */}
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
              <a href="tel:4803648205" className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
                Call
              </a>
              <div className="w-px h-4 bg-white/10"></div>
              <a href="sms:4803648205" className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
                Text
              </a>
            </div>
            <CTAButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-white/90 hover:text-[#FF8A3D] hover:bg-white/5 rounded-lg transition-colors uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Call & Text */}
            <div className="flex gap-2 pt-3">
              <a href="tel:4803648205" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span>📞</span> Call
              </a>
              <a href="sms:4803648205" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span>💬</span> Text
              </a>
            </div>
            <div className="pt-3">
              <CTAButton className="w-full block text-center" />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Call/Text Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10 p-2">
        <div className="flex gap-2">
          <a href="tel:4803648205" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] rounded-xl shadow-lg">
            <span>📞</span> Call Now
          </a>
          <a href="sms:4803648205" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white border border-white/20 rounded-xl">
            <span>💬</span> Text Us
          </a>
        </div>
      </div>
    </nav>
  );
}
