// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\MobileNav.tsx
"use client";

import React from "react";
import { FloatingDock } from "@/app/components/ui/floating-dock";
import {
  IconHome,
  IconBox,
  IconWand,
  IconTools,
  IconMessageCircle,
} from "@tabler/icons-react";

export default function MobileNav() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Cabinet Refacing",
      icon: (
        <IconTools className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/kitchen-cabinet-refacing",
    },
    {
      title: "Door Styles",
      icon: (
        <IconBox className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/products",
    },
    {
      title: "Visualizer",
      icon: (
        <IconWand className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/visualizer",
    },
    {
      title: "Quote",
      icon: (
        <IconMessageCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/get-quote",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto">
        <FloatingDock
          mobileClassName="bg-[#0a0a0f] border border-white/10 rounded-2xl px-2"
          items={links}
        />
    </div>
  );
}
