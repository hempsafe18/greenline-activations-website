import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import PublicChrome from "@/components/PublicChrome";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "Greenline Activations | Brand Activation Agency for Beverage & Hemp Brands",
    template: "%s | Greenline Activations",
  },
  description:
    "Greenline Activations deploys HempSafe-certified brand ambassadors for hemp, THC, and adult beverage brands. Pick your tier, checkout online, and ship trained staff to Florida retail — no contracts, no proposals. 30% avg. sample-to-purchase conversion.",
  openGraph: {
    siteName: "Greenline Activations",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@GreenlineActiv",
  },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Greenline Activations",
  url: "https://www.greenlineactivations.com",
  logo: "https://www.greenlineactivations.com/logo.png",
  description:
    "Productized brand activation agency for hemp, THC beverage, and adult beverage brands in Florida.",
  areaServed: { "@type": "State", "name": "Florida" },
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bone text-ink">
        <JsonLd data={ORG_SCHEMA} />
        <CartProvider>
          <PublicChrome>{children}</PublicChrome>
        </CartProvider>
      </body>
    </html>
  );
}
