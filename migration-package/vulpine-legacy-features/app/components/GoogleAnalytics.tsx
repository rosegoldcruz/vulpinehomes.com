'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    // Don't render if no GA ID configured
    if (!GA_MEASUREMENT_ID) return null

    return (
        <>
            {/* Google Analytics 4 */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
            </Script>
        </>
    )
}

// Helper function to track custom events
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, eventParams)
    }
}
