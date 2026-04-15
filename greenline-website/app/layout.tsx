import type { Metadata } from "next";
import "./globals.css";
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
      </body>
    </html>
  );
}
