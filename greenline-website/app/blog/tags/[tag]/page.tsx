import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts } from "@/lib/blog-api";

export const dynamicParams = false;

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  featured_image_url: string;
  publish_date: string;
  author: string;
  tags: string[];
}

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts().catch(() => []);
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  if (tags.length === 0) return [{ tag: "_" }];
  return tags.map((t) => ({ tag: encodeURIComponent(t) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${decodeURIComponent(tag)} · The Activation`,
    description: `Field marketing posts tagged ${decodeURIComponent(tag)}.`,
    robots: { index: true, follow: true },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  if (tag === "_") notFound();
  const decoded = decodeURIComponent(tag);

  const allPosts = await getAllBlogPosts().catch(() => []);
  const posts = allPosts.filter(
    (p) => p.tags?.map((t) => encodeURIComponent(t)).includes(tag)
  ) as BlogPost[];

  if (posts.length === 0) notFound();

  return (
    <>
      <section className="section bg-cream">
        <div className="container-lg">
          <Link
            href="/blog/"
            className="eyebrow hover:text-green transition-colors mb-6 inline-flex items-center gap-1"
            data-testid="tag-page-back"
          >
            ← The Activation
          </Link>
          <span className="tag mt-4 mb-4 inline-block">Tag</span>
          <h1 className="text-5xl font-bold text-dark mt-2 mb-3 leading-tight">
            {decoded}
          </h1>
          <p className="text-lg font-body text-gray-600 max-w-2xl">
            {posts.length} {posts.length === 1 ? "post" : "posts"} tagged "{decoded}".
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-lg">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="tag-page-posts">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}/`}
                className="card card-hover flex flex-col group bg-white"
              >
                {post.featured_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover border-b-2 border-ink -mx-8 -mt-8 mb-6 w-[calc(100%+4rem)]"
                  />
                )}
                <p className="eyebrow mb-3">
                  {new Date(post.publish_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-xl font-display font-bold text-dark leading-snug group-hover:text-green transition-colors mb-3">
                  {post.title}
                </h2>
                {post.meta_description && (
                  <p className="font-body text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                    {post.meta_description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
