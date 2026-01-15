"use client";

import { useState, useRef, useEffect } from "react";

interface TextFallbackProps {
  onSendMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
}

export function TextFallback({ onSendMessage, isProcessing }: TextFallbackProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    const text = message.trim();
    setMessage("");
    await onSendMessage(text);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-sm text-yellow-200">
          <span className="font-semibold">⚠️ Microphone unavailable.</span> Using text mode instead.
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full px-8 py-4 font-semibold shadow-lg shadow-orange-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isProcessing ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
