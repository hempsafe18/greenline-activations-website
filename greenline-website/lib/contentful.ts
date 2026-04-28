import { createClient } from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

function getClient() {
  const token = process.env.CONTENT_DELIVERY_API;
  if (!token) throw new Error("CONTENT_DELIVERY_API is not set");
  return createClient({ space: "65dz8hzh0q86", accessToken: token });
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(entry: any): BlogPost {
  const f = entry.fields;
  const img = f.featuredImage?.fields?.file?.url
    ? `https:${f.featuredImage.fields.file.url}`
    : null;

  const htmlBody =
    f.body && typeof f.body === "object"
      ? documentToHtmlString(f.body)
      : String(f.body ?? "");

  return {
    id: entry.sys.id,
    slug: f.slug ?? entry.sys.id,
    title: f.title ?? "",
    metaDescription: f.excerpt ?? "",
    featuredImageUrl: img,
    publishDate: f.publishDate ?? entry.sys.createdAt,
    authorName: f.author ?? "Greenline",
    htmlBody,
    tagNames: f.tags ?? [],
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const res = await getClient().getEntries({
    content_type: "blogPost",
    order: ["-fields.publishDate"],
    limit: 100,
  });
  return res.items.map(normalize);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await getClient().getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });
  if (!res.items.length) return null;
  return normalize(res.items[0]);
}
