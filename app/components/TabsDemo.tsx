"use client";

import { Tabs } from "./ui/tabs";
import Image from "next/image";

export function TabsDemo() {
  const tabs = [
    {
      title: "Services",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] border border-white/10">
          <p>Kitchen Transformation Services</p>
          <div className="mt-4 text-lg font-normal text-white/70">
            We handle everything from design to installation coordination.
          </div>
          <DummyContent src="/marketing/love-your-kitchen.jpeg" />
        </div>
      ),
    },
    {
      title: "Products",
      value: "products",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] border border-white/10">
          <p>Premium Cabinet Solutions</p>
          <div className="mt-4 text-lg font-normal text-white/70">
            High-quality refacing materials and custom options.
          </div>
          <DummyContent src="/cabs_clean/after/a.jpg" />
        </div>
      ),
    },
    {
      title: "Visualizer",
      value: "visualizer",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] border border-white/10">
          <p>AI Design Visualizer</p>
          <div className="mt-4 text-lg font-normal text-white/70">
            See your new kitchen before you buy.
          </div>
          <DummyContent src="/marketing/visualizer-preview.jpg" />
        </div>
      ),
    },
    {
      title: "About",
      value: "about",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] border border-white/10">
          <p>About Vulpine Homes</p>
          <div className="mt-4 text-lg font-normal text-white/70">
            Your trusted project advisors in Phoenix.
          </div>
          <DummyContent src="/daniel-cruz.png" />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}

const DummyContent = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-[60%] md:h-[90%] mt-10 rounded-xl overflow-hidden">
        <Image
        src={src}
        alt="Content image"
        fill
        className="object-cover"
        />
    </div>
  );
};
