import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/hubspot";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Field marketing insights, retail activation strategies, and brand ambassador tips from the Greenline team.",
};

export default async function BlogIndexPage() {
  let posts = await getAllBlogPosts().catch(() => []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-black uppercase tracking-tight mb-2">
        Blog
      </h1>
      <p className="text-ink/60 mb-12 text-lg">
        Retail activation playbooks, field marketing insights, and brand ambassador tips.
      </p>

      {posts.length === 0 ? (
        <p className="text-ink/50 text-center py-24">No posts yet — check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}/`}
              className="group border-2 border-ink rounded-xl overflow-hidden hover:shadow-[4px_4px_0px_0px_#1a1a1a] transition-shadow"
            >
              {post.featuredImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <p className="text-xs text-ink/50 mb-2 font-mono">
                  {new Date(post.publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-xl font-bold leading-snug group-hover:text-canopy transition-colors mb-2">
                  {post.title}
                </h2>
                {post.metaDescription && (
                  <p className="text-ink/60 text-sm line-clamp-3">
                    {post.metaDescription}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
