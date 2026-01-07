"use client";

interface CTAButtonProps {
  className?: string;
}

export function CTAButton({ className = "" }: CTAButtonProps) {
  return (
    <a
      href="/get-quote"
      data-cta="primary"
      className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl ${className}`}
    >
      Get Free Quote
    </a>
  );
}
