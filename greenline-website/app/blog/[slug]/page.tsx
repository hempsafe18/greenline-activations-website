import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/hubspot";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts().catch(() => []);
  // output:export requires at least one param; placeholder resolves to notFound()
  if (posts.length === 0) return [{ slug: "_" }];
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription || undefined,
    openGraph: post.featuredImageUrl
      ? { images: [{ url: post.featuredImageUrl }] }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg max-w-3xl">
          <Link
            href="/blog/"
            className="eyebrow hover:text-green transition-colors mb-6 inline-flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All posts
          </Link>

          <span className="tag mb-4">Blog</span>

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

      {/* Featured image */}
      {post.featuredImageUrl && (
        <div className="container-lg max-w-3xl px-4 -mt-4 mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full border-2 border-ink shadow-brutal object-cover max-h-96"
          />
        </div>
      )}

      {/* Body */}
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
            <Link href="/blog/" className="btn-secondary text-sm">
              ← Back to Blog
            </Link>
            <Link href="/sprints" className="btn-canopy text-sm">
              Build a Sprint →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
