import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "The Activation",
  description:
    "Field marketing insights, retail activation strategies, and brand ambassador tips from the Greenline team.",
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts().catch(() => []);

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
          {posts.length === 0 ? (
            <div className="text-center py-24 border-2 border-ink bg-white">
              <p className="text-2xl font-display font-bold text-dark mb-2">No posts yet</p>
              <p className="text-gray-500 font-body">Check back soon — new content is on the way.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
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
                </Link>
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
