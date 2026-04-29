import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import PublicChrome from "@/components/PublicChrome";

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
          <PublicChrome>{children}</PublicChrome>
        </CartProvider>
      </body>
    </html>
  );
}
