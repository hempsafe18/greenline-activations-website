import { API_BASE } from "./api";

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
  const res = await fetch(`${API_BASE}/api/blog/posts`);
  if (!res.ok) throw new Error(`Blog API ${res.status}`);
  const data = await res.json();
  return (data.posts ?? []) as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
