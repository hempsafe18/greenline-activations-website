"use client";

// Single shell page for all blog routes.
// Vercel rewrites /blog/:path+ → /blog/ so this file handles both
// the listing (/blog/) and individual posts (/blog/my-post/).
// Slug is read from window.location so no dynamic route params are needed.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug, type BlogPost } from "@/lib/hubspot";

export default function BlogPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    // parts = ["blog"] → listing; ["blog", "my-post"] → post
    setSlug(parts.length > 1 ? parts[parts.length - 1] : null);
    setReady(true);
  }, []);

  if (!ready) return null;
  return slug ? <BlogPost slug={slug} /> : <BlogListing />;
}

// ─── Listing ──────────────────────────────────────────────────────────────────

function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    getAllBlogPosts()
      .then(setPosts)
      .catch((e) => { console.error("[blog]", e); setFetchError(String(e)); setPosts([]); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="section bg-cream">
        <div className="container-lg">
          <span className="tag mb-4">Field Marketing Insights</span>
          <h1 className="text-5xl font-bold text-dark mt-4 mb-4 leading-tight">
            The <span className="text-green">Activation</span>
          </h1>
          <p className="text-xl font-body text-gray-600 leading-relaxed max-w-2xl">
            Retail activation playbooks, ambassador program tips, and field marketing
            strategy for hemp and functional beverage brands.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-lg">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-64 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 border-2 border-ink bg-white">
              <p className="text-2xl font-display font-bold text-dark mb-2">No posts yet</p>
              <p className="text-gray-500 font-body">Check back soon — new content is on the way.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}/`}
                  className="card card-hover flex flex-col group bg-white"
                >
                  {post.featuredImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover border-b-2 border-ink -mx-8 -mt-8 mb-6 w-[calc(100%+4rem)]"
                    />
                  )}
                  <div className="flex flex-col flex-1">
                    <p className="eyebrow mb-3">
                      {new Date(post.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <h2 className="text-xl font-display font-bold text-dark leading-snug group-hover:text-green transition-colors mb-3">
                      {post.title}
                    </h2>
                    {post.metaDescription && (
                      <p className="font-body text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                        {post.metaDescription}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 font-display font-bold text-sm text-green uppercase tracking-wide">
                      Read post
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-dark text-white text-center">
        <div className="container-lg max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Activate?</h2>
          <p className="text-gray-300 font-body mb-8 text-lg">
            Build your sprint, checkout with Stripe, and get ambassadors in Florida retail — no proposals, no long-term contracts.
          </p>
          <Link href="/sprints" className="btn-coral">
            See Pricing & Build a Sprint
          </Link>
        </div>
      </section>
    </>
  );
}

// ─── Post ─────────────────────────────────────────────────────────────────────

function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPostBySlug(slug)
      .then((p) => {
        if (!p) window.location.replace("/blog/");
        else setPost(p);
      })
      .catch(() => window.location.replace("/blog/"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="section">
        <div className="container-lg max-w-3xl space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-12 w-2/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        </div>
      </section>
    );
  }

  if (!post) return null;

  return (
    <>
      <section className="section bg-cream">
        <div className="container-lg max-w-3xl">
          <a
            href="/blog/"
            className="eyebrow hover:text-green transition-colors mb-6 inline-flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            The Activation
          </a>

          <span className="tag mb-4 block mt-4">The Activation</span>

          <h1 className="text-4xl md:text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 font-body text-sm text-gray-500">
            <span>{post.authorName}</span>
            <span>·</span>
            <span>
              {new Date(post.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {post.featuredImageUrl && (
        <div className="px-4">
          <div className="container-lg max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full border-2 border-ink shadow-brutal object-cover max-h-96"
            />
          </div>
        </div>
      )}

      <section className="section">
        <div className="container-lg max-w-3xl">
          <article
            className="prose prose-lg prose-neutral max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-dark
              prose-a:text-green prose-a:no-underline hover:prose-a:underline
              prose-img:border-2 prose-img:border-ink prose-img:shadow-brutal"
            dangerouslySetInnerHTML={{ __html: post.htmlBody }}
          />

          <div className="mt-16 pt-8 border-t-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <a href="/blog/" className="btn-secondary text-sm">
              ← The Activation
            </a>
            <Link href="/sprints" className="btn-canopy text-sm">
              Build a Sprint →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
