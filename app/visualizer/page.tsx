import CabinetVisionPage from "./CabinetVisionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Kitchen Visualizer | See Your New Kitchen Instantly",
  description:
    "Upload a photo of your kitchen and see it transformed instantly. Try different styles and colors. Free tool for Phoenix homeowners.",
};

export default function VisualizerPage() {
  return <CabinetVisionPage />;
}
