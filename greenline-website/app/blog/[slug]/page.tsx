import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/blog-api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo_title || post.title,
    description: post.meta_description || undefined,
    openGraph: post.featured_image_url
      ? { images: [{ url: post.featured_image_url }] }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <section className="section bg-cream">
        <div className="container-lg max-w-3xl">
          <Link
            href="/blog/"
            className="eyebrow hover:text-green transition-colors mb-6 inline-flex items-center gap-1"
            data-testid="back-to-activation-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            The Activation
          </Link>

          <span className="tag mb-4 block mt-4">The Activation</span>

          <h1 className="text-4xl md:text-5xl font-bold text-dark mt-4 mb-6 leading-tight" data-testid="blog-post-title">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 font-body text-sm text-gray-500" data-testid="blog-post-meta">
            <span>{post.author}</span>
            <span>·</span>
            <span>
              {new Date(post.publish_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5" data-testid="blog-post-tags">
              {post.tags.map((t) => (
                <span key={t} className="tag-ink">{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {post.featured_image_url && (
        <div className="px-4">
          <div className="container-lg max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featured_image_url}
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
            dangerouslySetInnerHTML={{ __html: post.body_html }}
            data-testid="blog-post-body"
          />

          <div className="mt-16 pt-8 border-t-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/blog/" className="btn-secondary text-sm" data-testid="blog-post-back-button">
              ← The Activation
            </Link>
            <Link href="/sprints" className="btn-canopy text-sm" data-testid="blog-post-cta-button">
              Build a Sprint →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
