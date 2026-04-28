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
  // With output:export, an empty array causes a build error; use a placeholder
  // that will resolve to notFound() at runtime when no posts are available.
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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/blog/"
        className="text-sm font-mono text-ink/50 hover:text-canopy transition-colors mb-8 inline-block"
      >
        ← All posts
      </Link>

      {post.featuredImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featuredImageUrl}
          alt={post.title}
          className="w-full rounded-xl border-2 border-ink mb-8 object-cover max-h-80"
        />
      )}

      <h1 className="text-4xl font-black uppercase tracking-tight leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-ink/50 font-mono mb-10 border-b-2 border-ink/10 pb-6">
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

      <article
        className="prose prose-lg prose-neutral max-w-none
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
          prose-a:text-canopy prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.htmlBody }}
      />
    </div>
  );
}
