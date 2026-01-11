"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "../components/CTAButton";
import { FadeIn, StaggerContainer } from "@/app/components/ui/Motion";
import BeforeAfterSlider from "@/app/components/BeforeAfterSlider";

const galleryImages = [
  "/gallery/Phoenix-1.jpg",
  "/gallery/Phoenix-2.jpg",
  "/gallery/Phoenix-3.jpg",
  "/gallery/Phoenix-4.jpg",
  "/gallery/Phoenix-5.jpg",
  "/gallery/Phoenix-6.jpg",
  "/gallery/Phoenix-7.jpg",
  "/gallery/Phoenix-8.jpg",
  "/gallery/Phoenix-9.jpg",
  "/gallery/Phoenix-10.jpg",
  "/gallery/Phoenix-11.jpg",
  "/gallery/Phoenix-12.jpg",
  "/gallery/Phoenix-13.jpg",
  "/gallery/Phoenix-14.jpg",
  "/gallery/Phoenix-15.jpg",
  "/gallery/Phoenix-16.jpg",
  "/gallery/Phoenix-17.jpg",
  "/gallery/Phoenix-18.jpg",
  "/gallery/Phoenix-19.jpg",
  "/gallery/Phoenix-20.jpg",
  "/gallery/Chandler-1.jpg",
  "/gallery/Chandler-2.jpg",
  "/gallery/Chandler-3.jpg",
  "/gallery/Mesa-1.jpg",
  "/gallery/Mesa-2.jpg",
  "/gallery/Mesa-3.jpg",
  "/gallery/Gilbert-1.jpg",
  "/gallery/Gilbert-2.jpg",
  "/gallery/Gilbert-3.jpg",
  "/gallery/Scottsdale-1.jpg",
  "/gallery/Scottsdale-2.jpg",
  "/gallery/Tempe-1.png",
  "/gallery/Tempe-2.png",
  "/gallery/Tempe-3.png",
  "/gallery/Glendale-1.png",
  "/gallery/Peoria-1.png",
  "/gallery/Surprise-1.jpg",
];

import { DomeGallery } from "../components/ui/DomeGallery";

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % galleryImages.length);
    }
  }, [selectedIndex]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goNext, goPrev]);

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-[#FF8A3D] transition-colors mb-8 bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:bg-white/10">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Project Gallery
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Browse through our stunning kitchen transformations. Click any image to view full size.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Before & After Section - All 20 Arizona Transformations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span>🏠</span> Real Arizona Work
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Before & After Transformations</h2>
            <p className="text-white/60">Drag the slider to see stunning kitchen transformations from real Arizona homeowners. <span className="text-emerald-400 font-semibold">These are our projects.</span></p>
          </FadeIn>

          <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <BeforeAfterSlider beforeImage="/data_set/before1.jpg" afterImage="/data_set/after1.jpg" alt="Arizona Kitchen 1" />
            <BeforeAfterSlider beforeImage="/data_set/before2.jpg" afterImage="/data_set/after2.jpg" alt="Arizona Kitchen 2" />
            <BeforeAfterSlider beforeImage="/data_set/before3.jpg" afterImage="/data_set/after3.jpg" alt="Arizona Kitchen 3" />
            <BeforeAfterSlider beforeImage="/data_set/before4.jpg" afterImage="/data_set/after4.jpg" alt="Arizona Kitchen 4" />
            <BeforeAfterSlider beforeImage="/data_set/before5.jpg" afterImage="/data_set/after5.jpg" alt="Arizona Kitchen 5" />
            <BeforeAfterSlider beforeImage="/data_set/before6.jpg" afterImage="/data_set/after6.jpg" alt="Arizona Kitchen 6" />
            <BeforeAfterSlider beforeImage="/data_set/before7.jpg" afterImage="/data_set/after7.jpg" alt="Arizona Kitchen 7" />
            <BeforeAfterSlider beforeImage="/data_set/before8.jpg" afterImage="/data_set/after8.jpg" alt="Arizona Kitchen 8" />
            <BeforeAfterSlider beforeImage="/data_set/before9.jpg" afterImage="/data_set/after9.jpg" alt="Arizona Kitchen 9" />
            <BeforeAfterSlider beforeImage="/data_set/before10.jpg" afterImage="/data_set/after10.jpg" alt="Arizona Kitchen 10" />
            <BeforeAfterSlider beforeImage="/data_set/before11.jpg" afterImage="/data_set/after11.jpg" alt="Arizona Kitchen 11" />
            <BeforeAfterSlider beforeImage="/data_set/before12.jpg" afterImage="/data_set/after12.jpg" alt="Arizona Kitchen 12" />
            <BeforeAfterSlider beforeImage="/data_set/before13.jpg" afterImage="/data_set/after13.jpg" alt="Arizona Kitchen 13" />
            <BeforeAfterSlider beforeImage="/data_set/before14.jpg" afterImage="/data_set/after14.jpg" alt="Arizona Kitchen 14" />
            <BeforeAfterSlider beforeImage="/data_set/before15.jpg" afterImage="/data_set/after15.jpg" alt="Arizona Kitchen 15" />
            <BeforeAfterSlider beforeImage="/data_set/before16.jpg" afterImage="/data_set/after16.jpg" alt="Arizona Kitchen 16" />
            <BeforeAfterSlider beforeImage="/data_set/before17.jpg" afterImage="/data_set/after17.jpg" alt="Arizona Kitchen 17" />
            <BeforeAfterSlider beforeImage="/data_set/before18.jpg" afterImage="/data_set/after18.jpg" alt="Arizona Kitchen 18" />
            <BeforeAfterSlider beforeImage="/data_set/before19.jpg" afterImage="/data_set/after19.jpg" alt="Arizona Kitchen 19" />
            <BeforeAfterSlider beforeImage="/data_set/before20.jpg" afterImage="/data_set/after20.jpg" alt="Arizona Kitchen 20" />
            <BeforeAfterSlider beforeImage="/data_set/before21.jpg" afterImage="/data_set/after21.jpg" alt="Arizona Kitchen 21" />
          </FadeIn>
        </div>
      </section>

      {/* Dome Gallery 3D Showcase */}
      <section className="py-20 border-t border-white/10">
        <DomeGallery images={galleryImages} />
      </section>

      {/* Texas Projects Gallery */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-6">
              <span>🤠</span> Texas Projects
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Our Texas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Transformations</span></h2>
            <p className="text-white/60">Kitchen projects completed by Vulpine Homes across Texas. <span className="text-amber-400 font-semibold">Our work, Lone Star style.</span></p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="aspect-[3/2] relative rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openModal(index)}
              >
                <Image
                  src={src}
                  alt={`Texas project ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-amber-500/90 rounded-full text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  📍 Texas
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready for Your Transformation?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Get a free quote and see how we can transform your kitchen.
            </p>
            <CTAButton className="text-lg" />
          </FadeIn>
        </div>
      </section>

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeModal}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={closeModal}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[selectedIndex]}
              alt={`Gallery image ${selectedIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm hidden md:block">
            Use ← → arrow keys to navigate • Press ESC to close
          </div>
        </div>
      )}
    </main>
  );
}
