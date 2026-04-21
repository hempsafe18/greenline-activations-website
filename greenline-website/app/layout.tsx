import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import HubSpotLoader from "@/components/HubSpotLoader";

export const metadata: Metadata = {
  title: {
    default: "Greenline Activations · Retail Activations. Add to Cart.",
    template: "%s · Greenline Activations",
  },
  description:
    "Productized field marketing for hemp and functional beverage brands. Build your sprint, checkout with Stripe, and ship ambassadors to Florida retail — no proposals, no long-term contracts.",
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
      <body className="bg-bone text-ink">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <HubSpotLoader />
      </body>
    </html>
  );
}
