import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Greenline Activations | Florida Field Marketing for Beverage Brands",
    template: "%s | Greenline Activations",
  },
  description:
    "Greenline Activations is a brand activation agency for hemp and functional beverage brands. Field marketing, sampling, and retail execution across Florida.",
  openGraph: {
    siteName: "Greenline Activations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          id="hs-script-loader"
          src="//js.hs-scripts.com/47886643.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
