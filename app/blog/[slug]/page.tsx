import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import { posts } from "@/lib/blogPosts";
import { notFound } from "next/navigation";
import { CTAButton } from "../../components/CTAButton";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post not found | Vulpine Blog" };
  return {
    title: `${post.title} | Vulpine Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navigation />

      <article className="pt-20 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <div className="text-white/60 text-sm mb-2">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
            <p className="text-white/80">{post.excerpt}</p>
          </header>

          <div className="prose prose-invert max-w-none">
            {post.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-10">
            <CTAButton className="text-lg" />
          </div>
        </div>
      </article>
    </main>
  );
}
