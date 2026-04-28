import { Client } from "@hubspot/api-client";

// Portal ID for the Greenline Activations HubSpot account
export const HUBSPOT_PORTAL_ID = "47886643";

function getClient() {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not set");
  return new Client({ accessToken: token });
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  featuredImageUrl: string | null;
  publishDate: string;
  authorName: string;
  htmlBody: string;
  tagNames: string[];
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const client = getClient();
  const posts: BlogPost[] = [];
  let after: string | undefined;

  do {
    // getPage(createdAt, createdAfter, createdBefore, updatedAt, updatedAfter,
    //         updatedBefore, sort, after, limit, archived, property)
    const res = await client.cms.blogs.blogPosts.basicApi.getPage(
      undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, after, 100, false
    );
    for (const p of res.results) {
      posts.push(normalizeBlogPost(p));
    }
    after = res.paging?.next?.after;
  } while (after);

  return posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBlogPost(p: any): BlogPost {
  const rawSlug: string = p.slug ?? p.url ?? p.id;
  // HubSpot slugs may come back as "/blog/my-post" — strip the prefix
  const slug = rawSlug.replace(/^\/?blog\//, "").replace(/^\//, "");

  return {
    id: String(p.id),
    slug,
    title: p.title ?? "",
    metaDescription: p.metaDescription ?? p.postSummary ?? "",
    featuredImageUrl: p.featuredImage ?? p.featuredImageAltText ?? null,
    publishDate: p.publishDate ?? p.created ?? new Date().toISOString(),
    authorName: p.blogAuthorId ? (p.authorName ?? "Greenline") : "Greenline",
    htmlBody: p.postBody ?? p.htmlBody ?? "",
    tagNames: (p.tagIds ?? []).map(String),
  };
}
