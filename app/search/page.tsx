// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\search\page.tsx
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search | Vulpine Homes",
  description: "Search Vulpine Homes pages and service areas.",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <SearchClient />
    </main>
  );
}
