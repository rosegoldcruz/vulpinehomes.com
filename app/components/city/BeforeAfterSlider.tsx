"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { CityProject } from "@/app/cabinet-refacing-city-data";

interface BeforeAfterSliderProps {
  city: string;
  projects: CityProject[];
}

export default function BeforeAfterSlider({ city, projects }: BeforeAfterSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = projects.length;

  const activeProject = useMemo(() => projects[activeIndex], [projects, activeIndex]);

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#FF8A3D]">Project {activeIndex + 1} of {total}</p>
          <h3 className="text-2xl font-semibold text-white">{activeProject.title}</h3>
          <p className="text-white/65">{activeProject.neighborhood}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View previous ${city} before and after project`}
            onClick={goPrev}
            className="h-10 w-10 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-[#FF8A3D]"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={`View next ${city} before and after project`}
            onClick={goNext}
            className="h-10 w-10 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-[#FF8A3D]"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <article className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
          <div className="relative aspect-[4/3]">
            <Image
              src={activeProject.beforeImage}
              alt={`Before cabinet refacing in ${city} near ${activeProject.neighborhood}`}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="px-4 py-3 text-white/80 text-sm font-medium">Before</p>
        </article>

        <article className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
          <div className="relative aspect-[4/3]">
            <Image
              src={activeProject.afterImage}
              alt={`After cabinet refacing in ${city} near ${activeProject.neighborhood}`}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="px-4 py-3 text-white/80 text-sm font-medium">After</p>
        </article>
      </div>

      <div className="mt-5 flex gap-2">
        {projects.map((project, index) => (
          <button
            key={project.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${project.title} project in ${city}`}
            className={`h-2.5 flex-1 rounded-full transition ${
              index === activeIndex ? "bg-[#FF8A3D]" : "bg-white/20 hover:bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
