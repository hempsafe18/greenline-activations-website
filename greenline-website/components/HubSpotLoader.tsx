"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// HubSpot embed adds live chat + popup lead forms that can cover the
// checkout CTA. Don't load HS on commerce pages (cart / order success)
// or on the ambassador application page (custom API form — HS tracking
// script auto-captures matching fields and creates duplicate submissions).
const SUPPRESSED_PREFIXES = ["/cart", "/order/", "/brand-ambassador-application"];

export default function HubSpotLoader() {
  const pathname = usePathname() ?? "";
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));
  if (suppressed) return null;
  return (
    <Script
      id="hs-script-loader"
      src="//js.hs-scripts.com/47886643.js"
      strategy="afterInteractive"
    />
  );
}
