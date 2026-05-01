import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart/", "/order/", "/admin/"] },
    sitemap: "https://www.greenlineactivations.com/sitemap.xml",
  };
}
