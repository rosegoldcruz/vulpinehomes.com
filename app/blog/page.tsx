import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Link from "next/link";
import { posts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog | Cabinet Refacing Tips & Kitchen Planning | Vulpine Homes",
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF8A3D] transition-colors"
            >
              <div className="text-white/60 text-sm mb-2">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FF8A3D]">{post.title}</h2>
              <p className="text-white/80">{post.excerpt}</p>
              <div className="mt-3 text-[#FF8A3D] font-semibold">Read more →</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
