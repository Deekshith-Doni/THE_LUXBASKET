import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CartDrawer from "@/components/cart/CartDrawer";
import SessionProvider from "@/components/providers/SessionProvider";
import { auth } from "@/lib/auth";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "The LuxBasket | Premium Luxury Gifting",
    template: "%s | The LuxBasket",
  },
  description:
    "India's most premium gifting brand. Luxury hampers, corporate gifts, wedding return gifts, festive hampers & customized gifts. Crafted with love, delivered with elegance.",
  keywords: [
    "luxury gifts",
    "premium hampers",
    "corporate gifting",
    "wedding return gifts",
    "festive hampers",
    "customized gifts",
    "gift baskets India",
    "The LuxBasket",
  ],
  authors: [{ name: "The LuxBasket" }],
  creator: "The LuxBasket",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "The LuxBasket",
    title: "The LuxBasket | Premium Luxury Gifting",
    description:
      "India's most premium gifting brand. Luxury hampers, corporate gifts, wedding return gifts & customized gifts.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The LuxBasket | Premium Luxury Gifting",
    description: "India's most premium gifting brand.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-ivory font-body antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#2B2B2B",
                color: "#F8F5F0",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                borderRadius: "0",
                border: "1px solid #D4AF37",
              },
              success: {
                iconTheme: { primary: "#D4AF37", secondary: "#2B2B2B" },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
