"use client";

import React from "react";
import { FloatingDock } from "@/app/components/ui/floating-dock";
import {
  IconHome,
  IconBox,
  IconInfoCircle,
  IconArticle,
  IconWand,
  IconTools,
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
      title: "Services",
      icon: (
        <IconTools className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/services",
    },
    {
      title: "Products",
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
      title: "Blog",
      icon: (
        <IconArticle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/blog",
    },
    {
      title: "About",
      icon: (
        <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/about",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock
          mobileClassName="bg-[#0a0a0f] border border-white/10 rounded-full"
          items={links}
        />
    </div>
  );
}
