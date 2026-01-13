"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  href?: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [hovering, setHovering] = useState(false);
  const [activeValue, setActiveValue] = useState<string>("");

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-auto gap-2",
        containerClassName
      )}
    >
      {propTabs.map((tab) => (
        <a
          key={tab.title}
          href={tab.href || `#${tab.value}`}
          onMouseEnter={() => {
            setHovering(true);
            setActiveValue(tab.value);
          }}
          onMouseLeave={() => {
            setHovering(false);
            setActiveValue("");
          }}
          className={cn("relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors", tabClassName)}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Active/Hover State Background */}
          {activeValue === tab.value && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute inset-0 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full",
                activeTabClassName
              )}
            />
          )}

          <span className="relative block text-white/70 hover:text-white transition-colors z-10">
            {tab.title}
          </span>
        </a>
      ))}
    </div>
  );
};


export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
