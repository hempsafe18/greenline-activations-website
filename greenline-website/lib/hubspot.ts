import { XMLParser } from "fast-xml-parser";

const BLOG_RSS = "https://blog.greenlineactivations.com/rss.xml";

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

// Extract slug from a full HubSpot blog URL:
// https://blog.greenlineactivations.com/blog/my-post → my-post
function slugFromUrl(url: string): string {
  return url.replace(/^https?:\/\/[^/]+\/blog\//, "").replace(/\/$/, "");
}

// Pull the first <img src> out of an HTML string (used as fallback featured image)
function firstImgSrc(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(BLOG_RSS, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    // Treat these as arrays even when there's only one item
    isArray: (name) => name === "item" || name === "category",
  });
  const feed = parser.parse(xml);
  const items: RssItem[] = feed?.rss?.channel?.item ?? [];

  return items.map((item) => {
    const url = typeof item.link === "string" ? item.link : String(item.link ?? "");
    const slug = slugFromUrl(url);
    const htmlBody: string = item["content:encoded"] ?? item.description ?? "";
    const mediaUrl: string | null =
      item["media:content"]?.["@_url"] ??
      item.enclosure?.["@_url"] ??
      firstImgSrc(htmlBody);

    const categories = item.category ?? [];
    const tagNames = (Array.isArray(categories) ? categories : [categories])
      .map(String)
      .filter(Boolean);

    return {
      id: slug || url,
      slug,
      title: item.title ?? "",
      metaDescription: stripHtml(item.description ?? "").slice(0, 300),
      featuredImageUrl: mediaUrl,
      publishDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      authorName: item["dc:creator"] ?? item.author ?? "Greenline",
      htmlBody,
      tagNames,
    };
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  "content:encoded"?: string;
  "dc:creator"?: string;
  author?: string;
  category?: string | string[];
  "media:content"?: { "@_url"?: string };
  enclosure?: { "@_url"?: string };
}
