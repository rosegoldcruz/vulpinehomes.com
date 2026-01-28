// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import FoxAvatar from "./FoxAvatar";

export default function Footer() {
  const [formState, setFormState] = useState({ name: "", zip: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <footer className="bg-[#08080c] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FoxAvatar size="sm" />
              <div>
                <h3 className="text-white font-bold text-lg">Vulpine Homes</h3>
                <p className="text-white/60 text-sm">Cabinet Installation Experts</p>
              </div>
            </div>
            <p className="text-white/60 mb-4">
              Our team installs premium cabinet doors, drawer fronts, 
              and refinishes cabinet boxes throughout Phoenix.
            </p>
            <p className="text-white/40 text-sm mb-6">
              All installation work performed by Vulpine team members.
            </p>
            
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-3">
                <span className="text-[#FF8A3D]">📍</span>
                <span>Serving Phoenix metro area</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF8A3D]">📞</span>
                <a href="tel:4803648205" className="text-orange-500 hover:underline font-semibold">(480) 364-8205</a>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <a href="https://instagram.com/vulpinehomes" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF8A3D] transition-colors text-white" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.facebook.com/vulpinehomes/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF8A3D] transition-colors text-white" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://tiktok.com/@vulpinehomes" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF8A3D] transition-colors text-white" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.11-.01 1.25.02 2.5-.02 3.75-.17 5.31-3.64 11.08-8.99 12.03-4.57.81-9.45-1.74-11.27-5.99-1.82-4.23.47-9.53 5.06-10.87.68-.2 1.4-.27 2.1-.24v4.25c-.43-.03-.88.06-1.28.25-1.57.75-2.22 2.78-1.44 4.33.64 1.27 2.05 1.95 3.44 1.74 1.34-.21 2.45-1.22 2.74-2.54.16-.76.13-1.54.13-2.31-.01-4.21-.01-8.42 0-12.64h1.41z"/></svg>
              </a>
            </div>
          </div>

          {/* Installation Services */}
          <div>
            <h4 className="text-white font-bold mb-4">Installation Services</h4>
            <ul className="space-y-2 text-white/60">
              <li>• Cabinet Door Installation</li>
              <li>• Drawer Front Installation</li>
              <li>• Cabinet Box Refinishing</li>
              <li>• Hardware Installation</li>
              <li>• Soft-Close System Installation</li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm mb-4">Scan to visit us:</p>
              <div className="flex gap-4 items-center">
                <div className="bg-white p-2 rounded-xl inline-block">
                  <Image
                    src="/marketing/vulpinehomes_qr.png"
                    alt="Vulpine Homes QR Code"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="bg-white p-2 rounded-xl inline-block">
                  <Image
                    src="/marketing/tick-tock.png"
                    alt="TikTok"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Get Installation Quote */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              FREE QUOTE
            </div>
            
            <h4 className="text-white font-bold mb-2">Get Installation Quote</h4>
            <p className="text-white/60 text-sm mb-4">Our team will call you with a detailed quote.</p>

            {submitted ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">🎉</div>
                <h4 className="text-lg font-bold text-white mb-1">Request Received!</h4>
                <p className="text-white/60 text-sm">Our installation team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full bg-[#0a0a0f] border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D] text-sm"
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full bg-[#0a0a0f] border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D] text-sm"
                  value={formState.phone}
                  onChange={e => setFormState({...formState, phone: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  required
                  className="w-full bg-[#0a0a0f] border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D] text-sm"
                  value={formState.zip}
                  onChange={e => setFormState({...formState, zip: e.target.value})}
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35] text-white font-bold py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 text-sm"
                >
                  Request Installation Quote
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Vulpine Homes LLC - Cabinet Installation Services</p>
          <p className="mt-2">Licensed cabinet door installation and refinishing in Phoenix, AZ</p>
        </div>
      </div>
    </footer>
  );
}
