import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Analytics from "./components/Analytics";
import EntitySchema from "./components/schemas/EntitySchema";
import { SchemaLocalBusiness } from "./components/SchemaLocalBusiness";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navigation from "./components/Navigation";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Cabinet Refacing Phoenix | Vulpine Homes – Save 50%+",
  description:
    "Cabinet Refacing & Kitchen Remodeling in Phoenix. Save 50% vs full remodel. Quotes in 24 hours. 5-Star Rated. Serving Scottsdale, Mesa, Gilbert & more.",
  keywords: "cabinet refacing phoenix, kitchen remodeling scottsdale, luxury cabinet refacing, kitchen upgrades arizona, vulpine homes, cabinet refacing vs replacement",
  openGraph: {
    title: "Cabinet Refacing Phoenix | Vulpine Homes – Save 50%+",
    description: "Cabinet Refacing & Kitchen Remodeling in Phoenix. Save 50% vs full remodel. Quotes in 24 hours. 5-Star Rated.",
    url: "https://vulpinehomes.com",
    siteName: "Vulpine Homes",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logos/favicon-fox/favi (192 x 192 px).png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <EntitySchema />
        <SchemaLocalBusiness />
      </head>
      <body>
        <Navigation />
        <MobileNav />
        <Analytics />
        {children}
        <VercelAnalytics />
        <SpeedInsights />
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
        <Footer />
      </body>
    </html>
  );
}

