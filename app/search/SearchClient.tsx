"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LINKING_ARCHITECTURE } from "../config/internal-linking";
import { posts } from "../../lib/blogPosts";
import { NAV_ITEMS } from "../../lib/navigation";

export default function SearchClient() {
  const [q, setQ] = useState("");

  const sitePages = useMemo(() => {
    const navPages = NAV_ITEMS.map((n) => ({ label: n.label, href: n.href }));
    const extras = [
      { label: "Products", href: "/products" },
      { label: "Kitchen Cabinet Refacing", href: "/kitchen-cabinet-refacing" },
      { label: "FAQ", href: "/faq" },
      { label: "Gallery", href: "/gallery" },
      { label: "Get Free Quote", href: "/get-quote" },
    ];
    const byHref = new Map<string, { label: string; href: string }>();
    [...navPages, ...extras].forEach((p) => byHref.set(p.href, p));
    return Array.from(byHref.values());
  }, []);

  const citiesAndAreas = useMemo(() => {
    return Object.values(LINKING_ARCHITECTURE)
      .filter((n) => n.type === "city" || n.type === "cluster")
      .map((n) => ({ label: n.name, href: n.url }));
  }, []);

  const blogItems = useMemo(() => posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` })), []);

  const norm = (s: string) => s.toLowerCase();
  const query = norm(q.trim());

  const filter = (items: { label: string; href: string }[]) =>
    !query ? [] : items.filter((i) => norm(i.label).includes(query));

  const pageResults = filter(sitePages);
  const cityResults = filter(citiesAndAreas);
  const blogResults = filter(blogItems);

  const hasAny = pageResults.length + cityResults.length + blogResults.length > 0;

  return (
    <>
      <section className="pt-24 pb-10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Search</h1>
          <p className="text-white/60 mb-6">Find pages, service areas, and helpful blog posts.</p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to search (e.g. Glendale, refacing, quote)"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FF8A3D]/50 focus:ring-1 focus:ring-[#FF8A3D]/50"
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Cities & Areas</h2>
            {cityResults.length === 0 && <p className="text-white/40 text-sm">{query ? "No matches." : "Start typing to see results."}</p>}
            <ul className="space-y-2">
              {cityResults.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="block p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-[#FF8A3D] transition-colors">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Pages</h2>
            {pageResults.length === 0 && <p className="text-white/40 text-sm">{query ? "No matches." : "Start typing to see results."}</p>}
            <ul className="space-y-2">
              {pageResults.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="block p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-[#FF8A3D] transition-colors">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Blog</h2>
          {blogResults.length === 0 && <p className="text-white/40 text-sm">{query ? "No matches." : "Start typing to see results."}</p>}
          <ul className="space-y-2">
            {blogResults.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="block p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-[#FF8A3D] transition-colors">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {!hasAny && query && (
          <div className="max-w-3xl mx-auto px-4 mt-12">
            <p className="text-white/50">No results. Try a different keyword like "refacing" or a city name.</p>
          </div>
        )}
      </section>
    </>
  );
}
