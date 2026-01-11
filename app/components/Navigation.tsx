"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "ABOUT", href: "/about" },
  { name: "GALLERY", href: "/gallery" },
  { name: "CABINETS", href: "/products" },
  { name: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-transparent mix-blend-difference text-white">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wider z-50 relative">
          <Image
            src="/marketing/Textvulpine.png"
            alt="Vulpine Homes"
            width={180}
            height={50}
            className="h-10 w-auto object-contain invert"
            priority
          />
        </Link>

        {/* Hamburger Button */}
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 z-50 relative focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Overlay Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-xl font-bold tracking-wider text-white">
                VULPINE HOMES
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-8 h-8 text-white stroke-[1.5]" />
              </button>
            </div>

            {/* Links Container */}
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-light tracking-[0.2em] text-white hover:text-gray-300 uppercase transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Contact Actions */}
            <div className="flex justify-center gap-4 pb-8">
              <a
                href="tel:4803648205"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors"
              >
                📞 Call
              </a>
              <a
                href="sms:4803648205"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors"
              >
                💬 Text
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
