import type { MetadataRoute } from "next";

const BASE = "https://greenlineactivations.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-04-21");
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/sprints/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
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
