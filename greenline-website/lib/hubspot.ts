import { XMLParser } from "fast-xml-parser";

// HubSpot strips non-browser requests — spoof a real UA so the CDN allows through
const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; Next.js/15 build; +https://greenlineactivations.com)",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
};

// HubSpot blogs can serve RSS from several paths; try in order
const RSS_CANDIDATES = [
  "https://blog.greenlineactivations.com/rss.xml",
  "https://blog.greenlineactivations.com/blog/rss.xml",
  "https://blog.greenlineactivations.com/feed",
];

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

async function fetchRss(): Promise<string> {
  for (const url of RSS_CANDIDATES) {
    try {
      const res = await fetch(url, { headers: FETCH_HEADERS, cache: "force-cache" });
      if (res.ok) {
        const text = await res.text();
        // Sanity-check: must look like XML
        if (text.trimStart().startsWith("<")) return text;
        console.warn(`[blog] ${url} returned non-XML (${res.status})`);
      } else {
        console.warn(`[blog] ${url} → ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.warn(`[blog] ${url} fetch error:`, err);
    }
  }
  throw new Error("[blog] All RSS candidates failed — check HubSpot blog domain settings");
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const xml = await fetchRss();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    isArray: (name) => name === "item" || name === "category",
  });
  const feed = parser.parse(xml);
  const items: RssItem[] = feed?.rss?.channel?.item ?? [];

  if (items.length === 0) {
    console.warn("[blog] RSS parsed OK but contained 0 items");
  }

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
      publishDate: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
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

// https://blog.greenlineactivations.com/blog/my-post  →  my-post
function slugFromUrl(url: string): string {
  return url
    .replace(/^https?:\/\/[^/]+\/blog\//, "")
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/\/$/, "");
}

function firstImgSrc(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
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
