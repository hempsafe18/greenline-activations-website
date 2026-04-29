/**
 * Internal blog API client for the public site (server components only).
 * Replaces the previous Contentful integration.
 */

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8001";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  seo_title: string;
  meta_description: string;
  featured_image_url: string;
  publish_date: string;
  author: string;
  body_html: string;
  tags: string[];
  status: "draft" | "published";
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND}${path}`, {
    cache: "force-cache",
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchJson<{ posts: BlogPost[] }>("/api/blog/posts");
  return data.posts;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    return await fetchJson<BlogPost>(`/api/blog/posts/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}
