"use client";
import { useEffect } from "react";
import OpenAIClient from "@/lib/openai-realtime";

export default function FoxAudio() {
  useEffect(() => {
    const ws = OpenAIClient.init();
    ws.onopen = () => {};
  }, []);
  return <div className="p-6 text-white">Fox Audio Mode Active</div>;
}
