// File: c:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\visualizer\page.tsx
import KitchenVisualizer from "../components/KitchenVisualizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Kitchen Visualizer | See Your New Kitchen Instantly",
  description:
    "Upload a photo of your kitchen and see it transformed instantly with AI. Try different styles and colors. Free tool for Phoenix homeowners.",
};

export default function VisualizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Kitchen <span className="text-orange-500">Visualizer</span>
          </h1>
          <p className="text-xl text-slate-300">
            Upload photos of your kitchen and see it transformed with premium cabinet doors and hardware.
          </p>
        </div>
        <KitchenVisualizer />
      </div>
    </div>
  );
}
