import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog-api";

export const dynamic = "force-dynamic";

const BASE = "https://greenlineactivations.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const blogPosts = await getAllBlogPosts().catch(() => []);
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}/`,
    lastModified: new Date(p.publish_date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/sprints/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    ...blogEntries,
    { url: `${BASE}/pilot-program/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/retail-activation-roi-calculator/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/schedule-an-intro-call/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/ambassador-rewards-program/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/brand-ambassador-opportunities/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/brand-ambassador-application/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/florida-retail-activation-checklist/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy-policy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms-and-conditions/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
