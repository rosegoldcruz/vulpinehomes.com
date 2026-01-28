"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FoxAvatar from "./FoxAvatar";

interface FoxConversationProps {
  onClose?: () => void;
}

const FOX_MESSAGES = {
  greeting: `Hi! I'm Foxy, part of the Vulpine installation team. I'll help you get a quote for our cabinet door installation services.`,
  
  photoRequest: `Let me see your current cabinets! Upload 2-3 photos so I can assess what installation work we'll need to do.`,
  
  analyzing: `Looking at your kitchen... I can see we'll need to install new doors and refinish the cabinet boxes. Let me count the doors...`,
  
  doorCount: `I'm seeing approximately 18 cabinet doors and 6 drawers that we'll need to install. Does that look right to you?`,
  
  installation: `Perfect! Our team will:
• Remove your old doors
• Refinish the cabinet boxes
• Install your new premium doors
• Mount all hardware

Typical installation: 3-5 days`,
  
  contact: `Great! Let me get your contact info so our installation coordinator can call you with an exact quote.`,
};

export default function FoxConversation({ onClose }: FoxConversationProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zip: "",
    message: "",
  });

  const messages = [
    { type: "fox", text: FOX_MESSAGES.greeting },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-96 max-h-[70vh] bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FoxAvatar size="sm" />
            <div>
              <h3 className="text-white font-bold text-sm">Foxy</h3>
              <p className="text-white/60 text-xs">Cabinet Installation Expert</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Fox Message */}
              <div className="flex gap-3">
                <FoxAvatar size="sm" />
                <div className="bg-white/5 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {FOX_MESSAGES.greeting}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="text-3xl mb-3">🎉</div>
              <h4 className="text-lg font-bold text-white mb-1">Request Received!</h4>
              <p className="text-white/60 text-sm">Our installation team will call you shortly with a detailed quote.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Area */}
      {step === 0 && (
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Zip Code"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm"
            >
              Get Installation Quote
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export function FoxChatButton() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* Floating Fox Button */}
      <div className="fixed bottom-24 md:bottom-8 right-4 sm:right-8 z-50">
        <button
          onClick={() => setShowChat(!showChat)}
          className="relative group"
        >
          <FoxAvatar size="lg" animated />
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-4 right-0 bg-black/90 text-white px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm pointer-events-none">
            Ask our installer about cabinet doors
          </div>
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {showChat && <FoxConversation onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </>
  );
}
